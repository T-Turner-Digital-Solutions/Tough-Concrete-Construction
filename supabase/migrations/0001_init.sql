-- =============================================================================
-- Tough Concrete Construction, LLC — platform schema
-- =============================================================================
-- Run with the Supabase CLI (`supabase db push`) or paste into the SQL editor
-- of a new Supabase project. See README.md "Database setup" for the full
-- walkthrough (creating the project, setting env vars, running this file,
-- creating the first owner_admin user).
--
-- Design notes:
--   * Every table has Row Level Security enabled — the client-side route
--     guards in src/lib/auth/RequireRole.tsx are a UX convenience only;
--     THIS is the real authorization boundary.
--   * Money is stored as numeric(12,2). Addresses are stored as jsonb
--     ({street, city, state, zip}) to match src/types/domain.ts::Address.
--   * `profiles.role` drives all access control. Roles: owner_admin,
--     office_staff, field_crew, customer, contractor.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role as enum ('owner_admin', 'office_staff', 'field_crew', 'customer', 'contractor');
create type project_category as enum ('residential', 'commercial');
create type lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'lost');
create type lead_source as enum ('website', 'ai_concierge', 'phone', 'referral', 'other');
create type contact_method as enum ('phone', 'email', 'text');
create type estimate_status as enum ('draft', 'internal_review', 'sent', 'viewed', 'approved', 'declined', 'expired', 'converted');
create type job_status as enum ('lead', 'estimating', 'contracted', 'scheduled', 'in_progress', 'complete', 'cancelled');
create type stage_status as enum ('pending', 'in_progress', 'complete', 'skipped');
create type contract_type as enum ('customer_construction', 'subcontractor_agreement', 'change_order', 'completion_acknowledgment', 'warranty_acknowledgment', 'lien_waiver');
create type contract_status as enum ('draft', 'sent', 'signed', 'superseded');
create type signer_role as enum ('customer', 'owner_admin', 'contractor');
create type invoice_type as enum ('deposit', 'progress', 'final', 'change_order', 'custom');
create type invoice_status as enum ('draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled');
create type payment_method as enum ('card', 'ach', 'check', 'cash', 'other');
create type payment_processor as enum ('stripe', 'square', 'manual');
create type appointment_type as enum ('estimate', 'site_measurement', 'site_visit', 'excavation', 'prep', 'forms', 'inspection', 'pour', 'finish', 'cleanup', 'final_walkthrough');
create type appointment_status as enum ('requested', 'pending', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'weather_delay');
create type photo_category as enum ('before', 'demolition', 'excavation', 'base_preparation', 'forms', 'reinforcement', 'pour', 'finishing', 'completed', 'warranty', 'internal_documentation');
create type photo_visibility as enum ('internal', 'customer', 'public_gallery');
create type document_visibility as enum ('internal', 'customer');
create type crew_status as enum ('not_started', 'on_my_way', 'arrived', 'in_progress', 'paused', 'delayed', 'complete_today');
create type change_order_status as enum ('draft', 'sent', 'approved', 'declined', 'cancelled');
create type change_order_requested_by as enum ('customer', 'owner_admin');
create type addon_request_status as enum ('requested', 'reviewing', 'quoted', 'converted_to_change_order', 'declined');
create type contractor_status as enum ('pending', 'approved', 'not_approved');
create type bid_opportunity_status as enum ('draft', 'open', 'closed', 'awarded', 'cancelled');
create type bid_status as enum ('invited', 'viewed', 'submitted', 'revision_requested', 'declined', 'awarded', 'not_awarded');
create type job_expense_category as enum ('material', 'labor', 'subcontractor', 'equipment', 'hauling', 'disposal', 'permit', 'other');
create type notification_type as enum (
  'estimate_ready', 'estimate_viewed', 'estimate_approved', 'appointment_confirmed', 'appointment_reminder',
  'crew_on_the_way', 'crew_arrived', 'daily_progress_posted', 'photos_added', 'schedule_changed', 'weather_delay',
  'change_order_sent', 'change_order_approved', 'invoice_sent', 'payment_received', 'contractor_bid_received',
  'contractor_bid_awarded', 'contract_awaiting_signature'
);

-- ---------------------------------------------------------------------------
-- Core identity
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'customer',
  full_name text not null default '',
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  billing_address jsonb not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);
create index customers_profile_id_idx on customers (profile_id);

