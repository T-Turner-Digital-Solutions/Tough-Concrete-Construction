import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_TYPES } from '@/config/pricing';
import { BLANK_ANSWERS, evaluateConcierge, PRELIMINARY_ESTIMATE_DISCLAIMER, type ConciergeAnswers } from '@/lib/aiConcierge';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { cn } from '@/lib/cn';

type Phase =
  | 'category'
  | 'service_type'
  | 'length'
  | 'width'
  | 'thickness'
  | 'removal'
  | 'finish'
  | 'reinforcement'
  | 'access'
  | 'result';

const PHASES: Phase[] = ['category', 'service_type', 'length', 'width', 'thickness', 'removal', 'finish', 'reinforcement', 'access', 'result'];

interface Bubble {
  id: string;
  from: 'ai' | 'user';
  text: string;
}

interface AiConciergeChatProps {
  mode?: 'lead' | 'addon';
  addonContextLabel?: string;
  onRequestAddOn?: (answers: ConciergeAnswers, priceLow: number, priceHigh: number) => void;
}

export function AiConciergeChat({ mode = 'lead', addonContextLabel, onRequestAddOn }: AiConciergeChatProps) {
  const [answers, setAnswers] = useState<ConciergeAnswers>(BLANK_ANSWERS);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [history, setHistory] = useState<Bubble[]>([
    {
      id: 'welcome',
      from: 'ai',
      text:
        mode === 'addon' && addonContextLabel
          ? `Hi! I'm the Tough Concrete AI Concierge. I can see you already have an active project (${addonContextLabel}). Let's figure out pricing for the addition you have in mind. First — is this for your home or a commercial property?`
          : "Hi! I'm the Tough Concrete AI Concierge. I can help you get a preliminary estimate. First — is this project residential or commercial?",
    },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const phase = PHASES[phaseIndex];

  function pushBubble(from: Bubble['from'], text: string) {
    setHistory((h) => [...h, { id: `${from}-${h.length}`, from, text }]);
  }

  function advance(nextAnswers: ConciergeAnswers, userText: string, aiText: string) {
    pushBubble('user', userText);
    setAnswers(nextAnswers);
    setTimeout(() => pushBubble('ai', aiText), 250);
    setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));
  }

  const outcome = phase === 'result' ? evaluateConcierge(answers) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-1">
        {history.map((b) => (
          <div key={b.id} className={cn('flex', b.from === 'ai' ? 'justify-start' : 'justify-end')}>
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                b.from === 'ai' ? 'rounded-tl-sm bg-concrete-100 text-concrete-800' : 'rounded-tr-sm bg-steel-700 text-white',
              )}
            >
              {b.text}
            </div>
          </div>
        ))}

        {phase === 'result' && outcome && (
          <div className="rounded-xl border border-concrete-200 bg-white p-4 shadow-card">
            {outcome.status === 'incomplete' && (
              <p className="text-sm text-concrete-500">A few more details are needed — let's back up.</p>
            )}

            {outcome.status === 'site_inspection_required' && (
              <div>
                <p className="mb-2 inline-block rounded-full bg-safety-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-safety-800">
                  Site Inspection Required
                </p>
                <p className="text-sm text-concrete-700">
                  Based on what you've described, this project needs a professional site review before we can provide
                  pricing:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-concrete-600">
                  {outcome.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link to="/schedule-site-visit">
                    <Button size="sm">Schedule a Site Visit</Button>
                  </Link>
                  <Link to="/request-estimate">
                    <Button size="sm" variant="outline">
                      Submit Full Details Instead
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {outcome.status === 'estimate' && (
              <div>
                <p className="mb-2 inline-block rounded-full bg-steel-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-steel-800">
                  Preliminary Estimate
                </p>
                <p className="font-display text-2xl font-bold text-concrete-900">
                  {formatCurrency(outcome.result.total * 0.9)} – {formatCurrency(outcome.result.total * 1.1)}
                </p>
                <p className="mt-1 text-xs text-concrete-500">
                  {outcome.serviceLabel} · {outcome.result.squareFootage} sq ft · {outcome.result.cubicYardsWithWaste} cubic
                  yards (incl. waste)
                </p>
                <p className="mt-3 text-xs leading-relaxed text-concrete-500">{PRELIMINARY_ESTIMATE_DISCLAIMER}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {mode === 'addon' ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        onRequestAddOn?.(answers, outcome.result.total * 0.9, outcome.result.total * 1.1);
                        setSubmitted(true);
                      }}
                      disabled={submitted}
                    >
                      {submitted ? 'Request Sent ✓' : 'Request This Addition'}
                    </Button>
                  ) : (
                    <Link to="/request-estimate">
                      <Button size="sm">Get an Official Estimate</Button>
                    </Link>
                  )}
                  <Link to="/schedule-site-visit">
                    <Button size="sm" variant="outline">
                      Schedule a Site Visit
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-concrete-100 pt-3">
        <ConciergeStepInput
          phase={phase}
          onAnswer={advance}
          answers={answers}
        />
      </div>
    </div>
  );
}

function ConciergeStepInput({
  phase,
  answers,
  onAnswer,
}: {
  phase: Phase;
  answers: ConciergeAnswers;
  onAnswer: (a: ConciergeAnswers, userText: string, aiText: string) => void;
}) {
  const [text, setText] = useState('');

  if (phase === 'category') {
    return (
      <QuickReplies
        options={[
          { label: 'Residential', value: 'residential' },
          { label: 'Commercial', value: 'commercial' },
        ]}
        onSelect={(value) =>
          onAnswer(
            { ...answers, category: value as 'residential' | 'commercial' },
            value === 'residential' ? 'Residential' : 'Commercial',
            'Got it. What type of project is this?',
          )
        }
      />
    );
  }

  if (phase === 'service_type') {
    return (
      <QuickReplies
        options={SERVICE_TYPES.slice(0, 8).map((s) => ({ label: s.label, value: s.key }))}
        onSelect={(value) => {
          const svc = SERVICE_TYPES.find((s) => s.key === value)!;
          onAnswer(
            { ...answers, serviceType: svc.key },
            svc.label,
            `${svc.label} — got it. What's the approximate length, in feet?`,
          );
        }}
      />
    );
  }

  if (phase === 'length' || phase === 'width' || phase === 'thickness') {
    const label = phase === 'length' ? 'length in feet' : phase === 'width' ? 'width in feet' : 'thickness in inches';
    return (
      <NumberInput
        placeholder={`Enter ${label}`}
        value={text}
        onChange={setText}
        onSubmit={(n) => {
          const next = { ...answers };
          let aiText = '';
          if (phase === 'length') {
            next.lengthFt = n;
            aiText = 'Thanks. And the approximate width, in feet?';
          } else if (phase === 'width') {
            next.widthFt = n;
            aiText = "And the thickness, in inches? If you're not sure, 4 inches is standard for most flatwork.";
          } else {
            next.thicknessIn = n;
            aiText = 'Do you need any existing concrete removed first?';
          }
          onAnswer(next, `${n} ${phase === 'thickness' ? 'in' : 'ft'}`, aiText || 'Got it.');
          setText('');
        }}
      />
    );
  }

  if (phase === 'removal') {
    return (
      <QuickReplies
        options={[
          { label: 'Yes, removal needed', value: 'yes' },
          { label: 'No, new area', value: 'no' },
        ]}
        onSelect={(value) =>
          onAnswer(
            { ...answers, removalNeeded: value === 'yes' },
            value === 'yes' ? 'Yes' : 'No',
            'What finish are you hoping for? (e.g. broom finish, stamped, colored, exposed aggregate)',
          )
        }
      />
    );
  }

  if (phase === 'finish') {
    return (
      <TextInput
        placeholder="e.g. Broom finish, stamped stone pattern..."
        value={text}
        onChange={setText}
        onSubmit={(v) => {
          onAnswer({ ...answers, desiredFinish: v }, v, 'Should we plan for rebar, wire mesh, or fiber reinforcement? If unsure, we can recommend one.');
          setText('');
        }}
      />
    );
  }

  if (phase === 'reinforcement') {
    return (
      <QuickReplies
        options={[
          { label: 'Rebar', value: 'rebar' },
          { label: 'Wire Mesh', value: 'wire_mesh' },
          { label: 'Fiber', value: 'fiber' },
          { label: 'Not sure — recommend one', value: 'wire_mesh' },
        ]}
        onSelect={(value) =>
          onAnswer(
            { ...answers, reinforcement: value as ConciergeAnswers['reinforcement'] },
            value === 'wire_mesh' ? 'Wire mesh' : value,
            'Last question — any access challenges? (steep slope, narrow gate, retaining wall nearby, drainage concerns) Type "none" if not.',
          )
        }
      />
    );
  }

  if (phase === 'access') {
    return (
      <TextInput
        placeholder='e.g. "none" or describe access/grading'
        value={text}
        onChange={setText}
        onSubmit={(v) => {
          onAnswer({ ...answers, accessNotes: v }, v, 'Thanks! Here is your preliminary estimate.');
          setText('');
        }}
      />
    );
  }

  return null;
}

function QuickReplies({ options, onSelect }: { options: { label: string; value: string }[]; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value + o.label}
          onClick={() => onSelect(o.value)}
          className="rounded-full border border-steel-300 bg-steel-50 px-3.5 py-1.5 text-xs font-semibold text-steel-800 transition-colors hover:bg-steel-100"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, onSubmit }: { placeholder: string; value: string; onChange: (v: string) => void; onSubmit: (v: string) => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      className="flex gap-2"
    >
      <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      <Button type="submit" size="sm">
        Send
      </Button>
    </form>
  );
}

function NumberInput({ placeholder, value, onChange, onSubmit }: { placeholder: string; value: string; onChange: (v: string) => void; onSubmit: (n: number) => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const n = Number(value);
        if (value.trim() && n > 0) onSubmit(n);
      }}
      className="flex gap-2"
    >
      <Input type="number" min={0} step="0.5" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      <Button type="submit" size="sm">
        Send
      </Button>
    </form>
  );
}
