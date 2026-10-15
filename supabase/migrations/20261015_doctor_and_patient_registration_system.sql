-- ==============================================================================
-- PATIENT & DOCTOR REGISTRATION AND ROLE-BASED ACCESS MIGRATION
-- Safe, idempotent migration for SlotUrSelf
-- ==============================================================================

-- 1. Ensure hospital_name and practice_location columns exist on doctors table
ALTER TABLE public.doctors 
  ADD COLUMN IF NOT EXISTS hospital_name TEXT,
  ADD COLUMN IF NOT EXISTS practice_location TEXT;

-- 2. Ensure profiles table has mobile and role constraints
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mobile TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. Ensure Storage Bucket for Doctor Verification Documents is PRIVATE
INSERT INTO storage.buckets (id, name, public) 
VALUES ('doctor_verification_docs', 'doctor_verification_docs', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 4. Secure Storage Policies on doctor_verification_docs
-- A) Authenticated doctors can upload verification documents to their own folder
DROP POLICY IF EXISTS "Doctors can upload verification docs" ON storage.objects;
CREATE POLICY "Doctors can upload verification docs" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'doctor_verification_docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- B) Doctors can update their own documents in their folder
DROP POLICY IF EXISTS "Doctors can update own verification docs" ON storage.objects;
CREATE POLICY "Doctors can update own verification docs" ON storage.objects 
FOR UPDATE TO authenticated 
USING (
  bucket_id = 'doctor_verification_docs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- C) Doctors can view their own documents, and Administrators/Staff can view all documents
DROP POLICY IF EXISTS "Admins and owner can read verification docs" ON storage.objects;
CREATE POLICY "Admins and owner can read verification docs" ON storage.objects 
FOR SELECT TO authenticated 
USING (
  bucket_id = 'doctor_verification_docs' AND (
    (storage.foldername(name))[1] = auth.uid()::text OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  )
);

-- 5. Helper Function: How to set the first administrator securely via SQL
-- Usage in Supabase SQL Editor:
--   SELECT public.promote_user_to_admin('your-email@example.com');
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email LIMIT 1;
  
  IF target_user_id IS NULL THEN
    RETURN 'Error: User with email ' || target_email || ' not found.';
  END IF;

  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = target_user_id;

  RETURN 'Success: User ' || target_email || ' (' || target_user_id || ') is now an administrator.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
