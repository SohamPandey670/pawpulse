import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoUsers } from '../data/syntheticData';
import {
  Activity,
  Shield,
  Stethoscope,
  Heart,
  GitPullRequest,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@pawpulse.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');
    const res = login(email, password);
    if (res.success) {
      if (res.user.role === 'ADMIN') navigate('/dashboard');
      else if (res.user.role === 'COORDINATOR') navigate('/coordinator');
      else if (res.user.role === 'VET') navigate('/vet');
      else navigate('/owner');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const selectDemoRole = (roleKey) => {
    const creds = demoUsers[roleKey];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      const res = login(creds.email, creds.password);
      if (res.success) {
        if (res.user.role === 'ADMIN') navigate('/dashboard');
        else if (res.user.role === 'COORDINATOR') navigate('/coordinator');
        else if (res.user.role === 'VET') navigate('/vet');
        else navigate('/owner');
      }
    }
  };

  return (
    <div className="paw-login-page">
      <div className="paw-login-container">
        {/* Header Branding */}
        <div className="paw-login-header">
          <div className="paw-login-brand">
            <div className="paw-brand-logo lg">
              <Activity size={32} className="paw-brand-icon" />
              <span className="paw-pulse-ping"></span>
            </div>
            <h1 className="paw-login-title">
              Paw<span className="text-gradient-primary">Pulse</span>
            </h1>
          </div>
          <p className="paw-login-subtitle">
            Enterprise Pet Healthcare Operations & Analytics Engine
          </p>
          <div className="paw-tech-stack-pills">
            <span className="paw-badge badge-indigo">Spring Boot 3</span>
            <span className="paw-badge badge-cyan">React 18</span>
            <span className="paw-badge badge-emerald">PostgreSQL 15</span>
            <span className="paw-badge badge-amber">Power BI</span>
          </div>
        </div>

        {/* Demo Role Selector Cards */}
        <div className="paw-demo-personas-section">
          <div className="paw-demo-label">
            <Sparkles size={14} className="text-accent" />
            <span>Click any role below for instant demo login:</span>
          </div>
          <div className="paw-role-cards-grid">
            <button
              type="button"
              onClick={() => selectDemoRole('admin')}
              className="paw-role-select-card card-admin"
            >
              <div className="paw-role-card-icon">
                <Shield size={20} />
              </div>
              <div className="paw-role-card-content">
                <div className="paw-role-card-title">Operations Admin</div>
                <div className="paw-role-card-desc">Full KPI suite, clinics, revenue, SLA monitoring</div>
              </div>
              <ArrowRight size={16} className="paw-card-arrow" />
            </button>

            <button
              type="button"
              onClick={() => selectDemoRole('coordinator')}
              className="paw-role-select-card card-coord"
            >
              <div className="paw-role-card-icon">
                <GitPullRequest size={20} />
              </div>
              <div className="paw-role-card-content">
                <div className="paw-role-card-title">Care Coordinator</div>
                <div className="paw-role-card-desc">Referral turnaround TAT, breach flags, Rx follow-ups</div>
              </div>
              <ArrowRight size={16} className="paw-card-arrow" />
            </button>

            <button
              type="button"
              onClick={() => selectDemoRole('vet')}
              className="paw-role-select-card card-vet"
            >
              <div className="paw-role-card-icon">
                <Stethoscope size={20} />
              </div>
              <div className="paw-role-card-content">
                <div className="paw-role-card-title">Veterinarian</div>
                <div className="paw-role-card-desc">Daily patient queue, clinical notes, Rx upload</div>
              </div>
              <ArrowRight size={16} className="paw-card-arrow" />
            </button>

            <button
              type="button"
              onClick={() => selectDemoRole('owner')}
              className="paw-role-select-card card-owner"
            >
              <div className="paw-role-card-icon">
                <Heart size={20} />
              </div>
              <div className="paw-role-card-content">
                <div className="paw-role-card-title">Pet Parent</div>
                <div className="paw-role-card-desc">Pet health profiles, appointments, booking wizard</div>
              </div>
              <ArrowRight size={16} className="paw-card-arrow" />
            </button>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="paw-card paw-login-form-card">
          <div className="paw-form-divider">
            <span>Or sign in with credentials</span>
          </div>

          {error && <div className="paw-alert paw-alert-error">{error}</div>}

          <form onSubmit={handleLogin} className="paw-login-form">
            <div className="paw-form-group">
              <label className="paw-form-label">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="paw-form-input"
                required
              />
            </div>

            <div className="paw-form-group">
              <label className="paw-form-label">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="paw-form-input"
                required
              />
            </div>

            <button type="submit" className="paw-btn paw-btn-primary w-full">
              Enter Platform
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <div className="paw-login-footer">
          <CheckCircle2 size={14} className="text-emerald" />
          <span>Synthetic data environment preloaded with 5,000+ clinical and operational events.</span>
        </div>
      </div>
    </div>
  );
}
