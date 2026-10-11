/**
 * Standard API Response contracts
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page?: number
  pageSize?: number
  total?: number
}
