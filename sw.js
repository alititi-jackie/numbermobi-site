/* NumberMobi service worker: pages always network-first (prices stay fresh);
   only app icons and the manifest are cached. */
var CACHE = "nm-pwa-v2";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (names) {
        return Promise.all(
          names
            .filter(function (n) {
              return n !== CACHE;
            })
            .map(function (n) {
              return caches.delete(n);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match("/");
      })
    );
    return;
  }
  if (
    url.pathname.indexOf("/icon-") === 0 ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(event.request).then(function (hit) {
          return (
            hit ||
            fetch(event.request).then(function (res) {
              cache.put(event.request, res.clone());
              return res;
            })
          );
        });
      })
    );
  }
});
