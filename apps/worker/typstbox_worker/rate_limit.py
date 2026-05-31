import time
from collections import defaultdict

from fastapi import HTTPException, Request

from .config import RATE_LIMIT_PER_MINUTE

_buckets: dict[str, list[float]] = defaultdict(list)


def _client_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def check_rate_limit(request: Request) -> None:
    key = _client_key(request)
    now = time.time()
    window_start = now - 60
    hits = [t for t in _buckets[key] if t > window_start]
    if len(hits) >= RATE_LIMIT_PER_MINUTE:
        raise HTTPException(status_code=429, detail="RATE_LIMIT_EXCEEDED")
    hits.append(now)
    _buckets[key] = hits
