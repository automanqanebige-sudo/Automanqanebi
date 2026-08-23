import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'

export type UserRole = 'user' | 'dealer'

export type UserProfile = {
  displayName?: string
  phone?: string
  phoneVerified?: boolean
  role?: UserRole
  dealerSlug?: string
  dealerName?: string
  dealerLogo?: string
  dealerApproved?: boolean
  fcmToken?: string
  lastVipTier?: string
  lastVipPaymentStatus?: string
}

export async function fetchUserProfile(uid: string): Promise<UserProfile> {
  const snap = await getDoc(doc(getDb(), 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : {}
}

export async function saveUserProfile(uid: string, data: UserProfile): Promise<void> {
  const clean: UserProfile = {}
  if (typeof data.displayName === 'string') clean.displayName = data.displayName.trim()
  if (typeof data.phone === 'string') clean.phone = data.phone.trim()
  if (typeof data.phoneVerified === 'boolean') clean.phoneVerified = data.phoneVerified
  if (data.role === 'user' || data.role === 'dealer') clean.role = data.role
  if (typeof data.dealerSlug === 'string') clean.dealerSlug = data.dealerSlug.trim().toLowerCase()
  if (typeof data.dealerName === 'string') clean.dealerName = data.dealerName.trim()
  if (typeof data.dealerLogo === 'string') clean.dealerLogo = data.dealerLogo.trim()
  // dealerApproved is admin-only (enforced in Firestore rules) — never set from client helpers.
  if (typeof data.fcmToken === 'string') clean.fcmToken = data.fcmToken
  if (typeof data.lastVipTier === 'string') clean.lastVipTier = data.lastVipTier
  if (typeof data.lastVipPaymentStatus === 'string') {
    clean.lastVipPaymentStatus = data.lastVipPaymentStatus
  }
  await setDoc(doc(getDb(), 'users', uid), clean, { merge: true })
}
