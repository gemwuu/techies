// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = type;
exports.removeWhiteSpace = removeWhiteSpace;
exports.getNumbers = getNumbers;
exports.getSelector = getSelector;
exports.getChildIndex = getChildIndex;

function type(value) {
  return Object.prototype.toString.call(value).match(/\[object\ (.*)\]/)[1].toLowerCase();
}

function removeWhiteSpace(array) {
  var dirtyData = ['', ' '];
  return array.filter(function (item) {
    return !dirtyData.includes(item);
  });
}

function getNumbers(str) {
  return str.match(/\d+/g);
}

function getSelector(node) {
  // 非 dom 节点
  if (type(node).indexOf('html') < 0) {
    console.warn("[techies] error dom type: ".concat(type(node), ", need html element."));
    return '';
  }

  if (type(node) === 'htmlhtmlelement') {
    return 'html';
  }

  if (type(node) === 'htmlbodyelement') {
    return 'body';
  }

  var selector = [];

  var _node;

  while (type(node) !== 'htmlbodyelement') {
    selector.unshift(getParentSelector(node));
    _node = node;
    node = node.parentElement;
  }

  return "body ".concat(selector.join(''));
}

function getParentSelector(node) {
  var parent = node.parentElement;
  var siblings = parent.children;
  var tagName = node.tagName.toLowerCase();

  if (siblings && siblings.length === 1) {
    return "> ".concat(tagName);
  } else {
    return "> ".concat(getChildIndex(node));
  }
}

function getChildIndex(node) {
  var parent = node.parentElement;
  var tagName = node.tagName.toLowerCase();
  var siblings = parent.children;
  return ":nth-child(".concat(Array.prototype.indexOf.call(siblings, node) + 1, ")");
}
},{}],"src/dom.js":[function(require,module,exports) {
'use strict';
/**
 * @author: tianding.wk
 * @createdTime: 2019-02-11 20:57:18
 * @fileName: dom.js
 * @description: process dom to get all number values
 **/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = techies;

var _util = require("./util");

var numbers = [];
var selectors = new Map();

function techies(dom) {
  if ((0, _util.type)(dom) !== 'htmlbodyelement') {
    console.warn("[techies] error dom type: ".concat((0, _util.type)(dom), ", need body element, techies will exit doing nothing."));
    return;
  }

  traverse(dom);
  console.info('reportData: ', (0, _util.removeWhiteSpace)(numbers));
}

function traverse(node) {
  var firstChild = node.firstChild;
  var s = firstChild;

  while (s) {
    if (s.nodeType === 1) {
      traverse(s);
    } else if (s.nodeType === 3) {
      var number = (0, _util.getNumbers)(s.data);

      if (number) {
        (function () {
          var selector = (0, _util.getSelector)(s.parentNode);

          if (!selectors.has(selector)) {
            number.forEach(function (item, index) {
              numbers.push({
                selector: "".concat(selector, "-").concat(index),
                number: item
              });
            });
            selectors.set(selector, number.length);
          } else {
            var index = selectors.get(selector);
            number.forEach(function (item, i) {
              numbers.push({
                selector: "".concat(selector, "-").concat(i + index),
                number: item
              });
            });
            selectors.set(selector, index + number.length);
          }
        })();
      }
    }

    var nextSibling = s.nextSibling;
    s = nextSibling;
  }
}
},{"./util":"src/util.js"}],"index.js":[function(require,module,exports) {
'use strict';
/**
 * @author: tianding.wk
 * @createdTime: 2019-02-11 20:56:19
 * @fileName: index.js
 * @description: entry file
 **/
// module.exports = exports = require('./src/dom.js');

var _dom = _interopRequireDefault(require("./src/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _dom.default)(document.body);
},{"./src/dom":"src/dom.js"}],"node_modules/_parcel-bundler@1.11.0@parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "8080" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/_parcel-bundler@1.11.0@parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/techies.e31bb0bc.map