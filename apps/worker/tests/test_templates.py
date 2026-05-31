import pytest
from fastapi.testclient import TestClient

from typstbox_worker.main import app
from typstbox_worker.templates import TEMPLATES

client = TestClient(app)


@pytest.mark.parametrize("template_id", list(TEMPLATES.keys()))
def test_each_template_compiles(template_id: str):
    import uuid

    r = client.get(f"/v1/templates/{template_id}")
    assert r.status_code == 200
    project = r.json()["project"]
    project["id"] = str(uuid.uuid4())
    r2 = client.post("/v1/compile", json={"project": project, "format": "pdf"})
    assert r2.status_code == 200, r2.text
    data = r2.json()
    assert data["ok"] is True, f"{template_id} failed: {data.get('diagnostics')}"
    assert len(data["outputs"]) >= 1
