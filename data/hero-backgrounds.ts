export type HeroOverlay = 'soft-left' | 'calm-dark' | 'mint-wash' | 'warm-left' | 'market-full'

export type HeroVariant = {
  id: string
  nameKa: string
  nameEn: string
  tagKa: string
  /** Unsplash URL — omit for CSS-only (fastest) */
  image?: string
  objectPosition?: string
  imageOpacity?: number
  imageSide?: 'full' | 'right' | 'center'
  overlay: HeroOverlay
  /** Pure CSS background — no network image */
  cssBackground?: string
}

export const HERO_VARIANTS: HeroVariant[] = [
  {
    id: '00-calm-atmosphere',
    nameKa: 'წყნარი ატმოსფერო',
    nameEn: 'Calm atmosphere',
    tagKa: 'რბილი · ყოველთვის',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=75&auto=format&fit=crop',
    objectPosition: 'center 40%',
    imageOpacity: 0.32,
    imageSide: 'full',
    overlay: 'mint-wash',
    cssBackground:
      'radial-gradient(ellipse 90% 70% at 70% 20%, hsl(152 40% 92%) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 10% 80%, hsl(200 30% 94%) 0%, transparent 50%), linear-gradient(160deg, hsl(150 28% 97%) 0%, hsl(160 22% 94%) 45%, hsl(210 20% 95%) 100%)',
  },
  {
    id: '01-soft-mint',
    nameKa: 'რბილი მწვანე',
    nameEn: 'Soft mint',
    tagKa: 'CSS · უსწრაფესი',
    overlay: 'mint-wash',
    cssBackground:
      'linear-gradient(135deg, hsl(152 35% 96%) 0%, hsl(160 25% 92%) 40%, hsl(200 20% 94%) 100%)',
  },
  {
    id: '02-slate-calm',
    nameKa: 'მშვიდი slate',
    nameEn: 'Calm slate',
    tagKa: 'CSS · მინიმალური',
    overlay: 'soft-left',
    cssBackground:
      'linear-gradient(160deg, hsl(220 15% 97%) 0%, hsl(210 12% 93%) 50%, hsl(200 18% 90%) 100%)',
  },
  {
    id: '03-dawn-road',
    nameKa: 'განთიადის გზა',
    nameEn: 'Dawn road',
    tagKa: 'CSS · თბილი',
    overlay: 'warm-left',
    cssBackground:
      'linear-gradient(120deg, hsl(40 30% 97%) 0%, hsl(35 25% 94%) 45%, hsl(200 15% 92%) 100%)',
  },
  {
    id: '04-highway-haze',
    nameKa: 'მოჩვენილი გზა',
    nameEn: 'Highway haze',
    tagKa: 'გზა · ბუნდოვანი',
    image:
      'https://images.unsplash.com/photo-1449824913935-59fcbbcf87df?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center 60%',
    imageOpacity: 0.45,
    imageSide: 'right',
    overlay: 'soft-left',
  },
  {
    id: '05-golden-hour',
    nameKa: 'ოქროს საათი',
    nameEn: 'Golden hour',
    tagKa: 'გზა · თბილი',
    image:
      'https://images.unsplash.com/photo-1502877338535-76689314791a?w=1280&q=70&auto=format&fit=crop',
    objectPosition: '70% center',
    imageOpacity: 0.5,
    imageSide: 'right',
    overlay: 'warm-left',
  },
  {
    id: '06-showroom',
    nameKa: 'შოურუმი',
    nameEn: 'Showroom',
    tagKa: 'სალონი · სუფთა',
    image:
      'https://images.unsplash.com/photo-1614200171426-5d9243075a41?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.4,
    imageSide: 'right',
    overlay: 'soft-left',
  },
  {
    id: '07-coastal',
    nameKa: 'სანაპირო',
    nameEn: 'Coastal drive',
    tagKa: 'ზღვა · მშვიდი',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.42,
    imageSide: 'right',
    overlay: 'calm-dark',
  },
  {
    id: '08-forest-pass',
    nameKa: 'ტყის გზა',
    nameEn: 'Forest pass',
    tagKa: 'ბუნება · zen',
    image:
      'https://images.unsplash.com/photo-1471478334189-cfc5fa962ee9?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.38,
    imageSide: 'right',
    overlay: 'mint-wash',
  },
  {
    id: '09-night-bokeh',
    nameKa: 'ღამის bokeh',
    nameEn: 'Night bokeh',
    tagKa: 'ქალაქი · რბილი',
    image:
      'https://images.unsplash.com/photo-1449965403367-db82e824a346?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.35,
    imageSide: 'full',
    overlay: 'calm-dark',
  },
  {
    id: '10-dashboard',
    nameKa: 'სალონის განათება',
    nameEn: 'Cabin glow',
    tagKa: 'ინტერიერი',
    image:
      'https://images.unsplash.com/photo-1489820270587-247103064f96?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.32,
    imageSide: 'right',
    overlay: 'soft-left',
  },
  {
    id: '11-classic',
    nameKa: 'კლასიკა',
    nameEn: 'Classic calm',
    tagKa: 'კლასიკა · რბილი',
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1280&q=70&auto=format&fit=crop',
    objectPosition: '75% center',
    imageOpacity: 0.45,
    imageSide: 'right',
    overlay: 'warm-left',
  },
  {
    id: '12-mountain',
    nameKa: 'მთის გზა',
    nameEn: 'Mountain road',
    tagKa: 'პეიზაჟ · ღია',
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center 40%',
    imageOpacity: 0.4,
    imageSide: 'right',
    overlay: 'soft-left',
  },
  {
    id: '21-car-market',
    nameKa: 'ავტობაზარი',
    nameEn: 'Car market lot',
    tagKa: 'ბევრი მანქანა · ფონი',
    image:
      'https://images.unsplash.com/photo-1502877338535-766e14526811?w=1920&q=80&auto=format&fit=crop',
    objectPosition: 'center 45%',
    imageOpacity: 0.72,
    imageSide: 'full',
    overlay: 'market-full',
  },
  {
    id: '22-parking-rows',
    nameKa: 'ავტოფარეხი',
    nameEn: 'Parking rows',
    tagKa: 'რიგები · marketplace',
    image:
      'https://images.unsplash.com/photo-1527786350823-909fcde09065?w=1600&q=75&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.52,
    imageSide: 'full',
    overlay: 'soft-left',
  },
  {
    id: '13-aerial-lot',
    nameKa: 'ავტოფარეხი ზემოთ',
    nameEn: 'Aerial lot',
    tagKa: 'ბიზნეს · შესაბამისი',
    image:
      'https://images.unsplash.com/photo-1527786350823-909fcde09065?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.35,
    imageSide: 'full',
    overlay: 'soft-left',
  },
  {
    id: '14-tunnel-exit',
    nameKa: 'გვირაბის გასასვლელი',
    nameEn: 'Tunnel exit',
    tagKa: 'გვირაბი · სინათლე',
    image:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.38,
    imageSide: 'right',
    overlay: 'calm-dark',
  },
  {
    id: '15-silver-sedan',
    nameKa: 'მშვიდი sedan',
    nameEn: 'Calm sedan',
    tagKa: 'მანქანა · subtle',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1280&q=70&auto=format&fit=crop',
    objectPosition: '70% center',
    imageOpacity: 0.42,
    imageSide: 'right',
    overlay: 'soft-left',
  },
  {
    id: '16-ev-blue',
    nameKa: 'EV ლურჯი',
    nameEn: 'EV soft blue',
    tagKa: 'ელექტრო · modern',
    image:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.4,
    imageSide: 'right',
    overlay: 'mint-wash',
  },
  {
    id: '17-rain-calm',
    nameKa: 'წვიმის შემდეგ',
    nameEn: 'After rain',
    tagKa: 'ნესტი · reflective',
    image:
      'https://images.unsplash.com/photo-1429962719433-59d514587827?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.36,
    imageSide: 'right',
    overlay: 'calm-dark',
  },
  {
    id: '18-open-desert',
    nameKa: 'ღია ჰორიზონტი',
    nameEn: 'Open horizon',
    tagKa: 'გზა · ჰაერი',
    image:
      'https://images.unsplash.com/photo-1493238792010-8113da0277de?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.4,
    imageSide: 'full',
    overlay: 'warm-left',
  },
  {
    id: '19-luxury-wait',
    nameKa: 'Premium lounge',
    nameEn: 'Premium lounge',
    tagKa: 'comfort · quiet',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1280&q=70&auto=format&fit=crop',
    objectPosition: 'center',
    imageOpacity: 0.38,
    imageSide: 'right',
    overlay: 'soft-left',
  },
  {
    id: '20-ferrari-fade',
    nameKa: 'სპორტი · faded',
    nameEn: 'Sport · faded',
    tagKa: 'supercar · subtle',
    image:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9c?w=1280&q=70&auto=format&fit=crop',
    objectPosition: '70% 35%',
    imageOpacity: 0.38,
    imageSide: 'right',
    overlay: 'calm-dark',
  },
]

