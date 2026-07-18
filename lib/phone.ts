import { normalizePhoneDigits } from '@/lib/contact-links'

/** Convert user input to E.164 (+995…) for Firebase Phone Auth. */
export function toE164Phone(phone: string): string | null {
  const digits = normalizePhoneDigits(phone.trim())
  if (!digits) return null
  // Georgian mobile: 995 + 9 digits
  if (digits.startsWith('995') && digits.length === 12) return `+${digits}`
  if (digits.length >= 10 && digits.length <= 15) return `+${digits}`
  return null
}

/** Soft display format for Georgian numbers. */
export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhoneDigits(phone)
  if (!digits) return phone.trim()
  if (digits.startsWith('995') && digits.length === 12) {
    return `+995 ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
  }
  return `+${digits}`
}
