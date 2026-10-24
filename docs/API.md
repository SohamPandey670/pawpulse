# RESTful API Specification (API.md) — PawPulse

**API Title**: PawPulse Clinical Operations & Telehealth API  
**Base URL (Production)**: `https://pawpulse-v1df.onrender.com`  
**Base URL (Local)**: `http://localhost:8080`  
**Protocol**: HTTPS (Production) / HTTP (Local)  
**Authentication Scheme**: Bearer Token (JWT HMAC-SHA256)  

---

## 1. Authentication & Security Headers

All protected endpoints require the HTTP Authorization header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
Accept: application/json
```

### Standard Error Response Schema
```json
{
  "timestamp": "2026-10-20T10:15:30.123Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource",
  "path": "/api/dashboard/kpi"
}
```

---

## 2. API Endpoints Catalog

### 2.1 System & Health Checks

#### `GET /`
* **Purpose**: Base URL greeting and API index.
* **Auth**: Public
* **Response `200 OK`**:
```json
{
  "service": "PawPulse Pet Healthcare API",
  "status": "UP",
  "version": "1.0.0",
  "message": "Spring Boot backend is live and operational!",
  "endpoints": {
    "health": "/api/auth/health",
    "login": "/api/auth/login",
    "dashboard": "/api/dashboard/kpi"
  }
}
```

#### `GET /api/auth/health`
* **Purpose**: Infrastructure liveness and readiness probe for cloud orchestrators (Render / Kubernetes).
* **Auth**: Public
* **Response `200 OK`**:
```json
{
  "service": "PawPulse API",
  "version": "1.0.0",
  "status": "UP"
}
```

---

### 2.2 Authentication Module

#### `POST /api/auth/login`
* **Purpose**: Authenticate user credentials and return signed JWT token with user profile.
* **Auth**: Public
* **Request Body**:
```json
{
  "email": "admin@pawpulse.in",
  "password": "adminPassword123"
}
```
* **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": "a00bc6d8-179d-4386-bdad-1c7f07ebdf2d",
  "name": "Dr. Ananya Sharma",
  "email": "admin@pawpulse.in",
  "role": "ADMIN",
  "clinicId": "afdc1951-66e5-45bf-85b9-2ae7d3017d42"
}
```
* **Error Response `401 Unauthorized`**:
```json
{
  "error": "Invalid username or password"
}
```

---

### 2.3 Executive Dashboard Module

#### `GET /api/dashboard/kpi`
* **Purpose**: Return operational metrics for executive overview.
* **Auth**: `ADMIN`, `COORDINATOR`
* **Query Parameters**:
  * `clinicId` *(optional, UUID)*: Filter metrics to specific clinic facility.
  * `startDate` *(optional, ISO-8601)*: Aggregation start window.
  * `endDate` *(optional, ISO-8601)*: Aggregation end window.
* **Response `200 OK`**:
```json
{
  "totalAppointments": 5506,
  "completedAppointments": 4230,
  "noShowCount": 715,
  "noShowRate": 12.98,
  "grossRevenue": 3450200.00,
  "activeReferrals": 142,
  "revenueByMonth": [
    { "month": "2026-01", "revenue": 450000.00 },
    { "month": "2026-02", "revenue": 520000.00 }
  ],
  "appointmentsByService": {
    "clinic": 3200,
    "teleconsult": 1506,
    "home_visit": 800
  }
}
```

---

### 2.4 Appointment & Scheduling Module

#### `GET /api/appointments`
* **Purpose**: Retrieve paginated list of appointments with filter parameters.
* **Auth**: `ADMIN`, `COORDINATOR`, `VET`
* **Query Parameters**:
  * `page` *(int, default: 0)*
  * `size` *(int, default: 20)*
  * `status` *(string, optional)*: `booked`, `completed`, `no_show`, `cancelled`
  * `clinicId` *(UUID, optional)*
* **Response `200 OK`**:
```json
{
  "content": [
    {
      "id": "4f3ac575-28a3-4da6-b5d7-e87eb0a61717",
      "petName": "Bruno",
      "petSpecies": "dog",
      "ownerName": "Rahul Mehta",
      "vetName": "Dr. Ananya Sharma",
      "clinicName": "PawCare Mumbai",
      "serviceType": "teleconsult",
      "status": "completed",
      "scheduledAt": "2026-04-21T18:15:00",
      "amount": 300.00
    }
  ],
  "totalPages": 276,
  "totalElements": 5506,
  "pageNumber": 0
}
```

