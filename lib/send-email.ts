export type EmailSendResult = {
  stub: boolean
  sent: boolean
  provider?: string
  error?: string
}

/**
 * Transactional email — Resend when RESEND_API_KEY is set, otherwise stub/log.
 */
export async function sendTransactionalEmail(options: {
  to: string
  subject: string
  text: string
  html?: string
}): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.EMAIL_FROM?.trim() || 'AUTOMANQANEBI.GE <onboarding@resend.dev>'

  if (!apiKey) {
    console.info('[email-stub]', options.to, options.subject, options.text.slice(0, 120))
    return { stub: true, sent: false, provider: 'none' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [options.to],
        subject: options.subject,
        text: options.text,
        html: options.html,
      }),
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[email-resend]', res.status, text)
      return { stub: false, sent: false, provider: 'resend', error: text.slice(0, 200) }
    }
    return { stub: false, sent: true, provider: 'resend' }
  } catch (err) {
    console.error('[email-resend]', err)
    return {
      stub: false,
      sent: false,
      provider: 'resend',
      error: err instanceof Error ? err.message : 'send failed',
    }
  }
}

export async function sendEmailOtp(to: string, code: string): Promise<EmailSendResult> {
  return sendTransactionalEmail({
    to,
    subject: 'AUTOMANQANEBI.GE — verification code / ვერიფიკაციის კოდი',
    text: `Your verification code: ${code}\n\nთქვენი ვერიფიკაციის კოდი: ${code}\n\nValid for 10 minutes / მოქმედებს 10 წუთი.`,
    html: `<p>Your verification code:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p><p>თქვენი ვერიფიკაციის კოდი: <strong>${code}</strong></p><p>Valid for 10 minutes.</p>`,
  })
}
