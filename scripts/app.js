import {loadScript} from './utils/utils.js';
import {serviceWorkerInstall} from './sw-install.js';
import Toast from './toast.js';

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

  initCustomElements () {
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
      }
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
    this.loadView(newPath)
      .then(view => this.swapContent(view))
      .catch(error => console.warn(error));
  }

  addEventListeners() {
    this.links.forEach(link => link.addEventListener('click', this.onChanged));
    window.addEventListener('popstate', this.onChanged);
  }
}

window.addEventListener('load', _ => new App());
