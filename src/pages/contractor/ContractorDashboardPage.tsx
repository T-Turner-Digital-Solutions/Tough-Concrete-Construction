import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { demoBidOpportunities, demoBids, demoContractors } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { readDemoCollection } from '@/lib/data/demoStore';
import type { Bid } from '@/types/domain';

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

export default function ContractorDashboardPage() {
  const contractor = demoContractors.find((c) => c.id === CONTRACTOR_ID);

  // RLS-equivalent: a contractor may only ever see opportunities they were
  // specifically invited to. In production this filter is enforced by a
  // Postgres row-level security policy on `bid_opportunities`, not just the UI.
  const invitedOpenOpportunities = useMemo(
    () =>
      demoBidOpportunities.filter(
        (op) => op.invited_contractor_ids.includes(CONTRACTOR_ID) && op.status === 'open',
      ),
    [],
  );

  const myBids = useMemo(() => {
    const local = readDemoCollection<Bid>('bids').filter((b) => b.contractor_id === CONTRACTOR_ID);
    const seeded = demoBids.filter((b) => b.contractor_id === CONTRACTOR_ID);
    return [...seeded, ...local];
  }, []);

  const bidsAwaitingResponse = myBids.filter((b) => b.status === 'submitted' || b.status === 'viewed').length;

  if (!contractor) {
    return <EmptyState title="Contractor profile not found" description="We couldn't load your company profile." />;
  }

  const recentBidUpdates = [...myBids].sort((a, b) => (b.submitted_at ?? b.created_at).localeCompare(a.submitted_at ?? a.created_at)).slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${contractor.company_name}`}
        description="Here's a snapshot of your open bid opportunities and recent activity with Tough Concrete Construction."
      />

      {contractor.status !== 'approved' && (
        <div className="mb-6 rounded-xl border border-safety-300 bg-safety-50 px-5 py-4">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-safety-800">
            Account Pending Review
          </p>
          <p className="mt-1 text-sm text-safety-800">
            Your contractor account is currently <strong>{statusLabel(contractor.status)}</strong>. Some features,
            including submitting bids, may be limited until our office approves your account. We'll notify you as
            soon as a decision is made.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open Opportunities Invited To" value={invitedOpenOpportunities.length} />
        <Stat label="Bids Submitted" value={myBids.length} />
        <Stat label="Bids Awaiting Response" value={bidsAwaitingResponse} tone={bidsAwaitingResponse > 0 ? 'warning' : 'default'} />
        <Stat
          label="Account Status"
          value={<Badge tone={statusTone(contractor.status)}>{statusLabel(contractor.status)}</Badge>}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Open Invitations</CardTitle>
            <ButtonLink to="/contractors/app/opportunities" variant="ghost" size="sm">
              View All
            </ButtonLink>
          </CardHeader>
          <CardBody className="space-y-3">
            {invitedOpenOpportunities.length === 0 ? (
              <EmptyState title="No open invitations" description="You'll see new bid opportunities here as soon as our office invites you to one." />
            ) : (
              invitedOpenOpportunities.map((op) => {
                const days = daysUntil(op.bid_deadline);
                return (
                  <Link
                    key={op.id}
                    to={`/contractors/app/opportunities/${op.id}`}
                    className="block rounded-lg border border-concrete-200 p-4 transition-colors hover:border-steel-400 hover:bg-concrete-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-concrete-900">{op.project_name}</p>
                        <p className="text-sm text-concrete-500">{op.location}</p>
                      </div>
                      <Badge tone={days <= 3 ? 'danger' : days <= 5 ? 'warning' : 'neutral'}>
                        {days >= 0 ? `${days}d left` : 'Past due'}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-concrete-500">Bid deadline: {formatDate(op.bid_deadline)}</p>
                  </Link>
                );
              })
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bid Activity</CardTitle>
            <ButtonLink to="/contractors/app/bids" variant="ghost" size="sm">
              View All
            </ButtonLink>
          </CardHeader>
          <CardBody className="space-y-3">
            {recentBidUpdates.length === 0 ? (
              <EmptyState title="No bids yet" description="Submitted bids and their status updates will appear here." />
            ) : (
              recentBidUpdates.map((bid) => {
                const opportunity = demoBidOpportunities.find((op) => op.id === bid.opportunity_id);
                return (
                  <div key={bid.id} className="flex items-center justify-between gap-3 rounded-lg border border-concrete-200 p-4">
                    <div>
                      <p className="font-semibold text-concrete-900">{opportunity?.project_name ?? 'Opportunity'}</p>
                      <p className="text-xs text-concrete-500">
                        {bid.submitted_at ? `Submitted ${formatDate(bid.submitted_at)}` : `Created ${formatDate(bid.created_at)}`}
                      </p>
                    </div>
                    <Badge tone={statusTone(bid.status)}>{statusLabel(bid.status)}</Badge>
                  </div>
                );
              })
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
