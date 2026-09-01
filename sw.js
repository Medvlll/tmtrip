const CACHE = "tmtrip-v2";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./tmtrip-logo.png"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      return fetch(event.request)
        .then(networkResponse => {
          const copy = networkResponse.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, copy);
          });

          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
