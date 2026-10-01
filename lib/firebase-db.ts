import { type Firestore, getFirestore } from 'firebase/firestore/lite'
import { getFirebaseApp } from '@/lib/firebase'

let firestore: Firestore | undefined

export function getDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp())
  }
  return firestore
}
