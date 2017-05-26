'use strict';

class Toast {
  static Push(message) {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    const toastContent = document.createElement('p');
    toast.classList.add('toast');
    toastContent.classList.add('toast-content');
    toastContent.textContent = message;

    container.appendChild(toast);
    toast.appendChild(toastContent);

    setTimeout(() => toast.classList.add('hide'), 3000);
    toast.addEventListener('transitionend', evt => evt.target.parentNode.removeChild(evt.target));
  }
}

function serviceWorkerInstall() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.onmessage = evt => {};

  navigator.serviceWorker.register('/sw.js', { 'scope': '/' }).then(reg => {
    reg.onupdatefound = evt => {
      console.log('Service Worker installing the new version...');
      Toast.Push('Portfolio updated. Refresh to get the new version.');

      reg.installing.onstatechange = evt => {
        console.log(evt);
        console.log(`Service Worker ${evt.state}`);
      };
    };
  }).catch(error => console.warn(error));
}

class App {
  constructor() {
    serviceWorkerInstall();
  }
}

window.addEventListener('load', _ => new App());
//# sourceMappingURL=bundle.js.map
