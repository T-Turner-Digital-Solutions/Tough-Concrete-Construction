import { useState } from 'react';
import { demoMessages, jobReyesId } from '@/data/demoData';
import { useAuth } from '@/lib/auth/AuthContext';
import { timeAgo } from '@/lib/format';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import type { Message, UserRole } from '@/types/domain';

const SENDER_LABELS: Record<UserRole, string> = {
  customer: 'You',
  owner_admin: 'Jorge (Owner)',
  office_staff: 'Office',
  field_crew: 'Field Crew',
  contractor: 'Contractor',
};

export default function CustomerMessagesPage() {
  const { profile } = useAuth();
  // Row Level Security simulation: only messages tied to this customer's job.
  const [messages, setMessages] = useState<Message[]>(demoMessages.filter((m) => m.job_id === jobReyesId));
  const [draft, setDraft] = useState('');

  function send() {
    const text = draft.trim();
    if (!text) return;
    // Demo-only: appended to local state. In production this would insert
    // into `messages` and rely on Supabase Realtime to push it to office
    // staff / field crew instantly, and to sync back if they reply.
    setMessages((m) => [
      ...m,
      {
        id: `msg-local-${m.length + 1}`,
        job_id: jobReyesId,
        sender_id: profile?.id ?? 'profile-customer-1',
        sender_role: 'customer',
        body: text,
        created_at: new Date().toISOString(),
        read_at: null,
      },
    ]);
    setDraft('');
  }

  return (
    <div>
      <PageHeader title="Messages" description="Chat directly with your Tough Concrete Construction team." />

      <Card className="flex h-[65vh] flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && <p className="py-10 text-center text-sm text-concrete-500">No messages yet — say hello!</p>}
          {messages.map((m) => {
            const isCustomer = m.sender_role === 'customer';
            return (
              <div key={m.id} className={cn('flex', isCustomer ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[80%]', isCustomer ? 'items-end' : 'items-start', 'flex flex-col')}>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      isCustomer ? 'rounded-tr-sm bg-steel-700 text-white' : 'rounded-tl-sm bg-concrete-100 text-concrete-800',
                    )}
                  >
                    {m.body}
                  </div>
                  <p className="mt-1 px-1 text-[11px] text-concrete-400">
                    {SENDER_LABELS[m.sender_role]} · {timeAgo(m.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2 border-t border-concrete-100 p-3"
        >
          <Input placeholder="Type a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <Button type="submit" disabled={!draft.trim()}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
