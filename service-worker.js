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

self.oninstall = evt => {
  self.skipWaiting();
}

self.onactivate = evt => {
  self.clients.claim();
}

self.onfetch = evt => {
  evt.respondWith(fetch(evt.request));
}

self.onmessage = evt => {
  if (evt.data === 'version') {
    evt.source.postMessage({
      type: 'version',
      version: VERSION
    });
  }
}
