import base64
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response

from . import __version__
from .compiler import compile_project, ensure_dirs, export_zip, list_packages, list_versions
from .config import DEFAULT_FONTS
from .models import CompileRequest, CompileResult, ForkResponse, Project, ShareCreateRequest, ShareResponse
from .rate_limit import check_rate_limit
from .shares import create_share, fork_share, get_share
from .templates import get_template_project, list_templates

app = FastAPI(title="TypstBox Worker", version=__version__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    ensure_dirs()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "version": __version__}


@app.get("/v1/versions")
def versions() -> dict:
    return {"versions": list_versions()}


@app.get("/v1/packages")
def packages() -> dict:
    return {"packages": list_packages()}


@app.get("/v1/fonts")
def fonts() -> dict:
    return {"fonts": DEFAULT_FONTS}


@app.get("/v1/templates")
def templates() -> dict:
    return {"templates": list_templates()}


@app.get("/v1/templates/{template_id}")
def template_detail(template_id: str) -> dict:
    import uuid

    project = get_template_project(template_id, str(uuid.uuid4()))
    if not project:
        raise HTTPException(status_code=404, detail="TEMPLATE_NOT_FOUND")
    return {"template": template_id, "project": project.model_dump()}


@app.post("/v1/compile", response_model=CompileResult)
def compile_endpoint(body: CompileRequest, request: Request) -> CompileResult:
    check_rate_limit(request)
    try:
        return compile_project(
            body.project,
            output_format=body.format,
            page_range=body.pageRange,
            lint_only=body.lintOnly,
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail={"code": "400_TYPST_COMPILE_ERROR", "message": str(exc)},
        ) from exc


@app.post("/v1/preview", response_model=CompileResult)
def preview_endpoint(body: CompileRequest, request: Request) -> CompileResult:
    body.format = body.format or "pdf"
    return compile_endpoint(body, request)


@app.post("/v1/diagnostics", response_model=CompileResult)
def diagnostics_endpoint(body: CompileRequest, request: Request) -> CompileResult:
    body.lintOnly = True
    return compile_endpoint(body, request)


@app.get("/v1/artifacts/{job_id}/{filename}")
def get_artifact(job_id: str, filename: str) -> FileResponse:
    from .config import ARTIFACTS_DIR

    path = ARTIFACTS_DIR / job_id / filename
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="ARTIFACT_NOT_FOUND")
    media = "application/pdf"
    if filename.endswith(".svg"):
        media = "image/svg+xml"
    elif filename.endswith(".png"):
        media = "image/png"
    elif filename.endswith(".html"):
        media = "text/html"
    return FileResponse(path, media_type=media, filename=filename)


@app.post("/v1/share", response_model=ShareResponse)
def share_create(body: ShareCreateRequest, request: Request) -> ShareResponse:
    check_rate_limit(request)
    share_id = create_share(body.project)
    return ShareResponse(shareId=share_id, url=f"/share/{share_id}")


@app.get("/v1/share/{share_id}")
def share_get(share_id: str) -> dict:
    project = get_share(share_id)
    return {"shareId": share_id, "project": project.model_dump(), "readOnly": True}


@app.post("/v1/share/{share_id}/fork", response_model=ForkResponse)
def share_fork(share_id: str, request: Request) -> ForkResponse:
    check_rate_limit(request)
    forked = fork_share(share_id)
    return ForkResponse(projectId=forked.id, project=forked)


@app.post("/v1/export/zip")
def export_project_zip(body: CompileRequest, request: Request) -> Response:
    check_rate_limit(request)
    data, filename = export_zip(body.project)
    return Response(
        content=data,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.post("/v1/fonts/validate")
def validate_font(filename: str) -> dict:
    allowed = (".ttf", ".otf", ".woff", ".woff2")
    if not any(filename.lower().endswith(ext) for ext in allowed):
        raise HTTPException(status_code=400, detail="INVALID_FONT_FORMAT")
    return {"ok": True}
