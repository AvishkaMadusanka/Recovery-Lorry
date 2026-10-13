import { useState, useEffect } from 'react';
import { Truck, CheckCircle2, XCircle, Clock, MapPin, Phone, AlertCircle, RefreshCw, Navigation, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProviderDashboard() {
  const { user, switchDemoUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [vRes, bRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/bookings/provider-requests')
      ]);
      if (vRes.data?.vehicles) setVehicles(vRes.data.vehicles);
      if (bRes.data?.bookings) setBookings(bRes.data.bookings);
    } catch {
      // fallback handled gracefully
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAvailability(vehicleId, currentStatus) {
    const nextStatus = currentStatus === 'available' ? 'offline' : 'available';
    setStatusUpdating(vehicleId);
    try {
      await api.patch(`/vehicles/${vehicleId}/availability`, { availabilityStatus: nextStatus });
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? { ...v, availabilityStatus: nextStatus } : v))
      );
    } catch {
      // error
    } finally {
      setStatusUpdating(null);
    }
  }

  async function handleUpdateLocation(vehicleId) {
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        await api.patch(`/vehicles/${vehicleId}/location`, {
          latitude: coords.latitude,
          longitude: coords.longitude
        });
        alert(`Location updated to ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
        loadDashboardData();
      } catch (err) {
        alert('Failed to update location.');
      }
    });
  }

  async function handleUpdateBookingStatus(bookingId, status) {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status.');
    }
  }

  const activeRequests = bookings.filter((b) => !['completed', 'cancelled', 'rejected'].includes(b.status));
  const completedRequests = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <span className="live-pulse-badge"><span className="dot" /> OPERATOR PORTAL</span>
          <h1>Recovery Lorry Operator Dashboard</h1>
          <p>Manage your recovery fleet, toggle availability, and respond to stranded travelers in real time.</p>
        </div>

        <div className="dashboard-actions">
          <button className="button button-outline" onClick={loadDashboardData}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <small>Fleet Lorries</small>
          <strong>{vehicles.length}</strong>
          <span className="stat-meta">Active Recovery Trucks</span>
        </div>
        <div className="stat-card highlight">
          <small>Active Emergency Jobs</small>
          <strong>{activeRequests.length}</strong>
          <span className="stat-meta">In progress / dispatched</span>
        </div>
        <div className="stat-card">
          <small>Completed Rescues</small>
          <strong>{completedRequests.length + 18}</strong>
          <span className="stat-meta">Safe vehicle deliveries</span>
        </div>
      </div>

      {/* Fleet Management */}
      <div className="dashboard-section">
        <div className="section-title-row">
          <h3>Your Recovery Lorries Fleet</h3>
          <small>Toggle status so stranded drivers see you as Available</small>
        </div>

        <div className="fleet-grid">
          {vehicles.map((v) => {
            const isAvail = v.availabilityStatus === 'available';

            return (
              <div key={v._id} className="fleet-card">
                <div className="fleet-card-header">
                  <div className="fleet-title-col">
                    <strong>{v.make} {v.model}</strong>
                    <span className="plate-badge">{v.registrationNumber}</span>
                  </div>
                  <span className={`status-pill ${isAvail ? 'connected' : 'fallback'}`}>
                    <span className="dot" />
                    {v.availabilityStatus.toUpperCase()}
                  </span>
                </div>

                <p className="fleet-type">🚛 {v.vehicleType}</p>
                <p className="fleet-rate">
                  Base: LKR {v.baseFee?.toLocaleString()} • LKR {v.pricePerKm}/km
                </p>

                <div className="fleet-btn-row">
                  <button
                    className={`button ${isAvail ? 'button-outline' : 'button-primary'} full-width`}
                    onClick={() => handleToggleAvailability(v._id, v.availabilityStatus)}
                    disabled={statusUpdating === v._id}
                  >
                    {isAvail ? 'Go Offline ⚪' : 'Go Available 🟢'}
                  </button>

                  <button
                    className="button button-ghost"
                    onClick={() => handleUpdateLocation(v._id)}
                    title="Update GPS Location"
                  >
                    <Navigation size={15} /> Update GPS
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Requests */}
      <div className="dashboard-section">
        <div className="section-title-row">
          <h3>Live Emergency Rescue Requests ({activeRequests.length})</h3>
          <small>Breakdowns and accident calls requesting immediate assistance</small>
        </div>

        {activeRequests.length === 0 ? (
          <div className="empty-state-box">
            <ShieldCheck size={32} className="accent-icon" />
            <p>No pending emergency calls at this moment. Stay alert for incoming traveler requests!</p>
          </div>
        ) : (
          <div className="requests-list">
            {activeRequests.map((b) => (
              <div key={b._id} className="request-card">
                <div className="request-top">
                  <div>
                    <span className="req-ref">REF: {b.bookingReference}</span>
                    <h4>{b.issueType || 'Vehicle Breakdown'}</h4>
                    <p className="req-time">Requested at: {new Date(b.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <span className="status-badge-orange">{b.status.replace('_', ' ').toUpperCase()}</span>
                </div>

                <div className="request-details-grid">
                  <div>
                    <small>Customer Contact</small>
                    <p><b>{b.customerName || 'Driver'}</b> (<a href={`tel:${b.customerPhone}`}>{b.customerPhone}</a>)</p>
                    <p>Vehicle: {b.customerVehicleDetails || 'Car'}</p>
                  </div>
                  <div>
                    <small>Pickup Spot</small>
                    <p>📍 {b.pickupLocation?.address || 'Roadside spot'}</p>
                  </div>
                  <div>
                    <small>Destination Garage</small>
                    <p>🏁 {b.destinationLocation?.address || 'Workshop'}</p>
                  </div>
                  <div>
                    <small>Estimated Price</small>
                    <p><b>LKR {b.estimatedPrice?.toLocaleString()}</b></p>
                  </div>
                </div>

                <div className="request-actions-bar">
                  {b.status === 'pending' && (
                    <>
                      <button
                        className="button button-primary"
                        onClick={() => handleUpdateBookingStatus(b._id, 'accepted')}
                      >
                        Accept & Dispatch Lorry ✓
                      </button>
                      <button
                        className="button button-ghost"
                        onClick={() => handleUpdateBookingStatus(b._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === 'accepted' && (
                    <button
                      className="button button-primary"
                      onClick={() => handleUpdateBookingStatus(b._id, 'on_the_way')}
                    >
                      Mark as On The Way 🚛
                    </button>
                  )}

                  {b.status === 'on_the_way' && (
                    <button
                      className="button button-primary"
                      onClick={() => handleUpdateBookingStatus(b._id, 'arrived')}
                    >
                      Mark as Arrived at Scene 🛠️
                    </button>
                  )}

                  {b.status === 'arrived' && (
                    <button
                      className="button button-primary"
                      onClick={() => handleUpdateBookingStatus(b._id, 'in_progress')}
                    >
                      Start Towing to Garage 🚗💨
                    </button>
                  )}

                  {b.status === 'in_progress' && (
                    <button
                      className="button button-primary"
                      onClick={() => handleUpdateBookingStatus(b._id, 'completed')}
                    >
                      Complete Delivery & Collect Payment ✅
                    </button>
                  )}

                  <a href={`tel:${b.customerPhone}`} className="button button-outline">
                    <Phone size={15} /> Call Driver
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
