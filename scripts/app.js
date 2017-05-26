import {serviceWorkerInstall} from './sw-install.js';
import Toast from './toast.js';

class App {
  constructor() {
    serviceWorkerInstall();

    Toast.Push('Portfolio updated ! Refresh to get the new version.');
  }
}

window.addEventListener('load', _ => new App());
