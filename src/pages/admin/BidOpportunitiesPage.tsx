import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Textarea } from '@/components/ui/Field';
import { DataTable, type Column } from '@/components/ui/Table';
import { demoBidOpportunities, demoBids, demoContractors } from '@/data/demoData';
import type { BidOpportunity } from '@/types/domain';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';

export default function BidOpportunitiesPage() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState(demoBidOpportunities);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ projectName: '', scope: '', location: '', bidDeadline: '' });

  function createOpportunity() {
    const record: BidOpportunity = {
      id: `bid-op-${Date.now()}`,
      job_id: null,
      project_name: draft.projectName,
      scope: draft.scope,
      location: draft.location,
      start_date: null,
      completion_requirement: null,
      bid_deadline: draft.bidDeadline || new Date().toISOString().slice(0, 10),
      labor_included: true,
      materials_included: true,
      equipment_included: true,
      insurance_requirements: null,
      special_instructions: null,
      document_urls: [],
      status: 'draft',
      invited_contractor_ids: [],
      created_at: new Date().toISOString(),
    };
    setOpportunities((prev) => [record, ...prev]);
    setOpen(false);
    setDraft({ projectName: '', scope: '', location: '', bidDeadline: '' });
  }

  const columns: Column<BidOpportunity>[] = [
    { header: 'Project', cell: (o) => <span className="font-semibold text-concrete-900">{o.project_name}</span> },
    { header: 'Location', cell: (o) => o.location, hideOnMobile: true },
    { header: 'Bid Deadline', cell: (o) => formatDate(o.bid_deadline) },
    { header: 'Invited', cell: (o) => o.invited_contractor_ids.length },
    { header: 'Bids Received', cell: (o) => demoBids.filter((b) => b.opportunity_id === o.id && b.status === 'submitted').length },
    { header: 'Status', cell: (o) => <Badge tone={statusTone(o.status)}>{statusLabel(o.status)}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Bid Opportunities"
        description="Invite subcontractors to bid, compare proposals, and award jobs."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            + New Bid Opportunity
          </Button>
        }
      />
      <DataTable columns={columns} rows={opportunities} rowKey={(o) => o.id} onRowClick={(o) => navigate(`/admin/bids/${o.id}`)} emptyMessage="No bid opportunities yet." />
      <p className="mt-4 text-xs text-concrete-500">
        {demoContractors.filter((c) => c.status === 'approved').length} approved contractors available to invite.
      </p>

      <Modal open={open} onClose={() => setOpen(false)} title="New Bid Opportunity" footer={<Button onClick={createOpportunity}>Create Draft</Button>}>
        <div className="space-y-4">
          <FormField label="Project Name" htmlFor="projectName" required>
            <Input id="projectName" value={draft.projectName} onChange={(e) => setDraft((d) => ({ ...d, projectName: e.target.value }))} />
          </FormField>
          <FormField label="Location" htmlFor="location" required>
            <Input id="location" value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} />
          </FormField>
          <FormField label="Scope" htmlFor="scope" required>
            <Textarea id="scope" value={draft.scope} onChange={(e) => setDraft((d) => ({ ...d, scope: e.target.value }))} />
          </FormField>
          <FormField label="Bid Deadline" htmlFor="bidDeadline" required>
            <Input id="bidDeadline" type="date" value={draft.bidDeadline} onChange={(e) => setDraft((d) => ({ ...d, bidDeadline: e.target.value }))} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