create table contractors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles (id) on delete set null,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  address jsonb not null default '{}',
  service_area text[] not null default '{}',
  trade text not null default '',
  ein_on_file boolean not null default false,
  w9_url text,
  insurance_cert_url text,
  insurance_expiration date,
  license_url text,
  license_expiration date,
  other_certs text[] not null default '{}',
  references_notes text,
  internal_rating numeric(3, 1),
  status contractor_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index contractors_profile_id_idx on contractors (profile_id);

-- ---------------------------------------------------------------------------
-- Leads → Estimates → Jobs
-- ---------------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text not null,
  project_address text not null,
  category project_category not null,
  service_type text not null,
  length_ft numeric(8, 2),
  width_ft numeric(8, 2),
  thickness_in numeric(6, 2),
  removal_needed boolean not null default false,
  desired_finish text,
  desired_start_date date,
  budget_range text,
  description text not null default '',
  photo_urls text[] not null default '{}',
  document_urls text[] not null default '{}',
  preferred_contact_method contact_method not null default 'phone',
  status lead_status not null default 'new',
  source lead_source not null default 'website',
  customer_id uuid references customers (id) on delete set null
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  job_number text not null unique,
  customer_id uuid not null references customers (id) on delete restrict,
  estimate_id uuid, -- FK added after estimates table exists
  contract_id uuid,
  job_type text not null,
  category project_category not null,
  address jsonb not null default '{}',
  scope text not null default '',
  status job_status not null default 'lead',
  contract_value numeric(12, 2) not null default 0,
  approved_change_order_total numeric(12, 2) not null default 0,
  estimated_completion_date date,
  weather_delay_active boolean not null default false,
  created_at timestamptz not null default now()
);
create index jobs_customer_id_idx on jobs (customer_id);

create table estimates (
  id uuid primary key default gen_random_uuid(),
  estimate_number text not null unique,
  customer_id uuid not null references customers (id) on delete restrict,
  job_id uuid references jobs (id) on delete set null,
  lead_id uuid references leads (id) on delete set null,
  service_type text not null,
  status estimate_status not null default 'draft',
  measurements jsonb not null default '{}',
  line_items jsonb not null default '[]',
  subtotal numeric(12, 2) not null default 0,
  markup_percent numeric(5, 2) not null default 0,
  markup_amount numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  manual_override boolean not null default false,
  deposit_amount numeric(12, 2) not null default 0,
  valid_until date not null,
  sent_at timestamptz,
  viewed_at timestamptz,
  approved_at timestamptz,
  declined_at timestamptz,
  decline_reason text,
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now()
);
create index estimates_customer_id_idx on estimates (customer_id);

alter table jobs add constraint jobs_estimate_id_fkey foreign key (estimate_id) references estimates (id) on delete set null;

