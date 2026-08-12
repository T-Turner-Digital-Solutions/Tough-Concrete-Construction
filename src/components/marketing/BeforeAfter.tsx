import { useState } from 'react';

/**
 * Lightweight before/after comparison slider. Uses gradient placeholder
 * panels (labeled Before/After) rather than fabricated project photography —
 * swap in real photo URLs via the `beforeUrl`/`afterUrl` props once project
 * photos are uploaded through the admin Photos module.
 */
export function BeforeAfter({
  label,
  beforeUrl,
  afterUrl,
}: {
  label: string;
  beforeUrl?: string;
  afterUrl?: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="overflow-hidden rounded-xl border border-concrete-200 shadow-card">
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden bg-concrete-800">
        <div className="absolute inset-0">
          <Panel url={afterUrl} tone="after" label={label} />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Panel url={beforeUrl} tone="before" label={label} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white" style={{ left: `${pos}%` }} />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Before/after slider for ${label}`}
          className="absolute inset-x-0 bottom-3 z-20 mx-auto w-4/5 accent-safety-500"
        />
      </div>
    </div>
  );
}

function Panel({ url, tone, label }: { url?: string; tone: 'before' | 'after'; label: string }) {
  if (url) {
    return <img src={url} alt={`${tone === 'before' ? 'Before' : 'After'} — ${label}`} className="h-full w-full object-cover" />;
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
        tone === 'before' ? 'from-concrete-500 to-concrete-700' : 'from-steel-600 to-concrete-900'
      }`}
    >
      <span className="rounded bg-black/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
        {tone === 'before' ? 'Before' : 'After'} · {label}
      </span>
    </div>
  );
}
