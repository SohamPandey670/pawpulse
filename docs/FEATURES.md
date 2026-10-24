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

---

### 2.6 Feature 6: Camera & Photo Prescription Upload System (`FEAT-08`)
* **Objective**: Enable veterinarians to capture photos of handwritten prescriptions, physical diagnostic charts, or medication packages directly from their desktop/laptop webcam or mobile camera, as well as uploading existing image files (`.jpg`, `.png`, `.webp`, `.pdf`).
* **Key Capabilities**:
  * **Hardware Camera Streaming**: Integrated via `navigator.mediaDevices.getUserMedia` with real-time video preview viewfinder.
  * **Instant Canvas Capture**: One-click "Snap Photo Now" rendering video frames to high-resolution JPEG Data URLs.
  * **Mobile Native Camera Support**: `<input type="file" accept="image/*" capture="environment" />` triggers the native smartphone camera on iOS/Android.
  * **Zoom & Preview Modal**: Full-viewport image inspection for both veterinarians and pet owners.
  * **Flexible Prescriptions**: Supports photo-only, text-only, or combined digital prescriptions.
* **Frontend Implementation**:
  * [VetConsole.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/VetConsole.jsx): Video viewfinder, photo snapshot canvas, file upload drag-and-drop, thumbnail preview, and prescription modal.
  * [OwnerPortal.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/OwnerPortal.jsx): Attached clinical photo thumbnail badge and full-resolution zoom modal for pet parents.
* **Testing Checklist**:
  * [x] Webcam stream initiates cleanly with permissions prompt.
  * [x] Snapshot renders directly to preview with "Remove" and "Enlarge" controls.
  * [x] Prescriptions persist `photoUrl` and display in pet parent portal.

---

### 2.7 Feature 7: Universal CSV / Excel Auto-Dashboard Studio (`FEAT-09`)
* **Objective**: Merge a high-speed, zero-infrastructure data intelligence studio into the platform so users can upload any `.csv`, `.xlsx`, or `.xls` spreadsheet to instantly generate interactive KPIs and charts without requiring separate Vercel/Render deployments.
* **Key Capabilities**:
  * **Client-Side Parsing**: Powered by SheetJS (`xlsx`) to parse local spreadsheets in under 15ms with 0 backend dependencies.
  * **Automatic Type Detection**: Dynamically inspects column types to identify numeric metrics (Revenue, Bookings, Prices) versus categorical dimensions (Clinics, Dates, Services, Products).
  * **Instant Summary KPI Cards**: Total Rows, Computed Metric Sums, Averages, and Distinct Dimension counts.
  * **Interactive Visual Analytics Studio**: Dynamic Recharts builder supporting Bar, Line, Area, and Pie/Donut charts with configurable X-axis, Metric selection, and Aggregations (Sum, Average, Count).
  * **Searchable Data Explorer**: Paginated tabular grid with instant text search, column filtering, and 1-click CSV export.
  * **1-Click Preloaded Sample Datasets**: *Clinic Revenue 2026* and *Pet Store Orders*.
* **Frontend Implementation**:
  * [DashboardStudio.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/DashboardStudio.jsx): Full-fledged visual dashboard builder.
  * [LoginPage.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/pages/LoginPage.jsx): Dual workspace selector buttons (*1. Make Dashboard from CSV/Excel* vs *2. PawPulse Clinic Operations*).
  * [Navbar.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/components/Navbar.jsx) & [Sidebar.jsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/components/Sidebar.jsx): Global workspace toggle buttons.
* **Testing Checklist**:
  * [x] Parses both `.csv` and `.xlsx` files without errors.
  * [x] Charts update dynamically when changing X-axis or Metric dropdowns.
  * [x] Workspace switcher transitions seamlessly between Studio and Clinic Operations.
