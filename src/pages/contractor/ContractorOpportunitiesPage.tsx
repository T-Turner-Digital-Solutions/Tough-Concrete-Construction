import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { demoBidOpportunities, demoBids } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { readDemoCollection } from '@/lib/data/demoStore';
import type { Bid, BidOpportunity } from '@/types/domain';

// In production the logged-in profile (useAuth().profile.id === 'profile-contractor-1')
// would resolve to its contractor row via `contractors.profile_id`. Hardcoded here
// since this demo only ever signs in as the one contractor account.
const CONTRACTOR_ID = 'sub-alvarez';

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((target.getTime() - now.getTime()) / msPerDay);
}

export default function ContractorOpportunitiesPage() {
  const navigate = useNavigate();

  // RLS-equivalent: a contractor may only ever see opportunities they were
  // specifically invited to. In production this filter is enforced by a
  // Postgres row-level security policy on `bid_opportunities`, not just the UI.
  const invitedOpportunities = useMemo(
    () => demoBidOpportunities.filter((op) => op.invited_contractor_ids.includes(CONTRACTOR_ID)),
    [],
  );

  const myBids = useMemo(() => {
    const local = readDemoCollection<Bid>('bids').filter((b) => b.contractor_id === CONTRACTOR_ID);
    const seeded = demoBids.filter((b) => b.contractor_id === CONTRACTOR_ID);
    return [...seeded, ...local];
  }, []);

  function hasSubmittedBid(opportunityId: string): boolean {
    return myBids.some((b) => b.opportunity_id === opportunityId);
  }

  const columns: Column<BidOpportunity>[] = [
    {
      header: 'Project Name',
      cell: (op) => <span className="font-semibold text-concrete-900">{op.project_name}</span>,
    },
    {
      header: 'Location',
      cell: (op) => op.location,
      hideOnMobile: true,
    },
    {
      header: 'Bid Deadline',
      cell: (op) => {
        const days = daysUntil(op.bid_deadline);
        return (
          <div className="flex items-center gap-2">
            <span>{formatDate(op.bid_deadline)}</span>
            {op.status === 'open' && days <= 5 && (
              <Badge tone={days <= 2 ? 'danger' : 'warning'}>{days >= 0 ? `${days}d left` : 'Past due'}</Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Status',
      cell: (op) => <Badge tone={statusTone(op.status)}>{statusLabel(op.status)}</Badge>,
    },
    {
      header: 'Bid Submitted?',
      cell: (op) => (hasSubmittedBid(op.id) ? <Badge tone="success">Yes</Badge> : <Badge tone="neutral">No</Badge>),
    },
  ];

  return (
    <div>
      <PageHeader title="Bid Opportunities" description="Projects our office has invited you to bid on." />
      <DataTable
        columns={columns}
        rows={invitedOpportunities}
        rowKey={(op) => op.id}
        onRowClick={(op) => navigate(`/contractors/app/opportunities/${op.id}`)}
        emptyMessage="You haven't been invited to any bid opportunities yet."
      />
    </div>
  );
}
