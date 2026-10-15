// SlotUrSelf Service Worker for Offline Token Pass & Fast Caching
const CACHE_NAME = 'sloturself-v1'
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Cache static assets and receipt pages for offline clinic pass presentation
  if (url.pathname.startsWith('/receipt/') || url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(event.request)
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone())
          }
          return networkResponse
        } catch (err) {
          const cachedResponse = await cache.match(event.request)
          if (cachedResponse) return cachedResponse
          throw err
        }
      })
    )
    return
  }

  // Network-first with cache fallback for other routes
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
