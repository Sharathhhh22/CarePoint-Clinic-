import { jsonError } from './response'

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number = 400,
    public code: string = 'BAD_REQUEST',
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  console.error('[API Error]:', error)

  if (error instanceof ApiError) {
    return jsonError(error.message, error.status, error.code, error.details)
  }

  if (error instanceof Error) {
    return jsonError(error.message || 'An unexpected error occurred', 500, 'INTERNAL_SERVER_ERROR')
  }

  return jsonError('Internal server error', 500, 'UNKNOWN_ERROR')
}
