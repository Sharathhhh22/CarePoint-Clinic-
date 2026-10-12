import { NextRequest, NextResponse } from 'next/server'
import { LLMService } from '@/services/llm/llmService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { patientName, concern, vitals, notes } = body

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
