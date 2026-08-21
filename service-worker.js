/* ==========================================================================
   Horario Duo - Service Worker with Web Push Notifications Support
   ========================================================================== */

const CACHE_NAME = "horario-duo-v59";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request));
});

// External Web Push Notification Listener
self.addEventListener("push", (event) => {
  let title = "Horario Duo";
  let body = "Tienes una nueva actualizacion en tu espacio.";

  if (event.data) {
    try {
      const data = event.data.json();
      if (data.title) title = data.title;
      if (data.body) body = data.body;
      if (data.message) body = data.message;
    } catch (e) {
      body = event.data.text() || body;
    }
  }

  const options = {
    body: body,
    icon: "icon-192.png",
    badge: "icon-192.png",
    vibrate: [200, 100, 200],
    tag: "horario-duo-notif",
    renotify: true,
    data: {
      url: self.location.origin
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Action
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
