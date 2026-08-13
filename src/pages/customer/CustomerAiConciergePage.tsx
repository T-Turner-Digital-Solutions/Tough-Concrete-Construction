import { useState } from 'react';
import { AiConciergeChat } from '@/components/ai/AiConciergeChat';
import { demoJobs, jobReyesId } from '@/data/demoData';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';

// Demo mode: hardcoded to the logged-in demo customer's active job.
const job = demoJobs.find((j) => j.id === jobReyesId);
const CONTEXT_LABEL = job ? `${job.job_number} — ${job.job_type[0]!.toUpperCase()}${job.job_type.slice(1)} Replacement` : 'Your Active Project';

export default function CustomerAiConciergePage() {
  const [requestSent, setRequestSent] = useState(false);

  return (
    <div>
      <PageHeader title="Ask Tough Concrete AI" description="Get preliminary pricing on additions to your existing project." />

      <p className="mb-4 max-w-2xl text-sm text-concrete-600">
        Already thinking beyond your current scope? Ask things like <em>&ldquo;I already have you doing my driveway,
        what would a 12x20 patio cost?&rdquo;</em> — the AI Concierge knows about your existing project and can give you a
        preliminary price range for add-ons in seconds. When you find something you like, request it and our office
        will follow up with an official quote.
      </p>

      {requestSent && (
        <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Request sent to Tough Concrete — we&apos;ll follow up with official pricing shortly!
        </div>
      )}

      <Card className="h-[65vh]">
        <CardBody className="h-full">
          <AiConciergeChat
            mode="addon"
            addonContextLabel={CONTEXT_LABEL}
            onRequestAddOn={() => {
              // Demo-only: in production this creates an `add_on_requests` row
              // linked to the job, which office staff can convert into an
              // official change order once priced.
              setRequestSent(true);
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
