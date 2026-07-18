'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Bell, MessageCircle, Send } from 'lucide-react'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import {
  fetchMessages,
  fetchUserConversations,
  getOrCreateConversation,
  sendMessage,
  type ChatMessage,
  type Conversation,
} from '@/lib/chat-firestore'
import { fetchFirestoreCarById } from '@/lib/cars-firestore'
import { isFirebaseConfigured } from '@/lib/firebase'

function ChatContent() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [pushMsg, setPushMsg] = useState('')

  const enablePush = async () => {
    const { requestChatPushPermission } = await import('@/lib/fcm-client')
    const res = await requestChatPushPermission()
    setPushMsg(t(res.messageKey))
  }

  const loadConversations = useCallback(async () => {
    if (!user) return
    const list = await fetchUserConversations(user.uid)
    setConversations(list)
    return list
  }, [user])

  const loadMessages = useCallback(async (conversationId: string) => {
    const list = await fetchMessages(conversationId)
    setMessages(list)
  }, [])

  useEffect(() => {
    if (!user || !isFirebaseConfigured()) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function init() {
      const list = await loadConversations()
      if (cancelled) return

      const carId = searchParams.get('car')
      const sellerId = searchParams.get('seller')

      if (carId && sellerId && sellerId !== user.uid) {
        const car = await fetchFirestoreCarById(carId)
        const carTitle = car ? `${car.year} ${car.brand} ${car.model}` : carId
        const convId = await getOrCreateConversation(user.uid, sellerId, carId, carTitle)
        if (!cancelled) {
          const refreshed = await loadConversations()
          setActiveId(convId)
          await loadMessages(convId)
          if (!refreshed?.find((c) => c.id === convId)) {
            setConversations((prev) => [
              {
                id: convId,
                participants: [user.uid, sellerId],
                buyerId: user.uid,
                sellerId,
                carId,
                carTitle,
                lastMessage: '',
                updatedAt: new Date().toISOString(),
              },
              ...prev,
            ])
          }
          router.replace('/chat')
        }
      } else if (list && list.length > 0) {
        setActiveId(list[0].id)
        await loadMessages(list[0].id)
      }

      if (!cancelled) setLoading(false)
    }

    init()

    return () => {
      cancelled = true
    }
  }, [user, searchParams, loadConversations, loadMessages, router])

  useEffect(() => {
    if (!activeId) return

    loadMessages(activeId)
    const timer = setInterval(() => loadMessages(activeId), 4000)
    return () => clearInterval(timer)
  }, [activeId, loadMessages])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  )

  const handleSend = async () => {
    if (!user || !activeId || !draft.trim() || sending) return

    setSending(true)
    try {
      await sendMessage(activeId, user.uid, draft)
      setDraft('')
      await loadMessages(activeId)
      await loadConversations()
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  if (!isFirebaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('chat.firebaseRequired')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('car.back')}
      </Link>

      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
        <MessageCircle className="h-6 w-6 text-primary" />
        {t('nav.chat')}
      </h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={enablePush}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"
        >
          <Bell className="h-4 w-4 text-primary" />
          {t('push.enable')}
        </button>
        {pushMsg && <span className="text-xs text-muted-foreground">{pushMsg}</span>}
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t('auth.loading')}</p>
      ) : (
        <div className="grid gap-4 overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-border lg:border-b-0 lg:border-r">
            <p className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
              {t('chat.conversations')}
            </p>
            <div className="max-h-[60vh] overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted-foreground">{t('chat.noConversations')}</p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveId(conv.id)}
                    className={`w-full border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-secondary/60 ${
                      activeId === conv.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <p className="truncate text-sm font-semibold text-foreground">{conv.carTitle}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {conv.lastMessage || t('chat.noMessages')}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="flex min-h-[420px] flex-col">
            {activeConversation ? (
              <>
                <div className="border-b border-border px-4 py-3">
                  <p className="font-semibold text-foreground">{activeConversation.carTitle}</p>
                  <Link
                    href={`/car/${activeConversation.carId}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {t('profile.view')}
                  </Link>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">{t('chat.noMessages')}</p>
                  )}
                  {messages.map((msg) => {
                    const mine = msg.senderId === user?.uid
                    return (
                      <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            mine
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-2 border-t border-border p-4">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('chat.placeholder')}
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending || !draft.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {t('chat.send')}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
                {t('chat.selectConversation')}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  return (
    <RequireAuth>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
            Loading...
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </RequireAuth>
  )
}
