import base64
import uuid

from fastapi.testclient import TestClient

from typstbox_worker.main import app

client = TestClient(app)

# Minimal valid TTF header stub won't work - use empty and skip if typst rejects
# Instead test font path + fallback chain injection compiles


def test_font_fallback_chain_compile():
    project = {
        "id": str(uuid.uuid4()),
        "files": [
            {
                "path": "main.typ",
                "content": '#set text(font: "Linux Libertine", size: 12pt)\n= Font test\n',
            }
        ],
        "fontFallbackChain": ["Linux Libertine", "Noto Serif"],
        "compilerVersion": "0.13.1",
        "mainPath": "main.typ",
    }
    r = client.post("/v1/compile", json={"project": project, "format": "pdf"})
    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_custom_font_upload_field_accepted():
    # Tiny invalid font bytes still tests API accepts fonts array; compile may fail
    tiny = base64.b64encode(b"0").decode()
    project = {
        "id": str(uuid.uuid4()),
        "files": [{"path": "main.typ", "content": "= Hi\n"}],
        "fonts": [{"path": "fonts/test.ttf", "contentBase64": tiny}],
        "compilerVersion": "0.13.1",
        "mainPath": "main.typ",
    }
    r = client.post("/v1/compile", json={"project": project, "format": "pdf"})
    assert r.status_code == 200
    # ok may be false for invalid font file — API must not 500
    assert "ok" in r.json()
