import {loadScript} from './utils/utils.js';
import {serviceWorkerInstall} from './sw-install.js';
import Toast from './toast.js';

class App {
  constructor() {
    serviceWorkerInstall();
    this.initCustomElements();
  }

  initCustomElements () {
    if (!('customElements' in window)) {
      loadScript('/static/js/third_party/webcomponents-lite.js').then(_ => {
        console.log('custom-elements polyfill added.');
      });
    }
  }
}

window.addEventListener('load', _ => new App());
