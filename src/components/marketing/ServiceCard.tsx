import { Link } from 'react-router-dom';
import type { ServiceTypeInfo } from '@/config/pricing';

export function ServiceCard({ service }: { service: ServiceTypeInfo }) {
  return (
    <Link
      to={`/services/${service.key}`}
      className="group flex flex-col justify-between rounded-xl border border-concrete-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-concrete-900 text-safety-500">
          <ServiceGlyph name={service.icon} />
        </div>
        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">{service.label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-concrete-500">{service.shortDescription}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-steel-700 group-hover:text-safety-600">
        Learn more <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

/** Minimal geometric glyph set so each service card has visual distinction without external icon packs. */
function ServiceGlyph({ name }: { name: string }) {
  const common = 'h-5 w-5';
  switch (name) {
    case 'driveway':
    case 'parking':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20 L8 4 H16 L20 20" />
          <path d="M9 20 L10.5 4" strokeDasharray="2 2" />
        </svg>
      );
    case 'patio':
    case 'pool':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case 'foundation':
    case 'garage':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M4 21V10l8-6 8 6v11" />
        </svg>
      );
    case 'wall':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21V9l9-6 9 6v12" />
          <path d="M3 15h18" />
        </svg>
      );
    case 'removal':
    case 'repair':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    case 'stamped':
    case 'decorative':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12l4-4 4 4 4-4 4 4M3 18l4-4 4 4 4-4 4 4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      );
  }
}
