import { useEffect, useState } from 'react';

interface CarouselSlide {
  src: string;
  label: string;
}

const SLIDES: CarouselSlide[] = [
  { src: '/gallery/driveway-estate-1.jpeg', label: 'Driveways' },
  { src: '/gallery/patio-walkway-finished.jpeg', label: 'Patios' },
  { src: '/gallery/slab-pour-finishing.jpeg', label: 'Foundations & Slabs' },
  { src: '/gallery/driveway-farmhouse.jpeg', label: 'Driveways' },
  { src: '/gallery/decorative-flagstone-path.jpeg', label: 'Decorative Hardscaping' },
  { src: '/gallery/driveway-cottage-wide.jpeg', label: 'Driveways' },
  { src: '/gallery/crew-finishing-subdivision.jpeg', label: 'Our Crew At Work' },
  { src: '/gallery/driveway-curved-wooded.jpeg', label: 'Driveways' },
];

const INTERVAL_MS = 4000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-card">
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.label}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 pt-14">
        <span className="rounded bg-black/40 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {SLIDES[index].label}
        </span>
      </div>
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
