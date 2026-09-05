import type { ConfirmationResult } from 'firebase/auth'

/** Survives PhoneOtpVerify remounts (auth state updates) until confirm/cancel. */
let pendingConfirmation: ConfirmationResult | null = null
let pendingPhoneE164: string | null = null

export function setPendingPhoneOtp(confirmation: ConfirmationResult, e164: string): void {
  pendingConfirmation = confirmation
  pendingPhoneE164 = e164
}

export function getPendingPhoneOtp(): {
  confirmation: ConfirmationResult
  e164: string
} | null {
  if (!pendingConfirmation || !pendingPhoneE164) return null
  return { confirmation: pendingConfirmation, e164: pendingPhoneE164 }
}

export function clearPendingPhoneOtp(): void {
  pendingConfirmation = null
  pendingPhoneE164 = null
}
