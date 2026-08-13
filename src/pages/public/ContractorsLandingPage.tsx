import { ButtonLink } from '@/components/ui/Button';
import { HeroLogoWatermark } from '@/components/marketing/HeroLogoWatermark';
import { BRAND } from '@/config/brand';

const BENEFITS = [
  {
    title: 'Steady Bid Opportunities',
    body: 'We take on residential and commercial concrete work year-round across our service area — that means a steady stream of bid opportunities, not a single one-off job.',
  },
  {
    title: 'Fast, Reliable Payment',
    body: 'Clear payment terms in every subcontractor agreement, with progress and final payments processed promptly against completed, verified work.',
  },
  {
    title: 'Clear, Written Scopes',
    body: 'Every bid opportunity comes with a defined scope, location, timeline, and requirements — no guessing what you’re actually bidding on.',
  },
  {
    title: 'Digital Bid Comparison',
    body: 'Submit bids directly through the contractor portal — labor, material, and equipment costs broken out clearly for straightforward comparison and award.',
  },
  {
    title: 'Straightforward Agreements',
    body: 'Standardized subcontractor agreements mean less back-and-forth and faster starts once you’re awarded a job.',
  },
  {
    title: 'Real Working Relationships',
    body: 'We track your rating and history with us, so reliable subcontractors get first look at future opportunities.',
  },
];

const TRADES = ['Excavation & Grading', 'Rebar / Reinforcement', 'Concrete Pumping', 'Hauling & Disposal', 'Decorative Finishing'];

const REQUIREMENTS = [
  { title: 'Company Information', body: 'Business name, contact info, and service area or trade specialty.' },
  { title: 'W-9 on File', body: 'Current W-9 for tax and payment processing purposes.' },
  { title: 'Insurance Certificate', body: 'Current certificate of insurance with its expiration date on file.' },
  { title: 'License', body: 'Applicable trade license, where required, with its expiration date on file.' },
  { title: 'References', body: 'A few references we can check from recent, relevant work.' },
];

export default function ContractorsLandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <HeroLogoWatermark />
        <div className="container-page relative py-20 sm:py-28">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            For Subcontractors
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Steady work. Clear scopes. Straight pay.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">
            {BRAND.legalName} partners with licensed, insured subcontractors across excavation, reinforcement,
            pumping, hauling, and decorative finishing. Register once and get access to bid opportunities as they
            open.
          </p>
          <div className="mt-8">
            <ButtonLink to="/contractors/login" size="lg">
              Contractor Login / Register
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Why Subcontract With Us</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
            Built for contractors who show up
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-concrete-500">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-concrete-900 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-safety-500">Trades We Work With</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Trades We Regularly Need
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {TRADES.map((trade) => (
              <span
                key={trade}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
              >
                {trade}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Getting Registered</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
            What you&apos;ll need to register
          </h2>
          <p className="mt-4 text-concrete-600">
            Registration is quick — have the following ready and you can complete it in one sitting through the
            contractor portal.
          </p>
        </div>
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REQUIREMENTS.map((r, i) => (
            <li key={r.title} className="rounded-xl border border-concrete-200 bg-concrete-50 p-6">
              <span className="font-display text-2xl font-bold text-steel-600">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-base font-bold uppercase tracking-wide text-concrete-900">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-concrete-500">{r.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-concrete-panel bg-concrete-900 py-16 sm:py-20">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Ready to start bidding?
          </h2>
          <p className="max-w-xl text-concrete-300">
            Log in or register through the contractor portal to view current bid opportunities and submit your
            information.
          </p>
          <ButtonLink to="/contractors/login" size="lg">
            Contractor Login / Register
          </ButtonLink>
          <a href={`tel:${BRAND.phone}`} className="text-sm font-semibold text-concrete-400 hover:text-white">
            or call us directly at {BRAND.phoneDisplay}
          </a>
        </div>
      </section>
    </div>
  );
}
