import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth/AuthContext';
import { initials } from '@/lib/format';
import { DemoBanner } from '@/components/ui/DemoBanner';

export interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

interface DashboardShellProps {
  portalLabel: string;
  navGroups: NavGroup[];
  children: ReactNode;
  headerActions?: ReactNode;
}

export function DashboardShell({ portalLabel, navGroups, children, headerActions }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <img src="/logo.jpg" alt="Tough Concrete Construction" className="h-12 w-12 shrink-0 object-contain" />
        <div className="leading-tight">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-white">Tough Concrete</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-safety-500">{portalLabel}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-concrete-500">{group.label}</p>}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-2.5 text-sm font-medium text-concrete-300 hover:bg-concrete-800 hover:text-white transition-colors',
                      isActive && 'bg-concrete-800 text-white',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-concrete-800 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-steel-700 text-xs font-bold text-white">
            {profile ? initials(profile.full_name) : '?'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{profile?.full_name ?? 'Guest'}</p>
            <p className="truncate text-xs text-concrete-500">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-3 w-full rounded-md border border-concrete-700 px-3 py-2 text-xs font-semibold text-concrete-300 hover:bg-concrete-800 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-concrete-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-concrete-950 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-concrete-950 shadow-xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-concrete-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-concrete-600 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="block h-0.5 w-5 bg-concrete-700 shadow-[0_6px_0_0_rgb(68,64,60),0_-6px_0_0_rgb(68,64,60)]" />
            </button>
            <Link to="/" className="hidden text-xs font-semibold text-concrete-400 hover:text-concrete-700 sm:block">
              ← Public Site
            </Link>
          </div>
          <div className="flex items-center gap-3">{headerActions}</div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <DemoBanner className="mb-6" />
          {children}
        </div>
      </div>
    </div>
  );
}
