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
| **PostgreSQL** | Cloud Database | ACID-compliant relational data store for clinical encounters. | 99.99% |
| **Twilio SMS** | Communications | Dispatches automated booking confirmation & no-show reminders. | 99.95% |
| **Razorpay / Stripe** | Financial Gateway | Collects consultation and medication fees in INR. | 99.99% |
| **Google Fonts** | CDN Typography | High-performance delivery of the Inter typography font family. | 99.99% |

---

## 2. Cloud Hosting Integrations

### 2.1 Vercel Edge Hosting (Frontend)
* **Configuration**: Declared in [vercel.json](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/frontend/vercel.json).
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
* **Deployment Verification**:
  ```powershell
  # Verify production DNS and SSL status
  curl -I https://pawpulse-sohams-projects-011c1ac2.vercel.app
  ```

---

### 2.2 Render Container Compute (Backend)
* **Configuration**: Defined in [Dockerfile](file:///C:/Users/soham/.gemini/antigravity-ide/scratch/pawpulse/backend/Dockerfile).
* **Port Binding**: Render supplies the external HTTP port via the environment variable `PORT` (typically `10000`). Spring Boot maps this dynamically:
  ```yaml
  server:
    port: ${PORT:8080}
  ```
* **Health Probes**: Configured to poll `GET /api/auth/health` with a 30s timeout and 3-retry threshold before marking instances healthy.

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
