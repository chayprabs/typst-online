import base64
import json
import re
import shutil
import subprocess
import uuid
from pathlib import Path

from fastapi import HTTPException

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
from .models import CompileResult, Diagnostic, Project
from .packages import package_import_lines, validate_packages

_DIAG_RE = re.compile(
    r"^(?P<file>[^:]+):(?P<line>\d+):(?P<col>\d+):\s*(?P<severity>error|warning):\s*(?P<msg>.+)$",
    re.MULTILINE,
)


def ensure_dirs() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    PROJECTS_DIR.mkdir(parents=True, exist_ok=True)


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
        target = work_dir / f.path
        target.parent.mkdir(parents=True, exist_ok=True)
        if f.content.startswith("data:") and ";base64," in f.content:
            _, b64 = f.content.split(";base64,", 1)
            target.write_bytes(base64.b64decode(b64))
        else:
            target.write_text(f.content, encoding="utf-8")

    for font in project.fonts:
        if font.contentBase64:
            font_path = work_dir / font.path
            font_path.parent.mkdir(parents=True, exist_ok=True)
            font_path.write_bytes(base64.b64decode(font.contentBase64))

    main = project.mainPath
    if not main:
        candidates = [f.path for f in project.files if f.path.endswith(".typ")]
        if not candidates:
            raise HTTPException(status_code=400, detail="NO_MAIN_TYP_FILE")
        main = candidates[0]

    main_path = work_dir / main
    if not main_path.exists():
        raise HTTPException(status_code=400, detail="MAIN_FILE_NOT_FOUND")

    pkg_lines = package_import_lines(project)
    if pkg_lines:
        existing = main_path.read_text(encoding="utf-8")
        if not existing.lstrip().startswith("#import"):
            main_path.write_text("\n".join(pkg_lines) + "\n" + existing, encoding="utf-8")

    return main_path


def _parse_diagnostics(stderr: str, stdout: str) -> list[Diagnostic]:
    diagnostics: list[Diagnostic] = []
    for text in (stderr, stdout):
        for match in _DIAG_RE.finditer(text):
            diagnostics.append(
                Diagnostic(
                    file=match.group("file"),
                    line=int(match.group("line")),
                    column=int(match.group("col")),
                    severity=match.group("severity"),
                    message=match.group("msg").strip(),
                )
            )
    if not diagnostics and stderr.strip():
        diagnostics.append(
            Diagnostic(
                file="",
                line=1,
                column=1,
                severity="error",
                message=stderr.strip()[:500],
            )
        )
    return diagnostics


def compile_project(
    project: Project,
    output_format: str = "pdf",
    page_range: str | None = None,
    lint_only: bool = False,
) -> CompileResult:
    ensure_dirs()
    _validate_project(project)

    job_id = str(uuid.uuid4())
    work_dir = PROJECTS_DIR / job_id
    artifact_dir = ARTIFACTS_DIR / job_id
    artifact_dir.mkdir(parents=True, exist_ok=True)

    try:
        main_path = _write_project(project, work_dir)
        typst = _typst_binary(project.compilerVersion)

        if lint_only:
            cmd = [typst, "compile", str(main_path), "/dev/null"]
        else:
            ext = {"pdf": "pdf", "svg": "svg", "png": "png", "html": "html"}.get(
                output_format, "pdf"
            )
            out_file = artifact_dir / f"output.{ext}"
            cmd = [typst, "compile", str(main_path), str(out_file)]
            if page_range and output_format in ("svg", "png"):
                cmd.extend(["--pages", page_range])

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

        outputs = []
        if output_format == "pdf":
            out = artifact_dir / "output.pdf"
            if out.exists():
                outputs.append(
                    {
                        "format": "pdf",
                        "url": f"/v1/artifacts/{job_id}/output.pdf",
                        "pageCount": None,
                    }
                )
        elif output_format in ("svg", "png"):
            pages = sorted(artifact_dir.glob(f"output*.{output_format}"))
            if not pages:
                single = artifact_dir / f"output.{output_format}"
                if single.exists():
                    pages = [single]
            for i, page in enumerate(pages, start=1):
                outputs.append(
                    {
                        "format": output_format,
                        "url": f"/v1/artifacts/{job_id}/{page.name}",
                        "pageCount": i,
                    }
                )
        elif output_format == "html":
            out = artifact_dir / "output.html"
            if out.exists():
                outputs.append(
                    {"format": "html", "url": f"/v1/artifacts/{job_id}/output.html"}
                )

        if not outputs and not lint_only:
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

        from .models import CompileOutput

        return CompileResult(
            ok=True,
            outputs=[CompileOutput(**o) for o in outputs],
            diagnostics=diagnostics,
        )
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
    return [{"version": v, "label": f"Typst {v}", "default": v == PINNED_VERSIONS[0]} for v in PINNED_VERSIONS]


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
        meta = {
            "compilerVersion": project.compilerVersion,
            "packages": [p.model_dump() for p in project.packages],
        }
        zf.writestr("typstbox.json", json.dumps(meta, indent=2))
    return buf.getvalue(), f"{project.id}.zip"
