import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import FindDonor from './pages/FindDonor';
import RegisterDonor from './pages/RegisterDonor';
import Login from './pages/Login';
import BloodRequest from './pages/BloodRequest';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-donor" element={<FindDonor />} />
              <Route path="/register-donor" element={<RegisterDonor />} />
              <Route path="/login" element={<Login />} />
              <Route path="/blood-request" element={<BloodRequest />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
