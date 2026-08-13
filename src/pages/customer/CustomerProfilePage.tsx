import { useState, type FormEvent } from 'react';
import { demoCustomers } from '@/data/demoData';
import { useAuth } from '@/lib/auth/AuthContext';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/ui/Field';

// Demo mode: hardcoded to the logged-in demo customer. In production this
// would resolve via profiles.id -> customers.profile_id.
const CUSTOMER_ID = 'cust-reyes';

export default function CustomerProfilePage() {
  const { demoMode } = useAuth();
  const customer = demoCustomers.find((c) => c.id === CUSTOMER_ID)!;

  const [fullName, setFullName] = useState(customer.full_name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [street, setStreet] = useState(customer.billing_address.street);
  const [city, setCity] = useState(customer.billing_address.city);
  const [state, setState] = useState(customer.billing_address.state);
  const [zip, setZip] = useState(customer.billing_address.zip);
  const [saved, setSaved] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    // Demo-only: updates local component state. In production this would
    // update the `customers` table row for this customer_id.
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !newPassword) return;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordStatus(error ? error.message : 'Password updated successfully.');
    setNewPassword('');
  }

  return (
    <div>
      <PageHeader title="Profile" description="Manage your contact information and notification preferences." />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Full Name" htmlFor="profile-name">
                  <Input id="profile-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </FormField>
                <FormField label="Email" htmlFor="profile-email">
                  <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormField>
                <FormField label="Phone" htmlFor="profile-phone">
                  <Input id="profile-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </FormField>
              </div>

              <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-concrete-400">Billing Address</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <FormField label="Street" htmlFor="profile-street">
                    <Input id="profile-street" value={street} onChange={(e) => setStreet(e.target.value)} />
                  </FormField>
                </div>
                <FormField label="City" htmlFor="profile-city">
                  <Input id="profile-city" value={city} onChange={(e) => setCity(e.target.value)} />
                </FormField>
                <div className="grid grid-cols-2 gap-2">
                  <FormField label="State" htmlFor="profile-state">
                    <Input id="profile-state" value={state} onChange={(e) => setState(e.target.value)} />
                  </FormField>
                  <FormField label="ZIP" htmlFor="profile-zip">
                    <Input id="profile-zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                  </FormField>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">Save Changes</Button>
                {saved && <span className="text-sm font-semibold text-emerald-600">Saved (demo mode)</span>}
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-md border border-concrete-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-concrete-800">Email Notifications</p>
                <p className="text-xs text-concrete-500">Project updates, invoices, and appointment reminders.</p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 accent-steel-600"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-md border border-concrete-200 px-4 py-3 opacity-60">
              <div>
                <p className="text-sm font-semibold text-concrete-800">SMS Notifications</p>
                <p className="text-xs text-concrete-500">Text alerts for crew ETA and urgent updates. Coming soon.</p>
              </div>
              <input type="checkbox" className="h-5 w-5 accent-steel-600" checked={smsNotifications} onChange={() => setSmsNotifications(false)} disabled />
            </label>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardBody>
            {demoMode ? (
              <p className="text-sm text-concrete-500">Password management requires a configured Supabase project.</p>
            ) : (
              <form onSubmit={changePassword} className="max-w-sm space-y-4">
                <FormField label="New Password" htmlFor="new-password">
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} />
                </FormField>
                <Button type="submit" disabled={!isSupabaseConfigured || newPassword.length < 8}>
                  Update Password
                </Button>
                {passwordStatus && <p className="text-sm text-concrete-600">{passwordStatus}</p>}
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
