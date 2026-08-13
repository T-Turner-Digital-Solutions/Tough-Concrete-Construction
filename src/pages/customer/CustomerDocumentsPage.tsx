import { demoDocuments, jobReyesId } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CustomerDocumentsPage() {
  // Row Level Security simulation: scope to this customer's job, and never
  // surface `visibility === 'internal'` documents (e.g. internal site plats)
  // to the customer-facing portal — only documents explicitly marked for
  // the customer are shown here.
  const myDocuments = demoDocuments.filter((d) => d.job_id === jobReyesId && d.visibility === 'customer');

  return (
    <div>
      <PageHeader title="Documents" description="Contracts, permits, and other files shared with you for this project." />

      {myDocuments.length === 0 ? (
        <EmptyState title="No documents yet" description="Documents shared by your project team will appear here." />
      ) : (
        <Card className="divide-y divide-concrete-100">
          {myDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-concrete-900">{doc.name}</p>
                <p className="text-xs text-concrete-500">Uploaded {formatDate(doc.uploaded_at)}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={!doc.url}
                title={!doc.url ? 'Demo document — file storage not yet configured' : undefined}
              >
                View
              </Button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
