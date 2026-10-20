import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Pill,
  CheckCircle2,
  CalendarPlus,
  ShieldCheck,
} from 'lucide-react';
import { PetService, AppointmentService, PrescriptionService } from '../services/api';

export default function OwnerPortal() {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [petData, apptData, rxData] = await Promise.all([
          PetService.getAll(),
          AppointmentService.getAll(),
          PrescriptionService.getAll(),
        ]);
        setPets(petData);
        setAppointments(apptData);
        setPrescriptions(rxData);
        if (petData.length > 0) setSelectedPet(petData[0]);
      } catch (err) {
        console.error('Error loading pet parent portal', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="paw-loading-screen">Loading Pet Parent Portal...</div>;
  }

  const petAppts = appointments.filter(
    (a) => !selectedPet || a.petName?.toLowerCase() === selectedPet.name?.toLowerCase()
  );
  const petRx = prescriptions.filter(
    (p) => !selectedPet || p.petName?.toLowerCase() === selectedPet.name?.toLowerCase()
  );

  return (
    <div className="paw-page-container">
      {/* Page Header */}
      <div className="paw-page-header">
        <div>
          <div className="paw-page-tag">
            <Heart size={12} className="text-rose" />
            Pet Parent Portal
          </div>
          <h2 className="paw-page-title">My Pets & Healthcare Records</h2>
          <p className="paw-page-desc">
            Keep track of medical history, prescriptions, and book follow-up consultations.
          </p>
        </div>

        <Link to="/book" className="paw-btn paw-btn-primary">
          <CalendarPlus size={16} />
          <span>Book Appointment</span>
        </Link>
      </div>

      {/* Pet Selection Cards */}
      <div className="paw-pet-selector-grid">
        {pets.map((pet) => {
          const isSelected = selectedPet?.id === pet.id;
          return (
            <div
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className={`paw-card paw-pet-card ${isSelected ? 'active-pet-card' : ''}`}
            >
              <div className="paw-pet-card-top">
                <div className="paw-pet-avatar">
                  {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🦜'}
                </div>
                <div>
                  <h3 className="paw-pet-name">{pet.name}</h3>
                  <span className="paw-pill-species">{pet.breed}</span>
                </div>
              </div>

              <div className="paw-pet-meta-grid">
                <div>
                  <span className="text-xs text-muted">Species:</span>
                  <div className="font-medium text-white capitalize">{pet.species}</div>
                </div>
                <div>
                  <span className="text-xs text-muted">Weight:</span>
                  <div className="font-medium text-white">{pet.weightKg} kg</div>
                </div>
                <div>
                  <span className="text-xs text-muted">Born:</span>
                  <div className="font-medium text-white">{pet.dob}</div>
                </div>
                <div>
                  <span className="text-xs text-muted">Status:</span>
                  <div className="font-medium text-emerald flex-row items-center gap-1">
                    <ShieldCheck size={12} /> Healthy
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Prescriptions & Treatment Plan */}
      <div className="paw-owner-content-grid">
        {/* Prescriptions */}
        <div className="paw-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Active Digital Prescriptions</h3>
              <p className="paw-card-subtitle">
                {selectedPet ? `Prescribed treatments for ${selectedPet.name}` : 'All prescriptions'}
              </p>
            </div>
            <span className="paw-badge badge-emerald">Verified Rx</span>
          </div>

          <div className="paw-prescriptions-list">
            {petRx.length === 0 ? (
              <p className="text-muted p-4">No active prescriptions on file.</p>
            ) : (
              petRx.map((rx) => (
                <div key={rx.id} className="paw-owner-rx-item">
                  <div className="paw-rx-icon-wrap">
                    <Pill size={20} className="text-accent" />
                  </div>
                  <div className="paw-rx-body">
                    <div className="font-semibold text-white">{rx.medication}</div>
                    <div className="text-sm text-muted">
                      Dosage: <strong className="text-white">{rx.dosage}</strong> | Course: {rx.durationDays} Days
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                      Prescribed on {new Date(rx.prescribedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="paw-badge badge-indigo">
                    <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Appointment History */}
        <div className="paw-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Consultation History & Schedule</h3>
              <p className="paw-card-subtitle">Past visits and upcoming consultations</p>
            </div>
            <span className="paw-badge badge-cyan">Timeline</span>
          </div>

          <div className="paw-timeline-list">
            {petAppts.length === 0 ? (
              <p className="text-muted p-4">No appointments recorded yet.</p>
            ) : (
              petAppts.map((appt) => (
                <div key={appt.id} className="paw-timeline-item">
                  <div className="paw-timeline-dot"></div>
                  <div className="paw-timeline-content">
                    <div className="flex-row justify-between items-center">
                      <span className="font-semibold text-white">
                        {appt.serviceType === 'teleconsult'
                          ? 'Teleconsultation'
                          : appt.serviceType === 'home_visit'
                          ? 'Home Visit'
                          : 'In-Clinic Checkup'}
                      </span>
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
                    </div>

                    <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                      Attending: {appt.vetName} • {appt.clinic}
                    </div>

                    {appt.notes && (
                      <div className="paw-timeline-notes">
                        <strong>Doctor's Notes:</strong> {appt.notes}
                      </div>
                    )}

                    <div className="text-xs text-accent" style={{ marginTop: '6px' }}>
                      {new Date(appt.scheduledAt).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
