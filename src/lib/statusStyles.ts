import type { BadgeTone } from '@/components/ui/Badge';

const map: Record<string, BadgeTone> = {
  // Estimates
  draft: 'neutral',
  internal_review: 'info',
  sent: 'info',
  viewed: 'info',
  approved: 'success',
  declined: 'danger',
  expired: 'neutral',
  converted: 'dark',
  // Jobs
  lead: 'neutral',
  estimating: 'info',
  contracted: 'info',
  scheduled: 'info',
  in_progress: 'warning',
  complete: 'success',
  cancelled: 'danger',
  // Invoices
  partially_paid: 'warning',
  paid: 'success',
  overdue: 'danger',
  // Appointments
  requested: 'neutral',
  pending: 'info',
  confirmed: 'success',
  rescheduled: 'warning',
  weather_delay: 'warning',
  completed: 'success',
  // Change orders
  // (draft/sent/approved/declined/cancelled already covered above)
  // Bids
  invited: 'neutral',
  submitted: 'info',
  revision_requested: 'warning',
  awarded: 'success',
  not_awarded: 'neutral',
  // Contractors
  not_approved: 'danger',
  open: 'success',
  closed: 'neutral',
};

export function statusTone(status: string): BadgeTone {
  return map[status] ?? 'neutral';
}

export function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}
