import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroLogoWatermark } from '@/components/marketing/HeroLogoWatermark';
import { BRAND } from '@/config/brand';
import { cn } from '@/lib/cn';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does the estimate process work?',
    answer:
      'Most projects start with our AI concierge or a simple online request form so we can capture the basics — service type, rough measurements, and photos if you have them. For straightforward flatwork we can often return a preliminary written estimate within one business day. Projects that require a site inspection (foundations, retaining walls, and other structural or complex work) get a scheduled visit first so pricing reflects real site conditions.',
  },
  {
    question: 'How long does concrete take to cure?',
    answer:
      'Concrete is typically firm enough for foot traffic in 24–48 hours and can generally handle vehicle traffic after about 7 days, though full structural cure takes closer to 28 days. We’ll give you specific guidance for your project and finish type before we leave the site.',
  },
  {
    question: 'What is ToughTrack™?',
    answer:
      'ToughTrack™ is our live project-tracking portal, available to every customer once a project is underway. You can see job stage progress, daily photos, crew arrival ETAs, upcoming appointments, invoices, and messages — all in one place, updated as the work happens.',
  },
  {
    question: 'What are your payment and deposit terms?',
    answer:
      'Residential jobs typically require a deposit at contract signing, with the balance due at completion (larger commercial projects may include progress billing tied to milestones). Exact terms are spelled out in your written estimate and contract before you sign — nothing is billed that isn’t itemized in advance.',
  },
  {
    question: 'What happens if it rains on our scheduled pour date?',
    answer:
      'Concrete needs the right weather window to cure properly, so we monitor forecasts closely and will reschedule a pour rather than risk a bad result. If a weather delay affects your project, you’ll get a notification with the reason and a new expected date — we don’t leave you guessing.',
  },
  {
    question: 'Do I need a permit for my project?',
    answer:
      'It depends on the scope and your local jurisdiction — many driveways, patios, and sidewalks don’t require a permit, while foundations, retaining walls, and larger commercial work often do. We help identify permit requirements as part of the estimating and site-inspection process and can pull permits on your behalf where allowed.',
  },
  {
    question: 'How do I become a subcontractor for Tough Concrete Construction?',
    answer:
      'Visit our Contractors page to learn about the trades we typically bring on (excavation, rebar/reinforcement, pumping, hauling, decorative finishing) and what’s required to register — company info, a W-9, current insurance certificate, license, and references. From there you can register and log in through the contractor portal to view bid opportunities.',
  },
  {
    question: 'What areas do you serve?',
    answer: `We serve ${BRAND.serviceAreas.map((a) => a.name).join(', ')}, and surrounding communities in ${BRAND.address.state}. Not sure if you’re in range? Reach out — we’re happy to check.`,
  },
  {
    question: 'How do change orders work?',
    answer:
      'If project scope changes after the contract is signed — say, additional square footage or an added feature discovered on site — we document it as a formal change order with the added cost and schedule impact clearly stated. Work on the change doesn’t begin until it’s reviewed and approved, so there’s never a surprise line on your final invoice.',
  },
  {
    question: 'What warranty coverage do you offer?',
    answer:
      'Every completed job is backed by our standard workmanship warranty covering defects in materials and installation. Specific warranty terms and duration are included in your project contract and completion documentation — if something isn’t right, we come back and fix it.',
  },
  {
    question: 'Can I get an estimate without a site visit?',
    answer:
      'For many common projects — driveways, patios, sidewalks, slabs — yes, our AI concierge or office team can build a preliminary estimate from measurements and photos. Note that any AI-generated preliminary estimate is not a binding quote; final pricing is confirmed once measurements are verified and, for site-inspection services, after a professional visit.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture py-16 sm:py-24">
        <HeroLogoWatermark />
        <div className="container-page relative">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            FAQ
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-xl text-concrete-300">
            Answers to the questions we hear most. Still have one?{' '}
            <Link to="/contact" className="font-semibold text-white underline underline-offset-2">
              Contact us
            </Link>{' '}
            and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-3xl divide-y divide-concrete-200 rounded-xl border border-concrete-200 bg-white shadow-card">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="font-display text-base font-bold uppercase tracking-wide text-concrete-900">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-xl font-bold text-steel-600 transition-transform',
                      isOpen && 'rotate-45',
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-concrete-600 sm:px-6">{item.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
