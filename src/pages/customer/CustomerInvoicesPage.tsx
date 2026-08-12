import { useState } from 'react';
import { demoInvoices, demoPayments } from '@/data/demoData';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable, type Column } from '@/components/ui/Table';
import type { Invoice, InvoiceType } from '@/types/domain';

// Demo mode: hardcoded to the logged-in demo customer. In production this
// would resolve via profiles.id -> customers.profile_id.
const CUSTOMER_ID = 'cust-reyes';

const TYPE_LABELS: Record<InvoiceType, string> = {
  deposit: 'Deposit',
  progress: 'Progress',
  final: 'Final',
  change_order: 'Change Order',
  custom: 'Custom',
};

const UNPAID_STATUSES: Invoice['status'][] = ['sent', 'viewed', 'partially_paid', 'overdue'];

export default function CustomerInvoicesPage() {
  const [payAttempt, setPayAttempt] = useState<Invoice | null>(null);
  const [historyInvoice, setHistoryInvoice] = useState<Invoice | null>(null);

  // Row Level Security simulation: only this customer's own invoices.
  const myInvoices = demoInvoices.filter((inv) => inv.customer_id === CUSTOMER_ID);
  const myInvoiceIds = new Set(myInvoices.map((inv) => inv.id));
  const myPayments = demoPayments.filter((p) => myInvoiceIds.has(p.invoice_id));

  const totalInvoiced = myInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = myInvoices.reduce((sum, inv) => sum + inv.amount_paid, 0);
  const outstanding = totalInvoiced - totalPaid;

  const columns: Column<Invoice>[] = [
    { header: 'Invoice #', cell: (inv) => <span className="font-semibold text-concrete-900">{inv.invoice_number}</span> },
    { header: 'Type', cell: (inv) => TYPE_LABELS[inv.type] },
    { header: 'Status', cell: (inv) => <Badge tone={statusTone(inv.status)}>{statusLabel(inv.status)}</Badge> },
    { header: 'Amount', cell: (inv) => formatCurrency(inv.amount) },
    { header: 'Paid', cell: (inv) => formatCurrency(inv.amount_paid) },
    {
      header: 'Balance Due',
      cell: (inv) => {
        const balance = inv.amount - inv.amount_paid;
        return <span className={balance > 0 ? 'font-semibold text-safety-700' : 'text-concrete-500'}>{formatCurrency(balance)}</span>;
      },
    },
    { header: 'Due Date', cell: (inv) => formatDate(inv.due_date) },
    {
      header: '',
      cell: (inv) => (
        <div className="flex flex-wrap justify-end gap-2">
          {myPayments.some((p) => p.invoice_id === inv.id) && (
            <Button size="sm" variant="outline" onClick={() => setHistoryInvoice(inv)}>
              Payment History
            </Button>
          )}
          {UNPAID_STATUSES.includes(inv.status) && inv.amount - inv.amount_paid > 0 && (
            <Button size="sm" onClick={() => setPayAttempt(inv)}>
              Pay Now
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Invoices & Payments" description="Track what's been invoiced, paid, and still owed on your project." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total Invoiced" value={formatCurrency(totalInvoiced)} />
        <Stat label="Total Paid" value={formatCurrency(totalPaid)} tone="success" />
        <Stat label="Outstanding Balance" value={formatCurrency(outstanding)} tone={outstanding > 0 ? 'warning' : 'default'} />
      </div>

      <DataTable columns={columns} rows={myInvoices} rowKey={(inv) => inv.id} emptyMessage="No invoices yet." />

      <Modal open={!!payAttempt} onClose={() => setPayAttempt(null)} title="Pay Now">
        <p className="text-sm text-concrete-700">
          Online payment is not yet configured for this account. Please contact our office to submit payment for invoice{' '}
          <strong>{payAttempt?.invoice_number}</strong>.
        </p>
        <p className="mt-3 text-xs text-concrete-500">
          Once Stripe/Square is connected for your account, you&apos;ll be able to pay securely online from this screen.
        </p>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setPayAttempt(null)}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal open={!!historyInvoice} onClose={() => setHistoryInvoice(null)} title={historyInvoice ? `Payments — ${historyInvoice.invoice_number}` : ''}>
        <div className="space-y-3">
          {historyInvoice &&
            myPayments
              .filter((p) => p.invoice_id === historyInvoice.id)
              .map((p) => (
                <Card key={p.id}>
                  <CardBody className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-concrete-900">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-concrete-500 capitalize">
                        {p.method.replace('_', ' ')} · {formatDate(p.paid_at)}
                      </p>
                    </div>
                    {p.reference && <p className="text-xs text-concrete-400">Ref: {p.reference}</p>}
                  </CardBody>
                </Card>
              ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setHistoryInvoice(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