#### `POST /api/appointments`
* **Purpose**: Book a new consultation.
* **Auth**: `OWNER`, `COORDINATOR`, `ADMIN`
* **Request Body**:
```json
{
  "petId": "3564b24b-5e33-468d-b13d-3864701c9d01",
  "vetId": "5983fcf8-9994-4ac5-9d7c-28f790fdbc94",
  "clinicId": "afdc1951-66e5-45bf-85b9-2ae7d3017d42",
  "serviceType": "clinic",
  "scheduledAt": "2026-10-25T14:30:00",
  "notes": "Annual rabies booster and skin rash check."
}
```
* **Response `201 Created`**:
```json
{
  "id": "893926d1-ac28-40ad-a3a0-4ba271bc363f",
  "status": "booked",
  "scheduledAt": "2026-10-25T14:30:00",
  "message": "Appointment confirmed successfully"
}
```

---

### 2.5 Clinical & Veterinarian Module

#### `GET /api/vets/queue`
* **Purpose**: Retrieve daily consultation queue for the authenticated veterinarian.
* **Auth**: `VET`
* **Response `200 OK`**:
```json
[
  {
    "appointmentId": "4f3ac575-28a3-4da6-b5d7-e87eb0a61717",
    "petName": "Luna",
    "species": "cat",
    "ownerName": "Aarav Desai",
    "serviceType": "clinic",
    "status": "booked",
    "timeSlot": "10:30 AM"
  }
]
```

#### `POST /api/vets/prescriptions`
* **Purpose**: Issue digital prescription following an appointment.
* **Auth**: `VET`
* **Request Body**:
```json
{
  "appointmentId": "4f3ac575-28a3-4da6-b5d7-e87eb0a61717",
  "medication": "Amoxicillin 250mg",
  "dosage": "1 tablet twice daily with food",
  "durationDays": 7
}
```
* **Response `201 Created`**:
```json
{
  "prescriptionId": "4856060e-9dd2-4948-836c-3bd49b6a19ae",
  "status": "issued",
  "uploaded": true
}
```

---

### 2.6 Inter-Clinic Referral Module

#### `POST /api/coordinator/referrals`
* **Purpose**: Route patient to a specialist veterinary clinic.
* **Auth**: `VET`, `COORDINATOR`, `ADMIN`
* **Request Body**:
```json
{
  "appointmentId": "4f3ac575-28a3-4da6-b5d7-e87eb0a61717",
  "toClinicId": "41544529-0825-4686-b37b-9f9f1eb0690b",
  "toVetId": "0566caf1-ec8c-4421-ad64-9e783764b964",
  "reason": "Cruciate ligament rupture requiring orthopedic stabilization."
}
```
* **Response `201 Created`**:
```json
{
  "referralId": "32db1ce8-a5ab-4a83-a6f0-5dcee4a2b3f9",
  "status": "referred",
  "slaDeadline": "2026-10-21T02:00:00Z"
}
```

---

### 2.7 Pet Management Module

#### `GET /api/pets`
* **Purpose**: Retrieve all registered patient pets with clinical metadata and owner information.
* **Auth**: Public / `ADMIN`, `OWNER`, `VET`
* **Query Parameters**:
  * `limit` *(int, optional, default: 50)*: Number of records to return.
* **Response `200 OK`**:
```json
[
  {
    "id": "44444444-4444-4444-4444-444444444401",
    "name": "balls",
    "species": "dog",
    "breed": "Golden Retriever",
    "dob": "2022-03-15",
    "weightKg": 31.5,
    "ownerId": "33333333-3333-3333-3333-333333333301",
    "ownerName": "Rahul Mehta"
  },
  {
    "id": "44444444-4444-4444-4444-444444444402",
    "name": "Luna",
    "species": "cat",
    "breed": "Persian",
    "dob": "2023-05-10",
    "weightKg": 4.2,
    "ownerId": "33333333-3333-3333-3333-333333333302",
    "ownerName": "Pooja Verma"
  }
]
```

#### `GET /api/pets/{id}`
* **Purpose**: Retrieve single pet details by UUID.
* **Auth**: Public / `ADMIN`, `OWNER`, `VET`
* **Response `200 OK`**: Single pet JSON object.

#### `GET /api/pets/owner/{ownerId}`
* **Purpose**: Retrieve all pets belonging to a specific owner.
* **Auth**: Public / `OWNER`, `ADMIN`
* **Response `200 OK`**: Array of pets belonging to that owner.

