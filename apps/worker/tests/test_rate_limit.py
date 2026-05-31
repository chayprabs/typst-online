from fastapi.testclient import TestClient

from typstbox_worker.main import app
from typstbox_worker import config, rate_limit

client = TestClient(app)

SAMPLE = {
    "id": "rl",
    "files": [{"path": "main.typ", "content": "= Hi\n"}],
    "compilerVersion": "0.13.1",
    "mainPath": "main.typ",
}


def test_rate_limit_enforced(monkeypatch):
    monkeypatch.setattr(config, "RATE_LIMIT_PER_MINUTE", 3)
    monkeypatch.setattr(rate_limit, "RATE_LIMIT_PER_MINUTE", 3)
    rate_limit._buckets.clear()
    for _ in range(3):
        r = client.post("/v1/compile", json={"project": SAMPLE, "format": "pdf"})
        assert r.status_code == 200
    r = client.post("/v1/compile", json={"project": SAMPLE, "format": "pdf"})
    assert r.status_code == 429
