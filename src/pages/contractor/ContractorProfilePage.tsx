import { useState, type FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/ui/Field';
import { demoContractors } from '@/data/demoData';
import { EmptyState } from '@/components/ui/EmptyState';

// In production the logged-in profile (useAuth().profile.id === 'profile-contractor-1')
// would resolve to its contractor row via `contractors.profile_id`. Hardcoded here
// since this demo only ever signs in as the one contractor account.
const CONTRACTOR_ID = 'sub-alvarez';

interface EditableProfile {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  service_area: string;
  trade: string;
}

export default function ContractorProfilePage() {
  const contractor = demoContractors.find((c) => c.id === CONTRACTOR_ID);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<EditableProfile | null>(
    contractor
      ? {
          company_name: contractor.company_name,
          contact_name: contractor.contact_name,
          email: contractor.email,
          phone: contractor.phone,
          street: contractor.address.street,
          city: contractor.address.city,
          state: contractor.address.state,
          zip: contractor.address.zip,
          service_area: contractor.service_area.join(', '),
          trade: contractor.trade,
        }
      : null,
  );

  if (!contractor || !form) {
    return <EmptyState title="Contractor profile not found" description="We couldn't load your company profile." />;
  }

  function update<K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Demo mode: this only updates local component state. In production this
    // would PATCH the `contractors` table row keyed by contractor.id.
    setSaved(true);
  }

  return (
    <div>
      <PageHeader title="Company Profile" description="Keep your company information current so our office can reach you about new opportunities." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Company Name" htmlFor="company_name" required>
              <Input id="company_name" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} required />
            </FormField>
            <FormField label="Contact Name" htmlFor="contact_name" required>
              <Input id="contact_name" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} required />
            </FormField>
            <FormField label="Email" htmlFor="email" required>
              <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </FormField>
            <FormField label="Phone" htmlFor="phone" required>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
            </FormField>
            <FormField label="Trade / Specialty" htmlFor="trade" required>
              <Input id="trade" value={form.trade} onChange={(e) => update('trade', e.target.value)} required />
            </FormField>
            <FormField label="Service Area" htmlFor="service_area" hint="Comma-separated list of cities you serve">
              <Input id="service_area" value={form.service_area} onChange={(e) => update('service_area', e.target.value)} />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Address</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Street" htmlFor="street" required>
              <Input id="street" value={form.street} onChange={(e) => update('street', e.target.value)} required />
            </FormField>
            <FormField label="City" htmlFor="city" required>
              <Input id="city" value={form.city} onChange={(e) => update('city', e.target.value)} required />
            </FormField>
            <FormField label="State" htmlFor="state" required>
              <Input id="state" value={form.state} onChange={(e) => update('state', e.target.value)} required />
            </FormField>
            <FormField label="ZIP" htmlFor="zip" required>
              <Input id="zip" value={form.zip} onChange={(e) => update('zip', e.target.value)} required />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-concrete-700">
              <input type="checkbox" checked={contractor.ein_on_file} readOnly className="h-4 w-4 rounded border-concrete-300" />
              EIN on file with our office
            </label>
            <p className="text-xs text-concrete-500">
              Insurance certificate and license status can be managed on the{' '}
              <span className="font-semibold">Documents &amp; Insurance</span> page.
            </p>
          </CardBody>
        </Card>

        {/*
          internal_rating and references_notes are intentionally not rendered anywhere
          on this page — those are admin-internal fields (mirroring Postgres RLS that
          would block a contractor role from selecting those columns) and must never
          be visible to the contractor.
        */}

        <div className="flex items-center gap-3">
          <Button type="submit">Save Changes</Button>
          {saved && <span className="text-sm font-semibold text-emerald-600">Saved (demo mode)</span>}
        </div>
      </form>
    </div>
  );
}
