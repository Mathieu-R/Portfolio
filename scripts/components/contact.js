import idb from 'idb-keyval';
import Toast from './toast.js';

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
      await idb.set('contact-infos', data);
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register('bg-contact');
      console.log('[SW] Sync registered');
    } catch(err) {
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

  attributesChangedCallback(name, oldValue, newValue) {

  }
}

export default Contact;
