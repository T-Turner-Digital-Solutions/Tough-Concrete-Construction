import { ServiceCard } from '@/components/marketing/ServiceCard';
import { CTASection } from '@/components/marketing/CTASection';
import { PhotoShowcase, type ShowcasePhoto } from '@/components/marketing/PhotoShowcase';
import { SERVICE_TYPES, type ServiceTypeKey } from '@/config/pricing';
import { SERVICE_IMAGES } from '@/config/serviceImages';

const FLATWORK_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/flatwork-driveway-before-after.jpeg', title: 'Driveway Replacement', caption: 'Failing, stained driveway replaced with a clean broom-finished pour.', serviceKey: 'driveway' },
  { image: '/gallery/flatwork-patio-firepit-before-after.jpeg', title: 'Backyard Patio', caption: 'Cracked patio rebuilt around the outdoor living and fire pit area.', serviceKey: 'patio' },
  { image: '/gallery/flatwork-walkway-before-after.jpeg', title: 'Front Walkway', caption: 'Uneven, cracked walkway replaced with a smooth, even path.', serviceKey: 'walkway' },
  { image: '/gallery/flatwork-sidewalk-before-after.jpeg', title: 'Sidewalk Replacement', caption: 'Heaved, broken sidewalk sections removed and repoured.', serviceKey: 'sidewalk' },
  { image: '/gallery/flatwork-garage-floor-before-after.jpeg', title: 'Garage Slab', caption: 'Stained, cracked garage floor resurfaced with a new slab.', serviceKey: 'garage_slab' },
  { image: '/gallery/flatwork-pool-deck-before-after.jpeg', title: 'Pool Deck', caption: 'Worn, cracked pool deck replaced with a bright new surface.', serviceKey: 'pool_deck' },
  { image: '/gallery/flatwork-walkway-paver-border-before-after.jpeg', title: 'Walkway with Paver Border', caption: 'Front walkway rebuilt with a paver-edged concrete finish.', serviceKey: 'walkway' },
  { image: '/gallery/flatwork-backyard-slab-before-after.jpeg', title: 'Backyard Slab', caption: 'Bare gravel pad replaced with a new backyard concrete slab.', serviceKey: 'slab' },
  { image: '/gallery/flatwork-patio-before-after.jpeg', title: 'Patio Slab', caption: 'Old, cracked patio slab replaced with a clean broom finish.', serviceKey: 'patio' },
  { image: '/gallery/flatwork-driveway-finished.jpeg', title: 'Finished Driveway', caption: 'A finished two-car driveway pour, broom-textured and curb-edged.', serviceKey: 'driveway' },
];

const DECORATIVE_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/decorative-stamped-walkway-brick.jpeg', title: 'Stamped Brick Walkway', caption: 'Brick-pattern stamped walkway with a rich color finish.', serviceKey: 'stamped' },
  { image: '/gallery/decorative-stamped-fireplace-patio.jpeg', title: 'Stamped Patio', caption: 'Stamped patio finished around an outdoor fireplace and kitchen.', serviceKey: 'stamped' },
  { image: '/gallery/decorative-stamped-pool-deck-1.jpeg', title: 'Stamped Pool Deck', caption: 'Textured, slip-resistant stamped decking around the pool.', serviceKey: 'pool_deck' },
  { image: '/gallery/decorative-stamped-slate-patio.jpeg', title: 'Stamped Slate Patio', caption: 'Slate-pattern stamped patio with hand-tooled joint lines.', serviceKey: 'stamped' },
  { image: '/gallery/decorative-stamped-driveway-cobble.jpeg', title: 'Stamped Cobblestone Driveway', caption: 'Cobblestone-pattern stamped driveway with a charcoal color finish.', serviceKey: 'stamped' },
  { image: '/gallery/decorative-exposed-aggregate-path.jpeg', title: 'Exposed Aggregate Walkway', caption: 'River-rock exposed aggregate walkway with a stamped border.', serviceKey: 'decorative' },
  { image: '/gallery/decorative-stamped-entry-walkway.jpeg', title: 'Stamped Entry Walkway', caption: 'Stamped walkway leading to the front entry, lit with path lighting.', serviceKey: 'stamped' },
  { image: '/gallery/decorative-stamped-outdoor-kitchen-patio.jpeg', title: 'Stamped Outdoor Kitchen Patio', caption: 'Two-tone stamped patio built around an outdoor kitchen and fireplace.', serviceKey: 'decorative' },
  { image: '/gallery/decorative-stamped-pool-deck-2.jpeg', title: 'Stamped Pool Deck', caption: 'Ashlar-pattern stamped decking wrapping the pool.', serviceKey: 'pool_deck' },
  { image: '/gallery/decorative-stamped-driveway-cobble-2.jpeg', title: 'Stamped Cobblestone Driveway', caption: 'Circular cobblestone-pattern stamped driveway and turnaround.', serviceKey: 'stamped' },
  { image: '/gallery/decorative-stamped-entry-patio.jpeg', title: 'Stamped Entry Patio', caption: 'Stamped stone-pattern patio at a front entry.', serviceKey: 'decorative' },
  { image: '/gallery/decorative-stamped-garden-walkway.jpeg', title: 'Stamped Garden Walkway', caption: 'Stamped walkway winding through the landscaping.', serviceKey: 'stamped' },
];

