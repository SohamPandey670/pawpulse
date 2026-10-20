import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  Video,
  Home,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AppointmentService } from '../services/api';
import { samplePets } from '../data/syntheticData';

const SERVICES = [
  {
    id: 'teleconsult',
    title: 'Teleconsultation',
    desc: 'Instant video consultation with top veterinary specialist',
    price: 300,
    icon: Video,
    color: '#818cf8',
  },
  {
    id: 'clinic',
    title: 'In-Clinic Checkup',
    desc: 'Comprehensive physical examination at partner clinic',
    price: 450,
    icon: Building2,
    color: '#34d399',
  },
  {
    id: 'home_visit',
    title: 'Home Visit',
    desc: 'Doorstep clinical consultation by an experienced vet',
    price: 650,
    icon: Home,
    color: '#22d3ee',
  },
];

const CLINICS = [
  { name: 'PawCare Mumbai', city: 'Mumbai', vet: 'Dr. Ananya Sharma' },
  { name: 'VetLife Pune', city: 'Pune', vet: 'Dr. Vikram Patel' },
  { name: 'PetFirst Bangalore', city: 'Bangalore', vet: 'Dr. Priya Nair' },
  { name: 'PawCare Delhi', city: 'Delhi', vet: 'Dr. Rahul Desai' },
  { name: 'VetLife Chennai', city: 'Chennai', vet: 'Dr. Meera Iyer' },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(samplePets[0]?.name || 'Bruno');
  const [selectedService, setSelectedService] = useState('teleconsult');
  const [selectedClinic, setSelectedClinic] = useState(CLINICS[0]);
  const [bookingDate, setBookingDate] = useState('2026-10-20');
  const [bookingTime, setBookingTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeServiceObj = SERVICES.find((s) => s.id === selectedService);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apptData = {
      petName: selectedPet,
      petSpecies: selectedPet === 'Whiskers' || selectedPet === 'Simba' ? 'cat' : selectedPet === 'Polly' ? 'bird' : 'dog',
      ownerName: 'Rahul Mehta',
      vetName: selectedClinic.vet,
      clinic: selectedClinic.name,
      serviceType: selectedService,
      scheduledAt: `${bookingDate}T${bookingTime}:00`,
      notes,
    };

    try {
      await AppointmentService.create(apptData);
      setBookedSuccess(true);
      setTimeout(() => {
        navigate('/owner');
      }, 2500);
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paw-page-container">
      <div className="paw-page-header">
        <div>
          <div className="paw-page-tag">
            <CalendarPlus size={12} className="text-cyan" />
            Seamless Online Booking
          </div>
          <h2 className="paw-page-title">Book Veterinary Consultation</h2>
          <p className="paw-page-desc">
            Schedule teleconsults, home visits, or clinic appointments with licensed specialists.
          </p>
        </div>
      </div>

      {bookedSuccess ? (
        <div className="paw-card text-center p-8">
          <div className="paw-success-icon-wrap">
            <CheckCircle2 size={48} className="text-emerald" />
          </div>
          <h3 className="paw-card-title text-xl" style={{ marginTop: '16px' }}>
            Appointment Successfully Booked!
          </h3>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            Confirmed for <strong>{selectedPet}</strong> on {bookingDate} at {bookingTime} with{' '}
            {selectedClinic.vet}. Redirecting to your portal...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="paw-booking-grid">
          {/* Main Booking Form */}
          <div className="paw-booking-main">
            {/* Step 1: Pet Selection */}
            <div className="paw-card mb-6">
              <h3 className="paw-card-title mb-4">1. Select Patient</h3>
              <div className="paw-pet-select-pills">
                {samplePets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPet(p.name)}
                    className={`paw-pet-pill-btn ${selectedPet === p.name ? 'active' : ''}`}
                  >
                    <span>{p.species === 'dog' ? '🐕' : p.species === 'cat' ? '🐈' : '🦜'}</span>
                    <span>{p.name}</span>
                    <span className="text-xs text-muted">({p.breed})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Service Selection */}
            <div className="paw-card mb-6">
              <h3 className="paw-card-title mb-4">2. Choose Consultation Type</h3>
              <div className="paw-service-cards-grid">
                {SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = selectedService === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={`paw-service-select-card ${isSelected ? 'active-service' : ''}`}
                    >
                      <div className="paw-service-card-top">
                        <div
                          className="paw-service-icon"
                          style={{ backgroundColor: `${srv.color}20`, color: srv.color }}
                        >
                          <Icon size={20} />
                        </div>
                        <span className="paw-service-price">₹{srv.price}</span>
                      </div>
                      <div className="paw-service-title">{srv.title}</div>
                      <p className="paw-service-desc">{srv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Clinic & Attending Doctor */}
            <div className="paw-card mb-6">
              <h3 className="paw-card-title mb-4">3. Select Clinic & Attending Specialist</h3>
              <div className="paw-clinics-grid">
                {CLINICS.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedClinic(c)}
                    className={`paw-clinic-select-card ${
                      selectedClinic.name === c.name ? 'active-clinic' : ''
                    }`}
                  >
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-sm text-accent">{c.vet}</div>
                    <div className="text-xs text-muted">{c.city}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Date, Time & Clinical Reason */}
            <div className="paw-card">
              <h3 className="paw-card-title mb-4">4. Preferred Date & Time</h3>
              <div className="paw-form-grid-2">
                <div className="paw-form-group">
                  <label className="paw-form-label">Consultation Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="paw-form-input"
                    required
                  />
                </div>
                <div className="paw-form-group">
                  <label className="paw-form-label">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="paw-form-select"
                  >
                    <option value="09:30">09:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="paw-form-group" style={{ marginTop: '14px' }}>
                <label className="paw-form-label">Symptoms or Reason for Visit</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your pet's current symptoms, appetite, or behavioral changes..."
                  className="paw-form-textarea"
                />
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="paw-booking-summary-col">
            <div className="paw-card paw-summary-card">
              <h3 className="paw-card-title mb-4">Booking Summary</h3>

              <div className="paw-summary-row">
                <span className="text-muted">Patient:</span>
                <span className="font-semibold text-white">{selectedPet}</span>
              </div>

              <div className="paw-summary-row">
                <span className="text-muted">Service:</span>
                <span className="font-semibold text-accent">{activeServiceObj?.title}</span>
              </div>

              <div className="paw-summary-row">
                <span className="text-muted">Clinic:</span>
                <span className="font-medium text-white">{selectedClinic.name}</span>
              </div>

              <div className="paw-summary-row">
                <span className="text-muted">Doctor:</span>
                <span className="font-medium text-white">{selectedClinic.vet}</span>
              </div>

              <div className="paw-summary-row">
                <span className="text-muted">Date & Time:</span>
                <span className="font-medium text-white">
                  {bookingDate} at {bookingTime}
                </span>
              </div>

              <div className="paw-divider my-4"></div>

              <div className="paw-summary-row total">
                <span className="font-bold text-white">Total Amount:</span>
                <span className="font-bold text-emerald text-lg">
                  ₹{activeServiceObj?.price}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="paw-btn paw-btn-primary w-full mt-6"
              >
                {loading ? 'Confirming...' : 'Confirm & Reserve Slot'}
                <ArrowRight size={16} />
              </button>

              <div className="text-xs text-center text-muted mt-3">
                Instant confirmation • No upfront cancellation fee
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
