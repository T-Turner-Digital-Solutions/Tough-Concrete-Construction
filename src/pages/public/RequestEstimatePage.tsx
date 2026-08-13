import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonLink } from '@/components/ui/Button';
import { HeroLogoWatermark } from '@/components/marketing/HeroLogoWatermark';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { SERVICE_TYPES } from '@/config/pricing';
import { BRAND } from '@/config/brand';
import { appendDemoRecord, newDemoId } from '@/lib/data/demoStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Lead, ProjectCategory } from '@/types/domain';
import { cn } from '@/lib/cn';

const BUDGET_RANGES = ['Under $5,000', '$5,000–$10,000', '$10,000–$20,000', '$20,000–$50,000', '$50,000+', 'Not sure'];

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  category: ProjectCategory | '';
  serviceType: string;
  lengthFt: string;
  widthFt: string;
  thicknessIn: string;
  removalNeeded: 'yes' | 'no' | '';
  desiredFinish: string;
  desiredStartDate: string;
  budgetRange: string;
  description: string;
  preferredContact: Lead['preferred_contact_method'] | '';
}

const BLANK_FORM: FormState = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  category: '',
  serviceType: '',
  lengthFt: '',
  widthFt: '',
  thicknessIn: '',
  removalNeeded: '',
  desiredFinish: '',
  desiredStartDate: '',
  budgetRange: '',
  description: '',
  preferredContact: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5 border-b border-concrete-100 pb-3">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-concrete-500">{description}</p>}
    </div>
  );
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: { label: string; value: T }[];
  value: T | '';
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
            value === o.value
              ? 'border-steel-700 bg-steel-700 text-white'
              : 'border-concrete-300 bg-white text-concrete-700 hover:bg-concrete-100',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function fileNames(list: FileList | null): string[] {
  if (!list) return [];
  return Array.from(list).map((f) => f.name);
}

