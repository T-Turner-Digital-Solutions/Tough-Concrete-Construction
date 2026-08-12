import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types/domain';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  /** true when using local demo-mode auth (no Supabase project configured). */
  demoMode: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  /** Demo-mode only: instantly "sign in" as a role to preview each portal. */
  signInAsDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_PROFILES: Record<UserRole, Profile> = {
  owner_admin: { id: 'profile-owner-1', role: 'owner_admin', full_name: 'Tomás Turner (Owner)', email: 'owner@toughconcreteconstruction.com', phone: '(555) 123-4567', avatar_url: null, created_at: '2020-01-01T00:00:00Z' },
  office_staff: { id: 'profile-office-1', role: 'office_staff', full_name: 'Renee Ashford', email: 'renee@toughconcreteconstruction.com', phone: '(555) 123-4501', avatar_url: null, created_at: '2021-03-01T00:00:00Z' },
  field_crew: { id: 'profile-crew-1', role: 'field_crew', full_name: 'Danny Ortega', email: 'danny@toughconcreteconstruction.com', phone: '(555) 123-4502', avatar_url: null, created_at: '2021-06-01T00:00:00Z' },
  customer: { id: 'profile-customer-1', role: 'customer', full_name: 'Michael Reyes', email: 'reyes.family@example.com', phone: '(214) 555-0148', avatar_url: null, created_at: '2023-04-11T14:00:00Z' },
  contractor: { id: 'profile-contractor-1', role: 'contractor', full_name: 'Roberto Alvarez', email: 'roberto@alvarezgrading.example.com', phone: '(972) 555-0122', avatar_url: null, created_at: '2025-01-15T12:00:00Z' },
};

const DEMO_SESSION_KEY = 'tcc_demo_role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const stored = window.localStorage.getItem(DEMO_SESSION_KEY) as UserRole | null;
      if (stored && DEMO_PROFILES[stored]) {
        setProfile(DEMO_PROFILES[stored]);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void loadProfile(data.session.user.id);
      else setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) void loadProfile(newSession.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    if (!supabase) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      demoMode: !isSupabaseConfigured,
      async signInWithPassword(email, password) {
        if (!supabase) return { error: 'Supabase is not configured. Use "Preview as..." below in demo mode.' };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signUp(email, password, fullName, role) {
        if (!supabase) return { error: 'Supabase is not configured. Use "Preview as..." below in demo mode.' };
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } });
        if (error) return { error: error.message };
        if (data.user) {
          await supabase.from('profiles').insert({ id: data.user.id, email, full_name: fullName, role });
        }
        return { error: null };
      },
      async signOut() {
        if (supabase) await supabase.auth.signOut();
        window.localStorage.removeItem(DEMO_SESSION_KEY);
        setProfile(null);
        setSession(null);
      },
      signInAsDemoRole(role) {
        window.localStorage.setItem(DEMO_SESSION_KEY, role);
        setProfile(DEMO_PROFILES[role]);
      },
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
