(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s
})({
  1: [function (require, module, exports) {
    function get(e) {
      return new Promise(function (r, t) {
        var n = new XMLHttpRequest;
        n.open("get", e), n.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n.addEventListener("load", function () {
          r(n)
        }), n.addEventListener("error", function () {
          t(n)
        }), n.send()
      })
    }

    function doReady(e) {
      "string" == typeof e ? exposed[e]() : e()
    }
    var Promise = self.Promise || require("es6-promise").Promise;
    if (navigator.serviceWorker && window.ReadableStream) {
      var readableStreamConstructingSupported = !1;
      try {
        new ReadableStream, readableStreamConstructingSupported = !0
      }
      catch (e) {}
      readableStreamConstructingSupported && navigator.serviceWorker.register("./sw.js")
    }
    var exposed = {
      aboutMeSidebar: function () {
        var e = document.querySelector(".side");
        e.parentNode;
        e && "none" != window.getComputedStyle(e).getPropertyValue("display") && get("/who/?ajax").then(function (r) {
          e.innerHTML = r.responseText
        })
      }
    };
    window.ready.push = doReady, window.ready.forEach(doReady);
  }, {
    "es6-promise": 2
  }],
  2: [function (require, module, exports) {
    (function (process, global) {
      (function () {
        "use strict";

        function t(t) {
          return "function" == typeof t || "object" == typeof t && null !== t
        }

        function n(t) {
          return "function" == typeof t
        }

        function e(t) {
          return "object" == typeof t && null !== t
        }

        function r(t) {
          U = t
        }

        function o(t) {
          G = t
        }

        function i() {
          return function () {
            process.nextTick(f)
          }
        }

        function u() {
          return function () {
            N(f)
          }
        }

        function s() {
          var t = 0,
            n = new Q(f),
            e = document.createTextNode("");
          return n.observe(e, {
              characterData: !0
            }),
            function () {
              e.data = t = ++t % 2
            }
        }

        function c() {
          var t = new MessageChannel;
          return t.port1.onmessage = f,
            function () {
              t.port2.postMessage(0)
            }
        }

        function a() {
          return function () {
            setTimeout(f, 1)
          }
        }

        function f() {
          for (var t = 0; B > t; t += 2) {
            var n = X[t],
              e = X[t + 1];
            n(e), X[t] = void 0, X[t + 1] = void 0
          }
          B = 0
        }

        function l() {
          try {
            var t = require,
              n = t("vertx");
            return N = n.runOnLoop || n.runOnContext, u()
          }
          catch (e) {
            return a()
          }
        }

        function p() {}

        function _() {
          return new TypeError("You cannot resolve a promise with itself")
        }

        function h() {
          return new TypeError("A promises callback cannot return that same promise.")
        }

        function v(t) {
          try {
            return t.then
          }
          catch (n) {
            return nt.error = n, nt
          }
        }

        function d(t, n, e, r) {
          try {
            t.call(n, e, r)
          }
          catch (o) {
            return o
          }
        }

        function y(t, n, e) {
          G(function (t) {
            var r = !1,
              o = d(e, n, function (e) {
                r || (r = !0, n !== e ? g(t, e) : A(t, e))
              }, function (n) {
                r || (r = !0, E(t, n))
              }, "Settle: " + (t._label || " unknown promise"));
            !r && o && (r = !0, E(t, o))
          }, t)
        }

        function m(t, n) {
          n._state === $ ? A(t, n._result) : n._state === tt ? E(t, n._result) : j(n, void 0, function (n) {
            g(t, n)
          }, function (n) {
            E(t, n)
          })
        }

        function b(t, e) {
          if (e.constructor === t.constructor) m(t, e);
          else {
            var r = v(e);
            r === nt ? E(t, nt.error) : void 0 === r ? A(t, e) : n(r) ? y(t, e, r) : A(t, e)
          }
        }

        function g(n, e) {
          n === e ? E(n, _()) : t(e) ? b(n, e) : A(n, e)
        }

        function w(t) {
          t._onerror && t._onerror(t._result), S(t)
        }

        function A(t, n) {
          t._state === Z && (t._result = n, t._state = $, 0 !== t._subscribers.length && G(S, t))
        }

        function E(t, n) {
          t._state === Z && (t._state = tt, t._result = n, G(w, t))
        }

        function j(t, n, e, r) {
          var o = t._subscribers,
            i = o.length;
          t._onerror = null, o[i] = n, o[i + $] = e, o[i + tt] = r, 0 === i && t._state && G(S, t)
        }

        function S(t) {
          var n = t._subscribers,
            e = t._state;
          if (0 !== n.length) {
            for (var r, o, i = t._result, u = 0; u < n.length; u += 3) r = n[u], o = n[u + e], r ? x(e, r, o, i) : o(i);
            t._subscribers.length = 0
          }
        }

        function T() {
          this.error = null
        }

        function P(t, n) {
          try {
            return t(n)
          }
          catch (e) {
            return et.error = e, et
          }
        }

        function x(t, e, r, o) {
          var i, u, s, c, a = n(r);
          if (a) {
            if (i = P(r, o), i === et ? (c = !0, u = i.error, i = null) : s = !0, e === i) return void E(e, h())
          }
          else i = o, s = !0;
          e._state !== Z || (a && s ? g(e, i) : c ? E(e, u) : t === $ ? A(e, i) : t === tt && E(e, i))
        }

        function C(t, n) {
          try {
            n(function (n) {
              g(t, n)
            }, function (n) {
              E(t, n)
            })
          }
          catch (e) {
            E(t, e)
          }
        }

        function M(t, n) {
          var e = this;
          e._instanceConstructor = t, e.promise = new t(p), e._validateInput(n) ? (e._input = n, e.length = n.length, e._remaining = n.length, e._init(), 0 === e.length ? A(e.promise, e._result) : (e.length = e.length || 0, e._enumerate(), 0 === e._remaining && A(e.promise, e._result))) : E(e.promise, e._validationError())
        }

        function O(t) {
          return new rt(this, t).promise
        }

        function k(t) {
          function n(t) {
            g(o, t)
          }

          function e(t) {
            E(o, t)
          }
          var r = this,
            o = new r(p);
          if (!z(t)) return E(o, new TypeError("You must pass an array to race.")), o;
          for (var i = t.length, u = 0; o._state === Z && i > u; u++) j(r.resolve(t[u]), void 0, n, e);
          return o
        }

        function Y(t) {
          var n = this;
          if (t && "object" == typeof t && t.constructor === n) return t;
          var e = new n(p);
          return g(e, t), e
        }

        function q(t) {
          var n = this,
            e = new n(p);
          return E(e, t), e
        }

        function F() {
          throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
        }

        function I() {
          throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
        }

        function D(t) {
          this._id = ct++, this._state = void 0, this._result = void 0, this._subscribers = [], p !== t && (n(t) || F(), this instanceof D || I(), C(this, t))
        }

        function K() {
          var t;
          if ("undefined" != typeof global) t = global;
          else if ("undefined" != typeof self) t = self;
          else try {
            t = Function("return this")()
          }
          catch (n) {
            throw new Error("polyfill failed because global object is unavailable in this environment")
          }
          var e = t.Promise;
          (!e || "[object Promise]" !== Object.prototype.toString.call(e.resolve()) || e.cast) && (t.Promise = at)
        }
        var L;
        L = Array.isArray ? Array.isArray : function (t) {
          return "[object Array]" === Object.prototype.toString.call(t)
        };
        var N, U, W, z = L,
          B = 0,
          G = ({}.toString, function (t, n) {
            X[B] = t, X[B + 1] = n, B += 2, 2 === B && (U ? U(f) : W())
          }),
          H = "undefined" != typeof window ? window : void 0,
          J = H || {},
          Q = J.MutationObserver || J.WebKitMutationObserver,
          R = "undefined" != typeof process && "[object process]" === {}.toString.call(process),
          V = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
          X = new Array(1e3);
        W = R ? i() : Q ? s() : V ? c() : void 0 === H && "function" == typeof require ? l() : a();
        var Z = void 0,
          $ = 1,
          tt = 2,
          nt = new T,
          et = new T;
        M.prototype._validateInput = function (t) {
          return z(t)
        }, M.prototype._validationError = function () {
          return new Error("Array Methods must be provided an Array")
        }, M.prototype._init = function () {
          this._result = new Array(this.length)
        };
        var rt = M;
        M.prototype._enumerate = function () {
          for (var t = this, n = t.length, e = t.promise, r = t._input, o = 0; e._state === Z && n > o; o++) t._eachEntry(r[o], o)
        }, M.prototype._eachEntry = function (t, n) {
          var r = this,
            o = r._instanceConstructor;
          e(t) ? t.constructor === o && t._state !== Z ? (t._onerror = null, r._settledAt(t._state, n, t._result)) : r._willSettleAt(o.resolve(t), n) : (r._remaining--, r._result[n] = t)
        }, M.prototype._settledAt = function (t, n, e) {
          var r = this,
            o = r.promise;
          o._state === Z && (r._remaining--, t === tt ? E(o, e) : r._result[n] = e), 0 === r._remaining && A(o, r._result)
        }, M.prototype._willSettleAt = function (t, n) {
          var e = this;
          j(t, void 0, function (t) {
            e._settledAt($, n, t)
          }, function (t) {
            e._settledAt(tt, n, t)
          })
        };
        var ot = O,
          it = k,
          ut = Y,
          st = q,
          ct = 0,
          at = D;
        D.all = ot, D.race = it, D.resolve = ut, D.reject = st, D._setScheduler = r, D._setAsap = o, D._asap = G, D.prototype = {
          constructor: D,
          then: function (t, n) {
            var e = this,
              r = e._state;
            if (r === $ && !t || r === tt && !n) return this;
            var o = new this.constructor(p),
              i = e._result;
            if (r) {
              var u = arguments[r - 1];
              G(function () {
                x(r, o, u, i)
              })
            }
            else j(e, o, t, n);
            return o
          },
          "catch": function (t) {
            return this.then(null, t)
          }
        };
        var ft = K,
          lt = {
            Promise: at,
            polyfill: ft
          };
        "function" == typeof define && define.amd ? define(function () {
          return lt
        }) : "undefined" != typeof module && module.exports ? module.exports = lt : "undefined" != typeof this && (this.ES6Promise = lt), ft()
      }).call(this);

    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {
    "_process": 3
  }],
  3: [function (require, module, exports) {
    function cleanUpNextTick() {
      draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue()
    }

    function drainQueue() {
      if (!draining) {
        var e = setTimeout(cleanUpNextTick);
        draining = !0;
        for (var n = queue.length; n;) {
          for (currentQueue = queue, queue = []; ++queueIndex < n;) currentQueue && currentQueue[queueIndex].run();
          queueIndex = -1, n = queue.length
        }
        currentQueue = null, draining = !1, clearTimeout(e)
      }
    }

    function Item(e, n) {
      this.fun = e, this.array = n
    }

    function noop() {}
    var process = module.exports = {},
      queue = [],
      draining = !1,
      currentQueue, queueIndex = -1;
    process.nextTick = function (e) {
      var n = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
      queue.push(new Item(e, n)), 1 !== queue.length || draining || setTimeout(drainQueue, 0)
    }, Item.prototype.run = function () {
      this.fun.apply(null, this.array)
    }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.binding = function (e) {
      throw new Error("process.binding is not supported")
    }, process.cwd = function () {
      return "/"
    }, process.chdir = function (e) {
      throw new Error("process.chdir is not supported")
    }, process.umask = function () {
      return 0
    };

  }, {}]
}, {}, [1]);

//# sourceMappingURL=main.js.map

