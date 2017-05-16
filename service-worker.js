self.oninstall = evt => {
  self.skipWaiting();
}

self.onactivate = evt => {
  self.clients.claim();
}

self.onfetch = evt => {
  evt.respondWith(fetch(evt.request));
}
