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

class SideNav {
  constructor() {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  static close() {
    document.querySelector('#toggle_nav').checked = false;
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.onTouchStart);
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onTouchEnd);
  }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var idbKeyval = createCommonjsModule(function (module) {
(function() {
  'use strict';
  var db;

  function getDB() {
    if (!db) {
      db = new Promise(function(resolve, reject) {
        var openreq = indexedDB.open('keyval-store', 1);

        openreq.onerror = function() {
          reject(openreq.error);
        };

        openreq.onupgradeneeded = function() {
          // First time setup: create an empty object store
          openreq.result.createObjectStore('keyval');
        };

        openreq.onsuccess = function() {
          resolve(openreq.result);
        };
      });
    }
    return db;
  }

  function withStore(type, callback) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction('keyval', type);
        transaction.oncomplete = function() {
          resolve();
        };
        transaction.onerror = function() {
          reject(transaction.error);
        };
        callback(transaction.objectStore('keyval'));
      });
    });
  }

  var idbKeyval = {
    get: function(key) {
      var req;
      return withStore('readonly', function(store) {
        req = store.get(key);
      }).then(function() {
        return req.result;
      });
    },
    set: function(key, value) {
      return withStore('readwrite', function(store) {
        store.put(value, key);
      });
    },
    delete: function(key) {
      return withStore('readwrite', function(store) {
        store.delete(key);
      });
    },
    clear: function() {
      return withStore('readwrite', function(store) {
        store.clear();
      });
    },
    keys: function() {
      var keys = [];
      return withStore('readonly', function(store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
          if (!this.result) return;
          keys.push(this.result.key);
          this.result.continue();
        };
      }).then(function() {
        return keys;
      });
    }
  };

  if ('object' != 'undefined' && module.exports) {
    module.exports = idbKeyval;
  } else if (typeof undefined === 'function' && undefined.amd) {
    undefined('idbKeyval', [], function() {
      return idbKeyval;
    });
  } else {
    self.idbKeyval = idbKeyval;
  }
}());
});

class Contact extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.contactForm = this.querySelector('.contact-form');
    this.onSubmit = this.onSubmit.bind(this);
    this.contactForm.addEventListener('submit', this.onSubmit);
  }

  disconnectedCallback() {
    this.contactForm.removeEventListener('submit', this.onSubmit);
  }

  async onSubmit(evt) {
    evt.preventDefault();
    const data = {
      name: this.contactForm.fullname.value,
      mail: this.contactForm.mail.value,
      subject: this.contactForm.subject.value,
      message: this.contactForm.message.value
    };

    if (!('serviceWorker' in navigator && 'SyncManager' in window)) {
      this.sendDirectly(data);
    }

    this.sendInTheBackground(data);
  }

  async sendInTheBackground(data) {
    try {
      await idbKeyval.set('contact-infos', data);
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register('bg-contact');
      console.log('[SW] Sync registered');
    } catch (err) {
      this.sendDirectly(data);
    }
  }

  async sendDirectly(data) {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseJson = await response.json();

    if (responseJson.err) {
      responseJson.err.forEach(err => console.warn(err));
      return;
    }

    Toast.Push(responseJson.success);
  }

  attributesChangedCallback(name, oldValue, newValue) {}
}

class App {
  constructor() {
    this.currentPath = window.location.pathname;
    this.links = Array.from(document.querySelectorAll('.nav-link'));
    this.navLinks = Array.from(document.querySelectorAll('.nav-content-link'));
    this.pageContent = document.querySelector('.content');
    this.pageContentSections = Array.from(this.pageContent.querySelectorAll('section'));
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
    customElements.define('ptf-contact', Contact);
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

      this.pageContentSections = Array.from(currentContent.querySelectorAll('section'));

      if (this.slideUpLinks.includes(url)) {
        this.pageContentSections.forEach(section => {
          section.classList.add('slide-down');
          section.style.willChange = 'transform';
        });
      }

      // double rAF
      requestAnimationFrame(_ => {
        requestAnimationFrame(_ => {
          if (this.slideUpLinks.includes(url)) {
            this.slideBackUp();
          }
          document.body.classList.remove('hide');
        });
      });
    });
  }

  slideBackUp() {
    const onSlideTransitionEnd = evt => {
      const section = evt.target;
      section.removeEventListener('transitionend', onSlideTransitionEnd);
      section.style.transition = '';
      section.style.willChange = '';
    };

    this.pageContentSections.forEach(section => {
      section.style.transition = 'opacity .3s cubic-bezier(0,0,0.3,1), transform .5s cubic-bezier(0,0,0.3,1)';
      section.addEventListener('transitionend', onSlideTransitionEnd);
      section.classList.remove('slide-down');
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

    SideNav.close();
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
