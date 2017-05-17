export function serviceWorkerInstall() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.register('/sw.js', {'scope': '/'})
    .then(() => console.log('Service Worker installing...'))
    .catch(error => console.warn(error));
}
