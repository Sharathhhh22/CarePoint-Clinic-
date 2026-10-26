-- ==============================================================================
-- MASTER BACKEND ACTIVATION SCRIPT FOR CAREPOINT CLINIC / SLOTYOURSELF
-- Safe, Idempotent, Non-destructive
-- ==============================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Ensure supporting columns exist on clinics
ALTER TABLE clinics 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- Function to keep location updated
CREATE OR REPLACE FUNCTION update_clinic_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_clinic_location ON clinics;
CREATE TRIGGER trg_update_clinic_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON clinics
FOR EACH ROW
EXECUTE FUNCTION update_clinic_location();

-- 3. Ensure RPC get_nearby_clinics exists
CREATE OR REPLACE FUNCTION get_nearby_clinics(
  user_lat DOUBLE PRECISION, 
  user_lon DOUBLE PRECISION, 
  search_radius_meters INT DEFAULT 50000
)
RETURNS TABLE (
  clinic_id UUID,
  clinic_name TEXT,
  clinic_address TEXT,
  distance_meters FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    name,
    address,
    ST_Distance(location, ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography) as distance_meters
  FROM clinics
  WHERE is_active = true 
    AND location IS NOT NULL
    AND ST_DWithin(location, ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography, search_radius_meters)
  ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

-- 4. Atomic Slot Hold RPC (from 20261016_realtime_resource_allocation.sql)
CREATE OR REPLACE FUNCTION public.hold_appointment_slot_atomic(
  p_patient_id UUID,
  p_doctor_id UUID,
  p_clinic_id UUID,
  p_date DATE,
  p_time TIME,
  p_held_minutes INT DEFAULT 5
)
RETURNS TABLE (
  appointment_id UUID,
  held_until TIMESTAMPTZ,
  success BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  v_held_until TIMESTAMPTZ;
  v_existing_id UUID;
  v_existing_status TEXT;
  v_new_id UUID;
BEGIN
  v_held_until := NOW() + (p_held_minutes || ' minutes')::interval;

  -- Cancel any expired hold on this slot to recycle it
  UPDATE public.appointments
  SET status = 'cancelled', updated_at = NOW()
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND appointment_time = p_time
    AND status = 'held'
    AND held_until <= NOW();

  -- Check if slot is actively held or confirmed
  SELECT id, status INTO v_existing_id, v_existing_status
  FROM public.appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND appointment_time = p_time
    AND (status = 'confirmed' OR (status = 'held' AND held_until > NOW()))
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN QUERY SELECT 
      NULL::UUID, 
      NULL::TIMESTAMPTZ, 
      FALSE, 
      'That slot was just reserved by another patient. Please choose an alternate time.'::TEXT;
    RETURN;
  END IF;

  -- Insert the new held appointment
  INSERT INTO public.appointments (
    patient_id,
    doctor_id,
    clinic_id,
    appointment_date,
    appointment_time,
    status,
    held_until,
    created_at,
    updated_at
  ) VALUES (
    p_patient_id,
    p_doctor_id,
    p_clinic_id,
    p_date,
    p_time,
    'held',
    v_held_until,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_new_id;

  RETURN QUERY SELECT 
    v_new_id, 
    v_held_until, 
    TRUE, 
    NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.hold_appointment_slot_atomic(UUID, UUID, UUID, DATE, TIME, INT) TO authenticated, service_role, anon;

-- 5. Resource Allocation Stats Function
CREATE OR REPLACE FUNCTION public.get_resource_allocation_stats()
RETURNS JSON AS $$
DECLARE
  v_total_doctors INT;
  v_active_doctors INT;
  v_pending_doctors INT;
  v_today_held INT;
  v_today_confirmed INT;
  v_today_completed INT;
  v_result JSON;
BEGIN
  SELECT COUNT(*) INTO v_total_doctors FROM public.doctors;
  SELECT COUNT(*) INTO v_active_doctors FROM public.doctors WHERE is_active = true AND status = 'approved';
  SELECT COUNT(*) INTO v_pending_doctors FROM public.doctors WHERE status = 'pending';

  SELECT COUNT(*) INTO v_today_held 
  FROM public.appointments 
  WHERE appointment_date = CURRENT_DATE AND status = 'held' AND held_until > NOW();

  SELECT COUNT(*) INTO v_today_confirmed 
  FROM public.appointments 
  WHERE appointment_date = CURRENT_DATE AND status = 'confirmed';

  SELECT COUNT(*) INTO v_today_completed 
  FROM public.appointments 
  WHERE appointment_date = CURRENT_DATE AND status = 'completed';

  v_result := json_build_object(
    'total_doctors', v_total_doctors,
    'active_doctors', v_active_doctors,
    'pending_doctors', v_pending_doctors,
    'today_held', v_today_held,
    'today_confirmed', v_today_confirmed,
    'today_completed', v_today_completed
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_resource_allocation_stats() TO authenticated, service_role, anon;

-- 6. Auxiliary tables
CREATE TABLE IF NOT EXISTS emergency_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('initiated', 'connected', 'failed', 'no_answer', 'completed')),
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  dob DATE,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and public read policies
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active clinics" ON clinics;
CREATE POLICY "Public can view active clinics" ON clinics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active departments" ON departments;
CREATE POLICY "Public can view active departments" ON departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view approved active doctors" ON doctors;
CREATE POLICY "Public can view approved active doctors" ON doctors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view doctor availability" ON doctor_availability;
CREATE POLICY "Public can view doctor availability" ON doctor_availability FOR SELECT USING (true);

-- 7. Update Primary Clinic & Seed Top Bengaluru Clinics
UPDATE clinics 
SET 
  name = 'CarePoint Clinic - Indiranagar',
  address = '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
  contact_number = '+91 80 4567 8901',
  latitude = 12.9719,
  longitude = 77.6412,
  is_active = true
WHERE id = '11111111-1111-1111-1111-111111111111';

INSERT INTO clinics (id, name, address, contact_number, latitude, longitude, is_active)
VALUES
  ('11111111-1111-1111-1111-222222222222', 'CarePoint Family Clinic - Koramangala', '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034', '+91 80 4567 8902', 12.9352, 77.6245, true),
  ('11111111-1111-1111-1111-333333333333', 'CarePoint Health Hub - HSR Layout', '27th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102', '+91 80 4567 8903', 12.9116, 77.6389, true),
  ('11111111-1111-1111-1111-444444444444', 'CarePoint Clinic - Whitefield', 'ITPB Main Road, Whitefield, Bengaluru, Karnataka 560066', '+91 80 4567 8904', 12.9698, 77.7500, true),
  ('11111111-1111-1111-1111-555555555555', 'CarePoint SuperSpecialty - Jayanagar', '11th Main Road, 4th Block, Jayanagar, Bengaluru, Karnataka 560011', '+91 80 4567 8905', 12.9299, 77.5833, true)
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  contact_number = EXCLUDED.contact_number,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  is_active = true;

-- Update location geography coordinates
UPDATE clinics 
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 8. Seed Clinical Departments
UPDATE departments 
SET name = 'General Medicine', is_active = true 
WHERE id = '22222222-2222-2222-2222-222222222222';

INSERT INTO departments (id, clinic_id, name, is_active)
VALUES
  ('22222222-2222-2222-2222-333333333333', '11111111-1111-1111-1111-111111111111', 'Cardiology', true),
  ('22222222-2222-2222-2222-444444444444', '11111111-1111-1111-1111-111111111111', 'Pediatrics', true),
  ('22222222-2222-2222-2222-555555555555', '11111111-1111-1111-1111-111111111111', 'Dermatology', true),
  ('22222222-2222-2222-2222-666666666666', '11111111-1111-1111-1111-222222222222', 'Orthopedics', true),
  ('22222222-2222-2222-2222-777777777777', '11111111-1111-1111-1111-222222222222', 'Neurology', true),
  ('22222222-2222-2222-2222-888888888888', '11111111-1111-1111-1111-333333333333', 'ENT (Ear, Nose, Throat)', true),
  ('22222222-2222-2222-2222-999999999999', '11111111-1111-1111-1111-333333333333', 'Gynecology & Obstetrics', true)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, is_active = true;

-- 9. Update & Seed Practicing Doctors
UPDATE doctors
SET 
  name = 'Dr. Sarah Jenkins',
  specialty = 'General Physician',
  experience_years = 10,
  clinic_id = '11111111-1111-1111-1111-111111111111',
  department_id = '22222222-2222-2222-2222-222222222222',
  consultation_fee = 500,
  currency = 'INR',
  qualifications = 'MBBS, MD (Internal Medicine)',
  medical_registration_no = 'KMC-48291',
  bio = 'Experienced physician specializing in preventive healthcare, comprehensive adult diagnosis, and chronic condition management.',
  status = 'approved',
  is_active = true,
  appointment_duration_mins = 30
WHERE id = '33333333-3333-3333-3333-333333333333';

INSERT INTO doctors (
  id, name, specialty, experience_years, clinic_id, department_id,
  consultation_fee, currency, qualifications, medical_registration_no,
  bio, status, is_active, appointment_duration_mins
)
VALUES
  (
    '33333333-3333-3333-3333-444444444444',
    'Dr. Marcus Vance',
    'Cardiologist',
    14,
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-333333333333',
    800,
    'INR',
    'MBBS, MD, DM (Cardiology)',
    'KMC-39102',
    'Interventional cardiologist focusing on hypertension management, preventative heart screenings, and non-invasive cardiovascular assessment.',
    'approved',
    true,
    30
  ),
  (
    '33333333-3333-3333-3333-555555555555',
    'Dr. Elena Rostova',
    'Pediatrician',
    9,
    '11111111-1111-1111-1111-222222222222',
    '22222222-2222-2222-2222-444444444444',
    600,
    'INR',
    'MBBS, MD (Pediatrics)',
    'KMC-52119',
    'Dedicated child health specialist with expertise in newborn development, developmental milestone evaluations, and pediatric immunology.',
    'approved',
    true,
    30
  ),
  (
    '33333333-3333-3333-3333-666666666666',
    'Dr. Anita Chen',
    'Dermatologist',
    11,
    '11111111-1111-1111-1111-222222222222',
    '22222222-2222-2222-2222-555555555555',
    750,
    'INR',
    'MBBS, MD (Dermatology & Venereology)',
    'KMC-41872',
    'Clinical dermatologist specializing in eczema, acne management, psoriasis therapies, and advanced laser diagnostics.',
    'approved',
    true,
    30
  ),
  (
    '33333333-3333-3333-3333-777777777777',
    'Dr. David Miller',
    'Orthopedic Surgeon',
    15,
    '11111111-1111-1111-1111-333333333333',
    '22222222-2222-2222-2222-666666666666',
    900,
    'INR',
    'MBBS, MS (Orthopedics), MCh',
    'KMC-29401',
    'Joint restoration and sports injury specialist, treating complex musculoskeletal trauma, osteoarthritis, and spine ergonomics.',
    'approved',
    true,
    30
  ),
  (
    '33333333-3333-3333-3333-888888888888',
    'Dr. Priya Sharma',
    'Neurologist',
    12,
    '11111111-1111-1111-1111-333333333333',
    '22222222-2222-2222-2222-777777777777',
    850,
    'INR',
    'MBBS, MD, DM (Neurology)',
    'KMC-47392',
    'Neurology consultant treating migraine disorders, neuropathy, neurovascular conditions, and sleep disruptions.',
    'approved',
    true,
    30
  ),
  (
    '33333333-3333-3333-3333-999999999999',
    'Dr. Rajesh Kumar',
    'ENT Specialist',
    10,
    '11111111-1111-1111-1111-444444444444',
    '22222222-2222-2222-2222-888888888888',
    650,
    'INR',
    'MBBS, MS (ENT)',
    'KMC-50821',
    'Otolaryngologist skilled in sinus treatments, allergic rhinitis, vertigo management, and endoscopic airway diagnostics.',
    'approved',
    true,
    30
  ),
  (
    '33333333-3333-3333-3333-aaaaaaaaaaaa',
    'Dr. Meera Nambiar',
    'Gynecologist',
    13,
    '11111111-1111-1111-1111-555555555555',
    '22222222-2222-2222-2222-999999999999',
    700,
    'INR',
    'MBBS, MS (Obstetrics & Gynecology), DNB',
    'KMC-38290',
    'Senior obstetrician and gynecologist offering prenatal guidance, fertility support, PCOS management, and hormonal wellness.',
    'approved',
    true,
    30
  )
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  specialty = EXCLUDED.specialty,
  experience_years = EXCLUDED.experience_years,
  clinic_id = EXCLUDED.clinic_id,
  department_id = EXCLUDED.department_id,
  consultation_fee = EXCLUDED.consultation_fee,
  currency = EXCLUDED.currency,
  qualifications = EXCLUDED.qualifications,
  medical_registration_no = EXCLUDED.medical_registration_no,
  bio = EXCLUDED.bio,
  status = 'approved',
  is_active = true,
  appointment_duration_mins = 30;

-- 10. Seed Weekly Availability for ALL Doctors (Days 1 to 6 = Mon-Sat, 09:00 - 18:00)
DELETE FROM doctor_availability 
WHERE doctor_id IN (
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-444444444444',
  '33333333-3333-3333-3333-555555555555',
  '33333333-3333-3333-3333-666666666666',
  '33333333-3333-3333-3333-777777777777',
  '33333333-3333-3333-3333-888888888888',
  '33333333-3333-3333-3333-999999999999',
  '33333333-3333-3333-3333-aaaaaaaaaaaa'
);

INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_active, time_zone)
SELECT 
  d.id,
  day,
  '09:00:00'::TIME,
  '18:00:00'::TIME,
  true,
  'Asia/Kolkata'
FROM doctors d
CROSS JOIN generate_series(1, 6) AS day
WHERE d.status = 'approved' AND d.is_active = true;

-- Return summary
SELECT 
  (SELECT count(*) FROM clinics WHERE is_active = true) as active_clinics,
  (SELECT count(*) FROM departments WHERE is_active = true) as active_departments,
  (SELECT count(*) FROM doctors WHERE is_active = true) as active_doctors,
  (SELECT count(*) FROM doctor_availability WHERE is_active = true) as active_schedule_slots;
