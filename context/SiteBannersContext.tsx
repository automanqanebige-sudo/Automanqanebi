'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchSiteBanners } from '@/lib/site-banners-firestore'
import type { SiteBanner } from '@/types/site-banner'

type SiteBannersContextValue = {
  banners: SiteBanner[]
  loading: boolean
  refresh: () => Promise<void>
}

const SiteBannersContext = createContext<SiteBannersContextValue | null>(null)

export function SiteBannersProvider({ children }: { children: ReactNode }) {
  const [banners, setBanners] = useState<SiteBanner[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    const next = await fetchSiteBanners()
    setBanners(next)
  }

  useEffect(() => {
    fetchSiteBanners()
      .then(setBanners)
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(() => ({ banners, loading, refresh }), [banners, loading])

  return <SiteBannersContext.Provider value={value}>{children}</SiteBannersContext.Provider>
}

export function useSiteBanners() {
  const ctx = useContext(SiteBannersContext)
  if (!ctx) throw new Error('useSiteBanners must be used within SiteBannersProvider')
  return ctx
}
