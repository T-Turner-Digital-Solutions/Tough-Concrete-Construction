import { BRAND } from '@/config/brand';
import { formatDate } from '@/lib/format';

const LAST_UPDATED = '2026-07-01';

export default function TermsPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-concrete-500">Last updated: {formatDate(LAST_UPDATED)}</p>
        <p className="mt-4 rounded-lg border border-safety-200 bg-safety-50 p-4 text-sm italic text-concrete-700">
          This is placeholder / starter legal content generated for platform development purposes. It should be
          reviewed and approved by qualified legal counsel before being relied upon in production.
        </p>

        <div className="mt-10 space-y-8 text-concrete-700">
          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">1. Acceptance of Terms</h2>
            <p className="mt-3 leading-relaxed">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the {BRAND.legalName} website,
              estimating tools, AI concierge, and the customer and contractor portals (collectively, the
              &ldquo;Platform&rdquo;). By accessing or using the Platform, you agree to be bound by these Terms. If
              you do not agree, do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">2. Preliminary Estimates &amp; the AI Concierge</h2>
            <p className="mt-3 leading-relaxed">
              Our website and AI concierge tools may generate preliminary cost estimates based on information you
              provide (measurements, service type, photos, and similar details). These tools are provided for
              convenience and planning purposes only.
            </p>
            <p className="mt-3 rounded-lg border border-concrete-200 bg-concrete-50 p-4 leading-relaxed">
              <strong>This preliminary estimate is based on the information provided and is not a binding quote.</strong>{' '}
              Final pricing is subject to site conditions, verified measurements, accessibility, material
              requirements, project specifications, and final approval by {BRAND.legalName}. Services flagged as
              requiring a site inspection will not receive preliminary pricing at all and require an in-person
              review before any pricing is issued.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">3. Estimates, Contracts &amp; Change Orders</h2>
            <p className="mt-3 leading-relaxed">
              A binding agreement is formed only once a written estimate is approved and a corresponding contract is
              signed by both parties. Any change to project scope after signing must be documented as a formal
              change order and approved before the additional work begins or additional cost is billed.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">4. Account &amp; Portal Use</h2>
            <p className="mt-3 leading-relaxed">
              Customer and contractor portal accounts are provided to authorized users for the purpose of managing
              their own projects, bids, documents, and communications. You are responsible for maintaining the
              confidentiality of your login credentials and for all activity under your account. Portal access may
              be limited to the role assigned to your account (customer, contractor, or staff), and you agree not
              to attempt to access data or areas of the Platform outside your authorized role.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">5. Payment Terms</h2>
            <p className="mt-3 leading-relaxed">
              Deposits, progress payments, and final balances are governed by the payment terms stated in your
              individual estimate, contract, and invoices. Payments are processed through a third-party payment
              processor; by submitting payment you agree to that processor&apos;s applicable terms. Late or unpaid
              balances may result in delayed scheduling, added fees, or other remedies as described in your
              contract.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">6. Contractor Bids &amp; Opportunities</h2>
            <p className="mt-3 leading-relaxed">
              Subcontractors using the contractor portal to view bid opportunities and submit bids do so subject to
              our contractor registration requirements (including current insurance, licensing, and reference
              information). Submission of a bid does not guarantee award of work, and any awarded work is governed
              by a separate subcontractor agreement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">7. Intellectual Property</h2>
            <p className="mt-3 leading-relaxed">
              All content on the Platform, including text, graphics, logos, and software, is owned by or licensed to
              {` ${BRAND.legalName}`} and may not be copied, reproduced, or used without permission, except as
              necessary to use the Platform for its intended purpose.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">8. Limitation of Liability</h2>
            <p className="mt-3 leading-relaxed">
              To the fullest extent permitted by law, {BRAND.legalName} shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the Platform, including
              reliance on any preliminary estimate. Our liability for completed construction work is governed
              exclusively by the terms of the applicable signed contract and any associated workmanship warranty.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">9. Disclaimer of Warranties</h2>
            <p className="mt-3 leading-relaxed">
              The Platform, including all estimating tools and AI-generated content, is provided &ldquo;as is&rdquo;
              without warranties of any kind, express or implied, except as expressly stated in a signed
              construction contract or written warranty document.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">10. Governing Law</h2>
            <p className="mt-3 leading-relaxed">
              These Terms are governed by the laws of the State of {BRAND.license.state}, without regard to its
              conflict of laws principles, and any disputes shall be resolved in the courts located in that state.
              [Placeholder — confirm venue and governing law with counsel.]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">11. Changes to These Terms</h2>
            <p className="mt-3 leading-relaxed">
              We may update these Terms from time to time. Continued use of the Platform after changes are posted
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-concrete-900">12. Contact Us</h2>
            <p className="mt-3 leading-relaxed">
              Questions about these Terms can be directed to{' '}
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
