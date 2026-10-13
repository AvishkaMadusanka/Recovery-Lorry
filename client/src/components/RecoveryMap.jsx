import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Truck, MapPin, Navigation, Phone, CheckCircle2 } from 'lucide-react';

// Fix Vite leaflet icon resolution
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom User Location Pin
const userPinIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div class="user-marker-pulse"></div>
    <div class="user-marker-dot">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="3" fill="#ff4d4f"></circle>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
});

// Custom Recovery Lorry Pin
function createTruckIcon(plateNumber, isAvailable = true) {
  return L.divIcon({
    className: 'custom-truck-marker',
    html: `
      <div class="truck-marker-wrap ${isAvailable ? 'available' : 'busy'}">
        <span class="truck-icon">🚛</span>
        <span class="truck-tag">${plateNumber.replace('WP ', '').replace('CP ', '').replace('SP ', '')}</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
}

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.flyTo(center, zoom || 12, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function RecoveryMap({
  userLocation,
  destinationLocation,
  lorries = [],
  radiusKm = 25,
  selectedLorryId,
  onSelectLorry,
  onLocationChange
}) {
  const defaultCenter = [6.9271, 79.8612]; // Colombo default
  const center = userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter;

  return (
    <div className="recovery-map-wrapper">
      <div className="map-legend">
        <span className="legend-item"><span className="legend-dot user-dot" /> Your Breakdown Point</span>
        <span className="legend-item"><span className="legend-dot lorry-dot" /> Recovery Lorries ({lorries.length})</span>
        <span className="legend-hint">💡 Click anywhere on map to set pickup</span>
      </div>

      <MapContainer
        center={center}
        zoom={userLocation ? 12 : 10}
        scrollWheelZoom={true}
        className="leaflet-full-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} zoom={userLocation ? 12 : 10} />
        <MapClickHandler onMapClick={onLocationChange} />

        {/* User Breakdown Marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userPinIcon}>
              <Popup>
                <div className="map-popup-card">
                  <strong style={{ color: '#ff4d4f' }}>📍 Breakdown / Accident Location</strong>
                  <p>{userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}</p>
                  <small>Recovery lorries are calculated from this point.</small>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#1769e0',
                fillColor: '#1769e0',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 8'
              }}
            />
          </>
        )}

        {/* Recovery Lorries */}
        {lorries.map((lorry) => {
          const coords = lorry.currentLocation?.coordinates;
          if (!coords || coords.length < 2) return null;
          const [lon, lat] = coords;
          const isSelected = selectedLorryId === lorry._id;

          return (
            <Marker
              key={lorry._id}
              position={[lat, lon]}
              icon={createTruckIcon(lorry.registrationNumber, lorry.availabilityStatus === 'available')}
              eventHandlers={{
                click: () => onSelectLorry && onSelectLorry(lorry)
              }}
            >
              <Popup>
                <div className="map-popup-lorry">
                  <div className="popup-lorry-header">
                    <div>
                      <strong>{lorry.make} {lorry.model}</strong>
                      <span className="popup-plate">{lorry.registrationNumber}</span>
                    </div>
                    <span className="popup-badge">{lorry.distanceKm || 0} km away</span>
                  </div>

                  <p className="popup-type">🚛 {lorry.vehicleType}</p>
                  <p className="popup-provider">🏢 {lorry.provider?.businessName || 'Verified Sri Lanka Recovery'}</p>

                  <div className="popup-pricing">
                    <span>Base Fee: <b>LKR {lorry.baseFee?.toLocaleString()}</b></span>
                    <span>Per Km: <b>LKR {lorry.pricePerKm}/km</b></span>
                  </div>

                  {lorry.provider?.phone && (
                    <a
                      href={`tel:${lorry.provider.phone}`}
                      className="popup-phone-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={13} /> Call: {lorry.provider.phone}
                    </a>
                  )}

                  <button
                    className={`popup-select-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectLorry && onSelectLorry(lorry)}
                  >
                    {isSelected ? '✓ Selected' : 'Select This Recovery Lorry'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
