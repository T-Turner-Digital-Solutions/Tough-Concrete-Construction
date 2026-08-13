import { CTASection } from '@/components/marketing/CTASection';
import { BRAND } from '@/config/brand';

const CORE_VALUES = [
  {
    title: 'Integrity',
    body: 'We tell you what a project actually costs and what it actually needs — before you sign anything, not after.',
  },
  {
    title: 'Craftsmanship',
    body: 'Every pour is finished to a standard we would put in front of our own house. No shortcuts on prep, cure, or finish.',
  },
  {
    title: 'Safety First',
    body: 'Jobsite safety isn’t a checkbox. Our crews are trained, insured, and held to strict procedures on every site.',
  },
  {
    title: 'On-Time Delivery',
    body: 'We build a real schedule and communicate the moment weather or site conditions change it — never radio silence.',
  },
  {
    title: 'Transparent Communication',
    body: 'ToughTrack™ keeps customers looped in with daily photos, crew ETAs, and status updates from estimate to walkthrough.',
  },
  {
    title: 'Accountability',
    body: 'If something isn’t right, we fix it. Our written warranty backs every job we complete.',
  },
];

const STATS = [
  { value: `${BRAND.yearsInBusiness}+`, label: 'Years in Business' },
  { value: '1,200+', label: 'Projects Completed' },
  { value: `${BRAND.serviceAreas.length}`, label: 'Communities Served' },
  { value: '4.9★', label: 'Average Customer Rating' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative py-20 sm:py-28">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            About Us
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Built by concrete people, for the long haul.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">
            {BRAND.legalName} has poured driveways, patios, foundations, and commercial flatwork across the{' '}
            {BRAND.address.city} area since {BRAND.founded}. We built our name one job at a time — on schedule,
            on budget, and finished right.
          </p>
        </div>
      </section>

      <section className="border-b border-concrete-100 bg-concrete-50 py-10">
        <div className="container-page grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-concrete-900 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-concrete-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Our Story</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
              Founded on a simple idea
            </h2>
            <div className="mt-6 space-y-4 text-concrete-600">
              <p>
                {BRAND.legalName} was founded in {BRAND.founded} on a simple idea: concrete work should be done
                right the first time, priced honestly, and backed by people who answer the phone. What started as a
                small crew pouring residential driveways has grown into a full-service concrete contractor serving
                homeowners, property managers, and general contractors across {BRAND.serviceAreas.length}{' '}
                communities.
              </p>
              <p>
                Over {BRAND.yearsInBusiness}+ years, the tools have changed — we now run every job through
                ToughTrack&trade;, our live project-tracking portal, and quote most preliminary estimates with the
                help of an AI concierge — but the standard hasn&apos;t. Every crew member is trained on our safety
                procedures, every mix is placed to spec, and every customer gets a written, itemized estimate before
                a single yard of concrete is ordered.
              </p>
              <p>
                We&apos;re {BRAND.license.label.toLowerCase()} in {BRAND.license.state}, carrying{' '}
                {BRAND.insurance.generalLiability.toLowerCase()} and {BRAND.insurance.workersComp.toLowerCase()}. It
                matters less as a badge and more as a promise: if something goes wrong, you&apos;re protected.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Site Prep', image: '/gallery/site-prep-grading-1.jpeg' },
              { label: 'Formwork', image: '/gallery/site-prep-driveway-extension.jpeg' },
              { label: 'Pour Day', image: '/gallery/slab-finishing-trowel.jpeg' },
              { label: 'Finished Work', image: '/gallery/driveway-finished-curve.jpeg' },
            ].map((step) => (
              <div key={step.label} className="relative flex aspect-square items-end overflow-hidden rounded-xl bg-concrete-900">
                <img src={step.image} alt={step.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="relative m-4 rounded bg-black/40 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-concrete-900 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-safety-500">What We Stand On</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Our Core Values
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-concrete-400">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Licensed &amp; Insured</p>
            <p className="mt-3 text-concrete-600">
              {BRAND.license.label} ({BRAND.license.number}) in {BRAND.license.state}, carrying{' '}
              {BRAND.insurance.generalLiability.toLowerCase()}
              {BRAND.insurance.bonded ? ' and fully bonded' : ''}.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Safety Culture</p>
            <p className="mt-3 text-concrete-600">
              PPE, jobsite barricades, and daily crew safety checks on every site — residential or commercial.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Reliable Scheduling</p>
            <p className="mt-3 text-concrete-600">
              Weather delays happen — we call before you have to ask, and we rebook the next available pour date
              fast.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
