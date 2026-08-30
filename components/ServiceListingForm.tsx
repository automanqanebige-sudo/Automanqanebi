'use client'

import { FormEvent, useMemo, useState, type ReactNode } from 'react'
import {
  Camera,
  Clock,
  FileText,
  MapPin,
  Phone,
  Tag,
  Truck,
  Wrench,
} from 'lucide-react'
import CarImagesUpload, { urlsToSlots, type ImageSlot } from '@/components/CarImagesUpload'
import { UploadingOverlay } from '@/components/CarImageUpload'
import ServiceLocationMap from '@/components/ServiceLocationMap'
import ServiceWorkSchedule from '@/components/ServiceWorkSchedule'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_ICONS,
  type ServiceCategory,
} from '@/types/service'
import type { ServiceListingFormValues } from '@/lib/service-listing'
import { emptyServiceFormValues } from '@/lib/service-listing'
import {
  RENTAL_SUB_SERVICES,
  RENTAL_TRANSPORT_TYPES,
  type RentalSubService,
  type RentalTransportType,
} from '@/types/rental-transport'
import {
  DISC_BOLT_PATTERNS,
  DISC_CONDITIONS,
  DISC_DIAMETERS,
  DISC_MATERIALS,
  type DiscBoltPattern,
  type DiscCondition,
  type DiscDiameter,
  type DiscMaterial,
} from '@/types/disc-filters'
import { RENTAL_SUB_EMOJI, RENTAL_TRANSPORT_EMOJI } from '@/lib/filter-emojis'

type ServiceListingFormProps = {
  mode: 'create' | 'edit'
  initialValues?: ServiceListingFormValues
  submitting?: boolean
  uploading?: boolean
  error?: string
  onSubmit: (values: ServiceListingFormValues, imageSlots: ImageSlot[]) => void | Promise<void>
}

function inputClass() {
  return 'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground outline-none transition-all focus:ring-2 focus:ring-primary disabled:opacity-60'
}

