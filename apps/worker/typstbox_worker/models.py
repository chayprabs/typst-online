from pydantic import BaseModel, Field


class ProjectFile(BaseModel):
    path: str
    content: str


class ProjectFont(BaseModel):
    path: str
    contentBase64: str | None = None


class ProjectPackage(BaseModel):
    name: str
    version: str


class Project(BaseModel):
    id: str
    files: list[ProjectFile]
    fonts: list[ProjectFont] = Field(default_factory=list)
    packages: list[ProjectPackage] = Field(default_factory=list)
    compilerVersion: str = "0.13.1"
    mainPath: str | None = None
    fontFallbackChain: list[str] = Field(default_factory=list)


class Diagnostic(BaseModel):
    file: str
    line: int
    column: int
    severity: str
    message: str


class CompileOutput(BaseModel):
    format: str
    url: str
    pageCount: int | None = None


class CompileResult(BaseModel):
    ok: bool
    outputs: list[CompileOutput] = Field(default_factory=list)
    diagnostics: list[Diagnostic] = Field(default_factory=list)


class CompileRequest(BaseModel):
    project: Project
    format: str = "pdf"
    pageRange: str | None = None
    lintOnly: bool = False


class ShareCreateRequest(BaseModel):
    project: Project
    readOnly: bool = True


class ShareResponse(BaseModel):
    shareId: str
    url: str


class ForkResponse(BaseModel):
    projectId: str
    project: Project
