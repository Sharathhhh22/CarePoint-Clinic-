import { NextRequest, NextResponse } from 'next/server'
import { LLMService } from '@/services/llm/llmService'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'
import { sanitizeText } from '@/lib/security/sanitize'

export async function POST(req: NextRequest) {
  // 1. Rate limiting (20 chat turns per minute per IP)
  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(`chat_${ip}`, { limit: 20, windowMs: 60 * 1000 })
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'You are sending messages too quickly. Please wait a moment.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.reset) },
      }
    )
  }

  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid conversation history with at least one message.' },
        { status: 400 }
      )
    }

    // 2. Sanitize user messages to prevent prompt injection or script attacks
    const sanitizedMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = messages
      .slice(-10)
      .map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
        content: sanitizeText(msg.content),
      }))

    const assistantMessage = await LLMService.chat(sanitizedMessages)
    return NextResponse.json(assistantMessage)
  } catch (error: any) {
    console.error('[API /api/chat Error]:', error)
    return NextResponse.json(
      { 
        error: 'The AI assistant is temporarily unavailable. Please try again shortly.',
        fallbackMessage: {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'I apologize for the interruption. While our AI service reconnects, you can browse verified doctors directly or use our booking page.',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}
