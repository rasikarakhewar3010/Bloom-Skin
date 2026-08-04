import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import './App.css';

// --- Static Load Pages for Instant Navigation ---
import HomePage from './HomePage/HomePage';
import GuidePage from './GuidePage/GuidePage';
import ContactUsPage from './ContactUs/ContactUsPage';
import LoginSignup from './LoginPage/LoginSignup';
import AuthCallback from './LoginPage/AuthCallback';
import AIChatPage from './AIChatPage/AIChatPage';
import Page from './HistoryPage/Page';
import DashboardPage from './DashboardPage/DashboardPage';
import RecommendationsPage from './RecommendationsPage/RecommendationsPage';
import RoutinePage from './RoutinePage/RoutinePage';
import NotFoundPage from './components/NotFoundPage';
import ForgotPassword from './LoginPage/ForgotPassword';
import ResetPassword from './LoginPage/ResetPassword';
import PrivacyPolicy from './Legal/PrivacyPolicy';
import TermsOfService from './Legal/TermsOfService';

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Protected Routes — Require Authentication */}
        <Route path="/aichat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Page /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
        <Route path="/routine" element={<ProtectedRoute><RoutinePage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
