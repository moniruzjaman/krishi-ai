/**
 * Krishi AI — Service Worker (v4)
 *
 * Caching strategy
 *   • Navigations  → network-first, fall back to the cached app shell
 *                    so the app opens offline.
 *   • `_next/static`→ cache-first. Next.js content-hashes these files, so
 *                    they are immutable and safe to serve from cache.
 *   • RSC payloads → network-first with cache fallback (App Router uses
 *                    `?_rsc=` query params for client-side navigation).
 *   • API routes   → network-first, cached response as offline fallback.
 *   • Images       → stale-while-revalidate.
 *   • Everything else → stale-while-revalidate.
 */

const VERSION = 'krishi-ai-v4';
const SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const IMAGE_CACHE = `${VERSION}-images`;
const API_CACHE = `${VERSION}-api`;
const RSC_CACHE = `${VERSION}-rsc`;

const CACHES = [SHELL_CACHE, STATIC_CACHE, IMAGE_CACHE, API_CACHE, RSC_CACHE];

/** Critical files needed to boot the shell. */
const SHELL_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  '/logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // addAll() rejects the whole batch if one entry 404s, so add
      // individually and tolerate misses.
      await Promise.allSettled(
        SHELL_ASSETS.map((url) => cache.add(new Request(url, { cache: 'reload' })))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !CACHES.includes(k)).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/** Network-first with cache fallback. */
async function networkFirst(request, cacheName, fallback) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallback) return fallback;
    return new Response(
      JSON.stringify({ offline: true, message: 'আপনি অফলাইনে আছেন' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/** Cache-first (for immutable, content-hashed assets). */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.status === 200) {
    cache.put(request, response.clone());
  }
  return response;
}

/** Stale-while-revalidate. */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  return cached || (await network) || new Response('', { status: 504 });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests; let the network handle the rest
  // (Google Fonts, the Gemini API, Open-Meteo, etc.).
  if (url.origin !== self.location.origin) return;

  // ── Navigations ──────────────────────────────────────────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(SHELL_CACHE);
          cache.put('/', response.clone());
          return response;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          const shell =
            (await cache.match('/')) || (await cache.match('/offline.html'));
          if (shell) return shell;
          return new Response(
            '<!doctype html><meta charset="utf-8"><title>অফলাইন</title>' +
              '<body style="font-family:sans-serif;padding:2rem;text-align:center">' +
              '<h1>📵 আপনি অফলাইনে আছেন</h1>' +
              '<p>ইন্টারনেট সংযোগ ফিরে আসলে আবার চেষ্টা করুন।</p></body>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // ── App Router RSC payloads ─────────────────────────────────────────
  if (url.searchParams.has('_rsc')) {
    event.respondWith(networkFirst(request, RSC_CACHE));
    return;
  }

  // ── API routes ───────────────────────────────────────────────────────
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // ── Next.js build output (immutable, content-hashed) ────────────────
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── Images ──────────────────────────────────────────────────────────
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|avif)$/)
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // ── Everything else (fonts served locally, css, js) ─────────────────
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});
