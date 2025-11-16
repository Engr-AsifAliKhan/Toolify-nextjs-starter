/* global workbox */
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js");

if (workbox) {
  workbox.setConfig({ debug: false });

  workbox.precaching.precacheAndRoute([
    { url: "/", revision: null },
    { url: "/qr", revision: null },
    { url: "/invoice", revision: null },
    { url: "/screenshot", revision: null },
    { url: "/bg-remove", revision: null },
    { url: "/pdf-ocr", revision: null },
    { url: "/manifest.json", revision: null }
  ]);

  workbox.routing.registerRoute(
    ({ request }) => ["style", "script", "worker"].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    ({ request }) => ["image", "font"].includes(request.destination),
    new workbox.strategies.CacheFirst({ cacheName: "assets", plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 })] })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith("/"),
    new workbox.strategies.NetworkFirst({ cacheName: "pages", networkTimeoutSeconds: 3 })
  );
}