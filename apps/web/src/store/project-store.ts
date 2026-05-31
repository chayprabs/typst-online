"use client";

import type { Diagnostic, OutputFormat, Project } from "@typstbox/shared-types";
import { create } from "zustand";

function newId(): string {
  return crypto.randomUUID();
}

const DEFAULT_MAIN = `main.typ`;

const defaultContent = `#set page(margin: 1.5cm)
#set text(font: "Linux Libertine", size: 11pt)

= Welcome to TypstBox

Edit this document and click **Compile** to generate a PDF preview.

== Features
- Live Typst editor
- PDF, SVG, PNG, and HTML export
- Pinned compiler versions
- Template gallery
`;

function createDefaultProject(): Project {
  return {
    id: newId(),
    files: [{ path: DEFAULT_MAIN, content: defaultContent }],
    fonts: [],
    packages: [],
    compilerVersion: "0.13.1",
    mainPath: DEFAULT_MAIN,
    fontFallbackChain: [],
  };
}

interface ProjectState {
  project: Project;
  activeFile: string;
  outputFormat: OutputFormat;
  pageRange: string;
  compiling: boolean;
  lintOnly: boolean;
  diagnostics: Diagnostic[];
  previewUrl: string | null;
  lastError: string | null;
  setActiveFile: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  addFile: (path: string, content?: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  deleteFile: (path: string) => void;
  setCompilerVersion: (version: string) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setPageRange: (range: string) => void;
  setLintOnly: (v: boolean) => void;
  loadProject: (project: Project) => void;
  resetProject: () => void;
  setCompiling: (v: boolean) => void;
  setDiagnostics: (d: Diagnostic[]) => void;
  setPreviewUrl: (url: string | null) => void;
  setLastError: (e: string | null) => void;
  getActiveContent: () => string;
  setActiveContent: (content: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: createDefaultProject(),
  activeFile: DEFAULT_MAIN,
  outputFormat: "pdf",
  pageRange: "",
  compiling: false,
  lintOnly: false,
  diagnostics: [],
  previewUrl: null,
  lastError: null,

  setActiveFile: (path) => set({ activeFile: path }),

  updateFile: (path, content) =>
    set((s) => ({
      project: {
        ...s.project,
        files: s.project.files.map((f) => (f.path === path ? { ...f, content } : f)),
      },
    })),

  addFile: (path, content = "") =>
    set((s) => {
      if (s.project.files.some((f) => f.path === path)) return s;
      return {
        project: { ...s.project, files: [...s.project.files, { path, content }] },
        activeFile: path,
      };
    }),

  renameFile: (oldPath, newPath) =>
    set((s) => ({
      project: {
        ...s.project,
        files: s.project.files.map((f) =>
          f.path === oldPath ? { ...f, path: newPath } : f,
        ),
        mainPath: s.project.mainPath === oldPath ? newPath : s.project.mainPath,
      },
      activeFile: s.activeFile === oldPath ? newPath : s.activeFile,
    })),

  deleteFile: (path) =>
    set((s) => {
      const files = s.project.files.filter((f) => f.path !== path);
      if (files.length === 0) return s;
      const activeFile = s.activeFile === path ? files[0].path : s.activeFile;
      return {
        project: {
          ...s.project,
          files,
          mainPath: s.project.mainPath === path ? files[0].path : s.project.mainPath,
        },
        activeFile,
      };
    }),

  setCompilerVersion: (version) =>
    set((s) => ({ project: { ...s.project, compilerVersion: version } })),

  setOutputFormat: (format) => set({ outputFormat: format }),
  setPageRange: (range) => set({ pageRange: range }),
  setLintOnly: (v) => set({ lintOnly: v }),

  loadProject: (project) =>
    set({
      project,
      activeFile: project.mainPath || project.files[0]?.path || DEFAULT_MAIN,
      diagnostics: [],
      previewUrl: null,
      lastError: null,
    }),

  resetProject: () =>
    set({
      project: createDefaultProject(),
      activeFile: DEFAULT_MAIN,
      diagnostics: [],
      previewUrl: null,
      lastError: null,
    }),

  setCompiling: (v) => set({ compiling: v }),
  setDiagnostics: (d) => set({ diagnostics: d }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setLastError: (e) => set({ lastError: e }),

  getActiveContent: () => {
    const { project, activeFile } = get();
    return project.files.find((f) => f.path === activeFile)?.content ?? "";
  },

  setActiveContent: (content) => {
    const { activeFile } = get();
    get().updateFile(activeFile, content);
  },
}));
