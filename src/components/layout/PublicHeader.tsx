import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BRAND } from '@/config/brand';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/residential', label: 'Residential' },
  { to: '/commercial', label: 'Commercial' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-concrete-800 bg-concrete-950/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded bg-safety-500 font-display text-lg font-bold text-concrete-950">TC</span>
          <span className="font-display text-lg font-bold uppercase tracking-wide text-white leading-none">
            Tough Concrete
            <span className="block text-[10px] font-sans font-medium normal-case tracking-normal text-concrete-400">Construction, LLC</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn('text-sm font-semibold text-concrete-300 hover:text-white transition-colors', isActive && 'text-white')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink to="/portal/login" variant="ghost" size="sm" className="text-concrete-300 hover:text-white hover:bg-white/10">
            Customer Login
          </ButtonLink>
          <ButtonLink to="/contractors/login" variant="ghost" size="sm" className="text-concrete-300 hover:text-white hover:bg-white/10">
            Contractor Login
          </ButtonLink>
          <ButtonLink to="/request-estimate" variant="primary" size="sm">
            Free Estimate
          </ButtonLink>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="space-y-1.5">
            <span className={cn('block h-0.5 w-6 bg-white transition-transform', open && 'translate-y-2 rotate-45')} />
            <span className={cn('block h-0.5 w-6 bg-white transition-opacity', open && 'opacity-0')} />
            <span className={cn('block h-0.5 w-6 bg-white transition-transform', open && '-translate-y-2 -rotate-45')} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-concrete-800 bg-concrete-950 px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-concrete-900 py-3 text-sm font-semibold text-concrete-200"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <ButtonLink to="/request-estimate" variant="primary" onClick={() => setOpen(false)}>
              Get a Free Estimate
            </ButtonLink>
            <ButtonLink to="/portal/login" variant="outline-light" onClick={() => setOpen(false)}>
              Customer Login
            </ButtonLink>
            <ButtonLink to="/contractors/login" variant="outline-light" onClick={() => setOpen(false)}>
              Contractor Login
            </ButtonLink>
            <a href={`tel:${BRAND.phone}`} className="mt-2 text-center text-sm text-concrete-400">
              or call {BRAND.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
