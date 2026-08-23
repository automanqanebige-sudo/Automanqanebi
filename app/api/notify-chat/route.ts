import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured, readFirebaseOptions } from '@/lib/firebase'

async function verifyFirebaseIdToken(
  idToken: string
): Promise<{ uid: string } | null> {
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
    const data = (await res.json()) as { users?: { localId?: string }[] }
    const uid = data.users?.[0]?.localId
    return uid ? { uid } : null
  } catch {
    return null
  }
}

/**
 * Send FCM web push to a user's stored fcmToken.
 * Requires Firebase ID token of a conversation participant.
 */
export async function POST(req: NextRequest) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
  }

  const authHeader = req.headers.get('authorization') || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  const verified = await verifyFirebaseIdToken(idToken)
  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as {
    recipientId?: string
    conversationId?: string
    title?: string
    text?: string
    url?: string
  } | null

  if (!body?.recipientId || !body?.title || !body?.conversationId) {
    return NextResponse.json(
      { error: 'recipientId, conversationId and title required' },
      { status: 400 }
    )
  }

  if (body.recipientId === verified.uid) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'self' })
  }

  const convSnap = await getDoc(doc(getDb(), 'conversations', body.conversationId))
  if (!convSnap.exists()) {
    return NextResponse.json({ error: 'conversation not found' }, { status: 404 })
  }
  const participants = (convSnap.data()?.participants as string[]) || []
  if (!participants.includes(verified.uid) || !participants.includes(body.recipientId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const snap = await getDoc(doc(getDb(), 'users', body.recipientId))
  const token = snap.exists() ? String((snap.data() as { fcmToken?: string }).fcmToken || '') : ''
  if (!token) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'no_token' })
  }

  const serverKey = process.env.FCM_SERVER_KEY
  if (!serverKey) {
    return NextResponse.json({
      ok: true,
      stub: true,
      message: 'FCM_SERVER_KEY not configured',
    })
  }

  const res = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Authorization: `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title: String(body.title).slice(0, 120),
        body: String(body.text || '').slice(0, 200),
        icon: '/icon-192.png',
      },
      data: {
        url: body.url || '/chat',
      },
      webpush: {
        fcm_options: { link: body.url || '/chat' },
      },
    }),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('[fcm]', res.status, errText)
    return NextResponse.json({ ok: false, error: errText.slice(0, 300) }, { status: 502 })
  }

  return NextResponse.json({ ok: true, sent: true })
}
