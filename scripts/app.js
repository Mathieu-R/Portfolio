import {serviceWorkerInstall} from './sw-install.js';
import Toast from './toast.js';

class App {
  constructor() {
    serviceWorkerInstall();
  }
}

window.addEventListener('load', _ => new App());
