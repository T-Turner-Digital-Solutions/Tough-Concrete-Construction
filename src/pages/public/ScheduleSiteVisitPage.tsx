import { useState, type FormEvent, type ReactNode } from 'react';
import { ButtonLink, Button } from '@/components/ui/Button';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { SERVICE_TYPES } from '@/config/pricing';
import { BRAND } from '@/config/brand';
import { formatDate } from '@/lib/format';
import { appendDemoRecord, newDemoId } from '@/lib/data/demoStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Appointment } from '@/types/domain';

const TIME_WINDOWS = [
  { value: 'morning', label: 'Morning · 8:00 AM – 11:00 AM', start: '08:00', end: '11:00' },
  { value: 'midday', label: 'Midday · 11:00 AM – 2:00 PM', start: '11:00', end: '14:00' },
  { value: 'afternoon', label: 'Afternoon · 2:00 PM – 5:00 PM', start: '14:00', end: '17:00' },
] as const;

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  preferredDate: string;
  timeWindow: (typeof TIME_WINDOWS)[number]['value'] | '';
  serviceType: string;
  notes: string;
}

const BLANK_FORM: FormState = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  preferredDate: '',
  timeWindow: '',
  serviceType: '',
  notes: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function ScheduleSiteVisitPage(): ReactNode {
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.address.trim()) next.address = 'Project address is required.';
    if (!form.preferredDate) next.preferredDate = 'Choose a preferred date.';
    if (!form.timeWindow) next.timeWindow = 'Choose a preferred time window.';
    if (!form.serviceType) next.serviceType = 'Select a project type.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const window = TIME_WINDOWS.find((w) => w.value === form.timeWindow) ?? null;
    const appointmentRecord: Appointment & { full_name: string; phone: string; email: string; project_address: string; service_type: string } = {
      id: newDemoId('appt'),
      job_id: null,
      lead_id: null,
      customer_id: null,
      type: 'site_visit',
      status: 'requested',
      scheduled_date: form.preferredDate,
      window_start: window?.start ?? null,
      window_end: window?.end ?? null,
      notes: form.notes.trim() || null,
      created_at: new Date().toISOString(),
      // Denormalized contact fields — Appointment's core shape links to an
      // existing lead/customer, but a prospect hasn't been created yet here.
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      project_address: form.address.trim(),
      service_type: form.serviceType,
    };

    if (isSupabaseConfigured) {
      // TODO (production): const { error } = await supabase.from('appointments').insert(appointmentRecord);
    } else {
      appendDemoRecord('site_visit_requests', appointmentRecord);
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  const serviceLabel = SERVICE_TYPES.find((s) => s.key === form.serviceType)?.label ?? form.serviceType;
  const windowLabel = TIME_WINDOWS.find((w) => w.value === form.timeWindow)?.label ?? '';

  if (submitted) {
    return (
      <div className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-xl rounded-xl border border-concrete-200 bg-white p-8 text-center shadow-card sm:p-12">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </span>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">
            Site Visit Requested
          </h1>
          <p className="mt-3 text-concrete-600">
            Thanks, {form.fullName.split(' ')[0] || 'there'}! Our office will call or email you at{' '}
            {form.phone || 'the number you provided'} to confirm your exact appointment time on{' '}
            {form.preferredDate ? formatDate(form.preferredDate) : 'your requested date'} during the {windowLabel.toLowerCase()} window.
          </p>

          <div className="mt-8 rounded-lg bg-concrete-50 p-5 text-left text-sm">
            <dl className="grid grid-cols-1 gap-y-2">
              <div>
                <dt className="text-concrete-500">Project Address</dt>
                <dd className="font-medium text-concrete-900">{form.address}</dd>
              </div>
              <div>
                <dt className="text-concrete-500">Project Type</dt>
                <dd className="font-medium text-concrete-900">{serviceLabel}</dd>
              </div>
              <div>
                <dt className="text-concrete-500">Preferred Window</dt>
                <dd className="font-medium text-concrete-900">
                  {form.preferredDate ? formatDate(form.preferredDate) : ''} · {windowLabel}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/">Back to Home</ButtonLink>
            <ButtonLink to="/request-estimate" variant="outline">
              Also Request a Full Estimate
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <div className="container-page relative py-16 sm:py-20">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            In-Person Site Visit
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            Schedule a Site Visit
          </h1>
          <p className="mt-4 max-w-xl text-concrete-300">
            For projects that need a closer look — structural work, tricky access, or a large scope — request an
            in-person visit and we&apos;ll confirm a time that works for you.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Full Name" htmlFor="fullName" required error={errors.fullName}>
                <Input id="fullName" autoComplete="name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              </FormField>
              <FormField label="Phone" htmlFor="phone" required error={errors.phone}>
                <Input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </FormField>
              <FormField label="Email" htmlFor="email" required error={errors.email}>
                <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </FormField>
              <FormField label="Project Address" htmlFor="address" required error={errors.address}>
                <Input id="address" autoComplete="street-address" value={form.address} onChange={(e) => update('address', e.target.value)} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Preferred Date" htmlFor="preferredDate" required error={errors.preferredDate}>
                <Input id="preferredDate" type="date" value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} />
              </FormField>
              <FormField label="Preferred Time Window" htmlFor="timeWindow" required error={errors.timeWindow}>
                <Select id="timeWindow" value={form.timeWindow} onChange={(e) => update('timeWindow', e.target.value as FormState['timeWindow'])}>
                  <option value="">Select a window…</option>
                  {TIME_WINDOWS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField label="Project Type" htmlFor="serviceType" required error={errors.serviceType}>
              <Select id="serviceType" value={form.serviceType} onChange={(e) => update('serviceType', e.target.value)}>
                <option value="">Select a project type…</option>
                {SERVICE_TYPES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Notes" htmlFor="notes" hint="Anything you'd like our team to know before the visit.">
              <Textarea id="notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
            </FormField>

            <div className="pt-2">
              <Button type="submit" size="lg" fullWidth disabled={submitting}>
                {submitting ? 'Submitting…' : 'Request Site Visit'}
              </Button>
              <p className="mt-3 text-center text-xs text-concrete-500">
                {BRAND.dbaName} will confirm your exact appointment window by phone or email — this request does not
                guarantee your preferred time.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
