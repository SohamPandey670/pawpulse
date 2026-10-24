# Product Requirements Document (PRD) — PawPulse

**Product Name**: PawPulse  
**Subtitle**: Multi-Clinic Pet Healthcare Operations, Telehealth & Clinical Analytics Platform  
**Version**: 1.0.0 (Production Release)  
**Author**: Lead Product Manager & Enterprise Systems Architect  
**Status**: Approved & Live in Production  

---

## 1. Executive Summary & Problem Statement

### 1.1 Problem Statement
Modern veterinary healthcare networks suffer from severe operational fragmentation:
1. **Siloed Patient Records**: Patient clinical histories, vaccination status, and previous surgical notes are scattered across paper charts or disconnected legacy clinic software.
2. **High No-Show Rates**: Clinics report 18–25% appointment no-shows due to lack of automated omnichannel reminders, multi-channel booking flexibility, and transparent booking pipelines.
3. **Friction in Specialist Referrals**: Transferring patients from primary care clinics to emergency or oncology/orthopedic specialists takes days, leading to treatment delays and lost revenue.
4. **Prescription Non-Compliance**: Pet owners frequently miss follow-up dosage regimens because paper prescriptions lack digital tracking and upload verification.
5. **Lack of Operational Telemetry**: Practice owners lack real-time visibility into clinic utilization, revenue per vet, referral acceptance velocity, and inventory usage across multi-city clinics.

### 1.2 Value Proposition
PawPulse delivers an end-to-end, multi-tenant digital health operations suite that unifies:
* **Real-time Clinical Operations**: Instant role-tailored dashboards for Clinic Administrators, Coordinators, Veterinarians, and Pet Owners.
* **Intelligent Appointment Logistics**: Multi-service bookings (Clinic Visit, Telehealth, Home Visit) with automated triage and calendar synchronization.
* **Inter-Clinic Referral Exchange**: Frictionless referral routing between general clinics and specialty hospitals with digital handoffs.
* **Verified Digital Prescriptions**: Direct-to-app prescription issuance with owner dosage tracking and receipt verification.
* **Executive Analytics & BI**: Star-schema SQL data pipelines, live KPI scorecards, and Power BI/Excel operational packs.

### 1.3 Target Personas
* **Persona 1: Dr. Ananya Sharma (Chief Medical Officer / Clinic Admin)**
  * *Needs*: Multi-clinic capacity tracking, revenue per service line, no-show rate suppression, vet utilization rates.
* **Persona 2: Vikram Singh (Clinic Operations Coordinator)**
  * *Needs*: Daily schedule triage, waiting room status, emergency queue management, pending referral approvals.
* **Persona 3: Dr. Karthik Menon (Specialist Veterinarian)**
  * *Needs*: Rapid electronic medical record (EMR) review, SOAP clinical notes logging, one-click digital Rx generation.
* **Persona 4: Rahul Mehta (Pet Parent)**
  * *Needs*: Frictionless online appointment booking, digital vaccine passport, teleconsultation access, transparent invoices.

---

## 2. Core User Journeys & User Stories

### Journey 1: Pet Parent Appointment Booking & Teleconsultation
* **Story**: *As a pet parent, I want to book a specialized consultation for my Golden Retriever across Clinic, Home Visit, or Teleconsult so that my pet receives timely medical care.*
* **Flow**:
  1. Owner logs into Pet Portal.
  2. Selects pet profile ("Bruno"), chooses service category (`Teleconsult`), and selects preferred date/slot.
  3. System matches available verified veterinarians in the city.
  4. Owner confirms booking; appointment state transitions from `PENDING` to `CONFIRMED`.
  5. Teleconsult link generates automatically with pre-visit intake checklist.

### Journey 2: Clinical Coordinator Schedule & Triage Management
* **Story**: *As an operations coordinator, I want a single-pane Kanban/list of all appointments across clinics so that I can reassign delayed slots, accept walk-ins, and prevent bottlenecks.*
* **Flow**:
  1. Coordinator opens Coordinator Console.
  2. Views real-time queue filtered by Clinic (Mumbai, Pune, Bangalore).
  3. Reassigns emergency trauma case to Dr. Vikram Patel (Surgery).
  4. Real-time updates push to Vet Console and Owner SMS/Email alerts.

### Journey 3: Inter-Clinic Specialist Referral
* **Story**: *As a general practice vet, I want to refer a complicated orthopedic case to a specialty surgical hospital so that the patient receives advanced surgery without repeating intake diagnostics.*
* **Flow**:
  1. Vet reviews canine radiograph showing cruciate ligament tear.
  2. Clicks "Create Specialist Referral" inside consultation notes.
  3. Selects Target Specialty ("Orthopedics"), Target Clinic ("PetFirst Hyderabad"), and attaches case summary.
  4. Referral status enters `PENDING_REVIEW`.
  5. Specialist reviews medical history and accepts within SLA (< 4 hours).

---

## 3. Functional Requirements & Feature Matrix

