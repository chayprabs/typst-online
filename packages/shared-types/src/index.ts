export type OutputFormat = "pdf" | "svg" | "png" | "html";

export type DiagnosticSeverity = "error" | "warning";

export interface ProjectFile {
  path: string;
  content: string;
}

export interface ProjectFont {
  path: string;
  contentBase64?: string;
}

export interface ProjectPackage {
  name: string;
  version: string;
}

export interface Project {
  id: string;
  files: ProjectFile[];
  fonts: ProjectFont[];
  packages: ProjectPackage[];
  compilerVersion: string;
  mainPath?: string;
  fontFallbackChain?: string[];
}

export interface Diagnostic {
  file: string;
  line: number;
  column: number;
  severity: DiagnosticSeverity;
  message: string;
}

export interface CompileOutput {
  format: string;
  url: string;
  pageCount?: number;
}

export interface CompileResult {
  ok: boolean;
  outputs: CompileOutput[];
  diagnostics: Diagnostic[];
}

export interface CompileRequest {
  project: Project;
  format?: OutputFormat;
  pageRange?: string;
  lintOnly?: boolean;
}

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

export interface CompilerVersion {
  version: string;
  label: string;
  default?: boolean;
}

export const DEFAULT_COMPILER_VERSION = "0.13.1";

export const PINNED_VERSIONS: CompilerVersion[] = [
  { version: "0.13.1", label: "Typst 0.13.1", default: true },
  { version: "0.12.0", label: "Typst 0.12.0" },
  { version: "0.11.1", label: "Typst 0.11.1" },
];

export const ALLOWED_PACKAGES: PackageInfo[] = [
  {
    name: "@preview/cetz",
    version: "0.3.4",
    description: "CeTZ graphics for Typst",
  },
  {
    name: "@preview/tablex",
    version: "0.0.9",
    description: "Extended tables",
  },
  {
    name: "@preview/showybox",
    version: "2.0.3",
    description: "Colored boxes",
  },
];

export const DEFAULT_FONTS = [
  "Linux Libertine",
  "Inter",
  "Noto Serif",
  "Noto Sans",
  "Source Code Pro",
];

export type TemplateId =
  | "resume-modern"
  | "resume-classic"
  | "paper-ieee"
  | "report"
  | "invoice"
  | "slides"
  | "letter"
  | "thesis";

export interface TemplateMeta {
  id: TemplateId;
  title: string;
  description: string;
  category: string;
}
