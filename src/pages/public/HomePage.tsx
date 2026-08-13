import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { ServiceCard } from '@/components/marketing/ServiceCard';
import { TestimonialCard } from '@/components/marketing/TestimonialCard';
import { BeforeAfter } from '@/components/marketing/BeforeAfter';
import { CTASection } from '@/components/marketing/CTASection';
import { BRAND } from '@/config/brand';
import { SERVICE_TYPES } from '@/config/pricing';

const WHY_US = [
  { title: 'Licensed & Insured', body: `${BRAND.license.label} carrying ${BRAND.insurance.generalLiability.toLowerCase()} and workers' comp on every crew.` },
  { title: `${BRAND.yearsInBusiness}+ Years Poured Tough`, body: `Family-owned since ${BRAND.founded}, with thousands of yards of concrete placed across the metro.` },
  { title: 'Real-Time Project Tracking', body: 'Every customer gets ToughTrack™ — live progress, daily photos, and crew ETAs from your phone.' },
  { title: 'Transparent, Written Pricing', body: 'Detailed line-item estimates before you sign — no surprise charges at the end of the job.' },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative flex flex-col gap-8 py-20 sm:py-28 lg:flex-row lg:items-center lg:py-32">
          <div className="max-w-2xl">
            <img
              src="/logo.jpg"
              alt="Tough Concrete Construction, LLC"
              className="mb-6 h-24 w-24 rounded-xl object-cover shadow-card sm:h-28 sm:w-28"
            />
            <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
              {BRAND.serviceAreas[0]?.name} & Surrounding Areas
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white text-balance sm:text-6xl">
              {BRAND.tagline}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-concrete-300">
              Tough Concrete Construction, LLC delivers premium driveways, patios, foundations, and commercial
              flatwork — backed by transparent pricing and real-time project tracking from estimate to final
              inspection.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/request-estimate" size="lg">
                Request a Free Estimate
              </ButtonLink>
              <ButtonLink to="/schedule-site-visit" variant="outline-light" size="lg">
                Schedule a Site Visit
              </ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-concrete-400">
              <span>★★★★★ 4.9 average rating</span>
              <span>{BRAND.yearsInBusiness}+ years in business</span>
              <span>Free written estimates</span>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-3 lg:pl-6">
            {['Driveways', 'Patios', 'Foundations', 'Commercial'].map((label, i) => (
              <div
                key={label}
                className={`flex aspect-square items-end rounded-xl bg-gradient-to-br p-4 ${
                  ['from-concrete-700 to-concrete-900', 'from-steel-700 to-concrete-900', 'from-concrete-600 to-steel-900', 'from-safety-700 to-concrete-900'][i]
                }`}
              >
                <span className="rounded bg-black/30 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-concrete-100 bg-concrete-50 py-4">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-xs font-semibold uppercase tracking-wide text-concrete-500">
          <span>Free Estimates</span>
          <span>·</span>
          <span>Licensed & Bonded</span>
          <span>·</span>
          <span>Written Contracts</span>
          <span>·</span>
          <span>ToughTrack™ Live Updates</span>
          <span>·</span>
          <span>Residential & Commercial</span>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">What We Do</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">Concrete Services</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-steel-700 hover:text-steel-800">
            View all {SERVICE_TYPES.length} services →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_TYPES.slice(0, 8).map((s) => (
            <ServiceCard key={s.key} service={s} />
          ))}
        </div>
      </section>

      <section className="bg-concrete-900 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-safety-500">Why Choose Tough Concrete</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Built On A Reputation That Lasts
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-concrete-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Featured Work</p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">Before &amp; After</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <BeforeAfter label="Driveway Replacement" />
          <BeforeAfter label="Stamped Patio" />
          <BeforeAfter label="Commercial Pad" />
        </div>
        <div className="mt-8 text-center">
          <ButtonLink to="/gallery" variant="outline">
            View the Full Project Gallery
          </ButtonLink>
        </div>
      </section>

      <section className="bg-concrete-50 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-steel-600">Customer Stories</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <TestimonialCard
              quote="They kept us updated every single day through their portal — we always knew exactly when the crew was coming and what was happening."
              name="Sarah R."
              location="Fairview, TX"
              project="Driveway Replacement"
            />
            <TestimonialCard
              quote="Professional from the estimate all the way to the final walkthrough. The stamped patio turned out better than we imagined."
              name="Denise C."
              location="McKinney, TX"
              project="Stamped Patio"
            />
            <TestimonialCard
              quote="As a property manager I need contractors who show up and communicate. Tough Concrete does both, every time."
              name="Property Manager"
              location="Allen, TX"
              project="Commercial Pad Replacement"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Service Area</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
              Proudly Serving {BRAND.address.city} &amp; Beyond
            </h2>
            <p className="mt-4 max-w-lg text-concrete-600">
              We pour residential and commercial concrete across the following communities. Not sure if you're in our
              service area? Reach out — we're always happy to check.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {BRAND.serviceAreas.map((a) => (
                <span key={a.name} className="rounded-full border border-concrete-200 bg-white px-3 py-1.5 text-sm font-medium text-concrete-700">
                  {a.name}, {a.state}
                </span>
              ))}
            </div>
          </div>
          <div className="flex aspect-square items-center justify-center rounded-xl border border-concrete-200 bg-concrete-100 text-concrete-400">
            <span className="text-sm font-semibold uppercase tracking-widest">Service Area Map</span>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
