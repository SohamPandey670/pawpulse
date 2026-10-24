# Database Schema & Performance Specification (DATABASE.md) — PawPulse

Refer to [BACKEND.md](file:///C:/Users/soham/Desktop/pawpulse/docs/BACKEND.md) for detailed column types, constraints, and query indexing strategies.

---

## 1. Database Architecture & Topologies

| Property | Local Development | Cloud Production |
| :--- | :--- | :--- |
| **Engine** | H2 In-Memory (Java 17) | Supabase Managed PostgreSQL 15 |
| **Host** | `localhost` | `aws-0-ap-south-1.pooler.supabase.com` |
| **Port** | `8080` (embedded web console at `/h2-console`) | `5432` (Session Connection Pooler) / `6543` (Transaction Pooler) |
| **Connection Pooling** | HikariCP (embedded) | Supabase PgBouncer IPv4 Connection Pooler + HikariCP |
| **SSL Enforcement** | Disabled (local loopback) | `sslmode=require` (Strict SSL/TLS) |
| **Schema DDL Mode** | `hibernate.ddl-auto: create-drop` | `hibernate.ddl-auto: update` |

---

## 2. Relational Schema Summary (8 Tables)

```text
clinics (id, name, city, state, type)
   │
   ├──< vets (id, clinic_id, name, email, specialization, rating, password_hash)
   │      │
   │      └──< appointments (id, pet_id, vet_id, clinic_id, service_type, status, scheduled_at, completed_at, notes)
   │              │
   │              ├──< prescriptions (id, appointment_id, medication, dosage, duration_days, uploaded)
   │              ├──< payments (id, appointment_id, owner_id, amount, currency, status, paid_at)
   │              └──< referrals (id, appointment_id, from_clinic_id, to_clinic_id, to_vet_id, status, sla_due)
   │
owners (id, name, email, phone, password_hash, city, state)
   │
   └──< pets (id, owner_id, name, species, breed, dob, weight_kg)
```

---

## 3. SQL Scripts Catalog (`sql/`)

| Script | Purpose | When to Use |
| :--- | :--- | :--- |
| **`sql/01_schema.sql`** | Core DDL table creation with UUID primary keys and foreign key constraints. | Fresh database initialization. |
| **`sql/02_kpi_views.sql`** | Analytical views (`v_monthly_revenue`, `v_no_show_analysis`, `v_referral_tat`). | Power BI / Analytics direct connection. |
| **`sql/03_advanced_analytics.sql`** | Window functions (`LAG`, `DENSE_RANK`), cohort retention models, and pivots. | In-depth operational reporting and BI. |
| **`sql/04_seed_data.sql`** | 5,506 synthetic appointments across 6 clinics over 180 days. | High-volume enterprise demonstration. |
| **`sql/supabase_setup.sql`** | Verified relational script tailored for Supabase web SQL editor. | 1-click cloud database population. |
| **`sql/startup_seed.sql`** | **Clean Startup Dataset**: 2 clinics, 2 doctors, 4 owners, 5 distinct pets, and 20 monthly bookings. | Realistic early-stage startup testing and intuitive dashboard learning. |

---

## 4. Startup Seed Dataset (`sql/startup_seed.sql`)

Designed specifically for clarity, ease of inspection, and startup simulation without overwhelming synthetic volume:

* **Clean Hexadecimal UUID Topologies**:
  * Clinics: `11111111-1111-1111-1111-111111111101` .. `...102`
  * Veterinarians: `22222222-2222-2222-2222-222222222201` .. `...202`
  * Pet Parents: `33333333-3333-3333-3333-333333333301` .. `...304`
  * Patient Pets: `44444444-4444-4444-4444-444444444401` .. `...405`
  * Appointments: `55555555-5555-5555-5555-555555555501` .. `...520`
  * Prescriptions: `66666666-6666-6666-6666-666666666601` .. `...605`
  * Payments: `77777777-7777-7777-7777-777777777701` .. `...706`

* **The 5 Startup Pets**:
  1. **`balls`** (Dog, Golden Retriever, 31.5 kg) — Owner: Rahul Mehta
  2. **`Luna`** (Cat, Persian, 4.2 kg) — Owner: Pooja Verma
  3. **`Rocky`** (Dog, German Shepherd, 36.0 kg) — Owner: Amit Shah
  4. **`Whiskers`** (Cat, Domestic Shorthair, 4.0 kg) — Owner: Sneha Iyer
  5. **`Charlie`** (Dog, Beagle, 12.0 kg) — Owner: Rahul Mehta
