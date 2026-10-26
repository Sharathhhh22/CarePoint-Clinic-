import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ctfskadogvzmmeboajgn.supabase.co'
const ANON_KEY = 'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function audit() {
  console.log('=== DETAILED SUPABASE AUDIT ===\n')

  const tables = [
    'clinics',
    'departments',
    'doctors',
    'appointments',
    'profiles',
    'patient_records',
    'health_history',
    'emergency_calls',
    'doctor_availability'
  ]

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(3)

      if (error) {
        console.log(`❌ [${table}] Error: ${error.code} - ${error.message}`)
      } else {
        console.log(`✅ [${table}] OK - Total records: ${count}`)
        if (data && data.length > 0) {
          console.log(`   Sample record:`, JSON.stringify(data[0]).slice(0, 180) + '...')
        } else {
          console.log(`   (Table exists but is empty)`)
        }
      }
    } catch (e) {
      console.log(`❌ [${table}] Exception: ${e.message}`)
    }
  }

  // Test Auth
  console.log('\n--- TESTING AUTH SERVICE ---')
  const { data: authData, error: authError } = await supabase.auth.getSession()
  console.log('Session check:', authError ? authError.message : 'OK (No active session, as expected)')

  // Check RPC functions
  console.log('\n--- TESTING RPC FUNCTIONS ---')
  const rpcs = ['get_nearby_clinics', 'get_doctor_schedule']
  for (const rpc of rpcs) {
    try {
      const { error: rpcErr } = await supabase.rpc(rpc, {})
      console.log(`RPC [${rpc}]:`, rpcErr ? `${rpcErr.code} - ${rpcErr.message}` : 'OK')
    } catch (err) {
      console.log(`RPC [${rpc}] Exception:`, err.message)
    }
  }
}

audit()
