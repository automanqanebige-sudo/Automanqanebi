/**
 * FCM push helpers for chat notifications (browser).
 * Requires NEXT_PUBLIC_FIREBASE_VAPID_KEY and messaging SW.
 */

export type PushPermissionResult = {
  ok: boolean
  messageKey: string
  token?: string
}

export async function requestChatPushPermission(): Promise<PushPermissionResult> {
  if (typeof window === 'undefined') {
    return { ok: false, messageKey: 'push.unsupported' }
  }
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return { ok: false, messageKey: 'push.unsupported' }
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return { ok: false, messageKey: 'push.denied' }
    }

    const vapid = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapid) {
      // Permission granted; token registration deferred until VAPID is configured
      return { ok: true, messageKey: 'push.readyNoVapid' }
    }

    const { getFirebaseApp, isFirebaseConfigured } = await import('@/lib/firebase')
    if (!isFirebaseConfigured()) {
      return { ok: false, messageKey: 'push.unsupported' }
    }

    const { getMessaging, getToken, isSupported } = await import('firebase/messaging')
    if (!(await isSupported())) {
      return { ok: false, messageKey: 'push.unsupported' }
    }

    await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    const messaging = getMessaging(getFirebaseApp())
    const token = await getToken(messaging, { vapidKey: vapid })
    if (!token) return { ok: false, messageKey: 'push.denied' }

    // Persist token on user profile when logged in (best-effort)
    try {
      const { getAuth } = await import('firebase/auth')
      const auth = getAuth(getFirebaseApp())
      if (auth.currentUser) {
        const { saveUserProfile } = await import('@/lib/user-profile-firestore')
        await saveUserProfile(auth.currentUser.uid, { fcmToken: token })
      }
    } catch {
      /* ignore */
    }

    return { ok: true, messageKey: 'push.enabled', token }
  } catch (err) {
    console.error(err)
    return { ok: false, messageKey: 'push.error' }
  }
}
