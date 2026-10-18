/**
 * Input Sanitization and XSS Prevention Utility
 * Sanitizes user-provided strings before database writes or AI prompt construction.
 */

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Strip <script> tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip <iframe> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Strip dangerous javascript: pseudo-protocols
    .replace(/javascript:[^"']*/gi, '')
    // Strip inline event handlers like onclick=, onerror=
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Strip common HTML tags while preserving raw text
    .replace(/<[^>]+>/g, '')
    // Filter adversarial prompt injection control delimiters
    .replace(/\[(?:SYSTEM|INSTRUCTION|ADMIN)\]/gi, '')
    .replace(/<{2,3}(?:SYSTEM|INSTRUCTION|ADMIN)>{2,3}/gi, '')
    // Trim whitespace
    .trim()
}

/**
 * Recursively sanitize all string properties in a payload
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    return sanitizeText(obj) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const sanitized = {} as Record<string, unknown>
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized as T
  }

  return obj
}

/**
 * Escapes special HTML characters to prevent HTML/XSS injection in rendered templates
 */
export function escapeHtml(unsafe: unknown): string {
  if (typeof unsafe !== 'string') return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
