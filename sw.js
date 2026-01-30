// Service Worker — Global Time Converter PWA (offline-first)
const CACHE_SHELL = 'global-time-shell-v3';
const CACHE_API = 'global-time-api-v1';
const SHELL_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icon.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

const NAGER_ORIGIN = 'https://date.nager.at';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) => {
      return Promise.allSettled(
        SHELL_URLS.map((url) =>
          fetch(url, { mode: 'cors' }).then((res) => {
            if (res.ok) return cache.put(url, res);
          }).catch(() => {})
        )
      ).then(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_SHELL && k !== CACHE_API).map((k) => caches.delete(k)))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API: cache first from network, fallback to cache when offline
  if (url.origin === NAGER_ORIGIN && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_API).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell: cache first, then network
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      caches.match('/index.html').then((cached) => cached || fetch(event.request))
    );
    return;
  }

  if (SHELL_URLS.some((u) => url.href === u || (url.origin + url.pathname) === u)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_SHELL).then((cache) => cache.put(event.request, clone));
        return res;
      }))
    );
    return;
  }

  // Default: network first, fallback to cache for same-origin
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
