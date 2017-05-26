class Toast {
  static Push(message) {
    const toast = document.querySelector('.toast');
    const toastContent = document.querySelector('.toast-content');

    toastContent.textContent = message;
    setTimeout(() => toast.classList.add('show'), 3000);
  }
}
