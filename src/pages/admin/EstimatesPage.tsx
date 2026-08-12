import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/Table';
import { demoEstimates, demoCustomers } from '@/data/demoData';
import type { Estimate } from '@/types/domain';
import { formatCurrency, formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';

export default function EstimatesPage() {
  const navigate = useNavigate();

  const columns: Column<Estimate>[] = [
    { header: 'Estimate #', cell: (e) => <span className="font-semibold text-concrete-900">{e.estimate_number}</span> },
    { header: 'Customer', cell: (e) => demoCustomers.find((c) => c.id === e.customer_id)?.full_name ?? 'Unknown' },
    { header: 'Service', cell: (e) => statusLabel(e.service_type) },
    { header: 'Status', cell: (e) => <Badge tone={statusTone(e.status)}>{statusLabel(e.status)}</Badge> },
    { header: 'Total', cell: (e) => formatCurrency(e.total) },
    { header: 'Valid Until', cell: (e) => formatDate(e.valid_until), hideOnMobile: true },
  ];

  const sorted = [...demoEstimates].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div>
      <PageHeader
        title="Estimates"
        description="Concrete estimating — from draft to customer approval to job conversion."
        actions={
          <ButtonLink to="/admin/estimates/new" size="sm">
            + New Estimate
          </ButtonLink>
        }
      />
      <DataTable columns={columns} rows={sorted} rowKey={(e) => e.id} onRowClick={(e) => navigate(`/admin/estimates/${e.id}`)} emptyMessage="No estimates yet." />
    </div>
  );
}
