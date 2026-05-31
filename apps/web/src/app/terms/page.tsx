import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — TypstBox",
  description:
    "Terms of use for TypstBox online Typst editor and compiler, including disclaimers and limitation of liability.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
      <p className="text-sm text-[var(--muted)]">Last updated: {LEGAL.lastUpdated}</p>

      <section className="mt-6 space-y-4 text-sm leading-relaxed">
        <p className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-950">
          Please read these Terms &amp; Conditions (&quot;Terms&quot;) carefully. By accessing or
          using {LEGAL.productName} (the &quot;Service&quot;), operated by {LEGAL.operatorName} (
          &quot;Operator&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these
          Terms. If you do not agree, do not use the Service. These Terms are a binding legal
          agreement between you and the Operator.
        </p>

        <h2 className="pt-2 text-lg font-medium">1. The Service</h2>
        <p>
          {LEGAL.productName} provides an online Typst editor and document compilation tools. The
          Service is offered free of charge for basic use. Source code is available under the GNU
          Affero General Public License v3.0 (&quot;AGPL-3.0&quot;). Hosted operation of the
          Service is separate from your rights under AGPL-3.0 when you obtain a copy of the
          software.
        </p>
        <p>
          The Service does not provide legal, financial, medical, or professional advice. Output
          quality depends on your source files, fonts, packages, and the upstream Typst compiler.
        </p>

        <h2 className="text-lg font-medium">2. Eligibility</h2>
        <p>
          You must be at least 16 years old (or the age of digital consent in your jurisdiction,
          whichever is higher) and able to form a binding contract. By using the Service, you
          represent that you meet these requirements and that your use complies with all applicable
          laws in your country and locality.
        </p>

        <h2 className="text-lg font-medium">3. User Content</h2>
        <p>
          You retain ownership of documents and materials you submit (&quot;User Content&quot;).
          You grant the Operator a worldwide, non-exclusive, royalty-free license to host,
          reproduce, process, and transmit User Content solely as necessary to provide the Service
          (including compilation, preview, sharing, and export). This license ends when User
          Content is deleted from our systems, except for backup copies retained briefly for
          technical reasons or as required by law.
        </p>
        <p>
          You are solely responsible for User Content and for ensuring you have all rights,
          licenses, and permissions needed to upload and compile it, including fonts, images, and
          third-party Typst packages.
        </p>

        <h2 className="text-lg font-medium">4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Violate any applicable law or third-party rights;</li>
          <li>Upload malware, unlawful content, or material that infringes copyright or privacy;</li>
          <li>Harass, threaten, or defraud others;</li>
          <li>Attempt unauthorized access, probe vulnerabilities, or bypass rate limits;</li>
          <li>Use automated means to overload the Service (compile storms, scraping beyond fair use);</li>
          <li>Resell the hosted Service as a competing hosted offering without compliance with AGPL-3.0;</li>
          <li>Misrepresent affiliation with the Operator or {LEGAL.productName}.</li>
        </ul>
        <p>
          We may suspend or block access, remove content, or report activity to authorities where
          we reasonably believe necessary.
        </p>

        <h2 className="text-lg font-medium">5. Third-party software</h2>
        <p>
          The Service depends on third-party components (including Typst, Monaco Editor, and
          system fonts). They are subject to their own licenses. The Operator does not control and
          is not responsible for third-party software, package registries, or external websites
          you link to from User Content.
        </p>

        <h2 className="text-lg font-medium">6. Disclaimer of warranties</h2>
        <p className="uppercase">
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING IMPLIED
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
          NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE,
          SECURE, OR THAT OUTPUTS WILL BE ACCURATE, COMPLETE, OR SUITABLE FOR ANY PURPOSE. YOU
          USE THE SERVICE AT YOUR SOLE RISK.
        </p>

        <h2 className="text-lg font-medium">7. Limitation of liability</h2>
        <p className="uppercase">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW IN ANY JURISDICTION, IN NO EVENT SHALL
          THE OPERATOR, ITS CONTRIBUTORS, AFFILIATES, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF
          PROFITS, REVENUE, DATA, GOODWILL, BUSINESS INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE
          SERVICES, ARISING OUT OF OR RELATED TO THE SERVICE OR THESE TERMS, WHETHER BASED ON
          WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER THEORY,
          EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p className="uppercase">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR&apos;S TOTAL AGGREGATE LIABILITY
          FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS SHALL NOT EXCEED
          THE GREATER OF: (A) THE AMOUNTS YOU PAID TO THE OPERATOR FOR THE SERVICE IN THE TWELVE
          (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM; OR (B) ONE HUNDRED US DOLLARS
          (USD $100.00) OR THE EQUIVALENT IN YOUR LOCAL CURRENCY. IF YOU HAVE PAID NOTHING, THE
          CAP IS USD $100.00 (OR EQUIVALENT).
        </p>
        <p>
          Some jurisdictions do not allow exclusion of certain warranties or limitation of
          liability for incidental or consequential damages. In those jurisdictions, our
          liability is limited to the greatest extent permitted by law.
        </p>

        <h2 className="text-lg font-medium">8. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless the Operator, contributors, and
          service providers from and against any claims, damages, losses, liabilities, costs, and
          expenses (including reasonable attorneys&apos; fees) arising out of or related to: (a)
          your User Content; (b) your use of the Service; (c) your violation of these Terms or any
          law; or (d) your violation of any third-party rights. We may assume exclusive defense of
          any matter subject to indemnification; you will cooperate at your expense.
        </p>

        <h2 className="text-lg font-medium">9. Release</h2>
        <p>
          To the fullest extent permitted by law, you release the Operator from claims, demands,
          and damages of every kind, known and unknown, arising out of or in any way connected with
          disputes between you and third parties relating to User Content or use of the Service.
          If you are a California resident, you waive California Civil Code § 1542 (and similar
          laws elsewhere) to the extent permitted.
        </p>

        <h2 className="text-lg font-medium">10. Intellectual property</h2>
        <p>
          The {LEGAL.productName} name, branding, and original site content are owned by the
          Operator or licensors. Software is licensed under AGPL-3.0 as stated in the repository.
          Typst and other third-party marks belong to their respective owners. No trademark
          license is granted by these Terms.
        </p>

        <h2 className="text-lg font-medium">11. Copyright complaints</h2>
        <p>
          If you believe material on the Service infringes your copyright, send a notice to{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-[var(--accent)] hover:underline">
            {LEGAL.contactEmail}
          </a>{" "}
          with: identification of the work, identification of the material, your contact
          information, a good-faith statement, and your signature (physical or electronic). We may
          remove material and terminate repeat infringers where appropriate.
        </p>

        <h2 className="text-lg font-medium">12. Export control</h2>
        <p>
          You may not use the Service in violation of export control or sanctions laws of any
          applicable country, including restrictions on embargoed regions or denied parties.
        </p>

        <h2 className="text-lg font-medium">13. Termination</h2>
        <p>
          We may modify, suspend, or discontinue the Service at any time without liability. We may
          terminate or restrict your access for any violation of these Terms. Sections that by
          nature should survive (disclaimers, limitation of liability, indemnification, governing
          law) survive termination.
        </p>

        <h2 className="text-lg font-medium">14. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws of {LEGAL.governingLaw}, without regard to
          conflict-of-law principles that would apply another jurisdiction&apos;s laws, except
          where mandatory consumer protection rules in your country of residence require
          otherwise.
        </p>
        <p>
          Any dispute arising out of or relating to these Terms or the Service shall be subject
          to the exclusive jurisdiction of the courts located in {LEGAL.governingLaw}, and you
          consent to personal jurisdiction and venue therein, except where prohibited by
          mandatory law in your country of habitual residence.
        </p>
        <p>
          Before filing a claim, you agree to contact us at{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-[var(--accent)] hover:underline">
            {LEGAL.contactEmail}
          </a>{" "}
          and attempt good-faith informal resolution for at least thirty (30) days.
        </p>

        <h2 className="text-lg font-medium">15. Class action waiver</h2>
        <p>
          To the extent permitted by law, disputes will be resolved only on an individual basis.
          You waive any right to participate in a class, collective, or representative action
          against the Operator.
        </p>

        <h2 className="text-lg font-medium">16. General</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Severability:</strong> If any provision is unenforceable, the remainder stays
            in effect.
          </li>
          <li>
            <strong>No waiver:</strong> Failure to enforce a provision is not a waiver.
          </li>
          <li>
            <strong>Assignment:</strong> We may assign these Terms; you may not without consent.
          </li>
          <li>
            <strong>Entire agreement:</strong> These Terms and the Privacy Policy are the entire
            agreement regarding the hosted Service.
          </li>
        </ul>

        <h2 className="text-lg font-medium">17. Changes</h2>
        <p>
          We may update these Terms. Continued use after the effective date constitutes acceptance
          where permitted by law.
        </p>

        <h2 className="text-lg font-medium">18. Contact</h2>
        <p>
          {LEGAL.operatorName}
          <br />
          <a href={LEGAL.operatorSite} className="text-[var(--accent)] hover:underline">
            {LEGAL.operatorSite}
          </a>
          <br />
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-[var(--accent)] hover:underline">
            {LEGAL.contactEmail}
          </a>
        </p>
        <p>
          <Link href="/privacy" className="text-[var(--accent)] hover:underline">
            Privacy Policy
          </Link>
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
