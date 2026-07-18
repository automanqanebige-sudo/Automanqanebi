'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import HeroBackgroundLayer from '@/components/HeroBackgroundLayer'
import { useLanguage } from '@/context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { SITE_DOMAIN } from '@/lib/site'
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
    <section className="relative min-h-[480px] overflow-hidden sm:min-h-[520px]">
      <HeroBackgroundLayer variant={displayVariant} priority />

      <div className="relative px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative max-w-xl lg:max-w-2xl">
            <div
              className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 rounded-3xl bg-background/55 shadow-[0_0_60px_rgba(255,255,255,0.35)] backdrop-blur-[2px] sm:-inset-x-6 sm:-inset-y-8 dark:bg-background/50"
              aria-hidden
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/75 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {SITE_DOMAIN}
            </span>

            <h1 className="relative mt-4 text-balance text-3xl font-bold tracking-tight text-foreground drop-shadow-sm sm:text-4xl lg:text-5xl">
              {t('home.hero.title')}
            </h1>

            <p className="relative mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('home.hero.subtitle')}
            </p>
          </div>

          <div className="mt-8 w-full sm:mt-10">{children}</div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" aria-hidden />
    </section>
  )
}
