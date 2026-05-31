import re

from fastapi import HTTPException

from .config import ALLOWED_PACKAGES
from .models import Project

_IMPORT_RE = re.compile(
    r'#import\s+"([^"]+)"|#import\s+(@[^\s:]+:[^\s"]+)',
)


def validate_packages(project: Project) -> None:
    for pkg in project.packages:
        allowed_versions = ALLOWED_PACKAGES.get(pkg.name)
        if not allowed_versions:
            raise HTTPException(
                status_code=403,
                detail={
                    "code": "403_PACKAGE_NOT_ALLOWED",
                    "message": f"Package {pkg.name} is not on the allowlist",
                },
            )
        if pkg.version not in allowed_versions:
            raise HTTPException(
                status_code=403,
                detail={
                    "code": "403_PACKAGE_NOT_ALLOWED",
                    "message": f"Version {pkg.version} of {pkg.name} is not allowed",
                },
            )


def scan_source_imports(project: Project) -> None:
    """Reject non-allowlisted #import directives in Typst source."""
    for f in project.files:
        if not f.path.endswith(".typ"):
            continue
        for match in _IMPORT_RE.finditer(f.content):
            spec = match.group(1) or match.group(2)
            if not spec:
                continue
            if spec.startswith("@"):
                parts = spec.split(":")
                name = parts[0]
                version = parts[1] if len(parts) > 1 else None
            else:
                name = spec
                version = None
            allowed = ALLOWED_PACKAGES.get(name)
            if not allowed:
                raise HTTPException(
                    status_code=403,
                    detail={
                        "code": "403_PACKAGE_NOT_ALLOWED",
                        "message": f"Import {name} is not on the allowlist",
                    },
                )
            if version and version not in allowed:
                raise HTTPException(
                    status_code=403,
                    detail={
                        "code": "403_PACKAGE_NOT_ALLOWED",
                        "message": f"Version {version} of {name} is not allowed",
                    },
                )


def package_import_lines(project: Project) -> list[str]:
    lines: list[str] = []
    for pkg in project.packages:
        lines.append(f'#import "{pkg.name}:{pkg.version}"')
    return lines
