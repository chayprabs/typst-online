from fastapi.testclient import TestClient

from typstbox_worker.main import app

client = TestClient(app)


def test_broken_typst_structured_diagnostics():
    project = {
        "id": "broken",
        "files": [{"path": "main.typ", "content": "#undefined_symbol()\n"}],
        "compilerVersion": "0.13.1",
        "mainPath": "main.typ",
    }
    r = client.post("/v1/compile", json={"project": project, "format": "pdf"})
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is False
    assert len(data["diagnostics"]) >= 1
    d = data["diagnostics"][0]
    assert d["severity"] in ("error", "warning")
    assert d["message"]
