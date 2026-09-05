/* eslint-disable no-undef */
/**
 * Firebase Cloud Messaging service worker.
 * For full FCM, inject firebaseConfig matching your web app.
 */
self.addEventListener('push', (event) => {
  let title = 'automanqanebi.ge'
  let body = ''
  let url = '/chat'
  try {
    const data = event.data ? event.data.json() : {}
    title = data.notification?.title || data.title || title
    body = data.notification?.body || data.body || ''
    url = data.data?.url || data.url || url
  } catch {
    body = event.data ? event.data.text() : ''
  }
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/logo.png',
      badge: '/logo.png',
      data: { url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/chat'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
