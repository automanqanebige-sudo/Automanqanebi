'use client'

import { useState } from 'react'
import Image from 'next/image'
import { carBrands, TOP_BRAND_NAMES } from '@/data/car-brands'
import { useLanguage } from '@/context/LanguageContext'

type PopularBrandsSectionProps = {
  selectedBrand?: string
  onBrandSelect: (brand: string) => void
}

function BrandLogo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
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
      className="h-10 w-10 object-contain sm:h-11 sm:w-11"
      onError={() => setFailed(true)}
      unoptimized
    />
  )
}

export default function PopularBrandsSection({
  selectedBrand = '',
  onBrandSelect,
}: PopularBrandsSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="section-padding border-y border-border/60 bg-surface/50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('home.brands.title')}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {t('home.brands.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-10">
          {TOP_BRAND_NAMES.map((brand) => {
            const item = carBrands.find((b) => b.brand === brand)
            if (!item) return null
            const selected = selectedBrand === brand

            return (
              <button
                key={brand}
                type="button"
                onClick={() => onBrandSelect(selected ? '' : brand)}
                aria-pressed={selected}
                className={`group flex min-w-0 flex-col items-center gap-1.5 rounded-xl p-1.5 transition-all duration-250 sm:gap-2 sm:p-2 ${
                  selected
                    ? 'bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'hover:-translate-y-0.5'
                }`}
              >
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border bg-card p-2 shadow-card transition-shadow group-hover:shadow-card-hover sm:p-2.5">
                  <BrandLogo src={item.logo} alt={item.brand} />
                </div>
                <span className="w-full truncate text-center text-[10px] font-medium text-foreground sm:text-xs">
                  {item.brand}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
