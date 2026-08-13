import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { formatDate, formatDateTime, formatTime, timeAgo } from '@/lib/format';
import { DEFAULT_TOUGHTRACK_STAGES } from '@/config/stages';
import { calculateOverallProgress, getCompletedStages, getCurrentStage, getUpcomingStages, type JobStageProgress } from '@/lib/toughtrack';
import {
  demoJobs,
  jobReyesId,
  demoJobStageProgress,
  demoEtaStatus,
  demoDailyLogs,
  demoPhotos,
  demoMessages,
  demoWeatherDelays,
} from '@/data/demoData';
import type { CrewStatus, JobStageProgressRecord } from '@/types/domain';

// The logged-in demo customer's active job. In production this resolves via
// profiles.id -> customers.profile_id -> jobs.customer_id, scoped further by
// Row Level Security so a customer can never query another job.
const JOB_ID = jobReyesId;

const CREW_STATUS_COPY: Record<CrewStatus, { headline: string; tone: 'neutral' | 'info' | 'warning' | 'success' | 'danger' }> = {
  not_started: { headline: 'Crew Not Yet Dispatched', tone: 'neutral' },
  on_my_way: { headline: 'Your Crew Is On The Way', tone: 'info' },
  arrived: { headline: 'Tough Concrete Has Arrived', tone: 'success' },
  in_progress: { headline: 'Work In Progress', tone: 'success' },
  paused: { headline: 'Work Paused', tone: 'warning' },
  delayed: { headline: 'Schedule Delayed', tone: 'danger' },
  complete_today: { headline: "Today's Work Is Complete", tone: 'success' },
};

function toEngine(records: JobStageProgressRecord[]): JobStageProgress[] {
  return records.map((r) => ({
    key: r.stage_key,
    label: r.label,
    status: r.status,
    percentWithinStage: r.percent_within_stage,
    startedAt: r.started_at ?? undefined,
    completedAt: r.completed_at ?? undefined,
  }));
}

