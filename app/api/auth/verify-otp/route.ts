import { NextRequest, NextResponse } from 'next/server'
import { isFirebaseConfigured } from '@/lib/firebase'
import { hashOtpCode, isOtpExpired } from '@/lib/otp'
import { clearEmailOtpRecord, readEmailOtpRecord } from '@/lib/email-otp-store'
import { bearerTokenFromRequest, verifyFirebaseIdToken } from '@/lib/verify-id-token'

/**
 * POST /api/auth/verify-otp
 * Body: { code: string }
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

  const body = (await req.json().catch(() => null)) as { code?: string } | null
  const code = body?.code?.trim() || ''
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
  }

  const record = await readEmailOtpRecord(verified.uid)
  if (!record?.hash) {
    return NextResponse.json({ error: 'code_expired' }, { status: 400 })
  }
  if (isOtpExpired(record.expiresAt)) {
    await clearEmailOtpRecord(verified.uid).catch(() => undefined)
    return NextResponse.json({ error: 'code_expired' }, { status: 400 })
  }

  const expected = hashOtpCode(verified.uid, code)
  if (expected !== record.hash) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
  }

  await clearEmailOtpRecord(verified.uid).catch(() => undefined)

  return NextResponse.json({
    ok: true,
    emailVerified: Boolean(verified.emailVerified),
  })
}
