import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { demoCustomers, demoJobs } from '@/data/demoData';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import type { Job, JobStatus } from '@/types/domain';
import { cn } from '@/lib/cn';

type FilterKey = 'all' | 'active' | 'scheduled' | 'complete';

const ACTIVE_STATUSES: JobStatus[] = ['in_progress'];
const SCHEDULED_STATUSES: JobStatus[] = ['contracted', 'scheduled'];
const COMPLETE_STATUSES: JobStatus[] = ['complete'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'complete', label: 'Complete' },
];

export default function JobsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>('all');

  const customerName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of demoCustomers) map[c.id] = c.full_name;
    return map;
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return demoJobs;
    if (filter === 'active') return demoJobs.filter((j) => ACTIVE_STATUSES.includes(j.status));
    if (filter === 'scheduled') return demoJobs.filter((j) => SCHEDULED_STATUSES.includes(j.status));
    return demoJobs.filter((j) => COMPLETE_STATUSES.includes(j.status));
  }, [filter]);

  const columns: Column<Job>[] = [
    { header: 'Job #', cell: (j) => <span className="font-semibold text-concrete-900">{j.job_number}</span> },
    { header: 'Customer', cell: (j) => customerName[j.customer_id] ?? 'Unknown' },
    { header: 'Type', cell: (j) => <span className="capitalize">{j.job_type}</span>, hideOnMobile: true },
    { header: 'Category', cell: (j) => <Badge tone={j.category === 'commercial' ? 'dark' : 'info'}>{j.category}</Badge> },
    { header: 'Status', cell: (j) => <Badge tone={statusTone(j.status)}>{statusLabel(j.status)}</Badge> },
    {
      header: 'Contract Value',
      cell: (j) => formatCurrency(j.contract_value + j.approved_change_order_total),
    },
    { header: 'Est. Completion', cell: (j) => (j.estimated_completion_date ? formatDate(j.estimated_completion_date) : '—'), hideOnMobile: true },
    {
      header: 'Weather',
      cell: (j) => (j.weather_delay_active ? <Badge tone="warning">Weather Delay</Badge> : <span className="text-concrete-300">—</span>),
    },
  ];

  return (
    <div>
      <PageHeader title="Jobs" description="Every active, scheduled, and completed job on ToughTrack." />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? 'dark' : 'outline'}
            className={cn(filter === f.key && 'pointer-events-none')}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(j) => j.id}
        onRowClick={(j) => navigate(`/admin/jobs/${j.id}`)}
        emptyMessage="No jobs match this filter."
      />
    </div>
  );
}
