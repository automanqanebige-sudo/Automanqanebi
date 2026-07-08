'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { carBrands } from '@/data/car-brands'
import { DEFAULT_CAR_IMAGE } from '@/lib/cars-mapper'
import {
  LISTING_LOCATIONS,
  type CarListingFormValues,
  formValuesToPayload,
} from '@/lib/car-listing'
import { CAR_FEATURES } from '@/types/filters'
import { uploadCarImage } from '@/lib/upload-car-image'
import CarImageUpload, { UploadingOverlay } from '@/components/CarImageUpload'

function inputClass() {
  return 'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground outline-none transition-all focus:ring-2 focus:ring-primary'
}

const emptyValues: CarListingFormValues = {
  brand: '',
  model: '',
  price: '',
  year: String(new Date().getFullYear()),
  mileage: '',
  location: 'თბილისი',
  fuelType: 'petrol',
  transmission: 'automatic',
  phone: '',
  imageUrl: '',
  description: '',
  category: 'car',
  bodyType: '',
  driveType: '',
  steering: '',
  engineVolume: '',
  cylinders: '',
  doors: '',
  color: '',
  listingType: 'standard',
  importRegion: '',
  customsStatus: '',
  features: [],
}

interface CarListingFormProps {
  title: string
  subtitle: string
  submitLabel: string
  submittingLabel: string
  initialValues?: CarListingFormValues
  onSubmit: (payload: ReturnType<typeof formValuesToPayload>) => Promise<void>
}

