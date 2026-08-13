/**
 * ============================================================================
 *  DEMO DATA — FOR DEVELOPMENT PREVIEW ONLY. NOT REAL CUSTOMERS OR RECORDS.
 * ============================================================================
 * This module backs the app when Supabase is not configured
 * (`isSupabaseConfigured === false`) so the platform is fully explorable
 * without a database. Every screen that reads from here also renders a
 * "Demo Mode" banner (see components/ui/DemoBanner.tsx). None of these
 * names, jobs, dollar amounts, or signatures represent real transactions.
 * Swap in real data by configuring Supabase — see README.md.
 */
import { DEFAULT_TOUGHTRACK_STAGES } from '@/config/stages';
import type {
  Address,
  AddOnCatalogItem,
  Appointment,
  Bid,
  BidOpportunity,
  ChangeOrder,
  Contract,
  Contractor,
  CustomerRecord,
  DailyEtaStatus,
  DailyJobLog,
  Estimate,
  Invoice,
  Job,
  JobDocument,
  JobExpense,
  JobPhoto,
  JobStageProgressRecord,
  Lead,
  Message,
  NotificationRecord,
  Payment,
  WeatherDelay,
} from '@/types/domain';

const addr = (street: string, city: string, state: string, zip: string): Address => ({ street, city, state, zip });

export const demoCustomers: CustomerRecord[] = [
  {
    id: 'cust-reyes',
    profile_id: 'profile-customer-1',
    full_name: 'Michael & Sarah Reyes',
    email: 'reyes.family@example.com',
    phone: '(214) 555-0148',
    billing_address: addr('118 Meadowbrook Ln', 'Fairview', 'TX', '75069'),
    notes: 'Repeat customer — poured their patio in 2023. Prefers text communication.',
    created_at: '2023-04-11T14:00:00Z',
  },
  {
    id: 'cust-coleman',
    profile_id: null,
    full_name: 'Denise Coleman',
    email: 'denise.coleman@example.com',
    phone: '(469) 555-0177',
    billing_address: addr('942 Willowcrest Dr', 'McKinney', 'TX', '75070'),
    notes: 'Referral from the Reyes job. Wants stamped patio matching neighbor.',
    created_at: '2026-06-02T18:30:00Z',
  },
  {
    id: 'cust-grovepoint',
    profile_id: null,
    full_name: 'Grovepoint Retail Center LLC',
    email: 'facilities@grovepointretail.example.com',
    phone: '(972) 555-0190',
    billing_address: addr('4400 Grovepoint Blvd', 'Allen', 'TX', '75013'),
    notes: 'Commercial property manager. Net-30 terms. Requires COI on file.',
    created_at: '2025-09-01T12:00:00Z',
  },
];

export const demoLeads: Lead[] = [
  {
    id: 'lead-whitfield',
    created_at: '2026-08-11T20:12:00Z',
    full_name: 'James Whitfield',
    phone: '(972) 555-0134',
    email: 'jwhitfield@example.com',
    project_address: '77 Birchwood Ct, Prosper, TX 75078',
    category: 'residential',
    service_type: 'driveway',
    length_ft: 40,
    width_ft: 20,
    thickness_in: 4,
    removal_needed: true,
    desired_finish: 'Broom finish',
    desired_start_date: '2026-09-15',
    budget_range: '$8,000 – $12,000',
    description: 'Existing driveway has major cracking and heaving. Want to replace with a wider pad for two cars side by side.',
    photo_urls: [],
    document_urls: [],
    preferred_contact_method: 'phone',
    status: 'new',
    source: 'website',
    customer_id: null,
  },
  {
    id: 'lead-ortiz',
    created_at: '2026-08-12T13:05:00Z',
    full_name: 'Priya Ortiz',
    phone: '(214) 555-0199',
    email: 'priya.ortiz@example.com',
    project_address: '215 Sagebrush Rd, Frisco, TX 75034',
    category: 'residential',
    service_type: 'patio',
    length_ft: 18,
    width_ft: 14,
    thickness_in: 4,
    removal_needed: false,
    desired_finish: 'Stamped — stone pattern',
    desired_start_date: '2026-10-01',
    budget_range: '$6,000 – $9,000',
    description: 'New backyard patio for an outdoor kitchen area. Asked the AI Concierge for a preliminary estimate first.',
    photo_urls: [],
    document_urls: [],
    preferred_contact_method: 'email',
    status: 'contacted',
    source: 'ai_concierge',
    customer_id: null,
  },
];

