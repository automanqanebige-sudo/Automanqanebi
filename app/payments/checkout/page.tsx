'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Crown, Loader2, ArrowUp } from 'lucide-react'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import {
  confirmOwnPayment,
  fetchPaymentOrder,
  type PaymentOrder,
} from '@/lib/payments'
import { saveUserProfile } from '@/lib/user-profile-firestore'
import { addDays } from '@/lib/listing-lifecycle'

function CheckoutInner() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''

  const [order, setOrder] = useState<PaymentOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!orderId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPaymentOrder(orderId)
      setOrder(data)
    } catch {
      setError(t('vip.checkoutError'))
    } finally {
      setLoading(false)
    }
  }, [orderId, t])

  useEffect(() => {
    void load()
  }, [load])

  const confirmPay = async () => {
    if (!user || !orderId) return
    setPaying(true)
    setError(null)
    try {
      const paid = await confirmOwnPayment(orderId, user.uid)
      if (!paid || paid.status !== 'paid') {
        setError(t('vip.checkoutError'))
        return
      }
      setOrder(paid)
      await saveUserProfile(user.uid, {
        lastVipPaymentStatus: 'paid',
        ...(paid.tier ? { lastVipTier: paid.tier } : {}),
      })
    } catch {
      setError(t('vip.checkoutError'))
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('auth.loading')}
      </div>
    )
  }

  if (!orderId || !order) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t('vip.orderNotFound')}</p>
        <Link href="/profile" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          {t('vip.backToProfile')}
        </Link>
      </div>
    )
  }

  if (user && order.userId !== user.uid) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center">
        <p className="text-destructive">{t('vip.notYourOrder')}</p>
        <Link href="/profile" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          {t('vip.backToProfile')}
        </Link>
      </div>
    )
  }

  const isPaid = order.status === 'paid'
  const expiresHint = addDays(new Date(), 30).toLocaleDateString('ka-GE')
  const Icon = order.kind === 'bump' ? ArrowUp : Crown

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Icon className="h-7 w-7 text-primary" />
          {t('vip.checkoutTitle')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('vip.checkoutSubtitle')}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        {order.provider === 'stub' && !isPaid && (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-100">
            {t('vip.demoCheckoutHint')}
          </p>
        )}

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t('vip.orderType')}</dt>
            <dd className="font-medium text-foreground">
              {order.kind === 'vip'
                ? `${t('vip.packagesTitle')}${order.tier ? ` · ${t(`filter.listing.${order.tier}`)}` : ''}`
                : t('profile.bump')}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t('vip.amount')}</dt>
            <dd className="text-xl font-bold text-primary">{order.amountGel}₾</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t('vip.orderStatus')}</dt>
            <dd className="font-medium text-foreground">
              {isPaid ? t('vip.paid') : t('vip.pending')}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t('vip.orderId')}</dt>
            <dd className="truncate font-mono text-xs text-muted-foreground">{order.id}</dd>
          </div>
        </dl>

        {isPaid ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-foreground">{t('vip.successTitle')}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.kind === 'vip'
                    ? t('vip.successVip').replace('{date}', expiresHint)
                    : t('vip.successBump')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/car/${order.carId}`}
                className="btn-primary rounded-xl px-4 py-2.5 text-sm"
              >
                {t('vip.viewListing')}
              </Link>
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                {t('vip.backToProfile')}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {order.provider === 'stub' ? (
              <button
                type="button"
                disabled={paying}
                onClick={() => void confirmPay()}
                className="btn-primary flex w-full rounded-xl px-5 py-3 text-sm disabled:opacity-50"
              >
                {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t('vip.confirmPay').replace('{amount}', String(order.amountGel))}
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">{t('vip.waitingBank')}</p>
            )}
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary"
            >
              {t('vip.cancelCheckout')}
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}

export default function PaymentCheckoutPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-6xl section-padding">
        <Suspense
          fallback={
            <div className="skeleton-shimmer mx-auto max-w-lg rounded-2xl p-8" style={{ minHeight: 280 }} />
          }
        >
          <CheckoutInner />
        </Suspense>
      </div>
    </RequireAuth>
  )
}