const REPAIR_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/repair-removal-demolition.jpeg', title: 'Concrete Demolition', caption: 'Breaking out and hauling off a failing driveway ahead of a full replacement.', serviceKey: 'removal' },
];

const STRUCTURAL_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/structural-foundation.jpeg', title: 'Foundation Walls', caption: 'Poured foundation walls and footings, waterproofed and backfilled.', serviceKey: 'foundation' },
  { image: '/gallery/structural-retaining-wall-steps.jpeg', title: 'Retaining Wall & Steps', caption: 'Tiered retaining wall with integrated lighting and steps.', serviceKey: 'retaining_wall' },
  { image: '/gallery/structural-steps.jpeg', title: 'Entry Steps', caption: 'Formed concrete entry steps with a broom-textured tread.', serviceKey: 'steps' },
  { image: '/gallery/structural-drainage.jpeg', title: 'Drainage Channel', caption: 'Trench drain tied into a downspout and channeled away from the foundation.', serviceKey: 'drainage' },
  { image: '/gallery/structural-commercial-entry.jpeg', title: 'Commercial Entry Pad', caption: 'Commercial building entry and parking apron, poured to spec.', serviceKey: 'commercial' },
  { image: '/gallery/structural-equipment-pad.jpeg', title: 'Equipment Pads', caption: 'Level, reinforced pads for HVAC condenser units.', serviceKey: 'equipment_pad' },
  { image: '/gallery/structural-dumpster-pad.jpeg', title: 'Dumpster Pad', caption: 'Heavy-duty commercial dumpster pad with bollards.', serviceKey: 'dumpster_pad' },
  { image: '/gallery/structural-other-utility-pad.jpeg', title: 'Utility Access Pad', caption: 'Custom concrete pad built around a utility access point.', serviceKey: 'other' },
  { image: '/gallery/structural-other-firepit-patio.jpeg', title: 'Stamped Patio & Fire Pit', caption: 'Custom stamped patio built around a raised fire pit.', serviceKey: 'other' },
  { image: '/gallery/structural-other-concrete-furniture.jpeg', title: 'Concrete Furniture', caption: 'Cast concrete picnic table and bench set.', serviceKey: 'other' },
  { image: '/gallery/structural-other-planter-box.jpeg', title: 'Concrete Planter Box', caption: 'Built-in concrete planter box, poured to match the patio.', serviceKey: 'other' },
  { image: '/gallery/structural-other-wheel-stop.jpeg', title: 'Wheel Stop', caption: 'Precast concrete wheel stop set in a parking stall.', serviceKey: 'other' },
];

const CATEGORIES: { title: string; blurb: string; keys: ServiceTypeKey[]; photos?: ShowcasePhoto[] }[] = [
  {
    title: 'Flatwork',
    blurb: 'The everyday concrete that carries your cars, your guests, and your gear.',
    keys: ['driveway', 'driveway_extension', 'parking_pad', 'garage_slab', 'slab', 'sidewalk', 'walkway', 'patio', 'pool_deck'],
    photos: FLATWORK_PHOTOS,
  },
  {
    title: 'Decorative',
    blurb: 'Color, texture, and pattern work that turns flatwork into a feature.',
    keys: ['stamped', 'decorative'],
    photos: DECORATIVE_PHOTOS,
  },
  {
    title: 'Repair & Removal',
    blurb: 'Demo, haul-off, and full replacement of failing or damaged concrete.',
    keys: ['removal', 'replacement', 'repair'],
    photos: REPAIR_PHOTOS,
  },
  {
    title: 'Structural & Specialty',
    blurb: 'Engineering-sensitive and commercial work that starts with a site inspection.',
    keys: ['foundation', 'retaining_wall', 'steps', 'commercial', 'equipment_pad', 'dumpster_pad', 'drainage', 'other'],
    photos: STRUCTURAL_PHOTOS,
  },
];

export default function ServicesIndexPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative py-20 sm:py-28">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            {SERVICE_TYPES.length} Concrete Services
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Every kind of concrete work, done to one standard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">
            From a single sidewalk to a full commercial foundation, our crews plan, form, pour, and finish it with
            the same attention to detail. Browse the full lineup below, or tell us what you need and we&apos;ll
            point you the right direction.
          </p>
        </div>
      </section>

      {CATEGORIES.map((cat) => {
        const services = SERVICE_TYPES.filter((s) => cat.keys.includes(s.key));
        return (
          <section key={cat.title} className="container-page py-14 sm:py-16">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-steel-600">{cat.title}</p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">
                {cat.blurb}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.key} service={s} image={SERVICE_IMAGES[s.key]} />
              ))}
            </div>
            {cat.photos && <PhotoShowcase photos={cat.photos} />}
          </section>
        );
      })}

      <CTASection />
    </div>
  );
}
