import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

/**
 * Send FCM web push to a user's stored fcmToken.
 * Requires FCM_SERVER_KEY (legacy HTTP). Optional until key is set.
 */
export async function POST(req: NextRequest) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
  }

  const body = (await req.json().catch(() => null)) as {
    recipientId?: string
    title?: string
    text?: string
    url?: string
  } | null

  if (!body?.recipientId || !body?.title) {
    return NextResponse.json({ error: 'recipientId and title required' }, { status: 400 })
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
        title: body.title,
        body: body.text || '',
        icon: '/icon-192.png',
      },
      data: {
        url: body.url || '/chat',
      },
      webpush: {
        fcm_options: { link: body.url || '/chat' },
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('[fcm]', res.status, errText)
    return NextResponse.json({ ok: false, error: errText.slice(0, 300) }, { status: 502 })
  }

  return NextResponse.json({ ok: true, sent: true })
}
