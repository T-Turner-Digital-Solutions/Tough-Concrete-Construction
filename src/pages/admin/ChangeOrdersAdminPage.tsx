import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { demoChangeOrders, demoJobs } from '@/data/demoData';
import { formatCurrency } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import type { ChangeOrder, ChangeOrderStatus } from '@/types/domain';

const BLANK_FORM = {
  job_id: '',
  description: '',
  additional_labor: '',
  additional_materials: '',
  additional_equipment: '',
  added_days: '',
};

export default function ChangeOrdersAdminPage() {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(demoChangeOrders);
  const [selected, setSelected] = useState<ChangeOrder | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [approvedNote, setApprovedNote] = useState(false);

  const jobNumber = useMemo(() => {
    const map: Record<string, string> = {};
    for (const j of demoJobs) map[j.id] = j.job_number;
    return map;
  }, []);

  const addedCostPreview =
    (Number(form.additional_labor) || 0) + (Number(form.additional_materials) || 0) + (Number(form.additional_equipment) || 0);

  function handleCreate() {
    if (!form.job_id || !form.description.trim()) return;
    const job = demoJobs.find((j) => j.id === form.job_id);
    if (!job) return;
    const addedCost = addedCostPreview;
    // Real flow: INSERT INTO change_orders (...) VALUES (..., status='draft') in Supabase.
    const co: ChangeOrder = {
      id: `co-manual-${Date.now()}`,
      change_order_number: `CO-${new Date().getFullYear()}-${String(changeOrders.length + 1).padStart(4, '0')}`,
      job_id: job.id,
      requested_by: 'owner_admin',
      description: form.description,
      additional_labor: Number(form.additional_labor) || 0,
      additional_materials: Number(form.additional_materials) || 0,
      additional_equipment: Number(form.additional_equipment) || 0,
      added_days: Number(form.added_days) || 0,
      added_cost: addedCost,
      new_contract_total: job.contract_value + addedCost,
      updated_completion_estimate: null,
      status: 'draft',
      customer_signature_id: null,
      owner_signature_id: null,
      approved_at: null,
      created_at: new Date().toISOString(),
    };
    setChangeOrders((prev) => [co, ...prev]);
    setForm(BLANK_FORM);
    setNewOpen(false);
  }

  function updateStatus(id: string, status: ChangeOrderStatus) {
    // Real flow: UPDATE change_orders SET status = ... WHERE id = ... in Supabase. An
    // 'approved' transition also updates the job's contract_value (the ORIGINAL contract
    // amount is preserved — this line item is layered on top as an audit-trail record),
    // creates/updates the related invoice balance, and adjusts job profitability figures.
    setChangeOrders((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, approved_at: status === 'approved' ? new Date().toISOString() : c.approved_at } : c)),
    );
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    if (status === 'approved') setApprovedNote(true);
  }

  const columns: Column<ChangeOrder>[] = [
    { header: 'CO #', cell: (c) => <span className="font-semibold text-concrete-900">{c.change_order_number}</span> },
    { header: 'Job #', cell: (c) => jobNumber[c.job_id] ?? '—' },
    {
      header: 'Description',
      cell: (c) => <span className="line-clamp-1 max-w-xs">{c.description.length > 60 ? `${c.description.slice(0, 60)}…` : c.description}</span>,
      hideOnMobile: true,
    },
    { header: 'Added Cost', cell: (c) => formatCurrency(c.added_cost) },
    { header: 'New Contract Total', cell: (c) => formatCurrency(c.new_contract_total), hideOnMobile: true },
    { header: 'Status', cell: (c) => <Badge tone={statusTone(c.status)}>{statusLabel(c.status)}</Badge> },
    { header: 'Requested By', cell: (c) => statusLabel(c.requested_by), hideOnMobile: true },
  ];

  return (
    <div>
      <PageHeader
        title="Change Orders"
        description="Scope changes and added-cost approvals across all jobs."
        actions={<Button onClick={() => setNewOpen(true)}>+ New Change Order</Button>}
      />

      <DataTable
        columns={columns}
        rows={changeOrders}
        rowKey={(c) => c.id}
        onRowClick={(c) => {
          setSelected(c);
          setApprovedNote(false);
        }}
        emptyMessage="No change orders yet."
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.change_order_number ?? 'Change Order'}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={statusTone(selected.status)}>{statusLabel(selected.status)}</Badge>
              <span className="text-concrete-500">Job {jobNumber[selected.job_id] ?? '—'}</span>
              <span className="text-concrete-500">Requested by {statusLabel(selected.requested_by)}</span>
            </div>

            <p className="text-concrete-800">{selected.description}</p>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-concrete-200 bg-concrete-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Additional Labor</p>
                <p className="text-concrete-800">{formatCurrency(selected.additional_labor)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Additional Materials</p>
                <p className="text-concrete-800">{formatCurrency(selected.additional_materials)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Additional Equipment</p>
                <p className="text-concrete-800">{formatCurrency(selected.additional_equipment)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Added Days</p>
                <p className="text-concrete-800">{selected.added_days}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Added Cost</p>
                <p className="font-semibold text-concrete-900">{formatCurrency(selected.added_cost)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">New Contract Total</p>
                <p className="font-semibold text-concrete-900">{formatCurrency(selected.new_contract_total)}</p>
              </div>
            </div>

            <div className="rounded-lg border border-concrete-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-concrete-400">Status Workflow</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={selected.status === 'draft'} onClick={() => updateStatus(selected.id, 'draft')}>
                  Draft
                </Button>
                <Button size="sm" variant="outline" disabled={selected.status === 'sent'} onClick={() => updateStatus(selected.id, 'sent')}>
                  Sent
                </Button>
                <Button size="sm" disabled={selected.status === 'approved'} onClick={() => updateStatus(selected.id, 'approved')}>
                  Approved
                </Button>
                <Button size="sm" variant="danger" disabled={selected.status === 'declined'} onClick={() => updateStatus(selected.id, 'declined')}>
                  Declined
                </Button>
                <Button size="sm" variant="ghost" disabled={selected.status === 'cancelled'} onClick={() => updateStatus(selected.id, 'cancelled')}>
                  Cancelled
                </Button>
              </div>
              {approvedNote && (
                <p className="mt-3 text-xs text-emerald-700">
                  Marked approved (demo mode). In production this automatically updates the job's contract_value,
                  creates/updates the invoice balance, and adjusts job profitability figures per spec. The ORIGINAL
                  contract amount is always preserved — approved change orders are shown as separate audit-trail line
                  items, never overwritten.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New Change Order"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save as Draft</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Job" htmlFor="co-job" required>
            <Select id="co-job" value={form.job_id} onChange={(e) => setForm({ ...form, job_id: e.target.value })}>
              <option value="">Select a job…</option>
              {demoJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.job_number}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Description" htmlFor="co-desc" required>
            <Textarea id="co-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Additional Labor" htmlFor="co-labor">
              <Input id="co-labor" type="number" min="0" step="0.01" value={form.additional_labor} onChange={(e) => setForm({ ...form, additional_labor: e.target.value })} />
            </FormField>
            <FormField label="Additional Materials" htmlFor="co-materials">
              <Input id="co-materials" type="number" min="0" step="0.01" value={form.additional_materials} onChange={(e) => setForm({ ...form, additional_materials: e.target.value })} />
            </FormField>
            <FormField label="Additional Equipment" htmlFor="co-equipment">
              <Input id="co-equipment" type="number" min="0" step="0.01" value={form.additional_equipment} onChange={(e) => setForm({ ...form, additional_equipment: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Added Days" htmlFor="co-days">
            <Input id="co-days" type="number" min="0" value={form.added_days} onChange={(e) => setForm({ ...form, added_days: e.target.value })} />
          </FormField>
          <p className="text-sm font-semibold text-concrete-800">Added Cost: {formatCurrency(addedCostPreview)}</p>
        </div>
      </Modal>
    </div>
  );
}
