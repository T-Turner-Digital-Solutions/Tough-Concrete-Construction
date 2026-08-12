import { demoPhotos, jobReyesId } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CustomerPhotosPage() {
  // Row Level Security simulation: scope to this customer's job, and — just as
  // important — never surface `visibility === 'internal'` photos (crew-only
  // documentation such as QA/QC shots) to the customer-facing portal. In
  // production this same filter is enforced server-side by RLS policies.
  const visiblePhotos = demoPhotos.filter((p) => p.job_id === jobReyesId && p.visibility !== 'internal');

  const sorted = [...visiblePhotos].sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime());
  const mostRecentDate = sorted[0]?.taken_at.slice(0, 10);
  const todaysPhotos = sorted.filter((p) => p.taken_at.slice(0, 10) === mostRecentDate);
  const olderPhotos = sorted.filter((p) => p.taken_at.slice(0, 10) !== mostRecentDate);

  return (
    <div>
      <PageHeader title="Project Photos" description="Progress photos your crew has shared from the job site." />

      {sorted.length === 0 ? (
        <EmptyState
          title="No photos yet"
          description="Your crew hasn't posted any project photos yet — check back once work is underway."
        />
      ) : (
        <div className="space-y-6">
          {todaysPhotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Photos</CardTitle>
                <span className="text-sm text-concrete-500">{formatDate(mostRecentDate!)}</span>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {todaysPhotos.map((p) => (
                    <PhotoTile key={p.id} id={p.id} url={p.url || undefined} category={p.category} caption={p.caption} />
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {olderPhotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Project Photos</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {olderPhotos.map((p) => (
                    <div key={p.id}>
                      <PhotoTile id={p.id} url={p.url || undefined} category={p.category} caption={p.caption} />
                      <p className="mt-1 text-center text-xs text-concrete-400">{formatDate(p.taken_at)}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
