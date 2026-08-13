import { Outlet } from 'react-router-dom';
import { DashboardShell, type NavGroup } from '@/components/layout/DashboardShell';

const NAV: NavGroup[] = [
  { items: [{ to: '/contractors/app', label: 'Dashboard', end: true }] },
  {
    label: 'Bidding',
    items: [
      { to: '/contractors/app/opportunities', label: 'Bid Opportunities' },
      { to: '/contractors/app/bids', label: 'My Bids' },
    ],
  },
  {
    label: 'Company',
    items: [
      { to: '/contractors/app/profile', label: 'Company Profile' },
      { to: '/contractors/app/documents', label: 'Documents & Insurance' },
    ],
  },
];

export function ContractorPortalLayout() {
  return (
    <DashboardShell portalLabel="Contractor Portal" navGroups={NAV}>
      <Outlet />
    </DashboardShell>
  );
}
