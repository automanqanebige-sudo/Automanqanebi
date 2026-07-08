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
  logout as authLogout,
  registerWithEmail as authRegister,
  resetPassword as authResetPassword,
  signInWithEmail as authSignIn,
  signInWithGoogle as authSignInGoogle,
} from '@/lib/auth'

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
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  // Always start loading on server + first client paint to avoid hydration mismatch.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [configured])

  const signInWithEmail = useCallback(authSignIn, [])
  const registerWithEmail = useCallback(authRegister, [])
  const signInWithGoogle = useCallback(authSignInGoogle, [])
  const resetPassword = useCallback(authResetPassword, [])
  const logout = useCallback(authLogout, [])

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
    }),
    [
      user,
      loading,
      configured,
      signInWithEmail,
      registerWithEmail,
      signInWithGoogle,
      resetPassword,
      logout,
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
