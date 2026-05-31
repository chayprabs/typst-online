"use client";

import { Download, ImagePlus, Loader2, Play, Share2, Stethoscope } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { OutputFormat } from "@typstbox/shared-types";
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
  const lastError = useProjectStore((s) => s.lastError);
  const setCompiling = useProjectStore((s) => s.setCompiling);
  const setDiagnostics = useProjectStore((s) => s.setDiagnostics);
  const setPreviewUrl = useProjectStore((s) => s.setPreviewUrl);
  const setLastError = useProjectStore((s) => s.setLastError);
  const setLintOnly = useProjectStore((s) => s.setLintOnly);
  const setOutputFormat = useProjectStore((s) => s.setOutputFormat);
  const setPageRange = useProjectStore((s) => s.setPageRange);
  const setCompilerVersion = useProjectStore((s) => s.setCompilerVersion);
  const loadProject = useProjectStore((s) => s.loadProject);
  const addFile = useProjectStore((s) => s.addFile);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [versions, setVersions] = useState<{ version: string; label: string }[]>([]);
  const [templates, setTemplates] = useState<
    { id: string; title: string; description: string }[]
  >([]);
  const [packages, setPackages] = useState<
    { name: string; versions: string[]; description: string }[]
  >([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [previewFormat, setPreviewFormat] = useState<OutputFormat>("pdf");

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
    const state = useProjectStore.getState();
    if (state.lintOnly) {
      setCompiling(true);
      try {
        const result = await lintProject({ project: state.project, lintOnly: true });
        setDiagnostics(result.diagnostics);
        setPreviewUrl(null);
        setLastError(result.ok && result.diagnostics.length === 0 ? null : "Lint finished");
      } catch (e) {
        setLastError(e instanceof Error ? e.message : "Lint failed");
      } finally {
        setCompiling(false);
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
      setDiagnostics(result.diagnostics);
      if (!result.ok) {
        setPreviewUrl(null);
        setLastError("Compilation failed — see diagnostics");
        return;
      }
      const match =
        result.outputs.find((o) => o.format === state.outputFormat) || result.outputs[0];
      if (match) {
        setPreviewUrl(artifactUrl(match.url));
        setPreviewFormat(state.outputFormat);
      }
    } catch (e) {
      setLastError(e instanceof Error ? e.message : "Compile failed");
    } finally {
      setCompiling(false);
    }
  }, [setCompiling, setDiagnostics, setPreviewUrl, setLastError]);

  const filesKey = JSON.stringify(project.files);
  const fontsKey = JSON.stringify(project.fonts);
  const packagesKey = JSON.stringify(project.packages);

  useEffect(() => {
    if (readOnly) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const state = useProjectStore.getState();
      if (state.lintOnly) {
        runCompile();
      } else {
        runCompile();
      }
    }, 800);
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
      a.href = URL.createObjectURL(blob);
      a.download = `${project.id}.zip`;
      a.click();
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

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      const state = useProjectStore.getState();
      loadProject({
        ...state.project,
        fonts: [...state.project.fonts, { path: `fonts/${file.name}`, contentBase64: base64 }],
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addFile(`assets/${file.name}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const addPackage = (name: string, version: string) => {
    const state = useProjectStore.getState();
    const rest = state.project.packages.filter((p) => p.name !== name);
    loadProject({
      ...state.project,
      packages: [...rest, { name, version }],
    });
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

          <select
            value={project.compilerVersion}
            onChange={(e) => setCompilerVersion(e.target.value)}
            className="rounded border border-[var(--border)] px-2 py-1.5 text-sm"
          >
            {versions.map((v) => (
              <option key={v.version} value={v.version}>
                {v.label}
              </option>
            ))}
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
                if (e.target.checked) setPreviewUrl(null);
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

          <select
            className="max-w-[140px] rounded border border-[var(--border)] px-2 py-1.5 text-sm"
            defaultValue=""
            onChange={(e) => {
              const pkg = packages.find((p) => p.name === e.target.value);
              if (pkg) addPackage(pkg.name, pkg.versions[0]);
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
            Font
            <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleFontUpload} />
          </label>

          <label className="inline-flex cursor-pointer items-center gap-1 rounded border border-[var(--border)] px-2 py-1.5 text-sm hover:bg-neutral-50">
            <ImagePlus className="h-4 w-4" />
            Image
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
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

          {shareUrl && <span className="text-xs text-green-700">Link copied!</span>}
          {lastError && <span className="text-xs text-red-600">{lastError}</span>}
        </div>
      )}

      {diagnostics.length > 0 && (
        <div className="mb-3 max-h-24 overflow-y-auto rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          {diagnostics.map((d, i) => (
            <div key={i}>
              {d.file}:{d.line}:{d.column} — {d.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid h-[min(70vh,720px)] grid-cols-1 gap-0 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm lg:grid-cols-[180px_1fr_1fr]">
        {!readOnly && <FileTree />}
        {readOnly && <div className="hidden lg:block" />}
        <TypstEditor readOnly={readOnly} />
        <PreviewPane url={previewUrl} format={previewFormat} />
      </div>
    </div>
  );
}
