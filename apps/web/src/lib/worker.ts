import type { Project } from "@typstbox/shared-types";

const workerUrl = process.env.WORKER_URL || "http://127.0.0.1:8080";

export async function fetchTemplateProject(templateId: string): Promise<Project | null> {
  const res = await fetch(`${workerUrl}/v1/templates/${encodeURIComponent(templateId)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { project: Project };
  return data.project;
}
