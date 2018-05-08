'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  _setPrototypeOf(subClass.prototype, superClass && superClass.prototype);

  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) {
    return o.__proto__;
  };

  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _construct(Parent, args, Class) {
  if (typeof Reflect !== "undefined" && Reflect.construct) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Parent.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {}

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, _setPrototypeOf(function Super() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }, Class));
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function loadScript(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = url;
    script.setAttribute('async', true);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

var Toast =
/*#__PURE__*/
function () {
  function Toast() {
    _classCallCheck(this, Toast);
  }

  _createClass(Toast, null, [{
    key: "Push",
    value: function Push(message) {
      var container = document.querySelector('.toast-container');
      var toast = document.createElement('div');
      var toastContent = document.createElement('p');
      toast.classList.add('toast');
      toastContent.classList.add('toast-content');
      toastContent.textContent = message;
      container.appendChild(toast);
      toast.appendChild(toastContent);
      setTimeout(function () {
        return toast.classList.add('hide');
      }, 3000);
      toast.addEventListener('transitionend', function (evt) {
        return evt.target.parentNode.removeChild(evt.target);
      });
    }
  }]);

  return Toast;
}();

function serviceWorkerInstall() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.onmessage = function (evt) {
    if (evt.data.type === 'version') {
      console.log("Service Worker updated to version ".concat(evt.data.version));
      Toast.Push('Portfolio updated. Refresh to get the new version.');
      return;
    }

    if (evt.data.type === 'cached') {
      Toast.Push('Portfolio cached. Future visit will work offline !');
      return;
    }
  };

  navigator.serviceWorker.register('/sw.js', {
    'scope': '/'
  }).then(function (reg) {
    if ('SyncManager' in window) {
      reg.pushManager.getSubscription();
    }

    reg.onupdatefound = function (evt) {
      console.log('A new service worker has been found, installing...');

      reg.installing.onstatechange = function (evt) {
        if (evt.target.state === 'activated') {
          reg.active.postMessage('version');
        }

        console.log("Service Worker ".concat(evt.target.state));
      };
    };
  }).catch(function (error) {
    return console.warn(error);
  });
}

