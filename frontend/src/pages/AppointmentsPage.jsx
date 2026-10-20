import { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  CheckCircle2,
  UserX,
  Video,
  Home,
  Building2,
} from 'lucide-react';
import { AppointmentService } from '../services/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await AppointmentService.getAll();
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load appointments', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    await AppointmentService.updateStatus(id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.petName?.toLowerCase().includes(search.toLowerCase()) ||
      a.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      a.vetName?.toLowerCase().includes(search.toLowerCase()) ||
      a.clinic?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || a.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  if (loading) {
    return <div className="paw-loading-screen">Loading Appointments Schedule...</div>;
  }

  return (
    <div className="paw-page-container">
      {/* Header */}
      <div className="paw-page-header">
        <div>
          <div className="paw-page-tag">
            <Calendar size={12} className="text-indigo" />
            Centralized Patient Log
          </div>
          <h2 className="paw-page-title">All Network Appointments</h2>
          <p className="paw-page-desc">
            Unified register of consultations across all teleconsultation and clinic nodes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="paw-card paw-search-filter-card mb-6">
        <div className="paw-filter-bar-grid">
          {/* Search box */}
          <div className="paw-search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by Pet, Owner, Doctor, or Clinic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="paw-search-input"
            />
          </div>

          {/* Status filter */}
          <div className="flex-row items-center gap-2">
            <span className="text-xs text-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="paw-form-select-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          {/* Service filter */}
          <div className="flex-row items-center gap-2">
            <span className="text-xs text-muted">Channel:</span>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="paw-form-select-sm"
            >
              <option value="ALL">All Channels</option>
              <option value="teleconsult">Teleconsult</option>
              <option value="clinic">Clinic</option>
              <option value="home_visit">Home Visit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="paw-card paw-table-card">
        <div className="paw-table-responsive">
          <table className="paw-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Channel</th>
                <th>Attending Doctor</th>
                <th>Clinic / Hub</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <div className="font-semibold text-white">{appt.petName}</div>
                    <div className="text-xs text-muted">Parent: {appt.ownerName}</div>
                  </td>
                  <td>
                    <span className="paw-channel-pill">
                      {appt.serviceType === 'teleconsult' && <Video size={12} />}
                      {appt.serviceType === 'clinic' && <Building2 size={12} />}
                      {appt.serviceType === 'home_visit' && <Home size={12} />}
                      <span className="capitalize">{appt.serviceType.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td>
                    <div className="text-white font-medium">{appt.vetName}</div>
                  </td>
                  <td className="text-muted">{appt.clinic}</td>
                  <td>
                    <div className="text-white text-sm">
                      {new Date(appt.scheduledAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(appt.scheduledAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`paw-badge ${
                        appt.status === 'completed'
                          ? 'badge-emerald'
                          : appt.status === 'booked'
                          ? 'badge-cyan'
                          : 'badge-rose'
                      }`}
                    >
                      {appt.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right">
                    {appt.status === 'booked' && (
                      <div className="flex-row justify-end gap-1">
                        <button
                          onClick={() => handleStatusChange(appt.id, 'completed')}
                          className="paw-btn paw-btn-xs paw-btn-primary"
                          title="Mark Completed"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(appt.id, 'no_show')}
                          className="paw-btn paw-btn-xs paw-btn-secondary"
                          title="Mark No-Show"
                        >
                          No Show
                        </button>
                      </div>
                    )}
                    {appt.status === 'completed' && (
                      <span className="text-xs text-emerald flex-row items-center justify-end gap-1">
                        <CheckCircle2 size={12} /> Closed
                      </span>
                    )}
                    {appt.status === 'no_show' && (
                      <span className="text-xs text-rose flex-row items-center justify-end gap-1">
                        <UserX size={12} /> Missed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
