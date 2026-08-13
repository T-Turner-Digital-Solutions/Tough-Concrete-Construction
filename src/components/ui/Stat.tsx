import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/cn';

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
  icon?: ReactNode;
}

const toneText = {
  default: 'text-concrete-900',
  warning: 'text-safety-600',
  danger: 'text-red-600',
  success: 'text-emerald-600',
};

export function Stat({ label, value, hint, tone = 'default', icon }: StatProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-concrete-500">{label}</p>
        {icon && <span className="text-concrete-400">{icon}</span>}
      </div>
      <p className={cn('mt-2 font-display text-3xl font-bold', toneText[tone])}>{value}</p>
      {hint && <p className="mt-1 text-xs text-concrete-500">{hint}</p>}
    </Card>
  );
}
