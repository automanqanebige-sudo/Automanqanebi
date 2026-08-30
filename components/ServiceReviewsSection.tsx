'use client'

import { useCallback, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import {
  addServiceReview,
  averageRating,
  fetchServiceReviews,
  type ServiceReview,
} from '@/lib/service-reviews-firestore'

type ServiceReviewsSectionProps = {
  serviceId: string
}

export default function ServiceReviewsSection({ serviceId }: ServiceReviewsSectionProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [reviews, setReviews] = useState<ServiceReview[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    fetchServiceReviews(serviceId).then(setReviews).catch(() => setReviews([]))
  }, [serviceId])

  useEffect(() => {
    load()
  }, [load])

  const avg = averageRating(reviews)

  const submit = async () => {
    if (!user) {
      setError(t('report.loginRequired'))
      return
    }
    setSaving(true)
    setError('')
    try {
      await addServiceReview({
        serviceId,
        userId: user.uid,
        userName: user.displayName || user.email || undefined,
        rating,
        comment: comment.trim() || undefined,
      })
      setComment('')
      setRating(5)
      load()
    } catch {
      setError(t('report.error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-foreground">{t('reviews.title')}</h2>
        {avg != null && (
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {avg} ({reviews.length})
          </p>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {reviews.length === 0 ? (
          <li className="text-sm text-muted-foreground">{t('reviews.empty')}</li>
        ) : (
          reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-border/60 bg-background px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{r.userName || t('reviews.anonymous')}</span>
                <span className="inline-flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: r.rating }, (_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
            </li>
          ))
        )}
      </ul>

      <div className="mt-5 border-t border-border pt-4">
        <p className="mb-2 text-sm font-medium text-foreground">{t('reviews.write')}</p>
        <div className="mb-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="p-0.5"
              aria-label={`${n}`}
            >
              <Star
                className={`h-6 w-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder={t('reviews.commentPlaceholder')}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <button
          type="button"
          disabled={saving}
          onClick={submit}
          className="mt-2 btn-primary rounded-xl px-4 py-2 text-sm disabled:opacity-50"
        >
          {saving ? t('auth.loading') : t('reviews.submit')}
        </button>
      </div>
    </section>
  )
}
