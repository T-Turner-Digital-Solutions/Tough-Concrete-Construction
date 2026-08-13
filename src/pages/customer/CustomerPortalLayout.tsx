import { Outlet } from 'react-router-dom';
import { DashboardShell, type NavGroup } from '@/components/layout/DashboardShell';

const NAV: NavGroup[] = [
  { items: [{ to: '/portal', label: 'Dashboard', end: true }] },
  {
    label: 'My Project',
    items: [
      { to: '/portal/project', label: 'ToughTrack™' },
      { to: '/portal/photos', label: 'Photos' },
      { to: '/portal/enhance', label: 'Enhance Your Project' },
    ],
  },
  {
    label: 'Paperwork',
    items: [
      { to: '/portal/estimates', label: 'Estimates' },
      { to: '/portal/contracts', label: 'Contracts' },
      { to: '/portal/change-orders', label: 'Change Orders' },
      { to: '/portal/invoices', label: 'Invoices & Payments' },
      { to: '/portal/documents', label: 'Documents' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { to: '/portal/appointments', label: 'Appointments' },
      { to: '/portal/messages', label: 'Messages' },
      { to: '/portal/ai-concierge', label: 'Ask Tough Concrete AI' },
    ],
  },
  { items: [{ to: '/portal/profile', label: 'Profile' }] },
];

export function CustomerPortalLayout() {
  return (
    <DashboardShell portalLabel="Customer Portal" navGroups={NAV}>
      <Outlet />
    </DashboardShell>
  );
}