// ---------------------------------------------------------------------------
// TC-2026-0001 — Reyes driveway replacement (active job, ToughTrack showcase)
// ---------------------------------------------------------------------------
export const jobReyesId = 'job-tc-2026-0001';

const reyesStageProgress: JobStageProgressRecord[] = DEFAULT_TOUGHTRACK_STAGES.map((stage, i) => {
  const completeThrough = 6; // through "base_prep"
  let status: JobStageProgressRecord['status'] = 'pending';
  let percent = 0;
  if (i < completeThrough) status = 'complete';
  else if (stage.key === 'forms') {
    status = 'complete';
    percent = 100;
  } else if (stage.key === 'reinforcement') {
    status = 'in_progress';
    percent = 55;
  }
  if (stage.key === 'inspection') status = 'skipped';

  return {
    id: `stage-${jobReyesId}-${stage.key}`,
    job_id: jobReyesId,
    stage_key: stage.key,
    label: stage.label,
    status,
    percent_within_stage: percent,
    started_at: status !== 'pending' ? '2026-08-05T13:00:00Z' : null,
    completed_at: status === 'complete' ? '2026-08-11T16:00:00Z' : null,
    sort_order: i,
  };
});

export const demoJobs: Job[] = [
  {
    id: jobReyesId,
    job_number: 'TC-2026-0001',
    customer_id: 'cust-reyes',
    estimate_id: 'est-reyes-01',
    contract_id: 'contract-reyes-01',
    job_type: 'driveway',
    category: 'residential',
    address: addr('118 Meadowbrook Ln', 'Fairview', 'TX', '75069'),
    scope: 'Remove existing 720 sq ft driveway, excavate, and pour new 4" reinforced broom-finish driveway with 6" extension.',
    status: 'in_progress',
    contract_value: 11450,
    approved_change_order_total: 640,
    estimated_completion_date: '2026-08-18',
    weather_delay_active: false,
    created_at: '2026-07-22T15:00:00Z',
  },
  {
    id: 'job-tc-2026-0002',
    job_number: 'TC-2026-0002',
    customer_id: 'cust-coleman',
    estimate_id: 'est-coleman-01',
    contract_id: 'contract-coleman-01',
    job_type: 'patio',
    category: 'residential',
    address: addr('942 Willowcrest Dr', 'McKinney', 'TX', '75070'),
    scope: 'New 18x14 stamped concrete patio with stone pattern and integral color, sealed.',
    status: 'scheduled',
    contract_value: 9820,
    approved_change_order_total: 0,
    estimated_completion_date: '2026-09-05',
    weather_delay_active: false,
    created_at: '2026-06-10T16:00:00Z',
  },
  {
    id: 'job-tc-2025-0038',
    job_number: 'TC-2025-0038',
    customer_id: 'cust-grovepoint',
    estimate_id: null,
    contract_id: 'contract-grovepoint-01',
    job_type: 'commercial',
    category: 'commercial',
    address: addr('4400 Grovepoint Blvd', 'Allen', 'TX', '75013'),
    scope: 'Replace 3,200 sq ft rear loading dock pad and approach apron, 5" reinforced.',
    status: 'complete',
    contract_value: 38900,
    approved_change_order_total: 2100,
    estimated_completion_date: '2025-11-14',
    weather_delay_active: false,
    created_at: '2025-09-20T15:00:00Z',
  },
];

export const demoJobStageProgress: Record<string, JobStageProgressRecord[]> = {
  [jobReyesId]: reyesStageProgress,
  'job-tc-2026-0002': DEFAULT_TOUGHTRACK_STAGES.map((s, i) => ({
    id: `stage-coleman-${s.key}`,
    job_id: 'job-tc-2026-0002',
    stage_key: s.key,
    label: s.label,
    status: i === 0 || i === 1 ? 'complete' : i === 2 ? 'in_progress' : 'pending',
    percent_within_stage: i === 2 ? 20 : 0,
    started_at: i <= 2 ? '2026-08-01T12:00:00Z' : null,
    completed_at: i < 2 ? '2026-08-01T12:00:00Z' : null,
    sort_order: i,
  })),
  'job-tc-2025-0038': DEFAULT_TOUGHTRACK_STAGES.map((s, i) => ({
    id: `stage-grovepoint-${s.key}`,
    job_id: 'job-tc-2025-0038',
    stage_key: s.key,
    label: s.label,
    status: 'complete',
    percent_within_stage: 100,
    started_at: '2025-10-01T12:00:00Z',
    completed_at: '2025-11-14T12:00:00Z',
    sort_order: i,
  })),
};

