import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — TypstBox",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
      <p className="text-sm text-[var(--muted)]">Last updated: May 31, 2026</p>

      <section className="mt-6 space-y-4 text-sm leading-relaxed">
        <p>
          By using TypstBox you agree to these terms. If you do not agree, do not use the
          service.
        </p>

        <h2 className="text-lg font-medium">Service provided &quot;as is&quot;</h2>
        <p>
          TypstBox is provided without warranties of any kind, express or implied, including
          merchantability, fitness for a particular purpose, or non-infringement. We do not
          guarantee uninterrupted or error-free compilation.
        </p>

        <h2 className="text-lg font-medium">Acceptable use</h2>
        <p>
          You may not use the service to distribute malware, violate laws, harass others, or
          attempt to disrupt infrastructure (including automated compile storms). We may rate-limit
          or block abusive traffic.
        </p>

        <h2 className="text-lg font-medium">Your content</h2>
        <p>
          You retain ownership of documents you submit. You grant us a limited license to process
          them solely to provide compilation and related features you request.
        </p>

        <h2 className="text-lg font-medium">Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, TypstBox and its contributors shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages, or any loss
          of profits, data, or goodwill, arising from your use of the service.
        </p>

        <h2 className="text-lg font-medium">Open source</h2>
        <p>
          Source code is licensed under AGPL-3.0. Self-hosting is encouraged; hosted instances may
          have additional operational policies.
        </p>

        <h2 className="text-lg font-medium">Changes</h2>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
      </section>

      <p className="mt-8">
        <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
          ← Back to TypstBox
        </Link>
      </p>
    </article>
  );
}
