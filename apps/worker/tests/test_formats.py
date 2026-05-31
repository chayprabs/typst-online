import uuid

from fastapi.testclient import TestClient

from typstbox_worker.main import app

client = TestClient(app)

PROJ = {
    "id": "fmt",
    "files": [{"path": "main.typ", "content": "= Format test\nLine two.\n"}],
    "compilerVersion": "0.13.1",
    "mainPath": "main.typ",
}


def test_compile_pdf_svg_png():
    for fmt in ("pdf", "svg", "png"):
        p = dict(PROJ)
        p["id"] = str(uuid.uuid4())
        r = client.post("/v1/compile", json={"project": p, "format": fmt})
        assert r.status_code == 200, fmt
        assert r.json()["ok"] is True, fmt


def test_compile_html():
    p = {
        "id": str(uuid.uuid4()),
        "files": [{"path": "main.typ", "content": "= HTML\nNo page set.\n"}],
        "compilerVersion": "0.13.1",
        "mainPath": "main.typ",
    }
    r = client.post("/v1/compile", json={"project": p, "format": "html"})
    assert r.status_code == 200
    assert r.json()["ok"] is True
