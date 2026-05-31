"use client";

import { FilePlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useProjectStore } from "@/store/project-store";

export function FileTree() {
  const { project, activeFile, setActiveFile, addFile, renameFile, deleteFile } =
    useProjectStore();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const name = `file-${project.files.length + 1}.typ`;
    addFile(name, "// new file\n");
  };

  const startRename = (path: string) => {
    setRenaming(path);
    setNewName(path);
  };

  const commitRename = () => {
    if (renaming && newName && newName !== renaming) {
      renameFile(renaming, newName);
    }
    setRenaming(null);
  };

  return (
    <div className="flex h-full flex-col border-r border-[var(--border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Files
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded p-1 text-[var(--muted)] hover:bg-neutral-100 hover:text-[var(--foreground)]"
          title="New file"
        >
          <FilePlus className="h-4 w-4" />
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto p-2 text-sm">
        {project.files.map((f) => (
          <li key={f.path} className="group mb-0.5 flex items-center gap-1">
            {renaming === f.path ? (
              <input
                className="w-full rounded border border-[var(--border)] px-1 py-0.5 text-xs"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => e.key === "Enter" && commitRename()}
                autoFocus
              />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveFile(f.path)}
                  className={`flex-1 truncate rounded px-2 py-1 text-left ${
                    activeFile === f.path
                      ? "bg-blue-50 font-medium text-[var(--accent)]"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  {f.path}
                </button>
                <button
                  type="button"
                  onClick={() => startRename(f.path)}
                  className="hidden rounded p-1 text-[var(--muted)] group-hover:block hover:bg-neutral-100"
                  title="Rename"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                {project.files.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteFile(f.path)}
                    className="hidden rounded p-1 text-red-500 group-hover:block hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