create table job_stage_progress (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  stage_key text not null,
  label text not null,
  status stage_status not null default 'pending',
  percent_within_stage int not null default 0 check (percent_within_stage between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  sort_order int not null default 0,
  unique (job_id, stage_key)
);
create index job_stage_progress_job_id_idx on job_stage_progress (job_id);

-- ---------------------------------------------------------------------------
-- Contracts, signatures, change orders
-- ---------------------------------------------------------------------------
create table contracts (
  id uuid primary key default gen_random_uuid(),
  contract_number text not null unique,
  type contract_type not null,
  job_id uuid references jobs (id) on delete cascade,
  bid_id uuid, -- FK added after bids table exists
  version int not null default 1,
  status contract_status not null default 'draft',
  document_url text,
  content_snapshot text not null default '',
  created_at timestamptz not null default now()
);
create index contracts_job_id_idx on contracts (job_id);

alter table jobs add constraint jobs_contract_id_fkey foreign key (contract_id) references contracts (id) on delete set null;

create table signatures (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  signer_name text not null,
  signer_role signer_role not null,
  signature_data_url text not null,
  signed_at timestamptz not null default now(),
  ip_address text
);

create table change_orders (
  id uuid primary key default gen_random_uuid(),
  change_order_number text not null unique,
  job_id uuid not null references jobs (id) on delete cascade,
  requested_by change_order_requested_by not null,
  description text not null,
  additional_labor numeric(12, 2) not null default 0,
  additional_materials numeric(12, 2) not null default 0,
  additional_equipment numeric(12, 2) not null default 0,
  added_days int not null default 0,
  added_cost numeric(12, 2) not null default 0,
  new_contract_total numeric(12, 2) not null default 0,
  updated_completion_estimate date,
  status change_order_status not null default 'draft',
  customer_signature_id uuid references signatures (id),
  owner_signature_id uuid references signatures (id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
create index change_orders_job_id_idx on change_orders (job_id);

-- ---------------------------------------------------------------------------
-- Invoicing & payments
-- ---------------------------------------------------------------------------
create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  job_id uuid not null references jobs (id) on delete cascade,
  customer_id uuid not null references customers (id) on delete restrict,
  type invoice_type not null,
  status invoice_status not null default 'draft',
  amount numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  due_date date not null,
  notes text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index invoices_job_id_idx on invoices (job_id);
create index invoices_customer_id_idx on invoices (customer_id);

create table payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices (id) on delete cascade,
  amount numeric(12, 2) not null,
  method payment_method not null,
  paid_at timestamptz not null default now(),
  reference text,
  -- NULL until a real payment processor (Stripe/Square) is integrated;
  -- 'manual' = staff-recorded offline payment (check/cash/ACH confirmed by phone).
  processor payment_processor
);
create index payments_invoice_id_idx on payments (invoice_id);

-- ---------------------------------------------------------------------------
-- Scheduling
-- ---------------------------------------------------------------------------
create table appointments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs (id) on delete cascade,
  lead_id uuid references leads (id) on delete cascade,
  customer_id uuid references customers (id) on delete set null,
  type appointment_type not null,
  status appointment_status not null default 'requested',
  scheduled_date date not null,
  window_start text,
  window_end text,
  notes text,
  created_at timestamptz not null default now(),
  constraint appointments_job_or_lead check (job_id is not null or lead_id is not null)
);
create index appointments_job_id_idx on appointments (job_id);
create index appointments_scheduled_date_idx on appointments (scheduled_date);

-- ---------------------------------------------------------------------------
-- ToughTrack™ field operations: photos, documents, messages, daily logs, ETA
-- ---------------------------------------------------------------------------
create table job_photos (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  url text not null,
  category photo_category not null,
  visibility photo_visibility not null default 'internal',
  caption text,
  taken_at timestamptz not null default now(),
  uploaded_by uuid not null references profiles (id)
);
create index job_photos_job_id_idx on job_photos (job_id);

create table job_documents (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  name text not null,
  url text not null,
  visibility document_visibility not null default 'internal',
  uploaded_at timestamptz not null default now()
);
create index job_documents_job_id_idx on job_documents (job_id);

create table messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs (id) on delete cascade,
  sender_id uuid not null references profiles (id),
  sender_role user_role not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index messages_job_id_idx on messages (job_id);

create table daily_job_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  log_date date not null,
  crew_members text[] not null default '{}',
  arrival_time timestamptz,
  departure_time timestamptz,
  hours_on_site numeric(5, 2),
  work_completed text not null default '',
  tasks_completed text[] not null default '{}',
  tasks_partial text[] not null default '{}',
  progress_percent int check (progress_percent between 0 and 100),
  materials_used text,
  equipment_used text,
  issues text,
  weather text,
  delay_reason text,
  customer_notes text,
  internal_notes text,
  photo_ids uuid[] not null default '{}',
  tomorrow_plan text,
  tomorrow_eta_start timestamptz,
  tomorrow_eta_end timestamptz,
  tomorrow_expected_hours numeric(5, 2),
  published boolean not null default false,
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now(),
  unique (job_id, log_date)
);
create index daily_job_logs_job_id_idx on daily_job_logs (job_id);

create table daily_eta_status (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  status_date date not null,
  crew_status crew_status not null default 'not_started',
  eta_window_start timestamptz,
  eta_window_end timestamptz,
  estimated_hours_on_site numeric(5, 2),
  estimated_departure timestamptz,
  todays_scope text,
  delay_reason text,
  tomorrow_expected_arrival text,
  updated_at timestamptz not null default now(),
  unique (job_id, status_date)
);
create index daily_eta_status_job_id_idx on daily_eta_status (job_id);

