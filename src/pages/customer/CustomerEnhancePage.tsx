import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';
import { demoAddOnCatalog, demoJobs, jobReyesId } from '@/data/demoData';
import type { AddOnCatalogItem } from '@/types/domain';

const JOB_ID = jobReyesId;

function priceRangeLabel(item: AddOnCatalogItem): string {
  if (item.price_low && item.price_high) return `${formatCurrency(item.price_low)} – ${formatCurrency(item.price_high)}`;
  if (item.price_low) return `Starting around ${formatCurrency(item.price_low)}`;
  return 'Priced after review';
}

export default function CustomerEnhancePage() {
  const job = demoJobs.find((j) => j.id === JOB_ID);
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const applicable = demoAddOnCatalog.filter((a) => !job || a.applicable_service_types.length === 0 || a.applicable_service_types.includes(job.job_type));

  function requestPrice(id: string) {
    setRequested((prev) => new Set(prev).add(id));
    // Demo mode: this would insert into `addon_requests` (status 'requested'),
    // notify the office, and appear on the admin Job → Change Orders pipeline
    // once priced and converted.
  }

  return (
    <div>
      <PageHeader
        title="Enhance Your Project"
        description={job ? `Optional additions available for ${job.job_number} — ${job.job_type.replace('_', ' ')}` : 'Optional project additions'}
      />

      <Card className="mb-6 border-steel-200 bg-steel-50">
        <CardBody className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-steel-800">Not sure what something would cost?</p>
            <p className="text-sm text-steel-700">Ask the Tough Concrete AI Concierge — it already knows about your active project.</p>
          </div>
          <ButtonLink to="/portal/ai-concierge" variant="steel" size="sm">
            Ask AI For Pricing
          </ButtonLink>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {applicable.map((item) => (
          <Card key={item.id} className="flex flex-col overflow-hidden">
            <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-concrete-700 to-concrete-900">
              <span className="rounded bg-black/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">{item.name}</span>
            </div>
            <CardBody className="flex flex-1 flex-col">
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-concrete-900">{item.name}</h3>
              <p className="mt-1 flex-1 text-sm text-concrete-600">{item.description}</p>
              <p className="mt-3 text-sm font-semibold text-steel-700">{priceRangeLabel(item)}</p>
              <p className="text-[11px] text-concrete-400">Preliminary range — final pricing confirmed after review.</p>
              <div className="mt-4 flex flex-col gap-2">
                {requested.has(item.id) ? (
                  <Badge tone="success" className="justify-center py-2">
                    Request Sent ✓
                  </Badge>
                ) : (
                  <Button size="sm" onClick={() => requestPrice(item.id)}>
                    Get My Price
                  </Button>
                )}
                <ButtonLink to="/portal/ai-concierge" size="sm" variant="outline">
                  Ask AI for Pricing
                </ButtonLink>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-xs text-concrete-500">
        Requesting a price sends this addition to our office for review. Once priced, we'll send you an official{' '}
        <Link to="/portal/change-orders" className="font-semibold text-steel-700 hover:text-steel-800">
          Change Order
        </Link>{' '}
        to review and approve before any work begins or your contract total changes.
      </p>
    </div>
  );
}
