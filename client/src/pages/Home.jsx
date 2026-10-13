import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BatteryWarning,
  CarFront,
  Clock3,
  MapPin,
  ShieldCheck,
  Wrench,
  PhoneCall,
  AlertOctagon,
  Sparkles,
  Truck,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const services = [
  {
    icon: CarFront,
    title: 'Hydraulic Flatbed Towing',
    titleSi: 'ෆ්ලැට්බෙඩ් රිකවරි ට්‍රක්',
    text: 'Safe tilt-tray transport for automatic cars, luxury sedans, electric vehicles, and SUVs without tyre wear.'
  },
  {
    icon: AlertOctagon,
    title: 'Accident Scene Recovery',
    titleSi: 'හදිසි අනතුරු රිකවරි සේවාව',
    text: 'Rapid clearance and safe transport from highways and city roads directly to insurance-approved garages.'
  },
  {
    icon: BatteryWarning,
    title: 'Breakdown & Jumpstart',
    titleSi: 'කාර්මික සහ බැටරි සහන',
    text: 'Flat battery jumpstarts, tyre changes, and lockout rescue right at the breakdown location.'
  },
  {
    icon: Wrench,
    title: 'Expressway & Hill Towing',
    titleSi: 'අධිවේගී සහ කඳුකර රිකවරි',
    text: 'Heavy winches for Southern E01, Airport E03, Central E04 expressways and steep Kandy hills.'
  }
];

export default function Home() {
  const { language } = useAuth();
  const isSi = language === 'si';

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="pulse-dot" />
            {isSi ? 'ශ්‍රී ලංකාව පුරා 24/7 හදිසි රිකවරි සේවාව' : '24/7 Emergency Roadside Assistance in Sri Lanka'}
          </p>
          <h1>
            {isSi ? (
              <>මගදී වාහනය කැඩුනද?<br /><em>ලඟම රිකවරි ලොරිය විනාඩි කිහිපයකින්.</em></>
            ) : (
              <>Reliable recovery,<br /><em>right when you need it.</em></>
            )}
          </h1>
          <p className="hero-text">
            {isSi
              ? 'අධිවේගී මාර්ගයේ හෝ නගරයේ වාහනය අනතුරකට හෝ කාර්මික දෝෂයකට ලක්වුවහොත්, ලඟම ඇති අනුමත ෆ්ලැට්බෙඩ් ලොරි රථය ක්ෂණිකව වෙන්කරවා ගන්න. මිල ගණන් සහ පැමිණෙන වේලාව කලින්ම දැනගන්න.'
              : 'Whether facing an unexpected engine breakdown or accident along the highway, connect with verified flatbed recovery operators in your area. Upfront pricing, driver direct contact, and real-time arrival tracking.'}
          </p>

          <div className="hero-actions">
            <Link className="button button-primary hero-main-btn" to="/find">
              {isSi ? 'ලඟම ඇති රිකවරි ලොරි සොයන්න' : 'Find a recovery lorry'} <ArrowRight size={19} />
            </Link>
            <Link className="text-link hero-hotlines-btn" to="/find">
              <PhoneCall size={16} /> 24/7 Emergency Dispatch
            </Link>
          </div>

          <div className="hero-trust">
            <span><BadgeCheck size={18} /> Verified Lorry Drivers</span>
            <span><Clock3 size={18} /> Live Arrival ETA</span>
            <span><ShieldCheck size={18} /> Transparent Rates (LKR)</span>
          </div>
        </div>

        {/* Hero Visual Card with Real Generated Photo */}
        <div className="hero-photo-showcase">
          <img
            src="/images/hero_recovery_lorry.jpg"
            alt="RescueNow Flatbed Recovery Tow Truck assisting car on highway"
            className="hero-main-img"
          />
          <div className="hero-floating-status">
            <div className="floating-status-icon">
              <Truck size={20} />
            </div>
            <div>
              <strong>Average Dispatch Time</strong>
              <span>Under 15 minutes across major highway routes</span>
            </div>
          </div>
          <div className="hero-floating-location">
            <MapPin size={17} className="accent-icon" />
            <span>Southern E01 • Colombo • Kandy • Galle</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section trust-section">
        <div className="section-heading">
          <p className="eyebrow">Professional Roadside Rescue</p>
          <h2>Equipped for every breakdown scenario.</h2>
          <p className="subtext">From low-ground-clearance sports cars to full passenger vans and light trucks.</p>
        </div>

        <div className="service-grid">
          {services.map(({ icon: Icon, title, titleSi, text }) => (
            <article className="service-item" key={title}>
              <div className="service-icon"><Icon size={24} /></div>
              <h3>{isSi ? titleSi : title}</h3>
              <p>{text}</p>
              <Link to="/find" className="service-link">
                Request assistance <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 3 Step Guide */}
      <section className="steps-band">
        <div className="section-heading">
          <p className="eyebrow">How RescueNow Works</p>
          <h2>Three simple steps from stuck to sorted.</h2>
          <p>Designed for high-stress situations with zero hassle.</p>
        </div>

        <div className="steps">
          <div className="step-card">
            <b>01</b>
            <h3>Locate your spot</h3>
            <p>1-click GPS auto-detects your coordinates or choose an expressway interchange.</p>
          </div>
          <div className="step-card">
            <b>02</b>
            <h3>Choose your lorry</h3>
            <p>Compare available flatbed trucks, distance (km), arrival ETA, and transparent price.</p>
          </div>
          <div className="step-card">
            <b>03</b>
            <h3>Track live arrival</h3>
            <p>Speak to the driver directly and follow real-time progress all the way to the garage.</p>
          </div>
        </div>
      </section>

      {/* Roadside Safety Awareness */}
      <section className="safety-section">
        <div className="safety-box">
          <div className="safety-header">
            <ShieldAlert size={28} className="safety-alert-icon" />
            <div>
              <h3>Safety First: If your vehicle breaks down on Sri Lankan roads</h3>
              <p>Essential checklist while you wait for the recovery lorry</p>
            </div>
          </div>
          <div className="safety-checklist">
            <div className="safety-rule">
              <strong>1. Turn On Hazard Lights</strong>
              <span>Immediately activate your hazard blinkers so approaching traffic can see your vehicle from a distance.</span>
            </div>
            <div className="safety-rule">
              <strong>2. Exit Away from Traffic</strong>
              <span>On expressways (E01/E03), step out from the passenger side and stand behind the steel safety barrier.</span>
            </div>
            <div className="safety-rule">
              <strong>3. Place Warning Triangle</strong>
              <span>Set your reflective warning triangle at least 45 to 50 meters behind your vehicle if safe to do so.</span>
            </div>
            <div className="safety-rule">
              <strong>4. Emergency Dial 1969 / 119</strong>
              <span>For expressway emergencies, contact 1969 immediately to inform highway patrol.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
