// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

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
// 同一个 class 或 id，出现多次需要手动加索引
var attrs = new Map(); // 获取当前节点的类型

function type(value) {
  return Object.prototype.toString.call(value).match(/\[object\ (.*)\]/)[1].toLowerCase();
} // 去掉节点里面的脏数据


function removeWhiteSpace(array) {
  var dirtyData = ['', ' '];
  return array.filter(function (item) {
    return !dirtyData.includes(item);
  });
} // 匹配小数和整数，带符号


function getNumbers(str) {
  return str.match(/([+-]?[0-9]{1,}[.][0-9]*)|[+-]?[0-9]{1,}/g);
} // 获取当前节点基于选择器的唯一标识符


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

  return "body".concat(selector.join(''));
} // 获取父节点的选择器


function getParentSelector(node) {
  var parent = node.parentElement;
  var siblings = parent.children;
  var tagName = node.tagName.toLowerCase();

  if (siblings && siblings.length === 1) {
    return ">".concat(tagName).concat(addAttr(node));
  } else {
    return ">".concat(getChildIndex(node));
  }
} // 获取当前节点在父节点中的索引


function getChildIndex(node) {
  var parent = node.parentElement;
  var siblings = parent.children;
  var tagName = node.tagName.toLowerCase();
  return "".concat(tagName).concat(addAttr(node), ":nth-child(").concat(Array.prototype.indexOf.call(siblings, node) + 1, ")");
} // 将当前节点的 class 和 id 都加到选择器中


function addAttr(node) {
  return "".concat(getClassName(node)).concat(getId(node));
}

function getClassName(node) {
  var className = node.attributes.class ? ".".concat(node.attributes.class.value.replace(' ', '.')) : '';
  console.info('className: ', className, attrs);

  if (className) {
    var index = 0;

    if (attrs.has(className)) {
      index = attrs.get(className) + 1;
    }

    attrs.set(className, index);
    className = "".concat(className, "-").concat(index);
  }

  return className;
}

function getId(node) {
  var id = node.attributes.id ? "#".concat(node.attributes.id.value) : '';
  console.info('id: ', id, attrs);

  if (id) {
    var index = 0;

    if (attrs.has(id)) {
      index = attrs.get(id) + 1;
    }

    attrs.set(id, index);
    id = "".concat(id, "-").concat(index);
  }

  return id;
}
},{}],"src/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = techies;

var _util = require("./util");

// 数据集合
var numbers = []; // 选择器集合，一个节点有多个 TEXT_NODE 需要手动加索引

var selectors = new Map();

function techies(dom) {
  if ((0, _util.type)(dom) !== 'htmlbodyelement') {
    console.warn("[techies] error dom type: ".concat((0, _util.type)(dom), ", need body element, techies will exit doing nothing."));
    return;
  }

  recursive(dom);
  console.info("[reportData]".concat(JSON.stringify((0, _util.removeWhiteSpace)(numbers.slice(0, 15)))));
  numbers = [];
} // 递归遍历特定节点


function recursive(node) {
  var el = node.firstChild;

  while (el) {
    // ELEMENT_NODE
    if (el.nodeType === 1) {
      recursive(el); // TEXT_NODE
    } else if (el.nodeType === 3) {
      var number = (0, _util.getNumbers)(el.data); // 此处根据是否是数字判断是否继续进行后续处理

      if (number) {
        (function () {
          var selector = (0, _util.getSelector)(el.parentNode); // 如果 selector 不重复

          if (!selectors.has(selector)) {
            number.forEach(function (item, index) {
              numbers.push({
                selector: "".concat(selector, "-").concat(index),
                number: item
              });
            });
            selectors.set(selector, number.length); // 如果 selector 重复，手动增加索引
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

    var nextSibling = el.nextSibling;
    el = nextSibling;
  }
}
},{"./util":"src/util.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dom = _interopRequireDefault(require("./src/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Traverse = _dom.default;
(0, _dom.default)(document.body);
var _default = _dom.default;
exports.default = _default;
},{"./src/dom":"src/dom.js"}],"node_modules/_parcel-bundler@1.12.1@parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "8080" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["node_modules/_parcel-bundler@1.12.1@parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/techies.e31bb0bc.js.map