import { ButtonLink } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
      <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <span className="font-display text-8xl font-bold text-white/10 sm:text-9xl">404</span>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Looks Like This Page Didn&apos;t Get Poured
        </h1>
        <p className="mt-4 max-w-md text-concrete-300">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on solid
          ground.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/" size="lg">
            Back to Home
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline-light" size="lg">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
