import base64
import json
import re
import shutil
import subprocess
import uuid
from pathlib import Path

from fastapi import HTTPException

from .cleanup import cleanup_expired_artifacts
from .config import (
    ALLOWED_PACKAGES,
    ARTIFACTS_DIR,
    COMPILE_TIMEOUT_SECONDS,
    MAX_FILES,
    MAX_PROJECT_BYTES,
    PINNED_VERSIONS,
    PROJECTS_DIR,
    TYPST_BIN_DIR,
)
from .models import CompileOutput, CompileResult, Diagnostic, Project
from .packages import package_import_lines, scan_source_imports, validate_packages

_DIAG_RE = re.compile(
    r"^(?P<file>[^:]+):(?P<line>\d+):(?P<col>\d+):\s*(?P<severity>error|warning):\s*(?P<msg>.+)$",
    re.MULTILINE,
)

ALLOWED_FORMATS = frozenset({"pdf", "svg", "png", "html"})


def ensure_dirs() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    PROJECTS_DIR.mkdir(parents=True, exist_ok=True)
    cleanup_expired_artifacts()


def _safe_path(work_dir: Path, relative: str) -> Path:
    target = (work_dir / relative).resolve()
    root = work_dir.resolve()
    if not target.is_relative_to(root):
        raise HTTPException(status_code=400, detail="INVALID_FILE_PATH")
    return target


def _project_size(project: Project) -> int:
    total = 0
    for f in project.files:
        total += len(f.content.encode("utf-8"))
        if f.path.endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")) and "base64," in f.content:
            total += len(f.content) // 2
    for font in project.fonts:
        if font.contentBase64:
            total += len(font.contentBase64)
    return total


def _validate_project(project: Project) -> None:
    if len(project.files) > MAX_FILES:
        raise HTTPException(status_code=413, detail="413_PROJECT_TOO_LARGE")
    if _project_size(project) > MAX_PROJECT_BYTES:
        raise HTTPException(status_code=413, detail="413_PROJECT_TOO_LARGE")
    if project.compilerVersion not in PINNED_VERSIONS:
        raise HTTPException(status_code=400, detail="INVALID_COMPILER_VERSION")
    validate_packages(project)
    scan_source_imports(project)


def _typst_binary(version: str) -> str:
    versioned = TYPST_BIN_DIR / f"typst-{version}"
    if versioned.exists():
        return str(versioned)
    default = TYPST_BIN_DIR / "typst"
    if default.exists():
        return str(default)
    found = shutil.which("typst")
    if found:
        return found
    raise HTTPException(
        status_code=503,
        detail="Typst compiler not installed on worker",
    )


def _write_project(project: Project, work_dir: Path) -> Path:
    work_dir.mkdir(parents=True, exist_ok=True)
    for f in project.files:
        target = _safe_path(work_dir, f.path)
        target.parent.mkdir(parents=True, exist_ok=True)
        if f.content.startswith("data:") and ";base64," in f.content:
            _, b64 = f.content.split(";base64,", 1)
            target.write_bytes(base64.b64decode(b64))
        else:
            target.write_text(f.content, encoding="utf-8")

    font_dir = work_dir / "fonts"
    for font in project.fonts:
        if font.contentBase64:
            font_path = _safe_path(work_dir, font.path)
            font_path.parent.mkdir(parents=True, exist_ok=True)
            font_path.write_bytes(base64.b64decode(font.contentBase64))

    main = project.mainPath
    if not main:
        candidates = [f.path for f in project.files if f.path.endswith(".typ")]
        if not candidates:
            raise HTTPException(status_code=400, detail="NO_MAIN_TYP_FILE")
        main = candidates[0]

    main_path = _safe_path(work_dir, main)
    if not main_path.exists():
        raise HTTPException(status_code=400, detail="MAIN_FILE_NOT_FOUND")

    pkg_lines = package_import_lines(project)
    existing = main_path.read_text(encoding="utf-8")
    prefix_lines: list[str] = []
    if pkg_lines and not existing.lstrip().startswith("#import"):
        prefix_lines.extend(pkg_lines)
    if project.fontFallbackChain and "#set text(font:" not in existing:
        fonts = ", ".join(f'"{f}"' for f in project.fontFallbackChain)
        prefix_lines.append(f"#set text(font: ({fonts}))")
    if prefix_lines:
        main_path.write_text("\n".join(prefix_lines) + "\n" + existing, encoding="utf-8")

    return main_path


_TYPST13_HEAD_RE = re.compile(r"^(?P<severity>error|warning):\s*(?P<msg>.+)$", re.MULTILINE)
_TYPST13_LOC_RE = re.compile(r"┌─\s*(?P<file>[^:]+):(?P<line>\d+):(?P<col>\d+)")


def _parse_diagnostics(stderr: str, stdout: str) -> list[Diagnostic]:
    diagnostics: list[Diagnostic] = []
    seen: set[tuple] = set()

    for text in (stderr, stdout):
        if not text.strip():
            continue

        for match in _DIAG_RE.finditer(text):
            key = (match.group("file"), match.group("line"), match.group("msg"))
            if key in seen:
                continue
            seen.add(key)
            diagnostics.append(
                Diagnostic(
                    file=match.group("file"),
                    line=int(match.group("line")),
                    column=int(match.group("col")),
                    severity=match.group("severity"),
                    message=match.group("msg").strip(),
                )
            )

        for head in _TYPST13_HEAD_RE.finditer(text):
            severity = head.group("severity")
            msg = head.group("msg").strip()
            block_end = text.find("\n\n", head.end())
            block = text[head.start() : block_end if block_end != -1 else len(text)]
            loc = _TYPST13_LOC_RE.search(block)
            file_name = loc.group("file") if loc else ""
            line_no = int(loc.group("line")) if loc else 1
            col_no = int(loc.group("col")) if loc else 1
            key = (file_name, line_no, msg)
            if key in seen:
                continue
            seen.add(key)
            diagnostics.append(
                Diagnostic(
                    file=file_name,
                    line=line_no,
                    column=col_no,
                    severity=severity,
                    message=msg,
                )
            )

    if not diagnostics and stderr.strip():
        first_line = stderr.strip().split("\n")[0]
        severity = "warning" if first_line.startswith("warning:") else "error"
        message = first_line.split(":", 1)[-1].strip() if ":" in first_line else stderr.strip()[:500]
        loc = _TYPST13_LOC_RE.search(stderr)
        diagnostics.append(
            Diagnostic(
                file=loc.group("file") if loc else "",
                line=int(loc.group("line")) if loc else 1,
                column=int(loc.group("col")) if loc else 1,
                severity=severity,
                message=message,
            )
        )
    return diagnostics


