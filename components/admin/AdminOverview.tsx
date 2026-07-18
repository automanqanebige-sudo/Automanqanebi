'use client'

import Link from 'next/link'
import {
  Car,
  Crown,
  ExternalLink,
  Home,
  Megaphone,
  MessageCircle,
  Settings,
  Users,
  Wrench,
  BarChart3,
  LayoutTemplate,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type AdminOverviewProps = {
  stats: {
    cars: number
    services: number
    ads: number
    vip: number
    users: number
    reports?: number
  }
  onNavigate: (tab: string) => void
}

const quickPages = [
  { href: '/', icon: Home, key: 'nav.home' },
  { href: '/services', icon: Wrench, key: 'nav.services' },
  { href: '/add-car', icon: Car, key: 'nav.addCar' },
  { href: '/services/add', icon: Wrench, key: 'services.addService' },
  { href: '/chat', icon: MessageCircle, key: 'nav.chat' },
  { href: '/about', icon: ExternalLink, key: 'footer.about' },
]

export default function AdminOverview({ stats, onNavigate }: AdminOverviewProps) {
  const { t } = useLanguage()

  const manageCards = [
    { id: 'analytics', icon: BarChart3, label: t('admin.tabAnalytics'), count: null, color: 'text-primary' },
    { id: 'banners', icon: LayoutTemplate, label: t('admin.tabBanners'), count: null, color: 'text-primary' },
    { id: 'cars', icon: Car, label: t('admin.tabCars'), count: stats.cars, color: 'text-foreground' },
    { id: 'services', icon: Wrench, label: t('admin.tabServices'), count: stats.services, color: 'text-foreground' },
    { id: 'ads', icon: Megaphone, label: t('admin.tabAds'), count: stats.ads, color: 'text-primary' },
    { id: 'reports', icon: Megaphone, label: t('admin.tabReports'), count: stats.reports ?? null, color: 'text-destructive' },
    { id: 'users', icon: Users, label: t('admin.tabUsers'), count: stats.users, color: 'text-foreground' },
    { id: 'settings', icon: Settings, label: t('admin.tabSettings'), count: null, color: 'text-foreground' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">{t('admin.overviewManage')}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {manageCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate(card.id)}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/30"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{card.label}</p>
                {card.count != null && (
                  <p className="text-sm text-muted-foreground">{card.count}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">{t('admin.overviewQuickLinks')}</h2>
        <div className="flex flex-wrap gap-2">
          {quickPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-secondary"
            >
              <page.icon className="h-4 w-4 text-primary" />
              {t(page.key)}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Crown className="h-4 w-4 text-primary" />
          {t('admin.overviewVipHint')} — {stats.vip} VIP
        </p>
      </div>

      <button
        type="button"
        onClick={() => onNavigate('analytics')}
        className="flex w-full items-center justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-card p-5 text-left transition-colors hover:border-primary/50"
      >
        <div>
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('admin.analytics.title')}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t('admin.analytics.subtitle')}</p>
        </div>
        <span className="text-sm font-medium text-primary">{t('admin.analytics.open')}</span>
      </button>
    </div>
  )
}
