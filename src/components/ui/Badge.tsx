import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const tones = {
  neutral: 'bg-concrete-100 text-concrete-700',
  info: 'bg-steel-100 text-steel-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-safety-100 text-safety-800',
  danger: 'bg-red-100 text-red-700',
  dark: 'bg-concrete-900 text-white',
};

export type BadgeTone = keyof typeof tones;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
