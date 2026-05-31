import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — TypstBox",
  description:
    "Frequently asked questions about TypstBox online Typst editor, PDF compilation, packages, and self-hosting.",
};

export default function FaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>

      <section className="mt-8 space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-medium">What is TypstBox?</h2>
          <p className="mt-1 text-[var(--muted)]">
            TypstBox is a free online Typst editor and compiler. Write Typst markup in your browser,
            preview PDF live, and export PDF, SVG, PNG, or HTML without installing Typst locally.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium">Which Typst versions are supported?</h2>
          <p className="mt-1 text-[var(--muted)]">
            We pin the last three stable typst-cli releases. Select your version in the left sidebar
            before compiling.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium">Can I use Typst Universe packages?</h2>
          <p className="mt-1 text-[var(--muted)]">
            Yes, from an allowlisted set (e.g. @preview/cetz). Search packages in the left sidebar
            and pick a version. Non-allowlisted packages are blocked for security.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium">Is my document stored permanently?</h2>
          <p className="mt-1 text-[var(--muted)]">
            No. Projects compile in ephemeral directories and artifacts expire after a short TTL
            unless you download them. See our{" "}
            <Link href="/privacy" className="text-[var(--accent)] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium">How do I self-host?</h2>
          <p className="mt-1 text-[var(--muted)]">
            Clone{" "}
            <a
              href="https://github.com/chayprabs/typst-online"
              className="text-[var(--accent)] hover:underline"
            >
              typst-online
            </a>{" "}
            and run <code className="rounded bg-neutral-100 px-1">docker compose up --build</code>.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium">What license applies?</h2>
          <p className="mt-1 text-[var(--muted)]">
            TypstBox is AGPL-3.0. You may use, modify, and self-host under those terms.
          </p>
        </div>
      </section>

      <p className="mt-10">
        <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
          ← Back to TypstBox
        </Link>
      </p>
    </article>
  );
}
