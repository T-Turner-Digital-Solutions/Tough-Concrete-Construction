import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens — sourced from src/config/brand.ts at runtime for
        // copy/content, but Tailwind needs static values at build time.
        // Change these alongside src/config/brand.ts when rebranding.
        // `concrete` is the neutral scale used for text, borders, and light
        // section backgrounds (50-600 — kept genuinely grey, no blue cast)
        // as well as dark hero/header/footer/sidebar backgrounds (700-950 —
        // shifts to navy, matching the company logo's helmet blue / `steel`
        // hue) for the site's "grey, black, white, and blue" scheme.
        concrete: {
          50: '#f7f7f8',
          100: '#ecedee',
          200: '#dadbdd',
          300: '#bec2c5',
          400: '#979ea5',
          500: '#717a84',
          600: '#535c65',
          700: '#384551',
          800: '#24313d',
          900: '#17212c',
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
        // `safety` is kept as a separate token (used for CTA "pop" and
        // warning-tone badges) but is now a bright cyan-blue accent, not
        // orange — the site's full palette is strictly grey/black/white/
        // blue per brand direction, with zero orange anywhere.
        safety: {
          50: '#ecf8fe',
          100: '#d4f0fc',
          200: '#aae2f8',
          300: '#74d0f1',
          400: '#3ebfea',
          500: '#0cb5e9',
          600: '#0596c7',
          700: '#086f9b',
          800: '#0d5077',
          900: '#0f3857',
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
