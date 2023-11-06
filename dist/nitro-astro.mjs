function xe(i) {
  if (i.__esModule)
    return i;
  var u = i.default;
  if (typeof u == "function") {
    var c = function l() {
      return this instanceof l ? Reflect.construct(u, arguments, this.constructor) : u.apply(this, arguments);
    };
    c.prototype = u.prototype;
  } else
    c = {};
  return Object.defineProperty(c, "__esModule", { value: !0 }), Object.keys(i).forEach(function(l) {
    var h = Object.getOwnPropertyDescriptor(i, l);
    Object.defineProperty(c, l, h.get ? h : {
      enumerable: !0,
      get: function() {
        return i[l];
      }
    });
  }), c;
}
var De = {};
function Fe(i) {
  throw new Error('Could not dynamically require "' + i + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var C = {}, Z = { exports: {} }, Oe = { exports: {} };
(function(i) {
  i.exports = u;
  function u(l) {
    if (l)
      return c(l);
  }
  function c(l) {
    for (var h in u.prototype)
      l[h] = u.prototype[h];
    return l;
  }
  u.prototype.on = u.prototype.addEventListener = function(l, h) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + l] = this._callbacks["$" + l] || []).push(h), this;
  }, u.prototype.once = function(l, h) {
    function b() {
      this.off(l, b), h.apply(this, arguments);
    }
    return b.fn = h, this.on(l, b), this;
  }, u.prototype.off = u.prototype.removeListener = u.prototype.removeAllListeners = u.prototype.removeEventListener = function(l, h) {
    if (this._callbacks = this._callbacks || {}, arguments.length == 0)
      return this._callbacks = {}, this;
    var b = this._callbacks["$" + l];
    if (!b)
      return this;
    if (arguments.length == 1)
      return delete this._callbacks["$" + l], this;
    for (var _, w = 0; w < b.length; w++)
      if (_ = b[w], _ === h || _.fn === h) {
        b.splice(w, 1);
        break;
      }
    return b.length === 0 && delete this._callbacks["$" + l], this;
  }, u.prototype.emit = function(l) {
    this._callbacks = this._callbacks || {};
    for (var h = new Array(arguments.length - 1), b = this._callbacks["$" + l], _ = 1; _ < arguments.length; _++)
      h[_ - 1] = arguments[_];
    if (b) {
      b = b.slice(0);
      for (var _ = 0, w = b.length; _ < w; ++_)
        b[_].apply(this, h);
    }
    return this;
  }, u.prototype.listeners = function(l) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + l] || [];
  }, u.prototype.hasListeners = function(l) {
    return !!this.listeners(l).length;
  };
})(Oe);
var He = Oe.exports, Le = H;
H.default = H;
H.stable = Ee;
H.stableStringify = Ee;
var j = "[...]", Te = "[Circular]", B = [], M = [];
function Pe() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function H(i, u, c, l) {
  typeof l > "u" && (l = Pe()), ee(i, "", 0, [], void 0, 0, l);
  var h;
  try {
    M.length === 0 ? h = JSON.stringify(i, u, c) : h = JSON.stringify(i, Ae(u), c);
  } catch {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    for (; B.length !== 0; ) {
      var b = B.pop();
      b.length === 4 ? Object.defineProperty(b[0], b[1], b[3]) : b[0][b[1]] = b[2];
    }
  }
  return h;
}
function D(i, u, c, l) {
  var h = Object.getOwnPropertyDescriptor(l, c);
  h.get !== void 0 ? h.configurable ? (Object.defineProperty(l, c, { value: i }), B.push([l, c, u, h])) : M.push([u, c, i]) : (l[c] = i, B.push([l, c, u]));
}
function ee(i, u, c, l, h, b, _) {
  b += 1;
  var w;
  if (typeof i == "object" && i !== null) {
    for (w = 0; w < l.length; w++)
      if (l[w] === i) {
        D(Te, i, u, h);
        return;
      }
    if (typeof _.depthLimit < "u" && b > _.depthLimit) {
      D(j, i, u, h);
      return;
    }
    if (typeof _.edgesLimit < "u" && c + 1 > _.edgesLimit) {
      D(j, i, u, h);
      return;
    }
    if (l.push(i), Array.isArray(i))
      for (w = 0; w < i.length; w++)
        ee(i[w], w, w, l, i, b, _);
    else {
      var T = Object.keys(i);
      for (w = 0; w < T.length; w++) {
        var S = T[w];
        ee(i[S], S, w, l, i, b, _);
      }
    }
    l.pop();
  }
}
function Ue(i, u) {
  return i < u ? -1 : i > u ? 1 : 0;
}
function Ee(i, u, c, l) {
  typeof l > "u" && (l = Pe());
  var h = te(i, "", 0, [], void 0, 0, l) || i, b;
  try {
    M.length === 0 ? b = JSON.stringify(h, u, c) : b = JSON.stringify(h, Ae(u), c);
  } catch {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    for (; B.length !== 0; ) {
      var _ = B.pop();
      _.length === 4 ? Object.defineProperty(_[0], _[1], _[3]) : _[0][_[1]] = _[2];
    }
  }
  return b;
}
function te(i, u, c, l, h, b, _) {
  b += 1;
  var w;
  if (typeof i == "object" && i !== null) {
    for (w = 0; w < l.length; w++)
      if (l[w] === i) {
        D(Te, i, u, h);
        return;
      }
    try {
      if (typeof i.toJSON == "function")
        return;
    } catch {
      return;
    }
    if (typeof _.depthLimit < "u" && b > _.depthLimit) {
      D(j, i, u, h);
      return;
    }
    if (typeof _.edgesLimit < "u" && c + 1 > _.edgesLimit) {
      D(j, i, u, h);
      return;
    }
    if (l.push(i), Array.isArray(i))
      for (w = 0; w < i.length; w++)
        te(i[w], w, w, l, i, b, _);
    else {
      var T = {}, S = Object.keys(i).sort(Ue);
      for (w = 0; w < S.length; w++) {
        var O = S[w];
        te(i[O], O, w, l, i, b, _), T[O] = i[O];
      }
      if (typeof h < "u")
        B.push([h, u, i]), h[u] = T;
      else
        return T;
    }
    l.pop();
  }
}
function Ae(i) {
  return i = typeof i < "u" ? i : function(u, c) {
    return c;
  }, function(u, c) {
    if (M.length > 0)
      for (var l = 0; l < M.length; l++) {
        var h = M[l];
        if (h[1] === u && h[0] === c) {
          c = h[2], M.splice(l, 1);
          break;
        }
      }
    return i.call(this, u, c);
  };
}
function U(i) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? U = function(c) {
    return typeof c;
  } : U = function(c) {
    return c && typeof Symbol == "function" && c.constructor === Symbol && c !== Symbol.prototype ? "symbol" : typeof c;
  }, U(i);
}
function Ke(i) {
  return i !== null && U(i) === "object";
}
var ke = Ke;
function K(i) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? K = function(c) {
    return typeof c;
  } : K = function(c) {
    return c && typeof Symbol == "function" && c.constructor === Symbol && c !== Symbol.prototype ? "symbol" : typeof c;
  }, K(i);
}
var W = ke, je = E;
function E(i) {
  if (i)
    return We(i);
}
function We(i) {
  for (var u in E.prototype)
    Object.prototype.hasOwnProperty.call(E.prototype, u) && (i[u] = E.prototype[u]);
  return i;
}
E.prototype.clearTimeout = function() {
  return clearTimeout(this._timer), clearTimeout(this._responseTimeoutTimer), clearTimeout(this._uploadTimeoutTimer), delete this._timer, delete this._responseTimeoutTimer, delete this._uploadTimeoutTimer, this;
};
E.prototype.parse = function(i) {
  return this._parser = i, this;
};
E.prototype.responseType = function(i) {
  return this._responseType = i, this;
};
E.prototype.serialize = function(i) {
  return this._serializer = i, this;
};
E.prototype.timeout = function(i) {
  if (!i || K(i) !== "object")
    return this._timeout = i, this._responseTimeout = 0, this._uploadTimeout = 0, this;
  for (var u in i)
    if (Object.prototype.hasOwnProperty.call(i, u))
      switch (u) {
        case "deadline":
          this._timeout = i.deadline;
          break;
        case "response":
          this._responseTimeout = i.response;
          break;
        case "upload":
          this._uploadTimeout = i.upload;
          break;
        default:
          console.warn("Unknown timeout option", u);
      }
  return this;
};
E.prototype.retry = function(i, u) {
  return (arguments.length === 0 || i === !0) && (i = 1), i <= 0 && (i = 0), this._maxRetries = i, this._retries = 0, this._retryCallback = u, this;
};
var $e = ["ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT"];
E.prototype._shouldRetry = function(i, u) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries)
    return !1;
  if (this._retryCallback)
    try {
      var c = this._retryCallback(i, u);
      if (c === !0)
        return !0;
      if (c === !1)
        return !1;
    } catch (l) {
      console.error(l);
    }
  return !!(u && u.status && u.status >= 500 && u.status !== 501 || i && (i.code && $e.includes(i.code) || i.timeout && i.code === "ECONNABORTED" || i.crossDomain));
};
E.prototype._retry = function() {
  return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this.timedoutError = null, this._end();
};
E.prototype.then = function(i, u) {
  var c = this;
  if (!this._fullfilledPromise) {
    var l = this;
    this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise(function(h, b) {
      l.on("abort", function() {
        if (!(c._maxRetries && c._maxRetries > c._retries)) {
          if (c.timedout && c.timedoutError) {
            b(c.timedoutError);
            return;
          }
          var _ = new Error("Aborted");
          _.code = "ABORTED", _.status = c.status, _.method = c.method, _.url = c.url, b(_);
        }
      }), l.end(function(_, w) {
        _ ? b(_) : h(w);
      });
    });
  }
  return this._fullfilledPromise.then(i, u);
};
E.prototype.catch = function(i) {
  return this.then(void 0, i);
};
E.prototype.use = function(i) {
  return i(this), this;
};
E.prototype.ok = function(i) {
  if (typeof i != "function")
    throw new Error("Callback required");
  return this._okCallback = i, this;
};
E.prototype._isResponseOK = function(i) {
  return i ? this._okCallback ? this._okCallback(i) : i.status >= 200 && i.status < 300 : !1;
};
E.prototype.get = function(i) {
  return this._header[i.toLowerCase()];
};
E.prototype.getHeader = E.prototype.get;
E.prototype.set = function(i, u) {
  if (W(i)) {
    for (var c in i)
      Object.prototype.hasOwnProperty.call(i, c) && this.set(c, i[c]);
    return this;
  }
  return this._header[i.toLowerCase()] = u, this.header[i] = u, this;
};
E.prototype.unset = function(i) {
  return delete this._header[i.toLowerCase()], delete this.header[i], this;
};
E.prototype.field = function(i, u) {
  if (i == null)
    throw new Error(".field(name, val) name can not be empty");
  if (this._data)
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  if (W(i)) {
    for (var c in i)
      Object.prototype.hasOwnProperty.call(i, c) && this.field(c, i[c]);
    return this;
  }
  if (Array.isArray(u)) {
    for (var l in u)
      Object.prototype.hasOwnProperty.call(u, l) && this.field(i, u[l]);
    return this;
  }
  if (u == null)
    throw new Error(".field(name, val) val can not be empty");
  return typeof u == "boolean" && (u = String(u)), this._getFormData().append(i, u), this;
};
E.prototype.abort = function() {
  return this._aborted ? this : (this._aborted = !0, this.xhr && this.xhr.abort(), this.req && this.req.abort(), this.clearTimeout(), this.emit("abort"), this);
};
E.prototype._auth = function(i, u, c, l) {
  switch (c.type) {
    case "basic":
      this.set("Authorization", "Basic ".concat(l("".concat(i, ":").concat(u))));
      break;
    case "auto":
      this.username = i, this.password = u;
      break;
    case "bearer":
      this.set("Authorization", "Bearer ".concat(i));
      break;
  }
  return this;
};
E.prototype.withCredentials = function(i) {
  return i === void 0 && (i = !0), this._withCredentials = i, this;
};
E.prototype.redirects = function(i) {
  return this._maxRedirects = i, this;
};
E.prototype.maxResponseSize = function(i) {
  if (typeof i != "number")
    throw new TypeError("Invalid argument");
  return this._maxResponseSize = i, this;
};
E.prototype.toJSON = function() {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};
E.prototype.send = function(i) {
  var u = W(i), c = this._header["content-type"];
  if (this._formData)
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  if (u && !this._data)
    Array.isArray(i) ? this._data = [] : this._isHost(i) || (this._data = {});
  else if (i && this._data && this._isHost(this._data))
    throw new Error("Can't merge these send calls");
  if (u && W(this._data))
    for (var l in i)
      Object.prototype.hasOwnProperty.call(i, l) && (this._data[l] = i[l]);
  else
    typeof i == "string" ? (c || this.type("form"), c = this._header["content-type"], c === "application/x-www-form-urlencoded" ? this._data = this._data ? "".concat(this._data, "&").concat(i) : i : this._data = (this._data || "") + i) : this._data = i;
  return !u || this._isHost(i) ? this : (c || this.type("json"), this);
};
E.prototype.sortQuery = function(i) {
  return this._sort = typeof i > "u" ? !0 : i, this;
};
E.prototype._finalizeQueryString = function() {
  var i = this._query.join("&");
  if (i && (this.url += (this.url.includes("?") ? "&" : "?") + i), this._query.length = 0, this._sort) {
    var u = this.url.indexOf("?");
    if (u >= 0) {
      var c = this.url.slice(u + 1).split("&");
      typeof this._sort == "function" ? c.sort(this._sort) : c.sort(), this.url = this.url.slice(0, u) + "?" + c.join("&");
    }
  }
};
E.prototype._appendQueryString = function() {
  console.warn("Unsupported");
};
E.prototype._timeoutError = function(i, u, c) {
  if (!this._aborted) {
    var l = new Error("".concat(i + u, "ms exceeded"));
    l.timeout = u, l.code = "ECONNABORTED", l.errno = c, this.timedout = !0, this.timedoutError = l, this.abort(), this.callback(l);
  }
};
E.prototype._setTimeouts = function() {
  var i = this;
  this._timeout && !this._timer && (this._timer = setTimeout(function() {
    i._timeoutError("Timeout of ", i._timeout, "ETIME");
  }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function() {
    i._timeoutError("Response timeout of ", i._responseTimeout, "ETIMEDOUT");
  }, this._responseTimeout));
};
var L = {};
L.type = function(i) {
  return i.split(/ *; */).shift();
};
L.params = function(i) {
  return i.split(/ *; */).reduce(function(u, c) {
    var l = c.split(/ *= */), h = l.shift(), b = l.shift();
    return h && b && (u[h] = b), u;
  }, {});
};
L.parseLinks = function(i) {
  return i.split(/ *, */).reduce(function(u, c) {
    var l = c.split(/ *; */), h = l[0].slice(1, -1), b = l[1].split(/ *= */)[1].slice(1, -1);
    return u[b] = h, u;
  }, {});
};
L.cleanHeader = function(i, u) {
  return delete i["content-type"], delete i["content-length"], delete i["transfer-encoding"], delete i.host, u && (delete i.authorization, delete i.cookie), i;
};
var X = L, Ge = z;
function z(i) {
  if (i)
    return Ve(i);
}
function Ve(i) {
  for (var u in z.prototype)
    Object.prototype.hasOwnProperty.call(z.prototype, u) && (i[u] = z.prototype[u]);
  return i;
}
z.prototype.get = function(i) {
  return this.header[i.toLowerCase()];
};
z.prototype._setHeaderProperties = function(i) {
  var u = i["content-type"] || "";
  this.type = X.type(u);
  var c = X.params(u);
  for (var l in c)
    Object.prototype.hasOwnProperty.call(c, l) && (this[l] = c[l]);
  this.links = {};
  try {
    i.link && (this.links = X.parseLinks(i.link));
  } catch {
  }
};
z.prototype._setStatusProperties = function(i) {
  var u = i / 100 | 0;
  this.statusCode = i, this.status = this.statusCode, this.statusType = u, this.info = u === 1, this.ok = u === 2, this.redirect = u === 3, this.clientError = u === 4, this.serverError = u === 5, this.error = u === 4 || u === 5 ? this.toError() : !1, this.created = i === 201, this.accepted = i === 202, this.noContent = i === 204, this.badRequest = i === 400, this.unauthorized = i === 401, this.notAcceptable = i === 406, this.forbidden = i === 403, this.notFound = i === 404, this.unprocessableEntity = i === 422;
};
function Xe(i) {
  return et(i) || Ze(i) || Ye(i) || Qe();
}
function Qe() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ye(i, u) {
  if (i) {
    if (typeof i == "string")
      return re(i, u);
    var c = Object.prototype.toString.call(i).slice(8, -1);
    if (c === "Object" && i.constructor && (c = i.constructor.name), c === "Map" || c === "Set")
      return Array.from(i);
    if (c === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c))
      return re(i, u);
  }
}
function Ze(i) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(i))
    return Array.from(i);
}
function et(i) {
  if (Array.isArray(i))
    return re(i);
}
function re(i, u) {
  (u == null || u > i.length) && (u = i.length);
  for (var c = 0, l = new Array(u); c < u; c++)
    l[c] = i[c];
  return l;
}
function ne() {
  this._defaults = [];
}
["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert", "disableTLSCerts"].forEach(function(i) {
  ne.prototype[i] = function() {
    for (var u = arguments.length, c = new Array(u), l = 0; l < u; l++)
      c[l] = arguments[l];
    return this._defaults.push({
      fn: i,
      args: c
    }), this;
  };
});
ne.prototype._setDefaults = function(i) {
  this._defaults.forEach(function(u) {
    i[u.fn].apply(i, Xe(u.args));
  });
};
var tt = ne;
(function(i, u) {
  function c(s) {
    "@babel/helpers - typeof";
    return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? c = function(m) {
      return typeof m;
    } : c = function(m) {
      return m && typeof Symbol == "function" && m.constructor === Symbol && m !== Symbol.prototype ? "symbol" : typeof m;
    }, c(s);
  }
  var l;
  typeof window < "u" ? l = window : typeof self > "u" ? (console.warn("Using browser-only version of superagent in non-browser environment"), l = void 0) : l = self;
  var h = He, b = Le, _ = je, w = ke, T = Ge, S = tt;
  function O() {
  }
  i.exports = function(s, v) {
    return typeof v == "function" ? new u.Request("GET", s).end(v) : arguments.length === 1 ? new u.Request("GET", s) : new u.Request(s, v);
  }, u = i.exports;
  var n = u;
  u.Request = d, n.getXHR = function() {
    if (l.XMLHttpRequest && (!l.location || l.location.protocol !== "file:" || !l.ActiveXObject))
      return new XMLHttpRequest();
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch {
    }
    throw new Error("Browser-only version of superagent could not find XHR");
  };
  var t = "".trim ? function(s) {
    return s.trim();
  } : function(s) {
    return s.replace(/(^\s*|\s*$)/g, "");
  };
  function r(s) {
    if (!w(s))
      return s;
    var v = [];
    for (var m in s)
      Object.prototype.hasOwnProperty.call(s, m) && e(v, m, s[m]);
    return v.join("&");
  }
  function e(s, v, m) {
    if (m !== void 0) {
      if (m === null) {
        s.push(encodeURI(v));
        return;
      }
      if (Array.isArray(m))
        m.forEach(function(P) {
          e(s, v, P);
        });
      else if (w(m))
        for (var g in m)
          Object.prototype.hasOwnProperty.call(m, g) && e(s, "".concat(v, "[").concat(g, "]"), m[g]);
      else
        s.push(encodeURI(v) + "=" + encodeURIComponent(m));
    }
  }
  n.serializeObject = r;
  function o(s) {
    for (var v = {}, m = s.split("&"), g, P, A = 0, N = m.length; A < N; ++A)
      g = m[A], P = g.indexOf("="), P === -1 ? v[decodeURIComponent(g)] = "" : v[decodeURIComponent(g.slice(0, P))] = decodeURIComponent(g.slice(P + 1));
    return v;
  }
  n.parseString = o, n.types = {
    html: "text/html",
    json: "application/json",
    xml: "text/xml",
    urlencoded: "application/x-www-form-urlencoded",
    form: "application/x-www-form-urlencoded",
    "form-data": "application/x-www-form-urlencoded"
  }, n.serialize = {
    "application/x-www-form-urlencoded": r,
    "application/json": b
  }, n.parse = {
    "application/x-www-form-urlencoded": o,
    "application/json": JSON.parse
  };
  function f(s) {
    for (var v = s.split(/\r?\n/), m = {}, g, P, A, N, k = 0, R = v.length; k < R; ++k)
      P = v[k], g = P.indexOf(":"), g !== -1 && (A = P.slice(0, g).toLowerCase(), N = t(P.slice(g + 1)), m[A] = N);
    return m;
  }
  function a(s) {
    return /[/+]json($|[^-\w])/.test(s);
  }
  function y(s) {
    this.req = s, this.xhr = this.req.xhr, this.text = this.req.method !== "HEAD" && (this.xhr.responseType === "" || this.xhr.responseType === "text") || typeof this.xhr.responseType > "u" ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;
    var v = this.xhr.status;
    v === 1223 && (v = 204), this._setStatusProperties(v), this.headers = f(this.xhr.getAllResponseHeaders()), this.header = this.headers, this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), this.text === null && s._responseType ? this.body = this.xhr.response : this.body = this.req.method === "HEAD" ? null : this._parseBody(this.text ? this.text : this.xhr.response);
  }
  T(y.prototype), y.prototype._parseBody = function(s) {
    var v = n.parse[this.type];
    return this.req._parser ? this.req._parser(this, s) : (!v && a(this.type) && (v = n.parse["application/json"]), v && s && (s.length > 0 || s instanceof Object) ? v(s) : null);
  }, y.prototype.toError = function() {
    var s = this.req, v = s.method, m = s.url, g = "cannot ".concat(v, " ").concat(m, " (").concat(this.status, ")"), P = new Error(g);
    return P.status = this.status, P.method = v, P.url = m, P;
  }, n.Response = y;
  function d(s, v) {
    var m = this;
    this._query = this._query || [], this.method = s, this.url = v, this.header = {}, this._header = {}, this.on("end", function() {
      var g = null, P = null;
      try {
        P = new y(m);
      } catch (N) {
        return g = new Error("Parser is unable to parse the response"), g.parse = !0, g.original = N, m.xhr ? (g.rawResponse = typeof m.xhr.responseType > "u" ? m.xhr.responseText : m.xhr.response, g.status = m.xhr.status ? m.xhr.status : null, g.statusCode = g.status) : (g.rawResponse = null, g.status = null), m.callback(g);
      }
      m.emit("response", P);
      var A;
      try {
        m._isResponseOK(P) || (A = new Error(P.statusText || P.text || "Unsuccessful HTTP response"));
      } catch (N) {
        A = N;
      }
      A ? (A.original = g, A.response = P, A.status = P.status, m.callback(A, P)) : m.callback(null, P);
    });
  }
  h(d.prototype), _(d.prototype), d.prototype.type = function(s) {
    return this.set("Content-Type", n.types[s] || s), this;
  }, d.prototype.accept = function(s) {
    return this.set("Accept", n.types[s] || s), this;
  }, d.prototype.auth = function(s, v, m) {
    arguments.length === 1 && (v = ""), c(v) === "object" && v !== null && (m = v, v = ""), m || (m = {
      type: typeof btoa == "function" ? "basic" : "auto"
    });
    var g = function(A) {
      if (typeof btoa == "function")
        return btoa(A);
      throw new Error("Cannot use basic auth, btoa is not a function");
    };
    return this._auth(s, v, m, g);
  }, d.prototype.query = function(s) {
    return typeof s != "string" && (s = r(s)), s && this._query.push(s), this;
  }, d.prototype.attach = function(s, v, m) {
    if (v) {
      if (this._data)
        throw new Error("superagent can't mix .send() and .attach()");
      this._getFormData().append(s, v, m || v.name);
    }
    return this;
  }, d.prototype._getFormData = function() {
    return this._formData || (this._formData = new l.FormData()), this._formData;
  }, d.prototype.callback = function(s, v) {
    if (this._shouldRetry(s, v))
      return this._retry();
    var m = this._callback;
    this.clearTimeout(), s && (this._maxRetries && (s.retries = this._retries - 1), this.emit("error", s)), m(s, v);
  }, d.prototype.crossDomainError = function() {
    var s = new Error(`Request has been terminated
Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.`);
    s.crossDomain = !0, s.status = this.status, s.method = this.method, s.url = this.url, this.callback(s);
  }, d.prototype.agent = function() {
    return console.warn("This is not supported in browser version of superagent"), this;
  }, d.prototype.ca = d.prototype.agent, d.prototype.buffer = d.prototype.ca, d.prototype.write = function() {
    throw new Error("Streaming is not supported in browser version of superagent");
  }, d.prototype.pipe = d.prototype.write, d.prototype._isHost = function(s) {
    return s && c(s) === "object" && !Array.isArray(s) && Object.prototype.toString.call(s) !== "[object Object]";
  }, d.prototype.end = function(s) {
    this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = s || O, this._finalizeQueryString(), this._end();
  }, d.prototype._setUploadTimeout = function() {
    var s = this;
    this._uploadTimeout && !this._uploadTimeoutTimer && (this._uploadTimeoutTimer = setTimeout(function() {
      s._timeoutError("Upload timeout of ", s._uploadTimeout, "ETIMEDOUT");
    }, this._uploadTimeout));
  }, d.prototype._end = function() {
    if (this._aborted)
      return this.callback(new Error("The request has been aborted even before .end() was called"));
    var s = this;
    this.xhr = n.getXHR();
    var v = this.xhr, m = this._formData || this._data;
    this._setTimeouts(), v.onreadystatechange = function() {
      var k = v.readyState;
      if (k >= 2 && s._responseTimeoutTimer && clearTimeout(s._responseTimeoutTimer), k === 4) {
        var R;
        try {
          R = v.status;
        } catch {
          R = 0;
        }
        if (!R)
          return s.timedout || s._aborted ? void 0 : s.crossDomainError();
        s.emit("end");
      }
    };
    var g = function(R, q) {
      q.total > 0 && (q.percent = q.loaded / q.total * 100, q.percent === 100 && clearTimeout(s._uploadTimeoutTimer)), q.direction = R, s.emit("progress", q);
    };
    if (this.hasListeners("progress"))
      try {
        v.addEventListener("progress", g.bind(null, "download")), v.upload && v.upload.addEventListener("progress", g.bind(null, "upload"));
      } catch {
      }
    v.upload && this._setUploadTimeout();
    try {
      this.username && this.password ? v.open(this.method, this.url, !0, this.username, this.password) : v.open(this.method, this.url, !0);
    } catch (k) {
      return this.callback(k);
    }
    if (this._withCredentials && (v.withCredentials = !0), !this._formData && this.method !== "GET" && this.method !== "HEAD" && typeof m != "string" && !this._isHost(m)) {
      var P = this._header["content-type"], A = this._serializer || n.serialize[P ? P.split(";")[0] : ""];
      !A && a(P) && (A = n.serialize["application/json"]), A && (m = A(m));
    }
    for (var N in this.header)
      this.header[N] !== null && Object.prototype.hasOwnProperty.call(this.header, N) && v.setRequestHeader(N, this.header[N]);
    this._responseType && (v.responseType = this._responseType), this.emit("request", this), v.send(typeof m > "u" ? null : m);
  }, n.agent = function() {
    return new S();
  }, ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(s) {
    S.prototype[s.toLowerCase()] = function(v, m) {
      var g = new n.Request(s, v);
      return this._setDefaults(g), m && g.end(m), g;
    };
  }), S.prototype.del = S.prototype.delete, n.get = function(s, v, m) {
    var g = n("GET", s);
    return typeof v == "function" && (m = v, v = null), v && g.query(v), m && g.end(m), g;
  }, n.head = function(s, v, m) {
    var g = n("HEAD", s);
    return typeof v == "function" && (m = v, v = null), v && g.query(v), m && g.end(m), g;
  }, n.options = function(s, v, m) {
    var g = n("OPTIONS", s);
    return typeof v == "function" && (m = v, v = null), v && g.send(v), m && g.end(m), g;
  };
  function p(s, v, m) {
    var g = n("DELETE", s);
    return typeof v == "function" && (m = v, v = null), v && g.send(v), m && g.end(m), g;
  }
  n.del = p, n.delete = p, n.patch = function(s, v, m) {
    var g = n("PATCH", s);
    return typeof v == "function" && (m = v, v = null), v && g.send(v), m && g.end(m), g;
  }, n.post = function(s, v, m) {
    var g = n("POST", s);
    return typeof v == "function" && (m = v, v = null), v && g.send(v), m && g.end(m), g;
  }, n.put = function(s, v, m) {
    var g = n("PUT", s);
    return typeof v == "function" && (m = v, v = null), v && g.send(v), m && g.end(m), g;
  };
})(Z, Z.exports);
var rt = Z.exports;
const nt = {}, it = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nt
}, Symbol.toStringTag, { value: "Module" })), be = /* @__PURE__ */ xe(it);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(rt), c = l(be);
  function l(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function h(t) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
      return typeof r;
    } : function(r) {
      return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, h(t);
  }
  function b(t, r) {
    if (!(t instanceof r))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(t, r) {
    for (var e = 0; e < r.length; e++) {
      var o = r[e];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
    }
  }
  function w(t, r, e) {
    return r && _(t.prototype, r), e && _(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
  }
  function T(t) {
    var r = S(t, "string");
    return h(r) === "symbol" ? r : String(r);
  }
  function S(t, r) {
    if (h(t) !== "object" || t === null)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== void 0) {
      var o = e.call(t, r || "default");
      if (h(o) !== "object")
        return o;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  }
  var O = /* @__PURE__ */ function() {
    function t() {
      var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "https://api.flyo.cloud/nitro/v1";
      b(this, t), this.basePath = r.replace(/\/+$/, ""), this.authentications = {
        ApiToken: {
          type: "apiKey",
          in: "query",
          name: "token"
        }
      }, this.defaultHeaders = {
        "User-Agent": "OpenAPI-Generator/1.0.0-beta.153/Javascript"
      }, this.timeout = 6e4, this.cache = !0, this.enableCookies = !1, typeof window > "u" && (this.agent = new u.default.agent()), this.requestAgent = null, this.plugins = null;
    }
    return w(t, [{
      key: "paramToString",
      value: function(e) {
        return e == null || e == null ? "" : e instanceof Date ? e.toJSON() : t.canBeJsonified(e) ? JSON.stringify(e) : e.toString();
      }
      /**
      * Returns a boolean indicating if the parameter could be JSON.stringified
      * @param param The actual parameter
      * @returns {Boolean} Flag indicating if <code>param</code> can be JSON.stringified
      */
    }, {
      key: "buildUrl",
      value: (
        /**
         * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
         * NOTE: query parameters are not handled here.
         * @param {String} path The path to append to the base URL.
         * @param {Object} pathParams The parameter values to append.
         * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
         * @returns {String} The encoded path with parameter values substituted.
         */
        function(e, o, f) {
          var a = this;
          e.match(/^\//) || (e = "/" + e);
          var y = this.basePath + e;
          return f != null && (y = f + e), y = y.replace(/\{([\w-\.]+)\}/g, function(d, p) {
            var s;
            return o.hasOwnProperty(p) ? s = a.paramToString(o[p]) : s = d, encodeURIComponent(s);
          }), y;
        }
      )
      /**
      * Checks whether the given content type represents JSON.<br>
      * JSON content type examples:<br>
      * <ul>
      * <li>application/json</li>
      * <li>application/json; charset=UTF8</li>
      * <li>APPLICATION/JSON</li>
      * </ul>
      * @param {String} contentType The MIME content type to check.
      * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
      */
    }, {
      key: "isJsonMime",
      value: function(e) {
        return !!(e != null && e.match(/^application\/json(;.*)?$/i));
      }
      /**
      * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
      * @param {Array.<String>} contentTypes
      * @returns {String} The chosen content type, preferring JSON.
      */
    }, {
      key: "jsonPreferredMime",
      value: function(e) {
        for (var o = 0; o < e.length; o++)
          if (this.isJsonMime(e[o]))
            return e[o];
        return e[0];
      }
      /**
      * Checks whether the given parameter value represents file-like content.
      * @param param The parameter to check.
      * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
      */
    }, {
      key: "isFileParam",
      value: function(e) {
        if (typeof Fe == "function") {
          var o;
          try {
            o = be;
          } catch {
          }
          if (o && o.ReadStream && e instanceof o.ReadStream)
            return !0;
        }
        return typeof Buffer == "function" && e instanceof Buffer || typeof Blob == "function" && e instanceof Blob || typeof File == "function" && e instanceof File;
      }
      /**
      * Normalizes parameter values:
      * <ul>
      * <li>remove nils</li>
      * <li>keep files and arrays</li>
      * <li>format to string with `paramToString` for other cases</li>
      * </ul>
      * @param {Object.<String, Object>} params The parameters as object properties.
      * @returns {Object.<String, Object>} normalized parameters.
      */
    }, {
      key: "normalizeParams",
      value: function(e) {
        var o = {};
        for (var f in e)
          if (e.hasOwnProperty(f) && e[f] != null && e[f] != null) {
            var a = e[f];
            this.isFileParam(a) || Array.isArray(a) ? o[f] = a : o[f] = this.paramToString(a);
          }
        return o;
      }
      /**
      * Builds a string representation of an array-type actual parameter, according to the given collection format.
      * @param {Array} param An array parameter.
      * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
      * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
      * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
      */
    }, {
      key: "buildCollectionParam",
      value: function(e, o) {
        if (e == null)
          return null;
        switch (o) {
          case "csv":
            return e.map(this.paramToString, this).join(",");
          case "ssv":
            return e.map(this.paramToString, this).join(" ");
          case "tsv":
            return e.map(this.paramToString, this).join("	");
          case "pipes":
            return e.map(this.paramToString, this).join("|");
          case "multi":
            return e.map(this.paramToString, this);
          case "passthrough":
            return e;
          default:
            throw new Error("Unknown collection format: " + o);
        }
      }
      /**
      * Applies authentication headers to the request.
      * @param {Object} request The request object created by a <code>superagent()</code> call.
      * @param {Array.<String>} authNames An array of authentication method names.
      */
    }, {
      key: "applyAuthToRequest",
      value: function(e, o) {
        var f = this;
        o.forEach(function(a) {
          var y = f.authentications[a];
          switch (y.type) {
            case "basic":
              (y.username || y.password) && e.auth(y.username || "", y.password || "");
              break;
            case "bearer":
              if (y.accessToken) {
                var d = typeof y.accessToken == "function" ? y.accessToken() : y.accessToken;
                e.set({
                  Authorization: "Bearer " + d
                });
              }
              break;
            case "apiKey":
              if (y.apiKey) {
                var p = {};
                y.apiKeyPrefix ? p[y.name] = y.apiKeyPrefix + " " + y.apiKey : p[y.name] = y.apiKey, y.in === "header" ? e.set(p) : e.query(p);
              }
              break;
            case "oauth2":
              y.accessToken && e.set({
                Authorization: "Bearer " + y.accessToken
              });
              break;
            default:
              throw new Error("Unknown authentication type: " + y.type);
          }
        });
      }
      /**
       * Deserializes an HTTP response body into a value of the specified type.
       * @param {Object} response A SuperAgent response object.
       * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
       * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
       * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
       * all properties on <code>data<code> will be converted to this type.
       * @returns A value of the specified type.
       */
    }, {
      key: "deserialize",
      value: function(e, o) {
        if (e == null || o == null || e.status == 204)
          return null;
        var f = e.body;
        return (f == null || h(f) === "object" && typeof f.length > "u" && !Object.keys(f).length) && (f = e.text), t.convertToType(f, o);
      }
      /**
       * Invokes the REST service using the supplied settings and parameters.
       * @param {String} path The base URL to invoke.
       * @param {String} httpMethod The HTTP method to use.
       * @param {Object.<String, String>} pathParams A map of path parameters and their values.
       * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
       * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
       * @param {Object.<String, Object>} formParams A map of form parameters and their values.
       * @param {Object} bodyParam The value to pass as the request body.
       * @param {Array.<String>} authNames An array of authentication type names.
       * @param {Array.<String>} contentTypes An array of request MIME types.
       * @param {Array.<String>} accepts An array of acceptable response MIME types.
       * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
       * constructor for a complex type.
       * @param {String} apiBasePath base path defined in the operation/path level to override the default one
       * @returns {Promise} A {@link https://www.promisejs.org/|Promise} object.
       */
    }, {
      key: "callApi",
      value: function(e, o, f, a, y, d, p, s, v, m, g, P) {
        var A = this, N = this.buildUrl(e, f, P), k = (0, u.default)(o, N);
        if (this.plugins !== null)
          for (var R in this.plugins)
            this.plugins.hasOwnProperty(R) && k.use(this.plugins[R]);
        this.applyAuthToRequest(k, s), o.toUpperCase() === "GET" && this.cache === !1 && (a._ = (/* @__PURE__ */ new Date()).getTime()), k.query(this.normalizeParams(a)), k.set(this.defaultHeaders).set(this.normalizeParams(y)), this.requestAgent && k.agent(this.requestAgent), k.timeout(this.timeout);
        var q = this.jsonPreferredMime(v);
        if (q && q != "multipart/form-data" && k.type(q), q === "application/x-www-form-urlencoded")
          k.send(c.default.stringify(this.normalizeParams(d)));
        else if (q == "multipart/form-data") {
          var G = this.normalizeParams(d);
          for (var F in G)
            if (G.hasOwnProperty(F)) {
              var I = G[F];
              this.isFileParam(I) ? k.attach(F, I) : Array.isArray(I) && I.length && this.isFileParam(I[0]) ? I.forEach(function(V) {
                return k.attach(F, V);
              }) : k.field(F, I);
            }
        } else
          p != null && (k.header["Content-Type"] || k.type("application/json"), k.send(p));
        var de = this.jsonPreferredMime(m);
        return de && k.accept(de), g === "Blob" ? k.responseType("blob") : g === "String" && k.responseType("text"), this.enableCookies && (typeof window > "u" ? this.agent._attachCookies(k) : k.withCredentials()), new Promise(function(V, ge) {
          k.end(function(_e, J) {
            if (_e) {
              var x = {};
              J && (x.status = J.status, x.statusText = J.statusText, x.body = J.body, x.response = J), x.error = _e, ge(x);
            } else
              try {
                var ze = A.deserialize(J, g);
                A.enableCookies && typeof window > "u" && A.agent._saveCookies(J), V({
                  data: ze,
                  response: J
                });
              } catch (Be) {
                ge(Be);
              }
          });
        });
      }
      /**
      * Parses an ISO-8601 string representation or epoch representation of a date value.
      * @param {String} str The date value as a string.
      * @returns {Date} The parsed date object.
      */
    }, {
      key: "hostSettings",
      value: (
        /**
          * Gets an array of host settings
          * @returns An array of host settings
          */
        function() {
          return [{
            url: "https://api.flyo.cloud/nitro/{version}",
            description: "Production Server",
            variables: {
              version: {
                description: "The api version currently supported is `v1`",
                default_value: "v1"
              }
            }
          }];
        }
      )
    }, {
      key: "getBasePathFromSettings",
      value: function(e) {
        var o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, f = this.hostSettings();
        if (e < 0 || e >= f.length)
          throw new Error("Invalid index " + e + " when selecting the host settings. Must be less than " + f.length);
        var a = f[e], y = a.url;
        for (var d in a.variables)
          if (d in o) {
            var p = a.variables[d];
            if (!("enum_values" in p) || p.enum_values.includes(o[d]))
              y = y.replace("{" + d + "}", o[d]);
            else
              throw new Error("The variable `" + d + "` in the host URL has invalid value " + o[d] + ". Must be " + a.variables[d].enum_values + ".");
          } else
            y = y.replace("{" + d + "}", a.variables[d].default_value);
        return y;
      }
      /**
      * Constructs a new map or array model from REST data.
      * @param data {Object|Array} The REST data.
      * @param obj {Object|Array} The target object or array.
      */
    }], [{
      key: "canBeJsonified",
      value: function(e) {
        if (typeof e != "string" && h(e) !== "object")
          return !1;
        try {
          var o = e.toString();
          return o === "[object Object]" || o === "[object Array]";
        } catch {
          return !1;
        }
      }
    }, {
      key: "parseDate",
      value: function(e) {
        return isNaN(e) ? new Date(e.replace(/(\d)(T)(\d)/i, "$1 $3")) : /* @__PURE__ */ new Date(+e);
      }
      /**
      * Converts a value to the specified type.
      * @param {(String|Object)} data The data to convert, as a string or object.
      * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
      * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
      * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
      * all properties on <code>data<code> will be converted to this type.
      * @returns An instance of the specified type or null or undefined if data is null or undefined.
      */
    }, {
      key: "convertToType",
      value: function(e, o) {
        if (e == null)
          return e;
        switch (o) {
          case "Boolean":
            return !!e;
          case "Integer":
            return parseInt(e, 10);
          case "Number":
            return parseFloat(e);
          case "String":
            return String(e);
          case "Date":
            return t.parseDate(String(e));
          case "Blob":
            return e;
          default:
            if (o === Object)
              return e;
            if (typeof o.constructFromObject == "function")
              return o.constructFromObject(e);
            if (Array.isArray(o)) {
              var f = o[0];
              return e.map(function(m) {
                return t.convertToType(m, f);
              });
            } else if (h(o) === "object") {
              var a, y;
              for (var d in o)
                if (o.hasOwnProperty(d)) {
                  a = d, y = o[d];
                  break;
                }
              var p = {};
              for (var d in e)
                if (e.hasOwnProperty(d)) {
                  var s = t.convertToType(d, a), v = t.convertToType(e[d], y);
                  p[s] = v;
                }
              return p;
            } else
              return e;
        }
      }
    }, {
      key: "constructFromObject",
      value: function(e, o, f) {
        if (Array.isArray(e))
          for (var a = 0; a < e.length; a++)
            e.hasOwnProperty(a) && (o[a] = t.convertToType(e[a], f));
        else
          for (var y in e)
            e.hasOwnProperty(y) && (o[y] = t.convertToType(e[y], f));
      }
    }]), t;
  }();
  O.CollectionFormatEnum = {
    /**
     * Comma-separated values. Value: <code>csv</code>
     * @const
     */
    CSV: ",",
    /**
     * Space-separated values. Value: <code>ssv</code>
     * @const
     */
    SSV: " ",
    /**
     * Tab-separated values. Value: <code>tsv</code>
     * @const
     */
    TSV: "	",
    /**
     * Pipe(|)-separated values. Value: <code>pipes</code>
     * @const
     */
    PIPES: "|",
    /**
     * Native array. Value: <code>multi</code>
     * @const
     */
    MULTI: "multi"
  }, O.instance = new O();
  var n = O;
  i.default = n;
})(C);
var Q = {}, Y = {}, we;
function Ne() {
  return we || (we = 1, function(i) {
    Object.defineProperty(i, "__esModule", {
      value: !0
    }), i.default = void 0;
    var u = l(C), c = l(ie());
    function l(o) {
      return o && o.__esModule ? o : { default: o };
    }
    function h(o) {
      "@babel/helpers - typeof";
      return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(f) {
        return typeof f;
      } : function(f) {
        return f && typeof Symbol == "function" && f.constructor === Symbol && f !== Symbol.prototype ? "symbol" : typeof f;
      }, h(o);
    }
    function b(o, f) {
      var a = typeof Symbol < "u" && o[Symbol.iterator] || o["@@iterator"];
      if (!a) {
        if (Array.isArray(o) || (a = _(o)) || f && o && typeof o.length == "number") {
          a && (o = a);
          var y = 0, d = function() {
          };
          return { s: d, n: function() {
            return y >= o.length ? { done: !0 } : { done: !1, value: o[y++] };
          }, e: function(g) {
            throw g;
          }, f: d };
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      var p = !0, s = !1, v;
      return { s: function() {
        a = a.call(o);
      }, n: function() {
        var g = a.next();
        return p = g.done, g;
      }, e: function(g) {
        s = !0, v = g;
      }, f: function() {
        try {
          !p && a.return != null && a.return();
        } finally {
          if (s)
            throw v;
        }
      } };
    }
    function _(o, f) {
      if (o) {
        if (typeof o == "string")
          return w(o, f);
        var a = Object.prototype.toString.call(o).slice(8, -1);
        if (a === "Object" && o.constructor && (a = o.constructor.name), a === "Map" || a === "Set")
          return Array.from(o);
        if (a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))
          return w(o, f);
      }
    }
    function w(o, f) {
      (f == null || f > o.length) && (f = o.length);
      for (var a = 0, y = new Array(f); a < f; a++)
        y[a] = o[a];
      return y;
    }
    function T(o, f) {
      if (!(o instanceof f))
        throw new TypeError("Cannot call a class as a function");
    }
    function S(o, f) {
      for (var a = 0; a < f.length; a++) {
        var y = f[a];
        y.enumerable = y.enumerable || !1, y.configurable = !0, "value" in y && (y.writable = !0), Object.defineProperty(o, n(y.key), y);
      }
    }
    function O(o, f, a) {
      return f && S(o.prototype, f), a && S(o, a), Object.defineProperty(o, "prototype", { writable: !1 }), o;
    }
    function n(o) {
      var f = t(o, "string");
      return h(f) === "symbol" ? f : String(f);
    }
    function t(o, f) {
      if (h(o) !== "object" || o === null)
        return o;
      var a = o[Symbol.toPrimitive];
      if (a !== void 0) {
        var y = a.call(o, f || "default");
        if (h(y) !== "object")
          return y;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (f === "string" ? String : Number)(o);
    }
    var r = /* @__PURE__ */ function() {
      function o() {
        T(this, o), o.initialize(this);
      }
      return O(o, null, [{
        key: "initialize",
        value: function(a) {
        }
        /**
         * Constructs a <code>BlockSlots</code> from a plain JavaScript object, optionally creating a new instance.
         * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
         * @param {Object} data The plain JavaScript object bearing properties of interest.
         * @param {module:model/BlockSlots} obj Optional instance to populate.
         * @return {module:model/BlockSlots} The populated <code>BlockSlots</code> instance.
         */
      }, {
        key: "constructFromObject",
        value: function(a, y) {
          return a && (y = y || new o(), a.hasOwnProperty("identifier") && (y.identifier = u.default.convertToType(a.identifier, "String")), a.hasOwnProperty("content") && (y.content = u.default.convertToType(a.content, [c.default]))), y;
        }
        /**
         * Validates the JSON data with respect to <code>BlockSlots</code>.
         * @param {Object} data The plain JavaScript object bearing properties of interest.
         * @return {boolean} to indicate whether the JSON data is valid with respect to <code>BlockSlots</code>.
         */
      }, {
        key: "validateJSON",
        value: function(a) {
          if (a.identifier && !(typeof a.identifier == "string" || a.identifier instanceof String))
            throw new Error("Expected the field `identifier` to be a primitive type in the JSON string but got " + a.identifier);
          if (a.content) {
            if (!Array.isArray(a.content))
              throw new Error("Expected the field `content` to be an array in the JSON data but got " + a.content);
            var y = b(a.content), d;
            try {
              for (y.s(); !(d = y.n()).done; ) {
                var p = d.value;
                c.default.validateJsonObject(p);
              }
            } catch (s) {
              y.e(s);
            } finally {
              y.f();
            }
          }
          return !0;
        }
      }]), o;
    }();
    r.prototype.identifier = void 0, r.prototype.content = void 0;
    var e = r;
    i.default = e;
  }(Y)), Y;
}
var Se;
function ie() {
  return Se || (Se = 1, function(i) {
    Object.defineProperty(i, "__esModule", {
      value: !0
    }), i.default = void 0;
    var u = l(C), c = l(Ne());
    function l(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function h(t) {
      "@babel/helpers - typeof";
      return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, h(t);
    }
    function b(t, r) {
      if (!(t instanceof r))
        throw new TypeError("Cannot call a class as a function");
    }
    function _(t, r) {
      for (var e = 0; e < r.length; e++) {
        var o = r[e];
        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
      }
    }
    function w(t, r, e) {
      return r && _(t.prototype, r), e && _(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
    }
    function T(t) {
      var r = S(t, "string");
      return h(r) === "symbol" ? r : String(r);
    }
    function S(t, r) {
      if (h(t) !== "object" || t === null)
        return t;
      var e = t[Symbol.toPrimitive];
      if (e !== void 0) {
        var o = e.call(t, r || "default");
        if (h(o) !== "object")
          return o;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (r === "string" ? String : Number)(t);
    }
    var O = /* @__PURE__ */ function() {
      function t() {
        b(this, t), t.initialize(this);
      }
      return w(t, null, [{
        key: "initialize",
        value: function(e) {
        }
        /**
         * Constructs a <code>Block</code> from a plain JavaScript object, optionally creating a new instance.
         * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
         * @param {Object} data The plain JavaScript object bearing properties of interest.
         * @param {module:model/Block} obj Optional instance to populate.
         * @return {module:model/Block} The populated <code>Block</code> instance.
         */
      }, {
        key: "constructFromObject",
        value: function(e, o) {
          return e && (o = o || new t(), e.hasOwnProperty("items") && (o.items = u.default.convertToType(e.items, [Object])), e.hasOwnProperty("content") && (o.content = u.default.convertToType(e.content, Object)), e.hasOwnProperty("config") && (o.config = u.default.convertToType(e.config, Object)), e.hasOwnProperty("identifier") && (o.identifier = u.default.convertToType(e.identifier, "String")), e.hasOwnProperty("uid") && (o.uid = u.default.convertToType(e.uid, "String")), e.hasOwnProperty("component") && (o.component = u.default.convertToType(e.component, "String")), e.hasOwnProperty("slots") && (o.slots = u.default.convertToType(e.slots, {
            String: c.default
          }))), o;
        }
        /**
         * Validates the JSON data with respect to <code>Block</code>.
         * @param {Object} data The plain JavaScript object bearing properties of interest.
         * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Block</code>.
         */
      }, {
        key: "validateJSON",
        value: function(e) {
          if (!Array.isArray(e.items))
            throw new Error("Expected the field `items` to be an array in the JSON data but got " + e.items);
          if (e.identifier && !(typeof e.identifier == "string" || e.identifier instanceof String))
            throw new Error("Expected the field `identifier` to be a primitive type in the JSON string but got " + e.identifier);
          if (e.uid && !(typeof e.uid == "string" || e.uid instanceof String))
            throw new Error("Expected the field `uid` to be a primitive type in the JSON string but got " + e.uid);
          if (e.component && !(typeof e.component == "string" || e.component instanceof String))
            throw new Error("Expected the field `component` to be a primitive type in the JSON string but got " + e.component);
          return !0;
        }
      }]), t;
    }();
    O.prototype.items = void 0, O.prototype.content = void 0, O.prototype.config = void 0, O.prototype.identifier = void 0, O.prototype.uid = void 0, O.prototype.component = void 0, O.prototype.slots = void 0;
    var n = O;
    i.default = n;
  }(Q)), Q;
}
var oe = {}, ue = {}, fe = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function l(e) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o) {
      return typeof o;
    } : function(o) {
      return o && typeof Symbol == "function" && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, l(e);
  }
  function h(e, o) {
    var f = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
    if (!f) {
      if (Array.isArray(e) || (f = b(e)) || o && e && typeof e.length == "number") {
        f && (e = f);
        var a = 0, y = function() {
        };
        return { s: y, n: function() {
          return a >= e.length ? { done: !0 } : { done: !1, value: e[a++] };
        }, e: function(m) {
          throw m;
        }, f: y };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var d = !0, p = !1, s;
    return { s: function() {
      f = f.call(e);
    }, n: function() {
      var m = f.next();
      return d = m.done, m;
    }, e: function(m) {
      p = !0, s = m;
    }, f: function() {
      try {
        !d && f.return != null && f.return();
      } finally {
        if (p)
          throw s;
      }
    } };
  }
  function b(e, o) {
    if (e) {
      if (typeof e == "string")
        return _(e, o);
      var f = Object.prototype.toString.call(e).slice(8, -1);
      if (f === "Object" && e.constructor && (f = e.constructor.name), f === "Map" || f === "Set")
        return Array.from(e);
      if (f === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(f))
        return _(e, o);
    }
  }
  function _(e, o) {
    (o == null || o > e.length) && (o = e.length);
    for (var f = 0, a = new Array(o); f < o; f++)
      a[f] = e[f];
    return a;
  }
  function w(e, o) {
    if (!(e instanceof o))
      throw new TypeError("Cannot call a class as a function");
  }
  function T(e, o) {
    for (var f = 0; f < o.length; f++) {
      var a = o[f];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, O(a.key), a);
    }
  }
  function S(e, o, f) {
    return o && T(e.prototype, o), f && T(e, f), Object.defineProperty(e, "prototype", { writable: !1 }), e;
  }
  function O(e) {
    var o = n(e, "string");
    return l(o) === "symbol" ? o : String(o);
  }
  function n(e, o) {
    if (l(e) !== "object" || e === null)
      return e;
    var f = e[Symbol.toPrimitive];
    if (f !== void 0) {
      var a = f.call(e, o || "default");
      if (l(a) !== "object")
        return a;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (o === "string" ? String : Number)(e);
  }
  var t = /* @__PURE__ */ function() {
    function e() {
      w(this, e), e.initialize(this);
    }
    return S(e, null, [{
      key: "initialize",
      value: function(f) {
      }
      /**
       * Constructs a <code>PagesInner</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/PagesInner} obj Optional instance to populate.
       * @return {module:model/PagesInner} The populated <code>PagesInner</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(f, a) {
        return f && (a = a || new e(), f.hasOwnProperty("type") && (a.type = u.default.convertToType(f.type, "String")), f.hasOwnProperty("target") && (a.target = u.default.convertToType(f.target, "String")), f.hasOwnProperty("label") && (a.label = u.default.convertToType(f.label, "String")), f.hasOwnProperty("href") && (a.href = u.default.convertToType(f.href, "String")), f.hasOwnProperty("slug") && (a.slug = u.default.convertToType(f.slug, "String")), f.hasOwnProperty("properties") && (a.properties = u.default.convertToType(f.properties, {
          String: Object
        })), f.hasOwnProperty("children") && (a.children = u.default.convertToType(f.children, [e]))), a;
      }
      /**
       * Validates the JSON data with respect to <code>PagesInner</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>PagesInner</code>.
       */
    }, {
      key: "validateJSON",
      value: function(f) {
        if (f.type && !(typeof f.type == "string" || f.type instanceof String))
          throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + f.type);
        if (f.target && !(typeof f.target == "string" || f.target instanceof String))
          throw new Error("Expected the field `target` to be a primitive type in the JSON string but got " + f.target);
        if (f.label && !(typeof f.label == "string" || f.label instanceof String))
          throw new Error("Expected the field `label` to be a primitive type in the JSON string but got " + f.label);
        if (f.href && !(typeof f.href == "string" || f.href instanceof String))
          throw new Error("Expected the field `href` to be a primitive type in the JSON string but got " + f.href);
        if (f.slug && !(typeof f.slug == "string" || f.slug instanceof String))
          throw new Error("Expected the field `slug` to be a primitive type in the JSON string but got " + f.slug);
        if (f.children) {
          if (!Array.isArray(f.children))
            throw new Error("Expected the field `children` to be an array in the JSON data but got " + f.children);
          var a = h(f.children), y;
          try {
            for (a.s(); !(y = a.n()).done; ) {
              var d = y.value;
              e.validateJsonObject(d);
            }
          } catch (p) {
            a.e(p);
          } finally {
            a.f();
          }
        }
        return !0;
      }
    }]), e;
  }();
  t.prototype.type = void 0, t.prototype.target = void 0, t.prototype.label = void 0, t.prototype.href = void 0, t.prototype.slug = void 0, t.prototype.properties = void 0, t.prototype.children = void 0;
  var r = t;
  i.default = r;
})(fe);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l(fe);
  function l(o) {
    return o && o.__esModule ? o : { default: o };
  }
  function h(o) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(f) {
      return typeof f;
    } : function(f) {
      return f && typeof Symbol == "function" && f.constructor === Symbol && f !== Symbol.prototype ? "symbol" : typeof f;
    }, h(o);
  }
  function b(o, f) {
    var a = typeof Symbol < "u" && o[Symbol.iterator] || o["@@iterator"];
    if (!a) {
      if (Array.isArray(o) || (a = _(o)) || f && o && typeof o.length == "number") {
        a && (o = a);
        var y = 0, d = function() {
        };
        return { s: d, n: function() {
          return y >= o.length ? { done: !0 } : { done: !1, value: o[y++] };
        }, e: function(g) {
          throw g;
        }, f: d };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var p = !0, s = !1, v;
    return { s: function() {
      a = a.call(o);
    }, n: function() {
      var g = a.next();
      return p = g.done, g;
    }, e: function(g) {
      s = !0, v = g;
    }, f: function() {
      try {
        !p && a.return != null && a.return();
      } finally {
        if (s)
          throw v;
      }
    } };
  }
  function _(o, f) {
    if (o) {
      if (typeof o == "string")
        return w(o, f);
      var a = Object.prototype.toString.call(o).slice(8, -1);
      if (a === "Object" && o.constructor && (a = o.constructor.name), a === "Map" || a === "Set")
        return Array.from(o);
      if (a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))
        return w(o, f);
    }
  }
  function w(o, f) {
    (f == null || f > o.length) && (f = o.length);
    for (var a = 0, y = new Array(f); a < f; a++)
      y[a] = o[a];
    return y;
  }
  function T(o, f) {
    if (!(o instanceof f))
      throw new TypeError("Cannot call a class as a function");
  }
  function S(o, f) {
    for (var a = 0; a < f.length; a++) {
      var y = f[a];
      y.enumerable = y.enumerable || !1, y.configurable = !0, "value" in y && (y.writable = !0), Object.defineProperty(o, n(y.key), y);
    }
  }
  function O(o, f, a) {
    return f && S(o.prototype, f), a && S(o, a), Object.defineProperty(o, "prototype", { writable: !1 }), o;
  }
  function n(o) {
    var f = t(o, "string");
    return h(f) === "symbol" ? f : String(f);
  }
  function t(o, f) {
    if (h(o) !== "object" || o === null)
      return o;
    var a = o[Symbol.toPrimitive];
    if (a !== void 0) {
      var y = a.call(o, f || "default");
      if (h(y) !== "object")
        return y;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (f === "string" ? String : Number)(o);
  }
  var r = /* @__PURE__ */ function() {
    function o() {
      T(this, o), o.initialize(this);
    }
    return O(o, null, [{
      key: "initialize",
      value: function(a) {
      }
      /**
       * Constructs a <code>ConfigResponseContainersValue</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/ConfigResponseContainersValue} obj Optional instance to populate.
       * @return {module:model/ConfigResponseContainersValue} The populated <code>ConfigResponseContainersValue</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(a, y) {
        return a && (y = y || new o(), a.hasOwnProperty("items") && (y.items = u.default.convertToType(a.items, [c.default])), a.hasOwnProperty("uid") && (y.uid = u.default.convertToType(a.uid, "String")), a.hasOwnProperty("identifier") && (y.identifier = u.default.convertToType(a.identifier, "String")), a.hasOwnProperty("label") && (y.label = u.default.convertToType(a.label, "String"))), y;
      }
      /**
       * Validates the JSON data with respect to <code>ConfigResponseContainersValue</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ConfigResponseContainersValue</code>.
       */
    }, {
      key: "validateJSON",
      value: function(a) {
        if (a.items) {
          if (!Array.isArray(a.items))
            throw new Error("Expected the field `items` to be an array in the JSON data but got " + a.items);
          var y = b(a.items), d;
          try {
            for (y.s(); !(d = y.n()).done; ) {
              var p = d.value;
              c.default.validateJsonObject(p);
            }
          } catch (s) {
            y.e(s);
          } finally {
            y.f();
          }
        }
        if (a.uid && !(typeof a.uid == "string" || a.uid instanceof String))
          throw new Error("Expected the field `uid` to be a primitive type in the JSON string but got " + a.uid);
        if (a.identifier && !(typeof a.identifier == "string" || a.identifier instanceof String))
          throw new Error("Expected the field `identifier` to be a primitive type in the JSON string but got " + a.identifier);
        if (a.label && !(typeof a.label == "string" || a.label instanceof String))
          throw new Error("Expected the field `label` to be a primitive type in the JSON string but got " + a.label);
        return !0;
      }
    }]), o;
  }();
  r.prototype.items = void 0, r.prototype.uid = void 0, r.prototype.identifier = void 0, r.prototype.label = void 0;
  var e = r;
  i.default = e;
})(ue);
var le = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function l(n) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, l(n);
  }
  function h(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function _(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function w(n) {
    var t = T(n, "string");
    return l(t) === "symbol" ? t : String(t);
  }
  function T(n, t) {
    if (l(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (l(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var S = /* @__PURE__ */ function() {
    function n() {
      h(this, n), n.initialize(this);
    }
    return _(n, null, [{
      key: "initialize",
      value: function(r) {
      }
      /**
       * Constructs a <code>ConfigResponseNitro</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/ConfigResponseNitro} obj Optional instance to populate.
       * @return {module:model/ConfigResponseNitro} The populated <code>ConfigResponseNitro</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(r, e) {
        return r && (e = e || new n(), r.hasOwnProperty("domain") && (e.domain = u.default.convertToType(r.domain, "String")), r.hasOwnProperty("slug") && (e.slug = u.default.convertToType(r.slug, "String")), r.hasOwnProperty("version") && (e.version = u.default.convertToType(r.version, "Number")), r.hasOwnProperty("updated_at") && (e.updated_at = u.default.convertToType(r.updated_at, "Number")), r.hasOwnProperty("language") && (e.language = u.default.convertToType(r.language, "String"))), e;
      }
      /**
       * Validates the JSON data with respect to <code>ConfigResponseNitro</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ConfigResponseNitro</code>.
       */
    }, {
      key: "validateJSON",
      value: function(r) {
        if (r.domain && !(typeof r.domain == "string" || r.domain instanceof String))
          throw new Error("Expected the field `domain` to be a primitive type in the JSON string but got " + r.domain);
        if (r.slug && !(typeof r.slug == "string" || r.slug instanceof String))
          throw new Error("Expected the field `slug` to be a primitive type in the JSON string but got " + r.slug);
        if (r.language && !(typeof r.language == "string" || r.language instanceof String))
          throw new Error("Expected the field `language` to be a primitive type in the JSON string but got " + r.language);
        return !0;
      }
    }]), n;
  }();
  S.prototype.domain = void 0, S.prototype.slug = void 0, S.prototype.version = void 0, S.prototype.updated_at = void 0, S.prototype.language = void 0;
  var O = S;
  i.default = O;
})(le);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = h(C), c = h(ue), l = h(le);
  function h(r) {
    return r && r.__esModule ? r : { default: r };
  }
  function b(r) {
    "@babel/helpers - typeof";
    return b = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
      return typeof e;
    } : function(e) {
      return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    }, b(r);
  }
  function _(r, e) {
    if (!(r instanceof e))
      throw new TypeError("Cannot call a class as a function");
  }
  function w(r, e) {
    for (var o = 0; o < e.length; o++) {
      var f = e[o];
      f.enumerable = f.enumerable || !1, f.configurable = !0, "value" in f && (f.writable = !0), Object.defineProperty(r, S(f.key), f);
    }
  }
  function T(r, e, o) {
    return e && w(r.prototype, e), o && w(r, o), Object.defineProperty(r, "prototype", { writable: !1 }), r;
  }
  function S(r) {
    var e = O(r, "string");
    return b(e) === "symbol" ? e : String(e);
  }
  function O(r, e) {
    if (b(r) !== "object" || r === null)
      return r;
    var o = r[Symbol.toPrimitive];
    if (o !== void 0) {
      var f = o.call(r, e || "default");
      if (b(f) !== "object")
        return f;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (e === "string" ? String : Number)(r);
  }
  var n = /* @__PURE__ */ function() {
    function r() {
      _(this, r), r.initialize(this);
    }
    return T(r, null, [{
      key: "initialize",
      value: function(o) {
      }
      /**
       * Constructs a <code>ConfigResponse</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/ConfigResponse} obj Optional instance to populate.
       * @return {module:model/ConfigResponse} The populated <code>ConfigResponse</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(o, f) {
        return o && (f = f || new r(), o.hasOwnProperty("nitro") && (f.nitro = l.default.constructFromObject(o.nitro)), o.hasOwnProperty("pages") && (f.pages = u.default.convertToType(o.pages, ["String"])), o.hasOwnProperty("containers") && (f.containers = u.default.convertToType(o.containers, {
          String: c.default
        })), o.hasOwnProperty("globals") && (f.globals = u.default.convertToType(o.globals, Object))), f;
      }
      /**
       * Validates the JSON data with respect to <code>ConfigResponse</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ConfigResponse</code>.
       */
    }, {
      key: "validateJSON",
      value: function(o) {
        if (o.nitro && l.default.validateJSON(o.nitro), !Array.isArray(o.pages))
          throw new Error("Expected the field `pages` to be an array in the JSON data but got " + o.pages);
        return !0;
      }
    }]), r;
  }();
  n.prototype.nitro = void 0, n.prototype.pages = void 0, n.prototype.containers = void 0, n.prototype.globals = void 0;
  var t = n;
  i.default = t;
})(oe);
var ae = {}, se = {}, ye = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function l(n) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, l(n);
  }
  function h(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function _(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function w(n) {
    var t = T(n, "string");
    return l(t) === "symbol" ? t : String(t);
  }
  function T(n, t) {
    if (l(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (l(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var S = /* @__PURE__ */ function() {
    function n() {
      h(this, n), n.initialize(this);
    }
    return _(n, null, [{
      key: "initialize",
      value: function(r) {
      }
      /**
       * Constructs a <code>EntityMetric</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/EntityMetric} obj Optional instance to populate.
       * @return {module:model/EntityMetric} The populated <code>EntityMetric</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(r, e) {
        return r && (e = e || new n(), r.hasOwnProperty("api") && (e.api = u.default.convertToType(r.api, "String")), r.hasOwnProperty("image") && (e.image = u.default.convertToType(r.image, "String"))), e;
      }
      /**
       * Validates the JSON data with respect to <code>EntityMetric</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>EntityMetric</code>.
       */
    }, {
      key: "validateJSON",
      value: function(r) {
        if (r.api && !(typeof r.api == "string" || r.api instanceof String))
          throw new Error("Expected the field `api` to be a primitive type in the JSON string but got " + r.api);
        if (r.image && !(typeof r.image == "string" || r.image instanceof String))
          throw new Error("Expected the field `image` to be a primitive type in the JSON string but got " + r.image);
        return !0;
      }
    }]), n;
  }();
  S.prototype.api = void 0, S.prototype.image = void 0;
  var O = S;
  i.default = O;
})(ye);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l(ye);
  function l(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function h(t) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
      return typeof r;
    } : function(r) {
      return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, h(t);
  }
  function b(t, r) {
    if (!(t instanceof r))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(t, r) {
    for (var e = 0; e < r.length; e++) {
      var o = r[e];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
    }
  }
  function w(t, r, e) {
    return r && _(t.prototype, r), e && _(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
  }
  function T(t) {
    var r = S(t, "string");
    return h(r) === "symbol" ? r : String(r);
  }
  function S(t, r) {
    if (h(t) !== "object" || t === null)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== void 0) {
      var o = e.call(t, r || "default");
      if (h(o) !== "object")
        return o;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  }
  var O = /* @__PURE__ */ function() {
    function t() {
      b(this, t), t.initialize(this);
    }
    return w(t, null, [{
      key: "initialize",
      value: function(e) {
      }
      /**
       * Constructs a <code>EntityInterface</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/EntityInterface} obj Optional instance to populate.
       * @return {module:model/EntityInterface} The populated <code>EntityInterface</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(e, o) {
        return e && (o = o || new t(), e.hasOwnProperty("_version") && (o._version = u.default.convertToType(e._version, "Number")), e.hasOwnProperty("entity_metric") && (o.entity_metric = c.default.constructFromObject(e.entity_metric)), e.hasOwnProperty("entity_unique_id") && (o.entity_unique_id = u.default.convertToType(e.entity_unique_id, "String")), e.hasOwnProperty("entity_id") && (o.entity_id = u.default.convertToType(e.entity_id, "String")), e.hasOwnProperty("entity_image") && (o.entity_image = u.default.convertToType(e.entity_image, "String")), e.hasOwnProperty("entity_slug") && (o.entity_slug = u.default.convertToType(e.entity_slug, "String")), e.hasOwnProperty("entity_teaser") && (o.entity_teaser = u.default.convertToType(e.entity_teaser, "String")), e.hasOwnProperty("entity_time_end") && (o.entity_time_end = u.default.convertToType(e.entity_time_end, "String")), e.hasOwnProperty("entity_time_start") && (o.entity_time_start = u.default.convertToType(e.entity_time_start, "String")), e.hasOwnProperty("entity_title") && (o.entity_title = u.default.convertToType(e.entity_title, "String")), e.hasOwnProperty("entity_type") && (o.entity_type = u.default.convertToType(e.entity_type, "String")), e.hasOwnProperty("entity_type_id") && (o.entity_type_id = u.default.convertToType(e.entity_type_id, "Number")), e.hasOwnProperty("updated_at") && (o.updated_at = u.default.convertToType(e.updated_at, "String")), e.hasOwnProperty("routes") && (o.routes = u.default.convertToType(e.routes, {
          String: "String"
        }))), o;
      }
      /**
       * Validates the JSON data with respect to <code>EntityInterface</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>EntityInterface</code>.
       */
    }, {
      key: "validateJSON",
      value: function(e) {
        if (e.entity_metric && c.default.validateJSON(e.entity_metric), e.entity_unique_id && !(typeof e.entity_unique_id == "string" || e.entity_unique_id instanceof String))
          throw new Error("Expected the field `entity_unique_id` to be a primitive type in the JSON string but got " + e.entity_unique_id);
        if (e.entity_id && !(typeof e.entity_id == "string" || e.entity_id instanceof String))
          throw new Error("Expected the field `entity_id` to be a primitive type in the JSON string but got " + e.entity_id);
        if (e.entity_image && !(typeof e.entity_image == "string" || e.entity_image instanceof String))
          throw new Error("Expected the field `entity_image` to be a primitive type in the JSON string but got " + e.entity_image);
        if (e.entity_slug && !(typeof e.entity_slug == "string" || e.entity_slug instanceof String))
          throw new Error("Expected the field `entity_slug` to be a primitive type in the JSON string but got " + e.entity_slug);
        if (e.entity_teaser && !(typeof e.entity_teaser == "string" || e.entity_teaser instanceof String))
          throw new Error("Expected the field `entity_teaser` to be a primitive type in the JSON string but got " + e.entity_teaser);
        if (e.entity_time_end && !(typeof e.entity_time_end == "string" || e.entity_time_end instanceof String))
          throw new Error("Expected the field `entity_time_end` to be a primitive type in the JSON string but got " + e.entity_time_end);
        if (e.entity_time_start && !(typeof e.entity_time_start == "string" || e.entity_time_start instanceof String))
          throw new Error("Expected the field `entity_time_start` to be a primitive type in the JSON string but got " + e.entity_time_start);
        if (e.entity_title && !(typeof e.entity_title == "string" || e.entity_title instanceof String))
          throw new Error("Expected the field `entity_title` to be a primitive type in the JSON string but got " + e.entity_title);
        if (e.entity_type && !(typeof e.entity_type == "string" || e.entity_type instanceof String))
          throw new Error("Expected the field `entity_type` to be a primitive type in the JSON string but got " + e.entity_type);
        if (e.updated_at && !(typeof e.updated_at == "string" || e.updated_at instanceof String))
          throw new Error("Expected the field `updated_at` to be a primitive type in the JSON string but got " + e.updated_at);
        return !0;
      }
    }]), t;
  }();
  O.prototype._version = void 0, O.prototype.entity_metric = void 0, O.prototype.entity_unique_id = void 0, O.prototype.entity_id = void 0, O.prototype.entity_image = void 0, O.prototype.entity_slug = void 0, O.prototype.entity_teaser = void 0, O.prototype.entity_time_end = void 0, O.prototype.entity_time_start = void 0, O.prototype.entity_title = void 0, O.prototype.entity_type = void 0, O.prototype.entity_type_id = void 0, O.prototype.updated_at = void 0, O.prototype.routes = void 0;
  var n = O;
  i.default = n;
})(se);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l(se);
  function l(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function h(t) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
      return typeof r;
    } : function(r) {
      return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, h(t);
  }
  function b(t, r) {
    if (!(t instanceof r))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(t, r) {
    for (var e = 0; e < r.length; e++) {
      var o = r[e];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
    }
  }
  function w(t, r, e) {
    return r && _(t.prototype, r), e && _(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
  }
  function T(t) {
    var r = S(t, "string");
    return h(r) === "symbol" ? r : String(r);
  }
  function S(t, r) {
    if (h(t) !== "object" || t === null)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== void 0) {
      var o = e.call(t, r || "default");
      if (h(o) !== "object")
        return o;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  }
  var O = /* @__PURE__ */ function() {
    function t() {
      b(this, t), t.initialize(this);
    }
    return w(t, null, [{
      key: "initialize",
      value: function(e) {
      }
      /**
       * Constructs a <code>Entity</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Entity} obj Optional instance to populate.
       * @return {module:model/Entity} The populated <code>Entity</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(e, o) {
        return e && (o = o || new t(), e.hasOwnProperty("entity") && (o.entity = c.default.constructFromObject(e.entity)), e.hasOwnProperty("model") && (o.model = u.default.convertToType(e.model, Object)), e.hasOwnProperty("language") && (o.language = u.default.convertToType(e.language, "String"))), o;
      }
      /**
       * Validates the JSON data with respect to <code>Entity</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Entity</code>.
       */
    }, {
      key: "validateJSON",
      value: function(e) {
        if (e.entity && c.default.validateJSON(e.entity), e.language && !(typeof e.language == "string" || e.language instanceof String))
          throw new Error("Expected the field `language` to be a primitive type in the JSON string but got " + e.language);
        return !0;
      }
    }]), t;
  }();
  O.prototype.entity = void 0, O.prototype.model = void 0, O.prototype.language = void 0;
  var n = O;
  i.default = n;
})(ae);
var $ = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function l(n) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, l(n);
  }
  function h(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function _(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function w(n) {
    var t = T(n, "string");
    return l(t) === "symbol" ? t : String(t);
  }
  function T(n, t) {
    if (l(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (l(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var S = /* @__PURE__ */ function() {
    function n() {
      h(this, n), n.initialize(this);
    }
    return _(n, null, [{
      key: "initialize",
      value: function(r) {
      }
      /**
       * Constructs a <code>EntityinterfaceInner</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/EntityinterfaceInner} obj Optional instance to populate.
       * @return {module:model/EntityinterfaceInner} The populated <code>EntityinterfaceInner</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(r, e) {
        return r && (e = e || new n(), r.hasOwnProperty("entity_unique_id") && (e.entity_unique_id = u.default.convertToType(r.entity_unique_id, "String")), r.hasOwnProperty("entity_title") && (e.entity_title = u.default.convertToType(r.entity_title, "String")), r.hasOwnProperty("entity_teaser") && (e.entity_teaser = u.default.convertToType(r.entity_teaser, "String")), r.hasOwnProperty("entity_slug") && (e.entity_slug = u.default.convertToType(r.entity_slug, "String")), r.hasOwnProperty("entity_type") && (e.entity_type = u.default.convertToType(r.entity_type, "String")), r.hasOwnProperty("entity_type_id") && (e.entity_type_id = u.default.convertToType(r.entity_type_id, "Number")), r.hasOwnProperty("entity_time_start") && (e.entity_time_start = u.default.convertToType(r.entity_time_start, "String")), r.hasOwnProperty("entity_image") && (e.entity_image = u.default.convertToType(r.entity_image, "String")), r.hasOwnProperty("routes") && (e.routes = u.default.convertToType(r.routes, {
          String: "String"
        }))), e;
      }
      /**
       * Validates the JSON data with respect to <code>EntityinterfaceInner</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>EntityinterfaceInner</code>.
       */
    }, {
      key: "validateJSON",
      value: function(r) {
        if (r.entity_unique_id && !(typeof r.entity_unique_id == "string" || r.entity_unique_id instanceof String))
          throw new Error("Expected the field `entity_unique_id` to be a primitive type in the JSON string but got " + r.entity_unique_id);
        if (r.entity_title && !(typeof r.entity_title == "string" || r.entity_title instanceof String))
          throw new Error("Expected the field `entity_title` to be a primitive type in the JSON string but got " + r.entity_title);
        if (r.entity_teaser && !(typeof r.entity_teaser == "string" || r.entity_teaser instanceof String))
          throw new Error("Expected the field `entity_teaser` to be a primitive type in the JSON string but got " + r.entity_teaser);
        if (r.entity_slug && !(typeof r.entity_slug == "string" || r.entity_slug instanceof String))
          throw new Error("Expected the field `entity_slug` to be a primitive type in the JSON string but got " + r.entity_slug);
        if (r.entity_type && !(typeof r.entity_type == "string" || r.entity_type instanceof String))
          throw new Error("Expected the field `entity_type` to be a primitive type in the JSON string but got " + r.entity_type);
        if (r.entity_time_start && !(typeof r.entity_time_start == "string" || r.entity_time_start instanceof String))
          throw new Error("Expected the field `entity_time_start` to be a primitive type in the JSON string but got " + r.entity_time_start);
        if (r.entity_image && !(typeof r.entity_image == "string" || r.entity_image instanceof String))
          throw new Error("Expected the field `entity_image` to be a primitive type in the JSON string but got " + r.entity_image);
        return !0;
      }
    }]), n;
  }();
  S.prototype.entity_unique_id = void 0, S.prototype.entity_title = void 0, S.prototype.entity_teaser = void 0, S.prototype.entity_slug = void 0, S.prototype.entity_type = void 0, S.prototype.entity_type_id = void 0, S.prototype.entity_time_start = void 0, S.prototype.entity_image = void 0, S.prototype.routes = void 0;
  var O = S;
  i.default = O;
})($);
var ce = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function l(n) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, l(n);
  }
  function h(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function _(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function w(n) {
    var t = T(n, "string");
    return l(t) === "symbol" ? t : String(t);
  }
  function T(n, t) {
    if (l(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (l(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var S = /* @__PURE__ */ function() {
    function n() {
      h(this, n), n.initialize(this);
    }
    return _(n, null, [{
      key: "initialize",
      value: function(r) {
      }
      /**
       * Constructs a <code>Meta</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Meta} obj Optional instance to populate.
       * @return {module:model/Meta} The populated <code>Meta</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(r, e) {
        return r && (e = e || new n(), r.hasOwnProperty("description") && (e.description = u.default.convertToType(r.description, "String")), r.hasOwnProperty("image") && (e.image = u.default.convertToType(r.image, "String")), r.hasOwnProperty("title") && (e.title = u.default.convertToType(r.title, "String"))), e;
      }
      /**
       * Validates the JSON data with respect to <code>Meta</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Meta</code>.
       */
    }, {
      key: "validateJSON",
      value: function(r) {
        if (r.description && !(typeof r.description == "string" || r.description instanceof String))
          throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + r.description);
        if (r.image && !(typeof r.image == "string" || r.image instanceof String))
          throw new Error("Expected the field `image` to be a primitive type in the JSON string but got " + r.image);
        if (r.title && !(typeof r.title == "string" || r.title instanceof String))
          throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + r.title);
        return !0;
      }
    }]), n;
  }();
  S.prototype.description = void 0, S.prototype.image = void 0, S.prototype.title = void 0;
  var O = S;
  i.default = O;
})(ce);
var pe = {}, he = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function l(n) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, l(n);
  }
  function h(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function _(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function w(n) {
    var t = T(n, "string");
    return l(t) === "symbol" ? t : String(t);
  }
  function T(n, t) {
    if (l(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (l(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var S = /* @__PURE__ */ function() {
    function n() {
      h(this, n), n.initialize(this);
    }
    return _(n, null, [{
      key: "initialize",
      value: function(r) {
      }
      /**
       * Constructs a <code>PageBreadcrumbInner</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/PageBreadcrumbInner} obj Optional instance to populate.
       * @return {module:model/PageBreadcrumbInner} The populated <code>PageBreadcrumbInner</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(r, e) {
        return r && (e = e || new n(), r.hasOwnProperty("slug") && (e.slug = u.default.convertToType(r.slug, "String")), r.hasOwnProperty("title") && (e.title = u.default.convertToType(r.title, "String"))), e;
      }
      /**
       * Validates the JSON data with respect to <code>PageBreadcrumbInner</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>PageBreadcrumbInner</code>.
       */
    }, {
      key: "validateJSON",
      value: function(r) {
        if (r.slug && !(typeof r.slug == "string" || r.slug instanceof String))
          throw new Error("Expected the field `slug` to be a primitive type in the JSON string but got " + r.slug);
        if (r.title && !(typeof r.title == "string" || r.title instanceof String))
          throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + r.title);
        return !0;
      }
    }]), n;
  }();
  S.prototype.slug = void 0, S.prototype.title = void 0;
  var O = S;
  i.default = O;
})(he);
var me = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function l(n) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, l(n);
  }
  function h(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function _(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function w(n) {
    var t = T(n, "string");
    return l(t) === "symbol" ? t : String(t);
  }
  function T(n, t) {
    if (l(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (l(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var S = /* @__PURE__ */ function() {
    function n() {
      h(this, n), n.initialize(this);
    }
    return _(n, null, [{
      key: "initialize",
      value: function(r) {
      }
      /**
       * Constructs a <code>PageProperty</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/PageProperty} obj Optional instance to populate.
       * @return {module:model/PageProperty} The populated <code>PageProperty</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(r, e) {
        return r && (e = e || new n(), r.hasOwnProperty("value") && (e.value = u.default.convertToType(r.value, Object)), r.hasOwnProperty("navigation") && (e.navigation = u.default.convertToType(r.navigation, "Boolean")), r.hasOwnProperty("propagate") && (e.propagate = u.default.convertToType(r.propagate, "Boolean"))), e;
      }
      /**
       * Validates the JSON data with respect to <code>PageProperty</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>PageProperty</code>.
       */
    }, {
      key: "validateJSON",
      value: function(r) {
        return !0;
      }
    }]), n;
  }();
  S.prototype.value = void 0, S.prototype.navigation = void 0, S.prototype.propagate = void 0;
  var O = S;
  i.default = O;
})(me);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = _(C), c = _(ie()), l = _(ce), h = _(he), b = _(me);
  function _(y) {
    return y && y.__esModule ? y : { default: y };
  }
  function w(y) {
    "@babel/helpers - typeof";
    return w = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(d) {
      return typeof d;
    } : function(d) {
      return d && typeof Symbol == "function" && d.constructor === Symbol && d !== Symbol.prototype ? "symbol" : typeof d;
    }, w(y);
  }
  function T(y, d) {
    var p = typeof Symbol < "u" && y[Symbol.iterator] || y["@@iterator"];
    if (!p) {
      if (Array.isArray(y) || (p = S(y)) || d && y && typeof y.length == "number") {
        p && (y = p);
        var s = 0, v = function() {
        };
        return { s: v, n: function() {
          return s >= y.length ? { done: !0 } : { done: !1, value: y[s++] };
        }, e: function(N) {
          throw N;
        }, f: v };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var m = !0, g = !1, P;
    return { s: function() {
      p = p.call(y);
    }, n: function() {
      var N = p.next();
      return m = N.done, N;
    }, e: function(N) {
      g = !0, P = N;
    }, f: function() {
      try {
        !m && p.return != null && p.return();
      } finally {
        if (g)
          throw P;
      }
    } };
  }
  function S(y, d) {
    if (y) {
      if (typeof y == "string")
        return O(y, d);
      var p = Object.prototype.toString.call(y).slice(8, -1);
      if (p === "Object" && y.constructor && (p = y.constructor.name), p === "Map" || p === "Set")
        return Array.from(y);
      if (p === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(p))
        return O(y, d);
    }
  }
  function O(y, d) {
    (d == null || d > y.length) && (d = y.length);
    for (var p = 0, s = new Array(d); p < d; p++)
      s[p] = y[p];
    return s;
  }
  function n(y, d) {
    if (!(y instanceof d))
      throw new TypeError("Cannot call a class as a function");
  }
  function t(y, d) {
    for (var p = 0; p < d.length; p++) {
      var s = d[p];
      s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(y, e(s.key), s);
    }
  }
  function r(y, d, p) {
    return d && t(y.prototype, d), p && t(y, p), Object.defineProperty(y, "prototype", { writable: !1 }), y;
  }
  function e(y) {
    var d = o(y, "string");
    return w(d) === "symbol" ? d : String(d);
  }
  function o(y, d) {
    if (w(y) !== "object" || y === null)
      return y;
    var p = y[Symbol.toPrimitive];
    if (p !== void 0) {
      var s = p.call(y, d || "default");
      if (w(s) !== "object")
        return s;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (d === "string" ? String : Number)(y);
  }
  var f = /* @__PURE__ */ function() {
    function y() {
      n(this, y), y.initialize(this);
    }
    return r(y, null, [{
      key: "initialize",
      value: function(p) {
      }
      /**
       * Constructs a <code>Page</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Page} obj Optional instance to populate.
       * @return {module:model/Page} The populated <code>Page</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(p, s) {
        return p && (s = s || new y(), p.hasOwnProperty("id") && (s.id = u.default.convertToType(p.id, "Number")), p.hasOwnProperty("title") && (s.title = u.default.convertToType(p.title, "String")), p.hasOwnProperty("href") && (s.href = u.default.convertToType(p.href, "String")), p.hasOwnProperty("slug") && (s.slug = u.default.convertToType(p.slug, "String")), p.hasOwnProperty("json") && (s.json = u.default.convertToType(p.json, [c.default])), p.hasOwnProperty("depth") && (s.depth = u.default.convertToType(p.depth, "Number")), p.hasOwnProperty("is_home") && (s.is_home = u.default.convertToType(p.is_home, "Number")), p.hasOwnProperty("created_at") && (s.created_at = u.default.convertToType(p.created_at, "Number")), p.hasOwnProperty("updated_at") && (s.updated_at = u.default.convertToType(p.updated_at, "Number")), p.hasOwnProperty("is_visible") && (s.is_visible = u.default.convertToType(p.is_visible, "Number")), p.hasOwnProperty("meta_json") && (s.meta_json = l.default.constructFromObject(p.meta_json)), p.hasOwnProperty("properties") && (s.properties = u.default.convertToType(p.properties, {
          String: b.default
        })), p.hasOwnProperty("uid") && (s.uid = u.default.convertToType(p.uid, "String")), p.hasOwnProperty("type") && (s.type = u.default.convertToType(p.type, "String")), p.hasOwnProperty("target") && (s.target = u.default.convertToType(p.target, "String")), p.hasOwnProperty("container") && (s.container = u.default.convertToType(p.container, "String")), p.hasOwnProperty("breadcrumb") && (s.breadcrumb = u.default.convertToType(p.breadcrumb, [h.default]))), s;
      }
      /**
       * Validates the JSON data with respect to <code>Page</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Page</code>.
       */
    }, {
      key: "validateJSON",
      value: function(p) {
        if (p.title && !(typeof p.title == "string" || p.title instanceof String))
          throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + p.title);
        if (p.href && !(typeof p.href == "string" || p.href instanceof String))
          throw new Error("Expected the field `href` to be a primitive type in the JSON string but got " + p.href);
        if (p.slug && !(typeof p.slug == "string" || p.slug instanceof String))
          throw new Error("Expected the field `slug` to be a primitive type in the JSON string but got " + p.slug);
        if (p.json) {
          if (!Array.isArray(p.json))
            throw new Error("Expected the field `json` to be an array in the JSON data but got " + p.json);
          var s = T(p.json), v;
          try {
            for (s.s(); !(v = s.n()).done; ) {
              var m = v.value;
              c.default.validateJsonObject(m);
            }
          } catch (N) {
            s.e(N);
          } finally {
            s.f();
          }
        }
        if (p.meta_json && l.default.validateJSON(p.meta_json), p.uid && !(typeof p.uid == "string" || p.uid instanceof String))
          throw new Error("Expected the field `uid` to be a primitive type in the JSON string but got " + p.uid);
        if (p.type && !(typeof p.type == "string" || p.type instanceof String))
          throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + p.type);
        if (p.target && !(typeof p.target == "string" || p.target instanceof String))
          throw new Error("Expected the field `target` to be a primitive type in the JSON string but got " + p.target);
        if (p.container && !(typeof p.container == "string" || p.container instanceof String))
          throw new Error("Expected the field `container` to be a primitive type in the JSON string but got " + p.container);
        if (p.breadcrumb) {
          if (!Array.isArray(p.breadcrumb))
            throw new Error("Expected the field `breadcrumb` to be an array in the JSON data but got " + p.breadcrumb);
          var g = T(p.breadcrumb), P;
          try {
            for (g.s(); !(P = g.n()).done; ) {
              var A = P.value;
              h.default.validateJsonObject(A);
            }
          } catch (N) {
            g.e(N);
          } finally {
            g.f();
          }
        }
        return !0;
      }
    }]), y;
  }();
  f.prototype.id = void 0, f.prototype.title = void 0, f.prototype.href = void 0, f.prototype.slug = void 0, f.prototype.json = void 0, f.prototype.depth = void 0, f.prototype.is_home = void 0, f.prototype.created_at = void 0, f.prototype.updated_at = void 0, f.prototype.is_visible = void 0, f.prototype.meta_json = void 0, f.prototype.properties = void 0, f.prototype.uid = void 0, f.prototype.type = void 0, f.prototype.target = void 0, f.prototype.container = void 0, f.prototype.breadcrumb = void 0;
  var a = f;
  i.default = a;
})(pe);
var ve = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = c(C);
  function c(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function l(n) {
    "@babel/helpers - typeof";
    return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, l(n);
  }
  function h(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function _(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function w(n) {
    var t = T(n, "string");
    return l(t) === "symbol" ? t : String(t);
  }
  function T(n, t) {
    if (l(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (l(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var S = /* @__PURE__ */ function() {
    function n() {
      h(this, n), n.initialize(this);
    }
    return _(n, null, [{
      key: "initialize",
      value: function(r) {
      }
      /**
       * Constructs a <code>VersionResponse</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/VersionResponse} obj Optional instance to populate.
       * @return {module:model/VersionResponse} The populated <code>VersionResponse</code> instance.
       */
    }, {
      key: "constructFromObject",
      value: function(r, e) {
        return r && (e = e || new n(), r.hasOwnProperty("version") && (e.version = u.default.convertToType(r.version, "Number")), r.hasOwnProperty("updated_at") && (e.updated_at = u.default.convertToType(r.updated_at, "Number"))), e;
      }
      /**
       * Validates the JSON data with respect to <code>VersionResponse</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>VersionResponse</code>.
       */
    }, {
      key: "validateJSON",
      value: function(r) {
        return !0;
      }
    }]), n;
  }();
  S.prototype.version = void 0, S.prototype.updated_at = void 0;
  var O = S;
  i.default = O;
})(ve);
var Ce = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l(oe);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function h(n) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, h(n);
  }
  function b(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && _(n.prototype, t), r && _(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return h(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (h(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (h(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      b(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "configWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, y = ["ApiToken"], d = [], p = ["application/json"], s = c.default;
        return this.apiClient.callApi("/config", "GET", e, o, f, a, r, y, d, p, s, null);
      }
      /**
       * Get Config
       * The config API endpoint provides comprehensive information required for configuring the layout of websites. It encompasses various essential elements, including containers with pages, an extensive list of available slugs, globals containing content pool data, and crucial details about the Nitro configuration itself. By accessing this endpoint, developers can gather all the necessary data to effectively design and structure their websites. The endpoint offers a holistic view of the website's layout, empowering developers to tailor the user experience and optimize the overall design.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/ConfigResponse}
       */
    }, {
      key: "config",
      value: function() {
        return this.configWithHttpInfo().then(function(r) {
          return r.data;
        });
      }
    }]), n;
  }();
  i.default = O;
})(Ce);
var qe = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l(ae);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function h(n) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, h(n);
  }
  function b(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && _(n.prototype, t), r && _(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return h(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (h(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (h(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      b(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "entityBySlugWithHttpInfo",
      value: function(r, e) {
        e = e || {};
        var o = null;
        if (r == null)
          throw new Error("Missing the required parameter 'slug' when calling entityBySlug");
        var f = {
          slug: r
        }, a = {
          typeId: e.typeId
        }, y = {}, d = {}, p = ["ApiToken"], s = [], v = ["application/json"], m = c.default;
        return this.apiClient.callApi("/entities/slug/{slug}", "GET", f, a, y, d, o, p, s, v, m, null);
      }
      /**
       * Find entity by slug and optional Type-ID
       * 
       * @param {String} slug When looking up an entity slug, it is advisable to provide the typeId parameter along with it, as slugs are not unique among other entities. Failing to include the typeId parameter may lead to unintended or incorrect results. By specifying the typeId, you can ensure more accurate and targeted retrieval of the desired entity.
       * @param {Object} opts Optional parameters
       * @param {Number} opts.typeId To ensure accurate lookup, it is considered a best practice to include the Type-ID of the entity associated with the slug. The Type-ID, alternatively referred to as the Entity-Definition-Schema ID, serves as a crucial identifier within the system. It uniquely distinguishes and categorizes the Entity-Definition-Schema.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Entity}
       */
    }, {
      key: "entityBySlug",
      value: function(r, e) {
        return this.entityBySlugWithHttpInfo(r, e).then(function(o) {
          return o.data;
        });
      }
      /**
       * Find entity by uniqueid
       * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
       * @param {String} uniqueid The unique identifier of the given entity is a string composed solely of lowercase alphabetic characters (a-z) and numbers. This identifier is meticulously generated for each data row, ensuring its uniqueness and facilitating efficient data management and retrieval across content pools.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Entity} and HTTP response
       */
    }, {
      key: "entityByUniqueidWithHttpInfo",
      value: function(r) {
        var e = null;
        if (r == null)
          throw new Error("Missing the required parameter 'uniqueid' when calling entityByUniqueid");
        var o = {
          uniqueid: r
        }, f = {}, a = {}, y = {}, d = ["ApiToken"], p = [], s = ["application/json"], v = c.default;
        return this.apiClient.callApi("/entities/uniqueid/{uniqueid}", "GET", o, f, a, y, e, d, p, s, v, null);
      }
      /**
       * Find entity by uniqueid
       * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
       * @param {String} uniqueid The unique identifier of the given entity is a string composed solely of lowercase alphabetic characters (a-z) and numbers. This identifier is meticulously generated for each data row, ensuring its uniqueness and facilitating efficient data management and retrieval across content pools.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Entity}
       */
    }, {
      key: "entityByUniqueid",
      value: function(r) {
        return this.entityByUniqueidWithHttpInfo(r).then(function(e) {
          return e.data;
        });
      }
    }]), n;
  }();
  i.default = O;
})(qe);
var Re = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l(pe);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function h(n) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, h(n);
  }
  function b(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && _(n.prototype, t), r && _(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return h(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (h(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (h(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      b(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "homeWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, y = ["ApiToken"], d = [], p = ["application/json"], s = c.default;
        return this.apiClient.callApi("/pages/home", "GET", e, o, f, a, r, y, d, p, s, null);
      }
      /**
       * Get Home
       * This endpoint allows you to retrieve the designated homepage of a website. Alternatively, you can utilize the pages endpoint by specifying an empty slug parameter to achieve the same result. By using either of these methods, you can effectively access the desired homepage of the website.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Page}
       */
    }, {
      key: "home",
      value: function() {
        return this.homeWithHttpInfo().then(function(r) {
          return r.data;
        });
      }
      /**
       * Get Page by slug
       * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
       * @param {Object} opts Optional parameters
       * @param {String} opts.slug The function retrieves a specific page by its slug. If no slug is provided, it automatically returns the homepage. Moreover, it seamlessly handles paths with subpages, allowing for nested URLs like \"testpage/subpage\". In this way, a forward slash (\"/\") within the path is recognized as a valid character and processed accordingly.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Page} and HTTP response
       */
    }, {
      key: "pageWithHttpInfo",
      value: function(r) {
        r = r || {};
        var e = null, o = {}, f = {
          slug: r.slug
        }, a = {}, y = {}, d = ["ApiToken"], p = [], s = ["application/json"], v = c.default;
        return this.apiClient.callApi("/pages", "GET", o, f, a, y, e, d, p, s, v, null);
      }
      /**
       * Get Page by slug
       * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
       * @param {Object} opts Optional parameters
       * @param {String} opts.slug The function retrieves a specific page by its slug. If no slug is provided, it automatically returns the homepage. Moreover, it seamlessly handles paths with subpages, allowing for nested URLs like \"testpage/subpage\". In this way, a forward slash (\"/\") within the path is recognized as a valid character and processed accordingly.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Page}
       */
    }, {
      key: "page",
      value: function(r) {
        return this.pageWithHttpInfo(r).then(function(e) {
          return e.data;
        });
      }
    }]), n;
  }();
  i.default = O;
})(Re);
var Je = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l($);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function h(n) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, h(n);
  }
  function b(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && _(n.prototype, t), r && _(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return h(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (h(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (h(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      b(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "searchWithHttpInfo",
      value: function(r) {
        var e = null;
        if (r == null)
          throw new Error("Missing the required parameter 'query' when calling search");
        var o = {}, f = {
          query: r
        }, a = {}, y = {}, d = ["ApiToken"], p = [], s = ["application/json"], v = [c.default];
        return this.apiClient.callApi("/search", "GET", o, f, a, y, e, d, p, s, v, null);
      }
      /**
       * Get Search by query
       * This endpoint offers a powerful capability to search through the websites sitemap, encompassing both pages and entities. With this endpoint, users can efficiently explore and retrieve information from your sitemap by creating a paginated search experience.
       * @param {String} query The query keyword that needs to be looked up. It is important to ensure that the query is properly URL encoded for accurate processing and retrieval.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/EntityinterfaceInner>}
       */
    }, {
      key: "search",
      value: function(r) {
        return this.searchWithHttpInfo(r).then(function(e) {
          return e.data;
        });
      }
    }]), n;
  }();
  i.default = O;
})(Je);
var Ie = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l($);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function h(n) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, h(n);
  }
  function b(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && _(n.prototype, t), r && _(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return h(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (h(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (h(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      b(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "sitemapWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, y = ["ApiToken"], d = [], p = ["application/json"], s = [c.default];
        return this.apiClient.callApi("/sitemap", "GET", e, o, f, a, r, y, d, p, s, null);
      }
      /**
       * Get Sitemap
       * This endpoint provides comprehensive data for generating the sitemap. It encompasses all the necessary information, including pages from containers, as well as all entities that have been mapped.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/EntityinterfaceInner>}
       */
    }, {
      key: "sitemap",
      value: function() {
        return this.sitemapWithHttpInfo().then(function(r) {
          return r.data;
        });
      }
    }]), n;
  }();
  i.default = O;
})(Ie);
var Me = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(C), c = l(ve);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function h(n) {
    "@babel/helpers - typeof";
    return h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, h(n);
  }
  function b(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function _(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && _(n.prototype, t), r && _(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return h(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (h(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (h(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      b(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "versionWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, y = ["ApiToken"], d = [], p = ["application/json"], s = c.default;
        return this.apiClient.callApi("/version", "GET", e, o, f, a, r, y, d, p, s, null);
      }
      /**
       * Get Version Information
       * The Version API endpoint offers a highly efficient solution for evaluating the current caching status of your application's caching mechanism. This functionality allows you to cache the entire application configuration and page responses indefinitely. However, utilizing this endpoint enables you to assess the validity of the cache by sending a request to determine its current status. This caching endpoint is specifically designed for optimal performance when compared to the configuration endpoint, which requires more thorough evaluation and encompasses a substantial response body.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/VersionResponse}
       */
    }, {
      key: "version",
      value: function() {
        return this.versionWithHttpInfo().then(function(r) {
          return r.data;
        });
      }
    }]), n;
  }();
  i.default = O;
})(Me);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), Object.defineProperty(i, "ApiClient", {
    enumerable: !0,
    get: function() {
      return u.default;
    }
  }), Object.defineProperty(i, "Block", {
    enumerable: !0,
    get: function() {
      return c.default;
    }
  }), Object.defineProperty(i, "BlockSlots", {
    enumerable: !0,
    get: function() {
      return l.default;
    }
  }), Object.defineProperty(i, "ConfigApi", {
    enumerable: !0,
    get: function() {
      return a.default;
    }
  }), Object.defineProperty(i, "ConfigResponse", {
    enumerable: !0,
    get: function() {
      return h.default;
    }
  }), Object.defineProperty(i, "ConfigResponseContainersValue", {
    enumerable: !0,
    get: function() {
      return b.default;
    }
  }), Object.defineProperty(i, "ConfigResponseNitro", {
    enumerable: !0,
    get: function() {
      return _.default;
    }
  }), Object.defineProperty(i, "EntitiesApi", {
    enumerable: !0,
    get: function() {
      return y.default;
    }
  }), Object.defineProperty(i, "Entity", {
    enumerable: !0,
    get: function() {
      return w.default;
    }
  }), Object.defineProperty(i, "EntityInterface", {
    enumerable: !0,
    get: function() {
      return T.default;
    }
  }), Object.defineProperty(i, "EntityMetric", {
    enumerable: !0,
    get: function() {
      return S.default;
    }
  }), Object.defineProperty(i, "EntityinterfaceInner", {
    enumerable: !0,
    get: function() {
      return O.default;
    }
  }), Object.defineProperty(i, "Meta", {
    enumerable: !0,
    get: function() {
      return n.default;
    }
  }), Object.defineProperty(i, "Page", {
    enumerable: !0,
    get: function() {
      return t.default;
    }
  }), Object.defineProperty(i, "PageBreadcrumbInner", {
    enumerable: !0,
    get: function() {
      return r.default;
    }
  }), Object.defineProperty(i, "PageProperty", {
    enumerable: !0,
    get: function() {
      return e.default;
    }
  }), Object.defineProperty(i, "PagesApi", {
    enumerable: !0,
    get: function() {
      return d.default;
    }
  }), Object.defineProperty(i, "PagesInner", {
    enumerable: !0,
    get: function() {
      return o.default;
    }
  }), Object.defineProperty(i, "SearchApi", {
    enumerable: !0,
    get: function() {
      return p.default;
    }
  }), Object.defineProperty(i, "SitemapApi", {
    enumerable: !0,
    get: function() {
      return s.default;
    }
  }), Object.defineProperty(i, "VersionApi", {
    enumerable: !0,
    get: function() {
      return v.default;
    }
  }), Object.defineProperty(i, "VersionResponse", {
    enumerable: !0,
    get: function() {
      return f.default;
    }
  });
  var u = m(C), c = m(ie()), l = m(Ne()), h = m(oe), b = m(ue), _ = m(le), w = m(ae), T = m(se), S = m(ye), O = m($), n = m(ce), t = m(pe), r = m(he), e = m(me), o = m(fe), f = m(ve), a = m(Ce), y = m(qe), d = m(Re), p = m(Je), s = m(Ie), v = m(Me);
  function m(g) {
    return g && g.__esModule ? g : { default: g };
  }
})(De);
function ot() {
  return globalThis.flyoNitroInstance || console.error("flyoNitroInstance has not been initialized correctly"), globalThis.flyoNitroInstance;
}
function ut(i) {
  const u = {
    accessToken: !1,
    ...i
  };
  return {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript: c, updateConfig: l }) => {
        c(
          "page-ssr",
          `
              var defaultClient = ApiClient.instance;
              defaultClient.defaultHeaders = {}
          
              let ApiToken = defaultClient.authentications['ApiToken'];
              ApiToken.apiKey = '${u.accessToken}';
          
              globalThis.flyoNitroInstance = defaultClient;
            `
        ), c(
          "page",
          `
              console.log('reload')
            `
        );
      }
    }
  };
}
export {
  ut as default,
  ot as useFlyoNitro
};
