import { ServiceCard } from '@/components/marketing/ServiceCard';
import { CTASection } from '@/components/marketing/CTASection';
import { SERVICE_TYPES, type ServiceTypeKey } from '@/config/pricing';

const CATEGORIES: { title: string; blurb: string; keys: ServiceTypeKey[] }[] = [
  {
    title: 'Flatwork',
    blurb: 'The everyday concrete that carries your cars, your guests, and your gear.',
    keys: ['driveway', 'driveway_extension', 'parking_pad', 'garage_slab', 'slab', 'sidewalk', 'walkway', 'patio', 'pool_deck'],
  },
  {
    title: 'Decorative',
    blurb: 'Color, texture, and pattern work that turns flatwork into a feature.',
    keys: ['stamped', 'decorative'],
  },
  {
    title: 'Repair & Removal',
    blurb: 'Demo, haul-off, and full replacement of failing or damaged concrete.',
    keys: ['removal', 'replacement', 'repair'],
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
          </section>
        );
      })}

      <CTASection />
    </div>
  );
}
