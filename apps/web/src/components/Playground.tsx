"use client";

import { Download, Loader2, Play, Share2, Stethoscope } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  artifactUrl,
  compileProject,
  createShare,
  exportZip,
  getPackages,
  getTemplates,
  getVersions,
  lintProject,
  loadTemplate,
} from "@/lib/api";
import { useProjectStore } from "@/store/project-store";
import { FileTree } from "./FileTree";
import { PdfPreview } from "./PdfPreview";
import { TypstEditor } from "./TypstEditor";

export function Playground() {
  const store = useProjectStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [versions, setVersions] = useState<{ version: string; label: string }[]>([]);
  const [templates, setTemplates] = useState<
    { id: string; title: string; description: string }[]
  >([]);
  const [packages, setPackages] = useState<
    { name: string; versions: string[]; description: string }[]
  >([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    getVersions().then((r) => setVersions(r.versions));
    getTemplates().then((r) => setTemplates(r.templates));
    getPackages().then((r) => setPackages(r.packages));
  }, []);

  const runCompile = useCallback(
    async () => {
      if (store.lintOnly) {
        store.setCompiling(true);
        try {
          const result = await lintProject({
            project: store.project,
            lintOnly: true,
          });
          store.setDiagnostics(result.diagnostics);
          store.setLastError(result.ok ? null : "Lint found issues");
        } catch (e) {
          store.setLastError(e instanceof Error ? e.message : "Lint failed");
        } finally {
          store.setCompiling(false);
        }
        return;
      }

      store.setCompiling(true);
      store.setLastError(null);
      try {
        const result = await compileProject({
          project: store.project,
          format: store.outputFormat,
          pageRange: store.pageRange || undefined,
        });
        store.setDiagnostics(result.diagnostics);
        if (!result.ok) {
          store.setPreviewUrl(null);
          store.setLastError("Compilation failed — see diagnostics");
          return;
        }
        const pdf = result.outputs.find((o) => o.format === "pdf");
        if (pdf) {
          store.setPreviewUrl(artifactUrl(pdf.url));
        } else if (result.outputs[0]) {
          store.setPreviewUrl(artifactUrl(result.outputs[0].url));
        }
      } catch (e) {
        store.setLastError(e instanceof Error ? e.message : "Compile failed");
      } finally {
        store.setCompiling(false);
      }
    },
    [store],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!store.lintOnly) runCompile(true);
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [store.project.files, store.project.compilerVersion, store.lintOnly, runCompile]);

  const handleShare = async () => {
    const { shareId } = await createShare(store.project);
    const url = `${window.location.origin}/share/${shareId}`;
    setShareUrl(url);
    await navigator.clipboard.writeText(url);
  };

  const handleExportZip = async () => {
    const blob = await exportZip(store.project);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${store.project.id}.zip`;
    a.click();
  };

  const handleTemplate = async (id: string) => {
    const { project } = await loadTemplate(id);
    store.loadProject(project);
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      store.loadProject({
        ...store.project,
        fonts: [
          ...store.project.fonts,
          { path: `fonts/${file.name}`, contentBase64: base64 },
        ],
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => runCompile(false)}
          disabled={store.compiling}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {store.compiling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Compile
        </button>

        <select
          value={store.outputFormat}
          onChange={(e) => store.setOutputFormat(e.target.value as typeof store.outputFormat)}
          className="rounded border border-[var(--border)] px-2 py-1.5 text-sm"
        >
          <option value="pdf">PDF</option>
          <option value="svg">SVG</option>
          <option value="png">PNG</option>
          <option value="html">HTML</option>
        </select>

        <select
          value={store.project.compilerVersion}
          onChange={(e) => store.setCompilerVersion(e.target.value)}
          className="rounded border border-[var(--border)] px-2 py-1.5 text-sm"
          title="Compiler version"
        >
          {versions.map((v) => (
            <option key={v.version} value={v.version}>
              {v.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Page range (e.g. 1-3)"
          value={store.pageRange}
          onChange={(e) => store.setPageRange(e.target.value)}
          className="w-28 rounded border border-[var(--border)] px-2 py-1.5 text-sm"
        />

        <label className="inline-flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={store.lintOnly}
            onChange={(e) => store.setLintOnly(e.target.checked)}
          />
          <Stethoscope className="h-3.5 w-3.5" />
          Lint only
        </label>

        <select
          className="rounded border border-[var(--border)] px-2 py-1.5 text-sm"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) handleTemplate(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="">Templates…</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <select
          className="rounded border border-[var(--border)] px-2 py-1.5 text-sm"
          defaultValue=""
          onChange={(e) => {
            const pkg = packages.find((p) => p.name === e.target.value);
            if (pkg) {
              store.loadProject({
                ...store.project,
                packages: [{ name: pkg.name, version: pkg.versions[0] }],
              });
            }
            e.target.value = "";
          }}
        >
          <option value="">Packages…</option>
          {packages.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        <label className="cursor-pointer rounded border border-[var(--border)] px-2 py-1.5 text-sm hover:bg-neutral-50">
          Upload font
          <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleFontUpload} />
        </label>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1 rounded border border-[var(--border)] px-2 py-1.5 text-sm hover:bg-neutral-50"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>

        <button
          type="button"
          onClick={handleExportZip}
          className="inline-flex items-center gap-1 rounded border border-[var(--border)] px-2 py-1.5 text-sm hover:bg-neutral-50"
        >
          <Download className="h-4 w-4" />
          ZIP
        </button>

        {shareUrl && (
          <span className="text-xs text-green-700">Link copied!</span>
        )}
        {store.lastError && (
          <span className="text-xs text-red-600">{store.lastError}</span>
        )}
      </div>

      {store.diagnostics.length > 0 && (
        <div className="mb-3 max-h-24 overflow-y-auto rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          {store.diagnostics.map((d, i) => (
            <div key={i}>
              {d.file}:{d.line}:{d.column} — {d.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid h-[min(70vh,720px)] grid-cols-1 gap-0 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm lg:grid-cols-[180px_1fr_1fr]">
        <FileTree />
        <TypstEditor />
        <PdfPreview url={store.previewUrl} />
      </div>
    </div>
  );
}
