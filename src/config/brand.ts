/**
 * Single source of truth for editable business/brand information.
 *
 * In production this record is mirrored in the `business_settings` table
 * (see supabase/migrations) and edited from Admin → Settings → Business
 * Information. The constants below are the fallback/demo values used when
 * no database row exists yet (fresh install) or Supabase isn't configured.
 *
 * Never hardcode business info elsewhere in the app — import from here (or
 * from the `useBusinessSettings()` hook once wired to the database) so a
 * rebrand or office move only requires one edit.
 */

export interface ServiceArea {
  name: string;
  state: string;
}

export interface BrandConfig {
  legalName: string;
  dbaName: string;
  parentCompany: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  serviceAreas: ServiceArea[];
  hours: { day: string; hours: string }[];
  license: {
    number: string;
    state: string;
    label: string;
  };
  insurance: {
    generalLiability: string;
    workersComp: string;
    bonded: boolean;
  };
  social: {
    facebook?: string;
    instagram?: string;
    google?: string;
    youtube?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  yearsInBusiness: number;
  founded: number;
}

export const BRAND: BrandConfig = {
  legalName: 'Tough Concrete Construction, LLC',
  dbaName: 'Tough Concrete Construction',
  parentCompany: 'T. Turner Digital Solutions',
  tagline: 'Built Tough. Poured Right.',
  phone: '+12052070235',
  phoneDisplay: '(205) 207-0235',
  email: 'office@toughconcreteconstruction.com',
  address: {
    street: '482 Industrial Pkwy',
    city: 'Birmingham',
    state: 'AL',
    zip: '35203',
  },
  serviceAreas: [
    { name: 'Birmingham', state: 'AL' },
    { name: 'Hoover', state: 'AL' },
    { name: 'Vestavia Hills', state: 'AL' },
    { name: 'Homewood', state: 'AL' },
    { name: 'Trussville', state: 'AL' },
    { name: 'Mountain Brook', state: 'AL' },
    { name: 'Hueytown', state: 'AL' },
    { name: 'Huntsville', state: 'AL' },
    { name: 'Anniston', state: 'AL' },
    { name: 'Tuscaloosa', state: 'AL' },
    { name: 'Montgomery', state: 'AL' },
    { name: 'Selma', state: 'AL' },
    { name: 'Dothan', state: 'AL' },
    { name: 'Mobile', state: 'AL' },
  ],
  hours: [
    { day: 'Monday – Friday', hours: '7:00 AM – 5:30 PM' },
    { day: 'Saturday', hours: '8:00 AM – 1:00 PM (by appointment)' },
    { day: 'Sunday', hours: 'Closed' },
  ],
  license: {
    number: 'AL-CONC-004821',
    state: 'Alabama',
    label: 'Licensed & Registered Contractor',
  },
  insurance: {
    generalLiability: '$2,000,000 General Liability',
    workersComp: 'Workers’ Compensation Covered',
    bonded: true,
  },
  social: {
    facebook: 'https://facebook.com/toughconcreteconstruction',
    instagram: 'https://instagram.com/toughconcreteconstruction',
    google: 'https://g.page/tough-concrete-construction',
  },
  colors: {
    primary: '#0b1219',
    secondary: '#0072a9',
    accent: '#0cb5e9',
  },
  yearsInBusiness: 14,
  founded: 2012,
};

export const DEMO_MODE_BANNER =
  'Demo data — for development preview only. Connect Supabase to enable live persistence.';
