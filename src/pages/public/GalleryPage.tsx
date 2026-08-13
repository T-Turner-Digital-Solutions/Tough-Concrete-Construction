import { useState } from 'react';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { CTASection } from '@/components/marketing/CTASection';
import { cn } from '@/lib/cn';

/**
 * Demo/sample gallery data. This is a general project-showcase gallery (not
 * tied to a single job), so entries are authored here rather than pulled
 * from job-specific `demoPhotos` in demoData.ts. No `url` is set, so each
 * tile renders PhotoTile's labeled gradient placeholder.
 */
interface GalleryItem {
  id: string;
  tags: string[];
  badge: string;
  caption: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'gal-1', tags: ['before', 'driveways'], badge: 'Before', caption: 'Cracked, heaving driveway before removal — Birmingham, AL' },
  { id: 'gal-2', tags: ['during', 'driveways'], badge: 'During', caption: 'Forms and rebar set for a new driveway pour' },
  { id: 'gal-3', tags: ['after', 'driveways'], badge: 'After', caption: 'Broom-finished driveway, ready for traffic — Hoover, AL' },
  { id: 'gal-4', tags: ['after', 'driveways'], badge: 'After', caption: 'Exposed-aggregate driveway extension' },
  { id: 'gal-5', tags: ['before', 'patios'], badge: 'Before', caption: 'Old paver patio removed for a full concrete replacement' },
  { id: 'gal-6', tags: ['during', 'patios', 'decorative'], badge: 'During', caption: 'Stamped patio — pattern being tooled in' },
  { id: 'gal-7', tags: ['after', 'patios', 'decorative'], badge: 'After', caption: 'Finished stamped patio, slate pattern — Vestavia Hills, AL' },
  { id: 'gal-8', tags: ['after', 'patios'], badge: 'After', caption: 'Broom-finished backyard patio with fire pit footing' },
  { id: 'gal-9', tags: ['before', 'commercial'], badge: 'Before', caption: 'Deteriorating retail parking lot section prior to replacement' },
  { id: 'gal-10', tags: ['during', 'commercial'], badge: 'During', caption: 'Commercial parking pad — subgrade compaction' },
  { id: 'gal-11', tags: ['after', 'commercial'], badge: 'After', caption: 'Completed commercial parking pad — Trussville, AL' },
  { id: 'gal-12', tags: ['after', 'commercial'], badge: 'After', caption: 'Dumpster enclosure pad for a retail center' },
  { id: 'gal-13', tags: ['during', 'decorative'], badge: 'During', caption: 'Integral color being mixed for a decorative pour' },
  { id: 'gal-14', tags: ['after', 'decorative'], badge: 'After', caption: 'Colored, scored walkway leading to a front entry' },
  { id: 'gal-15', tags: ['after', 'decorative'], badge: 'After', caption: 'Stamped stone-pattern pool deck — Mountain Brook, AL' },
  { id: 'gal-16', tags: ['before', 'slabs'], badge: 'Before', caption: 'Site graded and ready for a workshop slab' },
  { id: 'gal-17', tags: ['during', 'slabs'], badge: 'During', caption: 'Vapor barrier and wire mesh set for a garage slab' },
  { id: 'gal-18', tags: ['after', 'slabs'], badge: 'After', caption: 'Finished garage slab, troweled smooth — Hueytown, AL' },
  { id: 'gal-19', tags: ['during', 'foundations'], badge: 'During', caption: 'Foundation formwork and rebar cage inspection' },
  { id: 'gal-20', tags: ['after', 'foundations'], badge: 'After', caption: 'Poured foundation footings, ready for framing' },
  { id: 'gal-21', tags: ['after', 'other'], badge: 'After', caption: 'Retaining wall built to manage a rear-yard grade change' },
  { id: 'gal-22', tags: ['after', 'other'], badge: 'After', caption: 'Repaired and resurfaced entry steps' },
  { id: 'gal-23', tags: ['before', 'other'], badge: 'Before', caption: 'Settled sidewalk section flagged for replacement' },
  { id: 'gal-24', tags: ['after', 'driveways', 'decorative'], badge: 'After', caption: 'Charcoal-colored driveway with soldier-course border' },
];

const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'before', label: 'Before' },
  { key: 'during', label: 'During' },
  { key: 'after', label: 'After' },
  { key: 'driveways', label: 'Driveways' },
  { key: 'patios', label: 'Patios' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'decorative', label: 'Decorative' },
  { key: 'slabs', label: 'Slabs' },
  { key: 'foundations', label: 'Foundations' },
  { key: 'other', label: 'Other' },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const items = filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.tags.includes(filter));

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative py-20 sm:py-28">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            Project Gallery
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            See the work before you sign anything.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">
            A sample of residential and commercial projects — from demolition through final finish. Full-resolution
            project photos are also available for every ToughTrack&trade; customer.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors',
                filter === f.key
                  ? 'border-concrete-900 bg-concrete-900 text-white'
                  : 'border-concrete-200 bg-white text-concrete-600 hover:border-concrete-400',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <PhotoTile key={item.id} id={item.id} category={item.badge} caption={item.caption} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-concrete-500">No project photos match that filter yet.</p>
        )}
      </section>

      <CTASection />
    </div>
  );
}
