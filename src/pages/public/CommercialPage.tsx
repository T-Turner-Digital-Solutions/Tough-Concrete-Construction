import { ServiceCard } from '@/components/marketing/ServiceCard';
import { ButtonLink } from '@/components/ui/Button';
import { CTASection } from '@/components/marketing/CTASection';
import { PhotoShowcase, type ShowcasePhoto } from '@/components/marketing/PhotoShowcase';
import { SERVICE_TYPES, type ServiceTypeKey } from '@/config/pricing';
import { SERVICE_IMAGES } from '@/config/serviceImages';
import { BRAND } from '@/config/brand';

const COMMERCIAL_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/structural-commercial-entry.jpeg', title: 'Commercial Entry Pad', caption: 'Commercial building entry and parking apron, poured to spec.', serviceKey: 'commercial' },
  { image: '/gallery/structural-foundation.jpeg', title: 'Foundation Walls', caption: 'Poured foundation walls and footings, waterproofed and backfilled.', serviceKey: 'foundation' },
  { image: '/gallery/structural-equipment-pad.jpeg', title: 'Equipment Pads', caption: 'Level, reinforced pads for HVAC condenser units.', serviceKey: 'equipment_pad' },
  { image: '/gallery/structural-dumpster-pad.jpeg', title: 'Dumpster Pad', caption: 'Heavy-duty commercial dumpster pad with bollards.', serviceKey: 'dumpster_pad' },
  { image: '/gallery/structural-drainage.jpeg', title: 'Drainage Channel', caption: 'Trench drain tied into a downspout and channeled away from the building.', serviceKey: 'drainage' },
  { image: '/gallery/repair-removal-demolition.jpeg', title: 'Concrete Demolition', caption: 'Breaking out and hauling off failing concrete ahead of a full replacement.', serviceKey: 'removal' },
];

const COMMERCIAL_KEYS: ServiceTypeKey[] = [
  'commercial',
  'parking_pad',
  'foundation',
  'equipment_pad',
  'dumpster_pad',
  'drainage',
  'removal',
  'replacement',
];

const WORKING_WITH = [
  {
    title: 'Bidding & Proposals',
    body: 'Send us the scope, drawings, or a bid invite and we’ll return a detailed, competitive proposal — including line-item pricing property managers and GCs can take to their own stakeholders.',
  },
  {
    title: 'Insurance & Licensing',
    body: `${BRAND.license.label} in ${BRAND.license.state}, carrying ${BRAND.insurance.generalLiability.toLowerCase()} and ${BRAND.insurance.workersComp.toLowerCase()}. Certificates of insurance provided on request for your files.`,
  },
  {
    title: 'Scheduling Around Business Hours',
    body: 'We plan pours, cure times, and equipment staging around your operating hours, tenant traffic, and access restrictions — not the other way around.',
  },
  {
    title: 'Minimizing Downtime',
    body: 'Phased pours, off-hour work windows, and clear communication with on-site staff keep disruption to tenants, customers, and operations as low as possible.',
  },
];

export default function CommercialPage() {
  const services = SERVICE_TYPES.filter((s) => COMMERCIAL_KEYS.includes(s.key));

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative py-20 sm:py-28">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            Commercial Concrete
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Commercial concrete that meets your timeline, not the other way around.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">
            We work directly with property managers, general contractors, and facilities teams across the{' '}
            {BRAND.address.city} area on parking, pads, foundations, and site concrete — bid to close-out.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/request-estimate" size="lg">
              Request a Project Estimate
            </ButtonLink>
            <ButtonLink to="/contractors" variant="outline-light" size="lg">
              Subcontract With Us
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Commercial Services</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
            Built For Business
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.key} service={s} image={SERVICE_IMAGES[s.key]} />
          ))}
        </div>
      </section>

      <section className="bg-concrete-50 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Recent Work</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
            Commercial &amp; Site Concrete
          </h2>
          <PhotoShowcase photos={COMMERCIAL_PHOTOS} />
        </div>
      </section>

      <section className="bg-concrete-900 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-safety-500">
            Working With Property Managers &amp; GCs
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            A Contractor You Can Actually Rely On
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {WORKING_WITH.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-concrete-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="rounded-xl border border-steel-200 bg-steel-50 p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Large &amp; Structural Projects</p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">
            Site Inspection Required For Complex Commercial Work
          </h2>
          <p className="mt-4 max-w-3xl text-concrete-600">
            Foundations, large parking areas, and other structurally sensitive commercial projects go through a
            professional site inspection before we issue pricing — soil conditions, load requirements, and access
            all factor into an accurate proposal. Smaller commercial flatwork can often be quoted directly from
            drawings or a quick site visit.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/schedule-site-visit" variant="dark">
              Schedule a Site Visit
            </ButtonLink>
            <ButtonLink to="/request-estimate" variant="outline">
              Request an Estimate
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-24">
        <div className="rounded-xl border border-concrete-200 bg-concrete-50 p-8 text-center sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Subcontractors Welcome</p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">
            Excavation, Rebar, Pumping &amp; Hauling Contractors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-concrete-600">
            Commercial jobs often mean more subcontracted scope. If you&apos;re a licensed and insured contractor
            looking for steady bid opportunities, apply through our contractor portal.
          </p>
          <div className="mt-6">
            <ButtonLink to="/contractors" variant="dark">
              Apply as a Contractor
            </ButtonLink>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
