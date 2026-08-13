import { useParams, Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTASection } from '@/components/marketing/CTASection';
import { SERVICE_TYPES, type ServiceTypeKey } from '@/config/pricing';
import { BRAND } from '@/config/brand';

const WHATS_INCLUDED: Record<ServiceTypeKey, string[]> = {
  driveway: [
    'Excavation and grading to a stable subgrade',
    'Compacted gravel base sized to your soil conditions',
    'Reinforcement with rebar or wire mesh',
    'Control joints placed to prevent random cracking',
    'Broom or exposed-aggregate finish',
    'Curing period guidance before vehicle traffic',
  ],
  driveway_extension: [
    'Grading and tie-in to your existing driveway slab',
    'Matched thickness and reinforcement to the original pour',
    'Proper expansion joint between old and new concrete',
    'Grading for positive water drainage away from the garage',
    'Finish matched as closely as possible to existing concrete',
  ],
  patio: [
    'Layout and grading for proper drainage away from the house',
    'Compacted base and reinforcement sized to the design',
    'Choice of broom, stamped, exposed-aggregate, or colored finish',
    'Control joints placed to follow the patio design lines',
    'Optional footings for attached pergolas or fire pits',
    'Sealer application on request',
  ],
  sidewalk: [
    'Layout to meet local setback and code requirements',
    'Compacted base and control joints at code-required spacing',
    'Broom finish for slip resistance',
    'ADA-compliant grading where required',
    'Clean, straight edges and consistent width',
  ],
  walkway: [
    'Custom layout connecting the spaces you actually use',
    'Compacted base and control joints',
    'Broom, exposed-aggregate, or stamped finish options',
    'Grading to shed water away from the path',
    'Curved or straight-run layouts',
  ],
  slab: [
    'Layout and excavation for sheds, workshops, or general-purpose pads',
    'Compacted gravel base and vapor barrier where needed',
    'Reinforcement sized to intended use',
    'Smooth or broom-finish surface',
    'Anchor bolt or embed placement on request',
  ],
  foundation: [
    'Engineering-informed layout and excavation',
    'Footings sized to soil-bearing conditions',
    'Rebar reinforcement per plan specifications',
    'Vapor barrier and insulation where specified',
    'Formwork built to precise dimensions and elevation',
    'Coordination with your structural engineer or architect',
  ],
  parking_pad: [
    'Grading and base compaction rated for vehicle loads',
    'Reinforced slab thickness for RV, trailer, or extra-vehicle use',
    'Control joints to manage cracking under load',
    'Drainage grading away from structures',
    'Broom finish for traction',
  ],
  commercial: [
    'Site assessment and coordination with property managers or GCs',
    'Load-rated slab design for foot and vehicle traffic',
    'Scheduling built around business hours and access needs',
    'Compliance with local commercial building code',
    'Documentation and lien-waiver paperwork on request',
    'Crews sized to hit commercial timelines',
  ],
  removal: [
    'Careful demolition of existing concrete',
    'Full haul-off and disposal of debris',
    'Site cleanup and rough grading after removal',
    'Utility-line awareness before breaking ground',
    'Optional same-visit quote for replacement work',
  ],
  replacement: [
    'Removal and haul-off of the failing slab',
    'Fresh compacted base and reinforcement',
    'New pour matched to surrounding grade and finish',
    'Correction of drainage or settling issues that caused the original failure',
    'Standard workmanship warranty on the new slab',
  ],
  decorative: [
    'Integral color, dry-shake color hardener, or acid staining',
    'Broom, trowel, or textured finish options',
    'Custom control-joint patterns as a design element',
    'Sealer application for color protection',
    'Design consultation before the pour',
  ],
  stamped: [
    'Stone, brick, slate, or wood-plank pattern options',
    'Integral or dry-shake color to match your design',
    'Release agent and hand-tooled detail work at edges and joints',
    'Sealer application to protect color and texture',
    'Sample boards available before you commit to a pattern',
  ],
  repair: [
    'Crack diagnosis — cosmetic vs. structural',
    'Routing and sealing of active cracks',
    'Resurfacing of worn or spalled surfaces',
    'Mudjacking/slab-lifting referral for settled sections',
    'Color and texture matching where possible',
  ],
  steps: [
    'Structural layout engineered to code-required rise and run',
    'Footings sized for frost depth and soil conditions',
    'Reinforced formwork for clean, square steps',
    'Broom or textured finish for slip resistance',
    'Optional integrated handrail post sleeves',
  ],
  retaining_wall: [
    'Engineering review of grade change and soil load',
    'Footing sized for wall height and backfill pressure',
    'Rebar reinforcement and proper drainage tile/weep holes',
    'Formed and poured (or block) wall construction',
    'Backfill and compaction after cure',
  ],
  garage_slab: [
    'Removal of existing slab if replacing',
    'Vapor barrier and compacted base',
    'Reinforced slab rated for vehicle and storage loads',
    'Proper slope to the garage door for drainage',
    'Smooth troweled finish',
  ],
  pool_deck: [
    'Slip-resistant broom, stamped, or knockdown texture finish',
    'Layout that follows your pool coping and landscape design',
    'Cool-deck or light-reflective color options',
    'Proper grading away from the pool structure',
    'Control joints placed to manage cracking around the pool shell',
  ],
  equipment_pad: [
    'Pad sized and reinforced to your equipment specs (HVAC, generator, transformer)',
    'Level, vibration-resistant surface',
    'Conduit or anchor bolt placement per manufacturer spec',
    'Grading for drainage away from the unit',
  ],
  dumpster_pad: [
    'Heavy-duty reinforced slab rated for truck and dumpster loads',
    'Engineered thickness for repeated loading/unloading',
    'Grading to manage runoff per local requirements',
    'Coordination with your waste hauler on pad dimensions',
  ],
  drainage: [
    'Grading assessment to identify the source of standing water',
    'Swales, flumes, or channel drains tied into flatwork',
    'Concrete work that integrates with existing drainage systems',
    'Coordination with a drainage engineer for complex sites',
  ],
  other: [
    'A site visit to understand exactly what you need',
    'A custom scope of work written specifically for your project',
    'Straight talk on whether it is a good fit for our crews',
    'A written estimate once the scope is confirmed',
  ],
};

