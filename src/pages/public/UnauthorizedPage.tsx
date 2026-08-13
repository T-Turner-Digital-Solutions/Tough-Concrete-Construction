import { ButtonLink } from '@/components/ui/Button';
import { BRAND } from '@/config/brand';

export default function UnauthorizedPage() {
  return (
    <div className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
      <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
          Access Restricted
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          You Don&apos;t Have Access To This Page
        </h1>
        <p className="mt-4 max-w-md text-concrete-300">
          Your account doesn&apos;t have permission to view this area. This can happen if you&apos;re signed in with
          the wrong type of account, or if a link was shared that isn&apos;t meant for your role.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/" size="lg">
            Back to Home
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline-light" size="lg">
            Contact Support
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-concrete-400">
          If you believe this is an error, reach out at{' '}
          <a href={`mailto:${BRAND.email}`} className="font-semibold text-white underline underline-offset-2">
            {BRAND.email}
          </a>{' '}
          or {BRAND.phoneDisplay}.
        </p>
      </div>
    </div>
  );
}
