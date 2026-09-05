/** Update the address bar without triggering Next.js navigation / Suspense remounts. */
export function softReplaceUrl(href: string): void {
  if (typeof window === 'undefined') return
  const next = href || '/'
  const current = `${window.location.pathname}${window.location.search}`
  if (current === next) return
  window.history.replaceState(window.history.state, '', next)
}

/** Current query string without leading `?`. */
export function getWindowQueryString(): string {
  if (typeof window === 'undefined') return ''
  const s = window.location.search
  return s.startsWith('?') ? s.slice(1) : s
}
