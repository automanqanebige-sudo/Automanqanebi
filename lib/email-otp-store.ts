import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'

export type StoredEmailOtp = {
  hash: string
  expiresAt: number
  updatedAt: number
}

/** Server-side OTP store (same pattern as cron routes using client SDK). */
export async function saveEmailOtpRecord(uid: string, data: StoredEmailOtp): Promise<void> {
  await setDoc(doc(getDb(), 'emailOtps', uid), data, { merge: true })
}

export async function readEmailOtpRecord(uid: string): Promise<StoredEmailOtp | null> {
  const snap = await getDoc(doc(getDb(), 'emailOtps', uid))
  if (!snap.exists()) return null
  const data = snap.data() as Partial<StoredEmailOtp>
  if (typeof data.hash !== 'string' || typeof data.expiresAt !== 'number') return null
  return {
    hash: data.hash,
    expiresAt: data.expiresAt,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0,
  }
}

export async function clearEmailOtpRecord(uid: string): Promise<void> {
  await setDoc(
    doc(getDb(), 'emailOtps', uid),
    { hash: '', expiresAt: 0, updatedAt: Date.now(), cleared: true },
    { merge: true }
  )
}
