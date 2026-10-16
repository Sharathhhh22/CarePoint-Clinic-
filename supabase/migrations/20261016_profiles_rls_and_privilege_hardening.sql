-- ==============================================================================
-- SECURITY HARDENING MIGRATION: PROFILES RLS, PRIVILEGE INTEGRITY & RBAC DEFENSE
-- Safe, idempotent migration for SlotUrSelf Healthcare Platform
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON PUBLIC.PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES FOR PUBLIC.PROFILES

-- A) SELECT Policy:
-- - A user can view their own profile.
-- - Administrators and staff can view all profiles.
-- - Any authenticated user or visitor can view public doctor profiles (needed for discovery & booking).
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy" ON public.profiles
    FOR SELECT TO authenticated, anon
    USING (
        id = auth.uid() OR
        role = 'doctor' OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-- B) INSERT Policy:
-- - Users can only insert their own profile matching auth.uid().
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

-- C) UPDATE Policy:
-- - Users can update their own profile, or admins can update any profile.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (
        id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
    )
    WITH CHECK (
        id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-- 3. POSTGRES TRIGGER: PREVENT SELF-ROLE ESCALATION
-- Even with UPDATE policy, a user updating their own profile MUST NOT be able to change
-- their role from 'patient' to 'admin', 'staff', or 'doctor' directly.
CREATE OR REPLACE FUNCTION public.enforce_profile_role_integrity()
RETURNS TRIGGER AS $$
DECLARE
    current_actor_role TEXT;
BEGIN
    -- If the role is unchanged, allow normal profile update (e.g. name, phone, bio)
    IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
        RETURN NEW;
    END IF;

    -- If role is changing, check if the caller is an administrator
    -- Note: System triggers (e.g. handle_new_user) running in SECURITY DEFINER without auth.uid() pass through
    IF auth.uid() IS NOT NULL THEN
        SELECT role INTO current_actor_role FROM public.profiles WHERE id = auth.uid();
        
        IF current_actor_role NOT IN ('admin', 'staff') THEN
            RAISE EXCEPTION 'Access Denied: Only platform administrators can change user account roles.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_profile_role_integrity ON public.profiles;
CREATE TRIGGER trg_enforce_profile_role_integrity
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_profile_role_integrity();

-- 4. HARDEN MEDICAL RECORDS & HEALTH HISTORY ACCESS
-- Doctors must ONLY have access to patient medical records if the doctor is APPROVED
-- AND the patient has an active or past appointment with that doctor.
ALTER TABLE public.health_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients can manage own health history" ON public.health_history;
CREATE POLICY "Patients can manage own health history" ON public.health_history
    FOR ALL TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        EXISTS (
            SELECT 1 FROM public.appointments
            WHERE appointments.doctor_id IN (
                SELECT id FROM public.doctors WHERE profile_id = auth.uid() AND status = 'approved'
            )
            AND appointments.patient_id = health_history.patient_id
        )
    )
    WITH CHECK (patient_id = auth.uid());

ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients can manage own medical documents" ON public.patient_records;
CREATE POLICY "Patients can manage own medical documents" ON public.patient_records
    FOR ALL TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        EXISTS (
            SELECT 1 FROM public.appointments
            WHERE appointments.doctor_id IN (
                SELECT id FROM public.doctors WHERE profile_id = auth.uid() AND status = 'approved'
            )
            AND appointments.patient_id = patient_records.patient_id
        )
    )
    WITH CHECK (patient_id = auth.uid());

-- 5. HARDEN APPOINTMENTS RLS FOR DOCTORS
-- Only approved doctors can view assigned appointments.
DROP POLICY IF EXISTS "Patients can view their own appointments" ON public.appointments;
CREATE POLICY "Patients can view their own appointments" ON public.appointments
    FOR SELECT TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        doctor_id IN (
            SELECT id FROM public.doctors WHERE profile_id = auth.uid() AND status = 'approved'
        )
    );

DROP POLICY IF EXISTS "Patients can update their own appointments" ON public.appointments;
CREATE POLICY "Patients can update their own appointments" ON public.appointments
    FOR UPDATE TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        doctor_id IN (
            SELECT id FROM public.doctors WHERE profile_id = auth.uid() AND status = 'approved'
        )
    )
    WITH CHECK (
        patient_id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        doctor_id IN (
            SELECT id FROM public.doctors WHERE profile_id = auth.uid() AND status = 'approved'
        )
    );

-- 6. ENSURE AUDIT LOG INTEGRITY
-- Audit logs should never be modified or deleted by anyone once written.
DROP POLICY IF EXISTS "Admins cannot modify audit logs" ON public.audit_logs;
REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated, anon, public;
