'use client'

import { useState } from 'react'
import { Bell, Crown, Smartphone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { saveUserProfile } from '@/lib/user-profile-firestore'
import { requestChatPushPermission } from '@/lib/fcm-client'
import PhoneOtpVerify from '@/components/auth/PhoneOtpVerify'
import { createAndMaybeFulfillPayment } from '@/lib/payments'

const VIP_TIERS = [
  { id: 'silver', days: 30, price: 29 },
  { id: 'gold', days: 30, price: 49 },
  { id: 'platinum', days: 30, price: 79 },
] as const

type VipMonetizationPanelProps = {
  carId?: string
  onRenewed?: () => void
}

export default function VipMonetizationPanel({ carId, onRenewed }: VipMonetizationPanelProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [tier, setTier] = useState<(typeof VIP_TIERS)[number]['id']>('gold')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'paid'>('idle')
  const [pushStatus, setPushStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const purchase = async () => {
    if (!user || !carId) return
    setBusy(true)
    setPaymentStatus('pending')
    try {
      const data = await createAndMaybeFulfillPayment({
        kind: 'vip',
        carId,
        userId: user.uid,
        tier,
      })
      setPaymentStatus(data.status === 'paid' ? 'paid' : 'pending')
      await saveUserProfile(user.uid, {
        lastVipTier: tier,
        lastVipPaymentStatus: data.status === 'paid' ? 'paid' : 'pending',
      })
      if (data.status === 'paid') onRenewed?.()
    } catch {
      setPaymentStatus('idle')
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
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Crown className="h-5 w-5 text-primary" />
          {t('vip.packagesTitle')}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('vip.packagesSubtitle')}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {VIP_TIERS.map((pkg) => (
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
            </button>
          ))}
        </div>
        {carId ? (
          <button
            type="button"
            disabled={busy || paymentStatus === 'paid'}
            onClick={purchase}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {paymentStatus === 'paid'
              ? t('vip.paid')
              : paymentStatus === 'pending'
                ? t('vip.pending')
                : t('vip.buyStub')}
          </button>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{t('vip.selectListingHint')}</p>
        )}
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
          onClick={enablePush}
          className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          {t('push.enable')}
        </button>
        {pushStatus && <p className="mt-2 text-sm text-muted-foreground">{t(pushStatus)}</p>}
      </section>
    </div>
  )
}
