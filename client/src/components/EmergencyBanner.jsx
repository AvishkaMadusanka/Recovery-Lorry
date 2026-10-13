import { PhoneCall, ShieldAlert, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function EmergencyBanner() {
  const { language } = useAuth();
  const isSi = language === 'si';

  return (
    <div className="emergency-banner">
      <div className="emergency-inner">
        <div className="banner-badge">
          <ShieldAlert size={16} />
          <span>{isSi ? 'ශ්‍රී ලංකා හදිසි සේවා' : 'Sri Lanka Emergency Hotlines:'}</span>
        </div>

        <div className="hotline-chips">
          <a href="tel:1990" className="hotline-chip ambulance">
            <span className="dot" />
            <strong>1990</strong>
            <small>{isSi ? 'සුව සැරිය ගිලන්රථ' : 'Ambulance (Suwa Seriya)'}</small>
          </a>

          <a href="tel:119" className="hotline-chip police">
            <span className="dot" />
            <strong>119</strong>
            <small>{isSi ? 'පොලිස් හදිසි ඇමතුම්' : 'Police Emergency'}</small>
          </a>

          <a href="tel:1969" className="hotline-chip expressway">
            <span className="dot" />
            <strong>1969</strong>
            <small>{isSi ? 'අධිවේගී මාර්ග හදිසි' : 'Expressway Control'}</small>
          </a>

          <a href="tel:110" className="hotline-chip fire">
            <span className="dot" />
            <strong>110</strong>
            <small>{isSi ? 'ගිනි නිවීම්' : 'Fire & Rescue'}</small>
          </a>
        </div>
      </div>
    </div>
  );
}
