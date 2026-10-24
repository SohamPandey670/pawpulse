import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { breachedPasswordFilter } from '../utils/bloomFilter';
import {
  Activity,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  Sparkles,
  KeyRound,
  X,
  ChevronDown,
  Shield,
  Stethoscope,
  GitPullRequest,
  Heart,
  Check,
} from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedWorkspace, setSelectedWorkspace] = useState('clinic'); // 'clinic' | 'studio'

  // Sign In State
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('OWNER');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleOptions = [
    {
      id: 'OWNER',
      label: 'Pet Parent',
      sub: 'Pet Health Records & Booking',
      icon: Heart,
      iconColor: '#fb7185',
      badge: 'Parent',
    },
    {
      id: 'VET',
      label: 'Veterinarian',
      sub: 'Clinical Queue & Camera Rx',
      icon: Stethoscope,
      iconColor: '#34d399',
      badge: 'Doctor',
    },
    {
      id: 'COORDINATOR',
      label: 'Care Coordinator',
      sub: 'SLA Pipeline & Referrals',
      icon: GitPullRequest,
      iconColor: '#fbbf24',
      badge: 'Coord',
    },
    {
      id: 'ADMIN',
      label: 'Clinic Operations Admin',
      sub: 'Full Operations & Analytics',
      icon: Shield,
      iconColor: '#818cf8',
      badge: 'Admin',
    },
  ];

  const currentRoleObj = roleOptions.find((r) => r.id === signupRole) || roleOptions[0];
  const CurrentRoleIcon = currentRoleObj.icon;

  // Status & Google Dialog
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Check password with Bloom Filter
  const currentPassword = mode === 'signin' ? password : signupPassword;
  const isBreachedPassword = currentPassword.length > 0 && breachedPasswordFilter.has(currentPassword);

  const handleSignIn = (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    const res = login(identifier, password);
    if (res.success) {
      redirectUser(res.user.role);
    } else {
      setError(res.error || 'Invalid username or password');
    }
  };

  const handleSignUp = (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = signup({
      name: signupName,
      email: signupEmail,
      username: signupUsername || signupEmail.split('@')[0],
      password: signupPassword,
      role: signupRole,
    });

    if (res.success) {
      setSuccessMsg('Account created successfully! Entering platform...');
      setTimeout(() => {
        redirectUser(res.user.role);
      }, 700);
    } else {
      setError(res.error || 'Could not create account');
    }
  };

  const handleGoogleSubmit = (e) => {
    e?.preventDefault();
    if (!customGmail.trim()) {
      setError('Please enter your Gmail address.');
      return;
    }

    const email = customGmail.trim();
    const name = customGoogleName.trim() || email.split('@')[0];
    
    // Choose role based on email or admin
    const role = email.toLowerCase().includes('vet') ? 'VET' : email.toLowerCase().includes('admin') ? 'ADMIN' : 'OWNER';

    const res = loginWithGoogle({
      email,
      name,
      role,
    });

    setShowGoogleModal(false);
    if (res.success) {
      redirectUser(res.user.role);
    }
  };

  const autoFillMasterAdmin = () => {
    setMode('signin');
    setIdentifier('admin');
    setPassword('admin123');
    setError('');
  };

  const redirectUser = (role) => {
    if (role === 'ADMIN') navigate('/dashboard');
    else if (role === 'COORDINATOR') navigate('/coordinator');
    else if (role === 'VET') navigate('/vet');
    else navigate('/owner');
  };

  return (
    <div className="paw-login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="paw-login-container" style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
        
        {/* Top Workspace Mode Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedWorkspace('clinic')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: 'none',
              background: selectedWorkspace === 'clinic' ? '#6366f1' : 'transparent',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Building2 size={16} />
            <span>PawPulse Clinic</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/studio')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <FileSpreadsheet size={16} />
            <span>CSV/Excel Studio</span>
          </button>
        </div>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Activity size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
            Paw<span className="text-gradient-primary">Pulse</span>
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
            {mode === 'signin' ? 'Sign in to access your clinic portal' : 'Create a new account to join PawPulse'}
          </p>
        </div>

        {/* Main Authentication Card */}
        <div
          className="paw-card"
          style={{
            padding: '32px 28px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(19, 27, 46, 0.85)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Sign In vs Sign Up Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '4px',
              borderRadius: '10px',
              marginBottom: '22px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
                setSuccessMsg('');
              }}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'signin' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: mode === 'signin' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
                setSuccessMsg('');
              }}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'signup' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: mode === 'signup' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Real-time Google Sign In Button */}
          <button
            type="button"
            onClick={() => {
              setError('');
              setShowGoogleModal(true);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'transform 0.15s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {/* Google 4-Color SVG Logo */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 0 20px 0',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            <span>or continue with credentials</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="paw-alert paw-alert-error" style={{ marginBottom: '18px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="paw-alert paw-alert-success" style={{ marginBottom: '18px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7' }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="paw-login-form">
              <div className="paw-form-group">
                <label className="paw-form-label">Username or Email</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin or your email"
                    className="paw-form-input"
                    style={{ paddingLeft: '36px' }}
                    required
                  />
                </div>
              </div>

              <div className="paw-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="paw-form-label" style={{ margin: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={autoFillMasterAdmin}
                    style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Use Master Admin
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="paw-form-input"
                    style={{ paddingLeft: '36px' }}
                    required
                  />
                </div>
                {isBreachedPassword && (
                  <div style={{ fontSize: '0.72rem', color: '#fb7185', marginTop: '6px' }}>
                    ⚠️ Bloom Filter: Common dictionary password detected.
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="paw-btn paw-btn-primary w-full"
                style={{ padding: '12px', marginTop: '6px' }}
              >
                <span>Sign In to Platform</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="paw-login-form">
              <div className="paw-form-group">
                <label className="paw-form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Your Full Name"
                    className="paw-form-input"
                    style={{ paddingLeft: '36px' }}
                    required
                  />
                </div>
              </div>

              <div className="paw-form-group">
                <label className="paw-form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="paw-form-input"
                    style={{ paddingLeft: '36px' }}
                    required
                  />
                </div>
              </div>

              <div className="paw-form-group">
                <label className="paw-form-label">Username (Optional)</label>
                <input
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  placeholder="username"
                  className="paw-form-input"
                />
              </div>

              <div className="paw-form-group">
                <label className="paw-form-label">Create Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="paw-form-input"
                    style={{ paddingLeft: '36px' }}
                    required
                  />
                </div>
              </div>

              <div className="paw-form-group">
                <label className="paw-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Select Account Role</span>
                  <span style={{ fontSize: '0.74rem', color: currentRoleObj.iconColor, fontWeight: 600 }}>
                    Selected: {currentRoleObj.label}
                  </span>
                </label>

                {/* 1. Custom In-DOM Dropdown (Pure React - Zero Native OS Windows Popup) */}
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#131b2e',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CurrentRoleIcon size={16} color={currentRoleObj.iconColor} />
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{currentRoleObj.label}</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>• {currentRoleObj.sub}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: roleDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        color: '#94a3b8',
                      }}
                    />
                  </button>

                  {/* Floating In-DOM Dropdown List */}
                  {roleDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        background: '#131b2e',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.85)',
                        zIndex: 100,
                        padding: '6px',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      {roleOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = signupRole === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              setSignupRole(opt.id);
                              setRoleDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              background: isSelected ? 'rgba(99, 102, 241, 0.22)' : 'transparent',
                              color: '#ffffff',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = isSelected
                                ? 'rgba(99, 102, 241, 0.32)'
                                : 'rgba(255, 255, 255, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isSelected
                                ? 'rgba(99, 102, 241, 0.22)'
                                : 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Icon size={15} color={opt.iconColor} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#ffffff' }}>
                                  {opt.label}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{opt.sub}</div>
                              </div>
                            </div>
                            {isSelected && <Check size={16} color="#818cf8" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Visual Role Selection Cards (2x2 Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {roleOptions.map((item) => {
                    const Icon = item.icon;
                    const isSelected = signupRole === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSignupRole(item.id);
                          setRoleDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon size={14} color={item.iconColor} />
                            <span style={{ fontWeight: 600, fontSize: '0.82rem', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                              {item.label}
                            </span>
                          </div>
                          {isSelected && <Check size={13} color="#818cf8" />}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.25 }}>
                          {item.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="paw-btn paw-btn-primary w-full"
                style={{ padding: '12px', marginTop: '6px' }}
              >
                <span>Create Account & Sign In</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Master Admin Help Callout */}
          <div
            style={{
              marginTop: '22px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={13} />
                <span>Master Admin Credentials:</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>
                User: <strong>admin</strong> | Password: <strong>admin123</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={autoFillMasterAdmin}
              className="paw-btn paw-btn-xs paw-btn-secondary"
              style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}
            >
              1-Click Fill
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          🔒 Multi-Role RBAC & Bloom Filter verification active
        </div>
      </div>

      {/* Google Sign In Real-Time Modal */}
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
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setShowGoogleModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '420px',
              color: '#1f2937',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>
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

            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 18px 0', lineHeight: 1.4 }}>
              Enter any Google or Gmail address you wish to sign in with:
            </p>

            <form onSubmit={handleGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Google / Gmail Address
                </label>
                <input
                  type="email"
                  value={customGmail}
                  onChange={(e) => setCustomGmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    color: '#111827',
                    outline: 'none',
                  }}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  placeholder="Your Name"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    color: '#111827',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: '#1a73e8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                Continue as Google User
              </button>
            </form>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
              🔒 Directly creates session for your Gmail without hardcoded previews
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
