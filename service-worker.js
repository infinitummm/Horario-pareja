const CACHE_NAME = "horarioduo-v37";
const MASTER_CLOUD_URL = "https://jsonblob.com/api/jsonBlob/019fc8ae-0406-7e83-8e25-c5e4014ae458";

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

// Periodic background sync heartbeat to prevent cloud blob expiration
self.addEventListener("periodicsync", (e) => {
  if (e.tag === "cloud-keepalive") {
    e.waitUntil(
      fetch(MASTER_CLOUD_URL, { method: "GET" }).catch(() => {})
    );
  }
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
