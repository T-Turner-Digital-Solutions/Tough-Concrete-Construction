import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/ui/Field';
import { useAuth } from '@/lib/auth/AuthContext';
import { BRAND } from '@/config/brand';
import type { UserRole } from '@/types/domain';

const DEMO_ROLES: { role: UserRole; label: string }[] = [
  { role: 'owner_admin', label: 'Preview as Owner / Admin (Jorge Garcia)' },
  { role: 'office_staff', label: 'Preview as Office Staff (Renee Ashford)' },
  { role: 'field_crew', label: 'Preview as Field Crew (Danny Ortega)' },
];

export default function StaffLoginPage() {
  const { signInWithPassword, signInAsDemoRole, demoMode } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signInWithPassword(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/admin');
  }

  function handleDemoPreview(role: UserRole) {
    signInAsDemoRole(role);
    navigate('/admin');
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-concrete-300 bg-concrete-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-concrete-700">
            Owner / Staff
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">Team Sign In</h1>
          <p className="mt-2 text-sm text-concrete-500">
            Sign in to the {BRAND.dbaName} command center — leads, estimates, jobs, ToughTrack, invoicing, and settings.
          </p>
        </div>

        <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField label="Email" htmlFor="email" required>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormField>
            <FormField label="Password" htmlFor="password" required>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </FormField>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" variant="dark" size="lg" fullWidth disabled={submitting}>
              {submitting ? 'Please wait…' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-concrete-400">
            New team member accounts are created by an owner/admin from Settings → Users, not by self-signup.
          </p>
        </div>

        {demoMode && (
          <div className="mt-6 space-y-2 rounded-xl border border-safety-300 bg-safety-50 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-safety-800">Demo Mode — Preview As</p>
            <p className="mb-2 text-sm text-concrete-600">No live database is connected yet. Instantly preview the command center with each staff role.</p>
            {DEMO_ROLES.map((r) => (
              <Button key={r.role} variant="dark" fullWidth onClick={() => handleDemoPreview(r.role)}>
                {r.label}
              </Button>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          <Link to="/portal/login" className="font-semibold text-steel-700 hover:underline">
            Are you a customer? Log in here
          </Link>
          <Link to="/contractors/login" className="font-semibold text-steel-700 hover:underline">
            Are you a contractor? Log in here
          </Link>
          <Link to="/" className="text-concrete-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
