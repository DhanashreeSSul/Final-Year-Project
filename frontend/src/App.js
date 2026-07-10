import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import ChatbotPage from './pages/ChatbotPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsPage from './pages/ApplicationsPage';
import OrgDashboardPage from './pages/OrgDashboardPage';
import OrgJobsPage from './pages/OrgJobsPage';
import OrgCoursesPage from './pages/OrgCoursesPage';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-pink" style={{marginTop:80}} />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-pink" style={{marginTop:80}} />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:id" element={<SchemeDetailPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute><ApplicationsPage /></PrivateRoute>} />
        <Route path="/org/dashboard" element={<PrivateRoute roles={['org']}><OrgDashboardPage /></PrivateRoute>} />
        <Route path="/org/jobs" element={<PrivateRoute roles={['org']}><OrgJobsPage /></PrivateRoute>} />
        <Route path="/org/courses" element={<PrivateRoute roles={['org']}><OrgCoursesPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', borderRadius: 12, border: '1px solid #fce7f3' },
          success: { iconTheme: { primary: '#db2777', secondary: 'white' } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
