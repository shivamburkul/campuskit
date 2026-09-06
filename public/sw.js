// CampusKit service worker — hand-written, no build-time dependency.
//
// Strategy:
//   - App shell (a small, explicit list of routes/assets) is precached on
//     install so the site can open offline after a first visit.
//   - Same-origin navigations use network-first with a cache fallback, so
//     visitors always get fresh content when online and *something* usable
//     when offline.
//   - Static assets (Next.js's hashed /_next/static/* files, icons) use
//     cache-first since their filenames change whenever content changes.
//   - Nothing cross-origin (ads, analytics) is ever cached here.
//
// Bump CACHE_VERSION whenever APP_SHELL changes so old caches are cleared.
const CACHE_VERSION = 'campuskit-v1';
const APP_SHELL = ['/', '/tools', '/manifest.webmanifest', '/icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  const isNavigation = request.mode === 'navigate';
  const isStaticAsset = request.url.includes('/_next/static/') || request.url.includes('/icons/');

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
  }
});
