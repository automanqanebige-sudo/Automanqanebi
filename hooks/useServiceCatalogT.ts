'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLanguage, type Language } from '@/context/LanguageContext'
import { SITE_DOMAIN } from '@/lib/site'

type CatalogCache = Partial<Record<Language, Record<string, string>>>

let catalogCache: CatalogCache | null = null
let catalogLoadPromise: Promise<CatalogCache> | null = null

function loadCatalogMessages(): Promise<CatalogCache> {
  if (catalogCache) return Promise.resolve(catalogCache)
  if (!catalogLoadPromise) {
    catalogLoadPromise = import('@/lib/service-catalog-messages').then((mod) => {
      catalogCache = mod.serviceCatalogMessages as CatalogCache
      return catalogCache
    })
  }
  return catalogLoadPromise
}

export function useServiceCatalogT() {
  const { language, t: baseT } = useLanguage()
  const [ready, setReady] = useState(Boolean(catalogCache?.[language]))

  useEffect(() => {
    let active = true
    loadCatalogMessages().then(() => {
      if (active) setReady(true)
    })
    return () => {
      active = false
    }
  }, [language])

  const t = useCallback(
    (key: string) => {
      const fromCatalog = catalogCache?.[language]?.[key]
      if (fromCatalog) return fromCatalog.replace(/\{\{domain\}\}/g, SITE_DOMAIN)
      return baseT(key)
    },
    [language, baseT, ready]
  )

  return { t, ready }
}
