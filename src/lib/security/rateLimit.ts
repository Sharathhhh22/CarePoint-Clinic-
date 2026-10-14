/**
 * In-Memory Sliding-Window Rate Limiter
 * Provides DDoS, brute-force, and API abuse protection for Next.js Route Handlers.
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Periodically clean up expired entries to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 60 * 1000)
}

export interface RateLimitOptions {
  limit?: number
  windowMs?: number
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): {
  success: boolean
  limit: number
  remaining: number
  reset: number
} {
  const limit = options.limit ?? 20 // 20 requests
  const windowMs = options.windowMs ?? 60 * 1000 // per 60 seconds
  const now = Date.now()

  const existing = rateLimitMap.get(identifier)

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    }
  }

  if (existing.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(existing.resetTime / 1000),
    }
  }

  existing.count += 1
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    reset: Math.ceil(existing.resetTime / 1000),
  }
}

/**
 * Helper to extract client IP from request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return '127.0.0.1'
}
