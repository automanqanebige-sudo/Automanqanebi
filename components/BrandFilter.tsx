'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { carBrands, TOP_BRAND_NAMES } from '@/data/car-brands'
import { useLanguage } from '@/context/LanguageContext'

type BrandFilterProps = {
  selectedBrand: string
  selectedModel: string
  onBrandChange: (brand: string) => void
  onModelChange: (model: string) => void
}

function BrandLogo({
  src,
  alt,
  size = 'md',
}: {
  src: string
  alt: string
  size?: 'md' | 'lg'
}) {
  const [failed, setFailed] = useState(false)
  const dims =
    size === 'lg'
      ? { img: 'h-11 w-11 sm:h-12 sm:w-12', fallback: 'text-base' }
      : { img: 'h-8 w-8', fallback: 'text-sm' }

  if (failed) {
    return (
      <span
        className={`flex h-full w-full items-center justify-center font-bold text-primary ${dims.fallback}`}
      >
        {alt.charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={48}
      className={`object-contain ${dims.img}`}
      onError={() => setFailed(true)}
      unoptimized
    />
  )
}

export default function BrandFilter({
  selectedBrand,
  selectedModel,
  onBrandChange,
  onModelChange,
}: BrandFilterProps) {
  const { t } = useLanguage()

  const sortedBrands = useMemo(
    () => [...carBrands].sort((a, b) => a.brand.localeCompare(b.brand)),
    []
  )

  const models = carBrands.find((b) => b.brand === selectedBrand)?.models ?? []

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5 lg:p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">{t('search.topBrands')}</h3>

      <div className="mb-6 grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-1.5 lg:gap-2">
        {TOP_BRAND_NAMES.map((brand) => {
          const item = carBrands.find((b) => b.brand === brand)
          if (!item) return null

          const selected = selectedBrand === brand

          return (
            <button
              key={brand}
              type="button"
              onClick={() => {
                onBrandChange(selected ? '' : brand)
              }}
              className={`flex w-full min-w-0 flex-col items-center gap-1 rounded-xl p-1 transition-all hover:-translate-y-0.5 sm:gap-1.5 sm:p-1.5 ${
                selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
              }`}
              aria-pressed={selected}
            >
              <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border bg-surface p-2 shadow-sm sm:p-2.5 lg:p-3">
                <BrandLogo src={item.logo} alt={item.brand} size="lg" />
              </div>
              <span className="w-full truncate text-center text-[9px] font-medium leading-tight text-foreground sm:text-[10px] lg:text-[11px]">
                {item.brand}
              </span>
            </button>
          )
        })}
      </div>

      <select
        value={selectedBrand}
        onChange={(e) => {
          onBrandChange(e.target.value)
        }}
        className="select-premium mb-4"
      >
        <option value="">{t('search.selectBrand')}</option>
        {sortedBrands.map((brand) => (
          <option key={brand.brand} value={brand.brand}>
            {brand.brand}
          </option>
        ))}
      </select>

      {selectedBrand && (
        <>
          <h3 className="mb-2 text-sm font-semibold text-foreground">{t('search.model')}</h3>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="select-premium"
          >
            <option value="">{t('search.selectModel')}</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  )
}
