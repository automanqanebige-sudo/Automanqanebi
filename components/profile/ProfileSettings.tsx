'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, KeyRound, Loader2, Mail, Trash2, User as UserIcon } from 'lucide-react'
import { AUTH_INPUT_CLASS } from '@/components/auth/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getAuthErrorMessage } from '@/lib/auth'
import { fetchUserProfile, saveUserProfile } from '@/lib/user-profile-firestore'
import { uploadProfilePhoto, validateProfilePhotoFile } from '@/lib/upload-profile-photo'
import PhoneOtpVerify from '@/components/auth/PhoneOtpVerify'

type Feedback = { type: 'success' | 'error'; message: string } | null

function Notice({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  const isError = feedback.type === 'error'
  return (
    <p
      className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
        isError
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-primary/30 bg-primary/10 text-primary'
      }`}
    >
      {feedback.message}
    </p>
  )
}

export default function ProfileSettings() {
  const { t } = useLanguage()
  const {
    user,
    updateDisplayName,
    updateProfilePhoto,
    removeProfilePhoto,
    changeUserEmail,
    changeUserPassword,
    hasPasswordProvider,
    refreshUser,
  } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const hasPassword = hasPasswordProvider()

  // --- Basic info ---
  const [name, setName] = useState(user?.displayName ?? '')
  const [phone, setPhone] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [basicLoading, setBasicLoading] = useState(false)
  const [basicFeedback, setBasicFeedback] = useState<Feedback>(null)

  // --- Email ---
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState<Feedback>(null)

  // --- Password ---
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null)

  useEffect(() => {
    if (!user) return
    fetchUserProfile(user.uid)
      .then((profile) => {
        if (profile.phone) setPhone(profile.phone)
        setPhoneVerified(Boolean(profile.phoneVerified))
        if (profile.displayName && !user.displayName) setName(profile.displayName)
      })
      .catch(() => {})
  }, [user])

  if (!user) return null

  const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase()
  const displayPhoto = photoPreview ?? user.photoURL

  const handlePhotoSelect = async (file: File | null) => {
    if (!file || !user) return
    setBasicFeedback(null)

    const validationError = validateProfilePhotoFile(file)
    if (validationError === 'invalidType') {
      setBasicFeedback({ type: 'error', message: t('upload.errorType') })
      return
    }
    if (validationError === 'tooLarge') {
      setBasicFeedback({ type: 'error', message: t('upload.errorSize') })
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)
    setPhotoLoading(true)

    try {
      const url = await uploadProfilePhoto(file, user.uid)
      await updateProfilePhoto(url)
      await refreshUser()
      setPhotoPreview(url)
      setBasicFeedback({ type: 'success', message: t('profile.settings.photoUpdated') })
    } catch (err) {
      setPhotoPreview(null)
      if (err instanceof Error && err.message === 'invalidType') {
        setBasicFeedback({ type: 'error', message: t('upload.errorType') })
      } else if (err instanceof Error && err.message === 'tooLarge') {
        setBasicFeedback({ type: 'error', message: t('upload.errorSize') })
      } else {
        setBasicFeedback({ type: 'error', message: getAuthErrorMessage(err, t) })
      }
    } finally {
      setPhotoLoading(false)
      URL.revokeObjectURL(previewUrl)
    }
  }

  const handleRemovePhoto = async () => {
    setBasicFeedback(null)
    setPhotoLoading(true)
    try {
      await removeProfilePhoto()
      await refreshUser()
      setPhotoPreview(null)
      setBasicFeedback({ type: 'success', message: t('profile.settings.photoRemoved') })
    } catch (err) {
      setBasicFeedback({ type: 'error', message: getAuthErrorMessage(err, t) })
    } finally {
      setPhotoLoading(false)
    }
  }

  const handleBasicSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBasicFeedback(null)
    setBasicLoading(true)
    try {
      if (name.trim() && name.trim() !== (user.displayName ?? '')) {
        await updateDisplayName(name)
      }
      await saveUserProfile(user.uid, { displayName: name, phone })
      await refreshUser()
      setBasicFeedback({ type: 'success', message: t('profile.settings.saved') })
    } catch (err) {
      setBasicFeedback({ type: 'error', message: getAuthErrorMessage(err, t) })
    } finally {
      setBasicLoading(false)
    }
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEmailFeedback(null)
    setEmailLoading(true)
    try {
      await changeUserEmail(emailPassword, newEmail)
      setEmailFeedback({ type: 'success', message: t('profile.settings.emailChangeInfo') })
      setNewEmail('')
      setEmailPassword('')
    } catch (err) {
      setEmailFeedback({ type: 'error', message: getAuthErrorMessage(err, t) })
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordFeedback(null)

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: t('auth.error.weakPassword') })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: t('profile.settings.passwordMismatch') })
      return
    }

    setPasswordLoading(true)
    try {
      await changeUserPassword(currentPassword, newPassword)
      setPasswordFeedback({ type: 'success', message: t('profile.settings.passwordChanged') })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordFeedback({ type: 'error', message: getAuthErrorMessage(err, t) })
    } finally {
      setPasswordLoading(false)
    }
  }

  const cardClass = 'rounded-2xl border border-border bg-card p-6 shadow-sm'
  const labelClass = 'mb-1.5 block text-sm font-medium text-foreground'
  const btnClass =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">{t('profile.settings.title')}</h2>

      {/* Basic info */}
      <form onSubmit={handleBasicSubmit} className={cardClass}>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <UserIcon className="h-5 w-5 text-primary" />
          {t('profile.settings.basic')}
        </h3>
        <Notice feedback={basicFeedback} />

        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt=""
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground ring-4 ring-primary/20">
                {initial}
              </div>
            )}
            {photoLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-sm font-medium text-foreground">{t('profile.settings.photo')}</p>
            <p className="text-xs text-muted-foreground">{t('upload.hint')}</p>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="sr-only"
                disabled={photoLoading}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  void handlePhotoSelect(file)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
              >
                <Camera className="h-4 w-4 text-primary" />
                {photoLoading ? t('upload.uploading') : t('profile.settings.changePhoto')}
              </button>
              {(displayPhoto || user.photoURL) && (
                <button
                  type="button"
                  onClick={() => void handleRemovePhoto()}
                  disabled={photoLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('upload.remove')}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="ps-name" className={labelClass}>
              {t('profile.settings.name')}
            </label>
            <input
              id="ps-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={AUTH_INPUT_CLASS}
              placeholder={t('profile.settings.namePlaceholder')}
              disabled={basicLoading}
            />
          </div>
          <div>
            <label htmlFor="ps-phone" className={labelClass}>
              {t('profile.settings.phone')}
            </label>
            <input
              id="ps-phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setPhoneVerified(false)
              }}
              className={AUTH_INPUT_CLASS}
              placeholder={t('profile.settings.phonePlaceholder')}
              disabled={basicLoading}
            />
            {phoneVerified ? (
              <p className="mt-2 text-sm text-primary">{t('phoneOtp.success')}</p>
            ) : (
              <div className="mt-3 rounded-lg border border-border bg-secondary/30 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">{t('phoneOtp.title')}</p>
                <PhoneOtpVerify
                  compact
                  defaultPhone={phone}
                  onVerified={(verifiedPhone) => {
                    setPhone(verifiedPhone)
                    setPhoneVerified(true)
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className={btnClass} disabled={basicLoading}>
            {basicLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {basicLoading ? t('profile.settings.saving') : t('profile.settings.save')}
          </button>
        </div>
      </form>

      {/* Email */}
      <form onSubmit={handleEmailSubmit} className={cardClass}>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <Mail className="h-5 w-5 text-primary" />
          {t('profile.settings.emailSection')}
        </h3>
        <Notice feedback={emailFeedback} />
        <p className="mb-4 text-sm text-muted-foreground">
          {t('profile.settings.currentEmail')}: <span className="font-medium">{user.email}</span>
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="ps-new-email" className={labelClass}>
              {t('profile.settings.newEmail')}
            </label>
            <input
              id="ps-new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={AUTH_INPUT_CLASS}
              placeholder="name@example.com"
              required
              disabled={emailLoading}
            />
          </div>
          {hasPassword ? (
            <div>
              <label htmlFor="ps-email-pass" className={labelClass}>
                {t('profile.settings.currentPassword')}
              </label>
              <input
                id="ps-email-pass"
                type="password"
                autoComplete="current-password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                className={AUTH_INPUT_CLASS}
                required
                disabled={emailLoading}
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{t('profile.settings.googleReauth')}</p>
          )}
        </div>
        <div className="mt-5">
          <button type="submit" className={btnClass} disabled={emailLoading}>
            {emailLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('profile.settings.updateEmailBtn')}
          </button>
        </div>
      </form>

      {/* Password */}
      <form onSubmit={handlePasswordSubmit} className={cardClass}>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <KeyRound className="h-5 w-5 text-primary" />
          {t('profile.settings.passwordSection')}
        </h3>
        <Notice feedback={passwordFeedback} />
        {hasPassword ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="ps-cur-pass" className={labelClass}>
                {t('profile.settings.currentPassword')}
              </label>
              <input
                id="ps-cur-pass"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={AUTH_INPUT_CLASS}
                required
                disabled={passwordLoading}
              />
            </div>
            <div>
              <label htmlFor="ps-new-pass" className={labelClass}>
                {t('profile.settings.newPassword')}
              </label>
              <input
                id="ps-new-pass"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={AUTH_INPUT_CLASS}
                required
                disabled={passwordLoading}
              />
            </div>
            <div>
              <label htmlFor="ps-confirm-pass" className={labelClass}>
                {t('profile.settings.confirmPassword')}
              </label>
              <input
                id="ps-confirm-pass"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={AUTH_INPUT_CLASS}
                required
                disabled={passwordLoading}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('profile.settings.noEmailProvider')}
          </p>
        )}
        {hasPassword && (
          <div className="mt-5">
            <button type="submit" className={btnClass} disabled={passwordLoading}>
              {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('profile.settings.updatePasswordBtn')}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
