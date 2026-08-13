interface FlatworkPhoto {
  image: string;
  title: string;
  caption: string;
}

const FLATWORK_PHOTOS: FlatworkPhoto[] = [
  { image: '/gallery/flatwork-driveway-before-after.jpeg', title: 'Driveway Replacement', caption: 'Failing, stained driveway replaced with a clean broom-finished pour.' },
  { image: '/gallery/flatwork-patio-firepit-before-after.jpeg', title: 'Backyard Patio', caption: 'Cracked patio rebuilt around the outdoor living and fire pit area.' },
  { image: '/gallery/flatwork-walkway-before-after.jpeg', title: 'Front Walkway', caption: 'Uneven, cracked walkway replaced with a smooth, even path.' },
  { image: '/gallery/flatwork-sidewalk-before-after.jpeg', title: 'Sidewalk Replacement', caption: 'Heaved, broken sidewalk sections removed and repoured.' },
  { image: '/gallery/flatwork-garage-floor-before-after.jpeg', title: 'Garage Slab', caption: 'Stained, cracked garage floor resurfaced with a new slab.' },
  { image: '/gallery/flatwork-pool-deck-before-after.jpeg', title: 'Pool Deck', caption: 'Worn, cracked pool deck replaced with a bright new surface.' },
  { image: '/gallery/flatwork-walkway-paver-border-before-after.jpeg', title: 'Walkway with Paver Border', caption: 'Front walkway rebuilt with a paver-edged concrete finish.' },
  { image: '/gallery/flatwork-backyard-slab-before-after.jpeg', title: 'Backyard Slab', caption: 'Bare gravel pad replaced with a new backyard concrete slab.' },
  { image: '/gallery/flatwork-patio-before-after.jpeg', title: 'Patio Slab', caption: 'Old, cracked patio slab replaced with a clean broom finish.' },
  { image: '/gallery/flatwork-driveway-finished.jpeg', title: 'Finished Driveway', caption: 'A finished two-car driveway pour, broom-textured and curb-edged.' },
];

export function FlatworkShowcase() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FLATWORK_PHOTOS.map((photo) => (
        <div key={photo.image} className="overflow-hidden rounded-xl border border-concrete-200 bg-white shadow-card">
          <img src={photo.image} alt={photo.title} className="aspect-[3/2] w-full object-cover" loading="lazy" />
          <div className="p-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-concrete-900">{photo.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-concrete-600">{photo.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
