"use client";

import { useEffect, useRef, useState } from "react";

interface PdfPreviewProps {
  url: string | null;
}

export function PdfPreview({ url }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url || !canvasRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const doc = await pdfjs.getDocument(url).promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Preview failed");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!url) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-[var(--muted)]">
        Compile your document to see a live PDF preview here.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-auto bg-neutral-50 p-4">
      {loading && <p className="text-sm text-[var(--muted)]">Rendering preview…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <canvas ref={canvasRef} className="mx-auto max-w-full shadow-sm" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-center text-sm text-[var(--accent)] hover:underline"
      >
        Open / download PDF
      </a>
    </div>
  );
}
