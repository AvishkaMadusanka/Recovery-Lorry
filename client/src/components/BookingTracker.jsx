import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  MessageSquare,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MapPin,
  Truck
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const STATUS_STEPS = [
  { key: 'pending', titleEn: 'Request Sent', titleSi: 'ඉල්ලීම යොමු කෙරිණි', desc: 'Waiting for operator confirmation' },
  { key: 'accepted', titleEn: 'Operator Dispatched', titleSi: 'රියදුරු පිටත් විය', desc: 'Driver confirmed & prepping lorry' },
  { key: 'on_the_way', titleEn: 'Lorry On The Way', titleSi: 'ලොරි රථය මාර්ගයේ', desc: 'Approaching your breakdown spot' },
  { key: 'arrived', titleEn: 'Arrived at Scene', titleSi: 'ස්ථානයට ළඟා විය', desc: 'Lorry at your vehicle location' },
  { key: 'in_progress', titleEn: 'Towing in Progress', titleSi: 'ඇදගෙන යාම ක්‍රියාත්මකයි', desc: 'Loaded on flatbed, en route to garage' },
  { key: 'completed', titleEn: 'Safely Delivered', titleSi: 'සාර්ථකව භාර දෙන ලදී', desc: 'Job completed & vehicle secured' }
];

export default function BookingTracker({ bookingId, onBookAnother }) {
  const { language } = useAuth();
  const isSi = language === 'si';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(false);

  useEffect(() => {
    fetchBooking();
    const interval = setInterval(fetchBooking, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    let timer;
    if (autoSimulate && booking && booking.status !== 'completed' && booking.status !== 'cancelled') {
      timer = setTimeout(() => {
        handleAdvanceStatus();
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [autoSimulate, booking]);

  async function fetchBooking() {
    try {
      const res = await api.get(`/bookings/${bookingId}`);
      if (res.data?.booking) {
        setBooking(res.data.booking);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleAdvanceStatus() {
    setAdvancing(true);
    try {
      const res = await api.post(`/bookings/${booking._id || bookingId}/advance-step`);
      if (res.data?.booking) {
        setBooking(res.data.booking);
      }
    } catch {
      // ignore
    } finally {
      setAdvancing(false);
    }
  }

  if (loading && !booking) {
    return (
      <div className="tracker-card loading-state">
        <Clock className="spin accent-icon" size={32} />
        <p>Loading live recovery tracker...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="tracker-card error-state">
        <p>Booking details not found.</p>
        <button className="button button-primary" onClick={onBookAnother}>Find another lorry</button>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === booking.status);
  const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';

  return (
    <div className="booking-tracker-container">
      {/* Tracker Header */}
      <div className="tracker-header">
        <div className="tracker-ref-block">
          <span className="live-pulse-badge">
            <span className="dot" /> LIVE TRACKING
          </span>
          <h2>Reference: {booking.bookingReference}</h2>
          <p className="booking-time">
            Requested: {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="tracker-actions-right">
          <button
            className={`sim-btn ${autoSimulate ? 'active' : ''}`}
            onClick={() => setAutoSimulate(!autoSimulate)}
          >
            <Sparkles size={14} /> {autoSimulate ? 'Auto Simulating (On)' : 'Auto Simulate'}
          </button>
          <button
            className="sim-step-btn"
            onClick={handleAdvanceStatus}
            disabled={advancing || booking.status === 'completed'}
          >
            Advance Status ⏭️
          </button>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="tracker-stepper">
        {STATUS_STEPS.map((step, idx) => {
          const isDone = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;

          return (
            <div
              key={step.key}
              className={`step-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="step-circle">
                {isDone ? <CheckCircle2 size={18} /> : <span>0{idx + 1}</span>}
              </div>
              <div className="step-text">
                <strong>{isSi ? step.titleSi : step.titleEn}</strong>
                <small>{step.desc}</small>
              </div>
              {idx < STATUS_STEPS.length - 1 && <div className="step-connector" />}
            </div>
          );
        })}
      </div>

      {/* Main Info Columns */}
      <div className="tracker-grid">
        {/* Driver & Lorry Card */}
        <div className="tracker-panel driver-panel">
          <div className="panel-title">
            <Truck size={20} className="accent-icon" />
            <h3>Assigned Recovery Lorry</h3>
          </div>

          <div className="driver-profile-card">
            <img
              src="/images/flatbed_lorry.jpg"
              alt="Recovery lorry"
              className="driver-truck-thumb"
            />
            <div className="driver-details">
              <strong>{booking.vehicle?.make || 'Isuzu'} {booking.vehicle?.model || 'Forward Tilt-Tray'}</strong>
              <span className="plate-badge">{booking.vehicle?.registrationNumber || 'WP LF-8241'}</span>
              <p className="driver-name">Driver: {booking.vehicle?.driverName || 'Nuwan Perera'}</p>
              <p className="driver-rating">⭐ 4.9 Verified Highway Operator</p>
            </div>
          </div>

          <div className="quick-dial-group">
            <a
              href={`tel:${booking.vehicle?.driverPhone || '+94771234567'}`}
              className="action-call-btn"
            >
              <Phone size={16} /> Call Driver Directly
            </a>
            <a
              href={`https://wa.me/94771234567?text=Hello,%20I%20have%20an%20active%20RescueNow%20booking%20${booking.bookingReference}`}
              target="_blank"
              rel="noreferrer"
              className="action-whatsapp-btn"
            >
              <MessageSquare size={16} /> WhatsApp
            </a>
          </div>

          <div className="safety-guideline-box">
            <h4>⚠️ Emergency Roadside Safety Tips:</h4>
            <ul>
              <li>Turn on your hazard warning blinkers immediately.</li>
              <li>Place a warning triangle 45 meters behind the vehicle.</li>
              <li>Wait behind the highway crash barrier, away from moving traffic.</li>
            </ul>
          </div>
        </div>

        {/* Breakdown & Route Details */}
        <div className="tracker-panel route-panel">
          <div className="panel-title">
            <Navigation size={20} className="accent-icon" />
            <h3>Breakdown & Towing Route</h3>
          </div>

          <div className="route-timeline">
            <div className="route-point">
              <span className="route-dot pickup" />
              <div>
                <small>Pickup Spot (Your Vehicle)</small>
                <strong>{booking.pickupLocation?.address || 'Current Breakdown Location'}</strong>
              </div>
            </div>

            <div className="route-divider">
              <span>{booking.estimatedDistanceKm || 8} km towing distance</span>
            </div>

            <div className="route-point">
              <span className="route-dot dropoff" />
              <div>
                <small>Destination (Delivery Garage / Home)</small>
                <strong>{booking.destinationLocation?.address || 'Authorized Service Garage'}</strong>
              </div>
            </div>
          </div>

          <div className="breakdown-details-summary">
            <div className="summary-row">
              <span>Customer Name:</span>
              <b>{booking.customerName || 'Registered Driver'}</b>
            </div>
            <div className="summary-row">
              <span>Vehicle Details:</span>
              <b>{booking.customerVehicleDetails || 'Car'}</b>
            </div>
            <div className="summary-row">
              <span>Issue Reported:</span>
              <b>{booking.issueType || 'Breakdown'}</b>
            </div>
            <div className="summary-row price-highlight">
              <span>Estimated Towing Cost:</span>
              <em>LKR {Number(booking.estimatedPrice || 4500).toLocaleString()}</em>
            </div>
            <small className="payment-hint">Payment via Cash or Bank Transfer to driver upon delivery.</small>
          </div>

          <div className="tracker-footer-actions">
            <button className="button button-outline" onClick={onBookAnother}>
              + Book Another Recovery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
