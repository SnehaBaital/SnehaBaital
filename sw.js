var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
'/',
'index.html',
/* '/styles/main.css',
'/script/main.js' */
];
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    )
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          console.log(event.request)
          return fetch(event.request);
        }
      )
    );
  });


  // Sync event
self.addEventListener('sync', (event) => {
  // You can handle sync tasks here, e.g., sending queued data to the server
  // Check if the sync event has a specific tag
  if (event.tag === 'syncData') {
    event.waitUntil(
      // Your sync operation here
      fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ /* data to sync */ })
      })
      .then((response) => {
        if (response.ok) {
          console.log('Sync operation successful');
          return response.json();
        } else {
          throw new Error('Sync operation failed');
        }
      })
      .catch((error) => {
        console.error('Sync operation failed:', error);
      })
    );
  }
});

// Push event
self.addEventListener('push', (event) => {
  // You can handle push notifications here

  const options = {
    body: event.data.text(),
    icon: 'path/to/icon.png',
    // Add other notification options as needed
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});


