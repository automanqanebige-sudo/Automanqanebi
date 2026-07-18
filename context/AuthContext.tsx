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

    // Finish any Google sign-in that used the redirect fallback.
    void completeGoogleRedirect()

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
