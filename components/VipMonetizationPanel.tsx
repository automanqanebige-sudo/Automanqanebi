'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, Crown, Loader2, Smartphone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { saveUserProfile } from '@/lib/user-profile-firestore'
import { requestChatPushPermission } from '@/lib/fcm-client'
import PhoneOtpVerify from '@/components/auth/PhoneOtpVerify'
import { createPaymentOrder, paymentsProvider, VIP_TIER_OPTIONS, type VipTierId } from '@/lib/payments'

type ListingOption = {
  id: string
  label: string
}

type VipMonetizationPanelProps = {
  carId?: string
  listings?: ListingOption[]
  onRenewed?: () => void
}

export default function VipMonetizationPanel({
  carId: initialCarId,
  listings = [],
  onRenewed,
}: VipMonetizationPanelProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const isStub = paymentsProvider() === 'stub'

  const options = useMemo(() => {
    if (listings.length > 0) return listings
    if (initialCarId) return [{ id: initialCarId, label: initialCarId }]
    return []
  }, [listings, initialCarId])

  const [tier, setTier] = useState<VipTierId>('gold')
  const [selectedCarId, setSelectedCarId] = useState(initialCarId || options[0]?.id || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pushStatus, setPushStatus] = useState('')

  const selectedTier = VIP_TIER_OPTIONS.find((p) => p.id === tier) || VIP_TIER_OPTIONS[1]

  const startCheckout = async () => {
    if (!user || !selectedCarId) return
    setBusy(true)
    setError(null)
    try {
      const data = await createPaymentOrder({
        kind: 'vip',
        carId: selectedCarId,
        userId: user.uid,
        tier,
      })
      await saveUserProfile(user.uid, {
        lastVipTier: tier,
        lastVipPaymentStatus: 'pending',
      })
      onRenewed?.()
      router.push(data.checkoutUrl)
    } catch {
      setError(t('vip.checkoutError'))
    } finally {
      setBusy(false)
    }
  }

  const enablePush = async () => {
    const res = await requestChatPushPermission()
    setPushStatus(res.messageKey)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Crown className="h-5 w-5 text-primary" />
              {t('vip.packagesTitle')}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('vip.packagesSubtitle')}</p>
          </div>
          {isStub && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
              {t('vip.demoBadge')}
            </span>
          )}
        </div>

        {options.length > 1 && (
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('vip.selectListing')}
            </span>
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
            >
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {VIP_TIER_OPTIONS.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setTier(pkg.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                tier === pkg.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'
              }`}
            >
              <p className="font-semibold text-foreground">{t(`filter.listing.${pkg.id}`)}</p>
              <p className="mt-1 text-2xl font-bold text-primary">{pkg.price}₾</p>
              <p className="text-xs text-muted-foreground">
                {pkg.days} {t('vip.days')}
              </p>
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                {t(`vip.benefit.${pkg.id}`)}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border/80 bg-secondary/30 px-4 py-3">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{t('vip.summary')}</span>
            {': '}
            {t(`filter.listing.${selectedTier.id}`)} —{' '}
            <span className="font-bold text-primary">{selectedTier.price}₾</span>
            {' · '}
            {selectedTier.days} {t('vip.days')}
          </p>
        </div>

        {selectedCarId ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void startCheckout()}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {t('vip.goToCheckout')}
          </button>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{t('vip.selectListingHint')}</p>
        )}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Smartphone className="h-5 w-5 text-primary" />
          {t('phoneOtp.title')}
        </h3>
        <PhoneOtpVerify />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Bell className="h-5 w-5 text-primary" />
          {t('push.title')}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('push.subtitle')}</p>
        <button
          type="button"
          onClick={() => void enablePush()}
          className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          {t('push.enable')}
        </button>
        {pushStatus && <p className="mt-2 text-sm text-muted-foreground">{t(pushStatus)}</p>}
      </section>
    </div>
  )
}
