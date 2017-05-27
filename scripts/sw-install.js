import Toast from './toast.js';

export function serviceWorkerInstall() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.onmessage = evt => {
    if (evt.data.type === 'version') {
      console.log(`Service Worker updated to version ${evt.data.version}`);
      Toast.Push('Portfolio updated. Refresh to get the new version.');
    }
  };

  navigator.serviceWorker.register('/sw.js', {'scope': '/'})
    .then(reg => {
      reg.onupdatefound = evt => {
        console.log('A new service worker has been found, installing...');

        reg.installing.onstatechange = evt => {
          // as the service worker is installed, we can push the message
          if (evt.target.state === 'activated') {
            //navigator.serviceWorker.controller.postMessage('version');
            reg.active.postMessage('version');
          }
          console.log(`Service Worker ${evt.target.state}`)
        }
      }
    })
    .catch(error => console.warn(error));
}
