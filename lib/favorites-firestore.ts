import { collection, deleteDoc, doc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

export async function fetchUserFavoriteIds(userId: string): Promise<Set<string>> {
  if (!isFirebaseConfigured()) return new Set()

  const snap = await getDocs(collection(getDb(), 'users', userId, 'favorites'))
  return new Set(snap.docs.map((d) => d.id))
}

async function bumpFavoriteCount(carId: string, delta: 1 | -1): Promise<void> {
  if (!carId || carId.startsWith('sample')) return
  try {
    await updateDoc(doc(getDb(), 'cars', carId), {
      favoriteCount: increment(delta),
    })
  } catch {
    /* best-effort — older cars may lack field; rules require +/-1 from current */
  }
}

export async function addFavoriteRemote(userId: string, carId: string): Promise<void> {
  if (!isFirebaseConfigured()) return

  await setDoc(doc(getDb(), 'users', userId, 'favorites', carId), {
    carId,
    addedAt: new Date().toISOString(),
  })
  void bumpFavoriteCount(carId, 1)
}

export async function removeFavoriteRemote(userId: string, carId: string): Promise<void> {
  if (!isFirebaseConfigured()) return

  await deleteDoc(doc(getDb(), 'users', userId, 'favorites', carId))
  void bumpFavoriteCount(carId, -1)
}
