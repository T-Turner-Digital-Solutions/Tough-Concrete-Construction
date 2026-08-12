import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Field';
import {
  demoAppointments,
  demoContracts,
  demoCustomers,
  demoDocuments,
  demoEstimates,
  demoInvoices,
  demoJobs,
  demoMessages,
  demoPayments,
  demoPhotos,
} from '@/data/demoData';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';

interface ActivityItem {
  at: string;
  label: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const customer = demoCustomers.find((c) => c.id === id);

  const [notes, setNotes] = useState(customer?.notes ?? '');
  const [savedMessage, setSavedMessage] = useState(false);

  const jobs = useMemo(() => demoJobs.filter((j) => j.customer_id === id), [id]);
  const jobIds = useMemo(() => jobs.map((j) => j.id), [jobs]);

  const estimates = useMemo(() => demoEstimates.filter((e) => e.customer_id === id), [id]);
  const contracts = useMemo(() => demoContracts.filter((c) => c.job_id && jobIds.includes(c.job_id)), [jobIds]);
  const invoices = useMemo(() => demoInvoices.filter((i) => i.customer_id === id), [id]);
  const invoiceIds = useMemo(() => invoices.map((i) => i.id), [invoices]);
  const payments = useMemo(() => demoPayments.filter((p) => invoiceIds.includes(p.invoice_id)), [invoiceIds]);
  const appointments = useMemo(
    () => demoAppointments.filter((a) => a.customer_id === id || (a.job_id && jobIds.includes(a.job_id))),
    [id, jobIds],
  );
  const photos = useMemo(() => demoPhotos.filter((p) => jobIds.includes(p.job_id)), [jobIds]);
  const documents = useMemo(() => demoDocuments.filter((d) => jobIds.includes(d.job_id)), [jobIds]);
  const messages = useMemo(() => demoMessages.filter((m) => m.job_id && jobIds.includes(m.job_id)), [jobIds]);

