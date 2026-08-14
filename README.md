# Tough Concrete Construction — Platform

Public website + business operating system for **Tough Concrete Construction, LLC**, built by **T. Turner Digital Solutions**.

This is not a brochure site. It's four connected applications sharing one codebase and one database:

1. **Public website** — marketing, service pages, project gallery, lead capture, AI Concierge preliminary estimates.
2. **Owner/Admin dashboard** — command center, CRM, estimating, ToughTrack™ job management, contracts, invoicing, contractor bidding, settings.
3. **Customer portal** — ToughTrack™ project tracking, estimates, contracts, change orders, invoices, photos, messaging.
4. **Contractor/subcontractor portal** — registration, document management, bid opportunities, bid submission.

The signature feature is **ToughTrack™** — an automatically-calculated project progress line (customers never see a hand-typed percentage; it's derived from stage weights and completion status) with daily crew ETA updates, a customer-facing activity feed, and a "What Happens Next?" explainer.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript (strict mode) + Vite |
| Styling | Tailwind CSS (custom `concrete` / `steel` / `safety` brand palette) |
| Routing | React Router v6, route-based code splitting (`React.lazy`) |
| Backend / DB / Auth | Supabase (Postgres + Row Level Security + Auth) |
| Serverless functions | Netlify Functions (TypeScript) |
| Hosting | Netlify |
| Optional AI | Anthropic API (Claude), called only from a server-side Netlify Function |

No other backend framework is used — Supabase's client SDK talks directly to Postgres through RLS policies, and Netlify Functions handle anything that must not run in the browser (the AI Concierge's free-form chat, today; payment webhooks, later).

---

## Demo mode vs. live mode

**The app runs today with zero configuration.** If `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` aren't set, every data-access point in the app falls back to the realistic, clearly-labeled sample dataset in `src/data/demoData.ts` (a handful of customers, one active job with a full ToughTrack history, estimates, invoices, a contractor and an open bid opportunity, etc.). A **"Demo data" banner** appears on every dashboard screen in this mode, and form submissions are stored in `localStorage` (via `src/lib/data/demoStore.ts`) rather than a real database, so the UI feels alive without ever pretending a write reached a server that isn't there.

Once Supabase env vars are set, `src/lib/supabase.ts` returns a real client and the app is architected to read/write through it instead — see "Database setup" below for what's already wired (auth, schema, RLS) versus what a follow-up pass should connect page-by-page (see "What remains mocked" in the project handoff notes).

**Logging in without a real backend:** `/portal/login`, `/contractors/login`, and `/admin/login` each show a "Demo Mode — Preview As" panel with one-click buttons that instantly load a sample profile for that role (customer, contractor, owner/admin, office staff, field crew) — no password needed. The same pages also render a real email/password form that works immediately once Supabase is configured.

---

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase values if/when you have a project; safe to leave blank
npm run dev                  # http://localhost:5173
```

Other scripts:

```bash
npm run build       # tsc -b && vite build -> dist/
npm run typecheck   # tsc -b --noEmit
npm run lint         # eslint .
npm run preview      # serve the production build locally
```

---

## Environment variables

Copy `.env.example` to `.env.local` for local dev, and set the same keys in **Netlify → Site settings → Environment variables** for deploys. Nothing here is committed — see `.gitignore`.

| Variable | Where used | Required? |
|---|---|---|
| `VITE_SUPABASE_URL` | Browser (Vite build) | For live persistence & auth. Omit to run in demo mode. |
| `VITE_SUPABASE_ANON_KEY` | Browser (Vite build) | Same as above. This is the public anon key — safe to expose to the browser because every table is protected by Row Level Security (see below). |
| `OPENAI_API_KEY` | Server only (`netlify/functions/ai-concierge.ts`) | Optional. Enables free-form AI Concierge chat. The guided estimate wizard works fully without it. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (reserved) | Optional, for future privileged Netlify Functions. **Never** expose this in a `VITE_`-prefixed variable. |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SQUARE_ACCESS_TOKEN` | Server only (reserved) | Not yet integrated — see "External integrations still needed". |

**Rule enforced throughout the codebase:** anything prefixed `VITE_` ends up in the browser bundle, so only ever put the Supabase *anon* key there. Service-role keys, payment secret keys, and the Anthropic key live only in Netlify Function environment variables and are read with `process.env`, never imported into `src/`.

---

## Database setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql` (or `supabase db push` with the CLI). This creates every table described in the data model below, enables Row Level Security on all of them, and installs the policies that enforce:
   - Customers can only ever see their own jobs, estimates, contracts, invoices, photos (customer-visible only), documents (customer-visible only), and published daily logs.
   - Contractors can only see bid opportunities they were explicitly invited to, and only their own bids — never another contractor's numbers, insurance docs, or internal rating.
   - Job costing/profitability data (`job_expenses`) is staff-only and has no customer or contractor policy at all.
   - Only `owner_admin` can change a user's `role`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your project's API settings.
4. Create your first owner account: sign up through `/admin/login`, then in the Supabase table editor set that row's `profiles.role` to `owner_admin` (the trigger in the migration defaults every new signup to `customer`, by design, so nobody can self-escalate).

