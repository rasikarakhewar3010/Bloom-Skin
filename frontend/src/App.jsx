import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import './App.css';
import BloomLoader from './HomePage/BloomLoader';
import HomePage from './HomePage/HomePage';
// import LoginPage from './pages/LoginPage';
import GuidePage from './GuidePage/GuidePage';
import ContactUs from './ContactUs/ContactUs';
import NotFoundPage from './components/NotFoundPage';
import ContactUsPage from './ContactUs/ContactUsPage';
import LoginSignup from './LoginPage/LoginSignup';
import AuthCallback from "./LoginPage/AuthCallback"; // 👈 import this

import { AuthProvider } from "./context/AuthContext"; // ✅ NEW
import AIChatPage from './AIChatPage/AIChatPage';


function AppWrapper() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaderAlreadyShown = sessionStorage.getItem('loaderShown');

    if (location.pathname === '/' && !loaderAlreadyShown) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('loaderShown', 'true');
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading && location.pathname === '/') {
    return <BloomLoader onComplete={() => setLoading(false)} />;
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/aichat" element={<AIChatPage />} /> 

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
