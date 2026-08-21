/** Normalize phone to digits with Georgia country code when possible. */
export function normalizePhoneDigits(phone: string): string | null {
  let digits = phone.replace(/\D/g, '')
  if (!digits) return null
  // Strip leading 0 for local Georgian mobiles: 05XXXXXXXX
  if (digits.startsWith('0') && digits.length === 10 && digits[1] === '5') {
    digits = digits.slice(1)
  }
  if (digits.startsWith('995') && digits.length >= 12) return digits.slice(0, 12)
  if (digits.startsWith('995')) return digits
  // Georgian mobile without country code (5XXXXXXXX)
  if (digits.length === 9 && digits.startsWith('5')) return `995${digits}`
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