export const demoEtaStatus: Record<string, DailyEtaStatus> = {
  [jobReyesId]: {
    id: 'eta-reyes-today',
    job_id: jobReyesId,
    status_date: '2026-08-12',
    crew_status: 'in_progress',
    eta_window_start: '2026-08-12T13:30:00Z',
    eta_window_end: '2026-08-12T14:00:00Z',
    estimated_hours_on_site: 6,
    estimated_departure: '2026-08-12T20:00:00Z',
    todays_scope: 'Reinforcement placement and pre-pour inspection prep',
    delay_reason: null,
    tomorrow_expected_arrival: '7:30 AM – 8:00 AM',
    updated_at: '2026-08-12T13:52:00Z',
  },
};

export const demoDailyLogs: DailyJobLog[] = [
  {
    id: 'log-reyes-0812',
    job_id: jobReyesId,
    log_date: '2026-08-12',
    crew_members: ['Danny Ortega', 'Luis Marquez'],
    arrival_time: '2026-08-12T13:48:00Z',
    departure_time: null,
    hours_on_site: null,
    work_completed: 'Placing rebar grid per spec, chairing to correct height.',
    tasks_completed: ['Forms final check'],
    tasks_partial: ['Reinforcement placement'],
    progress_percent: 55,
    materials_used: '#3 rebar, rebar chairs, tie wire',
    equipment_used: 'Rebar bender, cut-off saw',
    issues: null,
    weather: 'Clear, 91°F',
    delay_reason: null,
    customer_notes: 'Rebar is going in today — pour is on track for later this week pending inspection.',
    internal_notes: 'Need 2 more bundles of #3 rebar for tomorrow AM.',
    photo_ids: ['photo-reyes-5', 'photo-reyes-6'],
    tomorrow_plan: 'Finish reinforcement, city inspection, prep for pour if approved.',
    tomorrow_eta_start: '2026-08-13T07:30:00Z',
    tomorrow_eta_end: '2026-08-13T08:00:00Z',
    tomorrow_expected_hours: 5,
    published: true,
    created_by: 'profile-crew-1',
    created_at: '2026-08-12T14:05:00Z',
  },
  {
    id: 'log-reyes-0811',
    job_id: jobReyesId,
    log_date: '2026-08-11',
    crew_members: ['Danny Ortega', 'Luis Marquez', 'Chris Bell'],
    arrival_time: '2026-08-11T07:35:00Z',
    departure_time: '2026-08-11T16:10:00Z',
    hours_on_site: 8.5,
    work_completed: 'Set forms to grade, squared and braced. Began layout for rebar grid.',
    tasks_completed: ['Forms'],
    tasks_partial: [],
    progress_percent: 100,
    materials_used: '2x4 form lumber, form stakes',
    equipment_used: 'Laser level, transit',
    issues: null,
    weather: 'Partly cloudy, 88°F',
    delay_reason: null,
    customer_notes: 'Forms are set and squared. Driveway shape is now visible — reinforcement starts next.',
    internal_notes: null,
    photo_ids: ['photo-reyes-3', 'photo-reyes-4'],
    tomorrow_plan: 'Place rebar reinforcement.',
    tomorrow_eta_start: '2026-08-12T13:30:00Z',
    tomorrow_eta_end: '2026-08-12T14:00:00Z',
    tomorrow_expected_hours: 6,
    published: true,
    created_by: 'profile-crew-1',
    created_at: '2026-08-11T16:20:00Z',
  },
];

