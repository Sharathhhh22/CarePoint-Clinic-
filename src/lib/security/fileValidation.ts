/**
 * File Upload Security and MIME Type Validation Utility
 * Validates file sizes, allowed MIME types, and filename integrity against path traversal.
 */

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export interface FileValidationResult {
  valid: boolean
  error?: string
  cleanFileName?: string
}

export function validateFileUpload(file: {
  name: string
  size: number
  type: string
}): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  // 1. File size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    }
  }

  // 2. MIME type check
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not permitted. Only JPEG, PNG, WEBP, and PDF files are allowed.`,
    }
  }

  // 3. Filename sanitation - prevent directory traversal and script extensions
  const cleanFileName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')

  // Block dangerous double extensions e.g. "invoice.pdf.exe"
  const parts = cleanFileName.split('.')
  const ext = parts.pop()?.toLowerCase()
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf']

  if (!ext || !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File extension ".${ext}" is not permitted.`,
    }
  }

  return {
    valid: true,
    cleanFileName,
  }
}
