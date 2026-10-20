import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoUsers } from '../data/syntheticData';
import { Sparkles, Layers, Database } from 'lucide-react';

export default function Navbar() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

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
          <h1 className="paw-navbar-title">Pet Healthcare Operations Engine</h1>
          <span className="paw-badge badge-cyan" style={{ fontSize: '0.72rem' }}>
            <Database size={11} style={{ marginRight: '4px' }} />
            PostgreSQL + Spring Boot + React + Power BI
          </span>
        </div>
      </div>

      <div className="paw-navbar-right">
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
