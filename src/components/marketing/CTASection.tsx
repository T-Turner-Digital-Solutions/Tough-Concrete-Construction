import { ButtonLink } from '@/components/ui/Button';
import { BRAND } from '@/config/brand';
import { cn } from '@/lib/cn';

interface CTASectionProps {
  /** Light blue/white treatment instead of the dark navy default — used on
   * the landing page, which stays white-and-blue with no dark sections. */
  light?: boolean;
}

export function CTASection({ light }: CTASectionProps) {
  return (
    <section className={cn('py-16 sm:py-20', light ? 'bg-steel-600' : 'bg-concrete-panel bg-concrete-900')}>
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Ready to start your concrete project?
        </h2>
        <p className={cn('max-w-xl', light ? 'text-steel-50' : 'text-concrete-300')}>
          Get a free, no-pressure estimate from Tough Concrete Construction. Most preliminary quotes are ready within
          one business day.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/request-estimate" variant={light ? 'subtle' : 'primary'} size="lg">
            Request a Free Estimate
          </ButtonLink>
          <ButtonLink to="/schedule-site-visit" variant="outline-light" size="lg">
            Schedule a Site Visit
          </ButtonLink>
        </div>
        <a
          href={`tel:${BRAND.phone}`}
          className={cn('text-sm font-semibold hover:text-white', light ? 'text-steel-100' : 'text-concrete-400')}
        >
          or call us directly at {BRAND.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
