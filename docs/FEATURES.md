# Feature Engineering & End-to-End Development Guide (FEATURES.md) — PawPulse

**System Name**: PawPulse Clinical Operations Suite  
**Version**: 1.0.0  
**Author**: Principal Full-Stack Engineer & Feature Architect  

---

## 1. Feature Catalog Overview

| Feature ID | Feature Name | Primary Persona | Frontend View | Backend Service |
| :--- | :--- | :--- | :--- | :--- |
| `FEAT-01` | Universal Auth & Role Switcher | All Personas | `/login` & Top Navbar | `AuthService.java` |
| `FEAT-02` | Executive KPI Telemetry & Charts | Admin / Practice Owner | `/admin` | `DashboardService.java` |
| `FEAT-03` | Global Appointment Management | Coordinator / Admin | `/appointments` | `AppointmentController.java` |
| `FEAT-04` | 4-Step Consultation Booking Wizard | Pet Parent (Owner) | `/booking` | `AppointmentController.java` |
| `FEAT-05` | Veterinarian Clinical Console & SOAP | Veterinarian | `/vet` | `AppointmentRepository.java` |
| `FEAT-06` | Inter-Clinic Referral Routing | Coordinator / Vet | `/coordinator` | `ReferralRepository.java` |
| `FEAT-07` | Pet Parent Health Locker & Records | Pet Parent (Owner) | `/owner` | `PetRepository.java` |

---

## 2. Deep-Dive Feature Breakdown

### 2.1 Feature 1: Universal Authentication & Real-Time Role Switching (`FEAT-01`)
* **Objective**: Allow users to authenticate securely with JWT tokens while enabling reviewers, coordinators, and administrators to toggle between all 4 personas with a single click.
* **Frontend Implementation**:
  * [AuthContext.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/context/AuthContext.jsx): Stores active `user` state, role, and authentication tokens in `localStorage`.
  * [Navbar.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/components/Navbar.jsx): Provides pill-style switcher (`Admin`, `Coordinator`, `Veterinarian`, `Pet Owner`) that calls `switchRole(newRole)`.
* **Backend Implementation**:
  * `AuthController.java`: Exposes `POST /api/auth/login`. Compares password with BCrypt and signs JWT with `JwtUtil`.
* **Testing Checklist**:
  * [x] Correct permissions loaded when logging in as `ADMIN`.
  * [x] Switching role immediately changes sidebar navigation routes.
  * [x] Expired tokens redirect cleanly to `/login`.

---

### 2.2 Feature 2: Executive KPI Telemetry & Visual Analytics (`FEAT-02`)
* **Objective**: Provide practice directors with real-time visibility into consultation counts, gross revenue in INR, no-show rates, and clinic capacity utilization.
* **Frontend Implementation**:
  * [AdminDashboard.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/AdminDashboard.jsx): Displays 4 top metric cards (`Total Consults`, `Gross Revenue`, `No-Show Rate`, `Active Referrals`) and dynamic Chart.js canvas widgets for monthly revenue trends and service distribution.
* **Backend Implementation**:
  * `DashboardController.java`: Endpoint `GET /api/dashboard/kpi`.
  * `DashboardService.java`: Executes optimized aggregate queries against PostgreSQL views (`v_monthly_revenue`, `v_no_show_analysis`).
* **Testing Checklist**:
  * [x] KPI metrics load within < 200ms.
  * [x] Trend charts scale correctly on mobile and desktop viewports.
  * [x] Calculations match SQL view outputs.

---

### 2.3 Feature 3: 4-Step Consultation Booking Engine (`FEAT-04`)
* **Objective**: Enable pet parents to book physical clinic visits, telemedicine calls, or home visits through an intuitive, error-free wizard.
* **User Flow**:
  1. **Step 1: Patient Selection**: Owner picks registered pet (or adds new pet).
  2. **Step 2: Service Channel**: Selects `Clinic Visit`, `Teleconsult`, or `Home Visit`.
  3. **Step 3: Clinician & Slot**: Chooses city clinic location and available time slot.
  4. **Step 4: Confirmation**: Enters clinical reason and confirms booking.
* **Frontend Implementation**:
  * [BookingPage.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/BookingPage.jsx): Multi-step state machine with interactive progress indicators.
* **Backend Implementation**:
  * `AppointmentController.java`: Validates time conflict and creates pending appointment record with status `booked`.

---

### 2.4 Feature 4: Veterinarian Daily Triage & Electronic Prescription Pad (`FEAT-05`)
* **Objective**: Give practicing vets an EMR workspace to review daily queues, log SOAP notes, and generate compliant digital prescriptions.
* **Frontend Implementation**:
  * [VetConsole.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/VetConsole.jsx): Side-by-side queue panel and patient clinical record inspector.
  * Digital prescription modal with medication autocomplete, dosage inputs, and print/export triggers.
* **Backend Implementation**:
  * `PrescriptionRepository.java`: Persists medication details linked to `appointment_id` and `vet_id`.
* **Testing Checklist**:
  * [x] Queue automatically sorts by scheduled time.
  * [x] Prescriptions persist and flag `uploaded: true`.
  * [x] Status transitions from `booked` to `completed`.

---

### 2.5 Feature 5: Inter-Clinic Referral Routing & SLA Tracking (`FEAT-06`)
* **Objective**: Route complex emergency, orthopedic, and oncology cases from primary clinics to specialty hospitals with digital handoffs.
* **Frontend Implementation**:
  * [CoordinatorView.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/CoordinatorView.jsx): Real-time referral board showing originating clinic, target clinic, specialty, and pending acceptance timer.
* **Backend Implementation**:
  * `ReferralRepository.java`: Manages state machine transitions (`referred` → `accepted` → `completed`).
* **Testing Checklist**:
  * [x] Transfer notes and reason for referral display clearly.
  * [x] One-click acceptance updates status across both clinics.
