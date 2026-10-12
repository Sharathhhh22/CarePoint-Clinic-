/**
 * Centralized Environment Configuration
 * Validates and provides typed access to environment variables.
 */

export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ctfskadogvzmmeboajgn.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    isAvailable: () => Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MISSING_API_KEY'),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    isAvailable: () => Boolean(process.env.OPENAI_API_KEY),
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022',
    isAvailable: () => Boolean(process.env.ANTHROPIC_API_KEY),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    isConfigured: () => Boolean(process.env.STRIPE_SECRET_KEY),
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'Appointments <onboarding@resend.dev>',
    isConfigured: () => Boolean(process.env.RESEND_API_KEY),
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    isConfigured: () => Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ),
  },
  app: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  }
} as const
