import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/ui/Field';
import { useAuth } from '@/lib/auth/AuthContext';
import { BRAND } from '@/config/brand';

type Mode = 'sign-in' | 'sign-up';

export default function CustomerLoginPage(): ReactNode {
  const { signInWithPassword, signUp, signInAsDemoRole, demoMode } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('sign-in');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result =
      mode === 'sign-in' ? await signInWithPassword(email, password) : await signUp(email, password, fullName, 'customer');

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/portal');
  }

  function handleDemoPreview() {
    signInAsDemoRole('customer');
    navigate('/portal');
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-steel-200 bg-steel-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-steel-700">
            Customer Portal
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">
            {mode === 'sign-in' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="mt-2 text-sm text-concrete-500">
            {mode === 'sign-in'
              ? `Sign in to track your project with ${BRAND.dbaName}.`
              : 'Set up an account to follow your project from estimate to completion.'}
          </p>
        </div>

        <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === 'sign-up' && (
              <FormField label="Full Name" htmlFor="fullName" required>
                <Input id="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </FormField>
            )}
            <FormField label="Email" htmlFor="email" required>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormField>
            <FormField label="Password" htmlFor="password" required>
              <Input
                id="password"
                type="password"
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
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

            <Button type="submit" size="lg" fullWidth disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
              setError(null);
            }}
            className="mt-4 w-full text-center text-sm font-semibold text-steel-700 hover:text-steel-800 hover:underline"
          >
            {mode === 'sign-in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {demoMode && (
          <div className="mt-6 rounded-xl border border-safety-300 bg-safety-50 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-safety-800">Demo Mode — Preview As</p>
            <p className="mt-2 text-sm text-concrete-600">
              No live database is connected yet. Instantly preview the customer portal with sample project data.
            </p>
            <Button variant="dark" fullWidth className="mt-4" onClick={handleDemoPreview}>
              Preview Customer Portal (Michael Reyes)
            </Button>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          <Link to="/contractors/login" className="font-semibold text-steel-700 hover:underline">
            Are you a contractor? Log in here
          </Link>
          <Link to="/admin/login" className="text-xs text-concrete-400 hover:underline">
            Tough Concrete team member? Staff sign in
          </Link>
          <Link to="/" className="text-concrete-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
