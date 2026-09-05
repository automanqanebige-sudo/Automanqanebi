import { createHash, randomInt } from 'crypto'

const OTP_TTL_MS = 10 * 60 * 1000

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function hashOtpCode(uid: string, code: string): string {
  const pepper = process.env.OTP_PEPPER || process.env.CRON_SECRET || 'automanqanebi-otp'
  return createHash('sha256').update(`${uid}:${code.trim()}:${pepper}`).digest('hex')
}

export function otpExpiresAt(now = Date.now()): number {
  return now + OTP_TTL_MS
}

export function isOtpExpired(expiresAt: number, now = Date.now()): boolean {
  return !Number.isFinite(expiresAt) || expiresAt <= now
}
