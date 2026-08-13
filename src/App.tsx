import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { RequireRole } from '@/lib/auth/RequireRole';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { CustomerPortalLayout } from '@/pages/customer/CustomerPortalLayout';
import { ContractorPortalLayout } from '@/pages/contractor/ContractorPortalLayout';

// Public
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ServicesIndexPage = lazy(() => import('@/pages/public/ServicesIndexPage'));
const ServiceDetailPage = lazy(() => import('@/pages/public/ServiceDetailPage'));
const ResidentialPage = lazy(() => import('@/pages/public/ResidentialPage'));
const CommercialPage = lazy(() => import('@/pages/public/CommercialPage'));
const GalleryPage = lazy(() => import('@/pages/public/GalleryPage'));
const RequestEstimatePage = lazy(() => import('@/pages/public/RequestEstimatePage'));
const ScheduleSiteVisitPage = lazy(() => import('@/pages/public/ScheduleSiteVisitPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const FaqPage = lazy(() => import('@/pages/public/FaqPage'));
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/public/TermsPage'));
const AiConciergePage = lazy(() => import('@/pages/public/AiConciergePage'));
const ContractorsLandingPage = lazy(() => import('@/pages/public/ContractorsLandingPage'));
const CustomerLoginPage = lazy(() => import('@/pages/public/CustomerLoginPage'));
const ContractorLoginPage = lazy(() => import('@/pages/public/ContractorLoginPage'));
const StaffLoginPage = lazy(() => import('@/pages/public/StaffLoginPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/public/UnauthorizedPage'));

// Admin
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const LeadsPage = lazy(() => import('@/pages/admin/LeadsPage'));
const CustomersPage = lazy(() => import('@/pages/admin/CustomersPage'));
const CustomerDetailPage = lazy(() => import('@/pages/admin/CustomerDetailPage'));
const JobsPage = lazy(() => import('@/pages/admin/JobsPage'));
const JobDetailPage = lazy(() => import('@/pages/admin/JobDetailPage'));
const EstimatesPage = lazy(() => import('@/pages/admin/EstimatesPage'));
const EstimateBuilderPage = lazy(() => import('@/pages/admin/EstimateBuilderPage'));
const ContractsAdminPage = lazy(() => import('@/pages/admin/ContractsAdminPage'));
const InvoicesAdminPage = lazy(() => import('@/pages/admin/InvoicesAdminPage'));
const ChangeOrdersAdminPage = lazy(() => import('@/pages/admin/ChangeOrdersAdminPage'));
const AppointmentsAdminPage = lazy(() => import('@/pages/admin/AppointmentsAdminPage'));
const ContractorsAdminPage = lazy(() => import('@/pages/admin/ContractorsAdminPage'));
const BidOpportunitiesPage = lazy(() => import('@/pages/admin/BidOpportunitiesPage'));
const BidOpportunityDetailPage = lazy(() => import('@/pages/admin/BidOpportunityDetailPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

// Customer portal
const CustomerDashboardPage = lazy(() => import('@/pages/customer/CustomerDashboardPage'));
const CustomerProjectPage = lazy(() => import('@/pages/customer/CustomerProjectPage'));
const CustomerPhotosPage = lazy(() => import('@/pages/customer/CustomerPhotosPage'));
const CustomerEstimatesPage = lazy(() => import('@/pages/customer/CustomerEstimatesPage'));
const CustomerContractsPage = lazy(() => import('@/pages/customer/CustomerContractsPage'));
const CustomerChangeOrdersPage = lazy(() => import('@/pages/customer/CustomerChangeOrdersPage'));
const CustomerInvoicesPage = lazy(() => import('@/pages/customer/CustomerInvoicesPage'));
const CustomerAppointmentsPage = lazy(() => import('@/pages/customer/CustomerAppointmentsPage'));
const CustomerMessagesPage = lazy(() => import('@/pages/customer/CustomerMessagesPage'));
const CustomerEnhancePage = lazy(() => import('@/pages/customer/CustomerEnhancePage'));
const CustomerAiConciergePage = lazy(() => import('@/pages/customer/CustomerAiConciergePage'));
const CustomerDocumentsPage = lazy(() => import('@/pages/customer/CustomerDocumentsPage'));
const CustomerProfilePage = lazy(() => import('@/pages/customer/CustomerProfilePage'));

// Contractor portal
const ContractorDashboardPage = lazy(() => import('@/pages/contractor/ContractorDashboardPage'));
const ContractorProfilePage = lazy(() => import('@/pages/contractor/ContractorProfilePage'));
const ContractorOpportunitiesPage = lazy(() => import('@/pages/contractor/ContractorOpportunitiesPage'));
const ContractorOpportunityDetailPage = lazy(() => import('@/pages/contractor/ContractorOpportunityDetailPage'));
const ContractorBidsPage = lazy(() => import('@/pages/contractor/ContractorBidsPage'));
const ContractorDocumentsPage = lazy(() => import('@/pages/contractor/ContractorDocumentsPage'));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading Tough Concrete Construction…" />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesIndexPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/residential" element={<ResidentialPage />} />
          <Route path="/commercial" element={<CommercialPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/request-estimate" element={<RequestEstimatePage />} />
          <Route path="/schedule-site-visit" element={<ScheduleSiteVisitPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/ai-concierge" element={<AiConciergePage />} />
          <Route path="/contractors" element={<ContractorsLandingPage />} />
          <Route path="/portal/login" element={<CustomerLoginPage />} />
          <Route path="/contractors/login" element={<ContractorLoginPage />} />
          <Route path="/admin/login" element={<StaffLoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <RequireRole roles={['owner_admin', 'office_staff', 'field_crew']} redirectTo="/admin/login">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="estimates" element={<EstimatesPage />} />
          <Route path="estimates/:id" element={<EstimateBuilderPage />} />
          <Route path="contracts" element={<ContractsAdminPage />} />
          <Route path="invoices" element={<InvoicesAdminPage />} />
          <Route path="change-orders" element={<ChangeOrdersAdminPage />} />
          <Route path="appointments" element={<AppointmentsAdminPage />} />
          <Route path="contractors" element={<ContractorsAdminPage />} />
          <Route path="bids" element={<BidOpportunitiesPage />} />
          <Route path="bids/:id" element={<BidOpportunityDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/:tab" element={<SettingsPage />} />
        </Route>

        <Route
          path="/portal/*"
          element={
            <RequireRole roles={['customer']} redirectTo="/portal/login">
              <CustomerPortalLayout />
            </RequireRole>
          }
        >
          <Route index element={<CustomerDashboardPage />} />
          <Route path="project" element={<CustomerProjectPage />} />
          <Route path="photos" element={<CustomerPhotosPage />} />
          <Route path="estimates" element={<CustomerEstimatesPage />} />
          <Route path="contracts" element={<CustomerContractsPage />} />
          <Route path="change-orders" element={<CustomerChangeOrdersPage />} />
          <Route path="invoices" element={<CustomerInvoicesPage />} />
          <Route path="appointments" element={<CustomerAppointmentsPage />} />
          <Route path="messages" element={<CustomerMessagesPage />} />
          <Route path="enhance" element={<CustomerEnhancePage />} />
          <Route path="ai-concierge" element={<CustomerAiConciergePage />} />
          <Route path="documents" element={<CustomerDocumentsPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
        </Route>

        <Route
          path="/contractors/app/*"
          element={
            <RequireRole roles={['contractor']} redirectTo="/contractors/login">
              <ContractorPortalLayout />
            </RequireRole>
          }
        >
          <Route index element={<ContractorDashboardPage />} />
          <Route path="profile" element={<ContractorProfilePage />} />
          <Route path="opportunities" element={<ContractorOpportunitiesPage />} />
          <Route path="opportunities/:id" element={<ContractorOpportunityDetailPage />} />
          <Route path="bids" element={<ContractorBidsPage />} />
          <Route path="documents" element={<ContractorDocumentsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
