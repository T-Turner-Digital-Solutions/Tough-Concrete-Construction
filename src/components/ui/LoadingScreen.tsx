export function LoadingScreen({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 text-concrete-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-concrete-300 border-t-safety-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function Skeleton({ className = 'h-4 w-full' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-concrete-200 ${className}`} />;
}
