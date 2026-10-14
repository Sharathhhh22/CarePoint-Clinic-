-- ==============================================================================
-- SECURITY HARDENING MIGRATION: RLS, IDOR DEFENSE, AUDIT LOGGING & STORAGE
-- ==============================================================================

-- 1. AUDIT LOGS TABLE & RLS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_resource TEXT NOT NULL,
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(target_resource, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT TO authenticated
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'));

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON audit_logs;
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- 2. APPOINTMENTS RLS POLICIES (STOP IDOR)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients can view their own appointments" ON appointments;
CREATE POLICY "Patients can view their own appointments" ON appointments
    FOR SELECT TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
    );

DROP POLICY IF EXISTS "Patients can book appointments" ON appointments;
CREATE POLICY "Patients can book appointments" ON appointments
    FOR INSERT TO authenticated
    WITH CHECK (
        patient_id = auth.uid() OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff')
    );

DROP POLICY IF EXISTS "Patients can update their own appointments" ON appointments;
CREATE POLICY "Patients can update their own appointments" ON appointments
    FOR UPDATE TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
    )
    WITH CHECK (
        patient_id = auth.uid() OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
    );

-- 3. EMERGENCY CALLS RLS POLICIES
CREATE TABLE IF NOT EXISTS emergency_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'initiated',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE emergency_calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients can view own emergency calls" ON emergency_calls;
CREATE POLICY "Patients can view own emergency calls" ON emergency_calls
    FOR SELECT TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
    );

DROP POLICY IF EXISTS "Patients can initiate emergency calls" ON emergency_calls;
CREATE POLICY "Patients can initiate emergency calls" ON emergency_calls
    FOR INSERT TO authenticated
    WITH CHECK (patient_id = auth.uid());

-- 4. HEALTH HISTORY & PATIENT RECORDS RLS
ALTER TABLE health_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients can manage own health history" ON health_history;
CREATE POLICY "Patients can manage own health history" ON health_history
    FOR ALL TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'doctor')
    )
    WITH CHECK (patient_id = auth.uid());

ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients can manage own medical documents" ON patient_records;
CREATE POLICY "Patients can manage own medical documents" ON patient_records
    FOR ALL TO authenticated
    USING (
        patient_id = auth.uid() OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'doctor')
    )
    WITH CHECK (patient_id = auth.uid());

-- 5. DOCTOR VERIFICATION HISTORY AUDIT LOG
CREATE TABLE IF NOT EXISTS doctor_verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    decision TEXT NOT NULL,
    reason TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE doctor_verification_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage verification history" ON doctor_verification_history;
CREATE POLICY "Admins can manage verification history" ON doctor_verification_history
    FOR ALL TO authenticated
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'))
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'));

DROP POLICY IF EXISTS "Doctors can view own review history" ON doctor_verification_history;
CREATE POLICY "Doctors can view own review history" ON doctor_verification_history
    FOR SELECT TO authenticated
    USING (doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid()));

-- 6. PRIVATE STORAGE BUCKET HARDENING
-- Ensure medical_records and doctor_verification_docs buckets are strictly private
UPDATE storage.buckets SET public = false WHERE id IN ('medical_records', 'doctor_verification_docs');

-- Enforce folder ownership on medical records
DROP POLICY IF EXISTS "Users can upload their own medical records" ON storage.objects;
CREATE POLICY "Users can upload their own medical records" 
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'medical_records' AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view their own medical records" ON storage.objects;
CREATE POLICY "Users can view their own medical records" 
ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'medical_records' AND (
    (storage.foldername(name))[1] = auth.uid()::text OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'doctor')
  )
);
