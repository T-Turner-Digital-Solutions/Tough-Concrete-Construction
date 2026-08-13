import { Link } from 'react-router-dom';
import type { ServiceTypeKey } from '@/config/pricing';

export interface ShowcasePhoto {
  image: string;
  title: string;
  caption: string;
  serviceKey?: ServiceTypeKey;
}

export function PhotoShowcase({ photos }: { photos: ShowcasePhoto[] }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <div key={photo.image} className="overflow-hidden rounded-xl border border-concrete-200 bg-white shadow-card">
          <img src={photo.image} alt={photo.title} className="aspect-[3/2] w-full object-cover" loading="lazy" />
          <div className="p-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-concrete-900">{photo.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-concrete-600">{photo.caption}</p>
            {photo.serviceKey && (
              <Link
                to={`/services/${photo.serviceKey}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-steel-700 hover:text-safety-600"
              >
                Learn more <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
