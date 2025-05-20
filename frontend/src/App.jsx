import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import './App.css';
import BloomLoader from './HomePage/BloomLoader';
import HomePage from './HomePage/HomePage';
// import LoginPage from './pages/LoginPage';
import GuidePage from './GuidePage/GuidePage';

function AppWrapper() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaderAlreadyShown = sessionStorage.getItem('loaderShown');

    if (location.pathname === '/' && !loaderAlreadyShown) {
      // Show loader only once per session
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('loaderShown', 'true');
      }, 2500); // Adjust timing as needed

      return () => clearTimeout(timer);
    } else {
      // Skip loader for all other pages or if already shown
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading && location.pathname === '/') {
    return <BloomLoader onComplete={() => setLoading(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/guide" element={<GuidePage />} />
    </Routes>
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
