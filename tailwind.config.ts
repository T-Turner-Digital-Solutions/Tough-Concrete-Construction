import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens — sourced from src/config/brand.ts at runtime for
        // copy/content, but Tailwind needs static values at build time.
        // Change these alongside src/config/brand.ts when rebranding.
        // `concrete` (charcoal/black) and `steel` (brand blue) are matched
        // to the company logo (public/logo.jpg) — sampled directly from its
        // black background/steel lettering and the worker's helmet blue.
        concrete: {
          50: '#f5f7f8',
          100: '#e8ecee',
          200: '#cdd5d9',
          300: '#a7b3b9',
          400: '#7c8a91',
          500: '#5c6b72',
          600: '#48555c',
          700: '#3a444a',
          800: '#2c343a',
          900: '#20272c',
          950: '#12171a',
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
