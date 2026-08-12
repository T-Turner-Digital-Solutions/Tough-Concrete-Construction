import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { demoAppointments, demoCustomers, demoJobs, demoLeads } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { cn } from '@/lib/cn';
import type { Appointment, AppointmentType } from '@/types/domain';

const APPOINTMENT_TYPES: AppointmentType[] = [
  'estimate',
  'site_measurement',
  'site_visit',
  'excavation',
  'prep',
  'forms',
  'inspection',
  'pour',
  'finish',
  'cleanup',
  'final_walkthrough',
];

type ViewMode = 'all' | 'today' | 'week';

const BLANK_FORM = {
  type: 'estimate' as AppointmentType,
  scheduled_date: '',
  window_start: '',
  window_end: '',
  job_id: '',
  lead_id: '',
  notes: '',
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [jumpDate, setJumpDate] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);

  const partyName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of demoCustomers) map[`customer:${c.id}`] = c.full_name;
    for (const l of demoLeads) map[`lead:${l.id}`] = `${l.full_name} (Lead)`;
    return map;
  }, []);

  function nameFor(a: Appointment): string {
    if (a.customer_id) return partyName[`customer:${a.customer_id}`] ?? 'Unknown Customer';
    if (a.lead_id) return partyName[`lead:${a.lead_id}`] ?? 'Unknown Lead';
    return 'Unassigned';
  }

  const filtered = useMemo(() => {
    if (jumpDate) return appointments.filter((a) => a.scheduled_date === jumpDate);
    if (viewMode === 'today') return appointments.filter((a) => a.scheduled_date === todayIso());
    if (viewMode === 'week') {
      const start = todayIso();
      const end = addDaysIso(7);
      return appointments.filter((a) => a.scheduled_date >= start && a.scheduled_date <= end);
    }
    return appointments;
  }, [appointments, viewMode, jumpDate]);

  const grouped = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    for (const a of filtered) {
      groups[a.scheduled_date] = groups[a.scheduled_date] ?? [];
      groups[a.scheduled_date].push(a);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, items]) => ({
        date,
        items: items.sort((x, y) => (x.window_start ?? '').localeCompare(y.window_start ?? '')),
      }));
  }, [filtered]);

  function updateStatus(id: string, status: Appointment['status']) {
    // Real flow: UPDATE appointments SET status = ... WHERE id = ... in Supabase, and for
    // reschedules, capture the new date/window rather than just flipping the status flag.
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function handleCreate() {
    if (!form.scheduled_date) return;
    // Real flow: INSERT INTO appointments (...) VALUES (...) in Supabase.
    const appt: Appointment = {
      id: `appt-manual-${Date.now()}`,
      job_id: form.job_id || null,
      lead_id: form.lead_id || null,
      customer_id: form.job_id ? demoJobs.find((j) => j.id === form.job_id)?.customer_id ?? null : null,
      type: form.type,
      status: 'pending',
      scheduled_date: form.scheduled_date,
      window_start: form.window_start || null,
      window_end: form.window_end || null,
      notes: form.notes || null,
      created_at: new Date().toISOString(),
    };
    setAppointments((prev) => [...prev, appt]);
    setForm(BLANK_FORM);
    setNewOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Estimates, site visits, and job-stage milestones on the calendar."
        actions={<Button onClick={() => setNewOpen(true)}>+ New Appointment</Button>}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(['all', 'today', 'week'] as ViewMode[]).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={!jumpDate && viewMode === m ? 'dark' : 'outline'}
              className={cn(!jumpDate && viewMode === m && 'pointer-events-none')}
              onClick={() => {
                setViewMode(m);
                setJumpDate('');
              }}
            >
              {m === 'all' ? 'All' : m === 'today' ? 'Today' : 'This Week'}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="jump-date" className="text-xs font-semibold uppercase text-concrete-500">
            Jump to date
          </label>
          <Input id="jump-date" type="date" className="w-auto" value={jumpDate} onChange={(e) => setJumpDate(e.target.value)} />
          {jumpDate && (
            <Button size="sm" variant="ghost" onClick={() => setJumpDate('')}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {grouped.length === 0 ? (
        <EmptyState title="No appointments in this range" description="Try a different filter or jump to another date." />
      ) : (
        <div className="space-y-6">
          {grouped.map(({ date, items }) => (
            <div key={date}>
              <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-concrete-500">{formatDate(date, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</h2>
              <div className="space-y-2">
                {items.map((a) => (
                  <Card key={a.id}>
                    <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Badge tone="info">{statusLabel(a.type)}</Badge>
                        <div>
                          <p className="font-semibold text-concrete-900">{nameFor(a)}</p>
                          <p className="text-xs text-concrete-500">
                            {a.window_start && a.window_end ? `${a.window_start} – ${a.window_end}` : 'Time TBD'}
                            {a.notes ? ` · ${a.notes}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={statusTone(a.status)}>{statusLabel(a.status)}</Badge>
                        <Button size="sm" variant="outline" disabled={a.status === 'confirmed'} onClick={() => updateStatus(a.id, 'confirmed')}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" disabled={a.status === 'rescheduled'} onClick={() => updateStatus(a.id, 'rescheduled')}>
                          Reschedule
                        </Button>
                        <Button size="sm" variant="outline" disabled={a.status === 'completed'} onClick={() => updateStatus(a.id, 'completed')}>
                          Mark Completed
                        </Button>
                        <Button size="sm" variant="danger" disabled={a.status === 'cancelled'} onClick={() => updateStatus(a.id, 'cancelled')}>
                          Cancel
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New Appointment"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save Appointment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Type" htmlFor="na-type">
            <Select id="na-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AppointmentType })}>
              {APPOINTMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {statusLabel(t)}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Date" htmlFor="na-date" required>
            <Input id="na-date" type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Window Start" htmlFor="na-start">
              <Input id="na-start" type="time" value={form.window_start} onChange={(e) => setForm({ ...form, window_start: e.target.value })} />
            </FormField>
            <FormField label="Window End" htmlFor="na-end">
              <Input id="na-end" type="time" value={form.window_end} onChange={(e) => setForm({ ...form, window_end: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Job (optional)" htmlFor="na-job">
            <Select id="na-job" value={form.job_id} onChange={(e) => setForm({ ...form, job_id: e.target.value, lead_id: '' })}>
              <option value="">None</option>
              {demoJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.job_number}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Lead (optional)" htmlFor="na-lead">
            <Select id="na-lead" value={form.lead_id} onChange={(e) => setForm({ ...form, lead_id: e.target.value, job_id: '' })}>
              <option value="">None</option>
              {demoLeads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.full_name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Notes" htmlFor="na-notes">
            <Textarea id="na-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
