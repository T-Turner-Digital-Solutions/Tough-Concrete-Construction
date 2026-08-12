import { useState } from 'react';
import { demoChangeOrders, demoJobs } from '@/data/demoData';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Demo mode: hardcoded to the logged-in demo customer. In production this
// would resolve via profiles.id -> customers.profile_id.
const CUSTOMER_ID = 'cust-reyes';

export default function CustomerChangeOrdersPage() {
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'declined'>>({});

  // Row Level Security simulation: only change orders on this customer's own jobs.
  const myJobIds = new Set(demoJobs.filter((j) => j.customer_id === CUSTOMER_ID).map((j) => j.id));
  const myChangeOrders = demoChangeOrders.filter((co) => myJobIds.has(co.job_id));

  function decide(id: string, decision: 'approved' | 'declined') {
    // Demo-only: in production an approval would update the change order
    // status, add customer_signature_id, recalculate the job's contract
    // value, and generate/update a change-order invoice for the added cost.
    setDecisions((d) => ({ ...d, [id]: decision }));
  }

  return (
    <div>
      <PageHeader title="Change Orders" description="Approved additions or changes to your original project scope." />

      <Card className="mb-6">
        <CardBody className="text-sm text-concrete-600">
          <p>
            A <strong>change order</strong> is a formal update to your original contract — for example, adding square
            footage, upgrading a finish, or extending the project timeline. Each change order shows the added cost and
            your new total contract value. Nothing changes on your project until you review and approve it.
          </p>
        </CardBody>
      </Card>

      {myChangeOrders.length === 0 ? (
        <Card>
          <CardBody className="py-10 text-center text-sm text-concrete-500">No change orders on your project yet.</CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {myChangeOrders.map((co) => {
            const effectiveStatus = decisions[co.id] ?? co.status;
            const needsDecision = co.status === 'sent' && !decisions[co.id];
            return (
              <Card key={co.id}>
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-bold text-concrete-900">{co.change_order_number}</p>
                      <p className="mt-1 text-sm text-concrete-600">{co.description}</p>
                    </div>
                    <Badge tone={statusTone(effectiveStatus)}>{statusLabel(effectiveStatus)}</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-concrete-100 pt-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-concrete-400">Added Cost</p>
                      <p className="mt-0.5 font-display text-base font-bold text-concrete-900">{formatCurrency(co.added_cost)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-concrete-400">New Contract Total</p>
                      <p className="mt-0.5 font-display text-base font-bold text-concrete-900">{formatCurrency(co.new_contract_total)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-concrete-400">Added Days</p>
                      <p className="mt-0.5 text-sm text-concrete-700">{co.added_days || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-concrete-400">Requested</p>
                      <p className="mt-0.5 text-sm text-concrete-700">{formatDate(co.created_at)}</p>
                    </div>
                  </div>

                  {decisions[co.id] && (
                    <p
                      className={`mt-4 rounded-md px-4 py-3 text-sm font-semibold ${
                        decisions[co.id] === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {decisions[co.id] === 'approved'
                        ? 'Approved — thank you! Your contract total and invoicing will be updated.'
                        : 'Declined. Reach out to our office if you would like to discuss this further.'}
                    </p>
                  )}

                  {needsDecision && (
                    <div className="mt-4 flex flex-col gap-2 border-t border-concrete-100 pt-4 sm:flex-row">
                      <Button onClick={() => decide(co.id, 'approved')}>Approve</Button>
                      <Button variant="outline" onClick={() => decide(co.id, 'declined')}>
                        Decline
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
