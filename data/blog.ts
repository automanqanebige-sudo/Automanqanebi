import type { BlogPost } from '@/types/car'

export const blogCategories = [
  { value: 'market', label: 'ბაზარი', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'review', label: 'ავტო განხილვა', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'electric', label: 'ელექტრო ავტო', color: 'bg-emerald-500/10 text-emerald-500' },
  { value: 'news', label: 'სიახლეები', color: 'bg-amber-500/10 text-amber-500' },
  { value: 'tips', label: 'რჩევები', color: 'bg-rose-500/10 text-rose-500' },
]

export const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'დოლარის კურსი 2026 წელს: რა ელის ლარს?',
    excerpt: 'ექსპერტები აანალიზებენ ლარის კურსის მოსალოდნელ ცვლილებებს და მის გავლენას ავტომობილების ბაზარზე.',
    category: 'market',
    views: 3422,
    createdAt: new Date('2026-04-12'),
    image: 'https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=800&auto=format',
  },
  {
    id: '2',
    title: 'საწვავის ფასები საქართველოში — აპრილი 2026',
    excerpt: 'მიმოხილვა საწვავის ფასების ტენდენციებზე და პროგნოზი მომავალი თვეებისთვის.',
    category: 'market',
    views: 5280,
    createdAt: new Date('2026-04-12'),
    image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&auto=format',
  },
  {
    id: '3',
    title: 'Toyota Camry vs Hyundai Sonata 2026 — რომელი ჯობია?',
    excerpt: 'დეტალური შედარება ორი პოპულარული სედანის — რომელი უფრო ღირს ყიდვად საქართველოში?',
    category: 'review',
    views: 8910,
    createdAt: new Date('2026-04-12'),
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format',
  },
  {
    id: '4',
    title: 'ელექტრომობილები საქართველოში 2026 — რეალობა თუ ოცნება?',
    excerpt: 'რამდენად მზად არის საქართველო ელექტრომობილების მასობრივი გამოყენებისთვის? ინფრასტრუქტურა და გამოწვევები.',
    category: 'electric',
    views: 12030,
    createdAt: new Date('2026-04-12'),
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format',
  },
  {
    id: '5',
    title: '10 რჩევა მანქანის ყიდვამდე',
    excerpt: 'რა უნდა გაითვალისწინოთ მეორადი მანქანის შეძენისას — ექსპერტების რეკომენდაციები.',
    category: 'tips',
    views: 6540,
    createdAt: new Date('2026-04-10'),
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format',
  },
  {
    id: '6',
    title: 'ახალი BMW M5 2026 — პირველი შთაბეჭდილებები',
    excerpt: 'ვცადეთ ახალი BMW M5 — რა შეიცვალა და ღირს თუ არა ყიდვად?',
    category: 'review',
    views: 4320,
    createdAt: new Date('2026-04-08'),
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format',
  },
]
