import { ServiceCard } from '@/components/marketing/ServiceCard';
import { TestimonialCard } from '@/components/marketing/TestimonialCard';
import { CTASection } from '@/components/marketing/CTASection';
import { PhotoShowcase, type ShowcasePhoto } from '@/components/marketing/PhotoShowcase';
import { SERVICE_TYPES, type ServiceTypeKey } from '@/config/pricing';
import { SERVICE_IMAGES } from '@/config/serviceImages';
import { BRAND } from '@/config/brand';

const RESIDENTIAL_PHOTOS: ShowcasePhoto[] = [
  { image: '/gallery/flatwork-driveway-before-after.jpeg', title: 'Driveway Replacement', caption: 'Failing, stained driveway replaced with a clean broom-finished pour.', serviceKey: 'driveway' },
  { image: '/gallery/flatwork-patio-firepit-before-after.jpeg', title: 'Backyard Patio', caption: 'Cracked patio rebuilt around the outdoor living and fire pit area.', serviceKey: 'patio' },
  { image: '/gallery/decorative-stamped-fireplace-patio.jpeg', title: 'Stamped Patio', caption: 'Stamped patio finished around an outdoor fireplace and kitchen.', serviceKey: 'stamped' },
  { image: '/gallery/flatwork-walkway-before-after.jpeg', title: 'Front Walkway', caption: 'Uneven, cracked walkway replaced with a smooth, even path.', serviceKey: 'walkway' },
  { image: '/gallery/flatwork-garage-floor-before-after.jpeg', title: 'Garage Slab', caption: 'Stained, cracked garage floor resurfaced with a new slab.', serviceKey: 'garage_slab' },
  { image: '/gallery/flatwork-pool-deck-before-after.jpeg', title: 'Pool Deck', caption: 'Worn, cracked pool deck replaced with a bright new surface.', serviceKey: 'pool_deck' },
  { image: '/gallery/structural-steps.jpeg', title: 'Entry Steps', caption: 'Formed concrete entry steps with a broom-textured tread.', serviceKey: 'steps' },
  { image: '/gallery/flatwork-backyard-slab-before-after.jpeg', title: 'Backyard Slab', caption: 'Bare gravel pad replaced with a new backyard concrete slab.', serviceKey: 'slab' },
];

const RESIDENTIAL_KEYS: ServiceTypeKey[] = [
  'driveway',
  'driveway_extension',
  'patio',
  'sidewalk',
  'walkway',
  'slab',
  'parking_pad',
  'decorative',
  'stamped',
  'repair',
  'steps',
  'garage_slab',
  'pool_deck',
];

const WHY_HOMEOWNERS = [
  {
    title: 'Written Estimates, No Guesswork',
    body: 'Every homeowner project starts with a clear, itemized estimate — you know the price before we start.',
  },
  {
    title: 'Your Home, Respected',
    body: 'We protect landscaping, driveways, and neighboring property, and clean the site up when we’re done.',
  },
  {
    title: 'Track Progress From Your Phone',
    body: 'ToughTrack™ gives you daily photos and crew ETAs so you’re never wondering what’s happening.',
  },
  {
    title: 'A Warranty That Backs the Work',
    body: 'Standard workmanship warranty on every residential job — we stand behind what we pour.',
  },
];

export default function ResidentialPage() {
  const services = SERVICE_TYPES.filter((s) => RESIDENTIAL_KEYS.includes(s.key));

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative py-20 sm:py-28">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            Residential Concrete
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Concrete that works as hard as your home does.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">
            Driveways, patios, walkways, and more — built for {BRAND.address.city}-area homes with the same crews,
            the same standards, and the same written pricing on every job.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-steel-600">Residential Services</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
            Popular With Homeowners
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
            Homes We&apos;ve Poured For
          </h2>
          <PhotoShowcase photos={RESIDENTIAL_PHOTOS} />
        </div>
      </section>

      <section className="bg-concrete-900 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-safety-500">Why Homeowners Choose Us</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Built For Real Life At Home
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_HOMEOWNERS.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-concrete-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-concrete-50 py-16 sm:py-24">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-steel-600">Homeowner Stories</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide text-concrete-900 sm:text-4xl">
            What Homeowners Say
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TestimonialCard
              quote="Our old patio was falling apart and covered in cracks. The new one is beautiful and they even helped us pick the stamped pattern."
              name="Marcus T."
              location="Homewood, AL"
              project="Stamped Patio"
            />
            <TestimonialCard
              quote="From the first call to the final walkthrough, everything was on time and exactly what they quoted. No surprises on the invoice."
              name="Lauren H."
              location="Trussville, AL"
              project="Driveway & Walkway"
            />
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
