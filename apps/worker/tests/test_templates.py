import pytest
from fastapi.testclient import TestClient

from typstbox_worker.main import app
from typstbox_worker.templates import TEMPLATES

client = TestClient(app)


VERSIONS = ["0.13.1", "0.12.0", "0.11.1"]


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


@pytest.mark.parametrize("template_id", ["resume-modern", "paper-ieee", "invoice"])
@pytest.mark.parametrize("compiler_version", VERSIONS)
def test_template_version_matrix(template_id: str, compiler_version: str):
    import uuid

    r = client.get(f"/v1/templates/{template_id}")
    project = r.json()["project"]
    project["id"] = str(uuid.uuid4())
    project["compilerVersion"] = compiler_version
    r2 = client.post("/v1/compile", json={"project": project, "format": "pdf"})
    if r2.status_code == 503:
        pytest.skip(f"typst {compiler_version} not on PATH")
    assert r2.status_code == 200
    assert r2.json()["ok"] is True, f"{template_id}@{compiler_version}"