export const demoPhotos: JobPhoto[] = [
  { id: 'photo-reyes-1', job_id: jobReyesId, url: '', category: 'before', visibility: 'public_gallery', caption: 'Existing driveway — heavy cracking', taken_at: '2026-08-04T09:00:00Z', uploaded_by: 'profile-crew-1' },
  { id: 'photo-reyes-2', job_id: jobReyesId, url: '', category: 'excavation', visibility: 'customer', caption: 'Excavation to subgrade', taken_at: '2026-08-06T10:30:00Z', uploaded_by: 'profile-crew-1' },
  { id: 'photo-reyes-3', job_id: jobReyesId, url: '', category: 'forms', visibility: 'customer', caption: 'Forms set to grade', taken_at: '2026-08-11T11:00:00Z', uploaded_by: 'profile-crew-1' },
  { id: 'photo-reyes-4', job_id: jobReyesId, url: '', category: 'forms', visibility: 'customer', caption: 'Form corner detail', taken_at: '2026-08-11T11:05:00Z', uploaded_by: 'profile-crew-1' },
  { id: 'photo-reyes-5', job_id: jobReyesId, url: '', category: 'reinforcement', visibility: 'customer', caption: 'Rebar grid in progress', taken_at: '2026-08-12T13:55:00Z', uploaded_by: 'profile-crew-1' },
  { id: 'photo-reyes-6', job_id: jobReyesId, url: '', category: 'reinforcement', visibility: 'internal', caption: 'Chair height check', taken_at: '2026-08-12T14:00:00Z', uploaded_by: 'profile-crew-1' },
];

export const demoDocuments: JobDocument[] = [
  { id: 'doc-reyes-contract', job_id: jobReyesId, name: 'Signed Construction Contract.pdf', url: '', visibility: 'customer', uploaded_at: '2026-07-24T15:00:00Z' },
  { id: 'doc-reyes-plat', job_id: jobReyesId, name: 'Site Plat.pdf', url: '', visibility: 'internal', uploaded_at: '2026-07-22T15:00:00Z' },
];

export const demoMessages: Message[] = [
  { id: 'msg-1', job_id: jobReyesId, sender_id: 'profile-office-1', sender_role: 'office_staff', body: "Good morning! Crew is finishing up reinforcement today, weather looks great for the pour later this week.", created_at: '2026-08-12T13:15:00Z', read_at: null },
  { id: 'msg-2', job_id: jobReyesId, sender_id: 'profile-customer-1', sender_role: 'customer', body: 'Sounds great, thank you for the update!', created_at: '2026-08-12T13:40:00Z', read_at: '2026-08-12T13:41:00Z' },
];

