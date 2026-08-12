/**
 * Domain types shared across the app. These mirror the Supabase schema in
 * supabase/migrations/0001_init.sql — keep them in sync when the schema
 * changes. Using string literal unions (not TS enums) throughout because
 * they map 1:1 to Postgres `check` constraints / enum types.
 */

export type UserRole = 'owner_admin' | 'office_staff' | 'field_crew' | 'customer' | 'contractor';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export type ProjectCategory = 'residential' | 'commercial';

export interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string;
  project_address: string;
  category: ProjectCategory;
  service_type: string;
  length_ft: number | null;
  width_ft: number | null;
  thickness_in: number | null;
  removal_needed: boolean;
  desired_finish: string | null;
  desired_start_date: string | null;
  budget_range: string | null;
  description: string;
  photo_urls: string[];
  document_urls: string[];
  preferred_contact_method: 'phone' | 'email' | 'text';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: 'website' | 'ai_concierge' | 'phone' | 'referral' | 'other';
  customer_id: string | null;
}

export interface CustomerRecord {
  id: string;
  profile_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  billing_address: Address;
  notes: string | null;
  created_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export type EstimateStatus =
  | 'draft'
  | 'internal_review'
  | 'sent'
  | 'viewed'
  | 'approved'
  | 'declined'
  | 'expired'
  | 'converted';

export interface EstimateLineItemRecord {
  key: string;
  label: string;
  amount: number;
  category: 'material' | 'labor' | 'equipment' | 'other';
}

export interface Estimate {
  id: string;
  estimate_number: string;
  customer_id: string;
  job_id: string | null;
  lead_id: string | null;
  service_type: string;
  status: EstimateStatus;
  measurements: {
    lengthFt: number;
    widthFt: number;
    thicknessIn: number;
    wastePercent: number;
  };
  line_items: EstimateLineItemRecord[];
  subtotal: number;
  markup_percent: number;
  markup_amount: number;
  tax_amount: number;
  total: number;
  manual_override: boolean;
  deposit_amount: number;
  valid_until: string;
  sent_at: string | null;
  viewed_at: string | null;
  approved_at: string | null;
  declined_at: string | null;
  decline_reason: string | null;
  created_by: string;
  created_at: string;
}

export type JobStatus = 'lead' | 'estimating' | 'contracted' | 'scheduled' | 'in_progress' | 'complete' | 'cancelled';

export interface Job {
  id: string;
  job_number: string;
  customer_id: string;
  estimate_id: string | null;
  contract_id: string | null;
  job_type: string;
  category: ProjectCategory;
  address: Address;
  scope: string;
  status: JobStatus;
  contract_value: number;
  approved_change_order_total: number;
  estimated_completion_date: string | null;
  weather_delay_active: boolean;
  created_at: string;
}

export interface JobStageProgressRecord {
  id: string;
  job_id: string;
  stage_key: string;
  label: string;
  status: 'pending' | 'in_progress' | 'complete' | 'skipped';
  percent_within_stage: number;
  started_at: string | null;
  completed_at: string | null;
  sort_order: number;
}

export type ContractType =
  | 'customer_construction'
  | 'subcontractor_agreement'
  | 'change_order'
  | 'completion_acknowledgment'
  | 'warranty_acknowledgment'
  | 'lien_waiver';

export interface Contract {
  id: string;
  contract_number: string;
  type: ContractType;
  job_id: string | null;
  bid_id: string | null;
  version: number;
  status: 'draft' | 'sent' | 'signed' | 'superseded';
  document_url: string | null;
  content_snapshot: string;
  created_at: string;
}

export interface SignatureRecord {
  id: string;
  contract_id: string;
  signer_name: string;
  signer_role: 'customer' | 'owner_admin' | 'contractor';
  signature_data_url: string;
  signed_at: string;
  ip_address: string | null;
}

export type InvoiceType = 'deposit' | 'progress' | 'final' | 'change_order' | 'custom';
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  job_id: string;
  customer_id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  amount: number;
  amount_paid: number;
  due_date: string;
  notes: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  method: 'card' | 'ach' | 'check' | 'cash' | 'other';
  paid_at: string;
  reference: string | null;
  processor: 'stripe' | 'square' | 'manual' | null;
}

export type AppointmentType =
  | 'estimate'
  | 'site_measurement'
  | 'site_visit'
  | 'excavation'
  | 'prep'
  | 'forms'
  | 'inspection'
  | 'pour'
  | 'finish'
  | 'cleanup'
  | 'final_walkthrough';

export type AppointmentStatus =
  | 'requested'
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'cancelled'
  | 'completed'
  | 'weather_delay';

export interface Appointment {
  id: string;
  job_id: string | null;
  lead_id: string | null;
  customer_id: string | null;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduled_date: string;
  window_start: string | null;
  window_end: string | null;
  notes: string | null;
  created_at: string;
}

export type PhotoCategory =
  | 'before'
  | 'demolition'
  | 'excavation'
  | 'base_preparation'
  | 'forms'
  | 'reinforcement'
  | 'pour'
  | 'finishing'
  | 'completed'
  | 'warranty'
  | 'internal_documentation';

export type PhotoVisibility = 'internal' | 'customer' | 'public_gallery';

