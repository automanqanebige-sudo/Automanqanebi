'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import {
  fetchUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type UserNotification,
} from '@/lib/notifications-firestore'
import { isFirebaseConfigured } from '@/lib/firebase'

export default function NotificationBell() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<UserNotification[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

  const unread = items.filter((n) => !n.read).length

  const load = useCallback(async () => {
    if (!user || !isFirebaseConfigured()) return
    const list = await fetchUserNotifications(user.uid)
    setItems(list)
  }, [user])

  useEffect(() => {
    void load()
    const id = setInterval(() => void load(), 60000)
    return () => clearInterval(id)
  }, [load])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          void load()
        }}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        title={t('notifications.title')}
        aria-label={t('notifications.title')}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-[60] mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="text-sm font-semibold text-foreground">{t('notifications.title')}</p>
            {unread > 0 && (
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={async () => {
                  if (!user) return
                  await markAllNotificationsRead(user.uid)
                  await load()
                }}
              >
                {t('notifications.markAll')}
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {t('notifications.empty')}
              </p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={n.url || '/profile'}
                  onClick={async () => {
                    if (!user) return
                    if (!n.read) await markNotificationRead(user.uid, n.id)
                    setOpen(false)
                  }}
                  className={`block border-b border-border/60 px-3 py-2.5 hover:bg-secondary/60 ${
                    n.read ? 'opacity-70' : 'bg-primary/5'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
