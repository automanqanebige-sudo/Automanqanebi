'use client'

import { RotateCcw } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import {
  CAR_COLORS,
  CAR_FEATURES,
  COLOR_EMOJI,
  CUSTOMS_STATUSES,
  IMPORT_REGIONS,
  LISTING_TYPES,
  PRICE_SLIDER_MAX,
  type CarFeature,
  type FilterState,
} from '@/types/filters'
import FilterChipGroup from '@/components/FilterChipGroup'
import RangeFromTo from '@/components/RangeFromTo'
import {
  BODY_EMOJI,
  CATEGORY_EMOJI,
  CUSTOMS_EMOJI,
  DRIVE_EMOJI,
  FEATURE_EMOJI,
  FUEL_EMOJI,
  IMPORT_EMOJI,
  LISTING_EMOJI,
  STEERING_EMOJI,
  TRANSMISSION_EMOJI,
  withEmoji,
} from '@/lib/filter-emojis'

interface AdvancedFilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onApply: () => void
  onReset: () => void
  resultCount: number
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
      <span aria-hidden>{icon}</span>
      {children}
    </h3>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((o) => (
          <option key={o.value || '__any'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function AdvancedFilterPanel({
  filters,
  onChange,
  onApply,
  onReset,
  resultCount,
}: AdvancedFilterPanelProps) {
  const { t } = useLanguage()
  const { currency, formatPrice } = useCurrency()

  const patch = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  const toggleFeature = (feature: CarFeature) => {
    const next = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature]
    patch({ features: next })
  }

  const categoryOptions = [
    { value: '', label: t('search.any'), emoji: '🌐' },
    { value: 'car', label: t('filter.category.car'), emoji: CATEGORY_EMOJI.car },
    { value: 'suv', label: t('filter.category.suv'), emoji: CATEGORY_EMOJI.suv },
    { value: 'van', label: t('filter.category.van'), emoji: CATEGORY_EMOJI.van },
    { value: 'truck', label: t('filter.category.truck'), emoji: CATEGORY_EMOJI.truck },
    { value: 'motorcycle', label: t('filter.category.motorcycle'), emoji: CATEGORY_EMOJI.motorcycle },
  ]

  const fuelOptions = [
    { value: '', label: t('search.allFuel'), emoji: '⛽' },
    { value: 'petrol', label: t('fuel.Petrol'), emoji: FUEL_EMOJI.petrol },
    { value: 'diesel', label: t('fuel.Diesel'), emoji: FUEL_EMOJI.diesel },
    { value: 'hybrid', label: t('fuel.Hybrid'), emoji: FUEL_EMOJI.hybrid },
    { value: 'electric', label: t('fuel.Electric'), emoji: FUEL_EMOJI.electric },
    { value: 'lpg', label: t('fuel.LPG'), emoji: FUEL_EMOJI.lpg },
  ]

  const bodyOptions = [
    { value: '', label: t('search.any') },
    { value: 'sedan', label: withEmoji(BODY_EMOJI.sedan, t('filter.body.sedan')) },
    { value: 'suv', label: withEmoji(BODY_EMOJI.suv, t('filter.body.suv')) },
    { value: 'hatchback', label: withEmoji(BODY_EMOJI.hatchback, t('filter.body.hatchback')) },
    { value: 'coupe', label: withEmoji(BODY_EMOJI.coupe, t('filter.body.coupe')) },
    { value: 'wagon', label: withEmoji(BODY_EMOJI.wagon, t('filter.body.wagon')) },
    { value: 'pickup', label: withEmoji(BODY_EMOJI.pickup, t('filter.body.pickup')) },
    { value: 'van', label: withEmoji(BODY_EMOJI.van, t('filter.body.van')) },
    {
      value: 'special_tech',
      label: withEmoji(BODY_EMOJI.special_tech || '🚜', t('filter.body.special_tech')),
    },
  ]

  const transmissionOptions = [
    { value: '', label: t('search.allTransmission') },
    { value: 'automatic', label: withEmoji(TRANSMISSION_EMOJI.automatic, t('transmission.Automatic')) },
    { value: 'manual', label: withEmoji(TRANSMISSION_EMOJI.manual, t('transmission.Manual')) },
    {
      value: 'semi-automatic',
      label: withEmoji(TRANSMISSION_EMOJI['semi-automatic'], t('transmission.Semi-Automatic')),
    },
  ]

  const driveOptions = [
    { value: '', label: t('search.any') },
    { value: 'fwd', label: withEmoji(DRIVE_EMOJI.fwd, t('filter.drive.fwd')) },
    { value: 'rwd', label: withEmoji(DRIVE_EMOJI.rwd, t('filter.drive.rwd')) },
    { value: 'awd', label: withEmoji(DRIVE_EMOJI.awd, t('filter.drive.awd')) },
    { value: '4wd', label: withEmoji(DRIVE_EMOJI['4wd'], t('filter.drive.4wd')) },
  ]

  const steeringOptions = [
    { value: '', label: t('search.any') },
    { value: 'left', label: withEmoji(STEERING_EMOJI.left, t('filter.steering.left')) },
    { value: 'right', label: withEmoji(STEERING_EMOJI.right, t('filter.steering.right')) },
  ]

  const cylinderOptions = [
    { value: '', label: t('search.any') },
    ...['3', '4', '5', '6', '8', '10', '12'].map((v) => ({ value: v, label: v })),
  ]

  const doorOptions = [
    { value: '', label: t('search.any') },
    ...['2', '3', '4', '5'].map((v) => ({ value: v, label: v })),
  ]

  return (
    <div className="space-y-6">
      {/* Basic */}
      <section>
        <SectionTitle icon="🚗">{t('filter.section.basic')}</SectionTitle>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('filter.category')}
            </label>
            <FilterChipGroup
              options={categoryOptions}
              value={filters.category}
              onChange={(category) => patch({ category })}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t('search.fuelType')}
            </label>
            <FilterChipGroup
              options={fuelOptions}
              value={filters.fuelType}
              onChange={(fuelType) => patch({ fuelType })}
            />
          </div>
        </div>
      </section>

      {/* Extra ranges (price/year/mileage are always visible above) */}
      <section>
        <SectionTitle icon="📏">{t('filter.section.ranges')}</SectionTitle>
        <p className="mb-3 text-xs text-muted-foreground">{t('filter.rangesHint')}</p>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-border/70 bg-secondary/20 p-3 sm:p-4">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              <span aria-hidden>💰</span>
              {t('filter.section.price')} ({currency === 'GEL' ? '₾' : '$'}) — {t('search.from')} /{' '}
              {t('search.to')}
            </p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(filters.priceMin)}</span>
              <span>{formatPrice(filters.priceMax)}</span>
            </div>
            <div className="relative h-2">
              <div className="absolute inset-0 rounded-full bg-secondary" />
              <div
                className="absolute h-2 rounded-full bg-primary"
                style={{
                  left: `${(filters.priceMin / PRICE_SLIDER_MAX) * 100}%`,
                  right: `${100 - (filters.priceMax / PRICE_SLIDER_MAX) * 100}%`,
                }}
              />
              <input
                type="range"
                min={0}
                max={PRICE_SLIDER_MAX}
                step={1000}
                value={filters.priceMin}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  patch({ priceMin: Math.min(v, filters.priceMax - 1000) })
                }}
                className="pointer-events-auto absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
              <input
                type="range"
                min={0}
                max={PRICE_SLIDER_MAX}
                step={1000}
                value={filters.priceMax}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  patch({ priceMax: Math.max(v, filters.priceMin + 1000) })
                }}
                className="pointer-events-auto absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </div>

          <RangeFromTo
            icon="🔧"
            title={t('filter.engineVolume')}
            fromLabel={t('search.from')}
            toLabel={t('search.to')}
            fromValue={filters.engineVolumeMin}
            toValue={filters.engineVolumeMax}
            onFromChange={(engineVolumeMin) => patch({ engineVolumeMin, engineVolume: '' })}
            onToChange={(engineVolumeMax) => patch({ engineVolumeMax, engineVolume: '' })}
            fromPlaceholder="1.0"
            toPlaceholder="5.0"
            min={0.5}
            max={8}
            step={0.1}
            suffix="L"
          />
        </div>
      </section>

      {/* Technical */}
      <section>
        <SectionTitle icon="⚙️">{t('filter.section.technical')}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <FilterSelect
            label={`🚘 ${t('filter.body')}`}
            value={filters.bodyType}
            options={bodyOptions}
            onChange={(bodyType) => patch({ bodyType })}
          />
          <FilterSelect
            label={`⚙️ ${t('search.transmission')}`}
            value={filters.transmission}
            options={transmissionOptions}
            onChange={(transmission) => patch({ transmission })}
          />
          <FilterSelect
            label={`🛞 ${t('filter.drive')}`}
            value={filters.driveType}
            options={driveOptions}
            onChange={(driveType) => patch({ driveType })}
          />
          <FilterSelect
            label={`🎯 ${t('filter.steering')}`}
            value={filters.steering}
            options={steeringOptions}
            onChange={(steering) => patch({ steering })}
          />
          <FilterSelect
            label={t('filter.cylinders')}
            value={filters.cylinders}
            options={cylinderOptions}
            onChange={(cylinders) => patch({ cylinders })}
          />
          <FilterSelect
            label={`🚪 ${t('filter.doors')}`}
            value={filters.doors}
            options={doorOptions}
            onChange={(doors) => patch({ doors })}
          />
        </div>
      </section>

      {/* Features */}
      <section>
        <SectionTitle icon="⭐">{t('filter.section.features')}</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CAR_FEATURES.map((feature) => {
            const checked = filters.features.includes(feature)
            return (
              <label
                key={feature}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  checked
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-input bg-background text-muted-foreground hover:border-primary/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFeature(feature)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="leading-tight">
                  <span className="mr-1" aria-hidden>
                    {FEATURE_EMOJI[feature]}
                  </span>
                  {t(`filter.feature.${feature}`)}
                </span>
              </label>
            )
          })}
        </div>
      </section>

      {/* Listing type */}
      <section>
        <SectionTitle icon="📢">{t('filter.section.listingType')}</SectionTitle>
        <FilterChipGroup
          options={LISTING_TYPES.map((type) => ({
            value: type,
            label: type ? t(`filter.listing.${type}`) : t('filter.all'),
            emoji: LISTING_EMOJI[type || ''],
          }))}
          value={filters.listingType}
          onChange={(listingType) => patch({ listingType: listingType as FilterState['listingType'] })}
        />
      </section>

      {/* Import */}
      <section>
        <SectionTitle icon="🌍">{t('filter.section.import')}</SectionTitle>
        <FilterChipGroup
          options={IMPORT_REGIONS.map((region) => ({
            value: region,
            label: region ? t(`filter.import.${region}`) : t('filter.all'),
            emoji: IMPORT_EMOJI[region || ''],
          }))}
          value={filters.importRegion}
          onChange={(importRegion) => patch({ importRegion: importRegion as FilterState['importRegion'] })}
        />
      </section>

      {/* Customs */}
      <section>
        <SectionTitle icon="📄">{t('filter.section.status')}</SectionTitle>
        <FilterChipGroup
          options={CUSTOMS_STATUSES.map((status) => ({
            value: status,
            label: status ? t(`filter.customs.${status}`) : t('filter.all'),
            emoji: CUSTOMS_EMOJI[status || ''],
          }))}
          value={filters.customsStatus}
          onChange={(customsStatus) =>
            patch({ customsStatus: customsStatus as FilterState['customsStatus'] })
          }
        />
      </section>

      {/* Colors */}
      <section>
        <SectionTitle icon="🎨">{t('filter.section.colors')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {CAR_COLORS.map((color) => (
            <button
              key={color || 'all'}
              type="button"
              onClick={() => patch({ color })}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                filters.color === color
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {color && COLOR_EMOJI[color] ? (
                <span aria-hidden>{COLOR_EMOJI[color]}</span>
              ) : color ? null : (
                <span aria-hidden>🌈</span>
              )}
              {color ? t(`filter.color.${color}`) : t('filter.color.all')}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
        >
          <RotateCcw className="h-4 w-4" />
          {t('filter.clear')}
        </button>
        <p className="text-center text-sm text-muted-foreground sm:flex-1">
          <span className="font-semibold text-foreground">{resultCount}</span>{' '}
          {resultCount === 1 ? t('home.listing') : t('home.listings')} {t('home.found')}
        </p>
        <button
          type="button"
          onClick={onApply}
          className="rounded-xl bg-primary px-8 py-2.5 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          {t('filter.apply')}
        </button>
      </div>
    </div>
  )
}
