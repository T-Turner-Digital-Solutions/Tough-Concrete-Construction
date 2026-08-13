import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Stat } from '@/components/ui/Stat';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/EmptyState';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate, formatDateTime, timeAgo } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { DEFAULT_TOUGHTRACK_STAGES } from '@/config/stages';
import { calculateOverallProgress, getCurrentStage, type JobStageProgress } from '@/lib/toughtrack';
import {
  demoJobs,
  demoCustomers,
  demoJobStageProgress,
  demoEtaStatus,
  demoDailyLogs,
  demoPhotos,
  demoDocuments,
  demoMessages,
  demoChangeOrders,
  demoInvoices,
  demoPayments,
  demoJobExpenses,
  demoContracts,
  demoWeatherDelays,
} from '@/data/demoData';
import type { CrewStatus, DailyEtaStatus, DailyJobLog, JobStageProgressRecord } from '@/types/domain';

const TABS = [
  'overview',
  'toughtrack',
  'daily_logs',
  'photos',
  'documents',
  'contract_invoices',
  'change_orders',
  'costing',
  'messages',
] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  overview: 'Overview',
  toughtrack: 'ToughTrack™',
  daily_logs: 'Daily Logs',
  photos: 'Photos',
  documents: 'Documents',
  contract_invoices: 'Contract & Invoices',
  change_orders: 'Change Orders',
  costing: 'Costing & Profitability',
  messages: 'Messages',
};

function toEngine(records: JobStageProgressRecord[]): JobStageProgress[] {
  return records.map((r) => ({
    key: r.stage_key,
    label: r.label,
    status: r.status,
    percentWithinStage: r.percent_within_stage,
    startedAt: r.started_at ?? undefined,
    completedAt: r.completed_at ?? undefined,
  }));
}

