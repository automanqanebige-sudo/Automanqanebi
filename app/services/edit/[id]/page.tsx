'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil } from 'lucide-react'
import RequireAuth from '@/components/RequireAuth'
import ServiceListingForm from '@/components/ServiceListingForm'
import type { ImageSlot } from '@/components/CarImagesUpload'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { fetchServiceById, updateService } from '@/lib/services-firestore'
import { serviceFormValuesToPayload, serviceToFormValues } from '@/lib/service-listing'
import type { ServiceListingFormValues } from '@/lib/service-listing'
import { resolveServiceImageSlots } from '@/lib/resolve-service-images'

function EditServiceForm({ id }: { id: string }) {
  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()

  const [initialValues, setInitialValues] = useState<ServiceListingFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    fetchServiceById(id)
      .then((service) => {
        if (!service) {
          setNotFound(true)
          return
        }
        if (service.userId && service.userId !== user.uid) {
          setForbidden(true)
          return
        }
        if (!service.userId && !id.startsWith('s')) {
          setForbidden(true)
          return
        }
        setInitialValues(serviceToFormValues(service))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, user])

  const handleSubmit = async (values: ServiceListingFormValues, imageSlots: ImageSlot[]) => {
    if (!user) return

    setError('')
    setSubmitting(true)

    try {
      let imageUrls: string[] = []
      if (imageSlots.length > 0) {
        setUploading(true)
        try {
          imageUrls = await resolveServiceImageSlots(imageSlots, user.uid)
        } catch (uploadErr) {
          console.error('[EditService] upload', uploadErr)
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

      await updateService(id, serviceFormValuesToPayload(values, imageUrls))
      router.push('/profile')
    } catch (err) {
      console.error('[EditService]', err)
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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        {t('car.loading')}
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">{t('services.notFound')}</h1>
        <Link href="/profile" className="mt-4 inline-block text-primary hover:underline">
          {t('nav.profile')}
        </Link>
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">{t('services.editForbidden')}</h1>
        <p className="mt-2 text-muted-foreground">{t('services.editForbiddenDesc')}</p>
        <Link href="/profile" className="mt-4 inline-block text-primary hover:underline">
          {t('nav.profile')}
        </Link>
      </div>
    )
  }

  if (!initialValues) return null

  return (
    <div className="mx-auto max-w-3xl section-padding">
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.profile')}
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Pencil className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('services.editService')}</h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{t('services.editSubtitle')}</p>

        <ServiceListingForm
          key={id}
          mode="edit"
          initialValues={initialValues}
          submitting={submitting}
          uploading={uploading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default function EditServicePage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth>
      <EditServiceForm id={params.id} />
    </RequireAuth>
  )
}
