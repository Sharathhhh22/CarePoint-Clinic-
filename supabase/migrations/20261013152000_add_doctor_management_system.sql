-- ==============================================================================
-- DOCTOR PROFILE MANAGEMENT & ADMIN APPROVAL SYSTEM MIGRATION
-- Safe, non-destructive, idempotent
-- ==============================================================================

-- 1. Extend doctors table with comprehensive credential & review fields
ALTER TABLE public.doctors 
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS qualifications TEXT,
  ADD COLUMN IF NOT EXISTS medical_registration_no TEXT,
  ADD COLUMN IF NOT EXISTS registration_authority TEXT,
  ADD COLUMN IF NOT EXISTS consultation_fee NUMERIC(10,2) DEFAULT 500.00,
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS admin_reviewer_id UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS verification_doc_url TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add check constraint for doctor status if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_doctors_status'
  ) THEN
    ALTER TABLE public.doctors 
      ADD CONSTRAINT chk_doctors_status 
      CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended'));
  END IF;
END $$;

-- Preserve all existing seed doctors by setting them to 'approved' and active
UPDATE public.doctors 
SET status = 'approved', is_active = true 
WHERE status IS NULL OR status = 'draft';

-- 2. Doctor Availability Table (supports custom clinic hours per weekday)
CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon, ..., 6=Sat
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  time_zone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_avail_times CHECK (end_time > start_time)
);

-- 3. Doctor Verification Review History Table (auditable tracking of decisions)
CREATE TABLE IF NOT EXISTS public.doctor_verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  decision VARCHAR(30) NOT NULL CHECK (decision IN ('approved', 'rejected', 'suspended', 'reactivated')),
  reason TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Storage Buckets configuration
-- Doctor Verification Docs (private bucket for sensitive medical licenses & ID proof)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('doctor_verification_docs', 'doctor_verification_docs', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket (public bucket for doctor and patient profile photos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Indexes for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_doctors_status_active ON public.doctors(status, is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_lookup ON public.doctor_availability(doctor_id, day_of_week, is_active);
CREATE INDEX IF NOT EXISTS idx_verification_history_doctor ON public.doctor_verification_history(doctor_id, reviewed_at DESC);

-- 6. Row Level Security Policies
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_verification_history ENABLE ROW LEVEL SECURITY;

-- DOCTORS TABLE POLICIES:
-- A) Public & patients can view approved & active doctors
DROP POLICY IF EXISTS "Public can view active doctors" ON public.doctors;
DROP POLICY IF EXISTS "Public can view approved active doctors" ON public.doctors;
CREATE POLICY "Public can view approved active doctors" ON public.doctors 
FOR SELECT 
USING (
  (status = 'approved' AND is_active = true) OR
  (auth.uid() IS NOT NULL AND profile_id = auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
);

-- B) Authenticated doctors can create their own draft/pending profile
DROP POLICY IF EXISTS "Doctors can insert own profile" ON public.doctors;
CREATE POLICY "Doctors can insert own profile" ON public.doctors 
FOR INSERT TO authenticated 
WITH CHECK (
  profile_id = auth.uid() AND 
  status IN ('draft', 'pending')
);

-- C) Doctors can update their own profile; admins can update all
DROP POLICY IF EXISTS "Doctors can update own profile" ON public.doctors;
DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;
CREATE POLICY "Doctors and Admins can update doctors" ON public.doctors 
FOR UPDATE TO authenticated 
USING (
  profile_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
)
WITH CHECK (
  profile_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Admins can delete doctors" ON public.doctors 
FOR DELETE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- DOCTOR AVAILABILITY POLICIES:
DROP POLICY IF EXISTS "Public can view doctor availability" ON public.doctor_availability;
CREATE POLICY "Public can view doctor availability" ON public.doctor_availability 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Doctors can manage own availability" ON public.doctor_availability;
CREATE POLICY "Doctors can manage own availability" ON public.doctor_availability 
FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.doctors 
    WHERE doctors.id = doctor_availability.doctor_id 
    AND (doctors.profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.doctors 
    WHERE doctors.id = doctor_availability.doctor_id 
    AND (doctors.profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
  )
);

-- VERIFICATION HISTORY POLICIES:
DROP POLICY IF EXISTS "Admins and Doctor can view verification history" ON public.doctor_verification_history;
CREATE POLICY "Admins and Doctor can view verification history" ON public.doctor_verification_history 
FOR SELECT TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')) OR
  EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = doctor_verification_history.doctor_id AND doctors.profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can insert verification history" ON public.doctor_verification_history;
CREATE POLICY "Admins can insert verification history" ON public.doctor_verification_history 
FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- STORAGE POLICIES FOR doctor_verification_docs (Private):
DROP POLICY IF EXISTS "Doctors can upload verification docs" ON storage.objects;
CREATE POLICY "Doctors can upload verification docs" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'doctor_verification_docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Admins and owner can read verification docs" ON storage.objects;
CREATE POLICY "Admins and owner can read verification docs" ON storage.objects 
FOR SELECT TO authenticated 
USING (
  bucket_id = 'doctor_verification_docs' AND (
    (storage.foldername(name))[1] = auth.uid()::text OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  )
);

-- 7. Database Protection Trigger: Prevent Doctor Self-Approval
CREATE OR REPLACE FUNCTION public.protect_doctor_status_change()
RETURNS TRIGGER AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- If status or administrative review fields are changing:
  IF (NEW.status IS DISTINCT FROM OLD.status) OR 
     (NEW.is_active IS DISTINCT FROM OLD.is_active) OR
     (NEW.admin_reviewer_id IS DISTINCT FROM OLD.admin_reviewer_id) OR
     (NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at) THEN
    
    SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
    
    -- If caller is not an administrator or staff:
    IF caller_role NOT IN ('admin', 'staff') THEN
      -- A doctor can ONLY move from 'draft' or 'rejected' to 'pending' (submitting for review)
      IF (OLD.status IN ('draft', 'rejected') AND NEW.status = 'pending') THEN
        NEW.admin_reviewer_id := NULL;
        NEW.reviewed_at := NULL;
        NEW.rejection_reason := NULL;
        NEW.is_active := false;
      ELSE
        RAISE EXCEPTION 'Unauthorized: Only administrators can modify status to "%" or toggle active status.', NEW.status;
      END IF;
    END IF;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_doctor_status ON public.doctors;
CREATE TRIGGER trg_protect_doctor_status
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_doctor_status_change();
