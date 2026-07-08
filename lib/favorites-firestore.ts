import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

export async function fetchUserFavoriteIds(userId: string): Promise<Set<string>> {
  if (!isFirebaseConfigured()) return new Set()

  const snap = await getDocs(collection(getDb(), 'users', userId, 'favorites'))
  return new Set(snap.docs.map((d) => d.id))
}

export async function addFavoriteRemote(userId: string, carId: string): Promise<void> {
  if (!isFirebaseConfigured()) return

  await setDoc(doc(getDb(), 'users', userId, 'favorites', carId), {
    carId,
    addedAt: new Date().toISOString(),
  })
}

export async function removeFavoriteRemote(userId: string, carId: string): Promise<void> {
  if (!isFirebaseConfigured()) return

  await deleteDoc(doc(getDb(), 'users', userId, 'favorites', carId))
}
