import { NextRequest, NextResponse } from 'next/server'
import { LLMService } from '@/services/llm/llmService'
import { createClient } from '@/utils/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'
import { sanitizeText } from '@/lib/security/sanitize'

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(`doctor_summarize_${ip}`, { limit: 15, windowMs: 60 * 1000 })
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many summary requests. Please slow down.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.reset) },
      }
    )
  }

  try {
    // 2. Authentication check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 3. Role authorization check (Doctor, Staff, or Admin only)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const allowedRoles = ['doctor', 'staff', 'admin']
    if (!profile || !allowedRoles.includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Only healthcare practitioners can generate clinical summaries.' },
        { status: 403 }
      )
    }

    // 4. Input sanitization
    const body = await req.json()
    const patientName = sanitizeText(body.patientName)
    const concern = sanitizeText(body.concern)
    const vitals = body.vitals ? sanitizeText(body.vitals) : undefined
    const notes = body.notes ? sanitizeText(body.notes) : undefined

    if (!patientName || !concern) {
      return NextResponse.json(
        { error: 'Patient name and intake concern are required.' },
        { status: 400 }
      )
    }

    const clinicalNote = await LLMService.draftClinicalNotes({
      patientName,
      concern,
      vitals,
      notes,
    })

    return NextResponse.json(clinicalNote)
  } catch (error: any) {
    console.error('[API /api/doctor/summarize Error]:', error)
    return NextResponse.json(
      { error: 'Failed to generate clinical summary.' },
      { status: 500 }
    )
  }
}
