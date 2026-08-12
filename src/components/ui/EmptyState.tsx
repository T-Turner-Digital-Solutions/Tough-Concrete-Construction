import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-concrete-300 bg-concrete-50 px-6 py-14 text-center">
      {icon && <div className="mb-3 text-concrete-400">{icon}</div>}
      <p className="font-display text-lg font-semibold text-concrete-800">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-concrete-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
