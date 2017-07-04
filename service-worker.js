const NAME = 'PTF';
const VERSION = '{version}'

const ASSETS = [
  '/',
  '/cv',
  '/activities',
  '/projects',
  '/learning',
  '/static/fonts/raleway-regular.woff',
  '/static/fonts/Robotho-Thin.woff',
  '/static/images/sunrise-boat.jpg',
  '/static/images/download.svg',
  '/static/images/github.svg',
  '/static/images/hamburger.svg',
  '/static/images/icon@256.png',
  '/static/images/nexus4.svg',
  '/static/images/twitter.svg',
  '/static/scripts/bundle.js',
  '/static/scripts/third_party/webcomponenets-lite.js',
  '/static/styles/ptf.css',
  '/static/manifest.json'
];

self.oninstall = event => {
  self.skipWaiting();
  event.waitUntil(async () => {
    const cache = await caches.open(`${NAME}-${VERSION}`);
    return cache.addAll(ASSETS);
  });
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
  event.respondWith(async () => {
    const response = await caches.match(event.request);
    if (response) {
      return response;
    }
    fetch(event.request);
  });
}

self.onmessage = event => {
  if (event.data === 'version') {
    event.source.postMessage({
      type: 'version',
      version: VERSION
    });
  }
}
