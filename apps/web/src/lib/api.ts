import type { CompileRequest, CompileResult, Project } from "@typstbox/shared-types";

const API_BASE = "/api";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(
      typeof err.detail === "object"
        ? err.detail.message || JSON.stringify(err.detail)
        : String(err.detail || res.statusText),
    );
  }
  return res.json() as Promise<T>;
}

export async function compileProject(req: CompileRequest): Promise<CompileResult> {
  return fetchJson<CompileResult>("/v1/compile", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function lintProject(req: CompileRequest): Promise<CompileResult> {
  return fetchJson<CompileResult>("/v1/diagnostics", {
    method: "POST",
    body: JSON.stringify({ ...req, lintOnly: true }),
  });
}

export async function getVersions() {
  return fetchJson<{ versions: { version: string; label: string; default?: boolean }[] }>(
    "/v1/versions",
  );
}

export async function getPackages() {
  return fetchJson<{
    packages: { name: string; versions: string[]; description: string }[];
  }>("/v1/packages");
}

export async function getTemplates() {
  return fetchJson<{
    templates: { id: string; title: string; description: string; category: string }[];
  }>("/v1/templates");
}

export async function loadTemplate(id: string) {
  return fetchJson<{ project: Project }>(`/v1/templates/${id}`);
}

export async function createShare(project: Project) {
  return fetchJson<{ shareId: string; url: string }>("/v1/share", {
    method: "POST",
    body: JSON.stringify({ project, readOnly: true }),
  });
}

export async function getShare(shareId: string) {
  return fetchJson<{ project: Project; readOnly: boolean }>(`/v1/share/${shareId}`);
}

export async function forkShare(shareId: string) {
  return fetchJson<{ projectId: string; project: Project }>(`/v1/share/${shareId}/fork`, {
    method: "POST",
  });
}

export async function exportZip(project: Project): Promise<Blob> {
  const res = await fetch(`${API_BASE}/v1/export/zip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(
      typeof err.detail === "object"
        ? err.detail.message || JSON.stringify(err.detail)
        : String(err.detail || res.statusText),
    );
  }
  return res.blob();
}

export function artifactUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}
