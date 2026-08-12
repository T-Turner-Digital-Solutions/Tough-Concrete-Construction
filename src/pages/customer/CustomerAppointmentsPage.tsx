import { useState } from 'react';
import { demoAppointments } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { DataTable, type Column } from '@/components/ui/Table';
import type { Appointment, AppointmentType } from '@/types/domain';

// Demo mode: hardcoded to the logged-in demo customer. In production this
// would resolve via profiles.id -> customers.profile_id.
const CUSTOMER_ID = 'cust-reyes';

const TYPE_LABELS: Record<AppointmentType, string> = {
  estimate: 'Estimate Visit',
  site_measurement: 'Site Measurement',
  site_visit: 'Site Visit',
  excavation: 'Excavation',
  prep: 'Site Prep',
  forms: 'Forms',
  inspection: 'Inspection',
  pour: 'Concrete Pour',
  finish: 'Finishing',
  cleanup: 'Cleanup',
  final_walkthrough: 'Final Walkthrough',
};

const REQUESTABLE_TYPES: AppointmentType[] = ['site_visit', 'inspection', 'final_walkthrough'];

function windowLabel(a: Appointment): string {
  if (!a.window_start || !a.window_end) return '—';
  return `${a.window_start} – ${a.window_end}`;
}

export default function CustomerAppointmentsPage() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [type, setType] = useState<AppointmentType>('site_visit');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Row Level Security simulation: only this customer's own appointments.
  const myAppointments = demoAppointments.filter((a) => a.customer_id === CUSTOMER_ID);

  function closeModal() {
    setRequestOpen(false);
    setSubmitted(false);
    setType('site_visit');
    setPreferredDate('');
    setNotes('');
  }

  function submitRequest() {
    // Demo-only: in production this would insert into `appointments` with
    // status 'requested', customer_id set from the authenticated session,
    // and notify office staff to confirm a specific date/time window.
    setSubmitted(true);
  }

  const columns: Column<Appointment>[] = [
    { header: 'Type', cell: (a) => TYPE_LABELS[a.type] },
    { header: 'Date', cell: (a) => formatDate(a.scheduled_date) },
    { header: 'Time Window', cell: (a) => windowLabel(a) },
    { header: 'Status', cell: (a) => <Badge tone={statusTone(a.status)}>{statusLabel(a.status)}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Upcoming and past site visits for your project."
        actions={<Button onClick={() => setRequestOpen(true)}>Request New Appointment</Button>}
      />

      <DataTable columns={columns} rows={myAppointments} rowKey={(a) => a.id} emptyMessage="No appointments scheduled yet." />

      <Modal open={requestOpen} onClose={closeModal} title="Request New Appointment">
        {submitted ? (
          <div>
            <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Request sent! Our office will follow up to confirm a specific date and time window.
            </p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FormField label="Appointment Type" htmlFor="appt-type">
              <Select id="appt-type" value={type} onChange={(e) => setType(e.target.value as AppointmentType)}>
                {REQUESTABLE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Preferred Date" htmlFor="appt-date">
              <Input id="appt-date" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
            </FormField>
            <FormField label="Notes" htmlFor="appt-notes" hint="Optional — anything our office should know.">
              <Textarea id="appt-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Prefer mornings, gate code is..." />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={submitRequest} disabled={!preferredDate}>
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
