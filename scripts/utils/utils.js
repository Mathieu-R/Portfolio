class Utils {
  static loadStyle(url) {
    fetch(url)
      .then(response => response.text())
      .then(style => {
        const link = document.createElement('link');
        link.href = url;
        document.head.appendChild(link);
    });
  }
}
