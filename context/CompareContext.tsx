'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export const COMPARE_MAX = 3
const STORAGE_KEY = 'am_compare_ids'

type CompareContextValue = {
  ids: string[]
  count: number
  isComparing: (id: string) => boolean
  toggleCompare: (id: string) => { ok: boolean; reason?: 'full' | 'removed' | 'added' }
  removeCompare: (id: string) => void
  clearCompare: () => void
  setCompareIds: (ids: string[]) => void
  ready: boolean
}

const CompareContext = createContext<CompareContextValue | null>(null)

function readStored(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x) => typeof x === 'string').slice(0, COMPARE_MAX)
  } catch {
    return []
  }
}

function writeStored(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, COMPARE_MAX)))
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIds(readStored())
    setReady(true)
  }, [])

  const persist = useCallback((next: string[]) => {
    const limited = next.slice(0, COMPARE_MAX)
    setIds(limited)
    writeStored(limited)
  }, [])

  const isComparing = useCallback((id: string) => ids.includes(id), [ids])

  const removeCompare = useCallback(
    (id: string) => {
      persist(ids.filter((x) => x !== id))
    },
    [ids, persist]
  )

  const clearCompare = useCallback(() => persist([]), [persist])

  const setCompareIds = useCallback(
    (next: string[]) => {
      persist(next.filter((x) => typeof x === 'string' && x.length > 0))
    },
    [persist]
  )

  const toggleCompare = useCallback(
    (id: string) => {
      if (ids.includes(id)) {
        persist(ids.filter((x) => x !== id))
        return { ok: true, reason: 'removed' as const }
      }
      if (ids.length >= COMPARE_MAX) {
        return { ok: false, reason: 'full' as const }
      }
      persist([...ids, id])
      return { ok: true, reason: 'added' as const }
    },
    [ids, persist]
  )

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      isComparing,
      toggleCompare,
      removeCompare,
      clearCompare,
      setCompareIds,
      ready,
    }),
    [ids, isComparing, toggleCompare, removeCompare, clearCompare, setCompareIds, ready]
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