def _build_typst_cmd(
    typst: str,
    main_path: Path,
    output_format: str,
    out_path: Path,
    page_range: str | None,
    font_paths: list[Path],
    lint_only: bool,
) -> list[str]:
    if lint_only:
        return [typst, "compile", "-f", "pdf", str(main_path), "/dev/null"]

    cmd = [typst, "compile"]
    if output_format == "html":
        cmd.extend(["--features", "html"])
    cmd.extend(["-f", output_format, str(main_path), str(out_path)])

    if page_range:
        cmd.extend(["--pages", page_range])

    for fp in font_paths:
        cmd.extend(["--font-path", str(fp)])

    return cmd


def compile_project(
    project: Project,
    output_format: str = "pdf",
    page_range: str | None = None,
    lint_only: bool = False,
) -> CompileResult:
    ensure_dirs()
    _validate_project(project)

    if not lint_only and output_format not in ALLOWED_FORMATS:
        raise HTTPException(status_code=400, detail="INVALID_OUTPUT_FORMAT")

    job_id = str(uuid.uuid4())
    work_dir = PROJECTS_DIR / job_id
    artifact_dir = ARTIFACTS_DIR / job_id
    artifact_dir.mkdir(parents=True, exist_ok=True)

    try:
        main_path = _write_project(project, work_dir)
        typst = _typst_binary(project.compilerVersion)

        font_paths: list[Path] = []
        fonts_root = work_dir / "fonts"
        if fonts_root.exists():
            font_paths.append(fonts_root)

        if lint_only:
            out_file = artifact_dir / "lint.pdf"
        elif output_format in ("png", "svg"):
            out_file = artifact_dir / f"output-{{p}}.{output_format}"
        else:
            out_file = artifact_dir / f"output.{output_format}"

        cmd = _build_typst_cmd(
            typst, main_path, output_format, out_file, page_range, font_paths, lint_only
        )

        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=COMPILE_TIMEOUT_SECONDS,
            cwd=str(work_dir),
        )

        diagnostics = _parse_diagnostics(proc.stderr or "", proc.stdout or "")

        if proc.returncode != 0:
            return CompileResult(ok=False, diagnostics=diagnostics)

        if lint_only:
            return CompileResult(ok=True, diagnostics=diagnostics)

        outputs: list[CompileOutput] = []
        if output_format == "pdf":
            out = artifact_dir / "output.pdf"
            if out.exists():
                outputs.append(
                    CompileOutput(
                        format="pdf",
                        url=f"/v1/artifacts/{job_id}/output.pdf",
                    )
                )
        elif output_format in ("svg", "png"):
            pages = sorted(artifact_dir.glob(f"output*.{output_format}"))
            for i, page in enumerate(pages, start=1):
                outputs.append(
                    CompileOutput(
                        format=output_format,
                        url=f"/v1/artifacts/{job_id}/{page.name}",
                        pageCount=i,
                    )
                )
        elif output_format == "html":
            out = artifact_dir / "output.html"
            if out.exists():
                outputs.append(
                    CompileOutput(format="html", url=f"/v1/artifacts/{job_id}/output.html")
                )

        if not outputs:
            return CompileResult(
                ok=False,
                diagnostics=diagnostics
                or [
                    Diagnostic(
                        file="",
                        line=1,
                        column=1,
                        severity="error",
                        message="400_TYPST_COMPILE_ERROR: no output produced",
                    )
                ],
            )

        return CompileResult(ok=True, outputs=outputs, diagnostics=diagnostics)
    finally:
        shutil.rmtree(work_dir, ignore_errors=True)


def list_packages() -> list[dict]:
    return [
        {
            "name": name,
            "versions": versions,
            "description": f"Allowlisted Typst Universe package {name}",
        }
        for name, versions in ALLOWED_PACKAGES.items()
    ]


def list_versions() -> list[dict]:
    return [
        {"version": v, "label": f"Typst {v}", "default": v == PINNED_VERSIONS[0]}
        for v in PINNED_VERSIONS
    ]


def export_zip(project: Project) -> tuple[bytes, str]:
    import io
    import zipfile

    _validate_project(project)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in project.files:
            if f.content.startswith("data:") and ";base64," in f.content:
                _, b64 = f.content.split(";base64,", 1)
                zf.writestr(f.path, base64.b64decode(b64))
            else:
                zf.writestr(f.path, f.content)
        for font in project.fonts:
            if font.contentBase64:
                zf.writestr(font.path, base64.b64decode(font.contentBase64))
        meta = {
            "compilerVersion": project.compilerVersion,
            "packages": [p.model_dump() for p in project.packages],
            "fontFallbackChain": project.fontFallbackChain,
        }
        zf.writestr("typstbox.json", json.dumps(meta, indent=2))
    return buf.getvalue(), f"{project.id}.zip"
