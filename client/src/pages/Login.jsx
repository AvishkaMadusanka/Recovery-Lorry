import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Phone, User, Truck, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, switchDemoUser, user } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await register({ fullName, email, phone, password, role });
      } else {
        await login(email, password);
      }
      navigate(role === 'provider' ? '/provider' : '/find');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickDemo(roleToSet) {
    switchDemoUser(roleToSet);
    navigate(roleToSet === 'provider' ? '/provider' : '/find');
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <span className="brand-mark-lg">
            <Truck size={24} />
          </span>
          <h2>{isRegistering ? 'Create RescueNow Account' : 'Welcome to RescueNow Sri Lanka'}</h2>
          <p>
            {isRegistering
              ? 'Join as a customer or register your recovery lorry'
              : 'Sign in to access live tracking and operator dispatch'}
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-In */}
        <div className="quick-demo-box">
          <small>⚡ 1-Click Instant Demo Login (For immediate evaluation):</small>
          <div className="demo-role-btns">
            <button className="demo-btn" onClick={() => handleQuickDemo('customer')}>
              🚗 As Driver (Customer)
            </button>
            <button className="demo-btn" onClick={() => handleQuickDemo('provider')}>
              🚛 As Recovery Operator
            </button>
            <button className="demo-btn" onClick={() => handleQuickDemo('admin')}>
              🛡️ As Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-alert-error">{error}</div>}

          {isRegistering && (
            <>
              <label className="auth-field">
                <span>Full Name</span>
                <div className="input-wrap">
                  <User size={18} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ruwan Jayasuriya"
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Phone Number</span>
                <div className="input-wrap">
                  <Phone size={18} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +94 77 123 4567"
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Account Type</span>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="customer">Customer / Vehicle Owner (Looking for Recovery)</option>
                  <option value="provider">Recovery Lorry Owner / Operator</option>
                </select>
              </label>
            </>
          )}

          <label className="auth-field">
            <span>Email Address</span>
            <div className="input-wrap">
              <Mail size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@rescuenow.lk"
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="input-wrap">
              <Lock size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </label>

          <button type="submit" className="button button-primary full-width" disabled={loading}>
            {loading ? 'Signing in...' : isRegistering ? 'Register Account' : 'Sign In to RescueNow'}
          </button>
        </form>

        <div className="toggle-auth-mode">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)} className="text-btn">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button onClick={() => setIsRegistering(true)} className="text-btn">
                Register as Customer or Recovery Operator
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
