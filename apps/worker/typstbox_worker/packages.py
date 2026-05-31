from fastapi import HTTPException

from .config import ALLOWED_PACKAGES
from .models import Project


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


def package_import_lines(project: Project) -> list[str]:
    lines: list[str] = []
    for pkg in project.packages:
        lines.append(f'#import "{pkg.name}:{pkg.version}"')
    return lines
