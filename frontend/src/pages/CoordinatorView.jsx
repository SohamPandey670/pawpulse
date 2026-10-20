import { useState, useEffect } from 'react';
import {
  GitPullRequest,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Send,
  ArrowRight,
} from 'lucide-react';
import { ReferralService, PrescriptionService } from '../services/api';

export default function CoordinatorView() {
  const [referrals, setReferrals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [refData, rxData] = await Promise.all([
          ReferralService.getAll(),
          PrescriptionService.getAll(),
        ]);
        setReferrals(refData);
        setPrescriptions(rxData);
      } catch (err) {
        console.error('Failed to load coordinator data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    await ReferralService.updateStatus(id, newStatus);
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              acceptedAt: newStatus === 'accepted' ? new Date().toISOString() : r.acceptedAt,
              tatHours: newStatus === 'accepted' ? 1.8 : r.tatHours,
            }
          : r
      )
    );
  };

  const filteredReferrals = referrals.filter((r) => {
    if (filter === 'BREACHED') return r.tatHours && r.tatHours > 4.0;
    if (filter === 'PENDING') return r.status === 'referred';
    if (filter === 'ACCEPTED') return r.status === 'accepted';
    return true;
  });

  const pendingRx = prescriptions.filter((p) => !p.uploaded);

  if (loading) {
    return <div className="paw-loading-screen">Loading Coordinator Workspace...</div>;
  }

  return (
    <div className="paw-page-container">
      {/* Page Header */}
      <div className="paw-page-header">
        <div>
          <div className="paw-page-tag">
            <GitPullRequest size={12} className="text-amber" />
            Care Coordination & Referral Engine
          </div>
          <h2 className="paw-page-title">SLA Compliance & Patient Handoffs</h2>
          <p className="paw-page-desc">
            Monitor inter-clinic referrals, track turn-around time (TAT), and resolve prescription compliance bottlenecks.
          </p>
        </div>

        <div className="paw-header-actions">
          <div className="paw-time-filter">
            <button
              onClick={() => setFilter('ALL')}
              className={`paw-filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            >
              All Referrals ({referrals.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`paw-filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
            >
              Pending ({referrals.filter((r) => r.status === 'referred').length})
            </button>
            <button
              onClick={() => setFilter('BREACHED')}
              className={`paw-filter-btn ${filter === 'BREACHED' ? 'active' : ''}`}
            >
              SLA Breached ({referrals.filter((r) => r.tatHours && r.tatHours > 4.0).length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards for Coordinator */}
      <div className="paw-kpi-grid">
        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Active Referrals</span>
            <div className="paw-kpi-icon indigo">
              <GitPullRequest size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">{referrals.length}</div>
          <div className="paw-kpi-bottom">
            <span className="paw-kpi-sub">Across 5 specialist clinics</span>
          </div>
        </div>

        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Average Handoff TAT</span>
            <div className="paw-kpi-icon amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">
            2.9 <span className="paw-unit">hours</span>
          </div>
          <div className="paw-kpi-bottom">
            <span className="paw-target-indicator target-met">
              <CheckCircle2 size={13} /> SLA Target: &lt;4.0 hrs
            </span>
          </div>
        </div>

        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Pending Rx Uploads</span>
            <div className="paw-kpi-icon rose">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">{pendingRx.length}</div>
          <div className="paw-kpi-bottom">
            <span className="paw-target-indicator target-breach">
              Action Required
            </span>
            <span className="paw-kpi-sub">Follow-up needed with attending vet</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Referrals Pipeline & Rx Escalations */}
      <div className="paw-coordinator-grid">
        {/* Referrals Pipeline */}
        <div className="paw-card paw-pipeline-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Inter-Clinic Referral Queue</h3>
              <p className="paw-card-subtitle">Real-time status of specialist consultations</p>
            </div>
            <span className="paw-badge badge-amber">Live Pipeline</span>
          </div>

          <div className="paw-referrals-list">
            {filteredReferrals.map((ref) => {
              const isBreached = ref.tatHours && ref.tatHours > 4.0;
              return (
                <div
                  key={ref.id}
                  className={`paw-referral-item ${isBreached ? 'breach-border' : ''}`}
                >
                  <div className="paw-referral-top">
                    <div className="paw-ref-patient">
                      <span className="paw-ref-pet-name">{ref.petName}</span>
                      <span className="text-muted">({ref.ownerName})</span>
                    </div>

                    <div className="paw-ref-badges">
                      {isBreached && (
                        <span className="paw-badge badge-rose">
                          <AlertTriangle size={12} /> SLA BREACH ({ref.tatHours}h)
                        </span>
                      )}
                      <span
                        className={`paw-badge ${
                          ref.status === 'completed'
                            ? 'badge-emerald'
                            : ref.status === 'accepted'
                            ? 'badge-cyan'
                            : 'badge-amber'
                        }`}
                      >
                        {ref.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="paw-ref-journey">
                    <div className="paw-journey-node">
                      <span className="paw-node-label">Originating Vet:</span>
                      <span className="paw-node-value">{ref.fromVet}</span>
                    </div>
                    <ArrowRight size={16} className="text-muted" />
                    <div className="paw-journey-node">
                      <span className="paw-node-label">Referred To:</span>
                      <span className="paw-node-value">{ref.toVet} ({ref.toClinic})</span>
                    </div>
                  </div>

                  <div className="paw-ref-reason">
                    <strong>Clinical Reason:</strong> {ref.reason}
                  </div>

                  <div className="paw-ref-actions">
                    <div className="paw-ref-time text-muted">
                      Referred: {new Date(ref.referredAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>

                    <div className="flex-row gap-2">
                      {ref.status === 'referred' && (
                        <button
                          onClick={() => handleUpdateStatus(ref.id, 'accepted')}
                          className="paw-btn paw-btn-sm paw-btn-primary"
                        >
                          <CheckCircle2 size={14} />
                          <span>Accept Handoff</span>
                        </button>
                      )}
                      {ref.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(ref.id, 'completed')}
                          className="paw-btn paw-btn-sm paw-btn-outline"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prescription Escalation Panel */}
        <div className="paw-card paw-rx-panel">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Prescription Follow-Up Desk</h3>
              <p className="paw-card-subtitle">Ensure digital records match physical consultations</p>
            </div>
            <span className="paw-badge badge-rose">Compliance Target: 90%</span>
          </div>

          <div className="paw-rx-list">
            {prescriptions.map((p) => (
              <div
                key={p.id}
                className={`paw-rx-card ${p.uploaded ? 'rx-uploaded' : 'rx-pending'}`}
              >
                <div className="paw-rx-card-header">
                  <div>
                    <span className="font-semibold text-white">{p.petName}</span>
                    <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '6px' }}>
                      Appt #{p.appointmentId}
                    </span>
                  </div>
                  {p.uploaded ? (
                    <span className="paw-badge badge-emerald">
                      <FileCheck size={12} /> Uploaded
                    </span>
                  ) : (
                    <span className="paw-badge badge-rose">
                      <AlertTriangle size={12} /> Pending Upload
                    </span>
                  )}
                </div>

                <div className="paw-rx-details">
                  <div className="text-accent font-medium">{p.medication}</div>
                  <div className="text-muted text-xs">
                    Dosage: {p.dosage} | Duration: {p.durationDays} days
                  </div>
                </div>

                {!p.uploaded && (
                  <button
                    onClick={() => {
                      alert(`Follow-up notification sent to attending vet for ${p.petName}'s prescription.`);
                    }}
                    className="paw-btn paw-btn-xs paw-btn-secondary w-full"
                    style={{ marginTop: '8px' }}
                  >
                    <Send size={12} />
                    <span>Ping Attending Vet</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
