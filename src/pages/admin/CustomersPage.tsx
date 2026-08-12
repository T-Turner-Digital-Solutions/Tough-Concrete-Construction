import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, type Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input } from '@/components/ui/Field';
import { demoCustomers, demoJobs } from '@/data/demoData';
import { formatDate } from '@/lib/format';
import type { CustomerRecord } from '@/types/domain';

const BLANK_FORM = {
  full_name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
};

export default function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerRecord[]>(demoCustomers);
  const [query, setQuery] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);

  const jobCountByCustomer = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const job of demoJobs) {
      counts[job.customer_id] = (counts[job.customer_id] ?? 0) + 1;
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [customers, query]);

  function handleCreateCustomer() {
    if (!form.full_name.trim() || !form.email.trim()) return;
    // Real flow: INSERT INTO customers (...) VALUES (...) in Supabase.
    const customer: CustomerRecord = {
      id: `cust-manual-${Date.now()}`,
      profile_id: null,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      billing_address: { street: form.street, city: form.city, state: form.state, zip: form.zip },
      notes: null,
      created_at: new Date().toISOString(),
    };
    setCustomers((prev) => [customer, ...prev]);
    setForm(BLANK_FORM);
    setNewOpen(false);
  }

  const columns: Column<CustomerRecord>[] = [
    { header: 'Name', cell: (c) => <span className="font-semibold text-concrete-900">{c.full_name}</span> },
    { header: 'Phone', cell: (c) => c.phone, hideOnMobile: true },
    { header: 'Email', cell: (c) => c.email, hideOnMobile: true },
    { header: 'Billing City / State', cell: (c) => `${c.billing_address.city}, ${c.billing_address.state}` },
    { header: '# Jobs', cell: (c) => jobCountByCustomer[c.id] ?? 0 },
    { header: 'Customer Since', cell: (c) => formatDate(c.created_at), hideOnMobile: true },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Every household and commercial account Tough Concrete has worked with."
        actions={<Button onClick={() => setNewOpen(true)}>+ New Customer</Button>}
      />

      <div className="mb-4 max-w-sm">
        <Input placeholder="Search by name or email…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(c) => c.id}
        onRowClick={(c) => navigate(`/admin/customers/${c.id}`)}
        emptyMessage="No customers match your search."
      />

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New Customer"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer}>Save Customer</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Full Name" htmlFor="nc-name" required>
            <Input id="nc-name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email" htmlFor="nc-email" required>
              <Input id="nc-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormField>
            <FormField label="Phone" htmlFor="nc-phone">
              <Input id="nc-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Street Address" htmlFor="nc-street">
            <Input id="nc-street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="City" htmlFor="nc-city">
              <Input id="nc-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </FormField>
            <FormField label="State" htmlFor="nc-state">
              <Input id="nc-state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </FormField>
            <FormField label="Zip" htmlFor="nc-zip">
              <Input id="nc-zip" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
            </FormField>
          </div>
        </div>
      </Modal>
    </div>
  );
}
