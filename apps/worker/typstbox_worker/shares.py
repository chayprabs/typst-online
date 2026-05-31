import json
import uuid
from pathlib import Path

from fastapi import HTTPException
from pydantic import ValidationError

from .config import SHARES_DIR
from .models import Project


def ensure_shares_dir() -> None:
    SHARES_DIR.mkdir(parents=True, exist_ok=True)


def create_share(project: Project) -> str:
    ensure_shares_dir()
    share_id = str(uuid.uuid4())[:12]
    path = SHARES_DIR / f"{share_id}.json"
    path.write_text(project.model_dump_json(), encoding="utf-8")
    return share_id


def get_share(share_id: str) -> Project:
    ensure_shares_dir()
    path = SHARES_DIR / f"{share_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="SHARE_NOT_FOUND")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return Project(**data)
    except (json.JSONDecodeError, ValidationError, TypeError) as exc:
        raise HTTPException(status_code=404, detail="SHARE_NOT_FOUND") from exc


def fork_share(share_id: str) -> Project:
    original = get_share(share_id)
    new_id = str(uuid.uuid4())
    return original.model_copy(update={"id": new_id})
