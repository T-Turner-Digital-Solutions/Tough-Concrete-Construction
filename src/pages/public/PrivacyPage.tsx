import { BRAND } from '@/config/brand';
import { formatDate } from '@/lib/format';

const LAST_UPDATED = '2026-07-01';

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-concrete-500">Last updated: {formatDate(LAST_UPDATED)}</p>
        <p className="mt-4 rounded-lg border border-safety-200 bg-safety-50 p-4 text-sm italic text-concrete-700">
          This is placeholder / starter legal content generated for platform development purposes. It should be
          reviewed and approved by qualified legal counsel before being relied upon in production.
        </p>

        <div className="prose-sections mt-10 space-y-8 text-concrete-700">
          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">1. Introduction</h2>
            <p className="mt-3 leading-relaxed">
              {BRAND.legalName} (&ldquo;{BRAND.dbaName}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
              respects your privacy and is committed to protecting the personal information you share with us
              through our website, estimating tools, customer portal, and contractor portal (collectively, the
              &ldquo;Platform&rdquo;). This Privacy Policy explains what information we collect, how we use it, and
              the choices you have.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">2. Information We Collect</h2>
            <p className="mt-3 leading-relaxed">Depending on how you interact with us, we may collect:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                <strong>Contact and identity information:</strong> name, email address, phone number, mailing and
                project address.
              </li>
              <li>
                <strong>Project details:</strong> service type, measurements, desired finish, budget range, start
                date, and project description submitted through estimate requests or our AI concierge.
              </li>
              <li>
                <strong>Photos and documents:</strong> project or site photos, plans, permits, and related files you
                upload.
              </li>
              <li>
                <strong>Account and portal data:</strong> login credentials, role, appointment history, messages,
                estimates, contracts, invoices, and change orders associated with your account.
              </li>
              <li>
                <strong>Payment records:</strong> invoice and payment status processed through a third-party payment
                processor. We do not store full payment card or bank account numbers on our own servers.
              </li>
              <li>
                <strong>Contractor information:</strong> for subcontractors, company information, W-9 details,
                insurance certificates, license numbers and expirations, and references.
              </li>
              <li>
                <strong>Usage and device data:</strong> pages visited, browser type, device information, and
                analytics collected via cookies or similar technologies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">3. How We Use Your Information</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Prepare and deliver estimates, contracts, invoices, and project updates.</li>
              <li>Schedule and coordinate site visits, crews, and appointments.</li>
              <li>Operate the customer and contractor portals, including ToughTrack&trade; progress tracking.</li>
              <li>Communicate with you about your project, account, or inquiries.</li>
              <li>Evaluate and manage subcontractor relationships and bid opportunities.</li>
              <li>Process payments through our third-party payment processor.</li>
              <li>Improve our website, services, and internal operations, including via analytics.</li>
              <li>Comply with legal, licensing, insurance, and tax obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">4. Cookies &amp; Analytics</h2>
            <p className="mt-3 leading-relaxed">
              We may use cookies and similar technologies to keep you signed in, remember preferences, and
              understand how visitors use our website through analytics tools. You can control cookies through your
              browser settings; disabling cookies may affect portal functionality.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">5. How We Share Information</h2>
            <p className="mt-3 leading-relaxed">
              We do not sell your personal information. We share information only as needed to operate our
              business, including with:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Payment processors, to securely process deposits and invoices.</li>
              <li>Hosting, database, and infrastructure providers who store platform data on our behalf.</li>
              <li>Subcontractors and trade partners, limited to the project details necessary to complete work.</li>
              <li>Professional advisors (legal, accounting, insurance) where necessary.</li>
              <li>Government or regulatory authorities where required by law, permit, or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">6. Data Security</h2>
            <p className="mt-3 leading-relaxed">
              We use reasonable administrative, technical, and physical safeguards designed to protect personal
              information against unauthorized access, alteration, disclosure, or destruction. No method of
              transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">7. Data Retention</h2>
            <p className="mt-3 leading-relaxed">
              We retain personal information for as long as needed to provide our services, maintain business
              records, and comply with legal, tax, licensing, and insurance obligations, after which it is deleted
              or anonymized in accordance with our internal retention practices.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">8. Your Rights &amp; Choices</h2>
            <p className="mt-3 leading-relaxed">
              Depending on your location, you may have the right to request access to, correction of, or deletion
              of your personal information, or to opt out of certain communications. To exercise these rights,
              contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">9. Children&apos;s Privacy</h2>
            <p className="mt-3 leading-relaxed">
              Our Platform is intended for business and residential customers, contractors, and prospective
              customers over the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">10. Changes to This Policy</h2>
            <p className="mt-3 leading-relaxed">
              We may update this Privacy Policy from time to time. Material changes will be reflected by updating
              the &ldquo;Last updated&rdquo; date above.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">11. Contact Us</h2>
            <p className="mt-3 leading-relaxed">
              Questions about this Privacy Policy or your personal information can be directed to{' '}
              <a href={`mailto:${BRAND.email}`} className="font-semibold text-steel-700 hover:text-steel-800">
                {BRAND.email}
              </a>{' '}
              or {BRAND.phoneDisplay}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
