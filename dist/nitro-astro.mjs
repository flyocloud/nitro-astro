function Ue(i) {
  if (i.__esModule)
    return i;
  var u = i.default;
  if (typeof u == "function") {
    var y = function l() {
      return this instanceof l ? Reflect.construct(u, arguments, this.constructor) : u.apply(this, arguments);
    };
    y.prototype = u.prototype;
  } else
    y = {};
  return Object.defineProperty(y, "__esModule", { value: !0 }), Object.keys(i).forEach(function(l) {
    var p = Object.getOwnPropertyDescriptor(i, l);
    Object.defineProperty(y, l, p.get ? p : {
      enumerable: !0,
      get: function() {
        return i[l];
      }
    });
  }), y;
}
var Ke = {};
function je(i) {
  throw new Error('Could not dynamically require "' + i + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var N = {}, Z = { exports: {} }, Ae = { exports: {} };
(function(i) {
  i.exports = u;
  function u(l) {
    if (l)
      return y(l);
  }
  function y(l) {
    for (var p in u.prototype)
      l[p] = u.prototype[p];
    return l;
  }
  u.prototype.on = u.prototype.addEventListener = function(l, p) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + l] = this._callbacks["$" + l] || []).push(p), this;
  }, u.prototype.once = function(l, p) {
    function d() {
      this.off(l, d), p.apply(this, arguments);
    }
    return d.fn = p, this.on(l, d), this;
  }, u.prototype.off = u.prototype.removeListener = u.prototype.removeAllListeners = u.prototype.removeEventListener = function(l, p) {
    if (this._callbacks = this._callbacks || {}, arguments.length == 0)
      return this._callbacks = {}, this;
    var d = this._callbacks["$" + l];
    if (!d)
      return this;
    if (arguments.length == 1)
      return delete this._callbacks["$" + l], this;
    for (var b, w = 0; w < d.length; w++)
      if (b = d[w], b === p || b.fn === p) {
        d.splice(w, 1);
        break;
      }
    return d.length === 0 && delete this._callbacks["$" + l], this;
  }, u.prototype.emit = function(l) {
    this._callbacks = this._callbacks || {};
    for (var p = new Array(arguments.length - 1), d = this._callbacks["$" + l], b = 1; b < arguments.length; b++)
      p[b - 1] = arguments[b];
    if (d) {
      d = d.slice(0);
      for (var b = 0, w = d.length; b < w; ++b)
        d[b].apply(this, p);
    }
    return this;
  }, u.prototype.listeners = function(l) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + l] || [];
  }, u.prototype.hasListeners = function(l) {
    return !!this.listeners(l).length;
  };
})(Ae);
var We = Ae.exports, $e = H;
H.default = H;
H.stable = Ne;
H.stableStringify = Ne;
var j = "[...]", ke = "[Circular]", B = [], M = [];
function Ce() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function H(i, u, y, l) {
  typeof l > "u" && (l = Ce()), ee(i, "", 0, [], void 0, 0, l);
  var p;
  try {
    M.length === 0 ? p = JSON.stringify(i, u, y) : p = JSON.stringify(i, Re(u), y);
  } catch {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    for (; B.length !== 0; ) {
      var d = B.pop();
      d.length === 4 ? Object.defineProperty(d[0], d[1], d[3]) : d[0][d[1]] = d[2];
    }
  }
  return p;
}
function z(i, u, y, l) {
  var p = Object.getOwnPropertyDescriptor(l, y);
  p.get !== void 0 ? p.configurable ? (Object.defineProperty(l, y, { value: i }), B.push([l, y, u, p])) : M.push([u, y, i]) : (l[y] = i, B.push([l, y, u]));
}
function ee(i, u, y, l, p, d, b) {
  d += 1;
  var w;
  if (typeof i == "object" && i !== null) {
    for (w = 0; w < l.length; w++)
      if (l[w] === i) {
        z(ke, i, u, p);
        return;
      }
    if (typeof b.depthLimit < "u" && d > b.depthLimit) {
      z(j, i, u, p);
      return;
    }
    if (typeof b.edgesLimit < "u" && y + 1 > b.edgesLimit) {
      z(j, i, u, p);
      return;
    }
    if (l.push(i), Array.isArray(i))
      for (w = 0; w < i.length; w++)
        ee(i[w], w, w, l, i, d, b);
    else {
      var T = Object.keys(i);
      for (w = 0; w < T.length; w++) {
        var S = T[w];
        ee(i[S], S, w, l, i, d, b);
      }
    }
    l.pop();
  }
}
function Ge(i, u) {
  return i < u ? -1 : i > u ? 1 : 0;
}
function Ne(i, u, y, l) {
  typeof l > "u" && (l = Ce());
  var p = te(i, "", 0, [], void 0, 0, l) || i, d;
  try {
    M.length === 0 ? d = JSON.stringify(p, u, y) : d = JSON.stringify(p, Re(u), y);
  } catch {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    for (; B.length !== 0; ) {
      var b = B.pop();
      b.length === 4 ? Object.defineProperty(b[0], b[1], b[3]) : b[0][b[1]] = b[2];
    }
  }
  return d;
}
function te(i, u, y, l, p, d, b) {
  d += 1;
  var w;
  if (typeof i == "object" && i !== null) {
    for (w = 0; w < l.length; w++)
      if (l[w] === i) {
        z(ke, i, u, p);
        return;
      }
    try {
      if (typeof i.toJSON == "function")
        return;
    } catch {
      return;
    }
    if (typeof b.depthLimit < "u" && d > b.depthLimit) {
      z(j, i, u, p);
      return;
    }
    if (typeof b.edgesLimit < "u" && y + 1 > b.edgesLimit) {
      z(j, i, u, p);
      return;
    }
    if (l.push(i), Array.isArray(i))
      for (w = 0; w < i.length; w++)
        te(i[w], w, w, l, i, d, b);
    else {
      var T = {}, S = Object.keys(i).sort(Ge);
      for (w = 0; w < S.length; w++) {
        var O = S[w];
        te(i[O], O, w, l, i, d, b), T[O] = i[O];
      }
      if (typeof p < "u")
        B.push([p, u, i]), p[u] = T;
      else
        return T;
    }
    l.pop();
  }
}
function Re(i) {
  return i = typeof i < "u" ? i : function(u, y) {
    return y;
  }, function(u, y) {
    if (M.length > 0)
      for (var l = 0; l < M.length; l++) {
        var p = M[l];
        if (p[1] === u && p[0] === y) {
          y = p[2], M.splice(l, 1);
          break;
        }
      }
    return i.call(this, u, y);
  };
}
function U(i) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? U = function(y) {
    return typeof y;
  } : U = function(y) {
    return y && typeof Symbol == "function" && y.constructor === Symbol && y !== Symbol.prototype ? "symbol" : typeof y;
  }, U(i);
}
function Ve(i) {
  return i !== null && U(i) === "object";
}
var Ie = Ve;
function K(i) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? K = function(y) {
    return typeof y;
  } : K = function(y) {
    return y && typeof Symbol == "function" && y.constructor === Symbol && y !== Symbol.prototype ? "symbol" : typeof y;
  }, K(i);
}
var W = Ie, Xe = E;
function E(i) {
  if (i)
    return Qe(i);
}
function Qe(i) {
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
var Ye = ["ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT"];
E.prototype._shouldRetry = function(i, u) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries)
    return !1;
  if (this._retryCallback)
    try {
      var y = this._retryCallback(i, u);
      if (y === !0)
        return !0;
      if (y === !1)
        return !1;
    } catch (l) {
      console.error(l);
    }
  return !!(u && u.status && u.status >= 500 && u.status !== 501 || i && (i.code && Ye.includes(i.code) || i.timeout && i.code === "ECONNABORTED" || i.crossDomain));
};
E.prototype._retry = function() {
  return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this.timedoutError = null, this._end();
};
E.prototype.then = function(i, u) {
  var y = this;
  if (!this._fullfilledPromise) {
    var l = this;
    this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise(function(p, d) {
      l.on("abort", function() {
        if (!(y._maxRetries && y._maxRetries > y._retries)) {
          if (y.timedout && y.timedoutError) {
            d(y.timedoutError);
            return;
          }
          var b = new Error("Aborted");
          b.code = "ABORTED", b.status = y.status, b.method = y.method, b.url = y.url, d(b);
        }
      }), l.end(function(b, w) {
        b ? d(b) : p(w);
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
    for (var y in i)
      Object.prototype.hasOwnProperty.call(i, y) && this.set(y, i[y]);
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
    for (var y in i)
      Object.prototype.hasOwnProperty.call(i, y) && this.field(y, i[y]);
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
E.prototype._auth = function(i, u, y, l) {
  switch (y.type) {
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
  var u = W(i), y = this._header["content-type"];
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
    typeof i == "string" ? (y || this.type("form"), y = this._header["content-type"], y === "application/x-www-form-urlencoded" ? this._data = this._data ? "".concat(this._data, "&").concat(i) : i : this._data = (this._data || "") + i) : this._data = i;
  return !u || this._isHost(i) ? this : (y || this.type("json"), this);
};
E.prototype.sortQuery = function(i) {
  return this._sort = typeof i > "u" ? !0 : i, this;
};
E.prototype._finalizeQueryString = function() {
  var i = this._query.join("&");
  if (i && (this.url += (this.url.includes("?") ? "&" : "?") + i), this._query.length = 0, this._sort) {
    var u = this.url.indexOf("?");
    if (u >= 0) {
      var y = this.url.slice(u + 1).split("&");
      typeof this._sort == "function" ? y.sort(this._sort) : y.sort(), this.url = this.url.slice(0, u) + "?" + y.join("&");
    }
  }
};
E.prototype._appendQueryString = function() {
  console.warn("Unsupported");
};
E.prototype._timeoutError = function(i, u, y) {
  if (!this._aborted) {
    var l = new Error("".concat(i + u, "ms exceeded"));
    l.timeout = u, l.code = "ECONNABORTED", l.errno = y, this.timedout = !0, this.timedoutError = l, this.abort(), this.callback(l);
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
  return i.split(/ *; */).reduce(function(u, y) {
    var l = y.split(/ *= */), p = l.shift(), d = l.shift();
    return p && d && (u[p] = d), u;
  }, {});
};
L.parseLinks = function(i) {
  return i.split(/ *, */).reduce(function(u, y) {
    var l = y.split(/ *; */), p = l[0].slice(1, -1), d = l[1].split(/ *= */)[1].slice(1, -1);
    return u[d] = p, u;
  }, {});
};
L.cleanHeader = function(i, u) {
  return delete i["content-type"], delete i["content-length"], delete i["transfer-encoding"], delete i.host, u && (delete i.authorization, delete i.cookie), i;
};
var X = L, Ze = x;
function x(i) {
  if (i)
    return et(i);
}
function et(i) {
  for (var u in x.prototype)
    Object.prototype.hasOwnProperty.call(x.prototype, u) && (i[u] = x.prototype[u]);
  return i;
}
x.prototype.get = function(i) {
  return this.header[i.toLowerCase()];
};
x.prototype._setHeaderProperties = function(i) {
  var u = i["content-type"] || "";
  this.type = X.type(u);
  var y = X.params(u);
  for (var l in y)
    Object.prototype.hasOwnProperty.call(y, l) && (this[l] = y[l]);
  this.links = {};
  try {
    i.link && (this.links = X.parseLinks(i.link));
  } catch {
  }
};
x.prototype._setStatusProperties = function(i) {
  var u = i / 100 | 0;
  this.statusCode = i, this.status = this.statusCode, this.statusType = u, this.info = u === 1, this.ok = u === 2, this.redirect = u === 3, this.clientError = u === 4, this.serverError = u === 5, this.error = u === 4 || u === 5 ? this.toError() : !1, this.created = i === 201, this.accepted = i === 202, this.noContent = i === 204, this.badRequest = i === 400, this.unauthorized = i === 401, this.notAcceptable = i === 406, this.forbidden = i === 403, this.notFound = i === 404, this.unprocessableEntity = i === 422;
};
function tt(i) {
  return ot(i) || it(i) || nt(i) || rt();
}
function rt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function nt(i, u) {
  if (i) {
    if (typeof i == "string")
      return re(i, u);
    var y = Object.prototype.toString.call(i).slice(8, -1);
    if (y === "Object" && i.constructor && (y = i.constructor.name), y === "Map" || y === "Set")
      return Array.from(i);
    if (y === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(y))
      return re(i, u);
  }
}
function it(i) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(i))
    return Array.from(i);
}
function ot(i) {
  if (Array.isArray(i))
    return re(i);
}
function re(i, u) {
  (u == null || u > i.length) && (u = i.length);
  for (var y = 0, l = new Array(u); y < u; y++)
    l[y] = i[y];
  return l;
}
function ne() {
  this._defaults = [];
}
["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert", "disableTLSCerts"].forEach(function(i) {
  ne.prototype[i] = function() {
    for (var u = arguments.length, y = new Array(u), l = 0; l < u; l++)
      y[l] = arguments[l];
    return this._defaults.push({
      fn: i,
      args: y
    }), this;
  };
});
ne.prototype._setDefaults = function(i) {
  this._defaults.forEach(function(u) {
    i[u.fn].apply(i, tt(u.args));
  });
};
var ut = ne;
(function(i, u) {
  function y(s) {
    "@babel/helpers - typeof";
    return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? y = function(m) {
      return typeof m;
    } : y = function(m) {
      return m && typeof Symbol == "function" && m.constructor === Symbol && m !== Symbol.prototype ? "symbol" : typeof m;
    }, y(s);
  }
  var l;
  typeof window < "u" ? l = window : typeof self > "u" ? (console.warn("Using browser-only version of superagent in non-browser environment"), l = void 0) : l = self;
  var p = We, d = $e, b = Xe, w = Ie, T = Ze, S = ut;
  function O() {
  }
  i.exports = function(s, v) {
    return typeof v == "function" ? new u.Request("GET", s).end(v) : arguments.length === 1 ? new u.Request("GET", s) : new u.Request(s, v);
  }, u = i.exports;
  var n = u;
  u.Request = g, n.getXHR = function() {
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
        for (var _ in m)
          Object.prototype.hasOwnProperty.call(m, _) && e(s, "".concat(v, "[").concat(_, "]"), m[_]);
      else
        s.push(encodeURI(v) + "=" + encodeURIComponent(m));
    }
  }
  n.serializeObject = r;
  function o(s) {
    for (var v = {}, m = s.split("&"), _, P, A = 0, C = m.length; A < C; ++A)
      _ = m[A], P = _.indexOf("="), P === -1 ? v[decodeURIComponent(_)] = "" : v[decodeURIComponent(_.slice(0, P))] = decodeURIComponent(_.slice(P + 1));
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
    "application/json": d
  }, n.parse = {
    "application/x-www-form-urlencoded": o,
    "application/json": JSON.parse
  };
  function f(s) {
    for (var v = s.split(/\r?\n/), m = {}, _, P, A, C, k = 0, I = v.length; k < I; ++k)
      P = v[k], _ = P.indexOf(":"), _ !== -1 && (A = P.slice(0, _).toLowerCase(), C = t(P.slice(_ + 1)), m[A] = C);
    return m;
  }
  function a(s) {
    return /[/+]json($|[^-\w])/.test(s);
  }
  function c(s) {
    this.req = s, this.xhr = this.req.xhr, this.text = this.req.method !== "HEAD" && (this.xhr.responseType === "" || this.xhr.responseType === "text") || typeof this.xhr.responseType > "u" ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;
    var v = this.xhr.status;
    v === 1223 && (v = 204), this._setStatusProperties(v), this.headers = f(this.xhr.getAllResponseHeaders()), this.header = this.headers, this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), this.text === null && s._responseType ? this.body = this.xhr.response : this.body = this.req.method === "HEAD" ? null : this._parseBody(this.text ? this.text : this.xhr.response);
  }
  T(c.prototype), c.prototype._parseBody = function(s) {
    var v = n.parse[this.type];
    return this.req._parser ? this.req._parser(this, s) : (!v && a(this.type) && (v = n.parse["application/json"]), v && s && (s.length > 0 || s instanceof Object) ? v(s) : null);
  }, c.prototype.toError = function() {
    var s = this.req, v = s.method, m = s.url, _ = "cannot ".concat(v, " ").concat(m, " (").concat(this.status, ")"), P = new Error(_);
    return P.status = this.status, P.method = v, P.url = m, P;
  }, n.Response = c;
  function g(s, v) {
    var m = this;
    this._query = this._query || [], this.method = s, this.url = v, this.header = {}, this._header = {}, this.on("end", function() {
      var _ = null, P = null;
      try {
        P = new c(m);
      } catch (C) {
        return _ = new Error("Parser is unable to parse the response"), _.parse = !0, _.original = C, m.xhr ? (_.rawResponse = typeof m.xhr.responseType > "u" ? m.xhr.responseText : m.xhr.response, _.status = m.xhr.status ? m.xhr.status : null, _.statusCode = _.status) : (_.rawResponse = null, _.status = null), m.callback(_);
      }
      m.emit("response", P);
      var A;
      try {
        m._isResponseOK(P) || (A = new Error(P.statusText || P.text || "Unsuccessful HTTP response"));
      } catch (C) {
        A = C;
      }
      A ? (A.original = _, A.response = P, A.status = P.status, m.callback(A, P)) : m.callback(null, P);
    });
  }
  p(g.prototype), b(g.prototype), g.prototype.type = function(s) {
    return this.set("Content-Type", n.types[s] || s), this;
  }, g.prototype.accept = function(s) {
    return this.set("Accept", n.types[s] || s), this;
  }, g.prototype.auth = function(s, v, m) {
    arguments.length === 1 && (v = ""), y(v) === "object" && v !== null && (m = v, v = ""), m || (m = {
      type: typeof btoa == "function" ? "basic" : "auto"
    });
    var _ = function(A) {
      if (typeof btoa == "function")
        return btoa(A);
      throw new Error("Cannot use basic auth, btoa is not a function");
    };
    return this._auth(s, v, m, _);
  }, g.prototype.query = function(s) {
    return typeof s != "string" && (s = r(s)), s && this._query.push(s), this;
  }, g.prototype.attach = function(s, v, m) {
    if (v) {
      if (this._data)
        throw new Error("superagent can't mix .send() and .attach()");
      this._getFormData().append(s, v, m || v.name);
    }
    return this;
  }, g.prototype._getFormData = function() {
    return this._formData || (this._formData = new l.FormData()), this._formData;
  }, g.prototype.callback = function(s, v) {
    if (this._shouldRetry(s, v))
      return this._retry();
    var m = this._callback;
    this.clearTimeout(), s && (this._maxRetries && (s.retries = this._retries - 1), this.emit("error", s)), m(s, v);
  }, g.prototype.crossDomainError = function() {
    var s = new Error(`Request has been terminated
Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.`);
    s.crossDomain = !0, s.status = this.status, s.method = this.method, s.url = this.url, this.callback(s);
  }, g.prototype.agent = function() {
    return console.warn("This is not supported in browser version of superagent"), this;
  }, g.prototype.ca = g.prototype.agent, g.prototype.buffer = g.prototype.ca, g.prototype.write = function() {
    throw new Error("Streaming is not supported in browser version of superagent");
  }, g.prototype.pipe = g.prototype.write, g.prototype._isHost = function(s) {
    return s && y(s) === "object" && !Array.isArray(s) && Object.prototype.toString.call(s) !== "[object Object]";
  }, g.prototype.end = function(s) {
    this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = s || O, this._finalizeQueryString(), this._end();
  }, g.prototype._setUploadTimeout = function() {
    var s = this;
    this._uploadTimeout && !this._uploadTimeoutTimer && (this._uploadTimeoutTimer = setTimeout(function() {
      s._timeoutError("Upload timeout of ", s._uploadTimeout, "ETIMEDOUT");
    }, this._uploadTimeout));
  }, g.prototype._end = function() {
    if (this._aborted)
      return this.callback(new Error("The request has been aborted even before .end() was called"));
    var s = this;
    this.xhr = n.getXHR();
    var v = this.xhr, m = this._formData || this._data;
    this._setTimeouts(), v.onreadystatechange = function() {
      var k = v.readyState;
      if (k >= 2 && s._responseTimeoutTimer && clearTimeout(s._responseTimeoutTimer), k === 4) {
        var I;
        try {
          I = v.status;
        } catch {
          I = 0;
        }
        if (!I)
          return s.timedout || s._aborted ? void 0 : s.crossDomainError();
        s.emit("end");
      }
    };
    var _ = function(I, R) {
      R.total > 0 && (R.percent = R.loaded / R.total * 100, R.percent === 100 && clearTimeout(s._uploadTimeoutTimer)), R.direction = I, s.emit("progress", R);
    };
    if (this.hasListeners("progress"))
      try {
        v.addEventListener("progress", _.bind(null, "download")), v.upload && v.upload.addEventListener("progress", _.bind(null, "upload"));
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
    for (var C in this.header)
      this.header[C] !== null && Object.prototype.hasOwnProperty.call(this.header, C) && v.setRequestHeader(C, this.header[C]);
    this._responseType && (v.responseType = this._responseType), this.emit("request", this), v.send(typeof m > "u" ? null : m);
  }, n.agent = function() {
    return new S();
  }, ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(s) {
    S.prototype[s.toLowerCase()] = function(v, m) {
      var _ = new n.Request(s, v);
      return this._setDefaults(_), m && _.end(m), _;
    };
  }), S.prototype.del = S.prototype.delete, n.get = function(s, v, m) {
    var _ = n("GET", s);
    return typeof v == "function" && (m = v, v = null), v && _.query(v), m && _.end(m), _;
  }, n.head = function(s, v, m) {
    var _ = n("HEAD", s);
    return typeof v == "function" && (m = v, v = null), v && _.query(v), m && _.end(m), _;
  }, n.options = function(s, v, m) {
    var _ = n("OPTIONS", s);
    return typeof v == "function" && (m = v, v = null), v && _.send(v), m && _.end(m), _;
  };
  function h(s, v, m) {
    var _ = n("DELETE", s);
    return typeof v == "function" && (m = v, v = null), v && _.send(v), m && _.end(m), _;
  }
  n.del = h, n.delete = h, n.patch = function(s, v, m) {
    var _ = n("PATCH", s);
    return typeof v == "function" && (m = v, v = null), v && _.send(v), m && _.end(m), _;
  }, n.post = function(s, v, m) {
    var _ = n("POST", s);
    return typeof v == "function" && (m = v, v = null), v && _.send(v), m && _.end(m), _;
  }, n.put = function(s, v, m) {
    var _ = n("PUT", s);
    return typeof v == "function" && (m = v, v = null), v && _.send(v), m && _.end(m), _;
  };
})(Z, Z.exports);
var ft = Z.exports;
const lt = {}, at = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: lt
}, Symbol.toStringTag, { value: "Module" })), we = /* @__PURE__ */ Ue(at);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(ft), y = l(we);
  function l(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function p(t) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
      return typeof r;
    } : function(r) {
      return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, p(t);
  }
  function d(t, r) {
    if (!(t instanceof r))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(t, r) {
    for (var e = 0; e < r.length; e++) {
      var o = r[e];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
    }
  }
  function w(t, r, e) {
    return r && b(t.prototype, r), e && b(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
  }
  function T(t) {
    var r = S(t, "string");
    return p(r) === "symbol" ? r : String(r);
  }
  function S(t, r) {
    if (p(t) !== "object" || t === null)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== void 0) {
      var o = e.call(t, r || "default");
      if (p(o) !== "object")
        return o;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  }
  var O = /* @__PURE__ */ function() {
    function t() {
      var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "https://api.flyo.cloud/nitro/v1";
      d(this, t), this.basePath = r.replace(/\/+$/, ""), this.authentications = {
        ApiToken: {
          type: "apiKey",
          in: "query",
          name: "token"
        }
      }, this.defaultHeaders = {
        "User-Agent": "OpenAPI-Generator/1.0.0-beta.160/Javascript"
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
          var c = this.basePath + e;
          return f != null && (c = f + e), c = c.replace(/\{([\w-\.]+)\}/g, function(g, h) {
            var s;
            return o.hasOwnProperty(h) ? s = a.paramToString(o[h]) : s = g, encodeURIComponent(s);
          }), c;
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
        if (typeof je == "function") {
          var o;
          try {
            o = we;
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
          var c = f.authentications[a];
          switch (c.type) {
            case "basic":
              (c.username || c.password) && e.auth(c.username || "", c.password || "");
              break;
            case "bearer":
              if (c.accessToken) {
                var g = typeof c.accessToken == "function" ? c.accessToken() : c.accessToken;
                e.set({
                  Authorization: "Bearer " + g
                });
              }
              break;
            case "apiKey":
              if (c.apiKey) {
                var h = {};
                c.apiKeyPrefix ? h[c.name] = c.apiKeyPrefix + " " + c.apiKey : h[c.name] = c.apiKey, c.in === "header" ? e.set(h) : e.query(h);
              }
              break;
            case "oauth2":
              c.accessToken && e.set({
                Authorization: "Bearer " + c.accessToken
              });
              break;
            default:
              throw new Error("Unknown authentication type: " + c.type);
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
        return (f == null || p(f) === "object" && typeof f.length > "u" && !Object.keys(f).length) && (f = e.text), t.convertToType(f, o);
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
      value: function(e, o, f, a, c, g, h, s, v, m, _, P) {
        var A = this, C = this.buildUrl(e, f, P), k = (0, u.default)(o, C);
        if (this.plugins !== null)
          for (var I in this.plugins)
            this.plugins.hasOwnProperty(I) && k.use(this.plugins[I]);
        this.applyAuthToRequest(k, s), o.toUpperCase() === "GET" && this.cache === !1 && (a._ = (/* @__PURE__ */ new Date()).getTime()), k.query(this.normalizeParams(a)), k.set(this.defaultHeaders).set(this.normalizeParams(c)), this.requestAgent && k.agent(this.requestAgent), k.timeout(this.timeout);
        var R = this.jsonPreferredMime(v);
        if (R && R != "multipart/form-data" && k.type(R), R === "application/x-www-form-urlencoded")
          k.send(y.default.stringify(this.normalizeParams(g)));
        else if (R == "multipart/form-data") {
          var G = this.normalizeParams(g);
          for (var F in G)
            if (G.hasOwnProperty(F)) {
              var J = G[F];
              this.isFileParam(J) ? k.attach(F, J) : Array.isArray(J) && J.length && this.isFileParam(J[0]) ? J.forEach(function(V) {
                return k.attach(F, V);
              }) : k.field(F, J);
            }
        } else
          h != null && (k.header["Content-Type"] || k.type("application/json"), k.send(h));
        var ge = this.jsonPreferredMime(m);
        return ge && k.accept(ge), _ === "Blob" ? k.responseType("blob") : _ === "String" && k.responseType("text"), this.enableCookies && (typeof window > "u" ? this.agent._attachCookies(k) : k.withCredentials()), new Promise(function(V, _e) {
          k.end(function(be, q) {
            if (be) {
              var D = {};
              q && (D.status = q.status, D.statusText = q.statusText, D.body = q.body, D.response = q), D.error = be, _e(D);
            } else
              try {
                var He = A.deserialize(q, _);
                A.enableCookies && typeof window > "u" && A.agent._saveCookies(q), V({
                  data: He,
                  response: q
                });
              } catch (Le) {
                _e(Le);
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
        var a = f[e], c = a.url;
        for (var g in a.variables)
          if (g in o) {
            var h = a.variables[g];
            if (!("enum_values" in h) || h.enum_values.includes(o[g]))
              c = c.replace("{" + g + "}", o[g]);
            else
              throw new Error("The variable `" + g + "` in the host URL has invalid value " + o[g] + ". Must be " + a.variables[g].enum_values + ".");
          } else
            c = c.replace("{" + g + "}", a.variables[g].default_value);
        return c;
      }
      /**
      * Constructs a new map or array model from REST data.
      * @param data {Object|Array} The REST data.
      * @param obj {Object|Array} The target object or array.
      */
    }], [{
      key: "canBeJsonified",
      value: function(e) {
        if (typeof e != "string" && p(e) !== "object")
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
            } else if (p(o) === "object") {
              var a, c;
              for (var g in o)
                if (o.hasOwnProperty(g)) {
                  a = g, c = o[g];
                  break;
                }
              var h = {};
              for (var g in e)
                if (e.hasOwnProperty(g)) {
                  var s = t.convertToType(g, a), v = t.convertToType(e[g], c);
                  h[s] = v;
                }
              return h;
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
          for (var c in e)
            e.hasOwnProperty(c) && (o[c] = t.convertToType(e[c], f));
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
})(N);
var Q = {}, Y = {}, Se;
function qe() {
  return Se || (Se = 1, function(i) {
    Object.defineProperty(i, "__esModule", {
      value: !0
    }), i.default = void 0;
    var u = l(N), y = l(ie());
    function l(o) {
      return o && o.__esModule ? o : { default: o };
    }
    function p(o) {
      "@babel/helpers - typeof";
      return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(f) {
        return typeof f;
      } : function(f) {
        return f && typeof Symbol == "function" && f.constructor === Symbol && f !== Symbol.prototype ? "symbol" : typeof f;
      }, p(o);
    }
    function d(o, f) {
      var a = typeof Symbol < "u" && o[Symbol.iterator] || o["@@iterator"];
      if (!a) {
        if (Array.isArray(o) || (a = b(o)) || f && o && typeof o.length == "number") {
          a && (o = a);
          var c = 0, g = function() {
          };
          return { s: g, n: function() {
            return c >= o.length ? { done: !0 } : { done: !1, value: o[c++] };
          }, e: function(_) {
            throw _;
          }, f: g };
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      var h = !0, s = !1, v;
      return { s: function() {
        a = a.call(o);
      }, n: function() {
        var _ = a.next();
        return h = _.done, _;
      }, e: function(_) {
        s = !0, v = _;
      }, f: function() {
        try {
          !h && a.return != null && a.return();
        } finally {
          if (s)
            throw v;
        }
      } };
    }
    function b(o, f) {
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
      for (var a = 0, c = new Array(f); a < f; a++)
        c[a] = o[a];
      return c;
    }
    function T(o, f) {
      if (!(o instanceof f))
        throw new TypeError("Cannot call a class as a function");
    }
    function S(o, f) {
      for (var a = 0; a < f.length; a++) {
        var c = f[a];
        c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(o, n(c.key), c);
      }
    }
    function O(o, f, a) {
      return f && S(o.prototype, f), a && S(o, a), Object.defineProperty(o, "prototype", { writable: !1 }), o;
    }
    function n(o) {
      var f = t(o, "string");
      return p(f) === "symbol" ? f : String(f);
    }
    function t(o, f) {
      if (p(o) !== "object" || o === null)
        return o;
      var a = o[Symbol.toPrimitive];
      if (a !== void 0) {
        var c = a.call(o, f || "default");
        if (p(c) !== "object")
          return c;
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
        value: function(a, c) {
          return a && (c = c || new o(), a.hasOwnProperty("identifier") && (c.identifier = u.default.convertToType(a.identifier, "String")), a.hasOwnProperty("content") && (c.content = u.default.convertToType(a.content, [y.default]))), c;
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
            var c = d(a.content), g;
            try {
              for (c.s(); !(g = c.n()).done; ) {
                var h = g.value;
                y.default.validateJSON(h);
              }
            } catch (s) {
              c.e(s);
            } finally {
              c.f();
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
var Oe;
function ie() {
  return Oe || (Oe = 1, function(i) {
    Object.defineProperty(i, "__esModule", {
      value: !0
    }), i.default = void 0;
    var u = l(N), y = l(qe());
    function l(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function p(t) {
      "@babel/helpers - typeof";
      return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, p(t);
    }
    function d(t, r) {
      if (!(t instanceof r))
        throw new TypeError("Cannot call a class as a function");
    }
    function b(t, r) {
      for (var e = 0; e < r.length; e++) {
        var o = r[e];
        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
      }
    }
    function w(t, r, e) {
      return r && b(t.prototype, r), e && b(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
    }
    function T(t) {
      var r = S(t, "string");
      return p(r) === "symbol" ? r : String(r);
    }
    function S(t, r) {
      if (p(t) !== "object" || t === null)
        return t;
      var e = t[Symbol.toPrimitive];
      if (e !== void 0) {
        var o = e.call(t, r || "default");
        if (p(o) !== "object")
          return o;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (r === "string" ? String : Number)(t);
    }
    var O = /* @__PURE__ */ function() {
      function t() {
        d(this, t), t.initialize(this);
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
            String: y.default
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
  var u = y(N);
  function y(e) {
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
  function p(e, o) {
    var f = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
    if (!f) {
      if (Array.isArray(e) || (f = d(e)) || o && e && typeof e.length == "number") {
        f && (e = f);
        var a = 0, c = function() {
        };
        return { s: c, n: function() {
          return a >= e.length ? { done: !0 } : { done: !1, value: e[a++] };
        }, e: function(m) {
          throw m;
        }, f: c };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var g = !0, h = !1, s;
    return { s: function() {
      f = f.call(e);
    }, n: function() {
      var m = f.next();
      return g = m.done, m;
    }, e: function(m) {
      h = !0, s = m;
    }, f: function() {
      try {
        !g && f.return != null && f.return();
      } finally {
        if (h)
          throw s;
      }
    } };
  }
  function d(e, o) {
    if (e) {
      if (typeof e == "string")
        return b(e, o);
      var f = Object.prototype.toString.call(e).slice(8, -1);
      if (f === "Object" && e.constructor && (f = e.constructor.name), f === "Map" || f === "Set")
        return Array.from(e);
      if (f === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(f))
        return b(e, o);
    }
  }
  function b(e, o) {
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
          var a = p(f.children), c;
          try {
            for (a.s(); !(c = a.n()).done; ) {
              var g = c.value;
              e.validateJSON(g);
            }
          } catch (h) {
            a.e(h);
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
  var u = l(N), y = l(fe);
  function l(o) {
    return o && o.__esModule ? o : { default: o };
  }
  function p(o) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(f) {
      return typeof f;
    } : function(f) {
      return f && typeof Symbol == "function" && f.constructor === Symbol && f !== Symbol.prototype ? "symbol" : typeof f;
    }, p(o);
  }
  function d(o, f) {
    var a = typeof Symbol < "u" && o[Symbol.iterator] || o["@@iterator"];
    if (!a) {
      if (Array.isArray(o) || (a = b(o)) || f && o && typeof o.length == "number") {
        a && (o = a);
        var c = 0, g = function() {
        };
        return { s: g, n: function() {
          return c >= o.length ? { done: !0 } : { done: !1, value: o[c++] };
        }, e: function(_) {
          throw _;
        }, f: g };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var h = !0, s = !1, v;
    return { s: function() {
      a = a.call(o);
    }, n: function() {
      var _ = a.next();
      return h = _.done, _;
    }, e: function(_) {
      s = !0, v = _;
    }, f: function() {
      try {
        !h && a.return != null && a.return();
      } finally {
        if (s)
          throw v;
      }
    } };
  }
  function b(o, f) {
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
    for (var a = 0, c = new Array(f); a < f; a++)
      c[a] = o[a];
    return c;
  }
  function T(o, f) {
    if (!(o instanceof f))
      throw new TypeError("Cannot call a class as a function");
  }
  function S(o, f) {
    for (var a = 0; a < f.length; a++) {
      var c = f[a];
      c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(o, n(c.key), c);
    }
  }
  function O(o, f, a) {
    return f && S(o.prototype, f), a && S(o, a), Object.defineProperty(o, "prototype", { writable: !1 }), o;
  }
  function n(o) {
    var f = t(o, "string");
    return p(f) === "symbol" ? f : String(f);
  }
  function t(o, f) {
    if (p(o) !== "object" || o === null)
      return o;
    var a = o[Symbol.toPrimitive];
    if (a !== void 0) {
      var c = a.call(o, f || "default");
      if (p(c) !== "object")
        return c;
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
      value: function(a, c) {
        return a && (c = c || new o(), a.hasOwnProperty("items") && (c.items = u.default.convertToType(a.items, [y.default])), a.hasOwnProperty("uid") && (c.uid = u.default.convertToType(a.uid, "String")), a.hasOwnProperty("identifier") && (c.identifier = u.default.convertToType(a.identifier, "String")), a.hasOwnProperty("label") && (c.label = u.default.convertToType(a.label, "String"))), c;
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
          var c = d(a.items), g;
          try {
            for (c.s(); !(g = c.n()).done; ) {
              var h = g.value;
              y.default.validateJSON(h);
            }
          } catch (s) {
            c.e(s);
          } finally {
            c.f();
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
  var u = y(N);
  function y(n) {
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
  function p(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function b(n, t, r) {
    return t && d(n.prototype, t), r && d(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
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
      p(this, n), n.initialize(this);
    }
    return b(n, null, [{
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
  var u = p(N), y = p(ue), l = p(le);
  function p(r) {
    return r && r.__esModule ? r : { default: r };
  }
  function d(r) {
    "@babel/helpers - typeof";
    return d = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
      return typeof e;
    } : function(e) {
      return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    }, d(r);
  }
  function b(r, e) {
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
    return d(e) === "symbol" ? e : String(e);
  }
  function O(r, e) {
    if (d(r) !== "object" || r === null)
      return r;
    var o = r[Symbol.toPrimitive];
    if (o !== void 0) {
      var f = o.call(r, e || "default");
      if (d(f) !== "object")
        return f;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (e === "string" ? String : Number)(r);
  }
  var n = /* @__PURE__ */ function() {
    function r() {
      b(this, r), r.initialize(this);
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
          String: y.default
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
var ae = {}, se = {}, ce = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = y(N);
  function y(n) {
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
  function p(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function b(n, t, r) {
    return t && d(n.prototype, t), r && d(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
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
      p(this, n), n.initialize(this);
    }
    return b(n, null, [{
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
})(ce);
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(N), y = l(ce);
  function l(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function p(t) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
      return typeof r;
    } : function(r) {
      return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, p(t);
  }
  function d(t, r) {
    if (!(t instanceof r))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(t, r) {
    for (var e = 0; e < r.length; e++) {
      var o = r[e];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
    }
  }
  function w(t, r, e) {
    return r && b(t.prototype, r), e && b(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
  }
  function T(t) {
    var r = S(t, "string");
    return p(r) === "symbol" ? r : String(r);
  }
  function S(t, r) {
    if (p(t) !== "object" || t === null)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== void 0) {
      var o = e.call(t, r || "default");
      if (p(o) !== "object")
        return o;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  }
  var O = /* @__PURE__ */ function() {
    function t() {
      d(this, t), t.initialize(this);
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
        return e && (o = o || new t(), e.hasOwnProperty("_version") && (o._version = u.default.convertToType(e._version, "Number")), e.hasOwnProperty("entity_metric") && (o.entity_metric = y.default.constructFromObject(e.entity_metric)), e.hasOwnProperty("entity_unique_id") && (o.entity_unique_id = u.default.convertToType(e.entity_unique_id, "String")), e.hasOwnProperty("entity_id") && (o.entity_id = u.default.convertToType(e.entity_id, "String")), e.hasOwnProperty("entity_image") && (o.entity_image = u.default.convertToType(e.entity_image, "String")), e.hasOwnProperty("entity_slug") && (o.entity_slug = u.default.convertToType(e.entity_slug, "String")), e.hasOwnProperty("entity_teaser") && (o.entity_teaser = u.default.convertToType(e.entity_teaser, "String")), e.hasOwnProperty("entity_time_end") && (o.entity_time_end = u.default.convertToType(e.entity_time_end, "String")), e.hasOwnProperty("entity_time_start") && (o.entity_time_start = u.default.convertToType(e.entity_time_start, "String")), e.hasOwnProperty("entity_title") && (o.entity_title = u.default.convertToType(e.entity_title, "String")), e.hasOwnProperty("entity_type") && (o.entity_type = u.default.convertToType(e.entity_type, "String")), e.hasOwnProperty("entity_type_id") && (o.entity_type_id = u.default.convertToType(e.entity_type_id, "Number")), e.hasOwnProperty("updated_at") && (o.updated_at = u.default.convertToType(e.updated_at, "String")), e.hasOwnProperty("routes") && (o.routes = u.default.convertToType(e.routes, {
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
        if (e.entity_metric && y.default.validateJSON(e.entity_metric), e.entity_unique_id && !(typeof e.entity_unique_id == "string" || e.entity_unique_id instanceof String))
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
  var u = l(N), y = l(se);
  function l(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function p(t) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
      return typeof r;
    } : function(r) {
      return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, p(t);
  }
  function d(t, r) {
    if (!(t instanceof r))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(t, r) {
    for (var e = 0; e < r.length; e++) {
      var o = r[e];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, T(o.key), o);
    }
  }
  function w(t, r, e) {
    return r && b(t.prototype, r), e && b(t, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
  }
  function T(t) {
    var r = S(t, "string");
    return p(r) === "symbol" ? r : String(r);
  }
  function S(t, r) {
    if (p(t) !== "object" || t === null)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== void 0) {
      var o = e.call(t, r || "default");
      if (p(o) !== "object")
        return o;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  }
  var O = /* @__PURE__ */ function() {
    function t() {
      d(this, t), t.initialize(this);
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
        return e && (o = o || new t(), e.hasOwnProperty("entity") && (o.entity = y.default.constructFromObject(e.entity)), e.hasOwnProperty("model") && (o.model = u.default.convertToType(e.model, Object)), e.hasOwnProperty("language") && (o.language = u.default.convertToType(e.language, "String"))), o;
      }
      /**
       * Validates the JSON data with respect to <code>Entity</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Entity</code>.
       */
    }, {
      key: "validateJSON",
      value: function(e) {
        if (e.entity && y.default.validateJSON(e.entity), e.language && !(typeof e.language == "string" || e.language instanceof String))
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
  var u = y(N);
  function y(n) {
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
  function p(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function b(n, t, r) {
    return t && d(n.prototype, t), r && d(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
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
      p(this, n), n.initialize(this);
    }
    return b(n, null, [{
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
var ye = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = y(N);
  function y(n) {
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
  function p(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function b(n, t, r) {
    return t && d(n.prototype, t), r && d(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
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
      p(this, n), n.initialize(this);
    }
    return b(n, null, [{
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
})(ye);
var pe = {}, he = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = y(N);
  function y(n) {
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
  function p(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function b(n, t, r) {
    return t && d(n.prototype, t), r && d(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
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
      p(this, n), n.initialize(this);
    }
    return b(n, null, [{
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
  var u = y(N);
  function y(n) {
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
  function p(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function b(n, t, r) {
    return t && d(n.prototype, t), r && d(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
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
      p(this, n), n.initialize(this);
    }
    return b(n, null, [{
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
  var u = b(N), y = b(ie()), l = b(ye), p = b(he), d = b(me);
  function b(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function w(c) {
    "@babel/helpers - typeof";
    return w = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(g) {
      return typeof g;
    } : function(g) {
      return g && typeof Symbol == "function" && g.constructor === Symbol && g !== Symbol.prototype ? "symbol" : typeof g;
    }, w(c);
  }
  function T(c, g) {
    var h = typeof Symbol < "u" && c[Symbol.iterator] || c["@@iterator"];
    if (!h) {
      if (Array.isArray(c) || (h = S(c)) || g && c && typeof c.length == "number") {
        h && (c = h);
        var s = 0, v = function() {
        };
        return { s: v, n: function() {
          return s >= c.length ? { done: !0 } : { done: !1, value: c[s++] };
        }, e: function(C) {
          throw C;
        }, f: v };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var m = !0, _ = !1, P;
    return { s: function() {
      h = h.call(c);
    }, n: function() {
      var C = h.next();
      return m = C.done, C;
    }, e: function(C) {
      _ = !0, P = C;
    }, f: function() {
      try {
        !m && h.return != null && h.return();
      } finally {
        if (_)
          throw P;
      }
    } };
  }
  function S(c, g) {
    if (c) {
      if (typeof c == "string")
        return O(c, g);
      var h = Object.prototype.toString.call(c).slice(8, -1);
      if (h === "Object" && c.constructor && (h = c.constructor.name), h === "Map" || h === "Set")
        return Array.from(c);
      if (h === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(h))
        return O(c, g);
    }
  }
  function O(c, g) {
    (g == null || g > c.length) && (g = c.length);
    for (var h = 0, s = new Array(g); h < g; h++)
      s[h] = c[h];
    return s;
  }
  function n(c, g) {
    if (!(c instanceof g))
      throw new TypeError("Cannot call a class as a function");
  }
  function t(c, g) {
    for (var h = 0; h < g.length; h++) {
      var s = g[h];
      s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(c, e(s.key), s);
    }
  }
  function r(c, g, h) {
    return g && t(c.prototype, g), h && t(c, h), Object.defineProperty(c, "prototype", { writable: !1 }), c;
  }
  function e(c) {
    var g = o(c, "string");
    return w(g) === "symbol" ? g : String(g);
  }
  function o(c, g) {
    if (w(c) !== "object" || c === null)
      return c;
    var h = c[Symbol.toPrimitive];
    if (h !== void 0) {
      var s = h.call(c, g || "default");
      if (w(s) !== "object")
        return s;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (g === "string" ? String : Number)(c);
  }
  var f = /* @__PURE__ */ function() {
    function c() {
      n(this, c), c.initialize(this);
    }
    return r(c, null, [{
      key: "initialize",
      value: function(h) {
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
      value: function(h, s) {
        return h && (s = s || new c(), h.hasOwnProperty("id") && (s.id = u.default.convertToType(h.id, "Number")), h.hasOwnProperty("title") && (s.title = u.default.convertToType(h.title, "String")), h.hasOwnProperty("href") && (s.href = u.default.convertToType(h.href, "String")), h.hasOwnProperty("slug") && (s.slug = u.default.convertToType(h.slug, "String")), h.hasOwnProperty("json") && (s.json = u.default.convertToType(h.json, [y.default])), h.hasOwnProperty("depth") && (s.depth = u.default.convertToType(h.depth, "Number")), h.hasOwnProperty("is_home") && (s.is_home = u.default.convertToType(h.is_home, "Number")), h.hasOwnProperty("created_at") && (s.created_at = u.default.convertToType(h.created_at, "Number")), h.hasOwnProperty("updated_at") && (s.updated_at = u.default.convertToType(h.updated_at, "Number")), h.hasOwnProperty("is_visible") && (s.is_visible = u.default.convertToType(h.is_visible, "Number")), h.hasOwnProperty("meta_json") && (s.meta_json = l.default.constructFromObject(h.meta_json)), h.hasOwnProperty("properties") && (s.properties = u.default.convertToType(h.properties, {
          String: d.default
        })), h.hasOwnProperty("uid") && (s.uid = u.default.convertToType(h.uid, "String")), h.hasOwnProperty("type") && (s.type = u.default.convertToType(h.type, "String")), h.hasOwnProperty("target") && (s.target = u.default.convertToType(h.target, "String")), h.hasOwnProperty("container") && (s.container = u.default.convertToType(h.container, "String")), h.hasOwnProperty("breadcrumb") && (s.breadcrumb = u.default.convertToType(h.breadcrumb, [p.default]))), s;
      }
      /**
       * Validates the JSON data with respect to <code>Page</code>.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Page</code>.
       */
    }, {
      key: "validateJSON",
      value: function(h) {
        if (h.title && !(typeof h.title == "string" || h.title instanceof String))
          throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + h.title);
        if (h.href && !(typeof h.href == "string" || h.href instanceof String))
          throw new Error("Expected the field `href` to be a primitive type in the JSON string but got " + h.href);
        if (h.slug && !(typeof h.slug == "string" || h.slug instanceof String))
          throw new Error("Expected the field `slug` to be a primitive type in the JSON string but got " + h.slug);
        if (h.json) {
          if (!Array.isArray(h.json))
            throw new Error("Expected the field `json` to be an array in the JSON data but got " + h.json);
          var s = T(h.json), v;
          try {
            for (s.s(); !(v = s.n()).done; ) {
              var m = v.value;
              y.default.validateJSON(m);
            }
          } catch (C) {
            s.e(C);
          } finally {
            s.f();
          }
        }
        if (h.meta_json && l.default.validateJSON(h.meta_json), h.uid && !(typeof h.uid == "string" || h.uid instanceof String))
          throw new Error("Expected the field `uid` to be a primitive type in the JSON string but got " + h.uid);
        if (h.type && !(typeof h.type == "string" || h.type instanceof String))
          throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + h.type);
        if (h.target && !(typeof h.target == "string" || h.target instanceof String))
          throw new Error("Expected the field `target` to be a primitive type in the JSON string but got " + h.target);
        if (h.container && !(typeof h.container == "string" || h.container instanceof String))
          throw new Error("Expected the field `container` to be a primitive type in the JSON string but got " + h.container);
        if (h.breadcrumb) {
          if (!Array.isArray(h.breadcrumb))
            throw new Error("Expected the field `breadcrumb` to be an array in the JSON data but got " + h.breadcrumb);
          var _ = T(h.breadcrumb), P;
          try {
            for (_.s(); !(P = _.n()).done; ) {
              var A = P.value;
              p.default.validateJSON(A);
            }
          } catch (C) {
            _.e(C);
          } finally {
            _.f();
          }
        }
        return !0;
      }
    }]), c;
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
  var u = y(N);
  function y(n) {
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
  function p(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, w(e.key), e);
    }
  }
  function b(n, t, r) {
    return t && d(n.prototype, t), r && d(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
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
      p(this, n), n.initialize(this);
    }
    return b(n, null, [{
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
var Je = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(N), y = l(oe);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function p(n) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, p(n);
  }
  function d(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return p(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (p(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (p(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      d(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "configWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, c = ["ApiToken"], g = [], h = ["application/json"], s = y.default;
        return this.apiClient.callApi("/config", "GET", e, o, f, a, r, c, g, h, s, null);
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
})(Je);
var Me = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(N), y = l(ae);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function p(n) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, p(n);
  }
  function d(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return p(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (p(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (p(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      d(this, n), this.apiClient = t || u.default.instance;
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
        }, c = {}, g = {}, h = ["ApiToken"], s = [], v = ["application/json"], m = y.default;
        return this.apiClient.callApi("/entities/slug/{slug}", "GET", f, a, c, g, o, h, s, v, m, null);
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
        }, f = {}, a = {}, c = {}, g = ["ApiToken"], h = [], s = ["application/json"], v = y.default;
        return this.apiClient.callApi("/entities/uniqueid/{uniqueid}", "GET", o, f, a, c, e, g, h, s, v, null);
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
})(Me);
var xe = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(N), y = l(pe);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function p(n) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, p(n);
  }
  function d(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return p(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (p(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (p(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      d(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "homeWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, c = ["ApiToken"], g = [], h = ["application/json"], s = y.default;
        return this.apiClient.callApi("/pages/home", "GET", e, o, f, a, r, c, g, h, s, null);
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
       * @param {String} [slug] The function retrieves a specific page by its slug. If no slug is provided, it automatically returns the homepage. Moreover, it seamlessly handles paths with subpages, allowing for nested URLs like \"testpage/subpage\". In this way, a forward slash (\"/\") within the path is recognized as a valid character and processed accordingly.
       * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Page} and HTTP response
       */
    }, {
      key: "pageWithHttpInfo",
      value: function(r) {
        r = r || {};
        var e = null, o = {}, f = {
          slug: r.slug
        }, a = {}, c = {}, g = ["ApiToken"], h = [], s = ["application/json"], v = y.default;
        return this.apiClient.callApi("/pages", "GET", o, f, a, c, e, g, h, s, v, null);
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
})(xe);
var Be = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(N), y = l($);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function p(n) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, p(n);
  }
  function d(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return p(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (p(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (p(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      d(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "searchWithHttpInfo",
      value: function(r) {
        var e = null;
        if (r == null)
          throw new Error("Missing the required parameter 'query' when calling search");
        var o = {}, f = {
          query: r
        }, a = {}, c = {}, g = ["ApiToken"], h = [], s = ["application/json"], v = [y.default];
        return this.apiClient.callApi("/search", "GET", o, f, a, c, e, g, h, s, v, null);
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
})(Be);
var De = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(N), y = l($);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function p(n) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, p(n);
  }
  function d(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return p(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (p(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (p(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      d(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "sitemapWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, c = ["ApiToken"], g = [], h = ["application/json"], s = [y.default];
        return this.apiClient.callApi("/sitemap", "GET", e, o, f, a, r, c, g, h, s, null);
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
})(De);
var ze = {};
(function(i) {
  Object.defineProperty(i, "__esModule", {
    value: !0
  }), i.default = void 0;
  var u = l(N), y = l(ve);
  function l(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function p(n) {
    "@babel/helpers - typeof";
    return p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, p(n);
  }
  function d(n, t) {
    if (!(n instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function b(n, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, T(e.key), e);
    }
  }
  function w(n, t, r) {
    return t && b(n.prototype, t), r && b(n, r), Object.defineProperty(n, "prototype", { writable: !1 }), n;
  }
  function T(n) {
    var t = S(n, "string");
    return p(t) === "symbol" ? t : String(t);
  }
  function S(n, t) {
    if (p(n) !== "object" || n === null)
      return n;
    var r = n[Symbol.toPrimitive];
    if (r !== void 0) {
      var e = r.call(n, t || "default");
      if (p(e) !== "object")
        return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(n);
  }
  var O = /* @__PURE__ */ function() {
    function n(t) {
      d(this, n), this.apiClient = t || u.default.instance;
    }
    return w(n, [{
      key: "versionWithHttpInfo",
      value: function() {
        var r = null, e = {}, o = {}, f = {}, a = {}, c = ["ApiToken"], g = [], h = ["application/json"], s = y.default;
        return this.apiClient.callApi("/version", "GET", e, o, f, a, r, c, g, h, s, null);
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
})(ze);
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
      return y.default;
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
      return p.default;
    }
  }), Object.defineProperty(i, "ConfigResponseContainersValue", {
    enumerable: !0,
    get: function() {
      return d.default;
    }
  }), Object.defineProperty(i, "ConfigResponseNitro", {
    enumerable: !0,
    get: function() {
      return b.default;
    }
  }), Object.defineProperty(i, "EntitiesApi", {
    enumerable: !0,
    get: function() {
      return c.default;
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
      return g.default;
    }
  }), Object.defineProperty(i, "PagesInner", {
    enumerable: !0,
    get: function() {
      return o.default;
    }
  }), Object.defineProperty(i, "SearchApi", {
    enumerable: !0,
    get: function() {
      return h.default;
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
  var u = m(N), y = m(ie()), l = m(qe()), p = m(oe), d = m(ue), b = m(le), w = m(ae), T = m(se), S = m(ce), O = m($), n = m(ye), t = m(pe), r = m(he), e = m(me), o = m(fe), f = m(ve), a = m(Je), c = m(Me), g = m(xe), h = m(Be), s = m(De), v = m(ze);
  function m(_) {
    return _ && _.__esModule ? _ : { default: _ };
  }
})(Ke);
const st = /[\p{Lu}]/u, ct = /[\p{Ll}]/u, Te = /^[\p{Lu}](?![\p{Lu}])/gu, Fe = /([\p{Alpha}\p{N}_]|$)/u, de = /[_.\- ]+/, yt = new RegExp("^" + de.source), Pe = new RegExp(de.source + Fe.source, "gu"), Ee = new RegExp("\\d+" + Fe.source, "gu"), pt = (i, u, y, l) => {
  let p = !1, d = !1, b = !1, w = !1;
  for (let T = 0; T < i.length; T++) {
    const S = i[T];
    w = T > 2 ? i[T - 3] === "-" : !0, p && st.test(S) ? (i = i.slice(0, T) + "-" + i.slice(T), p = !1, b = d, d = !0, T++) : d && b && ct.test(S) && (!w || l) ? (i = i.slice(0, T - 1) + "-" + i.slice(T - 1), b = d, d = !1, p = !0) : (p = u(S) === S && y(S) !== S, b = d, d = y(S) === S && u(S) !== S);
  }
  return i;
}, ht = (i, u) => (Te.lastIndex = 0, i.replace(Te, (y) => u(y))), mt = (i, u) => (Pe.lastIndex = 0, Ee.lastIndex = 0, i.replace(Pe, (y, l) => u(l)).replace(Ee, (y) => u(y)));
function vt(i, u) {
  if (!(typeof i == "string" || Array.isArray(i)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (u = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...u
  }, Array.isArray(i) ? i = i.map((d) => d.trim()).filter((d) => d.length).join("-") : i = i.trim(), i.length === 0)
    return "";
  const y = u.locale === !1 ? (d) => d.toLowerCase() : (d) => d.toLocaleLowerCase(u.locale), l = u.locale === !1 ? (d) => d.toUpperCase() : (d) => d.toLocaleUpperCase(u.locale);
  return i.length === 1 ? de.test(i) ? "" : u.pascalCase ? l(i) : y(i) : (i !== y(i) && (i = pt(i, y, l, u.preserveConsecutiveUppercase)), i = i.replace(yt, ""), i = u.preserveConsecutiveUppercase ? ht(i, y) : y(i), u.pascalCase && (i = l(i.charAt(0)) + i.slice(1)), mt(i, l));
}
function dt(i, u, y) {
  const l = "virtual:flyo-components", p = "\0" + l;
  return {
    name: "vite-plugin-flyo-components",
    async resolveId(d) {
      if (d === l)
        return p;
    },
    async load(d) {
      if (d === p) {
        const b = [];
        for (const [T, S] of Object.entries(u)) {
          const O = await this.resolve(
            "/" + i + "/" + S + ".astro"
          );
          O && b.push(`export { default as ${vt(T)} } from "${O.id}"`);
        }
        let w = null;
        return y && (w = await this.resolve(
          "/" + i + "/" + y + ".astro"
        )), w ? b.push(`export { default as fallback } from "${w.id}"`) : b.push('export { default as fallback } from "@flyo/nitro-astro/src/components/FallbackComponent.astro"'), b.join(";");
      }
    }
  };
}
function gt() {
  return globalThis.flyoNitroInstance || console.error("flyoNitroInstance has not been initialized correctly"), globalThis.flyoNitroInstance;
}
function _t(i) {
  const u = {
    accessToken: !1,
    liveEdit: !1,
    fallbackComponent: null,
    ...i
  };
  return {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript: y, updateConfig: l }) => {
        l({
          vite: {
            plugins: [
              dt(
                i.componentsDir,
                i.components,
                i.fallbackComponent
              )
            ]
          }
        }), y(
          "page-ssr",
          `
            import { ApiClient } from '@flyo/nitro-js'
            var defaultClient = ApiClient.instance;
            defaultClient.defaultHeaders = {}

            let ApiToken = defaultClient.authentications['ApiToken'];
            ApiToken.apiKey = '${u.accessToken}';

            globalThis.flyoNitroInstance = defaultClient;
          `
        ), u.liveEdit && y(
          "page",
          `
              window.addEventListener("message", (event) => {
                if (event.data?.action === 'pageRefresh') {
                    window.location.reload(true);
                }
              })

              function getActualWindow() {
                if (window === window.top) {
                  return window;
                } else if (window.parent) {
                  return window.parent;
                }
                return window;
              }

              window.openBlockInFlyo = function(blockUid) {
                getActualWindow().postMessage({
                    action: 'openEdit',
                    data: JSON.parse(JSON.stringify({item:{uid: blockUid}}))
                }, 'https://flyo.cloud')
              }
            `
        );
      }
    }
  };
}
export {
  _t as default,
  gt as useFlyoNitro
};
