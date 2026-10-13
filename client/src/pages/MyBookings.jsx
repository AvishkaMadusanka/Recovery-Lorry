import { useState, useEffect } from 'react';
import { Clock, Truck, MapPin, Phone, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data?.bookings) {
        setBookings(res.data.bookings);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <span className="live-pulse-badge"><span className="dot" /> RESCUE HISTORY</span>
          <h1>My Recovery Bookings</h1>
          <p>Track ongoing vehicle recovery requests and review past roadside assistance records.</p>
        </div>

        <div className="dashboard-actions">
          <Link to="/find" className="button button-primary">
            + Request Emergency Lorry
          </Link>
          <button className="button button-outline" onClick={fetchBookings}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="tracker-card loading-state">
          <Clock className="spin accent-icon" size={28} />
          <p>Loading your booking history...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state-box">
          <Truck size={36} className="accent-icon" />
          <h3>No recovery requests yet</h3>
          <p>If you experience an unexpected breakdown or accident, find and book the nearest lorry immediately.</p>
          <Link to="/find" className="button button-primary">
            Find Nearby Recovery Lorries <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="requests-list">
          {bookings.map((b) => (
            <div key={b._id} className="request-card">
              <div className="request-top">
                <div>
                  <span className="req-ref">REF: {b.bookingReference}</span>
                  <h4>{b.issueType || 'Emergency Roadside Recovery'}</h4>
                  <p className="req-time">Booked: {new Date(b.createdAt).toLocaleString()}</p>
                </div>
                <span className={`status-badge-orange ${b.status === 'completed' ? 'completed-badge' : ''}`}>
                  {b.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="request-details-grid">
                <div>
                  <small>Vehicle Details</small>
                  <p><b>{b.customerVehicleDetails || 'Breakdown Vehicle'}</b></p>
                  <p>Phone: {b.customerPhone}</p>
                </div>
                <div>
                  <small>Breakdown Pickup Spot</small>
                  <p>📍 {b.pickupLocation?.address || 'Roadside'}</p>
                </div>
                <div>
                  <small>Destination Workshop / Garage</small>
                  <p>🏁 {b.destinationLocation?.address || 'Authorized Garage'}</p>
                </div>
                <div>
                  <small>Cost Estimate</small>
                  <p><b>LKR {b.estimatedPrice?.toLocaleString()}</b> ({b.estimatedDistanceKm || 8} km)</p>
                </div>
              </div>

              <div className="request-actions-bar">
                <Link to={`/find`} className="button button-primary">
                  View Live Status Tracker <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
