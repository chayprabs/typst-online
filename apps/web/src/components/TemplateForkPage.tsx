"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Playground } from "@/components/Playground";
import { loadTemplate } from "@/lib/api";
import { useProjectStore } from "@/store/project-store";

interface TemplateForkPageProps {
  templateId: string;
}

export function TemplateForkPage({ templateId }: TemplateForkPageProps) {
  const router = useRouter();
  const loadProject = useProjectStore((s) => s.loadProject);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    setError(null);
    loadTemplate(templateId)
      .then(({ project }) => {
        loadProject(project);
        setReady(true);
      })
      .catch(() => setError("Template not found"));
  }, [templateId, loadProject]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          ← Back to playground
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <div className="p-8 text-center text-[var(--muted)]">Loading template…</div>;
  }

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
