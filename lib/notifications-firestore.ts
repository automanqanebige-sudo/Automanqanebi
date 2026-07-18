import { addDoc, collection, getDocs, limit, orderBy, query, updateDoc, doc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

export type UserNotification = {
  id: string
  title: string
  body: string
  url?: string
  createdAt: string
  read: boolean
}

export async function createUserNotification(
  userId: string,
  data: { title: string; body: string; url?: string }
): Promise<void> {
  if (!isFirebaseConfigured() || !userId) return
  try {
    await addDoc(collection(getDb(), 'users', userId, 'notifications'), {
      title: data.title,
      body: data.body,
      url: data.url || '',
      createdAt: new Date().toISOString(),
      read: false,
    })
  } catch (err) {
    console.error('[notification]', err)
  }
}

export async function fetchUserNotifications(userId: string, max = 20): Promise<UserNotification[]> {
  if (!isFirebaseConfigured() || !userId) return []
  const q = query(
    collection(getDb(), 'users', userId, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(max)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      title: String(data.title || ''),
      body: String(data.body || ''),
      url: String(data.url || ''),
      createdAt: String(data.createdAt || ''),
      read: Boolean(data.read),
    }
  })
}

export async function markNotificationRead(userId: string, id: string): Promise<void> {
  if (!isFirebaseConfigured()) return
  await updateDoc(doc(getDb(), 'users', userId, 'notifications', id), { read: true })
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const list = await fetchUserNotifications(userId, 50)
  await Promise.all(
    list.filter((n) => !n.read).map((n) => markNotificationRead(userId, n.id))
  )
}