### Data model

`profiles` (role/auth identity) → `customers` / `contractors` → `leads` → `estimates` → `jobs` → `job_stage_progress` (ToughTrack), `contracts` → `signatures`, `change_orders`, `invoices` → `payments`, `appointments`, `job_photos`, `job_documents`, `messages`, `daily_job_logs`, `daily_eta_status`, `weather_delays`, `addon_catalog` → `addon_requests`, `bid_opportunities` → `bids`, `job_expenses`, `notifications`, `app_settings` (generic key/value for business info, pricing rules, stage templates, etc.).

Full column-level detail is in the migration file and mirrored in `src/types/domain.ts`.

### Authentication setup

Supabase Auth (email/password) is used as-is — no custom auth server. A Postgres trigger (`handle_new_user`) mirrors every new `auth.users` row into `public.profiles` automatically, defaulting to the `customer` role. `src/lib/auth/AuthContext.tsx` wraps `supabase.auth` and exposes `session`, `profile`, `signInWithPassword`, `signUp`, `signOut` to the whole app; `src/lib/auth/RequireRole.tsx` is the client-side route guard used in `src/App.tsx` — it's a UX convenience only, since RLS is the real authorization boundary.

---

## Netlify deployment

The project is already connected to Netlify under **T. Turner Digital Solutions**.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`
- `netlify.toml` (committed) configures all of the above plus a SPA catch-all redirect (`/*` → `/index.html`, 200) so client-side routes work on refresh/direct-load.
- Set the environment variables from the table above in the Netlify UI before your first real (non-demo) deploy.
- No secrets are committed anywhere in this repo — verify with `git grep -i "sk_live\|service_role\|OPENAI_API_KEY *="` before pushing if you ever hardcode a value locally for testing.

---

## Project structure

```
src/
  config/         brand.ts (business info/colors/hours/license), pricing.ts (service types + pricing rules),
                  stages.ts (ToughTrack stage template)
  types/domain.ts  TypeScript types mirroring the Supabase schema
  lib/
    supabase.ts    Supabase client (null when not configured)
    auth/          AuthContext + RequireRole route guard
    estimator.ts   pure concrete-estimating calculation engine (sq ft, cubic yards, line items, markup, tax, min charge)
    toughtrack.ts   stage-weighted overall-progress calculator
    aiConcierge.ts  rule-based preliminary-estimate engine used by the AI Concierge
    data/demoStore.ts  localStorage-backed writes for demo mode
  data/demoData.ts  realistic, clearly-labeled sample dataset (see "Demo mode" above)
  components/
    ui/            design system primitives (Button, Card, Badge, DataTable, Modal, ProgressBar, ...)
    layout/        PublicHeader/Footer, DashboardShell (shared by all 3 portals)
    marketing/     public-site building blocks (ServiceCard, TestimonialCard, BeforeAfter, CTASection)
    ai/            AiConciergeChat (guided wizard) + AiConciergeLauncher (floating widget)
  pages/
    public/        marketing site + lead-gen forms + all 3 login pages
    admin/         owner/staff dashboard (command center, CRM, jobs/ToughTrack, estimating, bidding, settings)
    customer/      customer portal (ToughTrack, estimates, invoices, enhance/add-ons, AI concierge, ...)
    contractor/    contractor portal (opportunities, bidding, documents)
netlify/functions/
  ai-concierge.ts  optional server-side LLM chat (returns configured:false cleanly when OPENAI_API_KEY is unset)
supabase/migrations/0001_init.sql   full schema + RLS policies + seed data (add-on catalog only — no fake customers)
```

---

## External integrations status

| Integration | Status |
|---|---|
| Supabase (DB/Auth) | Schema + RLS fully written; app runs against it once env vars are set. |
| Netlify Functions | AI Concierge chat function implemented, cleanly reports "not configured" without a key. |
| OpenAI API (ChatGPT chat) | Optional, server-side only, guarded by `OPENAI_API_KEY`. |
| Stripe / Square (payments) | **Not connected.** Invoice "Pay Now" actions clearly tell the customer online payment isn't configured yet rather than faking a successful charge. Env var names are reserved in `.env.example` for whoever wires this up next. |
| SMS notifications | **Not connected.** Notification architecture (`notifications` table, in-app + email intent) supports adding SMS later without a schema change. |
| Supabase Storage (photos/documents/W-9/insurance uploads) | **Not connected.** Upload UI exists throughout (photos, documents, contractor insurance/license); each clearly states storage isn't configured yet rather than pretending a file was saved. |
| Live GPS crew ETA | **Not built.** The Daily ETA system is owner/crew-entered by design (per spec) — the schema (`daily_eta_status`) has room to add a live-location feed later without breaking the customer-facing UI. |

---

## What's demo data vs. real

Everything under `src/data/demoData.ts` is fictional sample data for development preview, clearly commented as such, and never presented as a real customer, payment, or signature. No production secrets, real customer PII, or real payment data exist anywhere in this repository.
