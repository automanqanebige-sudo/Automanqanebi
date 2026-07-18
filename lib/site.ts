export const SITE_DOMAIN = 'automanqanebi.ge' as const

export const SITE_URL = `https://${SITE_DOMAIN}` as const

/** Navbar / footer logo text */
export const SITE_LOGO_MAIN = 'AUTOMANQANEBI' as const
export const SITE_LOGO_TLD = '.GE' as const

export const SITE_CONTACT_EMAIL = `info@${SITE_DOMAIN}` as const

/** Site-wide contact phone (display + tel) */
export const SITE_CONTACT_PHONE = '+995 571 132 212' as const
export const SITE_CONTACT_PHONE_TEL = '+995571132212' as const

/** Default admin(s) when NEXT_PUBLIC_ADMIN_EMAILS is not set */
export const DEFAULT_ADMIN_EMAILS = ['rkakalashvili19@gmail.com'] as const

/** Sample listings: off in production unless explicitly set to "true" */
export const USE_SAMPLE_DATA =
  process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === 'true'
    ? true
    : process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === 'false'
      ? false
      : process.env.NODE_ENV !== 'production'

export function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? ''
  const fromEnv = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  if (fromEnv.length > 0) return fromEnv
  return [...DEFAULT_ADMIN_EMAILS]
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = getAdminEmails()
  if (admins.length === 0) return false
  return admins.includes(email.toLowerCase())
}
