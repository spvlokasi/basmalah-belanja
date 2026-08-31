// Smart Self-Updating Service Worker for TokoBASMALAH Belanja
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Always pass-through API/Data requests directly to live network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
