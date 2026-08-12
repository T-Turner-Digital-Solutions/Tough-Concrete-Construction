import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  demoAppointments,
  demoCustomers,
  demoDailyLogs,
  demoInvoices,
  demoJobs,
  demoJobStageProgress,
  demoMessages,
  demoPhotos,
  jobReyesId,
} from '@/data/demoData';
import { DEFAULT_TOUGHTRACK_STAGES } from '@/config/stages';
import { calculateOverallProgress, getCurrentStage, type JobStageProgress } from '@/lib/toughtrack';
import { formatCurrency, formatDate, timeAgo } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

// Demo mode: the logged-in customer is always resolved to 'cust-reyes' here.
// In production this would resolve via profiles.id -> customers.profile_id
// (i.e. `customers.find(c => c.profile_id === profile.id)`).
const CUSTOMER_ID = 'cust-reyes';

interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  kind: 'log' | 'message' | 'photo';
}

export default function CustomerDashboardPage() {
  const { profile } = useAuth();
  const customer = demoCustomers.find((c) => c.id === CUSTOMER_ID);

  // Row Level Security simulation: only this customer's job(s), never anyone else's.
  const job = demoJobs.find((j) => j.customer_id === CUSTOMER_ID && j.id === jobReyesId);

  const stageProgress: JobStageProgress[] = (demoJobStageProgress[jobReyesId] ?? []).map((p) => ({
    key: p.stage_key,
    label: p.label,
    status: p.status,
    percentWithinStage: p.percent_within_stage,
    startedAt: p.started_at ?? undefined,
    completedAt: p.completed_at ?? undefined,
  }));
  const overallProgress = calculateOverallProgress(DEFAULT_TOUGHTRACK_STAGES, stageProgress);
  const currentStage = getCurrentStage(DEFAULT_TOUGHTRACK_STAGES, stageProgress);

  const myInvoices = demoInvoices.filter((inv) => inv.customer_id === CUSTOMER_ID);
  const outstandingBalance = myInvoices.reduce((sum, inv) => sum + (inv.amount - inv.amount_paid), 0);
  const unpaidInvoices = myInvoices.filter((inv) => inv.amount - inv.amount_paid > 0);

  const today = new Date('2026-08-12');
  const nextAppointment = demoAppointments
    .filter((a) => a.customer_id === CUSTOMER_ID && new Date(a.scheduled_date) >= today)
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())[0];

  const myMessages = demoMessages.filter((m) => m.job_id === jobReyesId);
  const unreadMessages = myMessages.filter((m) => m.sender_role !== 'customer' && !m.read_at);

  const myLogs = demoDailyLogs.filter((l) => l.job_id === jobReyesId && l.published);
  const myPhotos = demoPhotos.filter((p) => p.job_id === jobReyesId && p.visibility !== 'internal');

  const activity: ActivityItem[] = [
    ...myLogs.map((l) => ({
      id: l.id,
      timestamp: l.created_at,
      title: `Daily update — ${formatDate(l.log_date)}`,
      description: l.customer_notes ?? l.work_completed,
      kind: 'log' as const,
    })),
    ...myMessages.map((m) => ({
      id: m.id,
      timestamp: m.created_at,
      title: m.sender_role === 'customer' ? 'You sent a message' : 'New message from Tough Concrete',
      description: m.body,
      kind: 'message' as const,
    })),
    ...myPhotos.map((p) => ({
      id: p.id,
      timestamp: p.taken_at,
      title: `Photo added — ${p.category.replace('_', ' ')}`,
      description: p.caption ?? 'New progress photo posted to your project.',
      kind: 'photo' as const,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={customer ? `${customer.billing_address.street}, ${customer.billing_address.city}, ${customer.billing_address.state}` : undefined}
      />

      {unpaidInvoices.length > 0 && (
        <Card className="mb-6 border-safety-300 bg-safety-50">
          <CardBody className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-wide text-concrete-900">
                You have an outstanding balance of {formatCurrency(outstandingBalance)}
              </p>
              <p className="mt-1 text-sm text-concrete-600">
                {unpaidInvoices.length} invoice{unpaidInvoices.length === 1 ? '' : 's'} awaiting payment.
              </p>
            </div>
            <ButtonLink to="/portal/invoices" size="sm">
              View Invoices
            </ButtonLink>
          </CardBody>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Project Status" value={job ? statusLabel(job.status) : '—'} hint={currentStage ? `Current stage: ${currentStage.label}` : undefined} />
        <Stat
          label="Next Appointment"
          value={nextAppointment ? formatDate(nextAppointment.scheduled_date) : 'None scheduled'}
          hint={nextAppointment ? statusLabel(nextAppointment.type) : undefined}
        />
        <Stat
          label="Outstanding Balance"
          value={formatCurrency(outstandingBalance)}
          tone={outstandingBalance > 0 ? 'warning' : 'success'}
        />
        <Stat label="Unread Messages" value={unreadMessages.length} tone={unreadMessages.length > 0 ? 'warning' : 'default'} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Project</CardTitle>
            {job && <Badge tone={statusTone(job.status)}>{statusLabel(job.status)}</Badge>}
          </CardHeader>
          <CardBody>
            {job ? (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold text-concrete-900">{job.job_number}</p>
                    <p className="text-sm text-concrete-500">
                      {job.address.street}, {job.address.city}, {job.address.state} {job.address.zip}
                    </p>
                  </div>
                  <p className="text-sm text-concrete-500">
                    Est. completion {job.estimated_completion_date ? formatDate(job.estimated_completion_date) : 'TBD'}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-concrete-700">{currentStage?.label ?? 'Getting started'}</span>
                    <span className="text-concrete-500">{overallProgress}% complete</span>
                  </div>
                  <ProgressBar value={overallProgress} />
                </div>
                <p className="mt-4 text-sm text-concrete-600">{job.scope}</p>
                <div className="mt-5">
                  <ButtonLink to="/portal/project" variant="dark" size="sm">
                    View ToughTrack™
                  </ButtonLink>
                </div>
              </>
            ) : (
              <EmptyState title="No active project" description="Your project will appear here once your estimate is approved." />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            <Link to="/portal/estimates" className="block rounded-md border border-concrete-200 px-4 py-3 text-sm font-semibold text-concrete-800 hover:bg-concrete-50">
              Estimates
            </Link>
            <Link to="/portal/invoices" className="block rounded-md border border-concrete-200 px-4 py-3 text-sm font-semibold text-concrete-800 hover:bg-concrete-50">
              Invoices &amp; Payments
            </Link>
            <Link to="/portal/appointments" className="block rounded-md border border-concrete-200 px-4 py-3 text-sm font-semibold text-concrete-800 hover:bg-concrete-50">
              Appointments
            </Link>
            <Link to="/portal/messages" className="block rounded-md border border-concrete-200 px-4 py-3 text-sm font-semibold text-concrete-800 hover:bg-concrete-50">
              Messages {unreadMessages.length > 0 && <Badge tone="warning" className="ml-1">{unreadMessages.length} new</Badge>}
            </Link>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardBody>
          {activity.length === 0 ? (
            <EmptyState title="No activity yet" description="Updates, messages, and photos will show up here as your project progresses." />
          ) : (
            <ul className="space-y-4">
              {activity.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex gap-3">
                  <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-safety-500" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="text-sm font-semibold text-concrete-800">{item.title}</p>
                      <p className="text-xs text-concrete-400">{timeAgo(item.timestamp)}</p>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-concrete-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
