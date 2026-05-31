import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — TypstBox",
  description:
    "How TypstBox collects, uses, retains, and protects information when you use the online Typst compiler and editor.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-sm text-[var(--muted)]">Last updated: {LEGAL.lastUpdated}</p>

      <section className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--foreground)]">
        <p className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-950">
          This Privacy Policy describes how {LEGAL.productName} (&quot;{LEGAL.productName}&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) handles information when you use the
          website, application programming interfaces, and related services (collectively, the
          &quot;Service&quot;). The Service is operated by {LEGAL.operatorName} (&quot;
          {LEGAL.operatorName}&quot;, &quot;Operator&quot;). This document is provided for
          transparency and compliance purposes; it is not legal advice.
        </p>

        <h2 className="pt-2 text-lg font-medium">1. Scope</h2>
        <p>
          This policy applies to visitors and users of the publicly hosted Service at domains
          controlled by the Operator, and to information practices described here. If you
          self-host the open-source software from{" "}
          <a href={LEGAL.githubRepo} className="text-[var(--accent)] hover:underline">
            {LEGAL.repoName}
          </a>
          , your instance is governed by your own policies; this document does not apply to
          third-party deployments unless the Operator expressly operates them.
        </p>

        <h2 className="text-lg font-medium">2. Information we process</h2>
        <p>Depending on how you use the Service, we may process the following categories:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Document content:</strong> Typst source code, uploaded fonts, images, data
            files, and other materials you submit for compilation (&quot;User Content&quot;).
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, request timestamps, HTTP
            headers, error codes, rate-limit counters, and similar diagnostics needed to operate
            and secure the Service.
          </li>
          <li>
            <strong>Share identifiers:</strong> If you create a share link, a copy of your
            project may be stored under an opaque identifier until deleted or expired.
          </li>
          <li>
            <strong>Communications:</strong> Information you send when contacting us (e.g. support
            or security reports).
          </li>
        </ul>
        <p>
          We do not require account registration for basic use. We do not intentionally collect
          government ID numbers, payment card data, or precise geolocation for advertising on the
          public Service.
        </p>

        <h2 className="text-lg font-medium">3. How we use information</h2>
        <p>We use information only as necessary to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Compile documents and deliver outputs you request;</li>
          <li>Provide share, export, preview, and related features;</li>
          <li>Maintain security, abuse prevention, and rate limiting;</li>
          <li>Improve reliability and fix errors (using aggregated or technical data);</li>
          <li>Comply with applicable law and enforce our Terms.</li>
        </ul>
        <p>
          Where the General Data Protection Regulation (GDPR) or similar laws apply, our legal
          bases typically include performance of a contract (providing the Service you request),
          legitimate interests (security and abuse prevention), and consent where required (e.g.
          optional features you explicitly enable).
        </p>

        <h2 className="text-lg font-medium">4. Retention</h2>
        <p>
          User Content and compile artifacts are processed in ephemeral storage and are
          automatically deleted after a limited retention period (typically within one hour),
          unless a longer period is technically required for an in-flight job or share link.
          Share snapshots persist until removed, expired, or overwritten. Technical logs may be
          retained for a longer period for security and auditing, generally in minimized form
          without document bodies where feasible.
        </p>

        <h2 className="text-lg font-medium">5. Sharing and disclosure</h2>
        <p>
          We do not sell your personal information. We do not share User Content with advertisers.
          We may disclose information only:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>To infrastructure providers that host the Service under confidentiality obligations;</li>
          <li>When required by law, court order, or lawful government request;</li>
          <li>To protect rights, safety, and security of users, the Operator, or the public;</li>
          <li>In connection with a merger, acquisition, or asset sale (with notice where required).</li>
        </ul>
        <p>
          The Service may load open-source libraries (e.g. PDF rendering) from content delivery
          networks. Those providers may receive standard browser requests; we do not authorize
          them to use your data for their own marketing.
        </p>

        <h2 className="text-lg font-medium">6. International transfers</h2>
        <p>
          The Service may be operated from or use servers in jurisdictions other than your own.
          By using the Service, you acknowledge that information may be processed in countries
          that may have different data-protection laws than your country of residence. Where
          required, we rely on appropriate safeguards (such as standard contractual clauses or
          equivalent mechanisms) for cross-border transfers.
        </p>

        <h2 className="text-lg font-medium">7. Security</h2>
        <p>
          We implement reasonable technical and organizational measures (rate limiting, ephemeral
          storage, access controls on infrastructure). No method of transmission or storage is
          100% secure; you use the Service at your own risk.
        </p>

        <h2 className="text-lg font-medium">8. Children</h2>
        <p>
          The Service is not directed to children under 16 (or the minimum age required in your
          jurisdiction). We do not knowingly collect personal information from children. If you
          believe a child has provided data, contact us and we will delete it where required by
          law.
        </p>

        <h2 className="text-lg font-medium">9. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, delete, restrict,
          or object to processing of your personal information, and to data portability or
          withdrawal of consent. To exercise rights, contact us using the details below. We may
          need to verify your request. You may also lodge a complaint with your local data
          protection authority.
        </p>
        <p>
          California and similar jurisdictions: we do not sell personal information as defined
          under the CCPA/CPRA for the public Service. Rights to know, delete, and correct may
          apply where you are a resident of those jurisdictions and we are subject to those laws.
        </p>

        <h2 className="text-lg font-medium">10. Your responsibilities</h2>
        <p>
          Do not submit sensitive personal data (health, financial account numbers, passwords,
          legally privileged material you are not authorized to upload) unless you accept the
          risks of online processing. You are responsible for backups and for compliance with laws
          applicable to your documents.
        </p>

        <h2 className="text-lg font-medium">11. Changes</h2>
        <p>
          We may update this Privacy Policy. The &quot;Last updated&quot; date will change.
          Material changes may be announced on the Service or repository. Continued use after
          changes become effective constitutes acceptance where permitted by law.
        </p>

        <h2 className="text-lg font-medium">12. Contact</h2>
        <p>
          Operator: {LEGAL.operatorName}
          <br />
          Website:{" "}
          <a href={LEGAL.operatorSite} className="text-[var(--accent)] hover:underline">
            {LEGAL.operatorSite}
          </a>
          <br />
          Email:{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-[var(--accent)] hover:underline">
            {LEGAL.contactEmail}
          </a>
        </p>
        <p>
          See also our{" "}
          <Link href="/terms" className="text-[var(--accent)] hover:underline">
            Terms &amp; Conditions
          </Link>
          .
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
