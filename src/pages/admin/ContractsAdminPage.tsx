import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { demoContracts, demoJobs } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import type { Contract, ContractType } from '@/types/domain';
import { cn } from '@/lib/cn';

const TYPE_LABELS: Record<ContractType, string> = {
  customer_construction: 'Customer Construction Contract',
  subcontractor_agreement: 'Subcontractor Agreement',
  change_order: 'Change Order',
  completion_acknowledgment: 'Completion Acknowledgment',
  warranty_acknowledgment: 'Warranty Acknowledgment',
  lien_waiver: 'Lien Waiver',
};

const TYPE_FILTERS: (ContractType | 'all')[] = [
  'all',
  'customer_construction',
  'subcontractor_agreement',
  'change_order',
  'completion_acknowledgment',
  'warranty_acknowledgment',
  'lien_waiver',
];

export default function ContractsAdminPage() {
  const [contracts, setContracts] = useState<Contract[]>(demoContracts);
  const [typeFilter, setTypeFilter] = useState<ContractType | 'all'>('all');
  const [selected, setSelected] = useState<Contract | null>(null);
  const [signedMessage, setSignedMessage] = useState(false);

  const jobNumber = useMemo(() => {
    const map: Record<string, string> = {};
    for (const j of demoJobs) map[j.id] = j.job_number;
    return map;
  }, []);

  const filtered = useMemo(
    () => (typeFilter === 'all' ? contracts : contracts.filter((c) => c.type === typeFilter)),
    [contracts, typeFilter],
  );

  function markSigned(id: string) {
    // Real flow: creating a `signatures` row (signer name/date/time/IP, audit trail) is
    // what actually flips a contract to 'signed' — this button only simulates that outcome
    // locally. UPDATE contracts SET status = 'signed' WHERE id = ... in Supabase.
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'signed' } : c)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status: 'signed' } : prev));
    setSignedMessage(true);
  }

  const columns: Column<Contract>[] = [
    { header: 'Contract #', cell: (c) => <span className="font-semibold text-concrete-900">{c.contract_number}</span> },
    { header: 'Type', cell: (c) => TYPE_LABELS[c.type] },
    { header: 'Job #', cell: (c) => (c.job_id ? jobNumber[c.job_id] ?? '—' : '—') },
    { header: 'Version', cell: (c) => `v${c.version}`, hideOnMobile: true },
    { header: 'Status', cell: (c) => <Badge tone={statusTone(c.status)}>{statusLabel(c.status)}</Badge> },
    { header: 'Created', cell: (c) => formatDate(c.created_at), hideOnMobile: true },
  ];

  return (
    <div>
      <PageHeader title="Contracts" description="Customer contracts, subcontractor agreements, and signed documents." />

      <div className="mb-4 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={typeFilter === t ? 'dark' : 'outline'}
            className={cn(typeFilter === t && 'pointer-events-none')}
            onClick={() => setTypeFilter(t)}
          >
            {t === 'all' ? 'All' : TYPE_LABELS[t]}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(c) => c.id}
        onRowClick={(c) => {
          setSelected(c);
          setSignedMessage(false);
        }}
        emptyMessage="No contracts of this type."
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.contract_number ?? 'Contract'}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={statusTone(selected.status)}>{statusLabel(selected.status)}</Badge>
              <span className="text-concrete-500">{TYPE_LABELS[selected.type]}</span>
              <span className="text-concrete-500">v{selected.version}</span>
            </div>

            <div className="rounded-lg border border-concrete-200 bg-concrete-50 p-4">
              <p className="text-xs font-semibold uppercase text-concrete-400">Content Snapshot</p>
              <p className="mt-2 whitespace-pre-wrap text-concrete-800">{selected.content_snapshot}</p>
            </div>

            <p className="text-xs text-concrete-500">
              Full contract template rendering and version history would appear here once the Contracts module is
              connected to stored templates.
            </p>

            {selected.status === 'sent' && (
              <div className="rounded-lg border border-safety-200 bg-safety-50 p-4">
                <Button size="sm" onClick={() => markSigned(selected.id)}>
                  Mark as Signed (Demo)
                </Button>
                <p className="mt-2 text-xs text-concrete-600">
                  In production, real e-signature capture (signer name/date/time/IP, audit trail, and immutable prior
                  versions) happens via the <code>signatures</code> table per spec — this button only simulates that
                  outcome locally.
                </p>
                {signedMessage && <p className="mt-2 text-xs font-medium text-emerald-700">Marked signed (demo mode).</p>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
