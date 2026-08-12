import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Real Supabase client when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
 * are set (see .env.example), otherwise `null`. Every data-access module
 * under `src/lib/data/*` checks `isSupabaseConfigured` and falls back to
 * the clearly-labeled in-memory demo store — the app never pretends a
 * write persisted when it didn't.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '[Tough Concrete] Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing). ' +
      'Running in demo mode with local, non-persistent sample data. See .env.example.',
  );
}
