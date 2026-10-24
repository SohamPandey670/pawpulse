# Third-Party Integrations & External Services Guide (INTEGRATIONS.md) — PawPulse

**System Name**: PawPulse Integration Hub  
**Version**: 1.0.0  
**Author**: Principal Integrations & Cloud Infrastructure Engineer  

---

## 1. External Services Architecture & Inventory

| Service | Category | Purpose in PawPulse | SLA / Reliability |
| :--- | :--- | :--- | :--- |
| **Vercel** | Hosting & CDN | Serves React 18 SPA with global edge caching and automated SSL. | 99.99% |
| **Render** | Container Compute | Hosts Spring Boot 3 Docker containers with dynamic port binding. | 99.95% |
| **Supabase** | Cloud PostgreSQL | Managed PostgreSQL 15 accessed via IPv4 Session Pooler (`aws-0-ap-south-1.pooler.supabase.com:5432`). | 99.99% |
| **Twilio SMS** | Communications | Dispatches automated booking confirmation & no-show reminders. | 99.95% |
| **Razorpay / Stripe** | Financial Gateway | Collects consultation and medication fees in INR. | 99.99% |
| **Google Fonts** | CDN Typography | High-performance delivery of the Inter typography font family. | 99.99% |

---

## 2. Cloud Hosting & Database Integrations

### 2.1 Vercel Edge Hosting (Frontend)
* **Configuration**: Declared in [vercel.json](file:///C:/Users/soham/Desktop/pawpulse/frontend/vercel.json).
* **Route Rewriting**:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
* **Environment Variables**:
  * `VITE_API_URL`: Points to the active Render backend API (`https://pawpulse-v1df.onrender.com`).
  * *Important Build Note*: In Vite/React, `VITE_API_URL` is baked into the JavaScript bundle at **build time**. Updating this variable in Vercel settings requires a **Redeploy** (or a new git commit push) for the client application to pick up the live endpoint.
* **Resilient API Client ([api.js](file:///C:/Users/soham/Desktop/pawpulse/frontend/src/services/api.js))**:
  * Automatically normalizes the base URL by appending `/api` if omitted.
  * Increased timeout to `10000ms` (10 seconds) to account for Render cold-starts and connection pooler handshake.
  * Exports `isLiveBackend` to dynamically update the Sidebar system badge (`● Live PostgreSQL Active` vs `Synthetic Demo Active`).

---

### 2.2 Render Container Compute (Backend)
* **Configuration**: Defined in [Dockerfile](file:///C:/Users/soham/Desktop/pawpulse/backend/Dockerfile).
* **Port Binding**: Render supplies the external HTTP port via the environment variable `PORT` (typically `10000`). Spring Boot maps this dynamically:
  ```yaml
  server:
    port: ${PORT:8080}
  ```
* **Database URL Parser ([DatabaseConfig.java](file:///C:/Users/soham/Desktop/pawpulse/backend/src/main/java/com/pawpulse/config/DatabaseConfig.java))**:
  * Features intelligent regex parsing to accept PostgreSQL connection strings in all standard cloud formats (`postgresql://`, `postgres://`, and `jdbc:postgresql://`), extracting the host, port, credentials, and appending `sslmode=require`.
* **Health Probes**: Configured to poll `GET /api/auth/health` with a 30s timeout and 3-retry threshold before marking instances healthy.

---

### 2.3 Supabase Managed PostgreSQL
* **Connection String Format**:
  ```text
  postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
  ```
* **IPv4 Pooler Resolution**: Standard direct Supabase addresses (`db.[PROJECT_ID].supabase.co`) resolve only over IPv6. Because Render container runners communicate via IPv4, the connection must target Supabase's dedicated **IPv4 Pooler** (`pooler.supabase.com`).


---

## 3. Communication & Gateway Integrations

### 3.1 Twilio Omnichannel SMS Gateway
* **Purpose**: Automated SMS reminders sent 24h prior to appointment start time to reduce no-show rates.
* **Environment Variables**:
  ```env
  TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  TWILIO_AUTH_TOKEN=your_auth_token_here
  TWILIO_PHONE_NUMBER=+1234567890
  ```
* **Payload Structure**:
  ```json
  {
    "to": "+919820012345",
    "body": "PawPulse Reminder: Bruno has a Vet Consultation with Dr. Ananya Sharma tomorrow at 02:30 PM. Reply 1 to Confirm or 2 to Reschedule."
  }
  ```
* **Retry Strategy**: Exponential backoff with maximum 3 retries over 15 minutes.

---

### 3.2 Payment Gateway Integration (Razorpay / INR)
* **Purpose**: Processing teleconsultation prepayment and physical clinic invoices.
* **Environment Variables**:
  ```env
  RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
  RAZORPAY_KEY_SECRET=your_key_secret_here
  ```
* **Webhook Handling**: Validates HMAC-SHA256 signature on payment capture events (`payment.captured`) to transition database payment entity from `pending` to `completed`.

---

## 4. Fallback & Resilience Strategy

1. **Third-Party Service Downtime**: If the external SMS or payment gateway fails, the application does not block core clinical workflows. Teleconsultation bookings remain confirmed, and transactions are queued in a dead-letter queue (DLQ) for asynchronous reconciliation.
2. **Offline-First UI Fallback**: If the Render backend is undergoing a cold start, the React frontend leverages client-side synthetic services ([api.js](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/src/services/api.js)), providing uninterrupted presentation access.
