import { cn } from '@/lib/cn';

const categoryLabels: Record<string, string> = {
  before: 'Before',
  demolition: 'Demolition',
  excavation: 'Excavation',
  base_preparation: 'Base Prep',
  forms: 'Forms',
  reinforcement: 'Reinforcement',
  pour: 'Pour',
  finishing: 'Finishing',
  completed: 'Completed',
  warranty: 'Warranty',
  internal_documentation: 'Internal',
};

const gradients = [
  'from-concrete-700 to-concrete-900',
  'from-steel-600 to-concrete-900',
  'from-concrete-600 to-steel-800',
  'from-safety-700 to-concrete-900',
];

function hashIndex(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % mod;
}

interface PhotoTileProps {
  id: string;
  url?: string;
  category?: string;
  caption?: string | null;
  className?: string;
}

/**
 * Demo/placeholder image tile. When a real `url` is supplied (i.e. Supabase
 * Storage is wired up) it renders the actual photo; otherwise it renders a
 * labeled gradient tile so the gallery/photo UX is fully explorable without
 * fabricating fake image files.
 */
export function PhotoTile({ id, url, category, caption, className }: PhotoTileProps) {
  if (url) {
    return (
      <div className={cn('relative aspect-[4/3] overflow-hidden rounded-lg bg-concrete-200', className)}>
        <img src={url} alt={caption ?? category ?? 'Project photo'} className="h-full w-full object-cover" loading="lazy" />
        {(category || caption) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-8">
            {category && (
              <span className="mb-1 inline-block rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                {categoryLabels[category] ?? category}
              </span>
            )}
            {caption && <p className="line-clamp-2 text-xs font-medium text-white">{caption}</p>}
          </div>
        )}
      </div>
    );
  }

  const gradient = gradients[hashIndex(id, gradients.length)];
  return (
    <div
      className={cn(
        'relative flex aspect-[4/3] items-end overflow-hidden rounded-lg bg-gradient-to-br p-3 text-white',
        gradient,
        className,
      )}
    >
      <div className="absolute inset-0 bg-concrete-texture opacity-40" aria-hidden />
      <div className="relative">
        {category && (
          <span className="mb-1 inline-block rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            {categoryLabels[category] ?? category}
          </span>
        )}
        {caption && <p className="line-clamp-2 text-xs font-medium text-white/90">{caption}</p>}
      </div>
    </div>
  );
}
