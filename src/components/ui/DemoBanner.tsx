import { isSupabaseConfigured } from '@/lib/supabase';
import { DEMO_MODE_BANNER } from '@/config/brand';

export function DemoBanner({ className = '' }: { className?: string }) {
  if (isSupabaseConfigured) return null;
  return (
    <div className={`flex items-center gap-2 rounded-md border border-safety-300 bg-safety-50 px-3 py-2 text-xs font-medium text-safety-800 ${className}`}>
      <span aria-hidden>●</span>
      {DEMO_MODE_BANNER}
    </div>
  );
}
