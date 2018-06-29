let staticCacheName = 'currency-converter-v1';


self.addEventListener('install', event => {
 self.skipWaiting();
 event.waitUntil(
   caches.open(staticCacheName).then(cache => {
     return cache.addAll(['/skeleton',
    	 'Styleshets/css.css',
         'https://free.currencyconverterapi.com/api/v5/currencies'
     ]);
   })
 );
});

self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.filter(cacheName => cacheName.startsWith('currency-converter-') && cacheName != staticCacheName).map(cacheName => caches['delete'](cacheName)))));
});

//fetch cache
 self.addEventListener('fetch', event => {
   event.respondWith(caches.match(event.request)
   .then(response => response || fetch(event.request)
     .then(response => caches.open(currency-converter-v1)
     .then(cache => {
       cache.put(event.request, response.clone());
       return response;
     })).catch(event => {
     console.log('Service Worker error caching and fetching');
   }))
  );
 });