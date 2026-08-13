import { useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { demoBidOpportunities, demoBids } from '@/data/demoData';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { readDemoCollection } from '@/lib/data/demoStore';
import type { Bid } from '@/types/domain';

// In production the logged-in profile (useAuth().profile.id === 'profile-contractor-1')
// would resolve to its contractor row via `contractors.profile_id`. Hardcoded here
// since this demo only ever signs in as the one contractor account.
const CONTRACTOR_ID = 'sub-alvarez';

export default function ContractorBidsPage() {
  // Combine seeded demo bids with anything submitted locally this session via
  // demoStore. In production this would simply be `select * from bids where
  // contractor_id = auth resolved contractor.id`, enforced by RLS.
  const myBids = useMemo(() => {
    const local = readDemoCollection<Bid>('bids').filter((b) => b.contractor_id === CONTRACTOR_ID);
    const seeded = demoBids.filter((b) => b.contractor_id === CONTRACTOR_ID);
    return [...seeded, ...local].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, []);

  const columns: Column<Bid>[] = [
    {
      header: 'Project Name',
      cell: (bid) => {
        const op = demoBidOpportunities.find((o) => o.id === bid.opportunity_id);
        return <span className="font-semibold text-concrete-900">{op?.project_name ?? 'Unknown Opportunity'}</span>;
      },
    },
    {
      header: 'Bid Amount',
      cell: (bid) => formatCurrency(bid.total ?? 0),
    },
    {
      header: 'Estimated Duration',
      cell: (bid) => (bid.estimated_duration_days != null ? `${bid.estimated_duration_days} days` : '—'),
      hideOnMobile: true,
    },
    {
      header: 'Status',
      cell: (bid) => <Badge tone={statusTone(bid.status)}>{statusLabel(bid.status)}</Badge>,
    },
    {
      header: 'Submitted',
      cell: (bid) => (bid.submitted_at ? formatDate(bid.submitted_at) : '—'),
    },
  ];

  return (
    <div>
      <PageHeader title="My Bids" description="Every bid you've submitted to Tough Concrete Construction." />
      {myBids.length === 0 ? (
        <EmptyState
          title="No bids submitted yet"
          description="Once you submit a bid on an opportunity, it will show up here."
          action={<ButtonLink to="/contractors/app/opportunities">View Bid Opportunities</ButtonLink>}
        />
      ) : (
        <DataTable columns={columns} rows={myBids} rowKey={(bid) => bid.id} />
      )}
    </div>
  );
}
