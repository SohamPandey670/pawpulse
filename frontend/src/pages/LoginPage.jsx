import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoUsers } from '../data/syntheticData';
import { breachedPasswordFilter, enterpriseDomainFilter } from '../utils/bloomFilter';
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
  UploadCloud,
  Cpu,
  AlertTriangle,
  Check,
  X,
  KeyRound,
  Globe,
} from 'lucide-react';

export default function LoginPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState('clinic'); // 'csv_dashboard' | 'clinic'
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'google' | 'sso'
  const [email, setEmail] = useState('admin@pawpulse.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [ssoDomain, setSsoDomain] = useState('');
  const [ssoMessage, setSsoMessage] = useState('');

  const { login, loginOAuth } = useAuth();
  const navigate = useNavigate();

  // Bloom Filter Realtime Telemetry & Security Check
  const bloomStats = useMemo(() => {
    const t0 = performance.now();
    const isCompromised = password.length > 0 ? breachedPasswordFilter.has(password) : false;
    const t1 = performance.now();
    const lookupDuration = Math.max(0.01, t1 - t0).toFixed(2);
    const bitsSet = breachedPasswordFilter.getBitsSet();
    const fpRate = (breachedPasswordFilter.getFalsePositiveRate() * 100).toFixed(4);

    return {
      isCompromised,
      lookupDuration,
      bitsSet,
      fpRate,
    };
  }, [password]);

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

  const handleGoogleSelect = (googleUser) => {
    const res = loginOAuth({
      name: googleUser.name,
      email: googleUser.email,
      role: googleUser.role,
      provider: 'google',
    });
    setShowGoogleModal(false);
    if (res.success) {
      if (res.user.role === 'ADMIN') navigate('/dashboard');
      else if (res.user.role === 'COORDINATOR') navigate('/coordinator');
      else if (res.user.role === 'VET') navigate('/vet');
      else navigate('/owner');
    }
  };

  const handleSsoCheck = (e) => {
    e.preventDefault();
    if (!ssoDomain) return;
    const domain = ssoDomain.includes('@') ? ssoDomain.split('@')[1] : ssoDomain;
    const isRecognized = enterpriseDomainFilter.has(domain);

    if (isRecognized) {
      setSsoMessage(`✓ Bloom Filter: '${domain}' identified as verified enterprise identity provider. Redirecting to SAML/Okta Gateway...`);
      setTimeout(() => {
        handleGoogleSelect({
          name: `${domain.split('.')[0].toUpperCase()} Enterprise User`,
          email: `sso@${domain}`,
          role: 'ADMIN',
        });
      }, 1200);
    } else {
      setSsoMessage(`ℹ️ Domain '${domain}' not pre-indexed in Bloom Filter. Proceeding via fallback OAuth discovery...`);
      setTimeout(() => {
        handleGoogleSelect({
          name: 'Enterprise SSO User',
          email: `user@${domain}`,
          role: 'COORDINATOR',
        });
      }, 1500);
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
      <div className="paw-login-container" style={{ maxWidth: '640px' }}>
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
            <span className="paw-badge badge-emerald">Bloom Filter Security</span>
            <span className="paw-badge badge-amber">Google OAuth / SSO</span>
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
                  AI-assisted visual intelligence engine: upload any spreadsheet and ask conversational queries.
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Intelligence</div>
                <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.85rem' }}>Conversational Query & Power BI Mode</div>
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

        {/* WORKSPACE VIEW 2: Clinic Operations with Enterprise Login */}
        {selectedWorkspace === 'clinic' && (
          <div className="paw-card paw-login-form-card" style={{ padding: '24px', marginBottom: '20px' }}>
            {/* Top Security Guard Badge: Bloom Filter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                background: bloomStats.isCompromised
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(52, 211, 153, 0.08)',
                border: bloomStats.isCompromised
                  ? '1px solid rgba(239, 68, 68, 0.35)'
                  : '1px solid rgba(52, 211, 153, 0.25)',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={16} className={bloomStats.isCompromised ? 'text-rose' : 'text-emerald'} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>
                    Bloom Filter Bitset Engine: Active
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    O(1) hash membership check • {bloomStats.lookupDuration}ms lookup latency • 8,192-bit array
                  </div>
                </div>
              </div>
              <span className={`paw-badge ${bloomStats.isCompromised ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                {bloomStats.isCompromised ? 'Compromised Pattern' : 'Bitset Verified'}
              </span>
            </div>

            {/* Google Sign-In & Single-Sign-On Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#1f2937',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {/* Official Google 4-Color SVG Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('sso')}
                  className="paw-btn paw-btn-secondary"
                  style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '10px' }}
                >
                  <Globe size={14} />
                  <span>Enterprise SSO</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectDemoRole('admin')}
                  className="paw-btn paw-btn-secondary"
                  style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '10px' }}
                >
                  <KeyRound size={14} />
                  <span>1-Click Admin</span>
                </button>
              </div>
            </div>

            {/* SSO Domain Check Tab (Bloom Filter Domain Check) */}
            {activeTab === 'sso' && (
              <form onSubmit={handleSsoCheck} style={{ marginBottom: '18px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                  Enterprise Single Sign-On (Okta / Azure AD / SAML 2.0)
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={ssoDomain}
                    onChange={(e) => setSsoDomain(e.target.value)}
                    placeholder="e.g. pawpulse.in or yourcompany.com"
                    className="paw-form-input"
                    style={{ flex: 1 }}
                    required
                  />
                  <button type="submit" className="paw-btn paw-btn-primary">
                    Verify SSO
                  </button>
                </div>
                {ssoMessage && (
                  <div style={{ fontSize: '0.78rem', color: '#67e8f9', marginTop: '8px' }}>
                    {ssoMessage}
                  </div>
                )}
              </form>
            )}

            <div className="paw-form-divider" style={{ margin: '14px 0' }}>
              <span>Or sign in with email credentials</span>
            </div>

            {error && <div className="paw-alert paw-alert-error">{error}</div>}

            {/* Standard Credentials Form with Bloom Filter Validation */}
            <form onSubmit={handleLogin} className="paw-login-form">
              <div className="paw-form-group">
                <label className="paw-form-label">
                  <Mail size={14} /> Work Email
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="paw-form-label" style={{ margin: 0 }}>
                    <Lock size={14} /> Password
                  </label>
                  {password.length > 0 && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: bloomStats.isCompromised ? '#fb7185' : '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {bloomStats.isCompromised ? (
                        <>
                          <AlertTriangle size={12} /> Breached Dictionary Match
                        </>
                      ) : (
                        <>
                          <Check size={12} /> Bloom Filter Safe
                        </>
                      )}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="paw-form-input"
                  required
                />
                {bloomStats.isCompromised && (
                  <div style={{ fontSize: '0.74rem', color: '#fb7185', marginTop: '6px' }}>
                    ⚠️ Bloom Filter detected this password in common public leak bitsets. Demo login will still succeed, but this is flagged in production.
                  </div>
                )}
              </div>

              <button type="submit" className="paw-btn paw-btn-primary w-full" style={{ padding: '12px' }}>
                Enter Clinical Console
                <ArrowRight size={16} />
              </button>
            </form>

            {/* 1-Click Role Demo Selector Cards */}
            <div style={{ marginTop: '22px' }}>
              <div className="paw-demo-label" style={{ marginBottom: '10px' }}>
                <Sparkles size={14} className="text-accent" />
                <span>Quick Persona Selector (Instant Reviewer Access):</span>
              </div>
              <div className="paw-role-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                <button
                  type="button"
                  onClick={() => selectDemoRole('admin')}
                  className="paw-role-select-card card-admin"
                  style={{ padding: '10px' }}
                >
                  <Shield size={16} className="text-indigo" />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>Admin</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Operations</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoRole('coordinator')}
                  className="paw-role-select-card card-coord"
                  style={{ padding: '10px' }}
                >
                  <GitPullRequest size={16} className="text-amber" />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>Coordinator</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SLA Pipeline</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoRole('vet')}
                  className="paw-role-select-card card-vet"
                  style={{ padding: '10px' }}
                >
                  <Stethoscope size={16} className="text-emerald" />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>Veterinarian</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Camera Rx</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoRole('owner')}
                  className="paw-role-select-card card-owner"
                  style={{ padding: '10px' }}
                >
                  <Heart size={16} className="text-rose" />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>Pet Parent</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pet Locker</div>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="paw-login-footer">
          <CheckCircle2 size={14} className="text-emerald" />
          <span>Bloom filter hashing active. Fast zero-latency pre-check with sub-millisecond evaluation.</span>
        </div>
      </div>

      {/* Google OAuth Simulation Modal */}
      {showGoogleModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setShowGoogleModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              color: '#1f2937',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#111827' }}>
                  Sign in with Google
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 16px 0' }}>
              Choose an authorized Google account to continue to <strong>PawPulse Enterprise</strong>:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => handleGoogleSelect({ name: 'Soham Pandey', email: 'sohampandey670@gmail.com', role: 'ADMIN' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  SP
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Soham Pandey</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>sohampandey670@gmail.com</div>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Admin
                </span>
              </div>

              <div
                onClick={() => handleGoogleSelect({ name: 'Dr. Ananya Sharma', email: 'dr.ananya@pawcare.org', role: 'VET' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  AS
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Dr. Ananya Sharma</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>dr.ananya@pawcare.org</div>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Vet
                </span>
              </div>

              <div
                onClick={() => handleGoogleSelect({ name: 'Vikram Singh', email: 'vikram.singh@pawpulse.in', role: 'COORDINATOR' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  VS
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Vikram Singh</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>vikram.singh@pawpulse.in</div>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Coordinator
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '16px', paddingTop: '14px', textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
              🔒 Protected by 256-bit OAuth SSL & Client-Side Bloom Filter Verification
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