const WHY_US = [
  'Written, itemized estimates — no vague verbal quotes',
  'Licensed, insured crews who show up when scheduled',
  `${BRAND.yearsInBusiness}+ years of concrete-specific experience in the ${BRAND.address.city} area`,
  'ToughTrack™ live updates so you always know what stage your project is in',
  'A workmanship warranty backing every completed job',
];

const PROCESS = [
  { title: 'Site Visit & Measurements', body: 'We walk the site, take measurements, and note anything that could affect access, drainage, or pricing.' },
  { title: 'Written Estimate', body: 'You get a detailed, line-item estimate — materials, labor, and scope spelled out clearly.' },
  { title: 'Contract & Scheduling', body: 'Once approved, we sign a written contract and lock in a pour date that works for you.' },
  { title: 'Site Prep', body: 'Excavation, base compaction, forms, and reinforcement go in before a single truck arrives.' },
  { title: 'Pour & Finish', body: 'Concrete is placed, screeded, and finished to spec, then protected through the initial cure.' },
  { title: 'Final Walkthrough', body: 'We walk the finished project with you and make sure it meets the standard we promised.' },
];

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICE_TYPES.find((s) => s.key === slug);

  if (!service) {
    return (
      <div className="container-page py-20">
        <EmptyState
          title="Service not found"
          description="We couldn't find a service matching that link. Browse the full list of services below."
          action={
            <ButtonLink to="/services" variant="dark">
              View All Services
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const included = WHATS_INCLUDED[service.key];
  const ctaTarget = service.requiresSiteInspection ? '/schedule-site-visit' : '/request-estimate';

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative py-20 sm:py-28">
          <nav className="mb-5 text-xs font-semibold uppercase tracking-wide text-concrete-400">
            <Link to="/services" className="hover:text-white">
              Services
            </Link>{' '}
            / <span className="text-concrete-300">{service.label}</span>
          </nav>
          {service.requiresSiteInspection && (
            <Badge tone="warning" className="mb-4">
              Site Inspection Required
            </Badge>
          )}
          <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            {service.label}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">{service.shortDescription}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to={ctaTarget} size="lg">
              {service.requiresSiteInspection ? 'Schedule a Site Visit' : 'Request a Free Estimate'}
            </ButtonLink>
            <ButtonLink to="/gallery" variant="outline-light" size="lg">
              See Our Work
            </ButtonLink>
          </div>
        </div>
      </section>

      {service.requiresSiteInspection && (
        <section className="border-b border-safety-200 bg-safety-50 py-6">
          <div className="container-page flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Badge tone="warning">Site Inspection Required</Badge>
            <p className="text-sm text-concrete-700">
              This service involves structural or complex site factors, so we don&apos;t price it sight-unseen. A
              member of our team will walk the site and confirm scope before we issue pricing.
            </p>
          </div>
        </section>
      )}

      <section className="container-page py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">What&apos;s Included</p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">
              What goes into your {service.label.toLowerCase()}
            </h2>
            <ul className="mt-6 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-concrete-600">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-steel-100 text-steel-700">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-xl border border-concrete-200 bg-concrete-50 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Why Choose Tough Concrete</p>
            <ul className="mt-4 space-y-3">
              {WHY_US.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-concrete-600">
                  <span className="mt-0.5 text-safety-600" aria-hidden>
                    ●
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-concrete-900 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-safety-500">How It Works</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Our Process
          </h2>
          <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <span className="font-display text-3xl font-bold text-safety-500">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-concrete-400">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
