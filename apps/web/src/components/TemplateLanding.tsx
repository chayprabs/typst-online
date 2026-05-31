"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadTemplate } from "@/lib/api";
import { useProjectStore } from "@/store/project-store";

interface TemplateLandingProps {
  title: string;
  description: string;
  templateIds: string[];
}

export function TemplateLanding({ title, description, templateIds }: TemplateLandingProps) {
  const router = useRouter();
  const loadProject = useProjectStore((s) => s.loadProject);

  const openTemplate = async (id: string) => {
    const { project } = await loadTemplate(id);
    loadProject(project);
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-[var(--muted)]">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {templateIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => openTemplate(id)}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-white hover:bg-[var(--accent-hover)]"
          >
            Open {id}
          </button>
        ))}
      </div>
      <p className="mt-8">
        <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
          ← Open full playground
        </Link>
      </p>
    </div>
  );
}
