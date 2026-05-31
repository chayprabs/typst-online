import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Typst to PDF Online — TypstBox",
  description:
    "Convert Typst documents to PDF online. Live editor, version pinning, templates, and instant download.",
};

export default function TypstToPdfPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
      <h1 className="text-2xl font-semibold">Typst to PDF Online</h1>
      <p className="mt-2 text-[var(--muted)]">
        Paste or write Typst markup in our editor and compile to PDF with one click. Pin compiler
        versions, use templates, and preview live.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
      >
        Open compiler
      </Link>
    </div>
  );
}
