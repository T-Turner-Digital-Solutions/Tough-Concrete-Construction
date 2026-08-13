import { useState } from 'react';
import { demoContracts, demoJobs } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { statusLabel, statusTone } from '@/lib/statusStyles';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { DataTable, type Column } from '@/components/ui/Table';
import type { Contract, ContractType } from '@/types/domain';

// Demo mode: hardcoded to the logged-in demo customer. In production this
// would resolve via profiles.id -> customers.profile_id.
const CUSTOMER_ID = 'cust-reyes';

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  customer_construction: 'Customer Construction Contract',
  subcontractor_agreement: 'Subcontractor Agreement',
  change_order: 'Change Order Agreement',
  completion_acknowledgment: 'Completion Acknowledgment',
  warranty_acknowledgment: 'Warranty Acknowledgment',
  lien_waiver: 'Lien Waiver',
};

export default function CustomerContractsPage() {
  const [signingContract, setSigningContract] = useState<Contract | null>(null);
  const [signedName, setSignedName] = useState('');
  const [signedIds, setSignedIds] = useState<Record<string, boolean>>({});

  // Row Level Security simulation: cross-reference this customer's jobs, then
  // filter contracts down to only those jobs — never another customer's paperwork.
  const myJobIds = new Set(demoJobs.filter((j) => j.customer_id === CUSTOMER_ID).map((j) => j.id));
  const myContracts = demoContracts.filter((c) => c.job_id && myJobIds.has(c.job_id));

  function closeModal() {
    setSigningContract(null);
    setSignedName('');
  }

  function handleSign() {
    if (!signingContract || !signedName.trim()) return;
    // Demo-only: in production, signing would write to the `signatures` table
    // with signer_name/role, an audit-trail IP address + timestamp, a
    // rendered signature_data_url, bump the contract version if re-issued,
    // and flip status to 'signed'. A real e-signature pad (not a plain text
    // input) would capture the signature itself.
    setSignedIds((s) => ({ ...s, [signingContract.id]: true }));
  }

  const columns: Column<Contract>[] = [
    { header: 'Contract #', cell: (c) => <span className="font-semibold text-concrete-900">{c.contract_number}</span> },
    { header: 'Type', cell: (c) => CONTRACT_TYPE_LABELS[c.type] },
    {
      header: 'Status',
      cell: (c) => {
        const effective = signedIds[c.id] ? 'signed' : c.status;
        return <Badge tone={statusTone(effective)}>{statusLabel(effective)}</Badge>;
      },
    },
    { header: 'Version', cell: (c) => `v${c.version}` },
    { header: 'Created', cell: (c) => formatDate(c.created_at) },
    {
      header: '',
      cell: (c) =>
        c.status === 'sent' && !signedIds[c.id] ? (
          <Button size="sm" onClick={() => setSigningContract(c)}>
            Review &amp; Sign
          </Button>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader title="Contracts" description="Your construction contracts and any documents requiring signature." />

      <DataTable columns={columns} rows={myContracts} rowKey={(c) => c.id} emptyMessage="No contracts on file yet." />

      <Modal
        open={!!signingContract}
        onClose={closeModal}
        title={signingContract ? `Sign ${signingContract.contract_number}` : ''}
        footer={
          signingContract && !signedIds[signingContract.id] ? (
            <>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSign} disabled={!signedName.trim()}>
                Sign Contract
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
          )
        }
      >
        {signingContract && (
          <div className="space-y-4">
            <div className="rounded-lg border border-concrete-200 bg-concrete-50 p-4 text-sm text-concrete-700">
              {signingContract.content_snapshot}
            </div>

            {signedIds[signingContract.id] ? (
              <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                Signed successfully. A copy will be available in your Documents.
              </p>
            ) : (
              <div>
                <label htmlFor="sign-name" className="mb-1.5 block text-sm font-semibold text-concrete-800">
                  Type your full name to sign
                </label>
                <Input id="sign-name" placeholder="Full legal name" value={signedName} onChange={(e) => setSignedName(e.target.value)} />
                <p className="mt-2 text-xs text-concrete-500">
                  This is a demo signature placeholder. A production e-signature flow would capture a drawn/typed
                  signature along with an audit trail (IP address, timestamp, and document version) against the
                  <code className="mx-1 rounded bg-concrete-100 px-1 py-0.5">signatures</code> table.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
