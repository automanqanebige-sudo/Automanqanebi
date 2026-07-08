'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_ICONS,
  type ServiceCategory,
} from '@/types/service'
import { createService } from '@/lib/services-firestore'

function inputClass() {
  return 'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground outline-none transition-all focus:ring-2 focus:ring-primary'
}

function AddServiceForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<ServiceCategory>('other')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(
    () => Boolean(name.trim() && location.trim() && phone.trim()),
    [name, location, phone]
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!canSubmit || !user) {
      setError(t('services.formRequired'))
      return
    }

    setSubmitting(true)
    try {
      await createService(
        {
          name: name.trim(),
          category,
          location: location.trim(),
          phone: phone.trim(),
          description: description.trim(),
        },
        user.uid,
        user.email
      )
      router.push('/services')
    } catch (err) {
      console.error(err)
      setError(t('services.formError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('services.backToServices')}
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <PlusCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('services.addService')}</h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{t('services.addSubtitle')}</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formName')} *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass()}
              placeholder={t('services.formNamePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formCategory')} *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className={inputClass()}
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {SERVICE_CATEGORY_ICONS[cat]} {t(`services.cat.${cat}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formLocation')} *
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass()}
              placeholder={t('services.formLocationPlaceholder')}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formPhone')} *
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className={inputClass()}
              placeholder={t('services.formPhonePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formDescription')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass()} min-h-[120px]`}
              placeholder={t('services.formDescriptionPlaceholder')}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? t('services.formSubmitting') : t('services.formSubmit')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AddServicePage() {
  return (
    <RequireAuth>
      <AddServiceForm />
    </RequireAuth>
  )
}
