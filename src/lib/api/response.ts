import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'

export function jsonSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

export function jsonError(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  )
}
