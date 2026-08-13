import { useState } from 'react';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { CTASection } from '@/components/marketing/CTASection';
import { cn } from '@/lib/cn';

/**
 * Gallery data. Real jobsite photos (with `image` set) are actual project
 * photos from the field; the remaining entries have no `image` and render
 * PhotoTile's labeled gradient placeholder — clearly sample/demo content
 * filling in categories we don't have a real photo of yet.
 */
interface GalleryItem {
  id: string;
  tags: string[];
  badge: string;
  caption: string;
  image?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // Real jobsite photos
  { id: 'gal-r1', tags: ['during', 'slabs'], badge: 'During', caption: 'Crew hand-finishing a freshly poured slab', image: '/gallery/slab-pour-finishing.jpeg' },
  { id: 'gal-r2', tags: ['during', 'slabs'], badge: 'During', caption: 'Power-troweling a large slab to a smooth finish', image: '/gallery/slab-finishing-crew.jpeg' },
  { id: 'gal-r3', tags: ['during', 'slabs'], badge: 'During', caption: 'Hand-finishing the edge of a new slab pour', image: '/gallery/slab-finishing-trowel.jpeg' },
  { id: 'gal-r4', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished curved driveway, broom-textured', image: '/gallery/driveway-finished-curve.jpeg' },
  { id: 'gal-r5', tags: ['after', 'patios'], badge: 'After', caption: 'Finished walkway connecting to a backyard patio', image: '/gallery/patio-walkway-finished.jpeg' },
  { id: 'gal-r6', tags: ['after', 'driveways'], badge: 'After', caption: 'Wide finished driveway with gravel shoulder', image: '/gallery/driveway-finished-wide.jpeg' },
  { id: 'gal-r7', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway running alongside the home', image: '/gallery/driveway-finished-house.jpeg' },
  { id: 'gal-r8', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway and connecting sidewalk', image: '/gallery/driveway-sidewalk-finished.jpeg' },
  { id: 'gal-r9', tags: ['during', 'driveways'], badge: 'During', caption: 'Crew hand-finishing a driveway apron', image: '/gallery/crew-finishing-apron.jpeg' },
  { id: 'gal-r10', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway on a wooded lot', image: '/gallery/driveway-finished-wooded.jpeg' },
  { id: 'gal-r11', tags: ['after', 'driveways'], badge: 'After', caption: 'Freshly finished driveway, cure sealer applied', image: '/gallery/driveway-fresh-pour.jpeg' },
  { id: 'gal-r12', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway leading up to the home', image: '/gallery/driveway-estate-1.jpeg' },
  { id: 'gal-r13', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway and parking court', image: '/gallery/parking-pad-brick-estate.jpeg' },
  { id: 'gal-r14', tags: ['after', 'driveways'], badge: 'After', caption: 'Long driveway finished for a wooded estate lot', image: '/gallery/driveway-estate-2.jpeg' },
  { id: 'gal-r15', tags: ['after', 'patios'], badge: 'After', caption: 'Finished concrete pad tucked against the home', image: '/gallery/patio-pad-brick-corner.jpeg' },
  { id: 'gal-r16', tags: ['after', 'other'], badge: 'After', caption: 'Finished walkway with a dark charcoal finish', image: '/gallery/walkway-dark-finish.jpeg' },
  { id: 'gal-r17', tags: ['after', 'other'], badge: 'After', caption: 'Finished entry pad at the front door', image: '/gallery/entry-porch-pad.jpeg' },
  { id: 'gal-r18', tags: ['during', 'driveways'], badge: 'During', caption: 'Crew finishing a new driveway for a classic farmhouse', image: '/gallery/driveway-farmhouse.jpeg' },
  { id: 'gal-r19', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway framed by mature trees', image: '/gallery/driveway-wooded-lot.jpeg' },
  { id: 'gal-r20', tags: ['after', 'other'], badge: 'After', caption: 'Finished walkway alongside a modern home', image: '/gallery/walkway-modern-house.jpeg' },
  { id: 'gal-r21', tags: ['after', 'other'], badge: 'After', caption: 'Finished porch pad for a brick home', image: '/gallery/porch-pad-brick.jpeg' },
  { id: 'gal-r22', tags: ['after', 'other'], badge: 'After', caption: 'Finished sidewalk leading to the front porch', image: '/gallery/sidewalk-front-porch.jpeg' },
  { id: 'gal-r23', tags: ['after', 'other'], badge: 'After', caption: 'Finished sidewalk along the side yard', image: '/gallery/sidewalk-side-yard.jpeg' },
  { id: 'gal-r24', tags: ['after', 'other'], badge: 'After', caption: 'Finished sidewalk along the side yard', image: '/gallery/sidewalk-side-yard-2.jpeg' },
  { id: 'gal-r25', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished curved driveway on a wooded lot', image: '/gallery/driveway-curved-wooded.jpeg' },
  { id: 'gal-r26', tags: ['after', 'driveways'], badge: 'After', caption: 'Long finished driveway through the trees', image: '/gallery/driveway-long-wooded.jpeg' },
  { id: 'gal-r27', tags: ['after', 'driveways'], badge: 'After', caption: 'Wide finished driveway on a wooded lot', image: '/gallery/driveway-wide-wooded.jpeg' },
  { id: 'gal-r28', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished parking pad for a new home', image: '/gallery/parking-pad-blue-home.jpeg' },
  { id: 'gal-r29', tags: ['before', 'driveways'], badge: 'Before', caption: 'Site graded and staked, ready to form up', image: '/gallery/site-prep-grading-1.jpeg' },
  { id: 'gal-r30', tags: ['before', 'driveways'], badge: 'Before', caption: 'Grading the base ahead of a driveway pour', image: '/gallery/site-prep-grading-2.jpeg' },
  { id: 'gal-r31', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway in warm evening light', image: '/gallery/driveway-sunset-finished.jpeg' },
  { id: 'gal-r32', tags: ['during', 'decorative'], badge: 'During', caption: 'Flagstone-and-pebble walkway being set in place', image: '/gallery/decorative-flagstone-path.jpeg' },
  { id: 'gal-r33', tags: ['during', 'decorative'], badge: 'During', caption: 'Crew setting pea gravel around flagstone pavers', image: '/gallery/decorative-flagstone-crew.jpeg' },
  { id: 'gal-r34', tags: ['during', 'decorative', 'patios'], badge: 'During', caption: 'Broom-finished concrete border with a natural stone accent', image: '/gallery/patio-broom-finish-closeup.jpeg' },
  { id: 'gal-r35', tags: ['before', 'driveways'], badge: 'Before', caption: 'Driveway extension formed up and ready to pour', image: '/gallery/site-prep-driveway-extension.jpeg' },
  { id: 'gal-r36', tags: ['during', 'driveways'], badge: 'During', caption: 'Crew finishing a fresh driveway pour', image: '/gallery/crew-finishing-subdivision.jpeg' },
  { id: 'gal-r37', tags: ['after', 'driveways'], badge: 'After', caption: 'Freshly finished driveway curing', image: '/gallery/driveway-fresh-subdivision.jpeg' },
  { id: 'gal-r38', tags: ['after', 'driveways'], badge: 'After', caption: 'Wide finished driveway for a cottage-style home', image: '/gallery/driveway-cottage-wide.jpeg' },
  { id: 'gal-r39', tags: ['after', 'other'], badge: 'After', caption: 'Freshly finished sidewalk, curing behind cones', image: '/gallery/sidewalk-cones-fresh.jpeg' },
  { id: 'gal-r40', tags: ['after', 'driveways'], badge: 'After', caption: 'Finished driveway for a two-story home', image: '/gallery/driveway-two-story-home.jpeg' },
  // Sample placeholders (no real photo yet for these categories)
  { id: 'gal-p2', tags: ['before', 'patios'], badge: 'Before', caption: 'Old paver patio removed for a full concrete replacement' },
  { id: 'gal-p3', tags: ['during', 'patios', 'decorative'], badge: 'During', caption: 'Stamped patio — pattern being tooled in' },
  { id: 'gal-p4', tags: ['after', 'patios', 'decorative'], badge: 'After', caption: 'Finished stamped patio, slate pattern' },
  { id: 'gal-p5', tags: ['before', 'commercial'], badge: 'Before', caption: 'Deteriorating retail parking lot section prior to replacement' },
  { id: 'gal-p6', tags: ['during', 'commercial'], badge: 'During', caption: 'Commercial parking pad — subgrade compaction' },
  { id: 'gal-p7', tags: ['after', 'commercial'], badge: 'After', caption: 'Completed commercial parking pad' },
  { id: 'gal-p8', tags: ['after', 'commercial'], badge: 'After', caption: 'Dumpster enclosure pad for a retail center' },
  { id: 'gal-p9', tags: ['during', 'decorative'], badge: 'During', caption: 'Integral color being mixed for a decorative pour' },
  { id: 'gal-p10', tags: ['after', 'decorative'], badge: 'After', caption: 'Colored, scored walkway leading to a front entry' },
  { id: 'gal-p11', tags: ['after', 'decorative'], badge: 'After', caption: 'Stamped stone-pattern pool deck' },
  { id: 'gal-p12', tags: ['before', 'slabs'], badge: 'Before', caption: 'Site graded and ready for a workshop slab' },
  { id: 'gal-p13', tags: ['during', 'foundations'], badge: 'During', caption: 'Foundation formwork and rebar cage inspection' },
  { id: 'gal-p14', tags: ['after', 'foundations'], badge: 'After', caption: 'Poured foundation footings, ready for framing' },
  { id: 'gal-p15', tags: ['after', 'other'], badge: 'After', caption: 'Retaining wall built to manage a rear-yard grade change' },
  { id: 'gal-p16', tags: ['before', 'other'], badge: 'Before', caption: 'Settled sidewalk section flagged for replacement' },
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
            <PhotoTile key={item.id} id={item.id} url={item.image} category={item.badge} caption={item.caption} />
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
