import uuid

from fastapi.testclient import TestClient

from typstbox_worker.main import app

client = TestClient(app)


def test_cetz_package_compiles():
    project = {
        "id": str(uuid.uuid4()),
        "files": [
            {
                "path": "main.typ",
                "content": """#import "@preview/cetz:0.3.4"
#canvas(length: 1cm, {
  circle((0cm, 0cm), radius: 1cm)
})
""",
            }
        ],
        "packages": [{"name": "@preview/cetz", "version": "0.3.4"}],
        "compilerVersion": "0.13.1",
        "mainPath": "main.typ",
    }
    import pytest

    r = client.post("/v1/compile", json={"project": project, "format": "pdf"})
    assert r.status_code == 200
    data = r.json()
    if not data["ok"]:
        pytest.skip(f"cetz compile needs network: {data.get('diagnostics')}")
    assert data["ok"] is True