export interface JobPhoto {
  id: string;
  job_id: string;
  url: string;
  category: PhotoCategory;
  visibility: PhotoVisibility;
  caption: string | null;
  taken_at: string;
  uploaded_by: string;
}

export interface JobDocument {
  id: string;
  job_id: string;
  name: string;
  url: string;
  visibility: 'internal' | 'customer';
  uploaded_at: string;
}

export interface Message {
  id: string;
  job_id: string | null;
  sender_id: string;
  sender_role: UserRole;
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface DailyJobLog {
  id: string;
  job_id: string;
  log_date: string;
  crew_members: string[];
  arrival_time: string | null;
  departure_time: string | null;
  hours_on_site: number | null;
  work_completed: string;
  tasks_completed: string[];
  tasks_partial: string[];
  progress_percent: number | null;
  materials_used: string | null;
  equipment_used: string | null;
  issues: string | null;
  weather: string | null;
  delay_reason: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  photo_ids: string[];
  tomorrow_plan: string | null;
  tomorrow_eta_start: string | null;
  tomorrow_eta_end: string | null;
  tomorrow_expected_hours: number | null;
  published: boolean;
  created_by: string;
  created_at: string;
}

export type CrewStatus = 'not_started' | 'on_my_way' | 'arrived' | 'in_progress' | 'paused' | 'delayed' | 'complete_today';

export interface DailyEtaStatus {
  id: string;
  job_id: string;
  status_date: string;
  crew_status: CrewStatus;
  eta_window_start: string | null;
  eta_window_end: string | null;
  estimated_hours_on_site: number | null;
  estimated_departure: string | null;
  todays_scope: string | null;
  delay_reason: string | null;
  tomorrow_expected_arrival: string | null;
  updated_at: string;
}

export type ChangeOrderStatus = 'draft' | 'sent' | 'approved' | 'declined' | 'cancelled';

export interface ChangeOrder {
  id: string;
  change_order_number: string;
  job_id: string;
  requested_by: 'customer' | 'owner_admin';
  description: string;
  additional_labor: number;
  additional_materials: number;
  additional_equipment: number;
  added_days: number;
  added_cost: number;
  new_contract_total: number;
  updated_completion_estimate: string | null;
  status: ChangeOrderStatus;
  customer_signature_id: string | null;
  owner_signature_id: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface AddOnCatalogItem {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price_low: number | null;
  price_high: number | null;
  applicable_service_types: string[];
  active: boolean;
}

export interface AddOnRequest {
  id: string;
  job_id: string;
  addon_id: string | null;
  custom_description: string | null;
  ai_suggested_range: { low: number; high: number } | null;
  status: 'requested' | 'reviewing' | 'quoted' | 'converted_to_change_order' | 'declined';
  created_at: string;
}

export interface Contractor {
  id: string;
  profile_id: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: Address;
  service_area: string[];
  trade: string;
  ein_on_file: boolean;
  w9_url: string | null;
  insurance_cert_url: string | null;
  insurance_expiration: string | null;
  license_url: string | null;
  license_expiration: string | null;
  other_certs: string[];
  references_notes: string | null;
  internal_rating: number | null;
  status: 'pending' | 'approved' | 'not_approved';
  created_at: string;
}

export type BidOpportunityStatus = 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';

export interface BidOpportunity {
  id: string;
  job_id: string | null;
  project_name: string;
  scope: string;
  location: string;
  start_date: string | null;
  completion_requirement: string | null;
  bid_deadline: string;
  labor_included: boolean;
  materials_included: boolean;
  equipment_included: boolean;
  insurance_requirements: string | null;
  special_instructions: string | null;
  document_urls: string[];
  status: BidOpportunityStatus;
  invited_contractor_ids: string[];
  created_at: string;
}

export type BidStatus = 'invited' | 'viewed' | 'submitted' | 'revision_requested' | 'declined' | 'awarded' | 'not_awarded';

export interface Bid {
  id: string;
  opportunity_id: string;
  contractor_id: string;
  labor_cost: number | null;
  material_cost: number | null;
  equipment_cost: number | null;
  total: number | null;
  estimated_duration_days: number | null;
  notes: string | null;
  document_urls: string[];
  status: BidStatus;
  submitted_at: string | null;
  created_at: string;
}

export type NotificationType =
  | 'estimate_ready'
  | 'estimate_viewed'
  | 'estimate_approved'
  | 'appointment_confirmed'
  | 'appointment_reminder'
  | 'crew_on_the_way'
  | 'crew_arrived'
  | 'daily_progress_posted'
  | 'photos_added'
  | 'schedule_changed'
  | 'weather_delay'
  | 'change_order_sent'
  | 'change_order_approved'
  | 'invoice_sent'
  | 'payment_received'
  | 'contractor_bid_received'
  | 'contractor_bid_awarded'
  | 'contract_awaiting_signature';

export interface NotificationRecord {
  id: string;
  recipient_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export interface WeatherDelay {
  id: string;
  job_id: string;
  reason: string;
  new_expected_date: string | null;
  updated_pour_date: string | null;
  customer_message: string;
  active: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface JobExpense {
  id: string;
  job_id: string;
  category: 'material' | 'labor' | 'subcontractor' | 'equipment' | 'hauling' | 'disposal' | 'permit' | 'other';
  description: string;
  amount: number;
  incurred_at: string;
}
