import { useState, useEffect, useRef } from 'react';
import {
  Stethoscope,
  Calendar,
  CheckCircle2,
  Clock,
  UserX,
  FilePlus,
  FileText,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Maximize2,
  Eye,
  RefreshCw,
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

  // Prescription Photo & Camera States
  const [rxPhoto, setRxPhoto] = useState(null); // base64 Data URL
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

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

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSelectAppt = (appt) => {
    setSelectedAppt(appt);
    setNotes(appt.notes || '');
    setRxSuccess('');
    setRxPhoto(null);
    stopCamera();
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedAppt) return;
    await AppointmentService.updateStatus(selectedAppt.id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === selectedAppt.id ? { ...a, status, notes } : a))
    );
    setSelectedAppt((prev) => ({ ...prev, status, notes }));
  };

  // --- CAMERA HANDLING ---
  const startCamera = async () => {
    setCameraError('');
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or not available. You can still upload a picture file below.');
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setRxPhoto(dataUrl);
    stopCamera();
  };

  // --- FILE UPLOAD HANDLING ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setRxPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIssueRx = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    if (!medication && !rxPhoto) {
      alert('Please enter medication details or take/upload a prescription photo.');
      return;
    }

    const medName = medication.trim() || 'Prescription Photo Attached';
    const medDosage = dosage.trim() || 'As indicated on uploaded clinical prescription';

    await PrescriptionService.create({
      appointmentId: selectedAppt.id,
      petName: selectedAppt.petName,
      medication: medName,
      dosage: medDosage,
      durationDays: parseInt(duration, 10),
      photoUrl: rxPhoto,
    });

    setRxSuccess(
      `Digital Prescription ${rxPhoto ? 'with Clinical Photo ' : ''}for ${
        selectedAppt.petName
      } generated & uploaded successfully!`
    );
    setMedication('');
    setDosage('');
    setRxPhoto(null);
    stopCamera();
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
            Consultation management, digital charting, and instant photo Rx uploads.
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
                      Parent: <strong className="text-white">{selectedAppt.ownerName}</strong> | Clinic:{' '}
                      {selectedAppt.clinic || 'PawCare Mumbai'}
                    </p>
                  </div>

                  {/* Status Actions */}
                  <div className="flex-row gap-2">
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      className={`paw-btn paw-btn-sm ${
                        selectedAppt.status === 'completed' ? 'paw-btn-primary' : 'paw-btn-outline'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>Completed</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('no_show')}
                      className={`paw-btn paw-btn-sm ${
                        selectedAppt.status === 'no_show' ? 'paw-btn-danger' : 'paw-btn-secondary'
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

              {/* Digital Prescription & Photo Upload Generator */}
              <div className="paw-card paw-rx-generator-card">
                <div className="paw-card-header">
                  <div>
                    <h3 className="paw-card-title">Digital Rx & Prescription Photo Desk</h3>
                    <p className="paw-card-subtitle">
                      Type medications OR snap/upload physical handwritten prescriptions.
                    </p>
                  </div>
                  <span className="paw-badge badge-emerald">Instant Upload</span>
                </div>

                {rxSuccess && (
                  <div className="paw-alert paw-alert-success" style={{ marginBottom: '16px' }}>
                    <CheckCircle2 size={16} />
                    <span>{rxSuccess}</span>
                  </div>
                )}

                {cameraError && (
                  <div className="paw-alert paw-alert-danger" style={{ marginBottom: '16px' }}>
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Camera / Photo Capture Section */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Camera size={16} className="text-accent" />
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
                        Physical Prescription Photo / Camera Capture
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!isCameraOpen ? (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="paw-btn paw-btn-xs paw-btn-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Camera size={13} />
                          <span>Take Photo (Camera)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="paw-btn paw-btn-xs paw-btn-danger"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <X size={13} />
                          <span>Cancel Camera</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="paw-btn paw-btn-xs paw-btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Upload size={13} />
                        <span>Upload Picture</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Live Camera Viewfinder */}
                  {isCameraOpen && (
                    <div
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#000',
                        textAlign: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', maxHeight: '320px', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 10,
                        }}
                      >
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="paw-btn paw-btn-primary"
                          style={{ boxShadow: '0 0 15px rgba(129, 140, 248, 0.6)' }}
                        >
                          <Camera size={16} />
                          <span>Snap Photo Now</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photo Thumbnail Preview */}
                  {rxPhoto ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '10px 14px',
                        background: 'rgba(52, 211, 153, 0.08)',
                        border: '1px solid rgba(52, 211, 153, 0.25)',
                        borderRadius: '8px',
                      }}
                    >
                      <img
                        src={rxPhoto}
                        alt="Prescription preview"
                        style={{
                          width: '54px',
                          height: '54px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                        }}
                        onClick={() => setPreviewModalImg(rxPhoto)}
                        title="Click to enlarge"
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>
                          📷 Prescription Photo Attached
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Ready to upload to pet parent portal
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg(rxPhoto)}
                          className="paw-btn paw-btn-xs paw-btn-secondary"
                          title="Enlarge Photo"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRxPhoto(null)}
                          className="paw-btn paw-btn-xs paw-btn-danger"
                          title="Remove Photo"
                        >
                          <X size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    !isCameraOpen && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: '1px dashed rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                        }}
                      >
                        <ImageIcon size={20} style={{ margin: '0 auto 6px auto', display: 'block', opacity: 0.6 }} />
                        <span>Take a photo with your webcam/mobile camera, or click to upload written prescription image</span>
                      </div>
                    )
                  )}
                </div>

                {/* Medication Details Form (Optional if Photo is attached) */}
                <form onSubmit={handleIssueRx} className="paw-rx-form">
                  <div className="paw-form-grid-3">
                    <div className="paw-form-group">
                      <label className="paw-form-label">
                        Medication Name {rxPhoto ? '(Optional)' : ''}
                      </label>
                      <input
                        type="text"
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        placeholder={rxPhoto ? 'e.g. As written on photo' : 'e.g. Amoxicillin 250mg'}
                        className="paw-form-input"
                        required={!rxPhoto}
                      />
                    </div>

                    <div className="paw-form-group">
                      <label className="paw-form-label">
                        Dosage & Frequency {rxPhoto ? '(Optional)' : ''}
                      </label>
                      <input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder={rxPhoto ? 'e.g. See photo dosage' : 'e.g. 1 tab twice daily'}
                        className="paw-form-input"
                        required={!rxPhoto}
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
                      <span>{rxPhoto ? 'Upload Prescription & Photo' : 'Issue & Upload Prescription'}</span>
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

      {/* Enlarged Photo Modal */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#12121a',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <button
              onClick={() => setPreviewModalImg(null)}
              className="paw-btn paw-btn-xs paw-btn-secondary"
              style={{ position: 'absolute', top: '-12px', right: '-12px', borderRadius: '50%', padding: '6px' }}
            >
              <X size={16} />
            </button>
            <img
              src={previewModalImg}
              alt="Full size prescription"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
