import Toast from './toast.js';

export function serviceWorkerInstall() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.onmessage = evt => {

  };

  navigator.serviceWorker.register('/sw.js', {'scope': '/'})
    .then(reg => {
      reg.onupdatefound = evt => {
        console.log('Service Worker installing the new version...');
        Toast.Push('Portfolio updated. Refresh to get the new version.');

        reg.installing.onstatechange = evt => {
          console.log(evt);
          console.log(`Service Worker ${evt.state}`)
        }
      }
    })
    .catch(error => console.warn(error));
}
