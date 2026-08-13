import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens — sourced from src/config/brand.ts at runtime for
        // copy/content, but Tailwind needs static values at build time.
        // Change these alongside src/config/brand.ts when rebranding.
        // `concrete` and `steel` are both matched to the company logo
        // (public/logo.jpg): `concrete` is a navy blue-black scale (same
        // hue family as the logo's helmet blue) so dark sections read as
        // blue, not neutral gray/charcoal — pairing with white content
        // sections for the "blue and white" site-wide scheme.
        concrete: {
          50: '#f5f8fa',
          100: '#e7eff3',
          200: '#cddbe4',
          300: '#a5bbca',
          400: '#7c98ab',
          500: '#557791',
          600: '#3d5971',
          700: '#2d4458',
          800: '#203141',
          900: '#15212d',
          950: '#0b1219',
        },
        steel: {
          50: '#eaf6fc',
          100: '#cceaf7',
          200: '#99d5f0',
          300: '#5cbce7',
          400: '#2aa3da',
          500: '#0f88c3',
          600: '#0072a9',
          700: '#075b87',
          800: '#0d4a6c',
          900: '#123e59',
          950: '#0b2739',
        },
        safety: {
          50: '#fff8ec',
          100: '#ffedc7',
          200: '#ffd889',
          300: '#ffbe4b',
          400: '#ffa41f',
          500: '#f98307',
          600: '#dd6002',
          700: '#b74106',
          800: '#94330c',
          900: '#7a2b0d',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,26,23,0.06), 0 8px 24px -12px rgba(28,26,23,0.18)',
        'card-hover': '0 2px 4px rgba(28,26,23,0.08), 0 16px 32px -12px rgba(28,26,23,0.28)',
      },
      backgroundImage: {
        'concrete-texture':
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.035) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.025) 0, transparent 45%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
