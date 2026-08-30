'use client'

import type { HeroVariant } from '@/data/hero-backgrounds'

type HeroBackgroundLayerProps = {
  variant: HeroVariant
  priority?: boolean
}

export default function HeroBackgroundLayer(_props: HeroBackgroundLayerProps) {
  return <div className="absolute inset-0 bg-white" aria-hidden />
}