var SideNav =
/*#__PURE__*/
function () {
  function SideNav() {
    _classCallCheck(this, SideNav);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  _createClass(SideNav, [{
    key: "addEventListeners",
    value: function addEventListeners() {
      document.addEventListener('touchstart', this.onTouchStart);
      document.addEventListener('touchmove', this.onTouchMove);
      document.addEventListener('touchend', this.onTouchEnd);
    }
  }], [{
    key: "close",
    value: function close() {
      document.querySelector('#toggle_nav').checked = false;
    }
  }]);

  return SideNav;
}();

class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function set$1(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}

var Contact =
/*#__PURE__*/
function (_HTMLElement) {
  _createClass(Contact, null, [{
    key: "observedAttributes",
    get: function get$$1() {
      return [];
    }
  }]);

  function Contact() {
    _classCallCheck(this, Contact);

    return _possibleConstructorReturn(this, _getPrototypeOf(Contact).call(this));
  }

  _createClass(Contact, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.contactForm = this.querySelector('.contact-form');
      this.onSubmit = this.onSubmit.bind(this);
      this.contactForm.addEventListener('submit', this.onSubmit);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.contactForm.removeEventListener('submit', this.onSubmit);
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(evt) {
      return new Promise(function ($return, $error) {
        evt.preventDefault();
        var data = {
          name: this.contactForm.fullname.value,
          mail: this.contactForm.mail.value,
          subject: this.contactForm.subject.value,
          message: this.contactForm.message.value
        };

        if (!('serviceWorker' in navigator && 'SyncManager' in window)) {
          this.sendDirectly(data);
        }

        this.sendInTheBackground(data);
        return $return();
      }.bind(this));
    }
  }, {
    key: "sendInTheBackground",
    value: function sendInTheBackground(data) {
      return new Promise(function ($return, $error) {
        var reg;

        var $Try_1_Post = function () {
          try {
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        };

        var $Try_1_Catch = function (err) {
          try {
            this.sendDirectly(data);
            return $Try_1_Post();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this);

        try {
          return Promise.resolve(navigator.serviceWorker.ready).then(function ($await_2) {
            try {
              reg = $await_2;

              if (!reg.active) {
                return $return();
              }

              return Promise.resolve(Notification.requestPermission()).then(function ($await_3) {
                try {
                  return Promise.resolve(set$1('contact-infos', data)).then(function ($await_4) {
                    try {
                      return Promise.resolve(reg.sync.register('bg-contact')).then(function ($await_5) {
                        try {
                          console.log('[SW] Sync registered');
                          return $Try_1_Post();
                        } catch ($boundEx) {
                          return $Try_1_Catch($boundEx);
                        }
                      }, $Try_1_Catch);
                    } catch ($boundEx) {
                      return $Try_1_Catch($boundEx);
                    }
                  }, $Try_1_Catch);
                } catch ($boundEx) {
                  return $Try_1_Catch($boundEx);
                }
              }, $Try_1_Catch);
            } catch ($boundEx) {
              return $Try_1_Catch($boundEx);
            }
          }, $Try_1_Catch);
        } catch (err) {
          $Try_1_Catch(err);
        }
      }.bind(this));
    }
  }, {
    key: "sendDirectly",
    value: function sendDirectly(data) {
      return new Promise(function ($return, $error) {
        var response, responseJson;
        return Promise.resolve(fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })).then(function ($await_6) {
          try {
            response = $await_6;
            return Promise.resolve(response.json()).then(function ($await_7) {
              try {
                responseJson = $await_7;

                if (responseJson.err) {
                  responseJson.err.forEach(function (err) {
                    return console.warn(err);
                  });
                  return $return();
                }

                Toast.Push(responseJson.success);
                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }, $error);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      });
    }
  }, {
    key: "attributesChangedCallback",
    value: function attributesChangedCallback(name, oldValue, newValue) {}
  }]);

  _inherits(Contact, _HTMLElement);

  return Contact;
}(_wrapNativeSuper(HTMLElement));

var App =
/*#__PURE__*/
function () {
  function App() {
    _classCallCheck(this, App);

    this.currentPath = window.location.pathname;
    this.links = Array.from(document.querySelectorAll('.nav-link'));
    this.navLinks = Array.from(document.querySelectorAll('.nav-content-link'));
    this.pageContent = document.querySelector('.content');
    this.pageContentSections = Array.from(this.pageContent.querySelectorAll('section'));
    this.slideUpLinks = ['/activities', '/projects', '/learning'];
    this.onClickLinks = this.onClickLinks.bind(this);
    this.onChanged = this.onChanged.bind(this);
    this.loadView = this.loadView.bind(this);
    this.swapContent = this.swapContent.bind(this);
    this.hideAreas = this.hideAreas.bind(this);
    this.slideBackUp = this.slideBackUp.bind(this);
    serviceWorkerInstall();
    this.initCustomElements();
    this.addEventListeners();
  }

  _createClass(App, [{
    key: "initCustomElements",
    value: function initCustomElements() {
      if (!('customElements' in window)) {
        loadScript('/static/js/third_party/webcomponents-lite.js').then(function (_) {
          console.log('custom-elements polyfill added.');
        });
      }

      customElements.define('ptf-contact', Contact);
    }
  }, {
    key: "loadView",
    value: function loadView(url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, 'true');

        xhr.onload = function (evt) {
          var newView = evt.target.response;
          resolve(newView);
        };

        xhr.onerror = reject;
        xhr.responseType = 'document';
        xhr.send();
      });
    }
  }, {
    key: "swapContent",
    value: function swapContent(view, url) {
      var _this = this;

      this.hideAreas(url).then(function (_) {
        _this.pageContent.removeEventListener('transitionend', _this.onSwapTransitionEnd);

        var currentMasthead = document.querySelector('.masthead');
        var currentContent = document.querySelector('.content');
        var newMasthead = view.querySelector('.masthead');
        var newContent = view.querySelector('.content');

        if (newMasthead) {
          if (currentMasthead) {
            currentMasthead.innerHTML = newMasthead.innerHTML;
            currentMasthead.className = newMasthead.className;
          } else {
            document.body.insertBefore(newMasthead, currentContent);
          }
        } else if (!newMasthead && currentMasthead) {
          document.body.removeChild(currentMasthead);
        }

        currentContent.innerHTML = newContent.innerHTML;
        currentContent.className = newContent.className;
        _this.pageContentSections = Array.from(currentContent.querySelectorAll('section'));

        if (_this.slideUpLinks.includes(url)) {
          _this.pageContentSections.forEach(function (section) {
            section.classList.add('slide-down');
            section.style.willChange = 'transform';
          });
        }

        requestAnimationFrame(function (_) {
          requestAnimationFrame(function (_) {
            if (_this.slideUpLinks.includes(url)) {
              _this.slideBackUp();
            }

            document.body.classList.remove('hide');
          });
        });
      });
    }
  }, {
    key: "slideBackUp",
    value: function slideBackUp() {
      var onSlideTransitionEnd = function onSlideTransitionEnd(evt) {
        var section = evt.target;
        section.removeEventListener('transitionend', onSlideTransitionEnd);
        section.style.transition = '';
        section.style.willChange = '';
      };

      this.pageContentSections.forEach(function (section) {
        section.style.transition = 'opacity .3s cubic-bezier(0,0,0.3,1), transform .5s cubic-bezier(0,0,0.3,1)';
        section.addEventListener('transitionend', onSlideTransitionEnd);
        section.classList.remove('slide-down');
      });
    }
  }, {
    key: "hideAreas",
    value: function hideAreas(url) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.pageContent.addEventListener('transitionend', resolve);

        document.body.classList.add('hide');
      });
    }
  }, {
    key: "highlightCurrentLink",
    value: function highlightCurrentLink(url) {
      this.navLinks.forEach(function (navLink) {
        navLink.classList.remove('nav-content-link__active');

        if (new URL(navLink.href).pathname === url) {
          navLink.classList.add('nav-content-link__active');
        }
      });
    }
  }, {
    key: "onChanged",
    value: function onChanged() {
      var _this3 = this;

      this.newPath = window.location.pathname;
      this.currentPath = this.newPath;
      SideNav.close();
      this.highlightCurrentLink(this.newPath);
      this.loadView(this.newPath).then(function (view) {
        return _this3.swapContent(view, _this3.newPath);
      }).catch(function (error) {
        return console.warn(error);
      });
    }
  }, {
    key: "onClickLinks",
    value: function onClickLinks(evt) {
      evt.preventDefault();

      if (new URL(evt.target.href).pathname === window.location.pathname) {
        return;
      }

      history.pushState(null, null, evt.target.href);
      this.onChanged();
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this4 = this;

      this.links.forEach(function (link) {
        return link.addEventListener('click', _this4.onClickLinks);
      });
      window.addEventListener('popstate', this.onChanged);
    }
  }]);

  return App;
}();

window.addEventListener('load', function (_) {
  return new App();
});
