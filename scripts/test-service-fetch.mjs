import { createClient } from '@supabase/supabase-js'
// We will test by importing the transpiled or direct logic
const SUPABASE_URL = 'https://ctfskadogvzmmeboajgn.supabase.co'
const ANON_KEY = 'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function testFetch() {
  console.log('--- TEST 1: Fetch all active clinics ---')
  const { data: clinics, error: cErr } = await supabase.from('clinics').select('id, name, address, latitude, longitude').eq('is_active', true)
  console.log('Clinics found:', clinics?.length, cErr || '')
  clinics?.forEach(c => console.log(` - ${c.name} (${c.address.slice(0, 30)}...)`))

  console.log('\n--- TEST 2: Fetch all approved doctors with clinics ---')
  const { data: docs, error: dErr } = await supabase
    .from('doctors')
    .select('id, name, specialty, consultation_fee, experience_years, clinic_id')
    .eq('is_active', true)
    .eq('status', 'approved')
  console.log('Doctors found:', docs?.length, dErr || '')
  docs?.forEach(d => console.log(` - ${d.name} | ${d.specialty} | ₹${d.consultation_fee} | Clinic: ${d.clinic_id}`))

  console.log('\n--- TEST 3: Doctor Availability for Dr. Sarah Jenkins ---')
  const { data: avail, error: aErr } = await supabase
    .from('doctor_availability')
    .select('*')
    .eq('doctor_id', '33333333-3333-3333-3333-333333333333')
  console.log('Availability slots found:', avail?.length, aErr || '')
}

testFetch()
