import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import EmergencyBanner from './components/EmergencyBanner.jsx';
import Home from './pages/Home.jsx';
import FindLorries from './pages/FindLorries.jsx';
import ProviderDashboard from './pages/ProviderDashboard.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Login from './pages/Login.jsx';
import SimplePage from './pages/SimplePage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <EmergencyBanner />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<FindLorries />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/services"
            element={
              <SimplePage
                title="Sri Lanka Recovery & Roadside Services"
                text="From emergency highway flatbed towing to steep hill-country winch recovery, our verified local operators provide 24/7 roadside assistance across Colombo, Southern Expressway, Central hills, and coastline routes."
              />
            }
          />
          <Route
            path="/about"
            element={
              <SimplePage
                title="About RescueNow Sri Lanka"
                text="RescueNow was created to eliminate the fear and delay during vehicle breakdowns and accidents. By connecting stranded drivers with the nearest verified recovery lorry, we offer transparent LKR pricing, direct driver communication, and live dispatch tracking."
              />
            }
          />
          <Route
            path="*"
            element={
              <SimplePage
                title="Page Not Found"
                text="Looking for emergency help? Return to our search page to find nearby recovery lorries."
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}
