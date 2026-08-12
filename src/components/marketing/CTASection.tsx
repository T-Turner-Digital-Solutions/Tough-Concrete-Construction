import { ButtonLink } from '@/components/ui/Button';
import { BRAND } from '@/config/brand';

export function CTASection() {
  return (
    <section className="bg-concrete-panel bg-concrete-900 py-16 sm:py-20">
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Ready to start your concrete project?
        </h2>
        <p className="max-w-xl text-concrete-300">
          Get a free, no-pressure estimate from Tough Concrete Construction. Most preliminary quotes are ready within
          one business day.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/request-estimate" size="lg">
            Request a Free Estimate
          </ButtonLink>
          <ButtonLink to="/schedule-site-visit" variant="outline-light" size="lg">
            Schedule a Site Visit
          </ButtonLink>
        </div>
        <a href={`tel:${BRAND.phone}`} className="text-sm font-semibold text-concrete-400 hover:text-white">
          or call us directly at {BRAND.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