create table weather_delays (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  reason text not null,
  new_expected_date date,
  updated_pour_date date,
  customer_message text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index weather_delays_job_id_idx on weather_delays (job_id);

-- ---------------------------------------------------------------------------
-- Add-ons / project upsells
-- ---------------------------------------------------------------------------
create table addon_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  image_url text,
  price_low numeric(12, 2),
  price_high numeric(12, 2),
  applicable_service_types text[] not null default '{}',
  active boolean not null default true
);

create table addon_requests (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  addon_id uuid references addon_catalog (id) on delete set null,
  custom_description text,
  ai_suggested_range jsonb,
  status addon_request_status not null default 'requested',
  created_at timestamptz not null default now()
);
create index addon_requests_job_id_idx on addon_requests (job_id);

-- ---------------------------------------------------------------------------
-- Contractor bidding
-- ---------------------------------------------------------------------------
create table bid_opportunities (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs (id) on delete set null,
  project_name text not null,
  scope text not null,
  location text not null,
  start_date date,
  completion_requirement text,
  bid_deadline date not null,
  labor_included boolean not null default true,
  materials_included boolean not null default true,
  equipment_included boolean not null default true,
  insurance_requirements text,
  special_instructions text,
  document_urls text[] not null default '{}',
  status bid_opportunity_status not null default 'draft',
  invited_contractor_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table bids (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references bid_opportunities (id) on delete cascade,
  contractor_id uuid not null references contractors (id) on delete cascade,
  labor_cost numeric(12, 2),
  material_cost numeric(12, 2),
  equipment_cost numeric(12, 2),
  total numeric(12, 2),
  estimated_duration_days int,
  notes text,
  document_urls text[] not null default '{}',
  status bid_status not null default 'invited',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (opportunity_id, contractor_id)
);
create index bids_opportunity_id_idx on bids (opportunity_id);
create index bids_contractor_id_idx on bids (contractor_id);

alter table contracts add constraint contracts_bid_id_fkey foreign key (bid_id) references bids (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Job costing
-- ---------------------------------------------------------------------------
create table job_expenses (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  category job_expense_category not null,
  description text not null,
  amount numeric(12, 2) not null,
  incurred_at timestamptz not null default now()
);
create index job_expenses_job_id_idx on job_expenses (job_id);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles (id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null default '',
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_recipient_id_idx on notifications (recipient_id);

-- ---------------------------------------------------------------------------
-- Owner-configurable settings (generic key/value; see src/config/*.ts for the
-- shapes stored under each key — business_info, pricing_rules, stage_template,
-- ai_concierge_rules, invoice_settings, notification_preferences, ...)
-- ---------------------------------------------------------------------------
create table app_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles (id)
);

-- =============================================================================
-- Row Level Security
-- =============================================================================

create or replace function auth_role() returns user_role
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth_role() in ('owner_admin', 'office_staff', 'field_crew'), false);
$$;

create or replace function is_owner_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth_role() = 'owner_admin', false);
$$;

create or replace function current_customer_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from customers where profile_id = auth.uid();
$$;

create or replace function current_contractor_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from contractors where profile_id = auth.uid();
$$;

alter table profiles enable row level security;
alter table customers enable row level security;
alter table contractors enable row level security;
alter table leads enable row level security;
alter table jobs enable row level security;
alter table estimates enable row level security;
alter table job_stage_progress enable row level security;
alter table contracts enable row level security;
alter table signatures enable row level security;
alter table change_orders enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table appointments enable row level security;
alter table job_photos enable row level security;
alter table job_documents enable row level security;
alter table messages enable row level security;
alter table daily_job_logs enable row level security;
alter table daily_eta_status enable row level security;
alter table weather_delays enable row level security;
alter table addon_catalog enable row level security;
alter table addon_requests enable row level security;
alter table bid_opportunities enable row level security;
alter table bids enable row level security;
alter table job_expenses enable row level security;
alter table notifications enable row level security;
alter table app_settings enable row level security;

-- profiles: self read/update; staff read all; only owner_admin may change `role`
create policy profiles_self_select on profiles for select using (id = auth.uid() or is_staff());
create policy profiles_self_update on profiles for update using (id = auth.uid() or is_owner_admin())
  with check (id = auth.uid() or is_owner_admin());
create policy profiles_staff_insert on profiles for insert with check (id = auth.uid() or is_owner_admin());

-- customers
create policy customers_staff_all on customers for all using (is_staff()) with check (is_staff());
create policy customers_self_select on customers for select using (profile_id = auth.uid());

-- contractors
create policy contractors_staff_all on contractors for all using (is_staff()) with check (is_staff());
create policy contractors_self_select on contractors for select using (profile_id = auth.uid());
create policy contractors_self_update on contractors for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy contractors_public_insert on contractors for insert with check (profile_id = auth.uid());

-- leads: staff full access; anyone (including anonymous visitors) may submit
create policy leads_staff_all on leads for all using (is_staff()) with check (is_staff());
create policy leads_public_insert on leads for insert with check (true);

-- jobs
create policy jobs_staff_all on jobs for all using (is_staff()) with check (is_staff());
create policy jobs_customer_select on jobs for select using (customer_id = current_customer_id());

-- estimates
create policy estimates_staff_all on estimates for all using (is_staff()) with check (is_staff());
create policy estimates_customer_select on estimates for select using (customer_id = current_customer_id());
create policy estimates_customer_approve on estimates for update using (customer_id = current_customer_id())
  with check (customer_id = current_customer_id() and status in ('approved', 'declined'));

-- job_stage_progress
create policy stage_progress_staff_all on job_stage_progress for all using (is_staff()) with check (is_staff());
create policy stage_progress_customer_select on job_stage_progress for select using (
  job_id in (select id from jobs where customer_id = current_customer_id())
);

-- contracts
create policy contracts_staff_all on contracts for all using (is_staff()) with check (is_staff());
create policy contracts_customer_select on contracts for select using (
  job_id in (select id from jobs where customer_id = current_customer_id())
);
create policy contracts_contractor_select on contracts for select using (
  bid_id in (select id from bids where contractor_id = current_contractor_id())
);

-- signatures: visible to staff, and to the party who owns the related contract
create policy signatures_staff_all on signatures for all using (is_staff()) with check (is_staff());
create policy signatures_customer_select on signatures for select using (
  contract_id in (select id from contracts where job_id in (select id from jobs where customer_id = current_customer_id()))
);
create policy signatures_customer_insert on signatures for insert with check (
  signer_role = 'customer' and contract_id in (
    select id from contracts where job_id in (select id from jobs where customer_id = current_customer_id())
  )
);

-- change_orders
create policy change_orders_staff_all on change_orders for all using (is_staff()) with check (is_staff());
create policy change_orders_customer_select on change_orders for select using (
  job_id in (select id from jobs where customer_id = current_customer_id())
);
create policy change_orders_customer_respond on change_orders for update using (
  job_id in (select id from jobs where customer_id = current_customer_id())
) with check (status in ('approved', 'declined'));

-- invoices & payments
create policy invoices_staff_all on invoices for all using (is_staff()) with check (is_staff());
create policy invoices_customer_select on invoices for select using (customer_id = current_customer_id());
create policy payments_staff_all on payments for all using (is_staff()) with check (is_staff());
create policy payments_customer_select on payments for select using (
  invoice_id in (select id from invoices where customer_id = current_customer_id())
);

-- appointments
create policy appointments_staff_all on appointments for all using (is_staff()) with check (is_staff());
create policy appointments_customer_select on appointments for select using (customer_id = current_customer_id());
create policy appointments_public_insert on appointments for insert with check (customer_id is null and job_id is null);

-- job_photos: customers only see customer-visible photos on their own jobs; public_gallery is world-readable
create policy job_photos_staff_all on job_photos for all using (is_staff()) with check (is_staff());
create policy job_photos_public_gallery on job_photos for select using (visibility = 'public_gallery');
create policy job_photos_customer_select on job_photos for select using (
  visibility = 'customer' and job_id in (select id from jobs where customer_id = current_customer_id())
);

-- job_documents
create policy job_documents_staff_all on job_documents for all using (is_staff()) with check (is_staff());
create policy job_documents_customer_select on job_documents for select using (
  visibility = 'customer' and job_id in (select id from jobs where customer_id = current_customer_id())
);

-- messages
create policy messages_staff_all on messages for all using (is_staff()) with check (is_staff());
create policy messages_customer_select on messages for select using (
  job_id in (select id from jobs where customer_id = current_customer_id())
);
create policy messages_customer_insert on messages for insert with check (
  sender_id = auth.uid() and job_id in (select id from jobs where customer_id = current_customer_id())
);

-- daily_job_logs: customers only ever see published logs on their own job
create policy daily_logs_staff_all on daily_job_logs for all using (is_staff()) with check (is_staff());
create policy daily_logs_customer_select on daily_job_logs for select using (
  published = true and job_id in (select id from jobs where customer_id = current_customer_id())
);

-- daily_eta_status
create policy eta_staff_all on daily_eta_status for all using (is_staff()) with check (is_staff());
create policy eta_customer_select on daily_eta_status for select using (
  job_id in (select id from jobs where customer_id = current_customer_id())
);

-- weather_delays
create policy weather_delays_staff_all on weather_delays for all using (is_staff()) with check (is_staff());
create policy weather_delays_customer_select on weather_delays for select using (
  job_id in (select id from jobs where customer_id = current_customer_id())
);

-- addon_catalog: public read for active items (needed by public site + AI concierge)
create policy addon_catalog_staff_all on addon_catalog for all using (is_staff()) with check (is_staff());
create policy addon_catalog_public_select on addon_catalog for select using (active = true);

-- addon_requests
create policy addon_requests_staff_all on addon_requests for all using (is_staff()) with check (is_staff());
create policy addon_requests_customer_select on addon_requests for select using (
  job_id in (select id from jobs where customer_id = current_customer_id())
);
create policy addon_requests_customer_insert on addon_requests for insert with check (
  job_id in (select id from jobs where customer_id = current_customer_id())
);

-- bid_opportunities: staff full; contractors only see opportunities they were invited to
create policy bid_opportunities_staff_all on bid_opportunities for all using (is_staff()) with check (is_staff());
create policy bid_opportunities_contractor_select on bid_opportunities for select using (
  current_contractor_id() = any (invited_contractor_ids)
);

-- bids: staff full; contractors only see/manage their own bids
create policy bids_staff_all on bids for all using (is_staff()) with check (is_staff());
create policy bids_contractor_select on bids for select using (contractor_id = current_contractor_id());
create policy bids_contractor_insert on bids for insert with check (contractor_id = current_contractor_id());
create policy bids_contractor_update on bids for update using (contractor_id = current_contractor_id())
  with check (contractor_id = current_contractor_id());

-- job_expenses: staff only — profitability is never exposed to customers or contractors
create policy job_expenses_staff_all on job_expenses for all using (is_staff()) with check (is_staff());

-- notifications: each user sees only their own
create policy notifications_self_select on notifications for select using (recipient_id = auth.uid());
create policy notifications_self_update on notifications for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
create policy notifications_staff_insert on notifications for insert with check (is_staff());

-- app_settings: staff manage everything; a small allow-list of keys is safe for public consumption
create policy app_settings_staff_all on app_settings for all using (is_staff()) with check (is_staff());
create policy app_settings_public_select on app_settings for select using (key in ('business_public_info'));

-- =============================================================================
-- New-user provisioning: mirror auth.users -> profiles automatically
-- =============================================================================
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'customer'),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================================
-- Seed: default add-on catalog (safe, non-customer, non-financial reference data)
-- =============================================================================
insert into addon_catalog (name, description, price_low, price_high, applicable_service_types) values
  ('Driveway Extension', 'Widen or lengthen your existing driveway for extra parking.', 2000, 4500, '{driveway}'),
  ('Additional Walkway', 'Connect your driveway to your front entry with a matching walkway.', 1200, 2600, '{driveway,patio}'),
  ('Patio Addition', 'Add a backyard patio to your current project.', 4500, 9000, '{driveway}'),
  ('Concrete Steps', 'Add code-compliant entry steps.', 900, 2200, '{driveway,patio}'),
  ('Decorative Border', 'Stamped or colored border accent around your slab.', 600, 1600, '{driveway,patio}'),
  ('Stamped Concrete Upgrade', 'Upgrade to a stamped stone or brick pattern.', 1500, null, '{driveway,patio}'),
  ('Sealing', 'Protective sealer for long-term durability.', 350, 900, '{driveway,patio}'),
  ('Drainage Improvements', 'Add drainage channels or grading to route water away from structures.', null, null, '{driveway,patio}'),
  ('Basketball Goal Pad', 'Reinforced pad for an in-ground basketball goal.', 700, 1400, '{driveway}'),
  ('Mailbox Pad', 'Small reinforced pad for a new mailbox post.', 250, 500, '{driveway}'),
  ('Custom Add-On', 'Something else in mind? Tell us and we will follow up with pricing.', null, null, '{driveway,patio,slab,commercial}');
