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
import { useAuth } from '@/context/AuthContext'
import {
  addFavoriteRemote,
  fetchUserFavoriteIds,
  removeFavoriteRemote,
} from '@/lib/favorites-firestore'
import { isFirebaseConfigured } from '@/lib/firebase'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'

interface FavoritesContextValue {
  favoriteIds: Set<string>
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  ready: boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function storageKeyForUser(uid: string | undefined): string {
  return uid ? `am_favorites_${uid}` : 'am_favorites_guest'
}

function readStored(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [])
  } catch {
    return new Set()
  }
}

function writeStored(key: string, ids: Set<string>) {
  localStorage.setItem(key, JSON.stringify(Array.from(ids)))
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const key = storageKeyForUser(user?.uid)
      const local = readStored(key)

      if (user?.uid && isFirebaseConfigured()) {
        try {
          const remote = await fetchUserFavoriteIds(user.uid)
          const merged = new Set([...Array.from(local), ...Array.from(remote)])
          if (!cancelled) {
            setFavoriteIds(merged)
            writeStored(key, merged)
          }
        } catch {
          if (!cancelled) setFavoriteIds(local)
        }
      } else if (!cancelled) {
        setFavoriteIds(local)
      }

      if (!cancelled) setReady(true)
    }

    setReady(false)
    load()

    return () => {
      cancelled = true
    }
  }, [user?.uid])

  const toggleFavorite = useCallback(
    (id: string) => {
      const key = storageKeyForUser(user?.uid)
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        const adding = !next.has(id)
        if (adding) next.add(id)
        else next.delete(id)
        writeStored(key, next)

        if (user?.uid && isFirebaseConfigured()) {
          const action = adding ? addFavoriteRemote(user.uid, id) : removeFavoriteRemote(user.uid, id)
          action.catch(console.error)
          if (adding) logAnalyticsEvent('favorite_add', { carId: id }, user.uid)
        }

        return next
      })
    },
    [user?.uid]
  )

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds])

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, ready }),
    [favoriteIds, isFavorite, toggleFavorite, ready]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return ctx
}
