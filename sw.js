console.log('Service Worker: Registered')
const cacheFiles = [
  '/',
  'index.html',
  'restaurant.html',
  'css/styles_C.css',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open("myCache").then((cache) => {
      console.log('opened cache');
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName === "myCache";
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse.status === 404) {
          return null;
        }
        return caches.open("myCache").then(cache => {
          cache.put(event.request.url, networkResponse.clone());
          return networkResponse;
        })
      })
    }).catch(err => {
      console.log(err);
      return;
    })
  );
});
