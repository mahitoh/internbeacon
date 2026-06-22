import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Layouts
import PublicLayout    from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute  from './components/layout/ProtectedRoute';

// Public pages
import HomePage          from './pages/public/HomePage';
import AboutPage         from './pages/public/AboutPage';
import ContactPage       from './pages/public/ContactPage';
import OffersPage        from './pages/public/OffersPage';
import OfferDetailPage   from './pages/public/OfferDetailPage';
import ForCompaniesPage       from './pages/public/ForCompaniesPage';
import PricingPage            from './pages/public/PricingPage';
import CompanyPublicProfile   from './pages/public/CompanyPublicProfile';

// Auth pages
import LoginPage           from './pages/auth/LoginPage';
import RegisterStudentPage from './pages/auth/RegisterStudentPage';
import RegisterCompanyPage from './pages/auth/RegisterCompanyPage';
import AuthCallbackPage    from './pages/auth/AuthCallbackPage';
import OnboardingPage      from './pages/auth/OnboardingPage';
import ForgotPasswordPage  from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage   from './pages/auth/ResetPasswordPage';

// Student pages
import StudentDashboard      from './pages/student/StudentDashboard';
import StudentApplications   from './pages/student/StudentApplications';
import StudentProfile        from './pages/student/StudentProfile';
import StudentMessages       from './pages/student/StudentMessages';
import StudentSavedOffers    from './pages/student/StudentSavedOffers';
import StudentBrowseOffers   from './pages/student/StudentBrowseOffers';
import StudentOfferDetail    from './pages/student/StudentOfferDetail';
import StudentAnalytics          from './pages/student/StudentAnalytics';
import StudentInterviewCenter   from './pages/student/StudentInterviewCenter';
import StudentCompanies         from './pages/student/StudentCompanies';
import StudentCompanyProfile    from './pages/student/StudentCompanyProfile';

// Company pages
import CompanyDashboard    from './pages/company/CompanyDashboard';
import CompanyOffers       from './pages/company/CompanyOffers';
import PostOffer           from './pages/company/PostOffer';
import CompanyApplications from './pages/company/CompanyApplications';
import ApplicationDetail   from './pages/company/ApplicationDetail';
import CompanyProfile      from './pages/company/CompanyProfile';
import CompanyAnalytics    from './pages/company/CompanyAnalytics';
import CompanyMessages     from './pages/company/CompanyMessages';
import EditOffer           from './pages/company/EditOffer';

// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminOffers       from './pages/admin/AdminOffers';
import AdminApplications from './pages/admin/AdminApplications';

// Shared pages
import NotificationsPage from './pages/shared/NotificationsPage';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/"          element={<HomePage />} />
              <Route path="/about"     element={<AboutPage />} />
              <Route path="/contact"   element={<ContactPage />} />
              <Route path="/offers"           element={<OffersPage />} />
              <Route path="/offers/:id"       element={<OfferDetailPage />} />
              <Route path="/companies/:id"    element={<CompanyPublicProfile />} />
              <Route path="/for-companies"    element={<ForCompaniesPage />} />
              <Route path="/pricing"          element={<PricingPage />} />
            </Route>

            {/* Auth */}
            <Route path="/login"              element={<LoginPage />} />
            <Route path="/register/student"   element={<RegisterStudentPage />} />
            <Route path="/register/company"   element={<RegisterCompanyPage />} />
            <Route path="/auth/callback"      element={<AuthCallbackPage />} />
            <Route path="/forgot-password"    element={<ForgotPasswordPage />} />
            <Route path="/reset-password"     element={<ResetPasswordPage />} />
            <Route path="/onboarding"         element={
              <ProtectedRoute><OnboardingPage /></ProtectedRoute>
            } />

            {/* Student Dashboard */}
            <Route path="/student" element={
              <ProtectedRoute role="student">
                <DashboardLayout role="student" />
              </ProtectedRoute>
            }>
              <Route index                    element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"         element={<StudentDashboard />} />
              <Route path="offers"            element={<StudentBrowseOffers />} />
              <Route path="offers/:id"        element={<StudentOfferDetail />} />
              <Route path="applications"      element={<StudentApplications />} />
              <Route path="profile"           element={<StudentProfile />} />
              <Route path="messages"          element={<StudentMessages />} />
              <Route path="messages/:appId"   element={<StudentMessages />} />
              <Route path="analytics"         element={<StudentAnalytics />} />
              <Route path="interviews"        element={<StudentInterviewCenter />} />
              <Route path="companies"         element={<StudentCompanies />} />
              <Route path="companies/:id"     element={<StudentCompanyProfile />} />
              <Route path="saved"             element={<StudentSavedOffers />} />
              <Route path="notifications"     element={<NotificationsPage />} />
            </Route>

            {/* Company Dashboard */}
            <Route path="/company" element={
              <ProtectedRoute role="company">
                <DashboardLayout role="company" />
              </ProtectedRoute>
            }>
              <Route index                         element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"              element={<CompanyDashboard />} />
              <Route path="offers"                 element={<CompanyOffers />} />
              <Route path="offers/post"            element={<PostOffer />} />
              <Route path="offers/:id/edit"        element={<EditOffer />} />
              <Route path="applications"           element={<CompanyApplications />} />
              <Route path="applications/:appId"    element={<ApplicationDetail />} />
              <Route path="messages"               element={<CompanyMessages />} />
              <Route path="messages/:appId"        element={<CompanyMessages />} />
              <Route path="profile"                element={<CompanyProfile />} />
              <Route path="analytics"              element={<CompanyAnalytics />} />
              <Route path="notifications"          element={<NotificationsPage />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <DashboardLayout role="admin" />
              </ProtectedRoute>
            }>
              <Route index                   element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"        element={<AdminDashboard />} />
              <Route path="users"            element={<AdminUsers />} />
              <Route path="offers"           element={<AdminOffers />} />
              <Route path="applications"     element={<AdminApplications />} />
              <Route path="notifications"    element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
