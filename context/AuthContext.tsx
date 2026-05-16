'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase-auth'
import { isFirebaseConfigured } from '@/lib/firebase-app'

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

function requireAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error('FIREBASE_NOT_CONFIGURED')
  }
  return getFirebaseAuth()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(configured)

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [configured])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(requireAuth(), email.trim(), password)
  }, [])

  const registerWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const auth = requireAuth()
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )
      const name = displayName?.trim()
      if (name) {
        await updateProfile(credential.user, { displayName: name })
      }
    },
    []
  )

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(requireAuth(), new GoogleAuthProvider())
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(requireAuth(), email.trim())
  }, [])

  const logout = useCallback(async () => {
    if (!configured) return
    await signOut(getFirebaseAuth())
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
