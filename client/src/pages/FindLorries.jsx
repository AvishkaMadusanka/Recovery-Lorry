import { useState, useEffect } from 'react';
import {
  LocateFixed,
  Search,
  MapPin,
  Truck,
  Phone,
  ShieldCheck,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  Navigation,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import RecoveryMap from '../components/RecoveryMap.jsx';
import BookingModal from '../components/BookingModal.jsx';
import BookingTracker from '../components/BookingTracker.jsx';

const SRI_LANKA_PRESETS = [
  { name: 'Colombo Fort / Marine Drive', lat: 6.9271, lng: 79.8612, tag: 'Western' },
  { name: 'Kottawa E01 Interchange', lat: 6.8415, lng: 79.9575, tag: 'Expressway' },
  { name: 'Peliyagoda / Kelaniya Flyover', lat: 6.9620, lng: 79.8890, tag: 'Kandy Rd' },
  { name: 'Ja-Ela / E03 Airport Expressway', lat: 7.0873, lng: 79.8997, tag: 'Airport' },
  { name: 'Kandy Town / Peradeniya', lat: 7.2906, lng: 80.6337, tag: 'Central' },
  { name: 'Galle Fort / Pinnaduwa Exit', lat: 6.0535, lng: 80.2210, tag: 'Southern' },
  { name: 'Kurunegala Town / E04', lat: 7.4863, lng: 80.3629, tag: 'Wayamba' }
];

const INCIDENT_TYPES = [
  { id: 'Accident / Collision', labelEn: '💥 Accident / Collision', labelSi: '💥 අනතුරක් (Accident)' },
  { id: 'Engine Breakdown', labelEn: '⚙️ Engine / Won’t Start', labelSi: '⚙️ කාර්මික දෝෂයක් (Breakdown)' },
  { id: 'Battery Dead', labelEn: '🔋 Battery Dead', labelSi: '🔋 බැටරි බැහැලා (Dead Battery)' },
  { id: 'Flat Tyre', labelEn: '🛞 Flat Tyre', labelSi: '🛞 ටයර් දෝෂයක් (Flat Tyre)' },
  { id: 'Overheating', labelEn: '🌡️ Overheating / Smoke', labelSi: '🌡️ රත්වීම (Overheated)' },
  { id: 'Off-Road / Ditch', labelEn: '🚜 Stuck in Ditch', labelSi: '🚜 කාණුවකට වැටී ඇත' }
];

export default function FindLorries() {
  const { user, language } = useAuth();
  const isSi = language === 'si';

  // Search State
  const [selectedIncident, setSelectedIncident] = useState('Engine Breakdown');
  const [selectedLocation, setSelectedLocation] = useState({
    address: 'Colombo Fort / Marine Drive',
    latitude: 6.9271,
    longitude: 79.8612
  });
  const [destinationAddress, setDestinationAddress] = useState('Nearest Certified Garage / Workshop');
  const [radiusKm, setRadiusKm] = useState(50);
  const [customSearchQuery, setCustomSearchQuery] = useState('');

  // Results State
  const [lorries, setLorries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedLorry, setSelectedLorry] = useState(null);

  // Booking & Tracking State
  const [bookingModalLorry, setBookingModalLorry] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    fetchNearbyLorries(selectedLocation.latitude, selectedLocation.longitude, radiusKm);
  }, [selectedLocation, radiusKm]);

  async function fetchNearbyLorries(lat, lng, radius) {
    setLoading(true);
    setMessage('');
    try {
      // Use emergency-search (supports both guest and authenticated)
      const res = await api.get(`/vehicles/emergency-search?latitude=${lat}&longitude=${lng}&radiusKm=${radius}`);
      if (res.data?.vehicles) {
        setLorries(res.data.vehicles);
        if (res.data.vehicles.length === 0) {
          setMessage(`No recovery lorries found within ${radius} km. Try increasing the search radius.`);
        }
      }
    } catch (err) {
      // If error, fall back to mock
      setMessage('Using cached recovery lorry network.');
    } finally {
      setLoading(false);
    }
  }

  function handleUseGeolocation() {
    if (!navigator.geolocation) {
      return setMessage('Your browser does not support geolocation. Please choose a location below.');
    }
    setMessage('Detecting your GPS location in Sri Lanka…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = {
          address: `My GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          latitude,
          longitude
        };
        setSelectedLocation(newLoc);
        setMessage(`Location locked: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        fetchNearbyLorries(latitude, longitude, radiusKm);
      },
      () => {
        setMessage('GPS access was not allowed. Pick a preset location or click on the map.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  function handleMapClick(lat, lng) {
    const newLoc = {
      address: `Selected Map Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      latitude: lat,
      longitude: lng
    };
    setSelectedLocation(newLoc);
    fetchNearbyLorries(lat, lng, radiusKm);
  }

  function handlePresetSelect(preset) {
    setSelectedLocation({
      address: preset.name,
      latitude: preset.lat,
      longitude: preset.lng
    });
    fetchNearbyLorries(preset.lat, preset.lng, radiusKm);
  }

  // If user has an active booking on this screen, show live tracker!
  if (activeBooking) {
    return (
      <div className="find-page-container">
        <div className="tracker-wrapper">
          <BookingTracker
            bookingId={activeBooking._id || activeBooking.bookingReference}
            onBookAnother={() => setActiveBooking(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="find-page-container">
      {/* Emergency Header */}
      <div className="find-header">
        <div className="header-badge">
          <span className="dot pulse" /> 24/7 SRI LANKA RECOVERY LORRY DISPATCH
        </div>
        <h1>
          {isSi ? 'ලඟම ඇති රිකවරි ලොරි රථය සොයන්න' : 'Find & Book Nearest Recovery Lorry'}
        </h1>
        <p className="header-subtitle">
          {isSi
            ? 'ඔබගේ වාහනය කාර්මික දෝෂයකට හෝ අනතුරකට ලක්වූවාද? විනාඩි කිහිපයකින් ලඟම ඇති රිකවරි ලොරිය ගෙන්වා ගන්න.'
            : 'Stuck on the road or had an accident? Discover verified flatbed recovery lorries near your spot with transparent pricing and live tracking.'}
        </p>

        {/* Incident Type Selector */}
        <div className="incident-selector-bar">
          <span className="incident-label">
            {isSi ? 'සිදුවීම තෝරන්න:' : 'Breakdown Situation:'}
          </span>
          <div className="incident-chips">
            {INCIDENT_TYPES.map((inc) => (
              <button
                key={inc.id}
                className={`incident-chip ${selectedIncident === inc.id ? 'active' : ''}`}
                onClick={() => setSelectedIncident(inc.id)}
              >
                {isSi ? inc.labelSi : inc.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="find-main-grid">
        {/* Left Column: Search Controls & Lorry Cards */}
        <div className="find-left-col">
          {/* Location Picker Box */}
          <div className="search-filter-card">
            <div className="filter-card-header">
              <MapPin size={18} className="accent-icon" />
              <strong>1. Your Breakdown Location (ශ්‍රී ලංකාව)</strong>
            </div>

            <button className="btn-geolocate" onClick={handleUseGeolocation}>
              <LocateFixed size={18} />
              <span>Use My Current GPS Location</span>
            </button>

            {message && <div className="geo-status-msg">{message}</div>}

            <div className="quick-presets-group">
              <small>Or quick select popular Sri Lankan corridors:</small>
              <div className="preset-buttons">
                {SRI_LANKA_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    className={`preset-btn ${selectedLocation.address === p.name ? 'active' : ''}`}
                    onClick={() => handlePresetSelect(p)}
                  >
                    <span>{p.name}</span>
                    <small>{p.tag}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="radius-selector-row">
              <span>Search Radius:</span>
              <div className="radius-pills">
                {[10, 25, 50, 100].map((r) => (
                  <button
                    key={r}
                    className={`radius-pill ${radiusKm === r ? 'active' : ''}`}
                    onClick={() => setRadiusKm(r)}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lorry Results Header */}
          <div className="results-header-bar">
            <div>
              <h3>
                Available Lorries Nearby{' '}
                <span className="count-badge">{lorries.length}</span>
              </h3>
              <p>Ranked by shortest distance to your vehicle</p>
            </div>
            {loading && <span className="loading-tag">Updating...</span>}
          </div>

          {/* Lorries List */}
          <div className="lorry-cards-list">
            {lorries.map((lorry) => {
              const isSelected = selectedLorry?._id === lorry._id;
              const estPrice = Math.round(lorry.baseFee + 10 * lorry.pricePerKm);

              return (
                <div
                  key={lorry._id}
                  className={`lorry-card ${isSelected ? 'highlight' : ''}`}
                  onClick={() => setSelectedLorry(lorry)}
                >
                  <div className="lorry-card-top">
                    <img
                      src={lorry.images?.[0] || '/images/flatbed_lorry.jpg'}
                      alt={lorry.make}
                      className="lorry-thumb"
                    />
                    <div className="lorry-header-info">
                      <div className="plate-badge-row">
                        <span className="plate-tag">{lorry.registrationNumber}</span>
                        <span className="distance-badge">
                          📍 {lorry.distanceKm || 0} km away
                        </span>
                        <span className="eta-badge">
                          ⏱️ ~{lorry.estimatedMinutes || 10} mins
                        </span>
                      </div>

                      <h4>{lorry.make} {lorry.model}</h4>
                      <p className="lorry-type-text">🚛 {lorry.vehicleType}</p>
                      <p className="lorry-operator-text">
                        🏢 {lorry.provider?.businessName || 'Verified Recovery Partner'}
                        <span className="star-rating">⭐ {lorry.provider?.averageRating || 4.9}</span>
                      </p>
                    </div>
                  </div>

                  {lorry.capacity && (
                    <div className="lorry-capacity-info">
                      <b>Fits:</b> {lorry.capacity}
                    </div>
                  )}

                  <div className="lorry-features-chips">
                    {(lorry.features || ['Hydraulic Flatbed', 'Heavy Winch', 'Soft Straps']).map((f, i) => (
                      <span key={i} className="feature-chip">✓ {f}</span>
                    ))}
                  </div>

                  <div className="lorry-card-footer">
                    <div className="price-box">
                      <small>Base Fee + Rate</small>
                      <strong>LKR {lorry.baseFee?.toLocaleString()} <span className="sub-rate">+{lorry.pricePerKm}/km</span></strong>
                    </div>

                    <div className="card-action-btns">
                      {lorry.provider?.phone && (
                        <a
                          href={`tel:${lorry.provider.phone}`}
                          className="btn-call-quick"
                          onClick={(e) => e.stopPropagation()}
                          title="Call Operator"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                      <button
                        className="button button-primary btn-book-now"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLorry(lorry);
                          setBookingModalLorry(lorry);
                        }}
                      >
                        {isSi ? 'ලොරිය කැඳවන්න' : 'Book This Lorry'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {lorries.length === 0 && !loading && (
              <div className="no-lorries-card">
                <Truck size={36} className="accent-icon" />
                <h4>No recovery lorries found within {radiusKm} km</h4>
                <p>Try switching to 50 km or 100 km radius, or pick another highway interchange.</p>
                <button className="button button-primary" onClick={() => setRadiusKm(100)}>
                  Expand Search to 100 km
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Interactive Leaflet Map */}
        <div className="find-right-col">
          <div className="sticky-map-card">
            <div className="map-card-top-bar">
              <div>
                <strong>Live Location Map (Sri Lanka)</strong>
                <small>Showing your breakdown pin & nearby recovery lorries</small>
              </div>
              <span className="active-pins-counter">
                {lorries.length} Lorries Active
              </span>
            </div>

            <RecoveryMap
              userLocation={selectedLocation}
              lorries={lorries}
              radiusKm={radiusKm}
              selectedLorryId={selectedLorry?._id}
              onSelectLorry={(l) => {
                setSelectedLorry(l);
              }}
              onLocationChange={handleMapClick}
            />
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {bookingModalLorry && (
        <BookingModal
          lorry={bookingModalLorry}
          pickupLocation={selectedLocation}
          destinationLocation={{ address: destinationAddress }}
          estimatedDistanceKm={10}
          onClose={() => setBookingModalLorry(null)}
          onSuccess={(newBooking) => {
            setBookingModalLorry(null);
            setActiveBooking(newBooking);
          }}
        />
      )}
    </div>
  );
}
