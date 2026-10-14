/**
 * Invisible CAPTCHA and Bot Protection Verification Utility
 * Supports Cloudflare Turnstile and Google reCAPTCHA v3.
 * Gracefully permits submissions when keys are not configured in local environment.
 */

export async function verifyCaptchaToken(
  token?: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string }> {
  const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY

  // If no secret key is configured, pass gracefully (development/demo environment)
  if (!turnstileSecret && !recaptchaSecret) {
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'Security verification token is missing.' }
  }

  // 1. Cloudflare Turnstile
  if (turnstileSecret) {
    try {
      const formData = new FormData()
      formData.append('secret', turnstileSecret)
      formData.append('response', token)
      if (ipAddress) {
        formData.append('remoteip', ipAddress)
      }

      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      })

      const outcome = await res.json()
      if (outcome.success) {
        return { success: true }
      }
      return { success: false, error: 'Bot verification check failed.' }
    } catch (err) {
      console.error('Turnstile verification error:', err)
      return { success: false, error: 'Verification service unreachable.' }
    }
  }

  // 2. Google reCAPTCHA v3
  if (recaptchaSecret) {
    try {
      const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}${
          ipAddress ? `&remoteip=${ipAddress}` : ''
        }`,
        { method: 'POST' }
      )

      const outcome = await res.json()
      // reCAPTCHA v3 returns a score between 0.0 and 1.0 (0.5+ is typical threshold for humans)
      if (outcome.success && (outcome.score === undefined || outcome.score >= 0.5)) {
        return { success: true }
      }
      return { success: false, error: 'reCAPTCHA bot verification check failed.' }
    } catch (err) {
      console.error('reCAPTCHA verification error:', err)
      return { success: false, error: 'Verification service unreachable.' }
    }
  }

  return { success: true }
}