export const demoEstimates: Estimate[] = [
  {
    id: 'est-reyes-01',
    estimate_number: 'EST-2026-0104',
    customer_id: 'cust-reyes',
    job_id: jobReyesId,
    lead_id: null,
    service_type: 'driveway',
    status: 'converted',
    measurements: { lengthFt: 40, widthFt: 18, thicknessIn: 4, wastePercent: 8 },
    line_items: [
      { key: 'demo', label: 'Existing concrete removal & disposal', amount: 2790, category: 'labor' },
      { key: 'concrete', label: 'Concrete material', amount: 1584, category: 'material' },
      { key: 'labor', label: 'Labor', amount: 1980, category: 'labor' },
      { key: 'base', label: 'Gravel / base preparation', amount: 612, category: 'material' },
      { key: 'forms', label: 'Forms', amount: 290, category: 'material' },
      { key: 'rebar', label: 'Rebar reinforcement', amount: 468, category: 'material' },
      { key: 'finishing', label: 'Finishing', amount: 900, category: 'labor' },
      { key: 'hauling', label: 'Hauling', amount: 172, category: 'other' },
      { key: 'permit', label: 'Permit allowance', amount: 150, category: 'other' },
    ],
    subtotal: 8946,
    markup_percent: 22,
    markup_amount: 1968,
    tax_amount: 900,
    total: 11450,
    manual_override: false,
    deposit_amount: 3435,
    valid_until: '2026-08-21',
    sent_at: '2026-07-20T14:00:00Z',
    viewed_at: '2026-07-20T18:22:00Z',
    approved_at: '2026-07-22T15:00:00Z',
    declined_at: null,
    decline_reason: null,
    created_by: 'profile-owner-1',
    created_at: '2026-07-19T16:00:00Z',
  },
  {
    id: 'est-coleman-01',
    estimate_number: 'EST-2026-0118',
    customer_id: 'cust-coleman',
    job_id: 'job-tc-2026-0002',
    lead_id: null,
    service_type: 'patio',
    status: 'converted',
    measurements: { lengthFt: 18, widthFt: 14, thicknessIn: 4, wastePercent: 8 },
    line_items: [
      { key: 'concrete', label: 'Concrete material', amount: 1108, category: 'material' },
      { key: 'labor', label: 'Labor', amount: 693, category: 'labor' },
      { key: 'base', label: 'Gravel / base preparation', amount: 214, category: 'material' },
      { key: 'forms', label: 'Forms', amount: 160, category: 'material' },
      { key: 'wire_mesh', label: 'Wire mesh reinforcement', amount: 101, category: 'material' },
      { key: 'finishing', label: 'Finishing', amount: 315, category: 'labor' },
      { key: 'stamping', label: 'Stamped pattern', amount: 882, category: 'labor' },
      { key: 'coloring', label: 'Integral coloring', amount: 441, category: 'material' },
      { key: 'sealer', label: 'Sealer application', amount: 151, category: 'labor' },
      { key: 'hauling', label: 'Hauling', amount: 22, category: 'other' },
    ],
    subtotal: 4087,
    markup_percent: 22,
    markup_amount: 899,
    tax_amount: 411,
    total: 5397,
    manual_override: true,
    deposit_amount: 1619,
    valid_until: '2026-07-10',
    sent_at: '2026-06-05T14:00:00Z',
    viewed_at: '2026-06-05T20:00:00Z',
    approved_at: '2026-06-10T16:00:00Z',
    declined_at: null,
    decline_reason: null,
    created_by: 'profile-owner-1',
    created_at: '2026-06-03T16:00:00Z',
  },
  {
    id: 'est-coleman-walkway',
    estimate_number: 'EST-2026-0142',
    customer_id: 'cust-coleman',
    job_id: null,
    lead_id: null,
    service_type: 'walkway',
    status: 'sent',
    measurements: { lengthFt: 12, widthFt: 3, thicknessIn: 4, wastePercent: 8 },
    line_items: [
      { key: 'concrete', label: 'Concrete material', amount: 285, category: 'material' },
      { key: 'labor', label: 'Labor', amount: 99, category: 'labor' },
      { key: 'base', label: 'Gravel / base preparation', amount: 31, category: 'material' },
      { key: 'forms', label: 'Forms', amount: 75, category: 'material' },
      { key: 'wire_mesh', label: 'Wire mesh reinforcement', amount: 14, category: 'material' },
      { key: 'finishing', label: 'Finishing', amount: 45, category: 'labor' },
    ],
    subtotal: 549,
    markup_percent: 22,
    markup_amount: 121,
    tax_amount: 55,
    total: 725,
    manual_override: false,
    deposit_amount: 218,
    valid_until: '2026-09-10',
    sent_at: '2026-08-10T16:00:00Z',
    viewed_at: null,
    approved_at: null,
    declined_at: null,
    decline_reason: null,
    created_by: 'profile-owner-1',
    created_at: '2026-08-10T15:30:00Z',
  },
  {
    id: 'est-reyes-mailbox',
    estimate_number: 'EST-2026-0146',
    customer_id: 'cust-reyes',
    job_id: jobReyesId,
    lead_id: null,
    service_type: 'other',
    status: 'internal_review',
    measurements: { lengthFt: 3, widthFt: 3, thicknessIn: 4, wastePercent: 8 },
    line_items: [
      { key: 'concrete', label: 'Concrete material', amount: 40, category: 'material' },
      { key: 'labor', label: 'Labor', amount: 25, category: 'labor' },
      { key: 'forms', label: 'Forms', amount: 15, category: 'material' },
    ],
    subtotal: 80,
    markup_percent: 22,
    markup_amount: 18,
    tax_amount: 8,
    total: 106,
    manual_override: false,
    deposit_amount: 0,
    valid_until: '2026-09-12',
    sent_at: null,
    viewed_at: null,
    approved_at: null,
    declined_at: null,
    decline_reason: null,
    created_by: 'profile-office-1',
    created_at: '2026-08-12T09:00:00Z',
  },
];

export const demoContracts: Contract[] = [
  { id: 'contract-reyes-01', contract_number: 'CT-2026-0001', type: 'customer_construction', job_id: jobReyesId, bid_id: null, version: 1, status: 'signed', document_url: '', content_snapshot: 'Customer Construction Contract — TC-2026-0001', created_at: '2026-07-24T15:00:00Z' },
  { id: 'contract-coleman-01', contract_number: 'CT-2026-0002', type: 'customer_construction', job_id: 'job-tc-2026-0002', bid_id: null, version: 1, status: 'signed', document_url: '', content_snapshot: 'Customer Construction Contract — TC-2026-0002', created_at: '2026-06-11T15:00:00Z' },
  { id: 'contract-grovepoint-01', contract_number: 'CT-2025-0038', type: 'customer_construction', job_id: 'job-tc-2025-0038', bid_id: null, version: 1, status: 'signed', document_url: '', content_snapshot: 'Customer Construction Contract — TC-2025-0038', created_at: '2025-09-25T15:00:00Z' },
];

