import {serviceWorkerInstall} from './sw-install.js';

class App {
  constructor() {
    serviceWorkerInstall();
  }
}

window.addEventListener('load', _ => new App());
