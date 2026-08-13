import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Stat } from '@/components/ui/Stat';
import { FormField, Input, Select } from '@/components/ui/Field';
import { demoCustomers, demoInvoices, demoJobs, demoPayments } from '@/data/demoData';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import type { Invoice, InvoiceType, Payment } from '@/types/domain';

const OUTSTANDING_STATUSES: Invoice['status'][] = ['sent', 'viewed', 'partially_paid', 'overdue'];

const INVOICE_TYPES: InvoiceType[] = ['deposit', 'progress', 'final', 'change_order', 'custom'];
const PAYMENT_METHODS: Payment['method'][] = ['card', 'ach', 'check', 'cash', 'other'];

const BLANK_INVOICE_FORM = {
  job_id: '',
  type: 'progress' as InvoiceType,
  amount: '',
  due_date: '',
  notes: '',
};

const BLANK_PAYMENT_FORM = {
  amount: '',
  method: 'check' as Payment['method'],
  reference: '',
};

function isOverdue(inv: Invoice): boolean {
  return inv.status !== 'paid' && inv.status !== 'cancelled' && new Date(inv.due_date).getTime() < Date.now();
}

export default function InvoicesAdminPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(demoInvoices);
  const [payments, setPayments] = useState<Payment[]>(demoPayments);

  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState(BLANK_INVOICE_FORM);

  const [paymentTarget, setPaymentTarget] = useState<Invoice | null>(null);
  const [paymentForm, setPaymentForm] = useState(BLANK_PAYMENT_FORM);
  const [paymentSaved, setPaymentSaved] = useState(false);

  const customerName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of demoCustomers) map[c.id] = c.full_name;
    return map;
  }, []);
  const jobNumber = useMemo(() => {
    const map: Record<string, string> = {};
    for (const j of demoJobs) map[j.id] = j.job_number;
    return map;
  }, []);

  const stats = useMemo(() => {
    const unpaidCount = invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').length;
    const overdueCount = invoices.filter((i) => i.status === 'overdue').length;
    const outstanding = invoices
      .filter((i) => OUTSTANDING_STATUSES.includes(i.status))
      .reduce((sum, i) => sum + (i.amount - i.amount_paid), 0);
    // Production: filter payments to the current calendar month. The demo dataset is
    // small enough that we just sum every recorded payment for illustration.
    const collected = payments.reduce((sum, p) => sum + p.amount, 0);
    return { unpaidCount, overdueCount, outstanding, collected };
  }, [invoices, payments]);

  function handleCreateInvoice() {
    if (!invoiceForm.job_id || !invoiceForm.amount || !invoiceForm.due_date) return;
    const job = demoJobs.find((j) => j.id === invoiceForm.job_id);
    if (!job) return;
    // Real flow: INSERT INTO invoices (...) VALUES (...) in Supabase.
    const invoice: Invoice = {
      id: `inv-manual-${Date.now()}`,
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      job_id: job.id,
      customer_id: job.customer_id,
      type: invoiceForm.type,
      status: 'draft',
      amount: Number(invoiceForm.amount),
      amount_paid: 0,
      due_date: invoiceForm.due_date,
      notes: invoiceForm.notes || null,
      sent_at: null,
      created_at: new Date().toISOString(),
    };
    setInvoices((prev) => [invoice, ...prev]);
    setInvoiceForm(BLANK_INVOICE_FORM);
    setNewInvoiceOpen(false);
  }

  function handleRecordPayment() {
    if (!paymentTarget || !paymentForm.amount) return;
    const amount = Number(paymentForm.amount);
    if (amount <= 0) return;
    // Real flow: INSERT INTO payments (...) with processor='manual' — this records an
    // offline payment (check/cash/etc). It is distinct from an online Stripe/Square
    // charge, which is not configured in this demo environment and does not occur here.
    const payment: Payment = {
      id: `pay-manual-${Date.now()}`,
      invoice_id: paymentTarget.id,
      amount,
      method: paymentForm.method,
      paid_at: new Date().toISOString(),
      reference: paymentForm.reference || null,
      processor: 'manual',
    };
    setPayments((prev) => [payment, ...prev]);
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== paymentTarget.id) return inv;
        const newPaid = inv.amount_paid + amount;
        const newStatus: Invoice['status'] = newPaid >= inv.amount ? 'paid' : 'partially_paid';
        return { ...inv, amount_paid: newPaid, status: newStatus };
      }),
    );
    setPaymentForm(BLANK_PAYMENT_FORM);
    setPaymentSaved(true);
  }

  const columns: Column<Invoice>[] = [
    { header: 'Invoice #', cell: (i) => <span className="font-semibold text-concrete-900">{i.invoice_number}</span> },
    { header: 'Customer', cell: (i) => customerName[i.customer_id] ?? 'Unknown' },
    { header: 'Job #', cell: (i) => jobNumber[i.job_id] ?? '—', hideOnMobile: true },
    { header: 'Type', cell: (i) => <span className="capitalize">{i.type.replace(/_/g, ' ')}</span>, hideOnMobile: true },
    { header: 'Status', cell: (i) => <Badge tone={statusTone(i.status)}>{statusLabel(i.status)}</Badge> },
    { header: 'Amount', cell: (i) => formatCurrency(i.amount) },
    { header: 'Paid', cell: (i) => formatCurrency(i.amount_paid), hideOnMobile: true },
    {
      header: 'Balance Due',
      cell: (i) => (
        <span className={isOverdue(i) ? 'font-semibold text-red-600' : ''}>{formatCurrency(i.amount - i.amount_paid)}</span>
      ),
    },
    {
      header: 'Due Date',
      cell: (i) => <span className={isOverdue(i) ? 'font-semibold text-red-600' : ''}>{formatDate(i.due_date)}</span>,
      hideOnMobile: true,
    },
    {
      header: 'Actions',
      cell: (i) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setPaymentTarget(i);
            setPaymentForm(BLANK_PAYMENT_FORM);
            setPaymentSaved(false);
          }}
          disabled={i.status === 'paid' || i.status === 'cancelled'}
        >
          Record Payment
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Invoices & Payments"
        description="Track billing status and receivables across every job."
        actions={<Button onClick={() => setNewInvoiceOpen(true)}>+ New Invoice</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Unpaid Invoices" value={stats.unpaidCount} />
        <Stat label="Overdue" value={stats.overdueCount} tone={stats.overdueCount > 0 ? 'danger' : 'default'} />
        <Stat label="Outstanding Receivables" value={formatCurrency(stats.outstanding)} tone="warning" />
        <Stat label="Payments Collected" value={formatCurrency(stats.collected)} tone="success" hint="This month (demo: all recorded payments)" />
      </div>

      <DataTable columns={columns} rows={invoices} rowKey={(i) => i.id} emptyMessage="No invoices yet." />

      <Modal
        open={newInvoiceOpen}
        onClose={() => setNewInvoiceOpen(false)}
        title="New Invoice"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>Save Invoice</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Job" htmlFor="ni-job" required>
            <Select id="ni-job" value={invoiceForm.job_id} onChange={(e) => setInvoiceForm({ ...invoiceForm, job_id: e.target.value })}>
              <option value="">Select a job…</option>
              {demoJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.job_number} — {customerName[j.customer_id]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Type" htmlFor="ni-type">
            <Select id="ni-type" value={invoiceForm.type} onChange={(e) => setInvoiceForm({ ...invoiceForm, type: e.target.value as InvoiceType })}>
              {INVOICE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {statusLabel(t)}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Amount" htmlFor="ni-amount" required>
              <Input id="ni-amount" type="number" min="0" step="0.01" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })} />
            </FormField>
            <FormField label="Due Date" htmlFor="ni-due" required>
              <Input id="ni-due" type="date" value={invoiceForm.due_date} onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Notes" htmlFor="ni-notes">
            <Input id="ni-notes" value={invoiceForm.notes} onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} />
          </FormField>
        </div>
      </Modal>

      <Modal
        open={!!paymentTarget}
        onClose={() => setPaymentTarget(null)}
        title={paymentTarget ? `Record Payment — ${paymentTarget.invoice_number}` : 'Record Payment'}
        footer={
          <>
            <Button variant="outline" onClick={() => setPaymentTarget(null)}>
              Close
            </Button>
            <Button onClick={handleRecordPayment}>Record Payment</Button>
          </>
        }
      >
        {paymentTarget && (
          <div className="space-y-4">
            <p className="text-xs text-concrete-500">
              This records a manual/offline payment only (check, cash, ACH transfer, etc). It is distinct from an
              online Stripe/Square charge — no online payment processor is configured in this demo environment, and
              this action does not initiate one.
            </p>
            <p className="text-sm text-concrete-700">
              Balance due: <span className="font-semibold">{formatCurrency(paymentTarget.amount - paymentTarget.amount_paid)}</span>
            </p>
            <FormField label="Amount" htmlFor="pay-amount" required>
              <Input id="pay-amount" type="number" min="0" step="0.01" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
            </FormField>
            <FormField label="Method" htmlFor="pay-method">
              <Select id="pay-method" value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as Payment['method'] })}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m.toUpperCase()}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Reference / Check #" htmlFor="pay-ref">
              <Input id="pay-ref" value={paymentForm.reference} onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })} />
            </FormField>
            {paymentSaved && <p className="text-xs font-medium text-emerald-700">Payment recorded (demo mode — not persisted after reload).</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
