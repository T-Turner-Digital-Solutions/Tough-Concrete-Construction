import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { UserRole } from '@/types/domain';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface RequireRoleProps {
  roles: UserRole[];
  redirectTo: string;
  children: ReactNode;
}

/**
 * Client-side route gate. This is a UX convenience only — the real
 * authorization boundary is Postgres Row Level Security (see
 * supabase/migrations/0001_init.sql), so a user who bypasses this guard
 * still cannot read/write rows they aren't entitled to.
 */
export function RequireRole({ roles, redirectTo, children }: RequireRoleProps) {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!profile) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  if (!roles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