  const activity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    for (const j of jobs) items.push({ at: j.created_at, label: `Job ${j.job_number} created (${statusLabel(j.status)})` });
    for (const e of estimates) {
      if (e.sent_at) items.push({ at: e.sent_at, label: `Estimate ${e.estimate_number} sent` });
      if (e.approved_at) items.push({ at: e.approved_at, label: `Estimate ${e.estimate_number} approved` });
    }
    for (const c of contracts) items.push({ at: c.created_at, label: `Contract ${c.contract_number} ${statusLabel(c.status).toLowerCase()}` });
    for (const inv of invoices) {
      items.push({ at: inv.created_at, label: `Invoice ${inv.invoice_number} created — ${formatCurrency(inv.amount)}` });
    }
    for (const p of payments) items.push({ at: p.paid_at, label: `Payment received — ${formatCurrency(p.amount)} (${p.method})` });
    for (const a of appointments) items.push({ at: a.created_at, label: `Appointment scheduled: ${statusLabel(a.type)} on ${formatDate(a.scheduled_date)}` });
    for (const m of messages) items.push({ at: m.created_at, label: `Message: "${m.body.slice(0, 60)}${m.body.length > 60 ? '…' : ''}"` });
    return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 20);
  }, [jobs, estimates, contracts, invoices, payments, appointments, messages]);

  if (!customer) {
    return (
      <div>
        <PageHeader title="Customer Not Found" />
        <EmptyState
          title="We couldn't find that customer"
          description="They may have been removed, or the link is out of date."
          action={
            <Link to="/admin/customers" className="text-sm font-semibold text-steel-700 hover:underline">
              ← Back to Customers
            </Link>
          }
        />
      </div>
    );
  }

  function handleSaveNotes() {
    // Real flow: UPDATE customers SET notes = ... WHERE id = ... in Supabase.
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.full_name}
        description="Full CRM record — every job, estimate, contract, invoice, and interaction in one place."
        actions={
          <Link to="/admin/customers" className="text-sm font-semibold text-steel-700 hover:underline">
            ← All Customers
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Contact & Billing</CardTitle>
          </div>
          <span className="text-xs text-concrete-500">Customer since {formatDate(customer.created_at)}</span>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase text-concrete-400">Phone</p>
            <p className="text-concrete-800">{customer.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-concrete-400">Email</p>
            <p className="text-concrete-800">{customer.email}</p>
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-xs font-semibold uppercase text-concrete-400">Billing Address</p>
            <p className="text-concrete-800">
              {customer.billing_address.street}, {customer.billing_address.city}, {customer.billing_address.state}{' '}
              {customer.billing_address.zip}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes about this customer…" />
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleSaveNotes}>
              Save Notes
            </Button>
            {savedMessage && <span className="text-xs font-medium text-emerald-700">Saved (demo mode — not persisted after reload).</span>}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="font-display text-2xl font-bold text-concrete-900">{photos.length}</p>
          <p className="text-xs font-semibold uppercase text-concrete-500">Photos</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-display text-2xl font-bold text-concrete-900">{documents.length}</p>
          <p className="text-xs font-semibold uppercase text-concrete-500">Documents</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-display text-2xl font-bold text-concrete-900">{messages.length}</p>
          <p className="text-xs font-semibold uppercase text-concrete-500">Messages</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-display text-2xl font-bold text-concrete-900">{jobs.length}</p>
          <p className="text-xs font-semibold uppercase text-concrete-500">Jobs</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {jobs.length === 0 && <p className="text-sm text-concrete-500">No jobs yet.</p>}
          {jobs.map((j) => (
            <Link
              key={j.id}
              to={`/admin/jobs/${j.id}`}
              className="flex flex-col gap-1 rounded-lg border border-concrete-200 p-3 text-sm hover:bg-concrete-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="font-semibold text-concrete-900">{j.job_number}</span>
                <span className="ml-2 text-concrete-500 capitalize">{j.job_type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-concrete-600">{formatCurrency(j.contract_value + j.approved_change_order_total)}</span>
                <Badge tone={statusTone(j.status)}>{statusLabel(j.status)}</Badge>
              </div>
            </Link>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimates</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {estimates.length === 0 && <p className="text-sm text-concrete-500">No estimates yet.</p>}
          {estimates.map((e) => (
            <div key={e.id} className="flex flex-col gap-1 rounded-lg border border-concrete-200 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold text-concrete-900">{e.estimate_number}</span>
                <span className="ml-2 capitalize text-concrete-500">{e.service_type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-concrete-600">{formatCurrency(e.total)}</span>
                <Badge tone={statusTone(e.status)}>{statusLabel(e.status)}</Badge>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contracts</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {contracts.length === 0 && <p className="text-sm text-concrete-500">No contracts yet.</p>}
          {contracts.map((c) => (
            <div key={c.id} className="flex flex-col gap-1 rounded-lg border border-concrete-200 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold text-concrete-900">{c.contract_number}</span>
                <span className="ml-2 text-concrete-500">v{c.version}</span>
              </div>
              <Badge tone={statusTone(c.status)}>{statusLabel(c.status)}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices & Payments</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {invoices.length === 0 && <p className="text-sm text-concrete-500">No invoices yet.</p>}
          {invoices.map((inv) => (
            <div key={inv.id} className="flex flex-col gap-1 rounded-lg border border-concrete-200 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold text-concrete-900">{inv.invoice_number}</span>
                <span className="ml-2 capitalize text-concrete-500">{inv.type.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-concrete-600">
                  {formatCurrency(inv.amount_paid)} / {formatCurrency(inv.amount)}
                </span>
                <Badge tone={statusTone(inv.status)}>{statusLabel(inv.status)}</Badge>
              </div>
            </div>
          ))}
          {payments.length > 0 && (
            <div className="mt-3 border-t border-concrete-100 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase text-concrete-400">Payments</p>
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1 text-xs text-concrete-600">
                  <span>
                    {formatDate(p.paid_at)} — {p.method.toUpperCase()}
                  </span>
                  <span className="font-semibold text-concrete-800">{formatCurrency(p.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {appointments.length === 0 && <p className="text-sm text-concrete-500">No appointments yet.</p>}
          {appointments.map((a) => (
            <div key={a.id} className="flex flex-col gap-1 rounded-lg border border-concrete-200 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold capitalize text-concrete-900">{a.type.replace(/_/g, ' ')}</span>
                <span className="ml-2 text-concrete-500">{formatDate(a.scheduled_date)}</span>
              </div>
              <Badge tone={statusTone(a.status)}>{statusLabel(a.status)}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardBody>
          {activity.length === 0 ? (
            <p className="text-sm text-concrete-500">No activity yet.</p>
          ) : (
            <ol className="space-y-3 border-l-2 border-concrete-200 pl-4">
              {activity.map((item, i) => (
                <li key={i} className="text-sm">
                  <p className="text-concrete-800">{item.label}</p>
                  <p className="text-xs text-concrete-400">{formatDateTime(item.at)}</p>
                </li>
              ))}
            </ol>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
