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
  FileSpreadsheet,
  BarChart3,
  Layers,
  UploadCloud,
} from 'lucide-react';

export default function LoginPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState('clinic'); // 'csv_dashboard' | 'clinic'
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
            Enterprise Healthcare Platform & Universal Data Intelligence Suite
          </p>
          <div className="paw-tech-stack-pills">
            <span className="paw-badge badge-indigo">Spring Boot 3</span>
            <span className="paw-badge badge-cyan">React 18</span>
            <span className="paw-badge badge-emerald">PostgreSQL 15</span>
            <span className="paw-badge badge-amber">CSV/Excel Studio</span>
          </div>
        </div>

        {/* 2-Option Project Selector */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '8px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedWorkspace('csv_dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              border: selectedWorkspace === 'csv_dashboard' ? '1px solid #06b6d4' : '1px solid transparent',
              background: selectedWorkspace === 'csv_dashboard' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BarChart3 size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>1. Make Dashboard from CSV/Excel</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Upload any dataset to auto-generate KPIs & charts
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWorkspace('clinic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              border: selectedWorkspace === 'clinic' ? '1px solid #6366f1' : '1px solid transparent',
              background: selectedWorkspace === 'clinic' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Activity size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>2. PawPulse Clinic Dashboard</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Clinical ops, vet queue, camera Rx & owner portal
              </div>
            </div>
          </button>
        </div>

        {/* WORKSPACE VIEW 1: CSV / Excel Dashboard Studio Launcher */}
        {selectedWorkspace === 'csv_dashboard' && (
          <div
            className="paw-card"
            style={{
              padding: '24px',
              marginBottom: '20px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              background: 'radial-gradient(circle at top, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <FileSpreadsheet size={24} className="text-cyan" />
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                  CSV & Excel Auto-Dashboard Studio
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Turn any spreadsheet or exported CSV into instant interactive visual analytics.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                marginBottom: '18px',
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supported Formats</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>.CSV, .XLSX, .XLS</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visuals Included</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Bar, Line, Area, Pie</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Infrastructure</div>
                <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.85rem' }}>Client-Side / Zero Setup</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/studio')}
                className="paw-btn paw-btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  flex: 1,
                  justifyContent: 'center',
                  padding: '12px 20px',
                  fontSize: '0.95rem',
                }}
              >
                <UploadCloud size={18} />
                <span>Launch Auto-Dashboard Studio</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setSelectedWorkspace('clinic')}
                className="paw-btn paw-btn-secondary"
                style={{ padding: '12px 18px' }}
              >
                Go to Clinic Operations
              </button>
            </div>
          </div>
        )}

        {/* WORKSPACE VIEW 2: Clinic Operations Demo Personas & Creds */}
        {selectedWorkspace === 'clinic' && (
          <>
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
          </>
        )}

        <div className="paw-login-footer">
          <CheckCircle2 size={14} className="text-emerald" />
          <span>Synthetic data environment preloaded with 5,000+ clinical and operational events.</span>
        </div>
      </div>
    </div>
  );
}
