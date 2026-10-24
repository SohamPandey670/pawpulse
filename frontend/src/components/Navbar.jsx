import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoUsers } from '../data/syntheticData';
import { Sparkles, Layers, Database, BarChart3, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStudio = location.pathname === '/studio';

  const handleQuickSwitch = (roleKey) => {
    const creds = demoUsers[roleKey];
    if (creds) {
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
    <header className="paw-navbar">
      <div className="paw-navbar-left">
        <div className="paw-navbar-title-wrap">
          <h1 className="paw-navbar-title">
            {isStudio ? 'CSV / Excel Auto-Dashboard Studio' : 'Pet Healthcare Operations Engine'}
          </h1>
          <span className="paw-badge badge-cyan" style={{ fontSize: '0.72rem' }}>
            <Database size={11} style={{ marginRight: '4px' }} />
            {isStudio ? 'Client-Side SheetJS + Recharts Analytics' : 'PostgreSQL + Spring Boot + React + Power BI'}
          </span>
        </div>
      </div>

      <div className="paw-navbar-right">
        {/* Workspace Switcher Button */}
        <button
          onClick={() => navigate(isStudio ? '/dashboard' : '/studio')}
          className="paw-btn paw-btn-xs"
          style={{
            background: isStudio
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))'
              : 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(59, 130, 246, 0.25))',
            border: isStudio ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(6, 182, 212, 0.5)',
            color: isStudio ? '#a5b4fc' : '#67e8f9',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
          title={isStudio ? 'Switch to Clinic Dashboard' : 'Switch to Make Dashboard from CSV/Excel'}
        >
          {isStudio ? <Activity size={14} /> : <BarChart3 size={14} />}
          <span>{isStudio ? '🐾 Clinic Operations' : '📊 Make Dashboard (CSV/Excel)'}</span>
        </button>

        {/* Instant Role Switcher */}
        <div className="paw-quick-switcher">
          <span className="paw-switcher-label">
            <Layers size={13} style={{ marginRight: '4px' }} />
            Switch View:
          </span>
          <div className="paw-switcher-buttons">
            <button
              onClick={() => handleQuickSwitch('admin')}
              className={`paw-switch-pill ${user?.role === 'ADMIN' ? 'active-admin' : ''}`}
              title="Switch to Admin Dashboard"
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickSwitch('coordinator')}
              className={`paw-switch-pill ${user?.role === 'COORDINATOR' ? 'active-coord' : ''}`}
              title="Switch to Care Coordinator View"
            >
              Coord
            </button>
            <button
              onClick={() => handleQuickSwitch('vet')}
              className={`paw-switch-pill ${user?.role === 'VET' ? 'active-vet' : ''}`}
              title="Switch to Vet Console"
            >
              Vet
            </button>
            <button
              onClick={() => handleQuickSwitch('owner')}
              className={`paw-switch-pill ${user?.role === 'OWNER' ? 'active-owner' : ''}`}
              title="Switch to Pet Parent View"
            >
              Owner
            </button>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="paw-navbar-indicator">
          <span className="paw-indicator-dot"></span>
          <span className="paw-indicator-text">Realtime SLA Engine</span>
        </div>

        {/* Demo Mode Badge */}
        <div className="paw-demo-pill">
          <Sparkles size={13} />
          <span>Demo Pack</span>
        </div>
      </div>
    </header>
  );
}
