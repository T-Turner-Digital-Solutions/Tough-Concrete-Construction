import { ServiceCard } from '@/components/marketing/ServiceCard';
import { CTASection } from '@/components/marketing/CTASection';
import { PhotoShowcase, type ShowcasePhoto } from '@/components/marketing/PhotoShowcase';
import { SERVICE_TYPES, type ServiceTypeKey } from '@/config/pricing';

const FLATWORK_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/flatwork-driveway-before-after.jpeg', title: 'Driveway Replacement', caption: 'Failing, stained driveway replaced with a clean broom-finished pour.' },
  { image: '/gallery/flatwork-patio-firepit-before-after.jpeg', title: 'Backyard Patio', caption: 'Cracked patio rebuilt around the outdoor living and fire pit area.' },
  { image: '/gallery/flatwork-walkway-before-after.jpeg', title: 'Front Walkway', caption: 'Uneven, cracked walkway replaced with a smooth, even path.' },
  { image: '/gallery/flatwork-sidewalk-before-after.jpeg', title: 'Sidewalk Replacement', caption: 'Heaved, broken sidewalk sections removed and repoured.' },
  { image: '/gallery/flatwork-garage-floor-before-after.jpeg', title: 'Garage Slab', caption: 'Stained, cracked garage floor resurfaced with a new slab.' },
  { image: '/gallery/flatwork-pool-deck-before-after.jpeg', title: 'Pool Deck', caption: 'Worn, cracked pool deck replaced with a bright new surface.' },
  { image: '/gallery/flatwork-walkway-paver-border-before-after.jpeg', title: 'Walkway with Paver Border', caption: 'Front walkway rebuilt with a paver-edged concrete finish.' },
  { image: '/gallery/flatwork-backyard-slab-before-after.jpeg', title: 'Backyard Slab', caption: 'Bare gravel pad replaced with a new backyard concrete slab.' },
  { image: '/gallery/flatwork-patio-before-after.jpeg', title: 'Patio Slab', caption: 'Old, cracked patio slab replaced with a clean broom finish.' },
  { image: '/gallery/flatwork-driveway-finished.jpeg', title: 'Finished Driveway', caption: 'A finished two-car driveway pour, broom-textured and curb-edged.' },
];

const DECORATIVE_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/decorative-stamped-walkway-brick.jpeg', title: 'Stamped Brick Walkway', caption: 'Brick-pattern stamped walkway with a rich color finish.' },
  { image: '/gallery/decorative-stamped-fireplace-patio.jpeg', title: 'Stamped Patio', caption: 'Stamped patio finished around an outdoor fireplace and kitchen.' },
  { image: '/gallery/decorative-stamped-pool-deck-1.jpeg', title: 'Stamped Pool Deck', caption: 'Textured, slip-resistant stamped decking around the pool.' },
  { image: '/gallery/decorative-stamped-slate-patio.jpeg', title: 'Stamped Slate Patio', caption: 'Slate-pattern stamped patio with hand-tooled joint lines.' },
  { image: '/gallery/decorative-stamped-driveway-cobble.jpeg', title: 'Stamped Cobblestone Driveway', caption: 'Cobblestone-pattern stamped driveway with a charcoal color finish.' },
  { image: '/gallery/decorative-exposed-aggregate-path.jpeg', title: 'Exposed Aggregate Walkway', caption: 'River-rock exposed aggregate walkway with a stamped border.' },
  { image: '/gallery/decorative-stamped-entry-walkway.jpeg', title: 'Stamped Entry Walkway', caption: 'Stamped walkway leading to the front entry, lit with path lighting.' },
  { image: '/gallery/decorative-stamped-outdoor-kitchen-patio.jpeg', title: 'Stamped Outdoor Kitchen Patio', caption: 'Two-tone stamped patio built around an outdoor kitchen and fireplace.' },
  { image: '/gallery/decorative-stamped-pool-deck-2.jpeg', title: 'Stamped Pool Deck', caption: 'Ashlar-pattern stamped decking wrapping the pool.' },
  { image: '/gallery/decorative-stamped-driveway-cobble-2.jpeg', title: 'Stamped Cobblestone Driveway', caption: 'Circular cobblestone-pattern stamped driveway and turnaround.' },
  { image: '/gallery/decorative-stamped-entry-patio.jpeg', title: 'Stamped Entry Patio', caption: 'Stamped stone-pattern patio at a front entry.' },
  { image: '/gallery/decorative-stamped-garden-walkway.jpeg', title: 'Stamped Garden Walkway', caption: 'Stamped walkway winding through the landscaping.' },
];

const REPAIR_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/repair-removal-demolition.jpeg', title: 'Concrete Demolition', caption: 'Breaking out and hauling off a failing driveway ahead of a full replacement.' },
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
                <ServiceCard key={s.key} service={s} />
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
