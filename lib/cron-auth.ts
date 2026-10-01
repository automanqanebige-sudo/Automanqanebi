import { NextRequest, NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/site'
import { readFirebaseOptions } from '@/lib/firebase'

/**
 * Cron / admin-triggered jobs: Bearer CRON_SECRET, or Firebase ID token of an admin.
 * Returns null when allowed; otherwise a response to return.
 */
export async function assertCronOrAdminAuth(
  req: NextRequest
): Promise<NextResponse | null> {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization') || req.headers.get('x-cron-secret') || ''

  if (secret && (auth === `Bearer ${secret}` || auth === secret)) {
    return null
  }

  const idToken = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (idToken && idToken !== secret) {
    const email = await lookupIdTokenEmail(idToken)
    if (email && isAdminEmail(email)) return null
  }

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured and caller is not an admin' },
      { status: 503 }
    )
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

async function lookupIdTokenEmail(idToken: string): Promise<string | null> {
  const apiKey = readFirebaseOptions().apiKey
  if (!apiKey) return null
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return null
    const data = (await res.json()) as { users?: { email?: string }[] }
    return data.users?.[0]?.email?.toLowerCase() ?? null
  } catch {
    return null
  }
}
