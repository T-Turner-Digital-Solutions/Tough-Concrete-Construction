import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { demoLeads } from '@/data/demoData';
import { formatDate, timeAgo } from '@/lib/format';
import { statusTone, statusLabel } from '@/lib/statusStyles';
import type { Lead } from '@/types/domain';

const CATEGORY_TONE: Record<Lead['category'], BadgeTone> = {
  residential: 'info',
  commercial: 'dark',
};

const SOURCE_TONE: Record<Lead['source'], BadgeTone> = {
  website: 'neutral',
  ai_concierge: 'info',
  phone: 'success',
  referral: 'warning',
  other: 'neutral',
};

const LEAD_STATUSES: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'lost'];

const BLANK_FORM = {
  full_name: '',
  phone: '',
  email: '',
  project_address: '',
  category: 'residential' as Lead['category'],
  service_type: '',
  budget_range: '',
  desired_start_date: '',
  desired_finish: '',
  removal_needed: false,
  preferred_contact_method: 'phone' as Lead['preferred_contact_method'],
  description: '',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [convertMessage, setConvertMessage] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);

  function updateStatus(id: string, status: Lead['status']) {
    // Real flow: UPDATE leads SET status = ... WHERE id = ... in Supabase.
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  function handleCreateLead() {
    if (!form.full_name.trim() || !form.phone.trim()) return;
    // Real flow: INSERT INTO leads (...) VALUES (...) in Supabase, triggered here
    // by office staff logging a phone-in lead manually.
    const lead: Lead = {
      id: `lead-manual-${Date.now()}`,
      created_at: new Date().toISOString(),
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      project_address: form.project_address,
      category: form.category,
      service_type: form.service_type || 'other',
      length_ft: null,
      width_ft: null,
      thickness_in: null,
      removal_needed: form.removal_needed,
      desired_finish: form.desired_finish || null,
      desired_start_date: form.desired_start_date || null,
      budget_range: form.budget_range || null,
      description: form.description,
      photo_urls: [],
      document_urls: [],
      preferred_contact_method: form.preferred_contact_method,
      status: 'new',
      source: 'phone',
      customer_id: null,
    };
    setLeads((prev) => [lead, ...prev]);
    setForm(BLANK_FORM);
    setNewOpen(false);
  }

  const columns: Column<Lead>[] = [
    { header: 'Name', cell: (l) => <span className="font-semibold text-concrete-900">{l.full_name}</span> },
    {
      header: 'Phone / Email',
      cell: (l) => (
        <div className="text-xs">
          <div>{l.phone}</div>
          <div className="text-concrete-500">{l.email}</div>
        </div>
      ),
      hideOnMobile: true,
    },
    { header: 'Project Type', cell: (l) => <span className="capitalize">{l.service_type.replace(/_/g, ' ')}</span> },
    { header: 'Category', cell: (l) => <Badge tone={CATEGORY_TONE[l.category]}>{l.category}</Badge> },
    { header: 'Budget Range', cell: (l) => l.budget_range ?? '—', hideOnMobile: true },
    { header: 'Status', cell: (l) => <Badge tone={statusTone(l.status)}>{statusLabel(l.status)}</Badge> },
    { header: 'Source', cell: (l) => <Badge tone={SOURCE_TONE[l.source]}>{statusLabel(l.source)}</Badge> },
    { header: 'Submitted', cell: (l) => timeAgo(l.created_at), hideOnMobile: true },
  ];

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Incoming inquiries from the website, AI Concierge, phone, and referrals."
        actions={
          <Button onClick={() => setNewOpen(true)}>+ New Lead</Button>
        }
      />

      <DataTable
        columns={columns}
        rows={leads}
        rowKey={(l) => l.id}
        onRowClick={(l) => {
          setSelected(l);
          setConvertMessage(false);
        }}
        emptyMessage="No leads yet."
      />

      {/* Lead detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.full_name ?? 'Lead'}>
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Phone</p>
                <p className="text-concrete-800">{selected.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Email</p>
                <p className="text-concrete-800">{selected.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold uppercase text-concrete-400">Project Address</p>
                <p className="text-concrete-800">{selected.project_address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Category</p>
                <Badge tone={CATEGORY_TONE[selected.category]}>{selected.category}</Badge>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Service Type</p>
                <p className="capitalize text-concrete-800">{selected.service_type.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Dimensions</p>
                <p className="text-concrete-800">
                  {selected.length_ft && selected.width_ft
                    ? `${selected.length_ft}ft x ${selected.width_ft}ft x ${selected.thickness_in ?? '?'}in`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Removal Needed</p>
                <p className="text-concrete-800">{selected.removal_needed ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Desired Finish</p>
                <p className="text-concrete-800">{selected.desired_finish ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Desired Start</p>
                <p className="text-concrete-800">{selected.desired_start_date ? formatDate(selected.desired_start_date) : '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Budget Range</p>
                <p className="text-concrete-800">{selected.budget_range ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Preferred Contact</p>
                <p className="capitalize text-concrete-800">{selected.preferred_contact_method}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Source</p>
                <Badge tone={SOURCE_TONE[selected.source]}>{statusLabel(selected.source)}</Badge>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Submitted</p>
                <p className="text-concrete-800">{formatDate(selected.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Attachments</p>
                <p className="text-concrete-800">{selected.photo_urls.length} photo(s), {selected.document_urls.length} document(s)</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-concrete-400">Description</p>
              <p className="mt-1 text-concrete-700">{selected.description || '—'}</p>
            </div>

            <div className="rounded-lg border border-concrete-200 bg-concrete-50 p-4">
              <FormField label="Status" htmlFor="lead-status">
                <Select
                  id="lead-status"
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value as Lead['status'])}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {selected.status === 'qualified' && (
              <div className="rounded-lg border border-safety-200 bg-safety-50 p-4">
                <p className="text-sm font-semibold text-concrete-900">Ready to move forward?</p>
                <p className="mt-1 text-xs text-concrete-600">
                  Converting creates a customer record from this lead's contact info and opens the Estimate Builder
                  pre-filled with the lead's measurements and service type — no re-entering data.
                </p>
                {/* Real flow: INSERT INTO customers FROM lead fields, UPDATE leads.customer_id + status='converted',
                    then navigate to /admin/estimates/new?leadId=... pre-filled from this lead. */}
                <Button className="mt-3" size="sm" onClick={() => setConvertMessage(true)}>
                  Convert to Customer + Create Estimate
                </Button>
                {convertMessage && (
                  <p className="mt-2 text-xs font-medium text-emerald-700">
                    This would create a customer record and open the Estimate Builder pre-filled with this lead's
                    details (Lead → Customer → Estimate, no redundant data entry).
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* New lead modal */}
      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New Lead (Phone-In)"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLead}>Save Lead</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Full Name" htmlFor="nl-name" required>
            <Input id="nl-name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phone" htmlFor="nl-phone" required>
              <Input id="nl-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormField>
            <FormField label="Email" htmlFor="nl-email">
              <Input id="nl-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Project Address" htmlFor="nl-address">
            <Input id="nl-address" value={form.project_address} onChange={(e) => setForm({ ...form, project_address: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category" htmlFor="nl-category">
              <Select id="nl-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Lead['category'] })}>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </Select>
            </FormField>
            <FormField label="Service Type" htmlFor="nl-service">
              <Input id="nl-service" placeholder="driveway, patio, ..." value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Budget Range" htmlFor="nl-budget">
              <Input id="nl-budget" placeholder="$6,000 – $9,000" value={form.budget_range} onChange={(e) => setForm({ ...form, budget_range: e.target.value })} />
            </FormField>
            <FormField label="Desired Start Date" htmlFor="nl-start">
              <Input id="nl-start" type="date" value={form.desired_start_date} onChange={(e) => setForm({ ...form, desired_start_date: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Preferred Contact Method" htmlFor="nl-contact">
            <Select
              id="nl-contact"
              value={form.preferred_contact_method}
              onChange={(e) => setForm({ ...form, preferred_contact_method: e.target.value as Lead['preferred_contact_method'] })}
            >
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="text">Text</option>
            </Select>
          </FormField>
          <FormField label="Description / Notes" htmlFor="nl-desc">
            <Textarea id="nl-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
