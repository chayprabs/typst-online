"use client";

import { useEffect, useState } from "react";
import { getFonts } from "@/lib/api";
import { useProjectStore } from "@/store/project-store";

interface FontManagerProps {
  readOnly?: boolean;
}

export function FontManager({ readOnly = false }: FontManagerProps) {
  const [systemFonts, setSystemFonts] = useState<string[]>([]);
  const project = useProjectStore((s) => s.project);
  const addFont = useProjectStore((s) => s.addFont);
  const setFontFallbackChain = useProjectStore((s) => s.setFontFallbackChain);

  useEffect(() => {
    getFonts()
      .then((r) => setSystemFonts(r.fonts))
      .catch(() => setSystemFonts([]));
  }, []);

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      addFont({ path: `fonts/${file.name}`, contentBase64: base64 });
    };
    reader.readAsDataURL(file);
  };

  const toggleFallback = (font: string) => {
    const chain = project.fontFallbackChain ?? [];
    if (chain.includes(font)) {
      setFontFallbackChain(chain.filter((f) => f !== font));
    } else {
      setFontFallbackChain([...chain, font]);
    }
  };

  return (
    <div className="border-b border-[var(--border)] p-2">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Fonts
      </div>
      {!readOnly && (
        <label className="mb-2 block cursor-pointer rounded border border-dashed border-[var(--border)] px-2 py-1.5 text-center text-xs hover:bg-neutral-50">
          Upload TTF/OTF/WOFF
          <input
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            className="hidden"
            onChange={handleFontUpload}
          />
        </label>
      )}
      {project.fonts.length > 0 && (
        <ul className="mb-2 text-xs text-[var(--muted)]">
          {project.fonts.map((f) => (
            <li key={f.path} className="truncate">
              {f.path}
            </li>
          ))}
        </ul>
      )}
      <div className="text-[10px] uppercase text-[var(--muted)]">Fallback chain</div>
      <ul className="mt-1 max-h-24 space-y-0.5 overflow-y-auto text-xs">
        {systemFonts.map((font) => (
          <li key={font}>
            {readOnly ? (
              <span
                className={
                  (project.fontFallbackChain ?? []).includes(font) ? "font-medium" : ""
                }
              >
                {font}
              </span>
            ) : (
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="checkbox"
                  checked={(project.fontFallbackChain ?? []).includes(font)}
                  onChange={() => toggleFallback(font)}
                />
                {font}
              </label>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
