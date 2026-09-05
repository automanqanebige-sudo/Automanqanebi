'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  clearGoogleRedirectPath,
  consumeGoogleRedirectPending,
  takeGoogleRedirectPath,
} from '@/lib/auth'
import { pathsMatch, safeAppPath } from '@/lib/safe-redirect'

/**
 * After a *pending* Google redirect sign-in, navigate to the stashed path once.
 * Never redirects from a leftover stash (that caused random jumps on refresh).
 */
export default function GoogleAuthRedirectHandler() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current || loading || !user) return

    const pending = consumeGoogleRedirectPending()
    if (!pending) {
      // Wipe any leftover path so a later reload cannot jump pages.
      clearGoogleRedirectPath()
      handled.current = true
      return
    }

    handled.current = true
    const path = safeAppPath(takeGoogleRedirectPath() || '/profile')
    const search =
      typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : ''
    if (!pathsMatch(pathname, search, path)) {
      router.replace(path)
    }
  }, [user, loading, router, pathname])

  return null
}
