const NAME = 'PTF';
const VERSION = '{version}'

const ASSETS = [
  '/',
  '/cv',
  '/activities',
  '/projects',
  '/learning',
  '/static/fonts/raleway-regular.woff',
  '/static/fonts/Roboto-Thin.woff',
  '/static/images/sunrise-boat.jpg',
  '/static/images/download.svg',
  '/static/images/github.svg',
  '/static/images/hamburger.svg',
  '/static/images/icon@256.png',
  '/static/images/nexus4.svg',
  '/static/images/twitter.svg',
  '{@hash path="static/scripts/bundle.js"}{/hash}',
  '/static/scripts/third_party/webcomponents-lite.js',
  '{@hash path="static/styles/ptf.css"}{/hash}',
  '{@hash path="static/manifest.json"}{/hash}'
];

self.oninstall = event => {
  event.waitUntil(
    caches.open(`${NAME}-${VERSION}`)
      .then(cache => cache.addAll(ASSETS))
  );
  return self.skipWaiting();
}

self.onactivate = event => {
  self.clients.claim();
  event.waitUntil(async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .map(c => c.split('-'))
        .filter(c => c[0] !== NAME)
        .filter(c => c[1] !== VERSION)
        .map(c => caches.delete(c.join('-')))
    );
  });
}

self.onfetch = event => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/static/')) {
    event.respondWith(caches.match(event.request));
    return;
  }
  staleWhileRevalidate(event);
}

function staleWhileRevalidate(event) {
  event.respondWith(async function() {
    try {
      const cacheResponse = await caches.match(event.request);
      return cacheResponse;
    } catch(err) {
      console.error(err);
    }
  }());

  event.waitUntil(async function() {
    try {
      const fetchResponse = await fetch(event.request);
      const cache = await caches.open(`${NAME}-${VERSION}`);
      await cache.put(event.request, fetchResponse.clone());
    } catch(err) {
      console.error(err);
    }
  }());
}


self.onmessage = event => {
  if (event.data === 'version') {
    event.source.postMessage({
      type: 'version',
      version: VERSION
    });
  }
}
