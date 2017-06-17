'use strict';

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.setAttribute('async', true);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

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

  navigator.serviceWorker.onmessage = evt => {
    if (evt.data.type === 'version') {
      console.log(`Service Worker updated to version ${evt.data.version}`);
      Toast.Push('Portfolio updated. Refresh to get the new version.');
      return;
    }

    if (evt.data.type === 'cached') {
      Toast.Push('Portfolio cached. Future visit will work offline !');
      return;
    }
  };

  navigator.serviceWorker.register('/sw.js', { 'scope': '/' }).then(reg => {
    reg.onupdatefound = evt => {
      console.log('A new service worker has been found, installing...');

      reg.installing.onstatechange = evt => {
        // as the service worker is installed, we can push the message
        if (evt.target.state === 'activated') {
          reg.active.postMessage('version');
        }
        console.log(`Service Worker ${evt.target.state}`);
      };
    };
  }).catch(error => console.warn(error));
}

class App {
  constructor() {
    this.currentPath = window.location.pathname;
    this.links = Array.from(document.querySelectorAll('.nav-link'));
    console.log(this.links);

    this.onChanged = this.onChanged.bind(this);
    this.loadView = this.loadView.bind(this);

    serviceWorkerInstall();
    this.initCustomElements();
    this.addEventListeners();
  }

  initCustomElements() {
    if (!('customElements' in window)) {
      loadScript('/static/js/third_party/webcomponents-lite.js').then(_ => {
        console.log('custom-elements polyfill added.');
      });
    }
  }

  loadView(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, 'true');
      xhr.onload = evt => {
        const newView = evt.target.response;
        resolve(newView);
      };
      xhr.onerror = reject;
      xhr.responseType = 'document';
      xhr.send();
    });
  }

  swapContent(view) {
    console.log(view);
    const currentMasthead = document.querySelector('.masthead');
    const currentContent = document.querySelector('.content');

    const newMasthead = view.querySelector('.masthead');
    const newContent = view.querySelector('.content');

    if (newMasthead) {
      currentMasthead.innerHTML = newMasthead.innerHTML;
    }

    currentContent.innerHTML = newContent.innerHTML;
    return;
  }

  onChanged(evt) {
    evt.preventDefault();
    this.currentPath = window.location.pathname;
    const newPath = evt.target.getAttribute('href');

    if (this.currentPath === newPath) {
      return;
    }

    history.pushState(null, null, newPath);
    this.loadView(newPath).then(view => this.swapContent(view)).catch(error => console.warn(error));
  }

  addEventListeners() {
    this.links.forEach(link => link.addEventListener('click', this.onChanged));
    window.addEventListener('popstate', this.onChanged);
  }
}

window.addEventListener('load', _ => new App());
//# sourceMappingURL=bundle.js.map
