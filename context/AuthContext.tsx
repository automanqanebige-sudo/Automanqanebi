'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import {
  getFirebaseAuth,
  isFirebaseConfigured,
} from '@/lib/firebase'
import {
  changeUserEmail as authChangeEmail,
  changeUserPassword as authChangePassword,
  completeGoogleRedirect,
  hasPasswordProvider as authHasPassword,
  logout as authLogout,
  registerWithEmail as authRegister,
  resetPassword as authResetPassword,
  signInWithEmail as authSignIn,
  signInWithGoogle as authSignInGoogle,
  updateDisplayName as authUpdateDisplayName,
  updateProfilePhoto as authUpdateProfilePhoto,
  removeProfilePhoto as authRemoveProfilePhoto,
} from '@/lib/auth'

const GOOGLE_AUTH_ERROR_KEY = 'am_google_auth_error'

type AuthContextType = {
  user: User | null
  loading: boolean
  configured: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>
  signInWithGoogle: () => Promise<import('@/lib/auth').GoogleSignInResult>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  updateDisplayName: (displayName: string) => Promise<void>
  updateProfilePhoto: (photoURL: string) => Promise<void>
  removeProfilePhoto: () => Promise<void>
  changeUserEmail: (currentPassword: string, newEmail: string) => Promise<void>
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<void>
  hasPasswordProvider: () => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [userVersion, setUserVersion] = useState(0)
  // Always start loading on server + first client paint to avoid hydration mismatch.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    let cancelled = false
    let unsubscribe: (() => void) | undefined

    // Await redirect result before attaching auth listener — avoids race on mobile.
    void (async () => {
      try {
        const redirectedUser = await completeGoogleRedirect()
        if (cancelled) return
        if (redirectedUser) {
          try {
            const { saveUserProfile } = await import('@/lib/user-profile-firestore')
            const { logAnalyticsEvent } = await import('@/lib/analytics-firestore')
            await saveUserProfile(redirectedUser.uid, {
              displayName: redirectedUser.displayName || undefined,
            }).catch(() => undefined)
            logAnalyticsEvent(
              'user_login',
              { method: 'google', email: redirectedUser.email || undefined },
              redirectedUser.uid
            )
          } catch {
            /* best-effort */
          }
        }
      } catch (err) {
        console.error('[AuthProvider] Google redirect', err)
        try {
          const code =
            err && typeof err === 'object' && 'code' in err
              ? String((err as { code: string }).code)
              : 'auth/redirect-failed'
          sessionStorage.setItem(GOOGLE_AUTH_ERROR_KEY, code)
        } catch {
          /* ignore */
        }
      } finally {
        if (cancelled) return
        unsubscribe = onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
          setUser(nextUser)
          setLoading(false)
        })
      }
    })()

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [configured])

  const signInWithEmail = useCallback(authSignIn, [])
  const registerWithEmail = useCallback(authRegister, [])
  const signInWithGoogle = useCallback(authSignInGoogle, [])
  const resetPassword = useCallback(authResetPassword, [])
  const logout = useCallback(authLogout, [])
  const updateDisplayName = useCallback(authUpdateDisplayName, [])
  const updateProfilePhoto = useCallback(authUpdateProfilePhoto, [])
  const removeProfilePhoto = useCallback(authRemoveProfilePhoto, [])
  const changeUserEmail = useCallback(authChangeEmail, [])
  const changeUserPassword = useCallback(authChangePassword, [])
  const hasPasswordProvider = useCallback(authHasPassword, [])

  const refreshUser = useCallback(async () => {
    if (!configured) return
    const current = getFirebaseAuth().currentUser
    if (!current) return
    await current.reload()
    // Force a new object reference so consumers re-render with fresh data.
    setUser(getFirebaseAuth().currentUser)
    setUserVersion((v) => v + 1)
  }, [configured])

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      signInWithEmail,
      registerWithEmail,
      signInWithGoogle,
      resetPassword,
      logout,
      updateDisplayName,
      updateProfilePhoto,
      removeProfilePhoto,
      changeUserEmail,
      changeUserPassword,
      hasPasswordProvider,
      refreshUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user,
      userVersion,
      loading,
      configured,
      signInWithEmail,
      registerWithEmail,
      signInWithGoogle,
      resetPassword,
      logout,
      updateDisplayName,
      updateProfilePhoto,
      removeProfilePhoto,
      changeUserEmail,
      changeUserPassword,
      hasPasswordProvider,
      refreshUser,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/** Read + clear a Google redirect error stashed by AuthProvider. */
export function takeGoogleAuthErrorCode(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const code = sessionStorage.getItem(GOOGLE_AUTH_ERROR_KEY)
    if (code) sessionStorage.removeItem(GOOGLE_AUTH_ERROR_KEY)
    return code
  } catch {
    return null
  }
}
