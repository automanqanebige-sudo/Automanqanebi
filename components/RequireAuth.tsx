'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const redirected = useRef(false)

  useEffect(() => {
    if (loading) return
    if (!configured) return
    if (!user) {
      if (redirected.current) return
      redirected.current = true
      const redirect = encodeURIComponent(pathname)
      router.replace(`/login?redirect=${redirect}`)
    } else {
      redirected.current = false
    }
  }, [user, loading, configured, pathname, router])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        {t('auth.loading')}
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-muted-foreground">
        {t('auth.configHint')}
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
