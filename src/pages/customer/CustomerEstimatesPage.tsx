import { useState } from 'react';
import { demoEstimates } from '@/data/demoData';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/Table';
import type { Estimate } from '@/types/domain';

// Demo mode: hardcoded to the logged-in demo customer. In production this
// would resolve via profiles.id -> customers.profile_id.
const CUSTOMER_ID = 'cust-reyes';

const AWAITING_DECISION: Estimate['status'][] = ['sent', 'viewed'];

export default function CustomerEstimatesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'declined'>>({});

  // Row Level Security simulation: only this customer's own estimates.
  const myEstimates = demoEstimates.filter((e) => e.customer_id === CUSTOMER_ID);

  function decide(estimateId: string, decision: 'approved' | 'declined') {
    // Demo-only: in production this would write to `estimates.status`,
    // capture the customer signature/decision timestamp, and — for an
    // approval — trigger the estimate → contract → job → deposit-invoice
    // pipeline (creating the Job, Contract, and first Invoice records).
    setDecisions((d) => ({ ...d, [estimateId]: decision }));
  }

  const columns: Column<Estimate>[] = [
    { header: 'Estimate #', cell: (e) => <span className="font-semibold text-concrete-900">{e.estimate_number}</span> },
    { header: 'Service Type', cell: (e) => <span className="capitalize">{e.service_type}</span> },
    {
      header: 'Status',
      cell: (e) => {
        const effective = decisions[e.id] ?? e.status;
        return <Badge tone={statusTone(effective)}>{statusLabel(effective)}</Badge>;
      },
    },
    { header: 'Total', cell: (e) => formatCurrency(e.total) },
    { header: 'Valid Until', cell: (e) => formatDate(e.valid_until) },
  ];

  return (
    <div>
      <PageHeader title="Estimates" description="Review your estimates and their line-item breakdowns." />

      <DataTable
        columns={columns}
        rows={myEstimates}
        rowKey={(e) => e.id}
        onRowClick={(e) => setExpandedId((cur) => (cur === e.id ? null : e.id))}
        emptyMessage="You don't have any estimates yet."
      />

      {expandedId &&
        (() => {
          const estimate = myEstimates.find((e) => e.id === expandedId);
          if (!estimate) return null;
          const decision = decisions[estimate.id];
          const needsDecision = AWAITING_DECISION.includes(estimate.status) && !decision;

          return (
            <Card className="mt-4">
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-bold text-concrete-900">{estimate.estimate_number}</p>
                    <p className="text-sm text-concrete-500 capitalize">{estimate.service_type} — {estimate.measurements.lengthFt}&apos; × {estimate.measurements.widthFt}&apos; × {estimate.measurements.thicknessIn}&quot;</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedId(null)}>
                    Close
                  </Button>
                </div>

                <div className="mt-4 divide-y divide-concrete-100 rounded-lg border border-concrete-200">
                  {estimate.line_items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-concrete-700">{item.label}</span>
                      <span className="font-medium text-concrete-900">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between text-concrete-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(estimate.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-concrete-600">
                    <span>Markup ({estimate.markup_percent}%)</span>
                    <span>{formatCurrency(estimate.markup_amount)}</span>
                  </div>
                  <div className="flex justify-between text-concrete-600">
                    <span>Tax</span>
                    <span>{formatCurrency(estimate.tax_amount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-concrete-200 pt-2 font-display text-base font-bold text-concrete-900">
                    <span>Total</span>
                    <span>{formatCurrency(estimate.total)}</span>
                  </div>
                  <div className="flex justify-between text-concrete-500">
                    <span>Deposit due at signing</span>
                    <span>{formatCurrency(estimate.deposit_amount)}</span>
                  </div>
                </div>

                {decision && (
                  <p className={`mt-4 rounded-md px-4 py-3 text-sm font-semibold ${decision === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {decision === 'approved'
                      ? 'Thanks! Your approval has been recorded. Our office will follow up with your contract and deposit invoice shortly.'
                      : 'This estimate has been declined. Reach out to our office if you would like to discuss changes.'}
                  </p>
                )}

                {needsDecision && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-concrete-100 pt-4 sm:flex-row">
                    <Button onClick={() => decide(estimate.id, 'approved')}>Approve Estimate</Button>
                    <Button variant="outline" onClick={() => decide(estimate.id, 'declined')}>
                      Decline
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })()}
    </div>
  );
}
