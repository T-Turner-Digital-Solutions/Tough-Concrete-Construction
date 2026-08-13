import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
  tone?: 'accent' | 'success' | 'steel';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const tones = {
  accent: 'bg-safety-500',
  success: 'bg-emerald-500',
  steel: 'bg-steel-600',
};

export function ProgressBar({ value, className, tone = 'accent', showLabel, size = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full overflow-hidden rounded-full bg-concrete-200', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', tones[tone])}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <p className="mt-1 text-xs font-medium text-concrete-500">{clamped}% complete</p>}
    </div>
  );
}
