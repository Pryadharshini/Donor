import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import FindDonor from './pages/FindDonor';
import RegisterDonor from './pages/RegisterDonor';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import BloodRequest from './pages/BloodRequest';
import ActiveRequests from './pages/ActiveRequests';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-donor" element={<FindDonor />} />
              <Route path="/register-donor" element={<RegisterDonor />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/blood-request" element={<BloodRequest />} />
              <Route path="/active-requests" element={<ActiveRequests />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toast />
      </Router>
    </AppProvider>
  );
}
