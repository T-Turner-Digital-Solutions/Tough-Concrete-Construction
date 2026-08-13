import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, timeAgo } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import {
  demoLeads,
  demoEstimates,
  demoJobs,
  demoAppointments,
  demoChangeOrders,
  demoBids,
  demoInvoices,
  demoPayments,
  demoWeatherDelays,
  demoCustomers,
  demoMessages,
  demoDailyLogs,
} from '@/data/demoData';

const TODAY = '2026-08-12';

function isSameDay(dateStr: string, day: string): boolean {
  return dateStr.slice(0, 10) === day;
}

function isThisMonth(dateStr: string, ref: string): boolean {
  return dateStr.slice(0, 7) === ref.slice(0, 7);
}

export default function AdminDashboardPage() {
  const newLeads = demoLeads.filter((l) => l.status === 'new');
  const estimatesInternalReview = demoEstimates.filter((e) => e.status === 'internal_review');
  const estimatesAwaitingApproval = demoEstimates.filter((e) => e.status === 'sent' || e.status === 'viewed');
  const siteVisitsToday = demoAppointments.filter(
    (a) => isSameDay(a.scheduled_date, TODAY) && ['site_visit', 'estimate', 'site_measurement'].includes(a.type),
  );
  const jobsScheduledToday = demoAppointments.filter((a) => isSameDay(a.scheduled_date, TODAY) && a.job_id);
  const activeJobs = demoJobs.filter((j) => j.status === 'in_progress');
  const upcomingPours = demoAppointments
    .filter((a) => a.type === 'pour' && a.status !== 'cancelled' && a.scheduled_date >= TODAY)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
  const activeWeatherDelays = demoWeatherDelays.filter((w) => w.active);
  const openChangeOrders = demoChangeOrders.filter((c) => c.status === 'draft' || c.status === 'sent');
  const bidsAwaitingReview = demoBids.filter((b) => b.status === 'submitted');
  const unpaidInvoices = demoInvoices.filter((i) => i.status === 'sent' || i.status === 'viewed' || i.status === 'partially_paid');
  const overdueInvoices = demoInvoices.filter((i) => i.status === 'overdue');
  const paymentsThisMonth = demoPayments.filter((p) => isThisMonth(p.paid_at, TODAY));
  const paymentsCollected = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
  const revenueThisMonth = demoInvoices
    .filter((i) => i.sent_at && isThisMonth(i.sent_at, TODAY))
    .reduce((sum, i) => sum + i.amount, 0);
  const outstandingReceivables = demoInvoices.reduce((sum, i) => sum + (i.amount - i.amount_paid), 0);

  const jobProfitability = activeJobs.map((job) => {
    const invoicesForJob = demoInvoices.filter((i) => i.job_id === job.id);
    const revenue = job.contract_value + job.approved_change_order_total;
    const invoiced = invoicesForJob.reduce((sum, i) => sum + i.amount, 0);
    return { job, revenue, invoiced };
  });

  const recentActivity = [
    ...demoMessages.map((m) => ({ ts: m.created_at, text: `New message from ${statusLabel(m.sender_role)}`, kind: 'message' })),
    ...demoDailyLogs.filter((l) => l.published).map((l) => ({ ts: l.created_at, text: `Daily update published for job on ${formatDate(l.log_date)}`, kind: 'log' })),
    ...demoLeads.map((l) => ({ ts: l.created_at, text: `New lead: ${l.full_name} (${l.service_type})`, kind: 'lead' })),
    ...demoPayments.map((p) => ({ ts: p.paid_at, text: `Payment received: ${formatCurrency(p.amount)}`, kind: 'payment' })),
  ]
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Command Center"
        description={`Overview for ${formatDate(TODAY, { month: 'long', day: 'numeric', year: 'numeric' })}`}
        actions={
          <>
            <ButtonLink to="/admin/leads" size="sm" variant="outline">
              View Leads
            </ButtonLink>
            <ButtonLink to="/admin/jobs" size="sm">
              View Jobs
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label="New Leads" value={newLeads.length} hint="Not yet contacted" tone={newLeads.length > 0 ? 'warning' : 'default'} />
        <Stat label="Estimates — Internal Review" value={estimatesInternalReview.length} />
        <Stat label="Estimates Awaiting Approval" value={estimatesAwaitingApproval.length} tone={estimatesAwaitingApproval.length > 0 ? 'warning' : 'default'} />
        <Stat label="Site Visits Today" value={siteVisitsToday.length} />
        <Stat label="Jobs Scheduled Today" value={jobsScheduledToday.length} />
        <Stat label="Active Jobs" value={activeJobs.length} />
        <Stat label="Upcoming Pours" value={upcomingPours.length} />
        <Stat label="Weather Delays" value={activeWeatherDelays.length} tone={activeWeatherDelays.length > 0 ? 'danger' : 'default'} />
        <Stat label="Open Change Orders" value={openChangeOrders.length} />
        <Stat label="Bids Awaiting Review" value={bidsAwaitingReview.length} tone={bidsAwaitingReview.length > 0 ? 'warning' : 'default'} />
        <Stat label="Unpaid Invoices" value={unpaidInvoices.length} />
        <Stat label="Overdue Invoices" value={overdueInvoices.length} tone={overdueInvoices.length > 0 ? 'danger' : 'default'} />
        <Stat label="Payments Collected (Month)" value={formatCurrency(paymentsCollected)} tone="success" />
        <Stat label="Revenue This Month" value={formatCurrency(revenueThisMonth)} tone="success" />
        <Stat label="Outstanding Receivables" value={formatCurrency(outstandingReceivables)} />
        <Stat label="Customers" value={demoCustomers.length} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Pipeline</CardTitle>
            <Link to="/admin/jobs" className="text-xs font-semibold text-steel-700 hover:text-steel-800">
              View all jobs →
            </Link>
          </CardHeader>
          <CardBody className="space-y-3">
            {(['lead', 'estimating', 'contracted', 'scheduled', 'in_progress', 'complete'] as const).map((stage) => {
              const jobsInStage = demoJobs.filter((j) => j.status === stage);
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-concrete-500">{statusLabel(stage)}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-concrete-100">
                    <div
                      className="h-full rounded-full bg-steel-600"
                      style={{ width: `${Math.min(100, (jobsInStage.length / Math.max(demoJobs.length, 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm font-bold text-concrete-800">{jobsInStage.length}</span>
                </div>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardBody>
            {recentActivity.length === 0 ? (
              <EmptyState title="No recent activity" />
            ) : (
              <ul className="space-y-3">
                {recentActivity.map((item, i) => (
                  <li key={i} className="border-b border-concrete-100 pb-3 text-sm last:border-0 last:pb-0">
                    <p className="text-concrete-800">{item.text}</p>
                    <p className="text-xs text-concrete-400">{timeAgo(item.ts)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Concrete Pours</CardTitle>
          </CardHeader>
          <CardBody>
            {upcomingPours.length === 0 ? (
              <EmptyState title="No pours scheduled" description="Confirmed pour dates will appear here." />
            ) : (
              <ul className="space-y-3">
                {upcomingPours.map((a) => {
                  const job = demoJobs.find((j) => j.id === a.job_id);
                  return (
                    <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-semibold text-concrete-900">{job?.job_number ?? 'Job'}</p>
                        <p className="text-xs text-concrete-500">{job?.address.street}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-concrete-800">{formatDate(a.scheduled_date)}</p>
                        <Badge tone={statusTone(a.status)}>{statusLabel(a.status)}</Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Profitability (Active Jobs)</CardTitle>
          </CardHeader>
          <CardBody>
            {jobProfitability.length === 0 ? (
              <EmptyState title="No active jobs" />
            ) : (
              <ul className="space-y-3">
                {jobProfitability.map(({ job, revenue, invoiced }) => (
                  <li key={job.id}>
                    <Link to={`/admin/jobs/${job.id}`} className="flex items-center justify-between gap-3 rounded-md px-1 py-1 text-sm hover:bg-concrete-50">
                      <div>
                        <p className="font-semibold text-concrete-900">{job.job_number}</p>
                        <p className="text-xs text-concrete-500">Invoiced {formatCurrency(invoiced)} of {formatCurrency(revenue)}</p>
                      </div>
                      <span className="text-xs font-semibold text-steel-700">View costing →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-concrete-400">
              Full cost breakdown (materials, labor, subs, equipment, margin %) is available on each job's Costing tab —
              this figure is owner/staff-only and never shown to customers or contractors.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
