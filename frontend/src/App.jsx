import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import './App.css';

// --- Lazy Load Pages for Performance ---
const HomePage = lazy(() => import('./HomePage/HomePage'));
const GuidePage = lazy(() => import('./GuidePage/GuidePage'));
const ContactUsPage = lazy(() => import('./ContactUs/ContactUsPage'));
const LoginSignup = lazy(() => import('./LoginPage/LoginSignup'));
const AuthCallback = lazy(() => import('./LoginPage/AuthCallback'));
const AIChatPage = lazy(() => import('./AIChatPage/AIChatPage'));
const Page = lazy(() => import('./HistoryPage/Page'));
const DashboardPage = lazy(() => import('./DashboardPage/DashboardPage'));
const RecommendationsPage = lazy(() => import('./RecommendationsPage/RecommendationsPage'));
const RoutinePage = lazy(() => import('./RoutinePage/RoutinePage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const ForgotPassword = lazy(() => import('./LoginPage/ForgotPassword'));
const ResetPassword = lazy(() => import('./LoginPage/ResetPassword'));

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Simple fallback during lazy loading
const PageFallback = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-12 w-12 bg-pink-100 rounded-full mb-4"></div>
      <div className="h-2 w-24 bg-pink-50 rounded"></div>
    </div>
  </div>
);

function AppWrapper() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes — Require Authentication */}
          <Route path="/aichat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Page /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
          <Route path="/routine" element={<ProtectedRoute><RoutinePage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
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
