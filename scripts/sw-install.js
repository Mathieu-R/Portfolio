import Toast from './toast.js';

export function serviceWorkerInstall() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.register('/sw.js', {'scope': '/'})
    .then(reg => {
      console.log('Service Worker installing...');
      reg.onupdatefound = evt => {
        Toast.Push('Portfolio updated. Refresh to get the new version.');

        reg.installing.onstatechange = _ => {
          console.log(`Service Worker ${reg.installing.state}`)
        }

        console.log(evt);
      }
    }).catch(error => console.warn(error));
}
