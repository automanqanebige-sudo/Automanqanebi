'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import HeroBackgroundLayer from '@/components/HeroBackgroundLayer'
import { useLanguage } from '@/context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { SITE_LOGO_MAIN, SITE_LOGO_TLD } from '@/lib/site'
import {
  DEFAULT_HERO_VARIANT_ID,
  getHeroVariant,
} from '@/data/hero-backgrounds'

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
    <section className="relative min-h-[460px] overflow-hidden bg-white sm:min-h-[500px]">
      <HeroBackgroundLayer variant={displayVariant} priority />

      <div className="relative px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="relative max-w-2xl">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm sm:text-5xl lg:text-6xl">
              {SITE_LOGO_MAIN}
              <span className="text-primary">{SITE_LOGO_TLD}</span>
            </h1>

            <p className="relative mt-3 text-xl font-semibold text-foreground/90 sm:text-2xl">
              {t('home.hero.tagline')}
            </p>

            <p className="relative mt-3 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('home.hero.subtitle')}
            </p>
          </div>

          <div className="mt-7 w-full sm:mt-9">{children}</div>
        </div>
      </div>
    </section>
  )
}