export const demoChangeOrders: ChangeOrder[] = [
  {
    id: 'co-reyes-01',
    change_order_number: 'CO-2026-0001',
    job_id: jobReyesId,
    requested_by: 'customer',
    description: 'Extend driveway width by 2 additional feet along the north edge for a second vehicle.',
    additional_labor: 220,
    additional_materials: 340,
    additional_equipment: 0,
    added_days: 1,
    added_cost: 640,
    new_contract_total: 11450,
    updated_completion_estimate: '2026-08-18',
    status: 'approved',
    customer_signature_id: 'sig-co-reyes-customer',
    owner_signature_id: 'sig-co-reyes-owner',
    approved_at: '2026-08-01T17:00:00Z',
    created_at: '2026-07-30T14:00:00Z',
  },
];

export const demoInvoices: Invoice[] = [
  { id: 'inv-reyes-deposit', invoice_number: 'INV-2026-0201', job_id: jobReyesId, customer_id: 'cust-reyes', type: 'deposit', status: 'paid', amount: 3435, amount_paid: 3435, due_date: '2026-07-29', notes: '30% deposit', sent_at: '2026-07-22T15:30:00Z', created_at: '2026-07-22T15:30:00Z' },
  { id: 'inv-reyes-co', invoice_number: 'INV-2026-0207', job_id: jobReyesId, customer_id: 'cust-reyes', type: 'change_order', status: 'sent', amount: 640, amount_paid: 0, due_date: '2026-08-20', notes: 'CO-2026-0001 — driveway width extension', sent_at: '2026-08-01T17:10:00Z', created_at: '2026-08-01T17:10:00Z' },
  { id: 'inv-coleman-deposit', invoice_number: 'INV-2026-0155', job_id: 'job-tc-2026-0002', customer_id: 'cust-coleman', type: 'deposit', status: 'paid', amount: 1619, amount_paid: 1619, due_date: '2026-06-18', notes: '30% deposit', sent_at: '2026-06-11T15:00:00Z', created_at: '2026-06-11T15:00:00Z' },
  { id: 'inv-grovepoint-final', invoice_number: 'INV-2025-0412', job_id: 'job-tc-2025-0038', customer_id: 'cust-grovepoint', type: 'final', status: 'overdue', amount: 12300, amount_paid: 0, due_date: '2025-12-01', notes: 'Net-30 final balance', sent_at: '2025-11-15T15:00:00Z', created_at: '2025-11-15T15:00:00Z' },
  { id: 'inv-coleman-progress', invoice_number: 'INV-2026-0210', job_id: 'job-tc-2026-0002', customer_id: 'cust-coleman', type: 'progress', status: 'partially_paid', amount: 4000, amount_paid: 2000, due_date: '2026-08-22', notes: 'Progress payment — base prep complete', sent_at: '2026-08-05T14:00:00Z', created_at: '2026-08-05T14:00:00Z' },
];

export const demoPayments: Payment[] = [
  { id: 'pay-1', invoice_id: 'inv-reyes-deposit', amount: 3435, method: 'card', paid_at: '2026-07-23T09:12:00Z', reference: 'stub-demo-only', processor: 'manual' },
  { id: 'pay-2', invoice_id: 'inv-coleman-deposit', amount: 1619, method: 'ach', paid_at: '2026-06-12T10:00:00Z', reference: 'stub-demo-only', processor: 'manual' },
  { id: 'pay-3', invoice_id: 'inv-coleman-progress', amount: 2000, method: 'check', paid_at: '2026-08-08T12:00:00Z', reference: 'stub-demo-only', processor: 'manual' },
];

