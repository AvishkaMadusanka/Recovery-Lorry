import { useState } from 'react';
import { X, Truck, MapPin, Phone, Car, AlertTriangle, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BookingModal({
  lorry,
  pickupLocation,
  destinationLocation,
  estimatedDistanceKm = 10,
  onClose,
  onSuccess
}) {
  const { user, language } = useAuth();
  const isSi = language === 'si';

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [issueType, setIssueType] = useState('Engine Breakdown');
  const [issueDescription, setIssueDescription] = useState('');
  const [destinationAddress, setDestinationAddress] = useState(
    destinationLocation?.address || 'Nearest Certified Garage / Workshop'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const distance = Math.max(1, Number(estimatedDistanceKm || 8));
  const baseFee = lorry?.baseFee || 4000;
  const pricePerKm = lorry?.pricePerKm || 180;
  const estimatedPrice = Math.round(baseFee + distance * pricePerKm);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!customerPhone || customerPhone.trim().length < 9) {
      return setError(isSi ? 'කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න.' : 'Please enter a valid contact phone number.');
    }
    if (!customerName.trim()) {
      return setError(isSi ? 'කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.' : 'Please enter your name.');
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        providerId: lorry.providerId || lorry.provider?._id,
        recoveryVehicleId: lorry._id,
        customerName,
        customerPhone,
        customerVehicleDetails: vehicleDetails || 'Vehicle details to be confirmed by phone',
        issueType,
        issueDescription: issueDescription || `${issueType} at roadside`,
        pickupLocation: {
          address: pickupLocation?.address || 'Current Breakdown Spot',
          latitude: pickupLocation?.latitude || 6.9271,
          longitude: pickupLocation?.longitude || 79.8612
        },
        destinationLocation: {
          address: destinationAddress,
          latitude: destinationLocation?.latitude || pickupLocation?.latitude || 6.9271,
          longitude: destinationLocation?.longitude || pickupLocation?.longitude || 79.8612
        },
        estimatedDistanceKm: distance,
        estimatedPrice
      };

      const res = await api.post('/bookings', payload);
      if (res.data?.booking) {
        onSuccess(res.data.booking);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Truck size={24} className="accent-icon" />
            <div>
              <h3>{isSi ? 'රිකවරි ලොරි රථය වෙන්කරවා ගැනීම' : 'Book Recovery Lorry Now'}</h3>
              <p>{lorry.make} {lorry.model} ({lorry.registrationNumber})</p>
            </div>
          </div>
          <button className="icon-btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Selected Lorry Preview */}
        <div className="lorry-preview-banner">
          <div className="lorry-spec-row">
            <div>
              <strong>{lorry.vehicleType}</strong>
              <p>🏢 {lorry.provider?.businessName || 'Verified Operator'} • ⭐ {lorry.provider?.averageRating || 4.9}</p>
            </div>
            <div className="lorry-price-tag">
              <small>Est. Total</small>
              <strong>LKR {estimatedPrice.toLocaleString()}</strong>
            </div>
          </div>
          <div className="price-breakdown-sub">
            <span>Base Fee: LKR {baseFee.toLocaleString()}</span>
            <span>+ LKR {pricePerKm}/km × {distance} km</span>
            <span className="driver-phone-preview">📞 Driver: {lorry.driverPhone || lorry.provider?.phone}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {error && <div className="form-alert-error">{error}</div>}

          <div className="form-grid-2">
            <label className="form-field">
              <span>{isSi ? 'ඔබගේ නම' : 'Your Full Name'} *</span>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Kasun Silva"
              />
            </label>

            <label className="form-field">
              <span>{isSi ? 'දුරකථන අංකය (රියදුරු ඔබ අමතන අංකය)' : 'Mobile Phone Number'} *</span>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 077 123 4567"
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label className="form-field">
              <span>{isSi ? 'ඔබගේ වාහනය සහ අංකය' : 'Your Vehicle Make, Model & Plate'}</span>
              <input
                type="text"
                value={vehicleDetails}
                onChange={(e) => setVehicleDetails(e.target.value)}
                placeholder="e.g. Toyota Aqua (WP CAD-7890)"
              />
            </label>

            <label className="form-field">
              <span>{isSi ? 'සිදුවූ ගැටලුව' : 'Breakdown / Issue Type'}</span>
              <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                <option value="Accident / Collision">💥 Accident / Collision</option>
                <option value="Engine Breakdown">⚙️ Engine Failure / Won't Start</option>
                <option value="Overheating">🌡️ Engine Overheating / Smoke</option>
                <option value="Dead Battery">🔋 Battery Dead / Jumpstart</option>
                <option value="Flat Tyre">🛞 Flat Tyre / Wheel Damage</option>
                <option value="Off-Road / Ditch">🚜 Stuck in Ditch / Off-Road</option>
                <option value="Other Assistance">⚠️ Other Breakdown</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span>{isSi ? 'වාහනය ගෙන යා යුතු ස්ථානය (ගරාජය හෝ ලිපිනය)' : 'Destination / Delivery Garage or Address'}</span>
            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="e.g. Toyota Lanka Wattala, Nearest garage, or home"
            />
          </label>

          <label className="form-field">
            <span>{isSi ? 'අමතර සටහන් (ස්ථානය හඳුනාගැනීමට)' : 'Breakdown Notes & Landmark'}</span>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Near 34km post on Southern Expressway, car in hazard lane"
            />
          </label>

          <div className="payment-note">
            <ShieldCheck size={18} className="shield-icon" />
            <div>
              <strong>Cash or Direct Payment to Driver on Arrival</strong>
              <small>No upfront credit card required. Driver will confirm details by phone before dispatching.</small>
            </div>
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="button button-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={submitting}>
              {submitting ? 'Dispatching...' : (
                <>{isSi ? 'ලොරි රථය කැඳවන්න' : 'Confirm & Dispatch Recovery Lorry'} <ArrowRight size={17} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
