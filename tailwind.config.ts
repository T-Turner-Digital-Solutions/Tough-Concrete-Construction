import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens — sourced from src/config/brand.ts at runtime for
        // copy/content, but Tailwind needs static values at build time.
        // Change these alongside src/config/brand.ts when rebranding.
        concrete: {
          50: '#f6f6f5',
          100: '#e7e6e4',
          200: '#d1cfcb',
          300: '#b0aca5',
          400: '#8a8479',
          500: '#6f695f',
          600: '#5a544c',
          700: '#49443e',
          800: '#3d3934',
          900: '#35312d',
          950: '#1c1a17',
        },
        steel: {
          50: '#f2f6f8',
          100: '#e0e9ed',
          200: '#c5d6de',
          300: '#9cb8c6',
          400: '#6c93a6',
          500: '#4f778c',
          600: '#3f6076',
          700: '#374e60',
          800: '#334351',
          900: '#2d3946',
          950: '#1a232d',
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
