const NAME = 'PTF';
const VERSION = '{version}'

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
