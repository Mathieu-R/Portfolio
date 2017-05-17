import {installServiceWorker} from './sw-install.js';

class App {
  constructor() {
    console.log('Porfolio.');
    installServiceWorker();
  }
}

window.addEventListener('load', _ => new App());
