import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Select } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/EmptyState';
import { demoCustomers, demoEstimates } from '@/data/demoData';
import { SERVICE_TYPES, DEFAULT_PRICING_RULES, type ServiceTypeKey } from '@/config/pricing';
import { calculateEstimate, type EstimateOptionalWork } from '@/lib/estimator';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import type { EstimateStatus } from '@/types/domain';

const STATUS_FLOW: EstimateStatus[] = ['draft', 'internal_review', 'sent', 'viewed', 'approved', 'converted'];

export default function EstimateBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const existing = !isNew ? demoEstimates.find((e) => e.id === id) : undefined;
  const notFound = !isNew && !existing;

  // Hooks must run unconditionally on every render; the "not found" guard
  // is rendered below, after every hook has been declared.
  const [customerId, setCustomerId] = useState(existing?.customer_id ?? demoCustomers[0]?.id ?? '');
  const [serviceType, setServiceType] = useState<ServiceTypeKey>((existing?.service_type as ServiceTypeKey) ?? 'driveway');
  const [lengthFt, setLengthFt] = useState(existing?.measurements.lengthFt ?? 30);
  const [widthFt, setWidthFt] = useState(existing?.measurements.widthFt ?? 16);
  const [thicknessIn, setThicknessIn] = useState(existing?.measurements.thicknessIn ?? 4);
  const [wastePercent, setWastePercent] = useState(existing?.measurements.wastePercent ?? DEFAULT_PRICING_RULES.wastePercentDefault);
  const [markupPercent, setMarkupPercent] = useState(existing?.markup_percent ?? DEFAULT_PRICING_RULES.markupPercentDefault);
  const [manualTotal, setManualTotal] = useState<string>('');
  const [status, setStatus] = useState<EstimateStatus>(existing?.status ?? 'draft');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [optional, setOptional] = useState<EstimateOptionalWork>({
    removalNeeded: false,
    reinforcement: 'wire_mesh',
    sealer: false,
    stamped: false,
    colored: false,
    pumpRequired: false,
    permitRequired: false,
  });

  const result = useMemo(
    () =>
      calculateEstimate(
        { lengthFt, widthFt, thicknessIn, wastePercent },
        optional,
        DEFAULT_PRICING_RULES,
        {
          markupPercent,
          manualTotal: manualTotal ? Number(manualTotal) : undefined,
        },
      ),
    [lengthFt, widthFt, thicknessIn, wastePercent, optional, markupPercent, manualTotal],
  );

  const serviceInfo = SERVICE_TYPES.find((s) => s.key === serviceType);

  function saveAs(next: EstimateStatus) {
    setStatus(next);
    setSavedMessage(
      `Estimate ${existing?.estimate_number ?? '(new — number assigned on save)'} set to "${statusLabel(next)}". ` +
        (existing ? '' : 'Demo mode — a real save would insert a new row into the estimates table.'),
    );
  }

  function convertToJob() {
    setSavedMessage(
      'Demo mode: approving this estimate would automatically create a Contract, a Job record, and a Deposit Invoice — ' +
        'carrying over the customer, address, scope, measurements, and pricing without re-entering anything, per the platform’s estimate → contract → job → deposit invoice flow.',
    );
  }

  if (notFound) {
    return (
      <EmptyState
        title="Estimate not found"
        description="This estimate may have been removed."
        action={<Button onClick={() => navigate('/admin/estimates')}>Back to Estimates</Button>}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={existing ? `Estimate ${existing.estimate_number}` : 'New Estimate'}
        description="Concrete estimating calculator — every dollar traces to a configured pricing rule or an explicit manual override."
        actions={<Badge tone={statusTone(status)}>{statusLabel(status)}</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Customer" htmlFor="customer">
                <Select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                  {demoCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Service Type" htmlFor="serviceType">
                <Select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value as ServiceTypeKey)}>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </CardBody>
          </Card>

          {serviceInfo?.requiresSiteInspection && (
            <div className="rounded-lg border border-safety-300 bg-safety-50 p-4 text-sm text-safety-800">
              <p className="font-semibold uppercase tracking-wide">Site Inspection Recommended</p>
              <p className="mt-1">
                {serviceInfo.label} typically requires an on-site review before final pricing. This calculator can still
                produce a working estimate for internal planning — mark it "Internal Review" rather than sending it
                directly to the customer.
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Measurements</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <FormField label="Length (ft)" htmlFor="length">
                <Input id="length" type="number" min={0} value={lengthFt} onChange={(e) => setLengthFt(Number(e.target.value))} />
              </FormField>
              <FormField label="Width (ft)" htmlFor="width">
                <Input id="width" type="number" min={0} value={widthFt} onChange={(e) => setWidthFt(Number(e.target.value))} />
              </FormField>
              <FormField label="Thickness (in)" htmlFor="thickness">
                <Input id="thickness" type="number" min={0} value={thicknessIn} onChange={(e) => setThicknessIn(Number(e.target.value))} />
              </FormField>
              <FormField label="Waste %" htmlFor="waste">
                <Input id="waste" type="number" min={0} value={wastePercent} onChange={(e) => setWastePercent(Number(e.target.value))} />
              </FormField>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scope Options</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm font-medium text-concrete-700">
                <input
                  type="checkbox"
                  checked={optional.removalNeeded}
                  onChange={(e) => setOptional((o) => ({ ...o, removalNeeded: e.target.checked }))}
                />
                Existing concrete removal needed
              </label>
              <FormField label="Reinforcement" htmlFor="reinforcement">
                <Select
                  id="reinforcement"
                  value={optional.reinforcement}
                  onChange={(e) => setOptional((o) => ({ ...o, reinforcement: e.target.value as EstimateOptionalWork['reinforcement'] }))}
                >
                  <option value="none">None</option>
                  <option value="wire_mesh">Wire Mesh</option>
                  <option value="rebar">Rebar</option>
                  <option value="fiber">Fiber</option>
                </Select>
              </FormField>
              {(
                [
                  ['pumpRequired', 'Concrete pump required'],
                  ['permitRequired', 'Permit required'],
                  ['stamped', 'Stamped finish'],
                  ['colored', 'Integral color'],
                  ['sealer', 'Sealer'],
                ] as [keyof EstimateOptionalWork, string][]
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm font-medium text-concrete-700">
                  <input
                    type="checkbox"
                    checked={Boolean(optional[key])}
                    onChange={(e) => setOptional((o) => ({ ...o, [key]: e.target.checked }))}
                  />
                  {label}
                </label>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Markup &amp; Manual Override</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Markup %" htmlFor="markup" hint="Defaults from Settings → Pricing; adjust per job as needed.">
                <Input id="markup" type="number" min={0} value={markupPercent} onChange={(e) => setMarkupPercent(Number(e.target.value))} />
              </FormField>
              <FormField label="Manual Total Override ($)" htmlFor="manualTotal" hint="Leave blank to use the calculated total below.">
                <Input id="manualTotal" type="number" min={0} placeholder="e.g. 12000" value={manualTotal} onChange={(e) => setManualTotal(e.target.value)} />
              </FormField>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Estimate Summary</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-xs text-concrete-500">
                {result.squareFootage.toLocaleString()} sq ft · {result.cubicYardsWithWaste} cubic yards (incl. {wastePercent}% waste)
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-concrete-100 pt-3 text-sm">
                {result.lineItems.map((li) => (
                  <li key={li.key} className="flex justify-between">
                    <span className="text-concrete-600">{li.label}</span>
                    <span className="font-medium text-concrete-800">{formatCurrency(li.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1.5 border-t border-concrete-100 pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-concrete-600">Subtotal</span>
                  <span>{formatCurrency(result.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-concrete-600">Markup ({markupPercent}%)</span>
                  <span>{formatCurrency(result.markupAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-concrete-600">Tax</span>
                  <span>{formatCurrency(result.taxAmount)}</span>
                </div>
              </div>
              {result.minimumChargeApplied && (
                <p className="mt-2 rounded bg-safety-50 px-2 py-1 text-xs font-medium text-safety-800">
                  Minimum project charge applied ({formatCurrency(DEFAULT_PRICING_RULES.minimumProjectCharge)}).
                </p>
              )}
              {manualTotal && (
                <p className="mt-2 rounded bg-steel-50 px-2 py-1 text-xs font-medium text-steel-800">Manual override total in use.</p>
              )}
              <div className="mt-3 flex items-baseline justify-between border-t border-concrete-200 pt-3">
                <span className="font-display text-sm font-bold uppercase tracking-wide text-concrete-500">Total</span>
                <span className="font-display text-2xl font-bold text-concrete-900">{formatCurrency(result.total)}</span>
              </div>
              <p className="mt-1 text-xs text-concrete-500">
                Deposit ({DEFAULT_PRICING_RULES.depositPercent}%): {formatCurrency(result.depositAmount)}
              </p>

              <div className="mt-5 space-y-2 border-t border-concrete-100 pt-4">
                <Button fullWidth variant="outline" onClick={() => saveAs('draft')}>
                  Save Draft
                </Button>
                <Button fullWidth variant="steel" onClick={() => saveAs('internal_review')}>
                  Send for Internal Review
                </Button>
                <Button fullWidth onClick={() => saveAs('sent')}>
                  Send to Customer
                </Button>
                {status === 'approved' && (
                  <Button fullWidth variant="dark" onClick={convertToJob}>
                    Convert to Contract + Job + Deposit Invoice
                  </Button>
                )}
              </div>
              {existing && (
                <p className="mt-3 text-xs text-concrete-400">Valid until {formatDate(existing.valid_until)}</p>
              )}
              {savedMessage && <p className="mt-3 rounded bg-emerald-50 px-2 py-1.5 text-xs font-medium text-emerald-800">{savedMessage}</p>}
            </CardBody>
          </Card>

          <div className="rounded-lg border border-concrete-200 bg-concrete-50 p-4 text-xs text-concrete-500">
            <p className="font-semibold uppercase tracking-wide text-concrete-600">Status Flow</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STATUS_FLOW.map((s) => (
                <Badge key={s} tone={s === status ? statusTone(s) : 'neutral'}>
                  {statusLabel(s)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
