"use client";

import { Download, ImagePlus, Loader2, Play, Share2, Stethoscope } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { OutputFormat } from "@typstbox/shared-types";
import { PINNED_VERSIONS } from "@typstbox/shared-types";
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
import { EditorSidebar } from "./EditorSidebar";
import { PreviewPane } from "./PreviewPane";
import { TypstEditor } from "./TypstEditor";

interface PlaygroundProps {
  readOnly?: boolean;
}

export function Playground({ readOnly = false }: PlaygroundProps) {
  const project = useProjectStore((s) => s.project);
  const outputFormat = useProjectStore((s) => s.outputFormat);
  const pageRange = useProjectStore((s) => s.pageRange);
  const lintOnly = useProjectStore((s) => s.lintOnly);
  const compiling = useProjectStore((s) => s.compiling);
  const diagnostics = useProjectStore((s) => s.diagnostics);
  const previewUrl = useProjectStore((s) => s.previewUrl);
  const previewUrls = useProjectStore((s) => s.previewUrls);
  const previewFormat = useProjectStore((s) => s.previewFormat);
  const lastError = useProjectStore((s) => s.lastError);
  const setCompiling = useProjectStore((s) => s.setCompiling);
  const setDiagnostics = useProjectStore((s) => s.setDiagnostics);
  const setPreview = useProjectStore((s) => s.setPreview);
  const setLastError = useProjectStore((s) => s.setLastError);
  const setLintOnly = useProjectStore((s) => s.setLintOnly);
  const setOutputFormat = useProjectStore((s) => s.setOutputFormat);
  const setPageRange = useProjectStore((s) => s.setPageRange);
  const loadProject = useProjectStore((s) => s.loadProject);
  const addFile = useProjectStore((s) => s.addFile);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compileGen = useRef(0);

  useEffect(() => {
    return () => {
      compileGen.current += 1;
    };
  }, []);

  const [versions, setVersions] = useState<{ version: string; label: string }[]>(
    PINNED_VERSIONS.map((v) => ({ version: v.version, label: v.label })),
  );
  const [templates, setTemplates] = useState<
    { id: string; title: string; description: string }[]
  >([]);
  const [packages, setPackages] = useState<
    { name: string; versions: string[]; description: string }[]
  >([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getVersions(), getTemplates(), getPackages()])
      .then(([v, t, p]) => {
        setVersions(v.versions);
        setTemplates(t.templates);
        setPackages(p.packages);
      })
      .catch(() => setFetchError("Could not reach compile API. Start the worker on port 8080."));
  }, []);

  const runCompile = useCallback(async () => {
    const gen = ++compileGen.current;
    const state = useProjectStore.getState();
    const startedProjectId = state.project.id;
    const isStale = () =>
      gen !== compileGen.current ||
      useProjectStore.getState().project.id !== startedProjectId;

    if (state.lintOnly) {
      setCompiling(true);
      try {
        const result = await lintProject({ project: state.project, lintOnly: true });
        if (isStale()) return;
        setDiagnostics(result.diagnostics);
        setPreview(null, [], state.outputFormat);
        setLastError(null);
      } catch (e) {
        if (isStale()) return;
        setPreview(null, [], state.outputFormat);
        setLastError(e instanceof Error ? e.message : "Lint failed");
      } finally {
        if (!isStale()) setCompiling(false);
      }
      return;
    }

    setCompiling(true);
    setLastError(null);
    try {
      const result = await compileProject({
        project: state.project,
        format: state.outputFormat,
        pageRange: state.pageRange || undefined,
      });
      if (isStale()) return;
      setDiagnostics(result.diagnostics);
      if (!result.ok) {
        setPreview(null, [], state.outputFormat);
        setLastError("Compilation failed — see diagnostics");
        return;
      }
      const fmt = state.outputFormat;
      const matching = result.outputs.filter((o) => o.format === fmt);
      const outputs = matching.length > 0 ? matching : result.outputs;
      const urls = outputs.map((o) => artifactUrl(o.url));
      setPreview(urls[0] ?? null, urls, fmt);
      setLastError(null);
    } catch (e) {
      if (isStale()) return;
      setPreview(null, [], state.outputFormat);
      setLastError(e instanceof Error ? e.message : "Compile failed");
    } finally {
      if (!isStale()) setCompiling(false);
    }
  }, [setCompiling, setDiagnostics, setPreview, setLastError]);

  const filesKey = JSON.stringify(project.files);
  const fontsKey = JSON.stringify(project.fonts);
  const packagesKey = JSON.stringify(project.packages);
  const projectId = project.id;

  useEffect(() => {
    if (readOnly) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runCompile(), 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    filesKey,
    fontsKey,
    packagesKey,
    project.compilerVersion,
    outputFormat,
    pageRange,
    lintOnly,
    readOnly,
    runCompile,
  ]);

  useEffect(() => {
    if (!readOnly) return;
    runCompile();
  }, [readOnly, projectId, runCompile]);

  const handleShare = async () => {
    try {
      const { shareId } = await createShare(project);
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* clipboard blocked */
      }
    } catch (e) {
      setLastError(e instanceof Error ? e.message : "Share failed");
    }
  };

  const handleExportZip = async () => {
    try {
      const blob = await exportZip(project);
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `${project.id}.zip`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setLastError(e instanceof Error ? e.message : "Export failed");
    }
  };

  const handleTemplate = async (id: string) => {
    try {
      const { project: tpl } = await loadTemplate(id);
      loadProject(tpl);
    } catch (e) {
      setLastError(e instanceof Error ? e.message : "Template load failed");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, prefix: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => setLastError("File upload failed");
    reader.onload = () => {
      const result = reader.result as string;
      const path = `${prefix}/${file.name}`;
      if (file.name.match(/\.(csv|json|txt|yaml|yml)$/i)) {
        addFile(path, result);
      } else {
        addFile(path, result);
      }
    };
    if (file.name.match(/\.(csv|json|txt|yaml|yml)$/i)) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const downloadPdf = () => {
    if (!previewUrl || previewFormat !== "pdf") return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `${project.id}.pdf`;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
      {fetchError && (
        <div className="mb-3 rounded border border-amber-200 bg-amber-50 p-2 text-sm text-amber-900">
          {fetchError}
        </div>
      )}

      {!readOnly && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => runCompile()}
            disabled={compiling}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {compiling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {lintOnly ? "Lint" : "Compile"}
          </button>

          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className="rounded border border-[var(--border)] px-2 py-1.5 text-sm"
          >
            <option value="pdf">PDF</option>
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
            <option value="html">HTML</option>
          </select>

          <input
            type="text"
            placeholder="Page range"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="w-28 rounded border border-[var(--border)] px-2 py-1.5 text-sm"
          />

          <label className="inline-flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={lintOnly}
              onChange={(e) => {
                setLintOnly(e.target.checked);
                if (e.target.checked) setPreview(null, [], outputFormat);
              }}
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

          <label className="inline-flex cursor-pointer items-center gap-1 rounded border border-[var(--border)] px-2 py-1.5 text-sm hover:bg-neutral-50">
            <ImagePlus className="h-4 w-4" />
            Asset
            <input
              type="file"
              accept="image/*,.csv,.json,.txt"
              className="hidden"
              onChange={(e) => handleFileUpload(e, "assets")}
            />
          </label>

          {previewUrl && previewFormat === "pdf" && (
            <button
              type="button"
              onClick={downloadPdf}
              className="inline-flex items-center gap-1 rounded border border-[var(--border)] px-2 py-1.5 text-sm hover:bg-neutral-50"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
          )}

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

          {shareUrl && <span className="text-xs text-green-700">Link copied!</span>}
        </div>
      )}

      {lastError && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-800">
          {lastError}
        </div>
      )}

      {readOnly && compiling && (
        <div className="mb-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Compiling preview…
        </div>
      )}

      {diagnostics.length > 0 && (
        <div className="mb-3 max-h-24 overflow-y-auto rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          {diagnostics.map((d, i) => (
            <div key={i}>
              {d.file}:{d.line}:{d.column} — [{d.severity}] {d.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid h-[min(70vh,720px)] grid-cols-1 gap-0 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm lg:grid-cols-[240px_1fr_1fr]">
        <EditorSidebar readOnly={readOnly} packages={packages} versions={versions} />
        <TypstEditor readOnly={readOnly} />
        <PreviewPane url={previewUrl} urls={previewUrls} format={previewFormat} />
      </div>
    </div>
  );
}
