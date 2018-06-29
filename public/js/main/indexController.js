import idb from 'idb';

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('wittr', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('wittrs', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'time');
  });
}
export default function IndexController(container) {
 
  this._dbPromise = openDatabase();
  this._registerServiceWorker();

  var indexController = this;

  
}

IndexController.prototype._registerServiceWorker = function() {
	  if (!navigator.serviceWorker) return;

	  var indexController = this;

	  navigator.serviceWorker.register('/sw.js').then(function(reg) {
	    if (!navigator.serviceWorker.controller) {
	      return;
	    }

	    if (reg.waiting) {
	      indexController._updateReady(reg.waiting);
	      return;
	    }

	    if (reg.installing) {
	      indexController._trackInstalling(reg.installing);
	      return;
	    }

	    reg.addEventListener('updatefound', function() {
	      indexController._trackInstalling(reg.installing);
	    });
	  });

	  // Ensure refresh is only called once.
	  // This works around a bug in "force update on reload".
	  var refreshing;
	  navigator.serviceWorker.addEventListener('controllerchange', function() {
	    if (refreshing) return;
	    window.location.reload();
	    refreshing = true;
	  });
	};
	
	IndexController.prototype._showCachedMessages = function() {
		  var indexController = this;

		  return this._dbPromise.then(function(db) {
		    // if we're already showing posts, eg shift-refresh
		    // or the very first load, there's no point fetching
		    // posts from IDB
		    if (!db || indexController._postsView.showingPosts()) return;

		    var index = db.transaction('wittrs')
		      .objectStore('wittrs').index('by-date');

		    return index.getAll().then(function(messages) {
		      indexController._postsView.addPosts(messages.reverse());
		    });
		  });
		};

		IndexController.prototype._trackInstalling = function(worker) {
		  var indexController = this;
		  worker.addEventListener('statechange', function() {
		    if (worker.state == 'installed') {
		      indexController._updateReady(worker);
		    }
		  });
		};

		IndexController.prototype._updateReady = function(worker) {
		  var toast = this._toastsView.show("New version available", {
		    buttons: ['refresh', 'dismiss']
		  });

		  toast.answer.then(function(answer) {
		    if (answer != 'refresh') return;
		    worker.postMessage({action: 'skipWaiting'});
		  });
		};