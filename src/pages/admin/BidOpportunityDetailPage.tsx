import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { DataTable, type Column } from '@/components/ui/Table';
import { demoBidOpportunities, demoBids, demoContractors } from '@/data/demoData';
import type { Bid, Contractor } from '@/types/domain';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';

interface BidRow {
  bid: Bid;
  contractor: Contractor;
}

function docStatus(contractor: Contractor): { label: string; tone: 'success' | 'warning' | 'danger' } {
  const insuranceOk = contractor.insurance_expiration && contractor.insurance_expiration > '2026-08-12';
  const licenseOk = !contractor.license_expiration || contractor.license_expiration > '2026-08-12';
  if (insuranceOk && licenseOk) return { label: 'Complete', tone: 'success' };
  if (!insuranceOk) return { label: 'Insurance Expiring/Missing', tone: 'danger' };
  return { label: 'License Expiring', tone: 'warning' };
}

export default function BidOpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const opportunity = demoBidOpportunities.find((o) => o.id === id);
  const [bids, setBids] = useState<Bid[]>(demoBids.filter((b) => b.opportunity_id === id));
  const [awarded, setAwarded] = useState<string | null>(bids.find((b) => b.status === 'awarded')?.id ?? null);
  const [message, setMessage] = useState<string | null>(null);

  if (!opportunity) {
    return <EmptyState title="Bid opportunity not found" />;
  }

  const rows: BidRow[] = bids
    .map((bid) => {
      const contractor = demoContractors.find((c) => c.id === bid.contractor_id);
      return contractor ? { bid, contractor } : null;
    })
    .filter((r): r is BidRow => r !== null);

  function setBidStatus(bidId: string, status: Bid['status']) {
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, status } : b)));
  }

  function award(bidId: string) {
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, status: 'awarded' } : b.status === 'submitted' ? { ...b, status: 'not_awarded' } : b)));
    setAwarded(bidId);
    setMessage(
      'Job awarded. Demo mode: this would generate a Subcontractor Agreement pre-filled from the winning bid, require both the contractor\'s and Tough Concrete\'s signatures, and attach the signed agreement to this project record.',
    );
  }

  const columns: Column<BidRow>[] = [
    { header: 'Contractor', cell: (r) => <span className="font-semibold text-concrete-900">{r.contractor.company_name}</span> },
    { header: 'Bid Amount', cell: (r) => (r.bid.total ? formatCurrency(r.bid.total) : '—') },
    { header: 'Duration', cell: (r) => (r.bid.estimated_duration_days ? `${r.bid.estimated_duration_days} days` : '—'), hideOnMobile: true },
    {
      header: 'Insurance',
      cell: (r) => <Badge tone={docStatus(r.contractor).tone}>{r.contractor.insurance_expiration ? formatDate(r.contractor.insurance_expiration) : 'Missing'}</Badge>,
      hideOnMobile: true,
    },
    { header: 'Docs', cell: (r) => <Badge tone={docStatus(r.contractor).tone}>{docStatus(r.contractor).label}</Badge> },
    { header: 'Submitted', cell: (r) => (r.bid.submitted_at ? formatDate(r.bid.submitted_at) : 'Not yet'), hideOnMobile: true },
    { header: 'Rating', cell: (r) => (r.contractor.internal_rating ? `★ ${r.contractor.internal_rating}` : '—'), hideOnMobile: true },
    { header: 'Status', cell: (r) => <Badge tone={statusTone(r.bid.status)}>{statusLabel(r.bid.status)}</Badge> },
  ];

  return (
    <div>
      <PageHeader title={opportunity.project_name} description={`${opportunity.location} · Bid deadline ${formatDate(opportunity.bid_deadline)}`} />

      {message && <div className="mb-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scope</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm leading-relaxed text-concrete-700">{opportunity.scope}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {opportunity.labor_included && <Badge>Labor Included</Badge>}
            {opportunity.materials_included && <Badge>Materials Included</Badge>}
            {opportunity.equipment_included && <Badge>Equipment Included</Badge>}
          </div>
          {opportunity.insurance_requirements && <p className="mt-3 text-xs text-concrete-500">Insurance requirements: {opportunity.insurance_requirements}</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bid Comparison</CardTitle>
        </CardHeader>
        <CardBody>
          {rows.length === 0 ? (
            <EmptyState title="No bids submitted yet" />
          ) : (
            <>
              <DataTable columns={columns} rows={rows} rowKey={(r) => r.bid.id} emptyMessage="No bids." />
              <div className="mt-6 space-y-3">
                {rows.map(({ bid, contractor }) => (
                  <div key={bid.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-concrete-100 p-3">
                    <span className="text-sm font-medium text-concrete-800">{contractor.company_name}</span>
                    <div className="flex flex-wrap gap-2">
                      {bid.status === 'submitted' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setBidStatus(bid.id, 'revision_requested')}>
                            Request Revision
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => setBidStatus(bid.id, 'declined')}>
                            Decline
                          </Button>
                          <Button size="sm" variant="dark" disabled={!!awarded} onClick={() => award(bid.id)}>
                            Award Job
                          </Button>
                        </>
                      )}
                      {bid.status === 'awarded' && <Badge tone="success">Awarded ✓</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
