import { readFirebaseOptions } from '@/lib/firebase'

export async function verifyFirebaseIdToken(
  idToken: string
): Promise<{ uid: string; email?: string; emailVerified?: boolean } | null> {
  const apiKey = readFirebaseOptions().apiKey
  if (!apiKey || !idToken) return null
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
    const data = (await res.json()) as {
      users?: { localId?: string; email?: string; emailVerified?: boolean }[]
    }
    const user = data.users?.[0]
    const uid = user?.localId
    if (!uid) return null
    return {
      uid,
      email: user.email,
      emailVerified: Boolean(user.emailVerified),
    }
  } catch {
    return null
  }
}

export function bearerTokenFromRequest(req: Request): string {
  const authHeader = req.headers.get('authorization') || ''
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
}
