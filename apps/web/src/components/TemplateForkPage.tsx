"use client";

import type { Project } from "@typstbox/shared-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { Playground } from "@/components/Playground";
import { useProjectStore } from "@/store/project-store";

interface TemplateForkPageProps {
  templateId: string;
  initialProject: Project | null;
}

function TemplateForkPageContent({
  templateId,
  initialProject,
}: {
  templateId: string;
  initialProject: Project;
}) {
  const router = useRouter();
  const loadProject = useProjectStore((s) => s.loadProject);

  useLayoutEffect(() => {
    loadProject(initialProject);
  }, [templateId, initialProject, loadProject]);

  return (
    <>
      <div className="border-b border-[var(--border)] bg-blue-50 px-4 py-2 text-center text-sm">
        Editing template: <strong>{templateId}</strong>.{" "}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Open blank playground
        </button>
      </div>
      <Playground />
    </>
  );
}

export function TemplateForkPage({ templateId, initialProject }: TemplateForkPageProps) {
  if (!initialProject) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Template not found</p>
        <Link href="/" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          ← Back to playground
        </Link>
      </div>
    );
  }

  return (
    <TemplateForkPageContent
      key={templateId}
      templateId={templateId}
      initialProject={initialProject}
    />
  );
}
