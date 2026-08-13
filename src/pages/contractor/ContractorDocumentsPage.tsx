import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { demoContractors } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import { EmptyState } from '@/components/ui/EmptyState';

// In production the logged-in profile (useAuth().profile.id === 'profile-contractor-1')
// would resolve to its contractor row via `contractors.profile_id`. Hardcoded here
// since this demo only ever signs in as the one contractor account.
const CONTRACTOR_ID = 'sub-alvarez';

const WARNING_WINDOW_DAYS = 60;

function expirationTone(expiration: string | null): BadgeTone {
  if (!expiration) return 'neutral';
  const days = Math.ceil((new Date(expiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'danger';
  if (days <= WARNING_WINDOW_DAYS) return 'warning';
  return 'success';
}

function expirationLabel(expiration: string | null): string {
  if (!expiration) return 'No expiration on file';
  const days = Math.ceil((new Date(expiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return `Expired ${formatDate(expiration)}`;
  if (days <= WARNING_WINDOW_DAYS) return `Expires ${formatDate(expiration)} — renew soon`;
  return `Valid through ${formatDate(expiration)}`;
}

interface DocRowProps {
  label: string;
  hasFile: boolean;
  expiration?: string | null;
  onFileSelected: (name: string) => void;
  selectedFileName: string | null;
}

function DocRow({ label, hasFile, expiration, onFileSelected, selectedFileName }: DocRowProps) {
  const inputId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col gap-3 border-b border-concrete-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-concrete-900">{label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge tone={hasFile ? 'success' : 'neutral'}>{hasFile ? 'On File' : 'Not On File'}</Badge>
          {expiration !== undefined && <Badge tone={expirationTone(expiration ?? null)}>{expirationLabel(expiration ?? null)}</Badge>}
        </div>
        {selectedFileName && (
          <p className="mt-1 text-xs text-concrete-500">
            File selected: <span className="font-medium text-concrete-700">{selectedFileName}</span> — will be reviewed by our office.
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-concrete-300 px-4 py-2.5 text-sm font-semibold text-concrete-800 hover:bg-concrete-100"
        >
          {hasFile ? 'Replace' : 'Upload'}
        </label>
        <input
          id={inputId}
          type="file"
          className="sr-only"
          onChange={(e) => {
            const name = e.target.files?.[0]?.name;
            if (name) onFileSelected(name);
          }}
        />
      </div>
    </div>
  );
}

export default function ContractorDocumentsPage() {
  const contractor = demoContractors.find((c) => c.id === CONTRACTOR_ID);
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (!contractor) {
    return <EmptyState title="Contractor profile not found" description="We couldn't load your document status." />;
  }

  function selectFile(key: string, name: string) {
    setSelected((prev) => ({ ...prev, [key]: name }));
  }

  return (
    <div>
      <PageHeader
        title="Documents & Insurance"
        description="Keep your W-9, insurance certificate, and license current so you stay eligible for new bid invitations."
      />

      {/*
        No real file storage is wired up in this dev environment (Supabase Storage
        isn't configured). Selecting a file here only shows a local confirmation —
        it is not actually uploaded anywhere. In production this would upload to a
        `contractor-documents` storage bucket and update the corresponding URL
        column on the `contractors` table.
      */}

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardBody className="divide-y divide-concrete-100 p-0 px-5">
          <DocRow
            label="W-9"
            hasFile={Boolean(contractor.w9_url)}
            onFileSelected={(name) => selectFile('w9', name)}
            selectedFileName={selected.w9 ?? null}
          />
          <DocRow
            label="Insurance Certificate"
            hasFile={Boolean(contractor.insurance_cert_url)}
            expiration={contractor.insurance_expiration}
            onFileSelected={(name) => selectFile('insurance', name)}
            selectedFileName={selected.insurance ?? null}
          />
          <DocRow
            label="License"
            hasFile={Boolean(contractor.license_url)}
            expiration={contractor.license_expiration}
            onFileSelected={(name) => selectFile('license', name)}
            selectedFileName={selected.license ?? null}
          />
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Other Certifications</CardTitle>
        </CardHeader>
        <CardBody>
          {contractor.other_certs.length === 0 ? (
            <p className="text-sm text-concrete-500">No additional certifications on file.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {contractor.other_certs.map((cert) => (
                <li key={cert}>
                  <Badge tone="info">{cert}</Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-concrete-100 pt-4">
            <DocRow
              label="Add Certification"
              hasFile={false}
              onFileSelected={(name) => selectFile('other-cert', name)}
              selectedFileName={selected['other-cert'] ?? null}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
