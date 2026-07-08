export const SITE_DOMAIN = 'automanqanebi.ge' as const

export const SITE_URL = `https://${SITE_DOMAIN}` as const

/** Navbar / footer logo text */
export const SITE_LOGO_MAIN = 'AUTOMANQANEBI' as const
export const SITE_LOGO_TLD = '.GE' as const

export const SITE_CONTACT_EMAIL = `info@${SITE_DOMAIN}` as const

/** Set NEXT_PUBLIC_USE_SAMPLE_DATA=false in production to hide demo listings */
export const USE_SAMPLE_DATA = process.env.NEXT_PUBLIC_USE_SAMPLE_DATA !== 'false'

export function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = getAdminEmails()
  if (admins.length === 0) return false
  return admins.includes(email.toLowerCase())
}
