import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GitPullRequest,
  Stethoscope,
  Heart,
  CalendarPlus,
  Calendar,
  LogOut,
  Shield,
  Activity,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Admin Operations',
      icon: LayoutDashboard,
      roles: ['ADMIN'],
      badge: 'Live',
    },
    {
      to: '/coordinator',
      label: 'Care Coordinator',
      icon: GitPullRequest,
      roles: ['ADMIN', 'COORDINATOR'],
      badge: 'SLA',
    },
    {
      to: '/vet',
      label: 'Vet Console',
      icon: Stethoscope,
      roles: ['ADMIN', 'VET'],
    },
    {
      to: '/owner',
      label: 'Pet Parent Portal',
      icon: Heart,
      roles: ['ADMIN', 'OWNER'],
    },
    {
      to: '/book',
      label: 'Book Consultation',
      icon: CalendarPlus,
      roles: ['ADMIN', 'OWNER'],
    },
    {
      to: '/appointments',
      label: 'All Appointments',
      icon: Calendar,
      roles: ['ADMIN', 'COORDINATOR', 'VET'],
    },
  ];

  const visibleNav = navItems.filter((item) => !user || item.roles.includes(user.role));

  const roleColors = {
    ADMIN: 'badge-indigo',
    COORDINATOR: 'badge-amber',
    VET: 'badge-emerald',
    OWNER: 'badge-rose',
  };

  return (
    <aside className="paw-sidebar">
      {/* Brand Header */}
      <div className="paw-sidebar-brand">
        <div className="paw-brand-logo">
          <Activity className="paw-brand-icon" size={24} />
          <span className="paw-pulse-ping"></span>
        </div>
        <div className="paw-brand-info">
          <div className="paw-brand-name">
            Paw<span className="text-gradient-primary">Pulse</span>
          </div>
          <div className="paw-brand-sub">Pet Healthcare Ops</div>
        </div>
      </div>

      {/* Role Pill Banner */}
      {user && (
        <div className="paw-role-card">
          <div className="paw-role-header">
            <span className={`paw-badge ${roleColors[user.role] || 'badge-indigo'}`}>
              <Shield size={12} style={{ marginRight: '4px' }} />
              {user.role} VIEW
            </span>
          </div>
          <div className="paw-role-user-name">{user.name}</div>
          <div className="paw-role-email">{user.email}</div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="paw-sidebar-nav-section">
        <div className="paw-nav-group-label">WORKSPACE</div>
        <nav className="paw-nav-menu">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `paw-nav-item ${isActive ? 'paw-nav-item-active' : ''}`
                }
              >
                <div className="paw-nav-item-icon">
                  <Icon size={18} />
                </div>
                <span className="paw-nav-item-text">{item.label}</span>
                {item.badge && <span className="paw-nav-badge">{item.badge}</span>}
                <ChevronRight size={14} className="paw-nav-chevron" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status / Quick Stats */}
      <div className="paw-sidebar-status">
        <div className="paw-status-card">
          <div className="paw-status-indicator">
            <span className="paw-status-dot"></span>
            <span className="paw-status-label">PostgreSQL / Spring API</span>
          </div>
          <div className="paw-status-sub">Synthetic Demo Active</div>
        </div>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="paw-sidebar-footer">
        <button onClick={logout} className="paw-logout-btn" title="Sign out">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