export default function CustomerProjectPage() {
  const job = demoJobs.find((j) => j.id === JOB_ID);
  const stageRecords = demoJobStageProgress[JOB_ID] ?? [];
  const engineProgress = toEngine(stageRecords);
  const eta = demoEtaStatus[JOB_ID];
  const logs = demoDailyLogs.filter((l) => l.job_id === JOB_ID && l.published).sort((a, b) => b.log_date.localeCompare(a.log_date));
  const todayLog = logs[0];
  const photos = demoPhotos.filter((p) => p.job_id === JOB_ID && p.visibility !== 'internal');
  const weatherDelay = demoWeatherDelays.find((w) => w.job_id === JOB_ID && w.active);

  if (!job) {
    return <EmptyState title="No active project" description="Your project will appear here once it's scheduled." />;
  }

  const overallPercent = calculateOverallProgress(DEFAULT_TOUGHTRACK_STAGES, engineProgress);
  const currentStage = getCurrentStage(DEFAULT_TOUGHTRACK_STAGES, engineProgress);
  const completedStages = getCompletedStages(DEFAULT_TOUGHTRACK_STAGES, engineProgress);
  const upcomingStages = getUpcomingStages(DEFAULT_TOUGHTRACK_STAGES, engineProgress);
  const crewCopy = eta ? CREW_STATUS_COPY[eta.crew_status] : null;

  const todaysPhotos = photos.filter((p) => todayLog && p.taken_at.slice(0, 10) === todayLog.log_date);

  const activity = [
    ...logs.map((l) => ({ ts: l.created_at, text: l.customer_notes ?? l.work_completed })),
    ...photos.map((p) => ({ ts: p.taken_at, text: `Photo added: ${p.caption ?? p.category}` })),
    ...demoMessages.filter((m) => m.job_id === JOB_ID).map((m) => ({ ts: m.created_at, text: 'New message from the office' })),
  ]
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 8);

  return (
    <div>
      <PageHeader title="ToughTrack™" description={`${job.job_number} · ${job.address.street}, ${job.address.city}, ${job.address.state}`} />

      {weatherDelay && (
        <div className="mb-6 rounded-lg border border-safety-300 bg-safety-50 p-4 text-sm text-safety-800">
          <p className="font-bold uppercase tracking-wide">Weather Delay</p>
          <p className="mt-1">{weatherDelay.customer_message}</p>
          {weatherDelay.new_expected_date && <p className="mt-1 text-xs">Updated expected date: {formatDate(weatherDelay.new_expected_date)}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-concrete-500">Overall Progress</p>
                <p className="font-display text-4xl font-bold text-concrete-900">{overallPercent}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-concrete-500">Current Stage</p>
                <p className="font-display text-lg font-bold text-steel-700">{currentStage?.label ?? '—'}</p>
              </div>
            </div>
            <ProgressBar value={overallPercent} className="mt-4" tone="success" />
            {job.estimated_completion_date && (
              <p className="mt-2 text-xs text-concrete-500">Estimated completion: {formatDate(job.estimated_completion_date)}</p>
            )}

            <StageTimeline stages={DEFAULT_TOUGHTRACK_STAGES} progress={engineProgress} />
          </CardBody>
        </Card>

        <Card className={cn('border-2', crewCopy?.tone === 'success' && 'border-emerald-300', crewCopy?.tone === 'info' && 'border-steel-300')}>
          <CardHeader>
            <CardTitle>Today's Visit</CardTitle>
          </CardHeader>
          <CardBody>
            {crewCopy ? (
              <>
                <Badge tone={crewCopy.tone} className="mb-2">
                  {crewCopy.headline}
                </Badge>
                {eta?.eta_window_start && eta?.eta_window_end && (
                  <p className="text-sm text-concrete-700">
                    <span className="font-semibold">Estimated Arrival:</span> {formatTime(eta.eta_window_start)} – {formatTime(eta.eta_window_end)}
                  </p>
                )}
                {eta?.todays_scope && (
                  <p className="mt-2 text-sm text-concrete-700">
                    <span className="font-semibold">Today's Work:</span> {eta.todays_scope}
                  </p>
                )}
                {eta?.estimated_hours_on_site && (
                  <p className="mt-2 text-sm text-concrete-700">
                    <span className="font-semibold">Expected Time On Site:</span> Approximately {eta.estimated_hours_on_site} hours
                  </p>
                )}
                {eta?.tomorrow_expected_arrival && (
                  <p className="mt-3 border-t border-concrete-100 pt-3 text-xs text-concrete-500">
                    Tomorrow's expected arrival: {eta.tomorrow_expected_arrival}
                  </p>
                )}
              </>
            ) : (
              <EmptyState title="No visit scheduled today" />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardBody>
            {currentStage ? (
              <>
                <p className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">{currentStage.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-concrete-700">{currentStage.customerCopy.whatHappens}</p>
                <p className="mt-2 text-sm leading-relaxed text-concrete-500">{currentStage.customerCopy.whatToExpect}</p>
              </>
            ) : (
              <EmptyState title="Project complete" description="Thank you for choosing Tough Concrete Construction!" />
            )}

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-concrete-100 pt-4 text-xs">
              <div>
                <p className="mb-1 font-semibold uppercase tracking-wide text-concrete-500">Completed Stages</p>
                <ul className="space-y-1 text-concrete-600">
                  {completedStages.slice(-4).map((s) => (
                    <li key={s.key}>✓ {s.label}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-semibold uppercase tracking-wide text-concrete-500">Upcoming Stages</p>
                <ul className="space-y-1 text-concrete-500">
                  {upcomingStages.slice(0, 4).map((s) => (
                    <li key={s.key}>{s.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardBody>
            {activity.length === 0 ? (
              <EmptyState title="No activity yet" />
            ) : (
              <ul className="space-y-3">
                {activity.map((a, i) => (
                  <li key={i} className="border-b border-concrete-100 pb-3 text-sm last:border-0 last:pb-0">
                    <p className="text-concrete-800">{a.text}</p>
                    <p className="text-xs text-concrete-400">{formatDateTime(a.ts)} · {timeAgo(a.ts)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today's Photos</CardTitle>
          <ButtonLink to="/portal/photos" size="sm" variant="outline">
            View All Project Photos
          </ButtonLink>
        </CardHeader>
        <CardBody>
          {todaysPhotos.length === 0 ? (
            <EmptyState title="No photos posted yet today" />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {todaysPhotos.map((p) => (
                <PhotoTile key={p.id} id={p.id} url={p.url} category={p.category} caption={p.caption} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function StageTimeline({ stages, progress }: { stages: typeof DEFAULT_TOUGHTRACK_STAGES; progress: JobStageProgress[] }) {
  return (
    <div className="mt-6 overflow-x-auto pb-2">
      <div className="flex min-w-[640px] items-center">
        {stages.map((stage, i) => {
          const p = progress.find((pr) => pr.key === stage.key);
          const status = p?.status ?? 'pending';
          return (
            <div key={stage.key} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className={cn('h-0.5 flex-1', i === 0 ? 'bg-transparent' : status === 'pending' ? 'bg-concrete-200' : 'bg-emerald-400')} />
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold',
                    status === 'complete' && 'border-emerald-500 bg-emerald-500 text-white',
                    status === 'in_progress' && 'border-safety-500 bg-safety-500 text-concrete-950 animate-pulse',
                    status === 'pending' && 'border-concrete-300 bg-white text-concrete-400',
                    status === 'skipped' && 'border-concrete-200 bg-concrete-100 text-concrete-300',
                  )}
                >
                  {status === 'complete' ? '✓' : i + 1}
                </div>
                <div className={cn('h-0.5 flex-1', i === stages.length - 1 ? 'bg-transparent' : status === 'complete' ? 'bg-emerald-400' : 'bg-concrete-200')} />
              </div>
              <p className={cn('mt-1.5 max-w-[5.5rem] text-center text-[10px] font-medium leading-tight', status === 'pending' ? 'text-concrete-400' : 'text-concrete-700')}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
