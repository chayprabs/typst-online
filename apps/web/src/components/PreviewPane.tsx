"use client";

import type { OutputFormat } from "@typstbox/shared-types";
import { PdfPreview } from "./PdfPreview";

interface PreviewPaneProps {
  url: string | null;
  format: OutputFormat;
}

export function PreviewPane({ url, format }: PreviewPaneProps) {
  if (!url) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-[var(--muted)]">
        Compile your document to see a live preview here.
      </div>
    );
  }

  if (format === "pdf") {
    return <PdfPreview url={url} />;
  }

  if (format === "html") {
    return (
      <div className="h-full overflow-auto bg-neutral-50 p-4">
        <iframe src={url} title="HTML preview" className="h-full min-h-[400px] w-full border-0" />
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 block text-center text-sm text-[var(--accent)]">
          Open HTML
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center overflow-auto bg-neutral-50 p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={`${format} preview`} className="max-w-full shadow-sm" />
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm text-[var(--accent)] hover:underline">
        Download {format.toUpperCase()}
      </a>
    </div>
  );
}
