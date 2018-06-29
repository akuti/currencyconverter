var cacheName = 'currencyconverterv1'; 

var cacheFiles = [
  './',
  './skeleton',
  './index.html',
  './bootstrap.min.css',
  './custom.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
  './js/app.js',
  './js/idb.js',
  './js/currencyconvscript.js',
  'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js',
  './package.json',
]


self.addEventListener('install', function(e) {

    e.waitUntil(

      caches.open(cacheName).then(function(cache) {
      return cache.addAll(cacheFiles);
      })
  );
});


self.addEventListener('activate', function(e) {
        e.waitUntil(

    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {

        if (thisCacheName !== cacheName) {

          return caches.delete(thisCacheName);
        }
      }));
    })
  ); 

});


self.addEventListener('fetch', function(e) {

  e.respondWith(

    caches.match(e.request)


      .then(function(response) {

        if ( response ) {
          return response;
        }


        var requestClone = e.request.clone();
        return fetch(requestClone)
          .then(function(response) {

            if ( !response ) {
              return response;
            }

            var responseClone = response.clone();

            caches.open(cacheName).then(function(cache) {

              cache.put(e.request, responseClone);

              return response;
      
                }); 

          })
          .catch(function(err) {
          });


      }) 
  ); 
});
