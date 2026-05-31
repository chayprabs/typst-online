"use client";

import type { OutputFormat } from "@typstbox/shared-types";
import { PdfPreview } from "./PdfPreview";

interface PreviewPaneProps {
  url: string | null;
  urls?: string[];
  format: OutputFormat;
}

export function PreviewPane({ url, urls = [], format }: PreviewPaneProps) {
  const allUrls = urls.length > 0 ? urls : url ? [url] : [];

  if (allUrls.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-[var(--muted)]">
        Compile your document to see a live preview here.
      </div>
    );
  }

  if (format === "pdf") {
    return <PdfPreview url={allUrls[0]} />;
  }

  if (format === "html") {
    return (
      <div className="h-full overflow-auto bg-neutral-50 p-4">
        <iframe
          src={allUrls[0]}
          title="HTML preview"
          className="h-full min-h-[400px] w-full border-0"
        />
        <a
          href={allUrls[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-center text-sm text-[var(--accent)]"
        >
          Open HTML
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-auto bg-neutral-50 p-4">
      <div className="flex flex-col gap-4">
        {allUrls.map((pageUrl, i) => (
          <div key={pageUrl} className="flex flex-col items-center">
            {allUrls.length > 1 && (
              <span className="mb-1 text-xs text-[var(--muted)]">Page {i + 1}</span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pageUrl} alt={`${format} page ${i + 1}`} className="max-w-full shadow-sm" />
          </div>
        ))}
      </div>
      <a
        href={allUrls[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-center text-sm text-[var(--accent)] hover:underline"
      >
        Download {format.toUpperCase()}
      </a>
    </div>
  );
}
