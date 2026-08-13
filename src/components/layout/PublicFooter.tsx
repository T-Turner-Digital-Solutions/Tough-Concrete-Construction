import { Link } from 'react-router-dom';
import { BRAND } from '@/config/brand';
import { SERVICE_TYPES } from '@/config/pricing';

export function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-concrete-950 text-concrete-400">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Tough Concrete Construction" className="h-14 w-14 shrink-0 object-contain" />
            <span className="font-display text-base font-bold uppercase tracking-wide text-white">Tough Concrete Construction</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            {BRAND.tagline} Premium residential and commercial concrete work across {BRAND.address.city}, {BRAND.address.state} and the
            surrounding area.
          </p>
          <p className="mt-4 text-xs text-concrete-500">
            {BRAND.license.label} · {BRAND.license.state} #{BRAND.license.number}
            <br />
            {BRAND.insurance.generalLiability} · {BRAND.insurance.workersComp}
          </p>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-white">Services</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICE_TYPES.slice(0, 7).map((s) => (
              <li key={s.key}>
                <Link to={`/services/${s.key}`} className="hover:text-white">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="font-semibold text-safety-500 hover:text-safety-400">
                View all services →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-white">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Project Gallery</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/schedule-site-visit" className="hover:text-white">Schedule a Site Visit</Link></li>
            <li><Link to="/portal/login" className="hover:text-white">Customer Login</Link></li>
            <li><Link to="/contractors" className="hover:text-white">Subcontract With Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-white">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${BRAND.phone}`} className="hover:text-white">{BRAND.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className="hover:text-white">{BRAND.email}</a>
            </li>
            <li>
              {BRAND.address.street}
              <br />
              {BRAND.address.city}, {BRAND.address.state} {BRAND.address.zip}
            </li>
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-concrete-500">Service Area</p>
          <p className="mt-1 text-xs text-concrete-500">{BRAND.serviceAreas.map((a) => a.name).join(' · ')}</p>
        </div>
      </div>

      <div className="border-t border-concrete-900">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-concrete-600 sm:flex-row">
          <p>
            © {year} {BRAND.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-concrete-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-concrete-300">Terms</Link>
            <span>
              Platform by <span className="text-concrete-400">{BRAND.parentCompany}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