const CREW_STATUS_FLOW: { key: CrewStatus; label: string }[] = [
  { key: 'not_started', label: 'Start Day' },
  { key: 'on_my_way', label: 'On My Way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'in_progress', label: 'Work In Progress' },
  { key: 'paused', label: 'Paused' },
  { key: 'delayed', label: 'Delayed' },
  { key: 'complete_today', label: 'Work Complete For Today' },
];

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const job = demoJobs.find((j) => j.id === id);
  const jobId = job?.id ?? '';
  const [tab, setTab] = useState<Tab>('overview');

  // Hooks must run unconditionally on every render (even when `job` isn't
  // found yet), so state is seeded with safe fallbacks and the "not found"
  // guard happens at render time, after all hooks are declared.
  const [stageProgress, setStageProgress] = useState<JobStageProgressRecord[]>(demoJobStageProgress[jobId] ?? []);
  const [eta, setEta] = useState<DailyEtaStatus | undefined>(demoEtaStatus[jobId]);
  const [logs, setLogs] = useState<DailyJobLog[]>(demoDailyLogs.filter((l) => l.job_id === jobId));
  const engineProgress = useMemo(() => toEngine(stageProgress), [stageProgress]);

  if (!job) {
    return <EmptyState title="Job not found" description="This job may have been removed or the link is incorrect." />;
  }

  const customer = demoCustomers.find((c) => c.id === job.customer_id);

  const overallPercent = calculateOverallProgress(DEFAULT_TOUGHTRACK_STAGES, engineProgress);
  const currentStage = getCurrentStage(DEFAULT_TOUGHTRACK_STAGES, engineProgress);

  const photos = demoPhotos.filter((p) => p.job_id === job.id);
  const documents = demoDocuments.filter((d) => d.job_id === job.id);
  const messages = demoMessages.filter((m) => m.job_id === job.id);
  const changeOrders = demoChangeOrders.filter((c) => c.job_id === job.id);
  const invoices = demoInvoices.filter((i) => i.job_id === job.id);
  const expenses = demoJobExpenses.filter((e) => e.job_id === job.id);
  const contract = demoContracts.find((c) => c.id === job.contract_id);
  const weatherDelay = demoWeatherDelays.find((w) => w.job_id === job.id && w.active);

  function updateStage(key: string, patch: Partial<JobStageProgressRecord>) {
    setStageProgress((prev) => prev.map((s) => (s.stage_key === key ? { ...s, ...patch } : s)));
  }

  function setCrewStatus(status: CrewStatus) {
    setEta((prev) => ({
      id: prev?.id ?? `eta-${jobId}-today`,
      job_id: jobId,
      status_date: new Date().toISOString().slice(0, 10),
      crew_status: status,
      eta_window_start: prev?.eta_window_start ?? null,
      eta_window_end: prev?.eta_window_end ?? null,
      estimated_hours_on_site: prev?.estimated_hours_on_site ?? null,
      estimated_departure: prev?.estimated_departure ?? null,
      todays_scope: prev?.todays_scope ?? null,
      delay_reason: prev?.delay_reason ?? null,
      tomorrow_expected_arrival: prev?.tomorrow_expected_arrival ?? null,
      updated_at: new Date().toISOString(),
    }));
  }

  const revenue = job.contract_value + job.approved_change_order_total;
  const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = revenue - totalCost;
  const marginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  return (
    <div>
      <PageHeader
        title={job.job_number}
        description={`${customer?.full_name ?? 'Unknown customer'} · ${job.address.street}, ${job.address.city}, ${job.address.state}`}
        actions={<Badge tone={statusTone(job.status)}>{statusLabel(job.status)}</Badge>}
      />

      {weatherDelay && (
        <div className="mb-6 rounded-lg border border-safety-300 bg-safety-50 p-4 text-sm text-safety-800">
          <p className="font-semibold uppercase tracking-wide">Weather Delay Active</p>
          <p className="mt-1">{weatherDelay.customer_message}</p>
        </div>
      )}

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-concrete-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors',
              tab === t ? 'border-safety-500 text-concrete-900' : 'border-transparent text-concrete-500 hover:text-concrete-800',
            )}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Scope of Work</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm leading-relaxed text-concrete-700">{job.scope}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ToughTrack™ Progress</CardTitle>
              </CardHeader>
              <CardBody>
                <ProgressBar value={overallPercent} showLabel />
                <p className="mt-2 text-sm text-concrete-600">
                  Current stage: <span className="font-semibold text-concrete-900">{currentStage?.label ?? '—'}</span>
                </p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setTab('toughtrack')}>
                  Manage Stages
                </Button>
              </CardBody>
            </Card>
          </div>
          <div className="space-y-4">
            <Stat label="Contract Value" value={formatCurrency(job.contract_value)} />
            <Stat label="Approved Change Orders" value={formatCurrency(job.approved_change_order_total)} />
            <Stat label="Est. Completion" value={job.estimated_completion_date ? formatDate(job.estimated_completion_date) : '—'} />
          </div>
        </div>
      )}

      {tab === 'toughtrack' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Stage Progress</CardTitle>
            </CardHeader>
            <CardBody>
              <ProgressBar value={overallPercent} showLabel size="md" />
              <ul className="mt-5 space-y-3">
                {stageProgress
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((s) => (
                    <li key={s.stage_key} className="rounded-lg border border-concrete-100 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-concrete-900">{s.label}</p>
                          {s.status === 'in_progress' && <p className="text-xs text-concrete-500">{s.percent_within_stage}% of this stage complete</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            className="w-auto text-xs"
                            value={s.status}
                            onChange={(e) =>
                              updateStage(s.stage_key, {
                                status: e.target.value as JobStageProgressRecord['status'],
                                completed_at: e.target.value === 'complete' ? new Date().toISOString() : s.completed_at,
                                started_at: e.target.value !== 'pending' && !s.started_at ? new Date().toISOString() : s.started_at,
                              })
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="complete">Complete</option>
                            <option value="skipped">Skipped</option>
                          </Select>
                          <Badge tone={statusTone(s.status)}>{statusLabel(s.status)}</Badge>
                        </div>
                      </div>
                      {s.status === 'in_progress' && (
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={s.percent_within_stage}
                          onChange={(e) => updateStage(s.stage_key, { percent_within_stage: Number(e.target.value) })}
                          className="mt-2 w-full accent-safety-500"
                        />
                      )}
                    </li>
                  ))}
              </ul>
              <p className="mt-4 text-xs text-concrete-400">
                Overall percent complete is always calculated from stage weights + status — it is never typed in directly.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Crew Status</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-concrete-500">
                Current: <span className="text-concrete-800">{eta ? statusLabel(eta.crew_status) : 'Not started'}</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CREW_STATUS_FLOW.map((s) => (
                  <Button
                    key={s.key}
                    size="sm"
                    variant={eta?.crew_status === s.key ? 'dark' : 'outline'}
                    onClick={() => setCrewStatus(s.key)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
              <div className="mt-4 space-y-3 border-t border-concrete-100 pt-4">
                <FormField label="Today's Scope" htmlFor="scope">
                  <Input
                    id="scope"
                    value={eta?.todays_scope ?? ''}
                    onChange={(e) => setEta((prev) => (prev ? { ...prev, todays_scope: e.target.value } : prev))}
                    placeholder="e.g. Forms & reinforcement"
                  />
                </FormField>
                <FormField label="Tomorrow's Expected Arrival" htmlFor="tomorrow">
                  <Input
                    id="tomorrow"
                    value={eta?.tomorrow_expected_arrival ?? ''}
                    onChange={(e) => setEta((prev) => (prev ? { ...prev, tomorrow_expected_arrival: e.target.value } : prev))}
                    placeholder="e.g. 7:30 AM – 8:00 AM"
                  />
                </FormField>
              </div>
              <p className="mt-3 text-xs text-concrete-400">
                Updates immediately in the customer's ToughTrack view. GPS-based live ETA can be layered on later without
                changing this workflow.
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'daily_logs' && <DailyLogsTab jobId={job.id} logs={logs} setLogs={setLogs} />}

      {tab === 'photos' && (
        <div>
          {photos.length === 0 ? (
            <EmptyState title="No photos yet" description="Field crew can upload photos from a phone as work progresses." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((p) => (
                <div key={p.id}>
                  <PhotoTile id={p.id} url={p.url} category={p.category} caption={p.caption} />
                  <div className="mt-1 flex items-center justify-between">
                    <Badge tone={p.visibility === 'internal' ? 'neutral' : p.visibility === 'public_gallery' ? 'success' : 'info'}>
                      {statusLabel(p.visibility)}
                    </Badge>
                    <span className="text-[11px] text-concrete-400">{formatDate(p.taken_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs text-concrete-400">
            Photo upload from this dashboard (and from the mobile field view) requires Supabase Storage to be configured
            — see README. The gallery UI above is fully wired to render real photo URLs once available.
          </p>
        </div>
      )}

      {tab === 'documents' && (
        <div>
          {documents.length === 0 ? (
            <EmptyState title="No documents" />
          ) : (
            <ul className="divide-y divide-concrete-100 rounded-xl border border-concrete-200 bg-white">
              {documents.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-concrete-900">{d.name}</p>
                    <p className="text-xs text-concrete-500">Uploaded {formatDate(d.uploaded_at)}</p>
                  </div>
                  <Badge tone={d.visibility === 'customer' ? 'info' : 'neutral'}>{statusLabel(d.visibility)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'contract_invoices' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contract</CardTitle>
            </CardHeader>
            <CardBody>
              {contract ? (
                <div className="text-sm">
                  <p className="font-semibold text-concrete-900">{contract.contract_number}</p>
                  <p className="mt-1 text-concrete-500">{statusLabel(contract.type)} · v{contract.version}</p>
                  <Badge className="mt-2" tone={statusTone(contract.status)}>
                    {statusLabel(contract.status)}
                  </Badge>
                </div>
              ) : (
                <EmptyState title="No contract yet" description="Generated automatically once the estimate is approved." />
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardBody>
              {invoices.length === 0 ? (
                <EmptyState title="No invoices yet" />
              ) : (
                <ul className="space-y-2">
                  {invoices.map((inv) => {
                    const payments = demoPayments.filter((p) => p.invoice_id === inv.id);
                    return (
                      <li key={inv.id} className="flex items-center justify-between rounded-lg border border-concrete-100 p-3 text-sm">
                        <div>
                          <p className="font-semibold text-concrete-900">{inv.invoice_number}</p>
                          <p className="text-xs text-concrete-500">
                            {statusLabel(inv.type)} · {payments.length} payment{payments.length === 1 ? '' : 's'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(inv.amount)}</p>
                          <Badge tone={statusTone(inv.status)}>{statusLabel(inv.status)}</Badge>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'change_orders' && (
        <div>
          {changeOrders.length === 0 ? (
            <EmptyState title="No change orders" description="Additional scope requests will appear here for approval." />
          ) : (
            <ul className="space-y-3">
              {changeOrders.map((co) => (
                <li key={co.id} className="rounded-xl border border-concrete-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-concrete-900">{co.change_order_number}</p>
                    <Badge tone={statusTone(co.status)}>{statusLabel(co.status)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-concrete-600">{co.description}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-concrete-500">
                    <span>Added Cost: {formatCurrency(co.added_cost)}</span>
                    <span>New Contract Total: {formatCurrency(co.new_contract_total)}</span>
                    {co.added_days > 0 && <span>+{co.added_days} day(s)</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-concrete-400">
            The original contract amount is always preserved — approved change orders are tracked as separate,
            auditable additions rather than overwriting it.
          </p>
        </div>
      )}

      {tab === 'costing' && (
        <div>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Contract Value" value={formatCurrency(job.contract_value)} />
            <Stat label="Change Orders" value={formatCurrency(job.approved_change_order_total)} />
            <Stat label="Total Revenue" value={formatCurrency(revenue)} tone="success" />
            <Stat label="Total Cost" value={formatCurrency(totalCost)} />
            <Stat label="Gross Profit" value={formatCurrency(grossProfit)} tone={grossProfit >= 0 ? 'success' : 'danger'} hint={`${marginPct.toFixed(1)}% margin`} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Job Expenses</CardTitle>
            </CardHeader>
            <CardBody>
              {expenses.length === 0 ? (
                <EmptyState title="No expenses recorded" />
              ) : (
                <ul className="divide-y divide-concrete-100">
                  {expenses.map((e) => (
                    <li key={e.id} className="flex items-center justify-between py-2 text-sm">
                      <div>
                        <p className="font-medium text-concrete-800">{e.description}</p>
                        <p className="text-xs text-concrete-500">{statusLabel(e.category)} · {formatDate(e.incurred_at)}</p>
                      </div>
                      <span className="font-semibold">{formatCurrency(e.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
          <p className="mt-4 text-xs font-medium text-concrete-500">
            Profitability figures are owner/staff-only — never exposed to the customer or contractor portals.
          </p>
        </div>
      )}

      {tab === 'messages' && (
        <Card>
          <CardBody>
            {messages.length === 0 ? (
              <EmptyState title="No messages yet" />
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className="text-sm">
                    <p className="text-concrete-800">{m.body}</p>
                    <p className="text-xs text-concrete-400">
                      {statusLabel(m.sender_role)} · {timeAgo(m.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function DailyLogsTab({ jobId, logs, setLogs }: { jobId: string; logs: DailyJobLog[]; setLogs: (fn: (prev: DailyJobLog[]) => DailyJobLog[]) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    workCompleted: '',
    customerNotes: '',
    internalNotes: '',
    tomorrowPlan: '',
    progressPercent: 50,
  });

  function publish() {
    const record: DailyJobLog = {
      id: `log-${jobId}-${Date.now()}`,
      job_id: jobId,
      log_date: new Date().toISOString().slice(0, 10),
      crew_members: [],
      arrival_time: null,
      departure_time: null,
      hours_on_site: null,
      work_completed: draft.workCompleted,
      tasks_completed: [],
      tasks_partial: [],
      progress_percent: draft.progressPercent,
      materials_used: null,
      equipment_used: null,
      issues: null,
      weather: null,
      delay_reason: null,
      customer_notes: draft.customerNotes,
      internal_notes: draft.internalNotes,
      photo_ids: [],
      tomorrow_plan: draft.tomorrowPlan,
      tomorrow_eta_start: null,
      tomorrow_eta_end: null,
      tomorrow_expected_hours: null,
      published: true,
      created_by: 'profile-owner-1',
      created_at: new Date().toISOString(),
    };
    setLogs((prev) => [record, ...prev]);
    setOpen(false);
    setDraft({ workCompleted: '', customerNotes: '', internalNotes: '', tomorrowPlan: '', progressPercent: 50 });
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          + New Daily Log
        </Button>
      </div>
      {logs.length === 0 ? (
        <EmptyState title="No daily logs yet" description="Log crew activity each day to keep the customer updated." />
      ) : (
        <ul className="space-y-4">
          {logs
            .sort((a, b) => b.log_date.localeCompare(a.log_date))
            .map((log) => (
              <li key={log.id} className="rounded-xl border border-concrete-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-concrete-900">{formatDate(log.log_date)}</p>
                  <Badge tone={log.published ? 'success' : 'neutral'}>{log.published ? 'Published' : 'Draft'}</Badge>
                </div>
                <p className="mt-2 text-sm text-concrete-700">{log.work_completed}</p>
                {log.customer_notes && (
                  <p className="mt-2 rounded bg-steel-50 px-2 py-1.5 text-xs text-steel-800">
                    <span className="font-semibold">Customer-visible:</span> {log.customer_notes}
                  </p>
                )}
                {log.internal_notes && (
                  <p className="mt-2 rounded bg-concrete-50 px-2 py-1.5 text-xs text-concrete-600">
                    <span className="font-semibold">Internal only:</span> {log.internal_notes}
                  </p>
                )}
                {log.tomorrow_plan && <p className="mt-2 text-xs text-concrete-500">Tomorrow: {log.tomorrow_plan}</p>}
                <p className="mt-2 text-[11px] text-concrete-400">Logged {formatDateTime(log.created_at)}</p>
              </li>
            ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New Daily Job Log" footer={<Button onClick={publish}>Publish Client Update</Button>}>
        <div className="space-y-4">
          <FormField label="Work Completed Today" htmlFor="workCompleted" required>
            <Textarea id="workCompleted" value={draft.workCompleted} onChange={(e) => setDraft((d) => ({ ...d, workCompleted: e.target.value }))} />
          </FormField>
          <FormField label="Customer-Visible Notes" htmlFor="customerNotes" hint="Shown in the customer's ToughTrack activity feed.">
            <Textarea id="customerNotes" value={draft.customerNotes} onChange={(e) => setDraft((d) => ({ ...d, customerNotes: e.target.value }))} />
          </FormField>
          <FormField label="Internal Notes" htmlFor="internalNotes" hint="Staff-only — never shown to the customer.">
            <Textarea id="internalNotes" value={draft.internalNotes} onChange={(e) => setDraft((d) => ({ ...d, internalNotes: e.target.value }))} />
          </FormField>
          <FormField label="Tomorrow's Plan" htmlFor="tomorrowPlan">
            <Input id="tomorrowPlan" value={draft.tomorrowPlan} onChange={(e) => setDraft((d) => ({ ...d, tomorrowPlan: e.target.value }))} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
