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

class sideNav {
  constructor() {}

  static close() {
    document.querySelector('#toggle_nav').checked = false;
  }
}

class App {
  constructor() {
    this.currentPath = window.location.pathname;
    this.links = Array.from(document.querySelectorAll('.nav-link'));
    this.navLinks = Array.from(document.querySelectorAll('.nav-content-link'));
    this.pageContent = document.querySelector('.content');
    this.slideUpLinks = ['/activities', '/projects', '/learning'];

    this.onClickLinks = this.onClickLinks.bind(this);
    this.onChanged = this.onChanged.bind(this);
    this.loadView = this.loadView.bind(this);
    this.swapContent = this.swapContent.bind(this);
    this.hideAreas = this.hideAreas.bind(this);
    this.slideBackUp = this.slideBackUp.bind(this);

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

  swapContent(view, url) {
    this.hideAreas(url).then(_ => {
      this.pageContent.removeEventListener('transitionend', this.onSwapTransitionEnd);

      const currentMasthead = document.querySelector('.masthead');
      const currentContent = document.querySelector('.content');

      const newMasthead = view.querySelector('.masthead');
      const newContent = view.querySelector('.content');

      // TODO: rework this code
      if (newMasthead) {
        if (currentMasthead) {
          currentMasthead.innerHTML = newMasthead.innerHTML;
          currentMasthead.className = newMasthead.className;
        } else {
          document.body.insertBefore(newMasthead, currentContent);
        }
      } else if (!newMasthead && currentMasthead) {
        document.body.removeChild(currentMasthead);
      }

      currentContent.innerHTML = newContent.innerHTML;
      currentContent.className = newContent.className;

      if (this.slideUpLinks.includes(url)) {
        currentContent.classList.add('slide-down');
      }

      // double rAF
      requestAnimationFrame(_ => {
        requestAnimationFrame(_ => {
          if (this.slideUpLinks.includes(url)) {
            this.slideBackUp().then(_ => this.pageContent.style.transition = '');
          }
          document.body.classList.remove('hide');
        });
      });
    });
  }

  slideBackUp() {
    return new Promise((resolve, reject) => {
      this.pageContent.style.transition = 'opacity .3s cubic-bezier(0,0,0.3,1), transform .5s cubic-bezier(0,0,0.3,1)';
      this.pageContent.addEventListener('transitionend', resolve);
      this.pageContent.classList.remove('slide-down');
    });
  }

  hideAreas(url) {
    return new Promise((resolve, reject) => {
      this.pageContent.addEventListener('transitionend', resolve);
      document.body.classList.add('hide');
    });
  }

  highlightCurrentLink(url) {
    this.navLinks.forEach(navLink => {
      navLink.classList.remove('nav-content-link__active');
      if (new URL(navLink.href).pathname === url) {
        navLink.classList.add('nav-content-link__active');
      }
    });
  }

  onChanged() {
    this.newPath = window.location.pathname;
    this.currentPath = this.newPath;

    sideNav.close();
    this.highlightCurrentLink(this.newPath);
    this.loadView(this.newPath).then(view => this.swapContent(view, this.newPath)).catch(error => console.warn(error));
  }

  onClickLinks(evt) {
    evt.preventDefault();
    if (new URL(evt.target.href).pathname === window.location.pathname) {
      return;
    }
    history.pushState(null, null, evt.target.href);
    this.onChanged();
  }

  addEventListeners() {
    this.links.forEach(link => link.addEventListener('click', this.onClickLinks));
    window.addEventListener('popstate', this.onChanged);
  }
}

window.addEventListener('load', _ => new App());
//# sourceMappingURL=bundle.js.map
