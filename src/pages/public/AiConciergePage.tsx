import type { ReactNode } from 'react';
import { AiConciergeChat } from '@/components/ai/AiConciergeChat';
import { HeroLogoWatermark } from '@/components/marketing/HeroLogoWatermark';
import { PRELIMINARY_ESTIMATE_DISCLAIMER } from '@/lib/aiConcierge';
import { BRAND } from '@/config/brand';

const EXAMPLE_QUESTIONS = [
  'What would a 20x20 patio cost?',
  'Do I need a permit for a driveway replacement?',
  'I need my driveway replaced — what happens next?',
  'How thick should a garage slab be?',
  'What is the difference between stamped and stained concrete?',
  'Do I need site inspection for a foundation?',
];

export default function AiConciergePage(): ReactNode {
  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <HeroLogoWatermark />
        <div className="container-page relative py-16 sm:py-20">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            Instant, No-Obligation Guidance
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            Tough Concrete AI Concierge
          </h1>
          <p className="mt-4 max-w-2xl text-concrete-300">
            Chat with our AI Concierge to identify the right service, walk through your measurements, and get a
            preliminary estimate in minutes. If your project needs a closer look, it will point you toward a site
            visit instead of guessing.
          </p>
        </div>
      </section>

      <section className="border-b border-safety-200 bg-safety-50 py-4">
        <div className="container-page">
          <p className="text-center text-xs leading-relaxed text-concrete-700 sm:text-sm">
            <span className="font-bold uppercase tracking-wide text-safety-800">Disclaimer: </span>
            {PRELIMINARY_ESTIMATE_DISCLAIMER}
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="h-[70vh] rounded-xl border border-concrete-200 bg-white p-4 shadow-card sm:p-6">
            <AiConciergeChat mode="lead" />
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-steel-600">
                What It Can Help With
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-concrete-600">
                <li>• Identifying the right concrete service for your project</li>
                <li>• Collecting rough measurements (length, width, thickness)</li>
                <li>• Producing a preliminary price range using our real pricing rules</li>
                <li>• Flagging when a project needs a professional site visit</li>
              </ul>
            </div>

            <div className="rounded-xl border border-concrete-200 bg-concrete-50 p-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-steel-600">
                Questions People Ask
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-concrete-700">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <li key={q} className="rounded-lg border border-concrete-200 bg-white px-3 py-2 shadow-sm">
                    &ldquo;{q}&rdquo;
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-concrete-200 bg-concrete-900 p-6 text-white">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-safety-500">
                Prefer to Talk to a Person?
              </h2>
              <p className="mt-2 text-sm text-concrete-300">
                Call {BRAND.dbaName} directly at{' '}
                <a href={`tel:${BRAND.phone}`} className="font-semibold text-white hover:underline">
                  {BRAND.phoneDisplay}
                </a>{' '}
                during business hours, or submit a full estimate request for the most detailed follow-up.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
