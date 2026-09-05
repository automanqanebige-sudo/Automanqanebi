'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import HeroBackgroundLayer from '@/components/HeroBackgroundLayer'
import { useLanguage } from '@/context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { SITE_LOGO_MAIN, SITE_LOGO_TLD } from '@/lib/site'
import { DEFAULT_HERO_VARIANT_ID, getHeroVariant } from '@/data/hero-backgrounds'

type HeroBannerProps = {
  children: ReactNode
}

export default function HeroBanner({ children }: HeroBannerProps) {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const [variantId, setVariantId] = useState(DEFAULT_HERO_VARIANT_ID)

  useEffect(() => {
    setVariantId(settings.heroVariantId || DEFAULT_HERO_VARIANT_ID)
  }, [settings.heroVariantId])

  const variant = getHeroVariant(variantId)
  const displayVariant = variant.image ? variant : getHeroVariant(DEFAULT_HERO_VARIANT_ID)

  return (
    <section className="relative min-h-[420px] overflow-hidden bg-background sm:min-h-[480px] lg:min-h-[520px]">
      <HeroBackgroundLayer variant={displayVariant} priority />
      <div className="hero-gradient-overlay pointer-events-none absolute inset-0" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative max-w-2xl animate-fade-up">
            <p className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {t('home.hero.tagline')}
            </p>

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              {SITE_LOGO_MAIN}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {SITE_LOGO_TLD}
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('home.hero.subtitle')}
            </p>
          </div>

          <div className="mt-8 w-full animate-fade-up sm:mt-10" style={{ animationDelay: '80ms' }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
