'use client'

import Image from 'next/image'
import type { HeroVariant } from '@/data/hero-backgrounds'
import { getImageSideClass, getOverlayClasses } from '@/data/hero-backgrounds'

type HeroBackgroundLayerProps = {
  variant: HeroVariant
  priority?: boolean
}

export default function HeroBackgroundLayer({ variant, priority = false }: HeroBackgroundLayerProps) {
  const overlay = getOverlayClasses(variant.overlay)

  return (
    <>
      {/* Always-on calm base so the hero never looks flat white */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant.cssBackground ||
            'radial-gradient(ellipse 90% 70% at 75% 15%, hsl(152 38% 93%) 0%, transparent 55%), linear-gradient(165deg, hsl(150 30% 97%) 0%, hsl(160 20% 94%) 50%, hsl(210 18% 96%) 100%)',
        }}
        aria-hidden
      />

      {variant.image && (
        <div className="absolute inset-0" aria-hidden>
          <div className={getImageSideClass(variant.imageSide)}>
            <Image
              src={variant.image}
              alt=""
              fill
              priority={priority}
              className="object-cover"
              style={{
                objectPosition: variant.objectPosition ?? 'center',
                opacity: variant.imageOpacity ?? 0.35,
              }}
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Soft readability scrim — not solid white */}
      <div className={`absolute inset-0 bg-gradient-to-r ${overlay}`} aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/10"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,hsl(var(--primary)/0.10),transparent_55%)]"
        aria-hidden
      />
      {/* Quiet mesh texture */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-soft-light dark:opacity-20"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px',
        }}
        aria-hidden
      />
    </>
  )
}
