'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { peekGoogleRedirectPath, takeGoogleRedirectPath } from '@/lib/auth'

/** After Google redirect sign-in, navigate to the stashed path on any page. */
export default function GoogleAuthRedirectHandler() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current || loading || !user) return
    if (!peekGoogleRedirectPath()) return
    handled.current = true
    const path = takeGoogleRedirectPath() || '/profile'
    if (pathname !== path) router.replace(path)
  }, [user, loading, router, pathname])

  return null
}
