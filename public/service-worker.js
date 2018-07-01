let staticCacheName = 'currencyconverterv2';

self.addEventListener('install', function(event) {

    event.waitUntil(

      caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
    	  '/'
    	 
    	]);
      })
  );
});


self.addEventListener('activate', function(e) {

    e.waitUntil(

    caches.keys().then(function(staticCacheName) {
      return Promise.all(staticCacheName.map(function(thisCacheName) {

        if (thisCacheName !== staticCacheName) {

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

	            caches.open(staticCacheName).then(function(cache) {

	              cache.put(e.request, responseClone);

	              return response;
	      
	                });

	          })
	          .catch(function(err) {
	          });


	      })
	  );

});
