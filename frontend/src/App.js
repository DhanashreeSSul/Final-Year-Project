import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NetworkProvider } from './context/NetworkContext';

// Shared Layout Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import BottomNavigation from './components/shared/BottomNavigation';
import OfflineBanner from './components/shared/OfflineBanner';
import LanguageModal from './components/shared/LanguageModal';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PublicOpportunitiesPage from './pages/PublicOpportunitiesPage';
import PrivacySecurityPage from './pages/PrivacySecurityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Women Platform Pages
import Dashboard from './pages/Dashboard';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import ChatbotPage from './pages/ChatbotPage';
import WomanRoadmapPage from './pages/WomanRoadmapPage';
import WomanEntrepreneurshipPage from './pages/WomanEntrepreneurshipPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsPage from './pages/ApplicationsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

// Foundation / NGO Pages
import OrgDashboardPage from './pages/OrgDashboardPage';
import OrgJobsPage from './pages/OrgJobsPage';
import OrgApplicantsPage from './pages/OrgApplicantsPage';
import OrgCoursesPage from './pages/OrgCoursesPage';
import OrgProfilePage from './pages/OrgProfilePage';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading platform...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole === 'org' && user.role !== 'org' && user.role !== 'foundation') {
    return <Navigate to="/woman/dashboard" replace />;
  }
  if (allowedRole === 'user' && (user.role === 'org' || user.role === 'foundation')) {
    return <Navigate to="/foundation/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <OfflineBanner />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/opportunities" element={<PublicOpportunitiesPage />} />
          <Route path="/privacy" element={<PrivacySecurityPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Women Role Routes */}
          <Route path="/woman/dashboard" element={<ProtectedRoute allowedRole="user"><Dashboard /></ProtectedRoute>} />
          <Route path="/woman/jobs" element={<ProtectedRoute allowedRole="user"><JobsPage /></ProtectedRoute>} />
          <Route path="/woman/jobs/:id" element={<ProtectedRoute allowedRole="user"><JobDetailPage /></ProtectedRoute>} />
          <Route path="/woman/courses" element={<ProtectedRoute allowedRole="user"><CoursesPage /></ProtectedRoute>} />
          <Route path="/woman/courses/:id" element={<ProtectedRoute allowedRole="user"><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/woman/schemes" element={<ProtectedRoute allowedRole="user"><SchemesPage /></ProtectedRoute>} />
          <Route path="/woman/schemes/:id" element={<ProtectedRoute allowedRole="user"><SchemeDetailPage /></ProtectedRoute>} />
          <Route path="/woman/chat" element={<ProtectedRoute allowedRole="user"><ChatbotPage /></ProtectedRoute>} />
          <Route path="/woman/roadmap" element={<ProtectedRoute allowedRole="user"><WomanRoadmapPage /></ProtectedRoute>} />
          <Route path="/woman/entrepreneurship" element={<ProtectedRoute allowedRole="user"><WomanEntrepreneurshipPage /></ProtectedRoute>} />
          <Route path="/woman/applications" element={<ProtectedRoute allowedRole="user"><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/woman/profile" element={<ProtectedRoute allowedRole="user"><ProfilePage /></ProtectedRoute>} />
          <Route path="/woman/notifications" element={<ProtectedRoute allowedRole="user"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/woman/settings" element={<ProtectedRoute allowedRole="user"><SettingsPage /></ProtectedRoute>} />

          {/* Legacy Shortcuts (Forward to Women pages) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/schemes/:id" element={<SchemeDetailPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />

          {/* Foundation / NGO Routes */}
          <Route path="/foundation/dashboard" element={<ProtectedRoute allowedRole="org"><OrgDashboardPage /></ProtectedRoute>} />
          <Route path="/foundation/jobs" element={<ProtectedRoute allowedRole="org"><OrgJobsPage /></ProtectedRoute>} />
          <Route path="/foundation/post-job" element={<ProtectedRoute allowedRole="org"><OrgJobsPage /></ProtectedRoute>} />
          <Route path="/foundation/applicants" element={<ProtectedRoute allowedRole="org"><OrgApplicantsPage /></ProtectedRoute>} />
          <Route path="/foundation/programs" element={<ProtectedRoute allowedRole="org"><OrgCoursesPage /></ProtectedRoute>} />
          <Route path="/foundation/profile" element={<ProtectedRoute allowedRole="org"><OrgProfilePage /></ProtectedRoute>} />
          <Route path="/foundation/notifications" element={<ProtectedRoute allowedRole="org"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/foundation/settings" element={<ProtectedRoute allowedRole="org"><SettingsPage /></ProtectedRoute>} />

          {/* Legacy Foundation Shortcuts */}
          <Route path="/org/dashboard" element={<ProtectedRoute allowedRole="org"><OrgDashboardPage /></ProtectedRoute>} />
          <Route path="/org/jobs" element={<ProtectedRoute allowedRole="org"><OrgJobsPage /></ProtectedRoute>} />
          <Route path="/org/courses" element={<ProtectedRoute allowedRole="org"><OrgCoursesPage /></ProtectedRoute>} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNavigation />
      <Footer />
      <LanguageModal />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NetworkProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
                  fontSize: '14px',
                  fontWeight: '600'
                }
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </NetworkProvider>
    </BrowserRouter>
  );
}
