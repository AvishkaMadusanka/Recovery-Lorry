import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Truck, Menu, X, Database, Globe, User, LogOut, ChevronDown, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import DatabaseModal from './DatabaseModal.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const { user, logout, language, toggleLanguage, dbInfo } = useAuth();
  const navigate = useNavigate();

  const isSi = language === 'si';

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <header className="navbar">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Truck size={20} /></span>
          Rescue<span>Now</span>
          <span className="country-sub">LK</span>
        </Link>

        {/* Database Status Button */}
        <button
          className={`nav-db-indicator ${dbInfo?.connected ? 'connected' : 'fallback'}`}
          onClick={() => setDbModalOpen(true)}
          title="Click to manage database connection"
        >
          <Database size={14} />
          <span className="dot" />
          <span className="db-text">
            {dbInfo?.connected ? 'MongoDB Connected' : 'In-Memory Store'}
          </span>
        </button>

        <button
          className="icon-button mobile-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <NavLink to="/find" onClick={() => setOpen(false)} className="nav-emergency-highlight">
            🚨 {isSi ? 'ලොරි සොයන්න' : 'Find a Lorry'}
          </NavLink>
          <NavLink to="/my-bookings" onClick={() => setOpen(false)}>
            {isSi ? 'මගේ වෙන්කිරීම්' : 'My Bookings'}
          </NavLink>
          <NavLink to="/provider" onClick={() => setOpen(false)}>
            {isSi ? 'ලොරි හිමිකරු' : 'Operator Portal'}
          </NavLink>
          <NavLink to="/services" onClick={() => setOpen(false)}>
            {isSi ? 'සේවාවන්' : 'Services'}
          </NavLink>

          {/* Language toggle */}
          <button className="lang-toggle-btn" onClick={toggleLanguage} title="Switch language">
            <Globe size={14} /> {isSi ? 'English' : 'සිංහල'}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="user-profile-menu">
              <span className="user-name-tag">
                <User size={14} /> {user.fullName?.split(' ')[0]}
              </span>
              <button className="btn-logout" onClick={handleLogout} title="Sign Out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link className="nav-login" to="/login" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          )}
        </nav>
      </header>

      {/* Database Setup Modal */}
      <DatabaseModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />
    </>
  );
}
