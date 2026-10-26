import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ctfskadogvzmmeboajgn.supabase.co'
const ANON_KEY = 'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function testInsert() {
  const testClinic = {
    name: "SlotUrSelf Care - Indiranagar",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    contact_number: "+91 80 4567 8901",
    is_active: true,
    latitude: 12.9719,
    longitude: 77.6412
  }

  const { data, error } = await supabase.from('clinics').insert(testClinic).select()
  console.log('Insert result:', data, 'Error:', error)
}

testInsert()
