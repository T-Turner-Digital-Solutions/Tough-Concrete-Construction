import { useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { FormField, Input, Textarea } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/EmptyState';
import { demoBidOpportunities, demoBids } from '@/data/demoData';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { appendDemoRecord, newDemoId, readDemoCollection } from '@/lib/data/demoStore';
import type { Bid } from '@/types/domain';

// In production the logged-in profile (useAuth().profile.id === 'profile-contractor-1')
// would resolve to its contractor row via `contractors.profile_id`. Hardcoded here
// since this demo only ever signs in as the one contractor account.
const CONTRACTOR_ID = 'sub-alvarez';

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((target.getTime() - now.getTime()) / msPerDay);
}

export default function ContractorOpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const opportunity = demoBidOpportunities.find((op) => op.id === id);

  // RLS-equivalent: even with a direct URL, a contractor must never be able to
  // view an opportunity's details unless they were specifically invited. In
  // production this is enforced by a Postgres row-level security policy on
  // `bid_opportunities`, not just this client-side check.
  const isInvited = opportunity?.invited_contractor_ids.includes(CONTRACTOR_ID) ?? false;

  const [localBids, setLocalBids] = useState<Bid[]>(() => readDemoCollection<Bid>('bids'));
  const [questionSent, setQuestionSent] = useState(false);
  const [question, setQuestion] = useState('');

  const existingBid = useMemo(() => {
    if (!opportunity) return undefined;
    const seeded = demoBids.find((b) => b.opportunity_id === opportunity.id && b.contractor_id === CONTRACTOR_ID);
    const local = localBids.find((b) => b.opportunity_id === opportunity.id && b.contractor_id === CONTRACTOR_ID);
    return local ?? seeded;
  }, [opportunity, localBids]);

  const [laborCost, setLaborCost] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [equipmentCost, setEquipmentCost] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState<Bid | null>(null);

  const total = (Number(laborCost) || 0) + (Number(materialCost) || 0) + (Number(equipmentCost) || 0);

  if (!opportunity || !isInvited) {
    return (
      <EmptyState
        title="Opportunity Not Found"
        description="This bid opportunity doesn't exist, or you don't have access to it."
        action={<ButtonLink to="/contractors/app/opportunities">Back to Opportunities</ButtonLink>}
      />
    );
  }

  function handleSubmitBid(e: FormEvent) {
    e.preventDefault();
    if (!opportunity) return;
    const bid: Bid = {
      id: newDemoId('bid'),
      opportunity_id: opportunity.id,
      contractor_id: CONTRACTOR_ID,
      labor_cost: Number(laborCost) || 0,
      material_cost: Number(materialCost) || 0,
      equipment_cost: Number(equipmentCost) || 0,
      total,
      estimated_duration_days: Number(duration) || null,
      notes: notes || null,
      document_urls: fileName ? [fileName] : [],
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    // Demo-mode persistence: appended to localStorage so the submission feels
    // real for this browser session. In production this would INSERT into the
    // `bids` table.
    appendDemoRecord('bids', bid);
    setLocalBids((prev) => [...prev, bid]);
    setJustSubmitted(bid);
  }

  function handleSendQuestion(e: FormEvent) {
    e.preventDefault();
    // Demo mode only: in production this would create a `messages` record and
    // trigger a `contractor_bid_received`-style notification to the office.
    setQuestionSent(true);
  }

  const days = daysUntil(opportunity.bid_deadline);
  const bidToShow = justSubmitted ?? existingBid;

  return (
    <div>
      <PageHeader
        title={opportunity.project_name}
        description={opportunity.location}
        actions={<Badge tone={statusTone(opportunity.status)}>{statusLabel(opportunity.status)}</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Scope</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 text-sm text-concrete-700">
              <p>{opportunity.scope}</p>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Location</dt>
                  <dd className="mt-0.5">{opportunity.location}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Start Date</dt>
                  <dd className="mt-0.5">{opportunity.start_date ? formatDate(opportunity.start_date) : 'TBD'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Completion Requirement</dt>
                  <dd className="mt-0.5">{opportunity.completion_requirement ?? 'Not specified'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Bid Deadline</dt>
                  <dd className="mt-0.5 flex items-center gap-2">
                    {formatDate(opportunity.bid_deadline)}
                    {opportunity.status === 'open' && (
                      <Badge tone={days <= 2 ? 'danger' : days <= 5 ? 'warning' : 'neutral'}>
                        {days >= 0 ? `${days}d left` : 'Past due'}
                      </Badge>
                    )}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge tone={opportunity.labor_included ? 'success' : 'neutral'}>
                  Labor {opportunity.labor_included ? 'Included' : 'Not Included'}
                </Badge>
                <Badge tone={opportunity.materials_included ? 'success' : 'neutral'}>
                  Materials {opportunity.materials_included ? 'Included' : 'Not Included'}
                </Badge>
                <Badge tone={opportunity.equipment_included ? 'success' : 'neutral'}>
                  Equipment {opportunity.equipment_included ? 'Included' : 'Not Included'}
                </Badge>
              </div>
              {opportunity.insurance_requirements && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Insurance Requirements</dt>
                  <dd className="mt-0.5">{opportunity.insurance_requirements}</dd>
                </div>
              )}
              {opportunity.special_instructions && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Special Instructions</dt>
                  <dd className="mt-0.5">{opportunity.special_instructions}</dd>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardBody>
              {questionSent ? (
                <p className="text-sm font-semibold text-emerald-600">
                  Your question has been sent to our office (demo mode). We'll respond as soon as possible.
                </p>
              ) : (
                <form onSubmit={handleSendQuestion} className="space-y-3">
                  <Textarea
                    placeholder="Ask a question about this opportunity..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Send Question
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{bidToShow ? 'Your Bid' : 'Submit Your Bid'}</CardTitle>
            </CardHeader>
            <CardBody>
              {bidToShow ? (
                <div className="space-y-4">
                  <Badge tone="success">Bid Submitted ✓</Badge>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Total Bid</p>
                    <p className="font-display text-2xl font-bold text-concrete-900">{formatCurrency(bidToShow.total ?? 0)}</p>
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-concrete-500">Labor</dt>
                      <dd>{formatCurrency(bidToShow.labor_cost ?? 0)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-concrete-500">Materials</dt>
                      <dd>{formatCurrency(bidToShow.material_cost ?? 0)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-concrete-500">Equipment</dt>
                      <dd>{formatCurrency(bidToShow.equipment_cost ?? 0)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-concrete-500">Estimated Duration</dt>
                      <dd>{bidToShow.estimated_duration_days ?? '—'} days</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-concrete-500">Status</dt>
                      <dd>
                        <Badge tone={statusTone(bidToShow.status)}>{statusLabel(bidToShow.status)}</Badge>
                      </dd>
                    </div>
                    {bidToShow.submitted_at && (
                      <div className="flex justify-between">
                        <dt className="text-concrete-500">Submitted</dt>
                        <dd>{formatDateTime(bidToShow.submitted_at)}</dd>
                      </div>
                    )}
                  </dl>
                  {bidToShow.notes && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Notes</p>
                      <p className="mt-0.5 text-sm text-concrete-700">{bidToShow.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <FormField label="Labor Cost" htmlFor="labor_cost" required>
                    <Input id="labor_cost" type="number" min="0" step="1" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} required />
                  </FormField>
                  <FormField label="Material Cost" htmlFor="material_cost" required>
                    <Input id="material_cost" type="number" min="0" step="1" value={materialCost} onChange={(e) => setMaterialCost(e.target.value)} required />
                  </FormField>
                  <FormField label="Equipment Cost" htmlFor="equipment_cost" required>
                    <Input id="equipment_cost" type="number" min="0" step="1" value={equipmentCost} onChange={(e) => setEquipmentCost(e.target.value)} required />
                  </FormField>

                  <div className="rounded-lg bg-concrete-100 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Total Bid</p>
                    <p className="font-display text-2xl font-bold text-concrete-900">{formatCurrency(total)}</p>
                  </div>

                  <FormField label="Estimated Duration (days)" htmlFor="duration" required>
                    <Input id="duration" type="number" min="0" step="1" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                  </FormField>
                  <FormField label="Notes" htmlFor="notes">
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else our office should know..." />
                  </FormField>
                  <FormField label="Supporting Document" htmlFor="document" hint="Optional — proposal, breakdown, etc.">
                    <input
                      id="document"
                      type="file"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                      className="block w-full text-sm text-concrete-600 file:mr-3 file:rounded-md file:border-0 file:bg-concrete-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-concrete-700 hover:file:bg-concrete-200"
                    />
                    {fileName && <p className="mt-1 text-xs text-concrete-500">Selected: {fileName}</p>}
                  </FormField>

                  <Button type="submit" fullWidth>
                    Submit Bid
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