function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Wrench
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-secondary/20 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export default function ServiceListingForm({
  mode,
  initialValues,
  submitting,
  uploading,
  error,
  onSubmit,
}: ServiceListingFormProps) {
  const { t } = useLanguage()
  const { currency } = useCurrency()
  const currencyLabel = currency === 'GEL' ? '₾' : '$'

  const [values, setValues] = useState<ServiceListingFormValues>(
    initialValues ?? emptyServiceFormValues()
  )
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(() =>
    initialValues?.imageUrls?.length ? urlsToSlots(initialValues.imageUrls) : []
  )

  const isRental = values.category === 'rental'
  const isDiscs = values.category === 'discs'

  const canSubmit = useMemo(
    () =>
      Boolean(values.name.trim() && values.location.trim() && values.phone.trim()) &&
      (!isRental || values.rentalTransportTypes.length > 0),
    [values.name, values.location, values.phone, isRental, values.rentalTransportTypes]
  )

  const toggleRentalTransport = (type: RentalTransportType) => {
    setValues((prev) => {
      const has = prev.rentalTransportTypes.includes(type)
      return {
        ...prev,
        rentalTransportTypes: has
          ? prev.rentalTransportTypes.filter((t) => t !== type)
          : [...prev.rentalTransportTypes, type],
      }
    })
  }

  const toggleRentalSub = (sub: RentalSubService) => {
    setValues((prev) => {
      const has = prev.rentalSubServices.includes(sub)
      return {
        ...prev,
        rentalSubServices: has
          ? prev.rentalSubServices.filter((s) => s !== sub)
          : [...prev.rentalSubServices, sub],
      }
    })
  }

  const toggleDiscDiameter = (d: DiscDiameter) => {
    setValues((prev) => {
      const has = prev.discDiameters.includes(d)
      return {
        ...prev,
        discDiameters: has
          ? prev.discDiameters.filter((x) => x !== d)
          : [...prev.discDiameters, d],
      }
    })
  }

  const toggleDiscBolt = (p: DiscBoltPattern) => {
    setValues((prev) => {
      const has = prev.discBoltPatterns.includes(p)
      return {
        ...prev,
        discBoltPatterns: has
          ? prev.discBoltPatterns.filter((x) => x !== p)
          : [...prev.discBoltPatterns, p],
      }
    })
  }

  const toggleDiscMaterial = (m: DiscMaterial) => {
    setValues((prev) => {
      const has = prev.discMaterials.includes(m)
      return {
        ...prev,
        discMaterials: has
          ? prev.discMaterials.filter((x) => x !== m)
          : [...prev.discMaterials, m],
      }
    })
  }

  const setField = <K extends keyof ServiceListingFormValues>(
    key: K,
    value: ServiceListingFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting || uploading) return
    await onSubmit(values, imageSlots)
  }

  const submitLabel =
    mode === 'edit'
      ? submitting
        ? t('services.formSaving')
        : t('services.formSave')
      : submitting
        ? t('services.formSubmitting')
        : t('services.formSubmit')

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormSection icon={Wrench} title={t('services.formSectionBasic')}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formName')} *
          </label>
          <input
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            className={inputClass()}
            placeholder={t('services.formNamePlaceholder')}
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formCategory')} *
          </label>
          <select
            value={values.category}
            onChange={(e) => setField('category', e.target.value as ServiceCategory)}
            className={inputClass()}
            disabled={submitting}
          >
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(`services.cat.${cat}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formPhone')} *
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={values.phone}
              onChange={(e) => setField('phone', e.target.value)}
              type="tel"
              className={`${inputClass()} pl-10`}
              placeholder={t('services.formPhonePlaceholder')}
              required
              disabled={submitting}
            />
          </div>
        </div>
      </FormSection>

      <FormSection icon={Camera} title={t('services.formSectionPhotos')}>
        <CarImagesUpload
          slots={imageSlots}
          onChange={setImageSlots}
          disabled={submitting || uploading}
        />
      </FormSection>

      <FormSection icon={Tag} title={t('services.formSectionPricing')}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formPrice')} ({currencyLabel})
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.price}
              onChange={(e) => setField('price', e.target.value)}
              className={inputClass()}
              placeholder="0"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formOldPrice')} ({currencyLabel})
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.oldPrice}
              onChange={(e) => setField('oldPrice', e.target.value)}
              className={inputClass()}
              placeholder="0"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('services.formNewPrice')} ({currencyLabel})
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.newPrice}
              onChange={(e) => setField('newPrice', e.target.value)}
              className={inputClass()}
              placeholder="0"
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formPromoUntil')}
          </label>
          <input
            type="date"
            value={values.promoUntil}
            onChange={(e) => setField('promoUntil', e.target.value)}
            className={inputClass()}
            disabled={submitting}
          />
          <p className="mt-1 text-xs text-muted-foreground">{t('services.formPromoHint')}</p>
        </div>
      </FormSection>

      {isRental && (
        <FormSection icon={Truck} title={t('services.formSectionRental')}>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('services.rentalTransport')} *
            </label>
            <div className="flex flex-wrap gap-2">
              {RENTAL_TRANSPORT_TYPES.map((type) => {
                const checked = values.rentalTransportTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleRentalTransport(type)}
                    disabled={submitting}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <span aria-hidden>{RENTAL_TRANSPORT_EMOJI[type]}</span>
                    {t(`services.rentalTransport.${type}`)}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('services.rentalSubService')}
            </label>
            <div className="flex flex-wrap gap-2">
              {RENTAL_SUB_SERVICES.map((sub) => {
                const checked = values.rentalSubServices.includes(sub)
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleRentalSub(sub)}
                    disabled={submitting}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <span aria-hidden>{RENTAL_SUB_EMOJI[sub]}</span>
                    {t(`services.sub.${sub}`)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('services.rentalPricePerDay')} ({currencyLabel})
              </label>
              <input
                type="number"
                min="0"
                value={values.rentalPricePerDay}
                onChange={(e) => setField('rentalPricePerDay', e.target.value)}
                className={inputClass()}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('services.rentalPricePerMonth')} ({currencyLabel})
              </label>
              <input
                type="number"
                min="0"
                value={values.rentalPricePerMonth}
                onChange={(e) => setField('rentalPricePerMonth', e.target.value)}
                className={inputClass()}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('services.rentalMinDays')}
              </label>
              <input
                type="number"
                min="1"
                value={values.rentalMinDays}
                onChange={(e) => setField('rentalMinDays', e.target.value)}
                className={inputClass()}
                disabled={submitting}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={values.withDriver}
              onChange={(e) => setField('withDriver', e.target.checked)}
              disabled={submitting}
              className="h-4 w-4 rounded border-input text-primary"
            />
            <span className="text-sm text-foreground">{t('services.rentalWithDriverYes')}</span>
          </label>
        </FormSection>
      )}

      {isDiscs && (
        <FormSection icon={Tag} title={t('services.formSectionDiscs')}>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('services.discDiameter')}
            </label>
            <div className="flex flex-wrap gap-2">
              {DISC_DIAMETERS.map((d) => {
                const checked = values.discDiameters.includes(d)
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDiscDiameter(d)}
                    disabled={submitting}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    R{d}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('services.discBoltPattern')}
            </label>
            <div className="flex flex-wrap gap-2">
              {DISC_BOLT_PATTERNS.map((p) => {
                const checked = values.discBoltPatterns.includes(p)
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleDiscBolt(p)}
                    disabled={submitting}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('services.discMaterial')}
            </label>
            <div className="flex flex-wrap gap-2">
              {DISC_MATERIALS.map((m) => {
                const checked = values.discMaterials.includes(m)
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleDiscMaterial(m)}
                    disabled={submitting}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {t(`services.discMaterial.${m}`)}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('services.discCondition')}
            </label>
            <div className="flex flex-wrap gap-2">
              {DISC_CONDITIONS.map((c) => {
                const checked = values.discCondition === c
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setField('discCondition', checked ? '' : (c as DiscCondition))
                    }
                    disabled={submitting}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {t(`services.discCondition.${c}`)}
                  </button>
                )
              })}
            </div>
          </div>
        </FormSection>
      )}

      <FormSection icon={FileText} title={t('services.formSectionBio')}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formBio')}
          </label>
          <textarea
            value={values.bio}
            onChange={(e) => setField('bio', e.target.value)}
            className={`${inputClass()} min-h-[140px]`}
            placeholder={t('services.formBioPlaceholder')}
            disabled={submitting}
          />
        </div>
      </FormSection>

      <FormSection icon={MapPin} title={t('services.formSectionLocation')}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formLocation')} *
          </label>
          <input
            value={values.location}
            onChange={(e) => setField('location', e.target.value)}
            className={inputClass()}
            placeholder={t('services.formLocationPlaceholder')}
            required
            disabled={submitting}
          />
        </div>

        <ServiceLocationMap
          latitude={values.latitude}
          longitude={values.longitude}
          onLatitudeChange={(v) => setField('latitude', v)}
          onLongitudeChange={(v) => setField('longitude', v)}
          disabled={submitting}
        />
      </FormSection>

      <FormSection icon={Clock} title={t('services.formSectionSchedule')}>
        <ServiceWorkSchedule
          value={values.workSchedule}
          onChange={(schedule) => setField('workSchedule', schedule)}
          open24Hours={values.open24Hours}
          onOpen24HoursChange={(open24Hours) => setField('open24Hours', open24Hours)}
          disabled={submitting}
        />
      </FormSection>

      {uploading && <UploadingOverlay label={t('upload.uploading')} />}

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || uploading || !canSubmit}
        className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  )
}
