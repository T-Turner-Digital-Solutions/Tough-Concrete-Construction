import { Outlet } from 'react-router-dom';
import { DashboardShell, type NavGroup } from '@/components/layout/DashboardShell';

const NAV: NavGroup[] = [
  { items: [{ to: '/admin', label: 'Command Center', end: true }] },
  {
    label: 'Sales',
    items: [
      { to: '/admin/leads', label: 'Leads' },
      { to: '/admin/customers', label: 'Customers (CRM)' },
      { to: '/admin/estimates', label: 'Estimates' },
    ],
  },
  {
    label: 'Production',
    items: [
      { to: '/admin/jobs', label: 'Jobs & ToughTrack' },
      { to: '/admin/appointments', label: 'Calendar' },
      { to: '/admin/change-orders', label: 'Change Orders' },
    ],
  },
  {
    label: 'Contractors',
    items: [
      { to: '/admin/contractors', label: 'Contractor Directory' },
      { to: '/admin/bids', label: 'Bid Opportunities' },
    ],
  },
  {
    label: 'Money',
    items: [
      { to: '/admin/contracts', label: 'Contracts' },
      { to: '/admin/invoices', label: 'Invoices & Payments' },
    ],
  },
  { label: 'Admin', items: [{ to: '/admin/settings', label: 'Settings' }] },
];

export function AdminLayout() {
  return (
    <DashboardShell portalLabel="Owner / Admin" navGroups={NAV}>
      <Outlet />
    </DashboardShell>
  );
}
