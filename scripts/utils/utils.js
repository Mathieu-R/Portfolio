export function rafPromise() {
  return new Promise(resolve => requestAnimationFrame(resolve));
};

export function transitionEndPromise(el) {
  return new Promise(resolve => {
    const te = _ => {
      el.removeEventListener('transitionend', te);
      resolve();
    }
    el.addEventListener('transitionend', te);
  });
};

export function loadStyle(url) {
  fetch(url)
    .then(response => response.text())
    .then(style => {
      const link = document.createElement('link');
      link.href = url;
      document.head.appendChild(link);
  });
};

