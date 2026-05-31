import os
import shutil
import subprocess

import pytest
from fastapi.testclient import TestClient

from typstbox_worker.main import app

client = TestClient(app)

SAMPLE_PROJECT = {
    "id": "test-1",
    "files": [
        {
            "path": "main.typ",
            "content": '#set page(margin: 1cm)\n= Hello TypstBox\nA minimal test document.\n',
        }
    ],
    "fonts": [],
    "packages": [],
    "compilerVersion": "0.13.1",
    "mainPath": "main.typ",
}


def typst_available() -> bool:
    return shutil.which("typst") is not None


@pytest.fixture(scope="module", autouse=True)
def install_typst_once():
    if typst_available():
        yield
        return
    bin_dir = "/tmp/typst-bin"
    os.makedirs(bin_dir, exist_ok=True)
    typst_path = f"{bin_dir}/typst"
    if not os.path.exists(typst_path):
        url = "https://github.com/typst/typst/releases/download/v0.13.1/typst-x86_64-unknown-linux-musl.tar.xz"
        subprocess.run(
            f"curl -fsSL {url} | tar -xJ --strip-components=1 -C {bin_dir} typst-x86_64-unknown-linux-musl/typst",
            shell=True,
            check=False,
            timeout=120,
        )
    if os.path.exists(typst_path):
        os.environ["PATH"] = f"{bin_dir}:{os.environ.get('PATH', '')}"
    yield


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_versions():
    r = client.get("/v1/versions")
    assert r.status_code == 200
    assert len(r.json()["versions"]) == 3


def test_packages():
    r = client.get("/v1/packages")
    assert r.status_code == 200
    assert len(r.json()["packages"]) >= 1


def test_templates_list():
    r = client.get("/v1/templates")
    assert r.status_code == 200
    assert len(r.json()["templates"]) >= 7


@pytest.mark.skipif(not typst_available(), reason="typst not installed")
def test_compile_pdf():
    r = client.post("/v1/compile", json={"project": SAMPLE_PROJECT, "format": "pdf"})
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert len(data["outputs"]) >= 1


def test_package_not_allowed():
    project = dict(SAMPLE_PROJECT)
    project["packages"] = [{"name": "@preview/evil", "version": "1.0.0"}]
    r = client.post("/v1/compile", json={"project": project, "format": "pdf"})
    assert r.status_code == 403
    assert r.json()["detail"]["code"] == "403_PACKAGE_NOT_ALLOWED"


def test_share_and_fork():
    r = client.post("/v1/share", json={"project": SAMPLE_PROJECT, "readOnly": True})
    assert r.status_code == 200
    share_id = r.json()["shareId"]
    r2 = client.get(f"/v1/share/{share_id}")
    assert r2.status_code == 200
    r3 = client.post(f"/v1/share/{share_id}/fork")
    assert r3.status_code == 200
    assert r3.json()["projectId"] != SAMPLE_PROJECT["id"]
