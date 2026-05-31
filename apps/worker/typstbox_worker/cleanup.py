import shutil
import time
from pathlib import Path

from .config import ARTIFACTS_DIR, ARTIFACT_TTL_SECONDS, SHARES_DIR


def cleanup_expired_artifacts() -> int:
    if not ARTIFACTS_DIR.exists():
        return 0
    cutoff = time.time() - ARTIFACT_TTL_SECONDS
    removed = 0
    for path in ARTIFACTS_DIR.iterdir():
        if path.is_dir() and path.stat().st_mtime < cutoff:
            shutil.rmtree(path, ignore_errors=True)
            removed += 1
    return removed


def cleanup_expired_shares() -> int:
    if not SHARES_DIR.exists():
        return 0
    cutoff = time.time() - ARTIFACT_TTL_SECONDS
    removed = 0
    for path in SHARES_DIR.glob("*.json"):
        if path.stat().st_mtime < cutoff:
            path.unlink(missing_ok=True)
            removed += 1
    return removed