export default function RequestEstimatePage(): ReactNode {
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);
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
    if (!form.category) next.category = 'Select residential or commercial.';
    if (!form.serviceType) next.serviceType = 'Select a project type.';
    if (!form.lengthFt.trim() || Number(form.lengthFt) <= 0) next.lengthFt = 'Enter an approximate length.';
    if (!form.widthFt.trim() || Number(form.widthFt) <= 0) next.widthFt = 'Enter an approximate width.';
    if (!form.description.trim()) next.description = 'Please describe the project.';
    if (!form.preferredContact) next.preferredContact = 'Select a preferred contact method.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const leadRecord: Lead = {
      id: newDemoId('lead'),
      created_at: new Date().toISOString(),
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      project_address: form.address.trim(),
      category: form.category as ProjectCategory,
      service_type: form.serviceType,
      length_ft: Number(form.lengthFt),
      width_ft: Number(form.widthFt),
      thickness_in: form.thicknessIn.trim() ? Number(form.thicknessIn) : null,
      removal_needed: form.removalNeeded === 'yes',
      desired_finish: form.desiredFinish.trim() || null,
      desired_start_date: form.desiredStartDate || null,
      budget_range: form.budgetRange || null,
      description: form.description.trim(),
      photo_urls: photoNames,
      document_urls: documentNames,
      preferred_contact_method: form.preferredContact as Lead['preferred_contact_method'],
      status: 'new',
      source: 'website',
      customer_id: null,
    };

    if (isSupabaseConfigured) {
      // TODO (production): const { error } = await supabase.from('leads').insert(leadRecord);
      // File uploads would go to Supabase Storage first and photo_urls/document_urls
      // would hold the resulting public URLs instead of raw file names.
    } else {
      appendDemoRecord<Lead>('leads', leadRecord);
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  const serviceLabel = SERVICE_TYPES.find((s) => s.key === form.serviceType)?.label ?? form.serviceType;

  if (submitted) {
    return (
      <div className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-2xl rounded-xl border border-concrete-200 bg-white p-8 text-center shadow-card sm:p-12">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </span>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-concrete-900 sm:text-3xl">
            Thanks, {form.fullName.split(' ')[0] || 'there'}! We&apos;ve got it.
          </h1>
          <p className="mt-3 text-concrete-600">
            We&apos;ll be in touch within one business day at {form.phone || 'the phone number you provided'} or{' '}
            {form.email || 'the email you provided'} to discuss your project. In the meantime, feel free to explore
            our gallery or schedule a site visit.
          </p>

          <div className="mt-8 rounded-lg bg-concrete-50 p-5 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-concrete-500">What you submitted</p>
            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-concrete-500">Project Address</dt>
                <dd className="font-medium text-concrete-900">{form.address}</dd>
              </div>
              <div>
                <dt className="text-concrete-500">Project Type</dt>
                <dd className="font-medium text-concrete-900">{serviceLabel}</dd>
              </div>
              <div>
                <dt className="text-concrete-500">Category</dt>
                <dd className="font-medium capitalize text-concrete-900">{form.category}</dd>
              </div>
              <div>
                <dt className="text-concrete-500">Approx. Dimensions</dt>
                <dd className="font-medium text-concrete-900">
                  {form.lengthFt} ft × {form.widthFt} ft{form.thicknessIn ? ` × ${form.thicknessIn} in` : ''}
                </dd>
              </div>
              {form.budgetRange && (
                <div>
                  <dt className="text-concrete-500">Budget Range</dt>
                  <dd className="font-medium text-concrete-900">{form.budgetRange}</dd>
                </div>
              )}
              <div>
                <dt className="text-concrete-500">Preferred Contact</dt>
                <dd className="font-medium capitalize text-concrete-900">{form.preferredContact}</dd>
              </div>
              {(photoNames.length > 0 || documentNames.length > 0) && (
                <div className="sm:col-span-2">
                  <dt className="text-concrete-500">Files Received</dt>
                  <dd className="font-medium text-concrete-900">
                    {[...photoNames, ...documentNames].join(', ') || 'None'}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/">Back to Home</ButtonLink>
            <ButtonLink to="/schedule-site-visit" variant="outline">
              Schedule a Site Visit Too
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <HeroLogoWatermark />
        <div className="container-page relative py-16 sm:py-20">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            Free, No-Obligation Estimate
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            Request a Detailed Estimate
          </h1>
          <p className="mt-4 max-w-2xl text-concrete-300">
            Tell us about your project below and our team will follow up within one business day with next steps.
            The more detail you provide, the more accurate your estimate will be.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl space-y-10">
          <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
            <SectionHeading title="Contact Information" />
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
          </div>

          <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
            <SectionHeading title="Project Details" />
            <div className="space-y-5">
              <FormField label="Residential or Commercial" required error={errors.category}>
                <PillGroup
                  name="category"
                  value={form.category}
                  onChange={(v) => update('category', v)}
                  options={[
                    { label: 'Residential', value: 'residential' },
                    { label: 'Commercial', value: 'commercial' },
                  ]}
                />
              </FormField>

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

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <FormField label="Approx. Length (ft)" htmlFor="lengthFt" required error={errors.lengthFt}>
                  <Input id="lengthFt" type="number" min={0} step="0.5" value={form.lengthFt} onChange={(e) => update('lengthFt', e.target.value)} />
                </FormField>
                <FormField label="Approx. Width (ft)" htmlFor="widthFt" required error={errors.widthFt}>
                  <Input id="widthFt" type="number" min={0} step="0.5" value={form.widthFt} onChange={(e) => update('widthFt', e.target.value)} />
                </FormField>
                <FormField label="Thickness (in)" htmlFor="thicknessIn" hint="If known — otherwise we'll confirm on site.">
                  <Input id="thicknessIn" type="number" min={0} step="0.5" value={form.thicknessIn} onChange={(e) => update('thicknessIn', e.target.value)} />
                </FormField>
              </div>

              <FormField label="Existing Concrete Removal Needed?">
                <PillGroup
                  name="removalNeeded"
                  value={form.removalNeeded}
                  onChange={(v) => update('removalNeeded', v)}
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                />
              </FormField>

              <FormField label="Desired Finish" htmlFor="desiredFinish" hint="e.g. broom finish, stamped, colored, exposed aggregate">
                <Input id="desiredFinish" value={form.desiredFinish} onChange={(e) => update('desiredFinish', e.target.value)} />
              </FormField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Desired Start Date" htmlFor="desiredStartDate">
                  <Input id="desiredStartDate" type="date" value={form.desiredStartDate} onChange={(e) => update('desiredStartDate', e.target.value)} />
                </FormField>
                <FormField label="Budget Range" htmlFor="budgetRange">
                  <Select id="budgetRange" value={form.budgetRange} onChange={(e) => update('budgetRange', e.target.value)}>
                    <option value="">Select a range…</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField label="Project Description" htmlFor="description" required error={errors.description} hint="Tell us about the project, any special requirements, and site access notes.">
                <Textarea id="description" value={form.description} onChange={(e) => update('description', e.target.value)} />
              </FormField>
            </div>
          </div>

          <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
            <SectionHeading title="Photos &amp; Documents" description="Optional, but helpful — site photos, sketches, or plans." />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Photo Uploads" htmlFor="photos" hint={photoNames.length ? `${photoNames.length} file(s) selected` : 'JPG, PNG — multiple allowed'}>
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setPhotoNames(fileNames(e.target.files))}
                  className="block w-full text-sm text-concrete-600 file:mr-3 file:rounded-md file:border-0 file:bg-steel-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-steel-700"
                />
              </FormField>
              <FormField label="Plan / Document Uploads" htmlFor="documents" hint={documentNames.length ? `${documentNames.length} file(s) selected` : 'PDF, DOC, plans — multiple allowed'}>
                <input
                  id="documents"
                  type="file"
                  multiple
                  onChange={(e) => setDocumentNames(fileNames(e.target.files))}
                  className="block w-full text-sm text-concrete-600 file:mr-3 file:rounded-md file:border-0 file:bg-steel-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-steel-700"
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
            <SectionHeading title="Preferred Contact Method" />
            <FormField label="How should we reach you?" required error={errors.preferredContact}>
              <PillGroup
                name="preferredContact"
                value={form.preferredContact}
                onChange={(v) => update('preferredContact', v)}
                options={[
                  { label: 'Phone', value: 'phone' },
                  { label: 'Email', value: 'email' },
                  { label: 'Text', value: 'text' },
                ]}
              />
            </FormField>
          </div>

          <div className="flex flex-col items-start gap-3">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Estimate Request'}
            </Button>
            <p className="text-xs text-concrete-500">
              By submitting, you agree to be contacted by {BRAND.dbaName} about your project. See our{' '}
              <Link to="/privacy" className="font-semibold text-steel-700 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
