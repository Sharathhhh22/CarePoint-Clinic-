import { NextResponse } from 'next/server'
import { TriageService } from '@/services/triageService'

export async function POST(req: Request) {
  try {
    const { concern } = await req.json()

    if (!concern || typeof concern !== 'string') {
      return NextResponse.json({ error: 'Please provide a health concern.' }, { status: 400 })
    }

    const analysis = await TriageService.analyzeSymptoms(concern)
    return NextResponse.json(analysis)
  } catch (error: unknown) {
    console.error('AI Assistant Error:', error)
    return NextResponse.json({ error: 'Failed to analyze concern. Please try again.' }, { status: 500 })
  }
}
