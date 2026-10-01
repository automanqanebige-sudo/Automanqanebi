/**
 * Only allow same-origin relative paths. Rejects protocol-relative (`//evil.com`)
 * and absolute URLs. Also blocks auth pages as redirect targets (prevents bounce loops).
 */
const BLOCKED_REDIRECT_PATHS = new Set(['/login', '/register'])

export function isSafeAppPath(path: string | null | undefined): path is string {
  if (!path) return false
  const trimmed = path.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return false
  }
  const lower = trimmed.toLowerCase()
  if (lower.includes('javascript:') || lower.includes('data:')) {
    return false
  }
  const pathOnly = trimmed.split('?')[0]?.split('#')[0] || ''
  if (BLOCKED_REDIRECT_PATHS.has(pathOnly.toLowerCase())) {
    return false
  }
  return true
}

export function safeAppPath(path: string | null | undefined, fallback = '/profile'): string {
  if (!isSafeAppPath(path)) return fallback
  return path.trim()
}

/** Append a query param without breaking existing `?` / `&`. */
export function appendQueryParam(path: string, key: string, value: string): string {
  const safe = safeAppPath(path)
  const hashIndex = safe.indexOf('#')
  const beforeHash = hashIndex >= 0 ? safe.slice(0, hashIndex) : safe
  const hash = hashIndex >= 0 ? safe.slice(hashIndex) : ''
  const sep = beforeHash.includes('?') ? '&' : '?'
  return `${beforeHash}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}${hash}`
}

/** Compare current location to a target path (pathname + optional search). */
export function pathsMatch(pathname: string, search: string, target: string): boolean {
  const safe = safeAppPath(target)
  const qIndex = safe.indexOf('?')
  const targetPath = qIndex >= 0 ? safe.slice(0, qIndex) : safe.split('#')[0]
  const targetSearch = qIndex >= 0 ? safe.slice(qIndex + 1).split('#')[0] : ''
  const currentSearch = search.startsWith('?') ? search.slice(1) : search
  return pathname === targetPath && currentSearch === targetSearch
}
