import { NextRequest, NextResponse } from 'next/server'
import { LLMService } from '@/services/llm/llmService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid conversation history with at least one message.' },
        { status: 400 }
      )
    }

    const assistantMessage = await LLMService.chat(messages)
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
