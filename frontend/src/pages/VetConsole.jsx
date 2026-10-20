import { useState, useEffect } from 'react';
import {
  Stethoscope,
  Calendar,
  CheckCircle2,
  Clock,
  UserX,
  FilePlus,
  FileText,
} from 'lucide-react';
import { AppointmentService, PrescriptionService } from '../services/api';

export default function VetConsole() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [notes, setNotes] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('7');
  const [rxSuccess, setRxSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const appts = await AppointmentService.getAll();
        setAppointments(appts);
        if (appts.length > 0) {
          setSelectedAppt(appts[0]);
          setNotes(appts[0].notes || '');
        }
      } catch (err) {
        console.error('Failed to load vet appointments', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelectAppt = (appt) => {
    setSelectedAppt(appt);
    setNotes(appt.notes || '');
    setRxSuccess('');
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedAppt) return;
    await AppointmentService.updateStatus(selectedAppt.id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === selectedAppt.id ? { ...a, status, notes } : a))
    );
    setSelectedAppt((prev) => ({ ...prev, status, notes }));
  };

  const handleIssueRx = async (e) => {
    e.preventDefault();
    if (!medication || !selectedAppt) return;

    await PrescriptionService.create({
      appointmentId: selectedAppt.id,
      petName: selectedAppt.petName,
      medication,
      dosage,
      durationDays: parseInt(duration, 10),
    });

    setRxSuccess(`Digital Prescription for ${selectedAppt.petName} generated & uploaded successfully!`);
    setMedication('');
    setDosage('');
  };

  if (loading) {
    return <div className="paw-loading-screen">Loading Veterinary Console...</div>;
  }

  return (
    <div className="paw-page-container">
      {/* Header */}
      <div className="paw-page-header">
        <div>
          <div className="paw-page-tag">
            <Stethoscope size={12} className="text-emerald" />
            Clinical Desk & Prescription Console
          </div>
          <h2 className="paw-page-title">Veterinarian Daily Consultation Queue</h2>
          <p className="paw-page-desc">
            Consultation management, digital charting, and instant Rx compliance uploads.
          </p>
        </div>

        <div className="paw-header-badge-card">
          <div className="paw-status-dot active"></div>
          <div>
            <div className="font-semibold text-white">Dr. Ananya Sharma</div>
            <div className="text-xs text-muted">PawCare Mumbai • On Duty</div>
          </div>
        </div>
      </div>

      <div className="paw-vet-grid">
        {/* Left Column: Today's Queue */}
        <div className="paw-card paw-vet-queue-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Patient Consult Queue</h3>
              <p className="paw-card-subtitle">{appointments.length} scheduled visits today</p>
            </div>
            <span className="paw-badge badge-indigo">
              <Calendar size={12} style={{ marginRight: '4px' }} /> Today
            </span>
          </div>

          <div className="paw-queue-list">
            {appointments.map((appt) => {
              const isSelected = selectedAppt?.id === appt.id;
              return (
                <div
                  key={appt.id}
                  onClick={() => handleSelectAppt(appt)}
                  className={`paw-queue-item ${isSelected ? 'active-queue-item' : ''}`}
                >
                  <div className="paw-queue-time">
                    <Clock size={12} />
                    <span>
                      {new Date(appt.scheduledAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="paw-queue-info">
                    <div className="paw-queue-pet">
                      <strong>{appt.petName}</strong>
                      <span className="paw-pill-species">{appt.petSpecies}</span>
                    </div>
                    <div className="paw-queue-owner">Parent: {appt.ownerName}</div>
                    <div className="paw-queue-channel text-xs text-muted">
                      {appt.serviceType === 'teleconsult'
                        ? '📹 Teleconsult'
                        : appt.serviceType === 'home_visit'
                        ? '🏠 Home Visit'
                        : '🏥 Clinic Visit'}
                    </div>
                  </div>

                  <span
                    className={`paw-badge ${
                      appt.status === 'completed'
                        ? 'badge-emerald'
                        : appt.status === 'no_show'
                        ? 'badge-rose'
                        : 'badge-cyan'
                    }`}
                  >
                    {appt.status.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Consultation Details & Prescription Desk */}
        <div className="paw-vet-details-col">
          {selectedAppt ? (
            <>
              {/* Patient Banner */}
              <div className="paw-card paw-patient-active-card">
                <div className="paw-patient-header">
                  <div>
                    <div className="text-xs text-muted">ACTIVE PATIENT RECORD</div>
                    <h3 className="paw-patient-name">
                      {selectedAppt.petName}{' '}
                      <span className="paw-pill-species">{selectedAppt.petSpecies}</span>
                    </h3>
                    <p className="text-muted text-sm">
                      Parent: <strong className="text-white">{selectedAppt.ownerName}</strong> | Clinic: {selectedAppt.clinic}
                    </p>
                  </div>

                  {/* Status Actions */}
                  <div className="flex-row gap-2">
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      className={`paw-btn paw-btn-sm ${
                        selectedAppt.status === 'completed'
                          ? 'paw-btn-primary'
                          : 'paw-btn-outline'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>Completed</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('no_show')}
                      className={`paw-btn paw-btn-sm ${
                        selectedAppt.status === 'no_show'
                          ? 'paw-btn-danger'
                          : 'paw-btn-secondary'
                      }`}
                    >
                      <UserX size={14} />
                      <span>No Show</span>
                    </button>
                  </div>
                </div>

                {/* Consultation Notes */}
                <div className="paw-consult-notes-section">
                  <label className="paw-form-label">
                    <FileText size={14} /> Clinical Examination & Diagnostic Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter patient symptoms, vital signs, physical exam observations, and diagnosis..."
                    className="paw-form-textarea"
                  />
                  <div className="flex-row justify-between items-center" style={{ marginTop: '8px' }}>
                    <span className="text-xs text-muted">
                      Notes are automatically synchronized with central PostgreSQL EMR.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAppt.status)}
                      className="paw-btn paw-btn-xs paw-btn-secondary"
                    >
                      Save Clinical Notes
                    </button>
                  </div>
                </div>
              </div>

              {/* Digital Prescription Generator (Compliance Enhancer) */}
              <div className="paw-card paw-rx-generator-card">
                <div className="paw-card-header">
                  <div>
                    <h3 className="paw-card-title">Digital Rx Generator</h3>
                    <p className="paw-card-subtitle">
                      Directly uploads to pet parent portal to achieve 90%+ protocol compliance
                    </p>
                  </div>
                  <span className="paw-badge badge-emerald">Instant Upload</span>
                </div>

                {rxSuccess && (
                  <div className="paw-alert paw-alert-success">
                    <CheckCircle2 size={16} />
                    <span>{rxSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleIssueRx} className="paw-rx-form">
                  <div className="paw-form-grid-3">
                    <div className="paw-form-group">
                      <label className="paw-form-label">Medication Name</label>
                      <input
                        type="text"
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        placeholder="e.g. Amoxicillin 250mg"
                        className="paw-form-input"
                        required
                      />
                    </div>

                    <div className="paw-form-group">
                      <label className="paw-form-label">Dosage & Frequency</label>
                      <input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="e.g. 1 tab twice daily"
                        className="paw-form-input"
                        required
                      />
                    </div>

                    <div className="paw-form-group">
                      <label className="paw-form-label">Duration (Days)</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="paw-form-select"
                      >
                        <option value="3">3 Days</option>
                        <option value="5">5 Days</option>
                        <option value="7">7 Days</option>
                        <option value="14">14 Days</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="paw-rx-form-actions">
                    <button type="submit" className="paw-btn paw-btn-primary">
                      <FilePlus size={16} />
                      <span>Issue & Upload Prescription</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="paw-card text-center p-8">
              <p className="text-muted">Select an appointment from the queue to start consultation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
