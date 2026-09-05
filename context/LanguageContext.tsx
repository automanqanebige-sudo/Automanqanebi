'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SITE_DOMAIN } from '@/lib/site'
import ka from '@/locales/ka.json'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'
import { serviceCategoryMessages } from '@/lib/service-category-messages'

export type Language = 'ka' | 'ru' | 'en'

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const messages: Record<Language, Record<string, string>> = {
  ka: { ...ka, ...serviceCategoryMessages.ka },
  ru: { ...ru, ...serviceCategoryMessages.ru },
  en: { ...en, ...serviceCategoryMessages.en },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function localeFromPathname(pathname: string): Language | null {
  const first = pathname.split('/').filter(Boolean)[0]
  if (first === 'ka' || first === 'ru' || first === 'en') return first
  return null
}

function translate(language: Language, key: string): string {
  const template = messages[language][key] ?? key
  return template.replace(/\{\{domain\}\}/g, SITE_DOMAIN)
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [language, setLanguageState] = useState<Language>('ka')

  const urlLocale = localeFromPathname(pathname)

  useEffect(() => {
    if (urlLocale) {
      setLanguageState(urlLocale)
      window.localStorage.setItem('language', urlLocale)
      return
    }
    const saved = window.localStorage.getItem('language') as Language | null
    if (saved === 'ka' || saved === 'ru' || saved === 'en') {
      setLanguageState(saved)
    }
  }, [urlLocale])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    window.localStorage.setItem('language', lang)
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translate(language, key),
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
