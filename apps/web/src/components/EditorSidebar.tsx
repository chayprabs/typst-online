"use client";

import { PINNED_VERSIONS } from "@typstbox/shared-types";
import { useProjectStore } from "@/store/project-store";
import { FileTree } from "./FileTree";
import { FontManager } from "./FontManager";
import { PackageBrowser } from "./PackageBrowser";

interface EditorSidebarProps {
  readOnly?: boolean;
  packages: { name: string; versions: string[]; description: string }[];
  versions: { version: string; label: string }[];
}

export function EditorSidebar({ readOnly = false, packages, versions }: EditorSidebarProps) {
  const compilerVersion = useProjectStore((s) => s.project.compilerVersion);
  const setCompilerVersion = useProjectStore((s) => s.setCompilerVersion);

  const versionOptions =
    versions.length > 0
      ? versions
      : PINNED_VERSIONS.map((v) => ({ version: v.version, label: v.label }));

  return (
    <aside className="flex h-full flex-col overflow-hidden border-r border-[var(--border)] bg-white">
      {!readOnly && <FileTree />}
      {readOnly && (
        <div className="border-b border-[var(--border)] p-2 text-xs text-[var(--muted)]">
          Read-only view
        </div>
      )}
      <div className="border-b border-[var(--border)] p-2">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Compiler
        </label>
        <select
          value={compilerVersion}
          disabled={readOnly}
          onChange={(e) => setCompilerVersion(e.target.value)}
          className="w-full rounded border border-[var(--border)] px-2 py-1 text-xs"
        >
          {versionOptions.map((v) => (
            <option key={v.version} value={v.version}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
      <PackageBrowser packages={packages} readOnly={readOnly} />
      <FontManager readOnly={readOnly} />
    </aside>
  );
}
