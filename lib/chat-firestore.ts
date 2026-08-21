import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  addDoc,
} from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'
import { createUserNotification } from '@/lib/notifications-firestore'

export type Conversation = {
  id: string
  participants: string[]
  carId: string
  carTitle: string
  sellerId: string
  buyerId: string
  lastMessage?: string
  updatedAt: string
}

export type ChatMessage = {
  id: string
  senderId: string
  text: string
  createdAt: string
}

export function buildConversationId(buyerId: string, sellerId: string, carId: string): string {
  const [a, b] = [buyerId, sellerId].sort()
  return `${a}_${b}_${carId}`
}

export async function getOrCreateConversation(
  buyerId: string,
  sellerId: string,
  carId: string,
  carTitle: string
): Promise<string> {
  if (!isFirebaseConfigured()) throw new Error('firebase-not-configured')

  const id = buildConversationId(buyerId, sellerId, carId)
  const ref = doc(getDb(), 'conversations', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      participants: [buyerId, sellerId],
      buyerId,
      sellerId,
      carId,
      carTitle,
      lastMessage: '',
      updatedAt: new Date().toISOString(),
    })
  }

  return id
}

export async function fetchUserConversations(userId: string): Promise<Conversation[]> {
  if (!isFirebaseConfigured()) return []

  const q = query(
    collection(getDb(), 'conversations'),
    where('participants', 'array-contains', userId)
  )
  const snap = await getDocs(q)

  return snap.docs
    .map((d) => {
      const data = d.data()
      return {
        id: d.id,
        participants: data.participants ?? [],
        carId: data.carId ?? '',
        carTitle: data.carTitle ?? '',
        sellerId: data.sellerId ?? '',
        buyerId: data.buyerId ?? '',
        lastMessage: data.lastMessage,
        updatedAt: data.updatedAt ?? '',
      } satisfies Conversation
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  if (!isFirebaseConfigured()) return []

  const q = query(
    collection(getDb(), 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  const snap = await getDocs(q)

  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      senderId: data.senderId ?? '',
      text: data.text ?? '',
      createdAt: data.createdAt ?? '',
    }
  })
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('firebase-not-configured')

  const trimmed = text.trim()
  if (!trimmed) return

  const createdAt = new Date().toISOString()

  await addDoc(collection(getDb(), 'conversations', conversationId, 'messages'), {
    senderId,
    text: trimmed,
    createdAt,
  })

  await updateDoc(doc(getDb(), 'conversations', conversationId), {
    lastMessage: trimmed,
    updatedAt: createdAt,
  })

  logAnalyticsEvent('chat_message', { conversationId }, senderId)

  // Best-effort in-app + push to the other participant
  try {
    const convSnap = await getDoc(doc(getDb(), 'conversations', conversationId))
    const participants = (convSnap.data()?.participants as string[]) || []
    const recipientId = participants.find((id) => id !== senderId)
    if (recipientId) {
      const carTitle = String(convSnap.data()?.carTitle || 'automanqanebi.ge')
      const chatUrl = `/chat?c=${conversationId}`
      void createUserNotification(recipientId, {
        kind: 'chat',
        title: `💬 ${carTitle}`,
        body: trimmed.slice(0, 120),
        url: chatUrl,
      })
      void fetch('/api/notify-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          title: `💬 ${carTitle}`,
          text: trimmed.slice(0, 120),
          url: chatUrl,
        }),
      }).catch(() => undefined)
    }
  } catch {
    /* ignore notify failures */
  }
}
