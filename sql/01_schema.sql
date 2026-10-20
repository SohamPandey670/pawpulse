-- ========================================================
-- 🐾 PawPulse - Pet Healthcare Operations Platform
-- Module 3: PostgreSQL Database Schema (DDL)
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean drop for clean reproduction
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS vets CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS owners CASCADE;

-- 1. CLINICS TABLE
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('clinic', 'mobile', 'teleconsult')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. VETS TABLE
CREATE TABLE vets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.8 CHECK (rating >= 1.0 AND rating <= 5.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. OWNERS TABLE (Pet Parents)
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PETS TABLE
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
    breed VARCHAR(100),
    dob DATE,
    weight_kg NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. APPOINTMENTS TABLE
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    vet_id UUID REFERENCES vets(id) ON DELETE SET NULL,
    clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('teleconsult', 'home_visit', 'clinic')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('booked', 'completed', 'no_show', 'cancelled')),
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. REFERRALS TABLE (Inter-clinic specialist handoffs)
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    from_vet_id UUID REFERENCES vets(id) ON DELETE SET NULL,
    to_vet_id UUID REFERENCES vets(id) ON DELETE SET NULL,
    to_clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('referred', 'accepted', 'completed', 'rejected')),
    referred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    vet_id UUID REFERENCES vets(id) ON DELETE SET NULL,
    medication VARCHAR(200) NOT NULL,
    dosage VARCHAR(150) NOT NULL,
    duration_days INT NOT NULL DEFAULT 7 CHECK (duration_days > 0),
    uploaded BOOLEAN DEFAULT FALSE,
    prescribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMP WITH TIME ZONE
);

-- 8. PAYMENTS TABLE
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Performance B-Tree Indexes for High-Velocity Querying
-- ========================================================
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_service_type ON appointments(service_type);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_appointments_vet_id ON appointments(vet_id);

CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_referred_at ON referrals(referred_at);
CREATE INDEX idx_referrals_to_clinic ON referrals(to_clinic_id);

CREATE INDEX idx_prescriptions_uploaded ON prescriptions(uploaded);
CREATE INDEX idx_prescriptions_appointment ON prescriptions(appointment_id);

CREATE INDEX idx_payments_paid_at ON payments(paid_at);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
