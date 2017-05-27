import Toast from './toast.js';

const NAME = 'PTF';
const VERSION = '1.0.0'

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

    Toast.Push('Portfolio updated. Refresh to get the new version.');
  }
}
