import { useEffect, useRef } from 'react'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'

export function useAnalyticsSearchLog(
  query: string,
  type: 'search_cars' | 'search_services',
  userId?: string | null,
  minLength = 2
) {
  const lastLogged = useRef('')

  useEffect(() => {
    const q = query.trim()
    if (q.length < minLength || q === lastLogged.current) return
    lastLogged.current = q
    logAnalyticsEvent(type, { query: q }, userId)
  }, [query, type, userId, minLength])
}