export const DEFAULT_HERO_VARIANT_ID = '00-calm-atmosphere'

export const HERO_STORAGE_KEY = 'hero-variant-id'

export function getHeroVariant(id: string | null | undefined): HeroVariant {
  return (
    HERO_VARIANTS.find((v) => v.id === id) ??
    HERO_VARIANTS.find((v) => v.id === DEFAULT_HERO_VARIANT_ID) ??
    HERO_VARIANTS[0]
  )
}

export function getOverlayClasses(overlay: HeroOverlay): string {
  switch (overlay) {
    case 'market-full':
      return 'from-background/55 via-background/30 to-transparent sm:from-background/70 sm:via-background/40 sm:to-transparent'
    case 'soft-left':
      return 'from-background/70 via-background/45 to-transparent sm:from-background/80 sm:via-background/50 sm:to-transparent'
    case 'calm-dark':
      return 'from-background/75 via-background/50 to-background/20 sm:from-background/85 sm:via-background/55 sm:to-transparent'
    case 'mint-wash':
      return 'from-background/50 via-primary/[0.04] to-transparent sm:from-background/60 sm:via-background/25 sm:to-transparent'
    case 'warm-left':
      return 'from-background/70 via-amber-500/5 to-transparent sm:from-background/80 sm:via-background/45 sm:to-transparent'
    default:
      return 'from-background/60 via-background/35 to-transparent'
  }
}

export function getImageSideClass(side: HeroVariant['imageSide']): string {
  if (side === 'right') return 'absolute inset-0 lg:left-[36%]'
  if (side === 'center') return 'absolute inset-0 lg:left-[25%] lg:right-[10%]'
  return 'absolute inset-0'
}
