import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/Field';
import { demoContractors } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import type { Contractor } from '@/types/domain';

const DAY_MS = 24 * 60 * 60 * 1000;

function expiryTone(dateStr: string | null): BadgeTone {
  if (!dateStr) return 'danger';
  const days = (new Date(dateStr).getTime() - Date.now()) / DAY_MS;
  if (days < 0) return 'danger';
  if (days <= 60) return 'warning';
  return 'success';
}

function expiryLabel(dateStr: string | null): string {
  if (!dateStr) return 'Missing';
  const days = (new Date(dateStr).getTime() - Date.now()) / DAY_MS;
  if (days < 0) return `Expired ${formatDate(dateStr)}`;
  return `Expires ${formatDate(dateStr)}`;
}

const BLANK_INVITE = { email: '', company_name: '', trade: '' };

export default function ContractorsAdminPage() {
  const [contractors, setContractors] = useState<Contractor[]>(demoContractors);
  const [selected, setSelected] = useState<Contractor | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState(BLANK_INVITE);
  const [inviteSent, setInviteSent] = useState(false);

  function updateApproval(id: string, status: Contractor['status']) {
    // Real flow: UPDATE contractors SET status = ... WHERE id = ... in Supabase.
    setContractors((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  function handleInvite() {
    if (!invite.email.trim()) return;
    // Real flow: send an invite email (magic link to create a contractor profile) and
    // INSERT INTO contractors (..., status='pending') in Supabase.
    setInviteSent(true);
  }

  const columns: Column<Contractor>[] = [
    { header: 'Company', cell: (c) => <span className="font-semibold text-concrete-900">{c.company_name}</span> },
    { header: 'Contact', cell: (c) => c.contact_name, hideOnMobile: true },
    { header: 'Trade', cell: (c) => c.trade },
    { header: 'Service Area', cell: (c) => c.service_area.join(', '), hideOnMobile: true },
    {
      header: 'Insurance',
      cell: (c) => <Badge tone={expiryTone(c.insurance_expiration)}>{expiryLabel(c.insurance_expiration)}</Badge>,
    },
    {
      header: 'License',
      cell: (c) => <Badge tone={expiryTone(c.license_expiration)}>{expiryLabel(c.license_expiration)}</Badge>,
    },
    { header: 'Rating', cell: (c) => (c.internal_rating ? `★ ${c.internal_rating.toFixed(1)}` : '—'), hideOnMobile: true },
    { header: 'Approval', cell: (c) => <Badge tone={statusTone(c.status)}>{statusLabel(c.status)}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Contractor Directory"
        description="Subcontractors and vendors approved to bid on and work Tough Concrete jobs."
        actions={<Button onClick={() => setInviteOpen(true)}>+ Invite Contractor</Button>}
      />

      <DataTable columns={columns} rows={contractors} rowKey={(c) => c.id} onRowClick={(c) => setSelected(c)} emptyMessage="No contractors on file." />

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.company_name ?? 'Contractor'}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Contact</p>
                <p className="text-concrete-800">{selected.contact_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Trade</p>
                <p className="text-concrete-800">{selected.trade}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Phone</p>
                <p className="text-concrete-800">{selected.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Email</p>
                <p className="text-concrete-800">{selected.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold uppercase text-concrete-400">Address</p>
                <p className="text-concrete-800">
                  {selected.address.street}, {selected.address.city}, {selected.address.state} {selected.address.zip}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold uppercase text-concrete-400">Service Area</p>
                <p className="text-concrete-800">{selected.service_area.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">Internal Rating</p>
                <p className="text-concrete-800">{selected.internal_rating ? `★ ${selected.internal_rating.toFixed(1)} / 5` : 'Not rated'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">EIN on File</p>
                <p className="text-concrete-800">{selected.ein_on_file ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="rounded-lg border border-concrete-200 bg-concrete-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-concrete-400">Compliance Documents</p>
              <div className="space-y-1.5 text-concrete-800">
                <p>W-9: {selected.w9_url ? 'On file' : 'Not on file'}</p>
                <p>
                  Insurance Certificate: {selected.insurance_cert_url ? 'On file' : 'Not on file'} —{' '}
                  <Badge tone={expiryTone(selected.insurance_expiration)}>{expiryLabel(selected.insurance_expiration)}</Badge>
                </p>
                <p>
                  License: {selected.license_url ? 'On file' : 'Not on file'} —{' '}
                  <Badge tone={expiryTone(selected.license_expiration)}>{expiryLabel(selected.license_expiration)}</Badge>
                </p>
                {selected.other_certs.length > 0 && <p>Other Certs: {selected.other_certs.join(', ')}</p>}
                <p className="text-xs text-concrete-500">No document previews are available in this demo — files are not actually stored.</p>
              </div>
            </div>

            {selected.references_notes && (
              <div>
                <p className="text-xs font-semibold uppercase text-concrete-400">References</p>
                <p className="text-concrete-700">{selected.references_notes}</p>
              </div>
            )}

            <div className="rounded-lg border border-concrete-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-concrete-400">Approval Status</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={selected.status === 'approved'} onClick={() => updateApproval(selected.id, 'approved')}>
                  Approve
                </Button>
                <Button size="sm" variant="danger" disabled={selected.status === 'not_approved'} onClick={() => updateApproval(selected.id, 'not_approved')}>
                  Not Approved
                </Button>
                <Button size="sm" variant="outline" disabled={selected.status === 'pending'} onClick={() => updateApproval(selected.id, 'pending')}>
                  Reset to Pending
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={inviteOpen}
        onClose={() => {
          setInviteOpen(false);
          setInvite(BLANK_INVITE);
          setInviteSent(false);
        }}
        title="Invite Contractor"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setInviteOpen(false);
                setInvite(BLANK_INVITE);
                setInviteSent(false);
              }}
            >
              Close
            </Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Email" htmlFor="inv-email" required>
            <Input id="inv-email" type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
          </FormField>
          <FormField label="Company Name" htmlFor="inv-company">
            <Input id="inv-company" value={invite.company_name} onChange={(e) => setInvite({ ...invite, company_name: e.target.value })} />
          </FormField>
          <FormField label="Trade" htmlFor="inv-trade">
            <Select id="inv-trade" value={invite.trade} onChange={(e) => setInvite({ ...invite, trade: e.target.value })}>
              <option value="">Select a trade…</option>
              <option value="Excavation & Grading">Excavation & Grading</option>
              <option value="Rebar & Reinforcement">Rebar & Reinforcement</option>
              <option value="Concrete Pumping">Concrete Pumping</option>
              <option value="Hauling & Disposal">Hauling & Disposal</option>
              <option value="Other">Other</option>
            </Select>
          </FormField>
          {inviteSent && (
            <p className="text-xs font-medium text-emerald-700">
              Invite sent (demo mode). In production this would send an invite email and create a pending contractor
              record.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
