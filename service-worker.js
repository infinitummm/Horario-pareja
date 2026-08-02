const CACHE_NAME = "horarioduo-v33";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Don't intercept external API requests (e.g., JSONBlob sync)
  if (!e.request.url.startsWith(self.location.origin)) return;

  // Network first strategy for same-origin static assets only
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
