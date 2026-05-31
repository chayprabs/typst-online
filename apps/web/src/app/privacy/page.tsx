import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — TypstBox",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 prose prose-neutral">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-sm text-[var(--muted)]">Last updated: May 31, 2026</p>

      <section className="mt-6 space-y-4 text-sm leading-relaxed">
        <p>
          TypstBox (&quot;we&quot;, &quot;the service&quot;) is operated as an open-source tool. This policy
          explains how we handle information when you use typst-online.
        </p>

        <h2 className="text-lg font-medium">What we collect</h2>
        <p>
          When you compile a document, your Typst source and uploaded assets are sent to our
          servers (or your self-hosted worker) solely to perform compilation. We do not require
          an account for basic use.
        </p>

        <h2 className="text-lg font-medium">Retention</h2>
        <p>
          Projects and compile artifacts are stored in ephemeral directories and deleted after a
          short retention period (default one hour) unless you explicitly save them via a future
          signed-in feature. Shared read-only links store a copy until the share is removed or
          expires.
        </p>

        <h2 className="text-lg font-medium">Logs</h2>
        <p>
          We may log request metadata (IP address, timestamps, error codes) for abuse prevention
          and reliability. We do not intentionally log document contents or uploaded filenames
          when they may be sensitive.
        </p>

        <h2 className="text-lg font-medium">Third parties</h2>
        <p>
          We do not sell personal data. PDF preview may load pdf.js from a CDN when enabled. No
          advertising or third-party tracking scripts are used on the playground.
        </p>

        <h2 className="text-lg font-medium">Your rights</h2>
        <p>
          You may stop using the service at any time. For self-hosted deployments, you control all
          data on your infrastructure.
        </p>

        <h2 className="text-lg font-medium">Contact</h2>
        <p>
          Questions:{" "}
          <a href="https://www.chaitanyaprabuddha.com" className="text-[var(--accent)]">
            chaitanyaprabuddha.com
          </a>
        </p>
      </section>

      <p className="mt-8">
        <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
          ← Back to TypstBox
        </Link>
      </p>
    </article>
  );
}
