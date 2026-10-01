'use client'

import { useMemo, useState } from 'react'
import {
  Check,
  Copy,
  Facebook,
  Link2,
  MessageCircle,
  Share2,
  Send,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { logAnalyticsEvent } from '@/lib/analytics-firestore'
import { SITE_URL } from '@/lib/site'

export type ShareListingPayload = {
  url: string
  title: string
  text: string
  /** Absolute image URL for platforms that support it via OG (already in page meta) */
  imageUrl?: string
}

type ShareListingButtonProps = {
  payload: ShareListingPayload
  className?: string
  compact?: boolean
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  if (typeof window !== 'undefined') {
    return new URL(pathOrUrl, window.location.origin).toString()
  }
  return new URL(pathOrUrl, SITE_URL).toString()
}

export default function ShareListingButton({
  payload,
  className = '',
  compact = false,
}: ShareListingButtonProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = useMemo(() => absoluteUrl(payload.url), [payload.url])
  const shareText = useMemo(
    () => `${payload.title}\n${payload.text}`.trim(),
    [payload.title, payload.text]
  )

  const trackShare = (channel: string) => {
    void logAnalyticsEvent(
      'listing_share',
      { channel, url: shareUrl.slice(0, 200) },
      user?.uid
    )
  }

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(shareText)
  const encodedTitle = encodeURIComponent(payload.title)

  const platforms = [
    {
      key: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      color: 'hover:bg-[#1877F2]/15 hover:text-[#1877F2]',
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      icon: MessageCircle,
      color: 'hover:bg-[#25D366]/15 hover:text-[#128C7E]',
    },
    {
      key: 'telegram',
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: Send,
      color: 'hover:bg-[#229ED9]/15 hover:text-[#229ED9]',
    },
    {
      key: 'x',
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Share2,
      color: 'hover:bg-foreground/10 hover:text-foreground',
    },
    {
      key: 'viber',
      label: 'Viber',
      href: `viber://forward?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      icon: MessageCircle,
      color: 'hover:bg-[#7360F2]/15 hover:text-[#7360F2]',
    },
  ] as const

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: shareUrl,
        })
        trackShare('native')
        setOpen(false)
        return
      } catch {
        /* user cancelled or unsupported — fall through to menu */
      }
    }
    setOpen((v) => !v)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      trackShare('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => void nativeShare()}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card font-medium transition-colors hover:bg-secondary ${
          compact ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-sm'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Share2 className="h-4 w-4 text-primary" />
        {t('share.button')}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label={t('share.close')}
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          >
            <p className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('share.title')}
            </p>
            <ul className="p-1.5">
              {platforms.map((p) => (
                <li key={p.key}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => {
                      trackShare(p.key)
                      setOpen(false)
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors ${p.color}`}
                  >
                    <p.icon className="h-4 w-4 shrink-0" />
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void copyLink()}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  {copied ? (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4 shrink-0" />
                  )}
                  {copied ? t('share.copied') : t('share.copy')}
                </button>
              </li>
              <li>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  <Link2 className="h-4 w-4 shrink-0" />
                  {t('share.open')}
                </a>
              </li>
            </ul>
            <p className="border-t border-border px-3 py-2 text-[11px] leading-snug text-muted-foreground">
              {t('share.hint')}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
