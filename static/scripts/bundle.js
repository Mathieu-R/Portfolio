'use strict';

function serviceWorkerInstall() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.register('/sw.js', { 'scope': '/' }).then(() => console.log('Service Worker installing...')).catch(error => console.warn(error));
}

class App {
  constructor() {
    serviceWorkerInstall();
  }
}

window.addEventListener('load', _ => new App());
//# sourceMappingURL=bundle.js.map