export default function CarListingForm({
  title,
  subtitle,
  submitLabel,
  submittingLabel,
  initialValues,
  onSubmit,
}: CarListingFormProps) {
  const { t } = useLanguage()
  const { user } = useAuth()

  const [values, setValues] = useState<CarListingFormValues>(initialValues ?? emptyValues)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState('')

  const models = carBrands.find((b) => b.brand === values.brand)?.models ?? []

  const patch = (partial: Partial<CarListingFormValues>) =>
    setValues((prev) => ({ ...prev, ...partial }))

  const generateAIDescription = async () => {
    if (!values.brand || !values.model) {
      setError(t('addCar.errorBrandModel'))
      return
    }
    setLoadingAI(true)
    setError('')
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: values.brand,
          model: values.model,
          year: values.year,
          mileage: values.mileage,
          fuelType: values.fuelType,
        }),
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (typeof data.description === 'string') patch({ description: data.description })
    } catch {
      setError(t('addCar.errorAi'))
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!values.brand || !values.model || !values.price || !values.year || !values.phone) {
      setError(t('addCar.errorRequired'))
      return
    }

    if (!user) {
      setError(t('addCar.errorAuth'))
      return
    }

    setSubmitting(true)
    try {
      let imageUrl = values.imageUrl.trim()

      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadCarImage(imageFile, user.uid)
        setUploading(false)
      }

      if (!imageUrl) imageUrl = DEFAULT_CAR_IMAGE

      await onSubmit(formValuesToPayload(values, imageUrl))
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error && err.message === 'invalidType'
        ? t('upload.errorType')
        : err instanceof Error && err.message === 'tooLarge'
          ? t('upload.errorSize')
          : t('addCar.errorSubmit')
      setError(msg)
    } finally {
      setUploading(false)
      setSubmitting(false)
    }
  }

  const busy = submitting || uploading

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <CarImageUpload
            existingUrl={initialValues?.imageUrl}
            urlFallback={values.imageUrl}
            onUrlFallbackChange={(imageUrl) => patch({ imageUrl })}
            onFileChange={setImageFile}
            disabled={busy}
          />

          {uploading && <UploadingOverlay label={t('upload.uploading')} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('search.selectBrand')} *
              </label>
              <select
                className={inputClass()}
                value={values.brand}
                onChange={(e) => patch({ brand: e.target.value, model: '' })}
                required
                disabled={busy}
              >
                <option value="">{t('search.selectBrand')}</option>
                {carBrands.map((b) => (
                  <option key={b.brand} value={b.brand}>
                    {b.brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('search.model')} *
              </label>
              <select
                className={inputClass()}
                value={values.model}
                onChange={(e) => patch({ model: e.target.value })}
                required
                disabled={!values.brand || busy}
              >
                <option value="">{t('search.selectModel')}</option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('addCar.price')} (USD) *
              </label>
              <input
                className={inputClass()}
                type="number"
                min={0}
                value={values.price}
                onChange={(e) => patch({ price: e.target.value })}
                required
                disabled={busy}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('search.year')} *
              </label>
              <input
                className={inputClass()}
                type="number"
                min={1980}
                max={new Date().getFullYear() + 1}
                value={values.year}
                onChange={(e) => patch({ year: e.target.value })}
                required
                disabled={busy}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('search.mileage')} (km)
              </label>
              <input
                className={inputClass()}
                type="number"
                min={0}
                value={values.mileage}
                onChange={(e) => patch({ mileage: e.target.value })}
                disabled={busy}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('car.location')}
              </label>
              <select
                className={inputClass()}
                value={values.location}
                onChange={(e) => patch({ location: e.target.value })}
                disabled={busy}
              >
                {LISTING_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('search.fuelType')}
              </label>
              <select
                className={inputClass()}
                value={values.fuelType}
                onChange={(e) => patch({ fuelType: e.target.value })}
                disabled={busy}
              >
                <option value="petrol">{t('fuel.Petrol')}</option>
                <option value="diesel">{t('fuel.Diesel')}</option>
                <option value="hybrid">{t('fuel.Hybrid')}</option>
                <option value="electric">{t('fuel.Electric')}</option>
                <option value="lpg">{t('fuel.LPG')}</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('search.transmission')}
              </label>
              <select
                className={inputClass()}
                value={values.transmission}
                onChange={(e) => patch({ transmission: e.target.value })}
                disabled={busy}
              >
                <option value="automatic">{t('transmission.Automatic')}</option>
                <option value="manual">{t('transmission.Manual')}</option>
                <option value="semi-automatic">{t('transmission.Semi-Automatic')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('addCar.phone')} *
            </label>
            <input
              className={inputClass()}
              type="tel"
              placeholder="+995 5XX XX XX XX"
              value={values.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              required
              disabled={busy}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {showAdvanced ? t('search.hideMore') : t('search.showMore')}
          </button>

          {showAdvanced && (
            <div className="space-y-4 rounded-xl border border-border bg-secondary/20 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t('search.category')}
                  </label>
                  <select className={inputClass()} value={values.category} onChange={(e) => patch({ category: e.target.value })} disabled={busy}>
                    <option value="car">{t('category.car')}</option>
                    <option value="suv">{t('category.suv')}</option>
                    <option value="van">{t('category.van')}</option>
                    <option value="truck">{t('category.truck')}</option>
                    <option value="motorcycle">{t('category.motorcycle')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t('search.bodyType')}
                  </label>
                  <select className={inputClass()} value={values.bodyType} onChange={(e) => patch({ bodyType: e.target.value })} disabled={busy}>
                    <option value="">{t('search.any')}</option>
                    <option value="sedan">{t('bodyType.sedan')}</option>
                    <option value="suv">{t('bodyType.suv')}</option>
                    <option value="hatchback">{t('bodyType.hatchback')}</option>
                    <option value="coupe">{t('bodyType.coupe')}</option>
                    <option value="wagon">{t('bodyType.wagon')}</option>
                    <option value="pickup">{t('bodyType.pickup')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t('search.driveType')}
                  </label>
                  <select className={inputClass()} value={values.driveType} onChange={(e) => patch({ driveType: e.target.value })} disabled={busy}>
                    <option value="">{t('search.any')}</option>
                    <option value="fwd">{t('driveType.fwd')}</option>
                    <option value="rwd">{t('driveType.rwd')}</option>
                    <option value="awd">{t('driveType.awd')}</option>
                    <option value="4wd">{t('driveType.4wd')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t('search.steering')}
                  </label>
                  <select className={inputClass()} value={values.steering} onChange={(e) => patch({ steering: e.target.value })} disabled={busy}>
                    <option value="">{t('search.any')}</option>
                    <option value="left">{t('steering.left')}</option>
                    <option value="right">{t('steering.right')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t('search.color')}
                  </label>
                  <select className={inputClass()} value={values.color} onChange={(e) => patch({ color: e.target.value })} disabled={busy}>
                    <option value="">{t('search.any')}</option>
                    <option value="white">{t('color.white')}</option>
                    <option value="black">{t('color.black')}</option>
                    <option value="red">{t('color.red')}</option>
                    <option value="blue">{t('color.blue')}</option>
                    <option value="green">{t('color.green')}</option>
                    <option value="silver">{t('color.silver')}</option>
                    <option value="gray">{t('color.gray')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t('search.doors')}
                  </label>
                  <input className={inputClass()} type="number" min={2} max={5} value={values.doors} onChange={(e) => patch({ doors: e.target.value })} disabled={busy} />
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">{t('search.features')}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CAR_FEATURES.map((feature) => (
                    <label key={feature} className="flex items-center gap-2 text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={values.features.includes(feature)}
                        onChange={(e) => {
                          patch({
                            features: e.target.checked
                              ? [...values.features, feature]
                              : values.features.filter((f) => f !== feature),
                          })
                        }}
                        disabled={busy}
                      />
                      {t(`feature.${feature}`)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              type="button"
              onClick={generateAIDescription}
              disabled={loadingAI || busy}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {loadingAI ? t('addCar.aiLoading') : t('addCar.aiGenerate')}
            </button>
            <textarea
              className={`${inputClass()} min-h-32`}
              placeholder={t('addCar.description')}
              value={values.description}
              onChange={(e) => patch({ description: e.target.value })}
              disabled={busy}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? submittingLabel : submitLabel}
          </button>
        </form>
      </div>
    </div>
  )
}
