import os
from pathlib import Path

ARTIFACT_TTL_SECONDS = int(os.getenv("ARTIFACT_TTL_SECONDS", "3600"))
MAX_PROJECT_BYTES = int(os.getenv("MAX_PROJECT_BYTES", str(5 * 1024 * 1024)))
MAX_FILES = int(os.getenv("MAX_FILES", "50"))
COMPILE_TIMEOUT_SECONDS = int(os.getenv("COMPILE_TIMEOUT_SECONDS", "30"))
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))

DATA_DIR = Path(os.getenv("DATA_DIR", "/tmp/typstbox"))
ARTIFACTS_DIR = DATA_DIR / "artifacts"
PROJECTS_DIR = DATA_DIR / "projects"
SHARES_DIR = DATA_DIR / "shares"

TYPST_BIN_DIR = Path(os.getenv("TYPST_BIN_DIR", "/usr/local/bin"))

PINNED_VERSIONS = ["0.13.1", "0.12.0", "0.11.1"]

ALLOWED_PACKAGES = {
    "@preview/cetz": ["0.3.4"],
    "@preview/tablex": ["0.0.9"],
    "@preview/showybox": ["2.0.3"],
}

DEFAULT_FONTS = [
    "Linux Libertine",
    "Inter",
    "Noto Serif",
    "Noto Sans",
    "Source Code Pro",
]
