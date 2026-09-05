import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

export type ServiceReview = {
  id: string
  serviceId: string
  userId: string
  userName?: string
  rating: number
  comment?: string
  createdAt: string
}

export async function fetchServiceReviews(serviceId: string): Promise<ServiceReview[]> {
  if (!isFirebaseConfigured()) return []
  try {
    const q = query(collection(getDb(), 'serviceReviews'), where('serviceId', '==', serviceId))
    const snap = await getDocs(q)
    return snap.docs
      .map((d) => {
        const data = d.data()
        return {
          id: d.id,
          serviceId: String(data.serviceId ?? ''),
          userId: String(data.userId ?? ''),
          userName: data.userName,
          rating: Math.min(5, Math.max(1, Number(data.rating) || 1)),
          comment: data.comment,
          createdAt: String(data.createdAt ?? ''),
        } satisfies ServiceReview
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

export async function addServiceReview(input: {
  serviceId: string
  userId: string
  userName?: string
  rating: number
  comment?: string
}): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'serviceReviews'), {
    ...input,
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export function averageRating(reviews: ServiceReview[]): number | null {
  if (reviews.length === 0) return null
  const sum = reviews.reduce((s, r) => s + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
