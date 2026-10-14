import { NextResponse } from 'next/server'
import { TriageService } from '@/services/triageService'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'
import { sanitizeText } from '@/lib/security/sanitize'

export async function POST(req: Request) {
  // 1. Rate limiting (15 requests per minute per IP)
  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(`assistant_${ip}`, { limit: 15, windowMs: 60 * 1000 })
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many symptom check requests. Please try again in a minute.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.reset) },
      }
    )
  }

  try {
    const body = await req.json()
    const concern = sanitizeText(body?.concern)

    if (!concern) {
      return NextResponse.json({ error: 'Please provide a valid health concern.' }, { status: 400 })
    }

    const analysis = await TriageService.analyzeSymptoms(concern)
    return NextResponse.json(analysis)
  } catch (error: unknown) {
    console.error('AI Assistant Error:', error)
    return NextResponse.json({ error: 'Failed to analyze concern. Please try again.' }, { status: 500 })
  }
}
