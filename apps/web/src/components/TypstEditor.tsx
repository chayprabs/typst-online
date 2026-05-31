"use client";

import dynamic from "next/dynamic";
import { useProjectStore } from "@/store/project-store";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export function TypstEditor() {
  const { getActiveContent, setActiveContent, activeFile, diagnostics } = useProjectStore();
  const content = getActiveContent();

  const markers = diagnostics
    .filter((d) => d.file === activeFile || d.file === "" || d.file.endsWith(activeFile))
    .map((d) => ({
      startLineNumber: d.line,
      startColumn: d.column,
      endLineNumber: d.line,
      endColumn: d.column + 1,
      message: d.message,
      severity: d.severity === "error" ? 8 : 4,
    }));

  return (
    <div className="h-full min-h-[320px] flex-1 border-r border-[var(--border)]">
      <MonacoEditor
        height="100%"
        language="plaintext"
        theme="vs"
        value={content}
        onChange={(v) => setActiveContent(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onMount={(editor, monaco) => {
          monaco.editor.setModelMarkers(editor.getModel()!, "typst", markers);
        }}
      />
    </div>
  );
}
