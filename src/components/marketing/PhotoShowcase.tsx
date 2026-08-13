export interface ShowcasePhoto {
  image: string;
  title: string;
  caption: string;
}

export function PhotoShowcase({ photos }: { photos: ShowcasePhoto[] }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <div key={photo.image} className="group relative overflow-hidden rounded-xl shadow-card">
          <img src={photo.image} alt={photo.title} className="aspect-[3/2] w-full object-cover" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-10">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">{photo.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-concrete-200">{photo.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