export const demoAppointments: Appointment[] = [
  { id: 'appt-1', job_id: null, lead_id: 'lead-whitfield', customer_id: null, type: 'estimate', status: 'requested', scheduled_date: '2026-08-14', window_start: '09:00', window_end: '10:00', notes: 'Site visit requested via website form.', created_at: '2026-08-11T20:15:00Z' },
  { id: 'appt-4', job_id: null, lead_id: 'lead-ortiz', customer_id: null, type: 'site_visit', status: 'confirmed', scheduled_date: '2026-08-12', window_start: '15:00', window_end: '16:00', notes: 'Requested via AI Concierge preliminary estimate.', created_at: '2026-08-12T13:10:00Z' },
  { id: 'appt-2', job_id: 'job-tc-2026-0002', lead_id: null, customer_id: 'cust-coleman', type: 'pour', status: 'confirmed', scheduled_date: '2026-08-20', window_start: '07:00', window_end: '07:30', notes: null, created_at: '2026-08-01T12:00:00Z' },
  { id: 'appt-3', job_id: jobReyesId, lead_id: null, customer_id: 'cust-reyes', type: 'final_walkthrough', status: 'pending', scheduled_date: '2026-08-19', window_start: '15:00', window_end: '16:00', notes: null, created_at: '2026-08-10T12:00:00Z' },
];

export const demoAddOnCatalog: AddOnCatalogItem[] = [
  { id: 'addon-extension', name: 'Driveway Extension', description: 'Widen or lengthen your existing driveway for extra parking.', image_url: '', price_low: 2000, price_high: 4500, applicable_service_types: ['driveway'], active: true },
  { id: 'addon-walkway', name: 'Additional Walkway', description: 'Connect your driveway to your front entry with a matching walkway.', image_url: '', price_low: 1200, price_high: 2600, applicable_service_types: ['driveway', 'patio'], active: true },
  { id: 'addon-patio', name: 'Patio Addition', description: 'Add a backyard patio to your current project.', image_url: '', price_low: 4500, price_high: 9000, applicable_service_types: ['driveway'], active: true },
  { id: 'addon-steps', name: 'Concrete Steps', description: 'Add code-compliant entry steps.', image_url: '', price_low: 900, price_high: 2200, applicable_service_types: ['driveway', 'patio'], active: true },
  { id: 'addon-border', name: 'Decorative Border', description: 'Stamped or colored border accent around your slab.', image_url: '', price_low: 600, price_high: 1600, applicable_service_types: ['driveway', 'patio'], active: true },
  { id: 'addon-stamped', name: 'Stamped Concrete Upgrade', description: 'Upgrade to a stamped stone or brick pattern.', image_url: '', price_low: 1500, price_high: null, applicable_service_types: ['driveway', 'patio'], active: true },
  { id: 'addon-sealing', name: 'Sealing', description: 'Protective sealer for long-term durability.', image_url: '', price_low: 350, price_high: 900, applicable_service_types: ['driveway', 'patio'], active: true },
  { id: 'addon-drainage', name: 'Drainage Improvements', description: 'Add drainage channels or grading to route water away from structures.', image_url: '', price_low: null, price_high: null, applicable_service_types: ['driveway', 'patio'], active: true },
  { id: 'addon-basketball', name: 'Basketball Goal Pad', description: 'Reinforced pad for an in-ground basketball goal.', image_url: '', price_low: 700, price_high: 1400, applicable_service_types: ['driveway'], active: true },
  { id: 'addon-mailbox', name: 'Mailbox Pad', description: 'Small reinforced pad for a new mailbox post.', image_url: '', price_low: 250, price_high: 500, applicable_service_types: ['driveway'], active: true },
  { id: 'addon-custom', name: 'Custom Add-On', description: 'Something else in mind? Tell us and we will follow up with pricing.', image_url: '', price_low: null, price_high: null, applicable_service_types: ['driveway', 'patio', 'slab', 'commercial'], active: true },
];

export const demoContractors: Contractor[] = [
  {
    id: 'sub-alvarez',
    profile_id: 'profile-contractor-1',
    company_name: 'Alvarez Grading & Excavation',
    contact_name: 'Roberto Alvarez',
    email: 'roberto@alvarezgrading.example.com',
    phone: '(972) 555-0122',
    address: addr('300 Commerce St', 'McKinney', 'TX', '75069'),
    service_area: ['Fairview', 'McKinney', 'Allen', 'Frisco'],
    trade: 'Excavation & Grading',
    ein_on_file: true,
    w9_url: '',
    insurance_cert_url: '',
    insurance_expiration: '2027-02-01',
    license_url: '',
    license_expiration: '2027-05-01',
    other_certs: ['OSHA 30'],
    references_notes: '3 references on file, all positive.',
    internal_rating: 4.6,
    status: 'approved',
    created_at: '2025-01-15T12:00:00Z',
  },
  {
    id: 'sub-brightline',
    profile_id: null,
    company_name: 'Brightline Rebar Co.',
    contact_name: 'Tasha Reed',
    email: 'tasha@brightlinerebar.example.com',
    phone: '(214) 555-0166',
    address: addr('88 Foundry Rd', 'Plano', 'TX', '75024'),
    service_area: ['Plano', 'Frisco', 'Allen'],
    trade: 'Rebar & Reinforcement',
    ein_on_file: true,
    w9_url: '',
    insurance_cert_url: '',
    insurance_expiration: '2026-11-01',
    license_url: '',
    license_expiration: null,
    other_certs: [],
    references_notes: null,
    internal_rating: 4.2,
    status: 'pending',
    created_at: '2026-07-01T12:00:00Z',
  },
];

