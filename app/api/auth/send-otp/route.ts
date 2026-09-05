import { NextRequest, NextResponse } from 'next/server'
import { isFirebaseConfigured } from '@/lib/firebase'
import { generateOtpCode, hashOtpCode, otpExpiresAt } from '@/lib/otp'
import { saveEmailOtpRecord } from '@/lib/email-otp-store'
import { sendEmailOtp } from '@/lib/send-email'
import { sendSms } from '@/lib/sms-send'
import { toE164Phone } from '@/lib/phone'
import { bearerTokenFromRequest, verifyFirebaseIdToken } from '@/lib/verify-id-token'

/**
 * POST /api/auth/send-otp
 * Body: { channel: 'email' | 'sms', phone?: string }
 * Auth: Bearer Firebase ID token
 */
export async function POST(req: NextRequest) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  const idToken = bearerTokenFromRequest(req)
  const verified = await verifyFirebaseIdToken(idToken)
  if (!verified) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as {
    channel?: string
    phone?: string
  } | null

  const channel = body?.channel === 'sms' ? 'sms' : body?.channel === 'email' ? 'email' : null
  if (!channel) {
    return NextResponse.json({ error: 'invalid_channel' }, { status: 400 })
  }

  const code = generateOtpCode()
  const hash = hashOtpCode(verified.uid, code)
  const expiresAt = otpExpiresAt()

  await saveEmailOtpRecord(verified.uid, {
    hash,
    expiresAt,
    updatedAt: Date.now(),
  })

  if (channel === 'email') {
    const email = verified.email?.trim()
    if (!email) {
      return NextResponse.json({ error: 'email_missing' }, { status: 400 })
    }
    const result = await sendEmailOtp(email, code)
    return NextResponse.json({
      ok: true,
      channel: 'email',
      destination: maskEmail(email),
      sent: result.sent,
      stub: result.stub,
      // Local/dev only — never expose codes when a real provider is configured.
      ...(result.stub || process.env.NODE_ENV !== 'production' ? { devCode: code } : {}),
    })
  }

  const e164 = toE164Phone(body?.phone || '')
  if (!e164) {
    return NextResponse.json({ error: 'invalid_phone' }, { status: 400 })
  }

  const sms = await sendSms(
    e164,
    `AUTOMANQANEBI.GE code: ${code}\nვერიფიკაციის კოდი: ${code}`
  )

  return NextResponse.json({
    ok: true,
    channel: 'sms',
    destination: maskPhone(e164),
    sent: sms.queued && !sms.stub,
    stub: sms.stub,
    ...(sms.stub || process.env.NODE_ENV !== 'production' ? { devCode: code } : {}),
  })
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return '***'
  const visible = user.slice(0, Math.min(2, user.length))
  return `${visible}***@${domain}`
}

function maskPhone(e164: string): string {
  if (e164.length < 6) return '***'
  return `${e164.slice(0, 4)}***${e164.slice(-2)}`
}
