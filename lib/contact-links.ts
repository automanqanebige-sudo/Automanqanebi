/** Normalize phone to digits with Georgia country code when possible. */
export function normalizePhoneDigits(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('995') && digits.length >= 12) return digits.slice(0, 12)
  if (digits.startsWith('995')) return digits
  if (digits.length === 9) return `995${digits}`
  return digits
}

export function whatsAppHref(phone: string): string | null {
  const digits = normalizePhoneDigits(phone)
  return digits ? `https://wa.me/${digits}` : null
}

export function viberHref(phone: string): string | null {
  const digits = normalizePhoneDigits(phone)
  return digits ? `viber://chat?number=%2B${digits}` : null
}