| Module | Feature Code | Requirement Description | Priority |
| :--- | :--- | :--- | :--- |
| **Auth & Security** | `AUTH-01` | JWT stateless authentication with role-based access control (`ADMIN`, `COORDINATOR`, `VET`, `OWNER`). | P0 |
| **Auth & Security** | `AUTH-02` | Session persistence in local secure storage with automatic token refresh and logout. | P0 |
| **Admin Analytics** | `DASH-01` | Real-time KPI summary cards: Total Consults, Gross Revenue (INR), No-Show Rate (%), Active Referrals. | P0 |
| **Admin Analytics** | `DASH-02` | Interactive revenue trend line chart with weekly/monthly granularity and clinic filter. | P0 |
| **Admin Analytics** | `DASH-03` | Vet workload distribution chart and clinic capacity utilization gauges. | P1 |
| **Appointments** | `APPT-01` | Multi-clinic appointment calendar with status filters (`Booked`, `Completed`, `Cancelled`, `No Show`). | P0 |
| **Appointments** | `APPT-02` | Self-service booking engine with dynamic time slot generation and conflict detection. | P0 |
| **Clinical Console** | `VET-01` | Vet-specific workspace showing daily schedule, patient medical records, and past diagnoses. | P0 |
| **Clinical Console** | `VET-02` | Digital SOAP note recording and prescription writer with dosage, frequency, and duration. | P0 |
| **Clinical Console** | `VET-03` | Live webcam/mobile camera prescription snapping & image upload (`.jpg`, `.png`, `.webp`, `.pdf`) with zoom preview modal. | P0 |
| **Dashboard Studio** | `STUDIO-01`| Client-side CSV/Excel auto-dashboard studio with instant KPI generation, dynamic Recharts, and data explorer without new infrastructure. | P0 |
| **Dual Workspace**   | `SWITCH-01`| 1-click dual workspace switcher on Login Page and Header (Studio ⟷ Clinic Operations). | P0 |
| **Referrals** | `REF-01` | Inter-clinic referral tracking module with approval SLA timers and clinical handoff notes. | P1 |
| **Owner Portal** | `OWN-01` | Pet parent dashboard with pet profiles, upcoming appointments, prescription downloads, and billing receipts. | P1 |
| **Data Sync** | `SYNC-01` | Resilient offline-first mock dataset fallback (5,506 records) ensuring zero-failure client presentation. | P0 |

---

## 4. Non-Functional Requirements (NFR)

* **Performance**:
  * P95 API response time < 180ms for all dashboard KPI and appointment queries.
  * Initial frontend load time (FCP) < 1.2s on standard 4G mobile connections.
* **Security & Compliance**:
  * Passwords hashed using industry-standard BCrypt (work factor 10).
  * JWT access tokens signed with HMAC-SHA256 (256-bit secret key).
  * CORS origin enforcement restricting access to authorized domain endpoints.
* **Reliability & Availability**:
  * 99.9% uptime target with automated health check probes (`/api/auth/health`).
  * Cloud deployment leveraging multi-stage Docker containerization on Render and global edge CDN on Vercel.
* **Responsiveness & Usability**:
  * 100% responsive fluid layouts supporting mobile viewports (375px+), tablets, and widescreen desktop monitors (2560px).
  * WCAG 2.1 AA accessibility compliance for color contrast, keyboard navigation, and ARIA labels.

---

## 5. Screen & Page Architecture

1. **`/login` (Universal Authentication)**:
   * Role selector tabs, credential inputs, quick-demo 1-click login profiles for each role, error banners.
2. **`/admin` (Executive Operations Dashboard)**:
   * Top KPI metrics bar, Revenue vs Expenses dynamic charts, Clinic Performance tables, Vet Utilization heatmaps.
3. **`/appointments` (Global Scheduling Matrix)**:
   * Searchable appointment grid, service type tags, status badges, CSV export trigger, detailed patient drawer.
4. **`/booking` (Pet Parent Booking Flow)**:
   * 4-step wizard: Pet selection → Service selection → Clinic/Vet picker → Schedule confirmation.
5. **`/vet` (Veterinarian Clinical Console)**:
   * Today's patient queue, active consultation view, clinical note editor, prescription dispatch modal.
6. **`/coordinator` (Operations & Referral Coordinator)**:
   * Multi-clinic intake board, urgent triage queue, inter-clinic referral approval table.
7. **`/owner` (Pet Parent Wellness Portal)**:
   * Registered pets carousel, upcoming appointments timeline, digital prescription locker, invoice payment receipts.

---

## 6. MVP Scope vs. Future Roadmap

### MVP Scope (Delivered)
* 4 distinct role consoles (Admin, Coordinator, Vet, Owner) with live role switcher.
* Complete synthetic + PostgreSQL database supporting 8 relational entities and 5,500+ records.
* Spring Boot 3 REST API with Docker containerization, dynamic port binding, and JWT security.
* Interactive responsive React 18 UI with Chart.js analytics and clean modern aesthetics.
* Full Power BI star schema data model and Excel executive operations pack.

### Out of Scope (Post-MVP Roadmap)
* WebRTC in-browser peer-to-peer video streaming for teleconsultations.
* Direct SMS gateway (Twilio) and WhatsApp Business API notifications.
* Razorpay / Stripe live payment gateway checkout widget integration.
* Automated IoT pet vital sensors (smart collar Bluetooth sync).
