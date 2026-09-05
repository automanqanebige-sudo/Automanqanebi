const STORAGE_KEY = 'automanqanebi_search_history'
const MAX_ITEMS = 10

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

export function pushSearchHistory(query: string): string[] {
  const q = query.trim()
  if (q.length < 2) return getSearchHistory()
  const prev = getSearchHistory().filter((item) => item.toLowerCase() !== q.toLowerCase())
  const next = [q, ...prev].slice(0, MAX_ITEMS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  return next
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
