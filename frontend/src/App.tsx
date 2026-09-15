import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import HealthCheckPage from './pages/HealthCheckPage';
import AnalysisPage from './pages/AnalysisPage';
import DoctorsPage from './pages/DoctorsPage';
import NearbyCare from './pages/NearbyCare';
import ReportsPage from './pages/ReportsPage';
import HealthDashboard from './pages/HealthDashboard';
import HistoryPage from './pages/HistoryPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPage from './pages/PrivacyPage';

import { useEffect } from 'react';

// Protected route wrapper
function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading MediBridge AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* User protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/health-check" element={<ProtectedRoute><HealthCheckPage /></ProtectedRoute>} />
      <Route path="/analysis/:id?" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
      <Route path="/nearby-care" element={<ProtectedRoute><NearbyCare /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/health-dashboard" element={<ProtectedRoute><HealthDashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

      {/* Doctor-only routes */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute roles={['doctor', 'admin']}><DoctorDashboard /></ProtectedRoute>
      } />

      {/* Admin-only routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    // Set page title
    document.title = 'MediBridge AI — Intelligent Health Risk & Care Navigation';
  }, []);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