export const demoBidOpportunities: BidOpportunity[] = [
  {
    id: 'bid-op-grovepoint-2',
    job_id: null,
    project_name: 'Grovepoint Retail Center — Front Parking Resurface',
    scope: 'Remove and replace approximately 6,000 sq ft of front parking lot concrete, 5" reinforced, commercial spec.',
    location: '4400 Grovepoint Blvd, Allen, TX 75013',
    start_date: '2026-10-05',
    completion_requirement: 'Complete within 14 working days',
    bid_deadline: '2026-08-25',
    labor_included: true,
    materials_included: true,
    equipment_included: true,
    insurance_requirements: '$2M general liability, workers comp required',
    special_instructions: 'Must maintain one open lane of access to loading dock at all times.',
    document_urls: [],
    status: 'open',
    invited_contractor_ids: ['sub-alvarez'],
    created_at: '2026-08-05T15:00:00Z',
  },
];

export const demoBids: Bid[] = [
  {
    id: 'bid-1',
    opportunity_id: 'bid-op-grovepoint-2',
    contractor_id: 'sub-alvarez',
    labor_cost: 18500,
    material_cost: 14200,
    equipment_cost: 3100,
    total: 35800,
    estimated_duration_days: 12,
    notes: 'Can start immediately after materials order. Includes traffic control plan.',
    document_urls: [],
    status: 'submitted',
    submitted_at: '2026-08-10T18:00:00Z',
    created_at: '2026-08-06T12:00:00Z',
  },
];

export const demoNotifications: NotificationRecord[] = [
  { id: 'notif-1', recipient_id: 'profile-customer-1', type: 'daily_progress_posted', title: 'Today’s update is ready', body: 'Reinforcement placement is underway on your driveway.', link: '/portal/project', read_at: null, created_at: '2026-08-12T14:05:00Z' },
  { id: 'notif-2', recipient_id: 'profile-customer-1', type: 'crew_on_the_way', title: 'Crew is on the way', body: 'Estimated arrival 1:30 PM – 2:00 PM.', link: '/portal/project', read_at: '2026-08-12T13:32:00Z', created_at: '2026-08-12T13:30:00Z' },
];

export const demoWeatherDelays: WeatherDelay[] = [
  {
    id: 'wd-coleman-01',
    job_id: 'job-tc-2026-0002',
    reason: 'Heavy overnight thunderstorms — subgrade too saturated to compact safely.',
    new_expected_date: '2026-08-04',
    updated_pour_date: null,
    customer_message: 'Due to overnight storms, we are pushing base preparation back one day so the ground can dry out properly. We will confirm the updated schedule tomorrow morning.',
    active: false,
    created_at: '2026-08-01T07:00:00Z',
    resolved_at: '2026-08-04T08:00:00Z',
  },
];

export const demoJobExpenses: JobExpense[] = [
  { id: 'exp-1', job_id: jobReyesId, category: 'material', description: 'Ready-mix concrete delivery', amount: 1584, incurred_at: '2026-08-06T10:00:00Z' },
  { id: 'exp-2', job_id: jobReyesId, category: 'labor', description: 'Crew labor — demo, forms, reinforcement (to date)', amount: 3120, incurred_at: '2026-08-12T14:00:00Z' },
  { id: 'exp-3', job_id: jobReyesId, category: 'subcontractor', description: 'N/A — self-performed', amount: 0, incurred_at: '2026-08-06T10:00:00Z' },
  { id: 'exp-4', job_id: jobReyesId, category: 'hauling', description: 'Demo debris haul-off', amount: 410, incurred_at: '2026-08-05T15:00:00Z' },
  { id: 'exp-5', job_id: jobReyesId, category: 'permit', description: 'City driveway permit', amount: 150, incurred_at: '2026-07-25T09:00:00Z' },
];
