import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable, type Column } from '@/components/ui/Table';
import { FormField, Input, Select, Textarea } from '@/components/ui/Field';
import { BRAND, type BrandConfig } from '@/config/brand';
import { DEFAULT_PRICING_RULES, type PricingRules } from '@/config/pricing';
import { DEFAULT_TOUGHTRACK_STAGES } from '@/config/stages';
import { demoAddOnCatalog } from '@/data/demoData';
import { PRELIMINARY_ESTIMATE_DISCLAIMER } from '@/lib/aiConcierge';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { AddOnCatalogItem, UserRole } from '@/types/domain';

type TabKey = 'business' | 'pricing' | 'stages' | 'addons' | 'ai' | 'users';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'business', label: 'Business Info' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'stages', label: 'ToughTrack Stages' },
  { key: 'addons', label: 'Add-On Catalog' },
  { key: 'ai', label: 'AI Concierge' },
  { key: 'users', label: 'Team & Roles' },
];

function SavedNote({ show }: { show: boolean }) {
  if (!show) return null;
  return <p className="text-xs font-medium text-emerald-700">Saved (demo mode — changes are not persisted after reload).</p>;
}

export default function SettingsPage() {
  const { tab } = useParams<{ tab?: string }>();
  const activeTab: TabKey = (TABS.find((t) => t.key === tab)?.key ?? 'business') as TabKey;

  return (
    <div>
      <PageHeader title="Settings" description="Business configuration, pricing rules, and platform preferences." />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-concrete-200 pb-3">
        {TABS.map((t) => (
          <Link
            key={t.key}
            to={`/admin/settings/${t.key}`}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
              activeTab === t.key ? 'bg-concrete-900 text-white' : 'text-concrete-600 hover:bg-concrete-100',
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {activeTab === 'business' && <BusinessTab />}
      {activeTab === 'pricing' && <PricingTab />}
      {activeTab === 'stages' && <StagesTab />}
      {activeTab === 'addons' && <AddOnsTab />}
      {activeTab === 'ai' && <AiTab />}
      {activeTab === 'users' && <UsersTab />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Business Info
// ---------------------------------------------------------------------------

function BusinessTab() {
  const [form, setForm] = useState({
    legalName: BRAND.legalName,
    dbaName: BRAND.dbaName,
    phoneDisplay: BRAND.phoneDisplay,
    email: BRAND.email,
    street: BRAND.address.street,
    city: BRAND.address.city,
    state: BRAND.address.state,
    zip: BRAND.address.zip,
    licenseNumber: BRAND.license.number,
    licenseState: BRAND.license.state,
    generalLiability: BRAND.insurance.generalLiability,
    workersComp: BRAND.insurance.workersComp,
    facebook: BRAND.social.facebook ?? '',
    instagram: BRAND.social.instagram ?? '',
    google: BRAND.social.google ?? '',
  });
  const [hours, setHours] = useState<BrandConfig['hours']>(BRAND.hours);
  const [areas, setAreas] = useState(BRAND.serviceAreas.map((a) => `${a.name}, ${a.state}`));
  const [newArea, setNewArea] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Real flow: UPSERT INTO business_settings (...) in Supabase.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Legal Name" htmlFor="b-legal">
            <Input id="b-legal" value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} />
          </FormField>
          <FormField label="DBA Name" htmlFor="b-dba">
            <Input id="b-dba" value={form.dbaName} onChange={(e) => setForm({ ...form, dbaName: e.target.value })} />
          </FormField>
          <FormField label="Phone" htmlFor="b-phone">
            <Input id="b-phone" value={form.phoneDisplay} onChange={(e) => setForm({ ...form, phoneDisplay: e.target.value })} />
          </FormField>
          <FormField label="Email" htmlFor="b-email">
            <Input id="b-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Street Address" htmlFor="b-street">
            <Input id="b-street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="City" htmlFor="b-city">
              <Input id="b-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </FormField>
            <FormField label="State" htmlFor="b-state">
              <Input id="b-state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </FormField>
            <FormField label="Zip" htmlFor="b-zip">
              <Input id="b-zip" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
            </FormField>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {hours.map((h, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Input
                value={h.day}
                onChange={(e) => setHours((prev) => prev.map((row, ri) => (ri === i ? { ...row, day: e.target.value } : row)))}
              />
              <Input
                value={h.hours}
                onChange={(e) => setHours((prev) => prev.map((row, ri) => (ri === i ? { ...row, hours: e.target.value } : row)))}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {areas.map((a, i) => (
              <span key={a} className="flex items-center gap-1.5 rounded-full bg-concrete-100 px-3 py-1.5 text-xs font-semibold text-concrete-700">
                {a}
                <button
                  type="button"
                  aria-label={`Remove ${a}`}
                  className="text-concrete-400 hover:text-red-600"
                  onClick={() => setAreas((prev) => prev.filter((_, ai) => ai !== i))}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="e.g. Pelham, AL" value={newArea} onChange={(e) => setNewArea(e.target.value)} className="max-w-xs" />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!newArea.trim()) return;
                setAreas((prev) => [...prev, newArea.trim()]);
                setNewArea('');
              }}
            >
              Add
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>License & Insurance</CardTitle>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="License Number" htmlFor="b-license">
            <Input id="b-license" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
          </FormField>
          <FormField label="License State" htmlFor="b-license-state">
            <Input id="b-license-state" value={form.licenseState} onChange={(e) => setForm({ ...form, licenseState: e.target.value })} />
          </FormField>
          <FormField label="General Liability Coverage" htmlFor="b-gl">
            <Input id="b-gl" value={form.generalLiability} onChange={(e) => setForm({ ...form, generalLiability: e.target.value })} />
          </FormField>
          <FormField label="Workers' Comp Coverage" htmlFor="b-wc">
            <Input id="b-wc" value={form.workersComp} onChange={(e) => setForm({ ...form, workersComp: e.target.value })} />
          </FormField>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Facebook" htmlFor="b-fb">
            <Input id="b-fb" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          </FormField>
          <FormField label="Instagram" htmlFor="b-ig">
            <Input id="b-ig" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </FormField>
          <FormField label="Google Business Profile" htmlFor="b-g">
            <Input id="b-g" value={form.google} onChange={(e) => setForm({ ...form, google: e.target.value })} />
          </FormField>
        </CardBody>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save Changes (Demo Mode)</Button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

const PRICING_GROUPS: { title: string; fields: { key: keyof PricingRules; label: string; unit: string }[] }[] = [
  {
    title: 'Concrete & Materials',
    fields: [
      { key: 'concreteCostPerCubicYard', label: 'Concrete Cost', unit: '$ / cubic yard' },
      { key: 'gravelBaseCostPerSqFt', label: 'Gravel Base Cost', unit: '$ / sq ft' },
      { key: 'rebarCostPerSqFt', label: 'Rebar Reinforcement', unit: '$ / sq ft' },
      { key: 'wireMeshCostPerSqFt', label: 'Wire Mesh Reinforcement', unit: '$ / sq ft' },
      { key: 'fiberCostPerCubicYard', label: 'Fiber Mesh', unit: '$ / cubic yard' },
      { key: 'formsCostPerLinearFt', label: 'Forms', unit: '$ / linear ft' },
    ],
  },
  {
    title: 'Labor & Finishing',
    fields: [
      { key: 'laborCostPerSqFt', label: 'Base Labor', unit: '$ / sq ft' },
      { key: 'excavationCostPerSqFt', label: 'Excavation', unit: '$ / sq ft' },
      { key: 'demolitionCostPerSqFt', label: 'Demolition / Removal', unit: '$ / sq ft' },
      { key: 'finishingCostPerSqFt', label: 'Finishing', unit: '$ / sq ft' },
      { key: 'sealerCostPerSqFt', label: 'Sealer Application', unit: '$ / sq ft' },
      { key: 'stampingCostPerSqFt', label: 'Stamped Pattern', unit: '$ / sq ft' },
      { key: 'coloringCostPerSqFt', label: 'Integral Coloring', unit: '$ / sq ft' },
    ],
  },
  {
    title: 'Fees & Allowances',
    fields: [
      { key: 'pumpFeeFlat', label: 'Concrete Pump Fee', unit: 'flat $' },
      { key: 'equipmentFeeFlat', label: 'Equipment Fee', unit: 'flat $' },
      { key: 'haulingCostPerCubicYard', label: 'Hauling', unit: '$ / cubic yard' },
      { key: 'disposalCostPerSqFt', label: 'Disposal', unit: '$ / sq ft' },
      { key: 'travelFeeFlat', label: 'Travel Fee', unit: 'flat $' },
      { key: 'permitAllowanceFlat', label: 'Permit Allowance', unit: 'flat $' },
    ],
  },
  {
    title: 'Markup, Waste & Tax',
    fields: [
      { key: 'wastePercentDefault', label: 'Default Waste', unit: '%' },
      { key: 'markupPercentDefault', label: 'Default Markup', unit: '%' },
      { key: 'salesTaxPercent', label: 'Sales Tax', unit: '%' },
    ],
  },
  {
    title: 'Minimum Charge',
    fields: [{ key: 'minimumProjectCharge', label: 'Minimum Project Charge', unit: 'flat $' }],
  },
  {
    title: 'Estimate & Deposit Terms',
    fields: [
      { key: 'estimateValidDays', label: 'Estimate Valid For', unit: 'days' },
      { key: 'depositPercent', label: 'Deposit Required', unit: '%' },
    ],
  },
];

function PricingTab() {
  const [rules, setRules] = useState<PricingRules>(DEFAULT_PRICING_RULES);
  const [saved, setSaved] = useState(false);

  function setField(key: keyof PricingRules, value: string) {
    setRules((prev) => ({ ...prev, [key]: Number(value) }));
  }

  function handleSave() {
    // Real flow: UPSERT INTO pricing_rules (...) in Supabase. The AI Concierge and
    // Estimate Builder both read from this single source of truth.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      {PRICING_GROUPS.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.fields.map((f) => (
              <FormField key={f.key} label={f.label} htmlFor={`p-${f.key}`} hint={f.unit}>
                <Input
                  id={`p-${f.key}`}
                  type="number"
                  step="0.01"
                  value={rules[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              </FormField>
            ))}
          </CardBody>
        </Card>
      ))}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save Changes (Demo Mode)</Button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ToughTrack Stages
// ---------------------------------------------------------------------------

function StagesTab() {
  const [weights, setWeights] = useState<Record<string, number>>(
    Object.fromEntries(DEFAULT_TOUGHTRACK_STAGES.map((s) => [s.key, s.weight])),
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Real flow: UPSERT INTO stage_templates (...) in Supabase. Existing jobs keep the
    // stage progress they already have — this only changes the template new jobs inherit.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-concrete-600">
        This is the default ToughTrack™ stage template every new job inherits at creation. Stage templates can be
        further customized per-job from within a job's ToughTrack setup — editing here only changes the default.
      </p>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-concrete-200 bg-concrete-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-concrete-500">Stage</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-concrete-500">Description</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-concrete-500">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-100">
              {DEFAULT_TOUGHTRACK_STAGES.map((s) => (
                <tr key={s.key}>
                  <td className="px-4 py-3 font-semibold text-concrete-900">{s.label}</td>
                  <td className="px-4 py-3 text-concrete-600">{s.description}</td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="0"
                      className="w-20"
                      value={weights[s.key]}
                      onChange={(e) => setWeights((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save Changes (Demo Mode)</Button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add-On Catalog
// ---------------------------------------------------------------------------

const BLANK_ADDON = {
  name: '',
  description: '',
  price_low: '',
  price_high: '',
  applicable_service_types: '',
  active: true,
};

function AddOnsTab() {
  const [items, setItems] = useState<AddOnCatalogItem[]>(demoAddOnCatalog);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(BLANK_ADDON);

  function toggleActive(id: string) {
    // Real flow: UPDATE addon_catalog SET active = ... WHERE id = ... in Supabase.
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    // Real flow: INSERT INTO addon_catalog (...) VALUES (...) in Supabase.
    const item: AddOnCatalogItem = {
      id: `addon-manual-${Date.now()}`,
      name: form.name,
      description: form.description,
      image_url: '',
      price_low: form.price_low ? Number(form.price_low) : null,
      price_high: form.price_high ? Number(form.price_high) : null,
      applicable_service_types: form.applicable_service_types
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      active: form.active,
    };
    setItems((prev) => [item, ...prev]);
    setForm(BLANK_ADDON);
    setNewOpen(false);
  }

  const columns: Column<AddOnCatalogItem>[] = [
    { header: 'Name', cell: (i) => <span className="font-semibold text-concrete-900">{i.name}</span> },
    { header: 'Description', cell: (i) => <span className="line-clamp-1 max-w-xs text-concrete-600">{i.description}</span>, hideOnMobile: true },
    {
      header: 'Price Range',
      cell: (i) =>
        i.price_low || i.price_high
          ? `${i.price_low ? formatCurrency(i.price_low) : '?'} – ${i.price_high ? formatCurrency(i.price_high) : '?'}`
          : 'Quote on request',
    },
    { header: 'Service Types', cell: (i) => i.applicable_service_types.join(', '), hideOnMobile: true },
    {
      header: 'Active',
      cell: (i) => (
        <button
          type="button"
          onClick={() => toggleActive(i.id)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors',
            i.active ? 'bg-emerald-100 text-emerald-700' : 'bg-concrete-100 text-concrete-500',
          )}
        >
          {i.active ? 'Active' : 'Inactive'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setNewOpen(true)}>+ Add Catalog Item</Button>
      </div>
      <DataTable columns={columns} rows={items} rowKey={(i) => i.id} emptyMessage="No add-on catalog items yet." />

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New Catalog Item"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save Item</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Name" htmlFor="ao-name" required>
            <Input id="ao-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Description" htmlFor="ao-desc">
            <Textarea id="ao-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price Low" htmlFor="ao-low">
              <Input id="ao-low" type="number" min="0" value={form.price_low} onChange={(e) => setForm({ ...form, price_low: e.target.value })} />
            </FormField>
            <FormField label="Price High" htmlFor="ao-high">
              <Input id="ao-high" type="number" min="0" value={form.price_high} onChange={(e) => setForm({ ...form, price_high: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Applicable Service Types" htmlFor="ao-types" hint="Comma-separated, e.g. driveway, patio">
            <Input id="ao-types" value={form.applicable_service_types} onChange={(e) => setForm({ ...form, applicable_service_types: e.target.value })} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AI Concierge
// ---------------------------------------------------------------------------

function AiTab() {
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Real flow: UPSERT INTO ai_concierge_settings (enabled) in Supabase.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Concierge Rules & Guardrails</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3 text-sm text-concrete-700">
          <p>
            The AI Concierge only uses the numbers configured on the <strong>Pricing</strong> tab and the
            <code> requiresSiteInspection</code> flags on each service type. It never invents a price.
          </p>
          <p>
            If a project type requires a site inspection, involves commercial specification work, or describes
            complex access/grading conditions, the Concierge routes the customer to "Site Inspection Required"
            instead of guessing at a number.
          </p>
          <p>
            Every preliminary number the Concierge produces is labeled <strong>"Preliminary Estimate"</strong> and
            carries this exact disclaimer:
          </p>
          <blockquote className="rounded-lg border border-concrete-200 bg-concrete-50 p-4 text-xs italic text-concrete-600">
            {PRELIMINARY_ESTIMATE_DISCLAIMER}
          </blockquote>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Public Site Availability</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-concrete-200 p-4">
            <div>
              <p className="font-semibold text-concrete-900">AI Concierge Enabled on Public Site</p>
              <p className="text-xs text-concrete-500">When off, visitors are routed straight to "Request an Estimate".</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled((v) => !v)}
              className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', enabled ? 'bg-emerald-500' : 'bg-concrete-300')}
            >
              <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform', enabled ? 'translate-x-6' : 'translate-x-1')} />
            </button>
          </div>
          <p className="text-xs text-concrete-500">
            The optional server-side free-form chat mode requires an <code>ANTHROPIC_API_KEY</code> environment
            variable configured in Netlify. It is not configured by default in this environment — without it, the
            Concierge falls back to the guided/rules-based flow shown above.
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Save Changes (Demo Mode)</Button>
            <SavedNote show={saved} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Team & Roles
// ---------------------------------------------------------------------------

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const DEMO_TEAM: TeamMember[] = [
  { id: 'profile-owner-1', name: 'Jorge Garcia', email: 'owner@toughconcreteconstruction.com', role: 'owner_admin' },
  { id: 'profile-office-1', name: 'Renee Ashford', email: 'renee@toughconcreteconstruction.com', role: 'office_staff' },
  { id: 'profile-crew-1', name: 'Danny Ortega', email: 'danny@toughconcreteconstruction.com', role: 'field_crew' },
];

const ROLE_TONE: Record<UserRole, BadgeTone> = {
  owner_admin: 'dark',
  office_staff: 'info',
  field_crew: 'success',
  customer: 'neutral',
  contractor: 'neutral',
};

const ROLE_LABEL: Record<UserRole, string> = {
  owner_admin: 'Owner / Admin',
  office_staff: 'Office Staff',
  field_crew: 'Field Crew',
  customer: 'Customer',
  contractor: 'Contractor',
};

const ROLE_EXPLANATION: { role: UserRole; access: string }[] = [
  { role: 'owner_admin', access: 'Full access to everything — CRM, estimating, scheduling, contracts, invoicing, contractors, and owner-level Settings.' },
  { role: 'office_staff', access: 'CRM, estimates, contracts, invoicing, and scheduling. Cannot change business/pricing Settings or team roles.' },
  { role: 'field_crew', access: "Limited to their own assigned jobs' daily logs, photo uploads, and today's ETA/status updates." },
];

const BLANK_INVITE = { email: '', role: 'office_staff' as UserRole };

function UsersTab() {
  const [team, setTeam] = useState<TeamMember[]>(DEMO_TEAM);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState(BLANK_INVITE);
  const [inviteSent, setInviteSent] = useState(false);

  function handleInvite() {
    if (!invite.email.trim()) return;
    // Real flow: send an invite email + INSERT INTO profiles (..., role) once accepted,
    // in Supabase.
    setTeam((prev) => [...prev, { id: `pending-${Date.now()}`, name: invite.email, email: invite.email, role: invite.role }]);
    setInviteSent(true);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {team.map((m) => (
            <div key={m.id} className="flex flex-col gap-1 rounded-lg border border-concrete-200 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-concrete-900">{m.name}</p>
                <p className="text-xs text-concrete-500">{m.email}</p>
              </div>
              <Badge tone={ROLE_TONE[m.role]}>{ROLE_LABEL[m.role]}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Each Role Can Access</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {ROLE_EXPLANATION.map((r) => (
            <div key={r.role} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
              <Badge tone={ROLE_TONE[r.role]} className="shrink-0">
                {ROLE_LABEL[r.role]}
              </Badge>
              <p className="text-sm text-concrete-600">{r.access}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setInviteOpen(true)}>+ Invite Team Member</Button>
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => {
          setInviteOpen(false);
          setInvite(BLANK_INVITE);
          setInviteSent(false);
        }}
        title="Invite Team Member"
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
          <FormField label="Email" htmlFor="team-email" required>
            <Input id="team-email" type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
          </FormField>
          <FormField label="Role" htmlFor="team-role">
            <Select id="team-role" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value as UserRole })}>
              <option value="owner_admin">Owner / Admin</option>
              <option value="office_staff">Office Staff</option>
              <option value="field_crew">Field Crew</option>
            </Select>
          </FormField>
          {inviteSent && <p className="text-xs font-medium text-emerald-700">Invite sent (demo mode) — a real invite email would be sent.</p>}
        </div>
      </Modal>
    </div>
  );
}
