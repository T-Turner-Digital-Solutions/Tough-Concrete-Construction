interface TestimonialProps {
  quote: string;
  name: string;
  location: string;
  project: string;
}

export function TestimonialCard({ quote, name, location, project }: TestimonialProps) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-xl border border-concrete-200 bg-concrete-50 p-6">
      <div>
        <div className="mb-3 flex gap-0.5 text-safety-500" aria-hidden>
          {'★★★★★'.split('').map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        <blockquote className="text-sm leading-relaxed text-concrete-700">“{quote}”</blockquote>
      </div>
      <figcaption className="mt-5 border-t border-concrete-200 pt-4">
        <p className="text-sm font-semibold text-concrete-900">{name}</p>
        <p className="text-xs text-concrete-500">
          {location} · {project}
        </p>
      </figcaption>
    </figure>
  );
}
