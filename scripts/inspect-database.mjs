import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ctfskadogvzmmeboajgn.supabase.co'
const ANON_KEY = 'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function inspect() {
  console.log('--- CLINICS ---')
  const { data: clinics, error: cErr } = await supabase.from('clinics').select('*')
  console.log(clinics, cErr)

  console.log('--- DEPARTMENTS ---')
  const { data: depts, error: dErr } = await supabase.from('departments').select('*')
  console.log(depts, dErr)

  console.log('--- DOCTORS ---')
  const { data: docs, error: docErr } = await supabase.from('doctors').select('*')
  console.log(docs, docErr)
}

inspect()
