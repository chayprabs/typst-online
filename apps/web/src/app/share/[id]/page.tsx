"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Playground } from "@/components/Playground";
import { forkShare, getShare } from "@/lib/api";
import { useProjectStore } from "@/store/project-store";

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const loadProject = useProjectStore((s) => s.loadProject);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    setError(null);
    let cancelled = false;
    getShare(id)
      .then((r) => {
        if (cancelled) return;
        loadProject(r.project);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError("Share not found");
      });
    return () => {
      cancelled = true;
    };
  }, [id, loadProject]);

  const handleFork = async () => {
    try {
      const { project } = await forkShare(id);
      loadProject(project);
      router.push("/");
    } catch {
      setError("Could not fork this share");
    }
  };

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!ready) {
    return <div className="p-8 text-center text-[var(--muted)]">Loading shared project…</div>;
  }

  return (
    <>
      <div className="border-b border-[var(--border)] bg-amber-50 px-4 py-2 text-center text-sm">
        Viewing a shared read-only project.{" "}
        <button
          type="button"
          onClick={handleFork}
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Fork to edit
        </button>
      </div>
      <Playground readOnly />
    </>
  );
}
