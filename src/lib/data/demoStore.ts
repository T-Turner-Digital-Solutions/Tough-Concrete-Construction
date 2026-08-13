/**
 * Demo-mode write helper. When Supabase isn't configured, form submissions
 * (leads, site visit requests, bids, add-on requests, etc.) are persisted
 * to localStorage — scoped to the visitor's browser only — instead of
 * silently vanishing or pretending to hit a real database. Every caller
 * surfaces this distinction to the user (see DemoBanner / confirmation
 * copy) so nobody mistakes it for a production submission.
 */
const PREFIX = 'tcc_demo_store_';

export function readDemoCollection<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function appendDemoRecord<T>(key: string, record: T): void {
  const existing = readDemoCollection<T>(key);
  existing.push(record);
  window.localStorage.setItem(PREFIX + key, JSON.stringify(existing));
}

export function newDemoId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
