'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useAuth } from '@/context/AuthContext'
import { carBrands } from '@/data/car-brands'
import { DEFAULT_CAR_IMAGE } from '@/lib/cars-mapper'
import {
  LISTING_LOCATIONS,
  type CarListingFormValues,
  formValuesToPayload,
} from '@/lib/car-listing'
import { CAR_FEATURES } from '@/types/filters'
import { uploadCarImages } from '@/lib/upload-car-image'
import CarImagesUpload, { urlsToSlots, type ImageSlot } from '@/components/CarImagesUpload'
import { UploadingOverlay } from '@/components/CarImageUpload'
import MessengerContactToggles from '@/components/MessengerContactToggles'
import CurrencyToggle, { type PriceCurrency } from '@/components/CurrencyToggle'
import PhoneOtpVerify from '@/components/auth/PhoneOtpVerify'
import { fetchUserProfile } from '@/lib/user-profile-firestore'
import { isFirebaseConfigured } from '@/lib/firebase'
import { formatPhoneDisplay } from '@/lib/phone'

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
  contactWhatsApp: false,
  contactViber: false,
  imageUrl: '',
  imageUrls: [],
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
  offerType: 'sale',
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
  const { currency: siteCurrency, rate } = useCurrency()
  const { user } = useAuth()

  const [values, setValues] = useState<CarListingFormValues>(initialValues ?? emptyValues)
  const [priceCurrency, setPriceCurrency] = useState<PriceCurrency>(siteCurrency)
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(() =>
    initialValues?.imageUrls?.length ? urlsToSlots(initialValues.imageUrls) : []
  )
  const [loadingAI, setLoadingAI] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState('')
  const [vin, setVin] = useState('')
  const [vinLoading, setVinLoading] = useState(false)
  const [vinMsg, setVinMsg] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(Boolean(initialValues))
  const [checkingPhone, setCheckingPhone] = useState(!initialValues)

  useEffect(() => {
    if (!user || initialValues || !isFirebaseConfigured()) {
      setCheckingPhone(false)
      if (initialValues) setPhoneVerified(true)
      return
    }
    let cancelled = false
    fetchUserProfile(user.uid)
      .then((p) => {
        if (cancelled) return
        setPhoneVerified(Boolean(p.phoneVerified))
        if (p.phone) {
          setValues((prev) => ({
            ...prev,
            phone: prev.phone.trim() ? prev.phone : formatPhoneDisplay(p.phone!),
          }))
        }
      })
      .finally(() => {
        if (!cancelled) setCheckingPhone(false)
      })
    return () => {
      cancelled = true
    }
  }, [user, initialValues])

  const models = carBrands.find((b) => b.brand === values.brand)?.models ?? []

  const patch = (partial: Partial<CarListingFormValues>) =>
    setValues((prev) => ({ ...prev, ...partial }))

  const convertDisplayPrice = (amount: number, from: PriceCurrency, to: PriceCurrency) => {
    if (from === to || !Number.isFinite(amount)) return amount
    if (from === 'USD' && to === 'GEL') return Math.round(amount * rate)
    if (from === 'GEL' && to === 'USD') return Math.round(amount / rate)
    return amount
  }

  const handlePriceCurrencyChange = (next: PriceCurrency) => {
    if (next === priceCurrency) return
    const current = Number(values.price)
    if (values.price.trim() && Number.isFinite(current) && current > 0) {
      patch({ price: String(convertDisplayPrice(current, priceCurrency, next)) })
    }
    setPriceCurrency(next)
  }

  const priceInGel = () => {
    const n = Number(values.price)
    if (!Number.isFinite(n) || n < 0) return 0
    return priceCurrency === 'GEL' ? Math.round(n) : Math.round(n * rate)
  }

  const decodeVin = async () => {
    const cleaned = vin.trim().toUpperCase()
    if (cleaned.length < 11) {
      setVinMsg(t('addCar.vinInvalid'))
      return
    }
    setVinLoading(true)
    setVinMsg('')
    try {
      const res = await fetch(`/api/vin/${encodeURIComponent(cleaned)}`)
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setVinMsg(t('addCar.vinNotFound'))
        return
      }
      const brandMatch =
        carBrands.find(
          (b) => b.brand.toLowerCase() === String(data.make || '').toLowerCase()
        )?.brand || data.make || ''
      const next: Partial<CarListingFormValues> = {}
      if (brandMatch) next.brand = brandMatch
      if (data.model) next.model = data.model
      if (data.modelYear) next.year = String(data.modelYear)
      if (data.displacementL) {
        const liters = Number(data.displacementL)
        if (!Number.isNaN(liters)) next.engineVolume = String(Math.round(liters * 10) / 10)
      }
      if (data.engineCylinders) next.cylinders = String(data.engineCylinders)
      if (data.fuelType) {
        const f = String(data.fuelType).toLowerCase()
        if (f.includes('diesel')) next.fuelType = 'diesel'
        else if (f.includes('electric')) next.fuelType = 'electric'
        else if (f.includes('hybrid')) next.fuelType = 'hybrid'
        else if (f.includes('gas') || f.includes('petrol') || f.includes('gasoline'))
          next.fuelType = 'petrol'
      }
      patch(next)
      setVinMsg(t('addCar.vinFilled'))
    } catch {
      setVinMsg(t('addCar.vinNotFound'))
    } finally {
      setVinLoading(false)
    }
  }

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

    if (!phoneVerified) {
      setError(t('addCar.phoneVerifyRequired'))
      return
    }

    setSubmitting(true)
    try {
      const filesToUpload = imageSlots.filter((s) => s.file).map((s) => s.file!)
      let uploadedUrls: string[] = []

      if (filesToUpload.length > 0) {
        setUploading(true)
        uploadedUrls = await uploadCarImages(filesToUpload, user.uid)
        setUploading(false)
      }

      let uploadIndex = 0
      const resolvedUrls = imageSlots
        .map((slot) => {
          if (slot.file) {
            const url = uploadedUrls[uploadIndex]
            uploadIndex += 1
            return url
          }
          if (slot.url.startsWith('blob:')) return ''
          return slot.url.trim()
        })
        .filter(Boolean)

      if (resolvedUrls.length === 0) resolvedUrls.push(DEFAULT_CAR_IMAGE)

      await onSubmit(
        formValuesToPayload(values, resolvedUrls, {
          priceInGel: priceInGel(),
          priceCurrency,
        })
      )
    } catch (err) {
      console.error(err)
      const code = (err as { code?: string } | null)?.code
      const msg =
        err instanceof Error && err.message === 'invalidType'
          ? t('upload.errorType')
          : err instanceof Error && err.message === 'tooLarge'
            ? t('upload.errorSize')
            : code === 'permission-denied'
              ? t('addCar.errorSubmit')
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
          <CarImagesUpload slots={imageSlots} onChange={setImageSlots} disabled={busy} />

          {uploading && <UploadingOverlay label={t('upload.uploading')} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                VIN
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className={inputClass()}
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder="WVWZZZ1JZXW000000"
                  maxLength={17}
                  disabled={busy || vinLoading}
                />
                <button
                  type="button"
                  disabled={busy || vinLoading || vin.trim().length < 11}
                  onClick={decodeVin}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
                >
                  {vinLoading ? t('auth.loading') : t('addCar.vinAutofill')}
                </button>
              </div>
              {vinMsg && <p className="mt-1 text-xs text-muted-foreground">{vinMsg}</p>}
            </div>
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
                {values.model && !models.includes(values.model) && (
                  <option value={values.model}>{values.model}</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('filter.section.offerType')}
            </label>
            <div className="inline-flex rounded-xl border border-border bg-background p-0.5">
              {(['sale', 'rent'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => patch({ offerType: type })}
                  disabled={busy}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    values.offerType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {t(`filter.offer.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {t('addCar.priceCurrency')}
              </span>
              <CurrencyToggle
                compact
                value={priceCurrency}
                onChange={handlePriceCurrencyChange}
                disabled={busy}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t('addCar.price')} ({priceCurrency === 'GEL' ? '₾ GEL' : '$ USD'})
                  {values.offerType === 'rent' ? ` / ${t('filter.offer.perMonth')}` : ''} *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    {priceCurrency === 'GEL' ? '₾' : '$'}
                  </span>
                  <input
                    className={`${inputClass()} pl-8`}
                    type="number"
                    min={0}
                    step={1}
                    value={values.price}
                    onChange={(e) => patch({ price: e.target.value })}
                    required
                    disabled={busy}
                    placeholder={priceCurrency === 'GEL' ? '25000' : '9000'}
                  />
                </div>
                {values.price.trim() && Number(values.price) > 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {priceCurrency === 'USD'
                      ? t('addCar.priceInGelHint').replace(
                          '{amount}',
                          priceInGel().toLocaleString('en-US')
                        )
                      : t('addCar.priceInUsdHint').replace(
                          '{amount}',
                          Math.round(Number(values.price) / rate).toLocaleString('en-US')
                        )}
                    <span className="ml-1 opacity-70">(1 $ ≈ {rate.toFixed(2)} ₾)</span>
                  </p>
                )}
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
            <div className="mt-3">
              <MessengerContactToggles
                whatsApp={values.contactWhatsApp}
                viber={values.contactViber}
                onWhatsAppChange={(contactWhatsApp) => patch({ contactWhatsApp })}
                onViberChange={(contactViber) => patch({ contactViber })}
                disabled={busy}
              />
            </div>
            {!initialValues && (
              <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-3">
                <p className="text-sm font-medium text-foreground">{t('phoneOtp.title')}</p>
                {checkingPhone ? (
                  <p className="mt-1 text-xs text-muted-foreground">{t('auth.loading')}</p>
                ) : phoneVerified ? (
                  <p className="mt-1 text-sm text-primary">{t('phoneOtp.success')}</p>
                ) : (
                  <>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('addCar.phoneVerifyRequired')}
                    </p>
                    <PhoneOtpVerify
                      compact
                      defaultPhone={values.phone}
                      onVerified={(verifiedPhone) => {
                        setPhoneVerified(true)
                        patch({ phone: formatPhoneDisplay(verifiedPhone) })
                      }}
                    />
                  </>
                )}
              </div>
            )}
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
                    <option value="sedan">{t('filter.body.sedan')}</option>
                    <option value="suv">{t('filter.body.suv')}</option>
                    <option value="hatchback">{t('filter.body.hatchback')}</option>
                    <option value="coupe">{t('filter.body.coupe')}</option>
                    <option value="wagon">{t('filter.body.wagon')}</option>
                    <option value="pickup">{t('filter.body.pickup')}</option>
                    <option value="special_tech">{t('filter.body.special_tech')}</option>
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
