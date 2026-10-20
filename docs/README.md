# PawPulse — Multi-Clinic Pet Healthcare Operations & Clinical Intelligence Platform

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel%20Live-black?style=for-the-badge&logo=vercel)](https://pawpulse-sohams-projects-011c1ac2.vercel.app)
[![Render Backend](https://img.shields.io/badge/Backend-Render%20Live-46E3B7?style=for-the-badge&logo=render)](https://pawpulse-v1df.onrender.com)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)

**Live Showcase Frontend**: [https://pawpulse-sohams-projects-011c1ac2.vercel.app](https://pawpulse-sohams-projects-011c1ac2.vercel.app)  
**Live Backend API**: [https://pawpulse-v1df.onrender.com](https://pawpulse-v1df.onrender.com)  

---

## 1. Project Overview

**PawPulse** is an enterprise-grade digital health operations platform engineered to unify clinical scheduling, specialist referrals, telemedicine consultations, electronic prescriptions, and executive operational telemetry across multi-city veterinary clinic networks.

Built across a full-stack architecture combining **Spring Boot 3 (Java 17)**, **React 18**, **PostgreSQL 15**, and **Power BI/Excel Analytical Modeling**, PawPulse features a live dataset of over **5,500 patient appointments** and realistic operational workflows.

---

## 2. Key Features by Role

* **Clinic Administrator Dashboard (`/admin`)**:
  * Real-time executive scorecards: Total Consultations, Gross Revenue, No-Show Rates, and Inter-Clinic Transfer SLA velocity.
  * Interactive revenue & patient volume charts.
  * Clinic-by-clinic capacity and vet utilization monitoring.
* **Clinical Operations Coordinator (`/coordinator`)**:
  * Multi-clinic intake board for rapid emergency triage.
  * Specialist referral routing and handoff approval tracking.
* **Veterinarian Clinical Console (`/vet`)**:
  * Today's patient consultation queue with pet breed, age, and clinical history.
  * SOAP medical notes editor and digital prescription writer.
* **Pet Parent Portal (`/owner` & `/booking`)**:
  * Seamless 4-step consultation booking (Clinic Visit, Telehealth, or Home Visit).
  * Digital pet health passport with vaccination records and prescription lockers.
* **Universal Role Switcher**:
  * A top-bar context toggle allowing instant switching between all four personas for friction-free evaluation and demonstration.

---

## 3. Technology Stack

* **Frontend**: React 18, Vite 5, React Router 6, Context API, Vanilla CSS Design System, Lucide Icons, Axios with resilient offline fallback.
* **Backend**: Spring Boot 3.2.5, Java 17, Spring Data JPA, Hibernate ORM, Spring Security 6, JJWT (HMAC-SHA256).
* **Database**: PostgreSQL 15 (Production), H2 Database (Local In-Memory), HikariCP.
* **Data Analytics & BI**: 
  * Advanced SQL window functions, cohort retention analysis, and materialized KPI views.
  * Financial & Operations Excel Pack ([PawPulse_Monthly_Operations_Pack.xlsx](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/excel/PawPulse_Monthly_Operations_Pack.xlsx)).
  * Power BI dimensional star schema with 25+ DAX business measures ([dax_measures.dax](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/powerbi/dax_measures.dax)).
* **DevOps & Cloud**: Docker multi-stage Alpine builds, Render cloud web service, Vercel edge CDN.

---

## 4. Local Development Quickstart

### Prerequisites
* **Node.js** >= 18.x and npm
* **Java JDK** >= 17 (Java 17 or 20/21)
* **Maven** (or use included Docker build)
* **Git**

### Running the Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running the Backend
```powershell
cd backend
mvn clean package -DskipTests
java -jar target/pawpulse-api-1.0.0.jar
```
API runs on [http://localhost:8080](http://localhost:8080). Verify with:
```powershell
curl http://localhost:8080/api/auth/health
```

---

## 5. Architectural Documentation Suite

All 15 complete technical specifications are located in the `docs/` folder:
* [PRD.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/PRD.md): Product requirements & user stories
* [DESIGN.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/DESIGN.md): Visual tokens & UX design system
* [ARCHITECTURE.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/ARCHITECTURE.md): System architecture & topology
* [BACKEND.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/BACKEND.md): Database schemas & Spring Boot logic
* [API.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/API.md): Complete REST endpoint catalog
* [AGENTS.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/AGENTS.md): Multi-agent AI systems
* [PLAN.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/PLAN.md): Implementation milestones & timelines
* [SETUP.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/SETUP.md): Step-by-step installation guide
* [FEATURES.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/FEATURES.md): Feature implementation breakdown
* [AUTHENTICATION.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/AUTHENTICATION.md): Security & RBAC guide
* [MCP.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/MCP.md): Model Context Protocol integration
* [INTEGRATIONS.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/INTEGRATIONS.md): Third-party APIs & cloud services
* [TESTING.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/TESTING.md): QA test suites & benchmarks
* [DEBUGGING.md](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/docs/DEBUGGING.md): Troubleshooting & RCA runbooks
