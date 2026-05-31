"use client";

import { useMemo, useState } from "react";
import { useProjectStore } from "@/store/project-store";

interface PackageInfo {
  name: string;
  versions: string[];
  description: string;
}

interface PackageBrowserProps {
  packages: PackageInfo[];
  readOnly?: boolean;
}

export function PackageBrowser({ packages, readOnly = false }: PackageBrowserProps) {
  const [query, setQuery] = useState("");
  const projectPackages = useProjectStore((s) => s.project.packages);
  const setProjectPackages = useProjectStore((s) => s.setProjectPackages);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return packages;
    return packages.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [packages, query]);

  const addPackage = (name: string, version: string) => {
    const rest = projectPackages.filter((p) => p.name !== name);
    setProjectPackages([...rest, { name, version }]);
  };

  const removePackage = (name: string) => {
    setProjectPackages(projectPackages.filter((p) => p.name !== name));
  };

  return (
    <div className="border-b border-[var(--border)] p-2">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Packages
      </div>
      {!readOnly && (
        <input
          type="search"
          placeholder="Search Universe…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-2 w-full rounded border border-[var(--border)] px-2 py-1 text-xs"
        />
      )}
      <ul className="max-h-32 space-y-1 overflow-y-auto text-xs">
        {filtered.map((pkg) => {
          const active = projectPackages.find((p) => p.name === pkg.name);
          return (
            <li key={pkg.name} className="rounded border border-transparent p-1 hover:bg-neutral-50">
              <div className="font-medium">{pkg.name}</div>
              <div className="text-[var(--muted)]">{pkg.description}</div>
              {active && (
                <div className="mt-0.5 text-[var(--accent)]">v{active.version} · active</div>
              )}
              {!readOnly && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {pkg.versions.map((ver) => (
                    <button
                      key={ver}
                      type="button"
                      onClick={() => addPackage(pkg.name, ver)}
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        active?.version === ver
                          ? "bg-blue-100 text-blue-800"
                          : "bg-neutral-100 hover:bg-neutral-200"
                      }`}
                    >
                      {ver}
                    </button>
                  ))}
                  {active && (
                    <button
                      type="button"
                      onClick={() => removePackage(pkg.name)}
                      className="rounded px-1.5 py-0.5 text-[10px] text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
