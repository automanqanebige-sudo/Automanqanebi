'use client'

import { Suspense, useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import RequireAuth from '@/components/RequireAuth'
import ServiceListingForm from '@/components/ServiceListingForm'
import type { ImageSlot } from '@/components/CarImagesUpload'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { createService } from '@/lib/services-firestore'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'
import { emptyServiceFormValues, serviceFormValuesToPayload } from '@/lib/service-listing'
import type { ServiceListingFormValues } from '@/lib/service-listing'
import { resolveServiceImageSlots } from '@/lib/resolve-service-images'
import {
  WORKSHOP_PAGE_CATEGORIES,
  WORKSHOP_PAGE_CATEGORY_ENTRIES,
  type ServiceCategory,
} from '@/types/service'

export default function AddWorkshopPage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <AddWorkshopForm />
      </Suspense>
    </RequireAuth>
  )
}

function AddWorkshopForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const initialCategory = useMemo(() => {
    const cat = searchParams.get('category')
    if (cat && WORKSHOP_PAGE_CATEGORIES.includes(cat as ServiceCategory)) {
      return cat as ServiceCategory
    }
    return WORKSHOP_PAGE_CATEGORIES[0]
  }, [searchParams])

  const initialValues = useMemo(
    () => ({
      ...emptyServiceFormValues(),
      category: initialCategory,
    }),
    [initialCategory]
  )

  const getCategoryLabel = useCallback(
    (cat: ServiceCategory) => {
      const entry = WORKSHOP_PAGE_CATEGORY_ENTRIES.find((e) => e.category === cat)
      if (entry?.labelKey) return t(entry.labelKey)
      return t(`services.cat.${cat}`)
    },
    [t]
  )

  const handleSubmit = async (values: ServiceListingFormValues, imageSlots: ImageSlot[]) => {
    setError('')

    if (!user) {
      setError(t('services.formRequired'))
      return
    }

    setSubmitting(true)
    try {
      let imageUrls: string[] = []
      if (imageSlots.length > 0) {
        setUploading(true)
        try {
          imageUrls = await resolveServiceImageSlots(imageSlots, user.uid)
        } catch (uploadErr) {
          console.error('[AddWorkshop] upload', uploadErr)
          const code = (uploadErr as { code?: string } | null)?.code
          if (code === 'storage/unauthorized') {
            setError(t('services.formUploadDenied'))
          } else if (uploadErr instanceof Error && uploadErr.message) {
            setError(uploadErr.message)
          } else {
            setError(t('services.formUploadError'))
          }
          return
        } finally {
          setUploading(false)
        }
      }

      await createService(serviceFormValuesToPayload(values, imageUrls), user.uid, user.email)
      logAnalyticsEvent('listing_workshop', { category: values.category, name: values.name }, user.uid)
      router.push(`/workshops?category=${values.category}`)
    } catch (err) {
      console.error('[AddWorkshop]', err)
      const code = (err as { code?: string } | null)?.code
      if (code === 'permission-denied') {
        setError(t('services.formPermissionDenied'))
      } else {
        setError(t('services.formError'))
      }
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/workshops"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('workshops.backToWorkshops')}
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <PlusCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('workshops.addWorkshop')}</h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{t('workshops.addSubtitle')}</p>

        <ServiceListingForm
          mode="create"
          initialValues={initialValues}
          categoryOptions={WORKSHOP_PAGE_CATEGORIES}
          getCategoryLabel={getCategoryLabel}
          submitLabelKey="workshops.formSubmit"
          submittingLabelKey="workshops.formSubmitting"
          submitting={submitting}
          uploading={uploading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
