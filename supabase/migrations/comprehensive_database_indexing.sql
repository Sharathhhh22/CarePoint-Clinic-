-- ==============================================================================
-- COMPREHENSIVE PRODUCTION DATABASE INDEXING FOR SLOTURSELF (SUPABASE / POSTGRESQL)
-- ==============================================================================
-- Optimizes:
-- 1. Atomic slot locking & availability checks (get_taken_slots)
-- 2. Geospatial clinic radius search (ST_DWithin via GIST)
-- 3. Patient appointment list & history views
-- 4. Doctor portal schedules & emergency routing
-- 5. Full-text / fuzzy search on clinics & doctors
-- 6. Role-based RLS policy evaluations
-- ==============================================================================

-- Ensure required PostgreSQL extensions are active
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ------------------------------------------------------------------------------
-- 1. APPOINTMENTS (appointments & appointments_v2)
-- ------------------------------------------------------------------------------

-- Composite index for fast slot checking in booking wizard (get_taken_slots & holds)
CREATE INDEX IF NOT EXISTS idx_appointments_slot_lookup 
ON appointments (doctor_id, appointment_date, appointment_time, status);

-- Composite index for patient appointment history sorted by date & time
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date_desc 
ON appointments (patient_id, appointment_date DESC, appointment_time DESC);

-- Partial index for active doctor schedules (upcoming and today)
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_schedule 
ON appointments (doctor_id, appointment_date, appointment_time) 
WHERE status IN ('confirmed', 'held', 'upcoming');

-- Partial index for expired hold garbage collection
CREATE INDEX IF NOT EXISTS idx_appointments_held_expiration 
ON appointments (held_until) 
WHERE status = 'held';

-- Index for clinic analytics & administrative reporting
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_date 
ON appointments (clinic_id, appointment_date);

-- Fast ticket lookup for reception check-in
CREATE INDEX IF NOT EXISTS idx_appointments_ticket_number 
ON appointments (ticket_number);

-- Payment transaction status index
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status 
ON appointments (payment_mode, status);

-- Also index appointments_v2 if legacy or mirrored tables are referenced
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments_v2') THEN
    CREATE INDEX IF NOT EXISTS idx_appointments_v2_slot_lookup 
    ON appointments_v2 (doctor_id, appointment_date, appointment_time, status);

    CREATE INDEX IF NOT EXISTS idx_appointments_v2_patient_date 
    ON appointments_v2 (patient_id, appointment_date DESC);
  END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 2. CLINICS
-- ------------------------------------------------------------------------------

-- Spatial GIST Index for PostGIS ST_DWithin & ST_Distance queries
-- Accelerates get_nearby_clinics() from sequential table scan to sub-millisecond index lookup
CREATE INDEX IF NOT EXISTS idx_clinics_location_gist 
ON clinics USING GIST (location);

-- Active status filter index for public clinic directory
CREATE INDEX IF NOT EXISTS idx_clinics_is_active 
ON clinics (is_active) 
WHERE is_active = true;

-- Trigram index for fuzzy / fast autocomplete search by clinic name
CREATE INDEX IF NOT EXISTS idx_clinics_name_trgm 
ON clinics USING GIN (name gin_trgm_ops);


-- ------------------------------------------------------------------------------
-- 3. DOCTORS
-- ------------------------------------------------------------------------------

-- Fast lookup for doctor user profile authentication in /doctor portal
CREATE INDEX IF NOT EXISTS idx_doctors_profile_id 
ON doctors (profile_id);

-- Foreign key relationship to clinics
CREATE INDEX IF NOT EXISTS idx_doctors_clinic_id 
ON doctors (clinic_id);

-- Foreign key relationship to departments
CREATE INDEX IF NOT EXISTS idx_doctors_department_id 
ON doctors (department_id);

-- Partial index for emergency calling availability
CREATE INDEX IF NOT EXISTS idx_doctors_emergency_active 
ON doctors (emergency_calls_enabled) 
WHERE emergency_calls_enabled = true;

-- Specialty index for department filtering
CREATE INDEX IF NOT EXISTS idx_doctors_specialty 
ON doctors (specialty);

-- Trigram index for doctor name search
CREATE INDEX IF NOT EXISTS idx_doctors_name_trgm 
ON doctors USING GIN (name gin_trgm_ops);


-- ------------------------------------------------------------------------------
-- 4. DEPARTMENTS
-- ------------------------------------------------------------------------------

-- Department name lookup index
CREATE INDEX IF NOT EXISTS idx_departments_name 
ON departments (name);

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'clinic_id') THEN
    CREATE INDEX IF NOT EXISTS idx_departments_clinic_id ON departments (clinic_id);
  END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 5. PATIENT RECORDS & HEALTH HISTORY
-- ------------------------------------------------------------------------------

-- Patient medical document listing sorted by newest first
CREATE INDEX IF NOT EXISTS idx_patient_records_patient_created 
ON patient_records (patient_id, created_at DESC);

-- Health history patient index if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'health_history') THEN
    CREATE INDEX IF NOT EXISTS idx_health_history_patient_id ON health_history (patient_id);
  END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 6. EMERGENCY CALLS & TELEPHONY
-- ------------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'emergency_calls') THEN
    CREATE INDEX IF NOT EXISTS idx_emergency_calls_doctor_created 
    ON emergency_calls (doctor_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_emergency_calls_patient_created 
    ON emergency_calls (patient_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_emergency_calls_status 
    ON emergency_calls (status);
  END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 7. PROFILES & RLS EVALUATION ACCELERATION
-- ------------------------------------------------------------------------------

-- Accelerates RLS policies checking (profiles.role = 'admin' OR profiles.role = 'doctor')
CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON profiles (role);

-- Phone number lookup for SMS / OTP / reception desk verification
CREATE INDEX IF NOT EXISTS idx_profiles_mobile 
ON profiles (mobile) 
WHERE mobile IS NOT NULL;

-- Email lookup index
CREATE INDEX IF NOT EXISTS idx_profiles_email 
ON profiles (email);
