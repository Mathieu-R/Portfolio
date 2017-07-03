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

export function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.setAttribute('async', true);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
