import type { User } from 'firebase/auth'
import type { UserProfile } from '@/lib/user-profile-firestore'

/** True when email (Firebase or OTP) or phone was verified. */
export function isContactVerified(
  user: User | null | undefined,
  profile?: Pick<UserProfile, 'phoneVerified' | 'emailOtpVerified'> | null
): boolean {
  if (!user) return false
  if (user.emailVerified) return true
  if (profile?.phoneVerified) return true
  if (profile?.emailOtpVerified) return true
  return false
}
