"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { registerTypstLanguage } from "@/lib/typst-monaco";
// Monaco types come from @monaco-editor/react at runtime
import { useProjectStore } from "@/store/project-store";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface TypstEditorProps {
  readOnly?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MonacoEditorInstance = any;

export function TypstEditor({ readOnly = false }: TypstEditorProps) {
  const activeFile = useProjectStore((s) => s.activeFile);
  const diagnostics = useProjectStore((s) => s.diagnostics);
  const getActiveContent = useProjectStore((s) => s.getActiveContent);
  const setActiveContent = useProjectStore((s) => s.setActiveContent);
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const monacoRef = useRef<MonacoEditorInstance | null>(null);

  const content = getActiveContent();

  const markers = diagnostics
    .filter((d) => !d.file || d.file === activeFile || d.file.endsWith(activeFile))
    .map((d) => ({
      startLineNumber: d.line,
      startColumn: d.column,
      endLineNumber: d.line,
      endColumn: d.column + 1,
      message: d.message,
      severity: d.severity === "error" ? 8 : 4,
    }));

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, "typst", markers);
    }
  }, [markers, activeFile]);

  return (
    <div className="h-full min-h-[320px] flex-1">
      <MonacoEditor
        height="100%"
        language="typst"
        theme="vs"
        value={content}
        onChange={(v) => !readOnly && setActiveContent(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        beforeMount={(monaco) => {
          registerTypstLanguage(monaco);
        }}
        onMount={(editor, monaco) => {
          registerTypstLanguage(monaco);
          editorRef.current = editor;
          monacoRef.current = monaco;
          const model = editor.getModel();
          if (model) {
            monaco.editor.setModelMarkers(model, "typst", markers);
          }
        }}
      />
    </div>
  );
}
