function tr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function er(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var r = function o() {
      return this instanceof o ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else
    r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(t).forEach(function(o) {
    var n = Object.getOwnPropertyDescriptor(t, o);
    Object.defineProperty(r, o, n.get ? n : {
      enumerable: !0,
      get: function() {
        return t[o];
      }
    });
  }), r;
}
var Mt = { exports: {} }, ke = { exports: {} };
(function(t) {
  t.exports = e;
  function e(o) {
    if (o)
      return r(o);
  }
  function r(o) {
    for (var n in e.prototype)
      o[n] = e.prototype[n];
    return o;
  }
  e.prototype.on = e.prototype.addEventListener = function(o, n) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + o] = this._callbacks["$" + o] || []).push(n), this;
  }, e.prototype.once = function(o, n) {
    function i() {
      this.off(o, i), n.apply(this, arguments);
    }
    return i.fn = n, this.on(o, i), this;
  }, e.prototype.off = e.prototype.removeListener = e.prototype.removeAllListeners = e.prototype.removeEventListener = function(o, n) {
    if (this._callbacks = this._callbacks || {}, arguments.length == 0)
      return this._callbacks = {}, this;
    var i = this._callbacks["$" + o];
    if (!i)
      return this;
    if (arguments.length == 1)
      return delete this._callbacks["$" + o], this;
    for (var a, s = 0; s < i.length; s++)
      if (a = i[s], a === n || a.fn === n) {
        i.splice(s, 1);
        break;
      }
    return i.length === 0 && delete this._callbacks["$" + o], this;
  }, e.prototype.emit = function(o) {
    this._callbacks = this._callbacks || {};
    for (var n = new Array(arguments.length - 1), i = this._callbacks["$" + o], a = 1; a < arguments.length; a++)
      n[a - 1] = arguments[a];
    if (i) {
      i = i.slice(0);
      for (var a = 0, s = i.length; a < s; ++a)
        i[a].apply(this, n);
    }
    return this;
  }, e.prototype.listeners = function(o) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + o] || [];
  }, e.prototype.hasListeners = function(o) {
    return !!this.listeners(o).length;
  };
})(ke);
var rr = ke.exports, or = ht;
ht.default = ht;
ht.stable = Ie;
ht.stableStringify = Ie;
var wt = "[...]", Re = "[Circular]", tt = [], X = [];
function Ce() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function ht(t, e, r, o) {
  typeof o > "u" && (o = Ce()), qt(t, "", 0, [], void 0, 0, o);
  var n;
  try {
    X.length === 0 ? n = JSON.stringify(t, e, r) : n = JSON.stringify(t, Ne(e), r);
  } catch {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    for (; tt.length !== 0; ) {
      var i = tt.pop();
      i.length === 4 ? Object.defineProperty(i[0], i[1], i[3]) : i[0][i[1]] = i[2];
    }
  }
  return n;
}
function nt(t, e, r, o) {
  var n = Object.getOwnPropertyDescriptor(o, r);
  n.get !== void 0 ? n.configurable ? (Object.defineProperty(o, r, { value: t }), tt.push([o, r, e, n])) : X.push([e, r, t]) : (o[r] = t, tt.push([o, r, e]));
}
function qt(t, e, r, o, n, i, a) {
  i += 1;
  var s;
  if (typeof t == "object" && t !== null) {
    for (s = 0; s < o.length; s++)
      if (o[s] === t) {
        nt(Re, t, e, n);
        return;
      }
    if (typeof a.depthLimit < "u" && i > a.depthLimit) {
      nt(wt, t, e, n);
      return;
    }
    if (typeof a.edgesLimit < "u" && r + 1 > a.edgesLimit) {
      nt(wt, t, e, n);
      return;
    }
    if (o.push(t), Array.isArray(t))
      for (s = 0; s < t.length; s++)
        qt(t[s], s, s, o, t, i, a);
    else {
      var u = Object.keys(t);
      for (s = 0; s < u.length; s++) {
        var f = u[s];
        qt(t[f], f, s, o, t, i, a);
      }
    }
    o.pop();
  }
}
function nr(t, e) {
  return t < e ? -1 : t > e ? 1 : 0;
}
function Ie(t, e, r, o) {
  typeof o > "u" && (o = Ce());
  var n = Bt(t, "", 0, [], void 0, 0, o) || t, i;
  try {
    X.length === 0 ? i = JSON.stringify(n, e, r) : i = JSON.stringify(n, Ne(e), r);
  } catch {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    for (; tt.length !== 0; ) {
      var a = tt.pop();
      a.length === 4 ? Object.defineProperty(a[0], a[1], a[3]) : a[0][a[1]] = a[2];
    }
  }
  return i;
}
function Bt(t, e, r, o, n, i, a) {
  i += 1;
  var s;
  if (typeof t == "object" && t !== null) {
    for (s = 0; s < o.length; s++)
      if (o[s] === t) {
        nt(Re, t, e, n);
        return;
      }
    try {
      if (typeof t.toJSON == "function")
        return;
    } catch {
      return;
    }
    if (typeof a.depthLimit < "u" && i > a.depthLimit) {
      nt(wt, t, e, n);
      return;
    }
    if (typeof a.edgesLimit < "u" && r + 1 > a.edgesLimit) {
      nt(wt, t, e, n);
      return;
    }
    if (o.push(t), Array.isArray(t))
      for (s = 0; s < t.length; s++)
        Bt(t[s], s, s, o, t, i, a);
    else {
      var u = {}, f = Object.keys(t).sort(nr);
      for (s = 0; s < f.length; s++) {
        var b = f[s];
        Bt(t[b], b, s, o, t, i, a), u[b] = t[b];
      }
      if (typeof n < "u")
        tt.push([n, e, t]), n[e] = u;
      else
        return u;
    }
    o.pop();
  }
}
function Ne(t) {
  return t = typeof t < "u" ? t : function(e, r) {
    return r;
  }, function(e, r) {
    if (X.length > 0)
      for (var o = 0; o < X.length; o++) {
        var n = X[o];
        if (n[1] === e && n[0] === r) {
          r = n[2], X.splice(o, 1);
          break;
        }
      }
    return t.call(this, e, r);
  };
}
var ir = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var t = {}, e = Symbol("test"), r = Object(e);
  if (typeof e == "string" || Object.prototype.toString.call(e) !== "[object Symbol]" || Object.prototype.toString.call(r) !== "[object Symbol]")
    return !1;
  var o = 42;
  t[e] = o;
  for (e in t)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(t).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(t).length !== 0)
    return !1;
  var n = Object.getOwnPropertySymbols(t);
  if (n.length !== 1 || n[0] !== e || !Object.prototype.propertyIsEnumerable.call(t, e))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var i = Object.getOwnPropertyDescriptor(t, e);
    if (i.value !== o || i.enumerable !== !0)
      return !1;
  }
  return !0;
}, ie = typeof Symbol < "u" && Symbol, ar = ir, sr = function() {
  return typeof ie != "function" || typeof Symbol != "function" || typeof ie("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : ar();
}, lr = "Function.prototype.bind called on incompatible ", ur = Object.prototype.toString, cr = Math.max, pr = "[object Function]", ae = function(t, e) {
  for (var r = [], o = 0; o < t.length; o += 1)
    r[o] = t[o];
  for (var n = 0; n < e.length; n += 1)
    r[n + t.length] = e[n];
  return r;
}, fr = function(t, e) {
  for (var r = [], o = e || 0, n = 0; o < t.length; o += 1, n += 1)
    r[n] = t[o];
  return r;
}, yr = function(t, e) {
  for (var r = "", o = 0; o < t.length; o += 1)
    r += t[o], o + 1 < t.length && (r += e);
  return r;
}, hr = function(t) {
  var e = this;
  if (typeof e != "function" || ur.apply(e) !== pr)
    throw new TypeError(lr + e);
  for (var r = fr(arguments, 1), o, n = function() {
    if (this instanceof o) {
      var f = e.apply(
        this,
        ae(r, arguments)
      );
      return Object(f) === f ? f : this;
    }
    return e.apply(
      t,
      ae(r, arguments)
    );
  }, i = cr(0, e.length - r.length), a = [], s = 0; s < i; s++)
    a[s] = "$" + s;
  if (o = Function("binder", "return function (" + yr(a, ",") + "){ return binder.apply(this,arguments); }")(n), e.prototype) {
    var u = function() {
    };
    u.prototype = e.prototype, o.prototype = new u(), u.prototype = null;
  }
  return o;
}, dr = hr, Qt = Function.prototype.bind || dr, mr = Qt, br = mr.call(Function.call, Object.prototype.hasOwnProperty), A, at = SyntaxError, Fe = Function, it = TypeError, Pt = function(t) {
  try {
    return Fe('"use strict"; return (' + t + ").constructor;")();
  } catch {
  }
}, Z = Object.getOwnPropertyDescriptor;
if (Z)
  try {
    Z({}, "");
  } catch {
    Z = null;
  }
var xt = function() {
  throw new it();
}, gr = Z ? function() {
  try {
    return arguments.callee, xt;
  } catch {
    try {
      return Z(arguments, "callee").get;
    } catch {
      return xt;
    }
  }
}() : xt, rt = sr(), z = Object.getPrototypeOf || function(t) {
  return t.__proto__;
}, ot = {}, vr = typeof Uint8Array > "u" ? A : z(Uint8Array), Y = {
  "%AggregateError%": typeof AggregateError > "u" ? A : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? A : ArrayBuffer,
  "%ArrayIteratorPrototype%": rt ? z([][Symbol.iterator]()) : A,
  "%AsyncFromSyncIteratorPrototype%": A,
  "%AsyncFunction%": ot,
  "%AsyncGenerator%": ot,
  "%AsyncGeneratorFunction%": ot,
  "%AsyncIteratorPrototype%": ot,
  "%Atomics%": typeof Atomics > "u" ? A : Atomics,
  "%BigInt%": typeof BigInt > "u" ? A : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? A : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? A : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? A : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? A : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? A : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? A : FinalizationRegistry,
  "%Function%": Fe,
  "%GeneratorFunction%": ot,
  "%Int8Array%": typeof Int8Array > "u" ? A : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? A : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? A : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": rt ? z(z([][Symbol.iterator]())) : A,
  "%JSON%": typeof JSON == "object" ? JSON : A,
  "%Map%": typeof Map > "u" ? A : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !rt ? A : z((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? A : Promise,
  "%Proxy%": typeof Proxy > "u" ? A : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? A : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? A : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !rt ? A : z((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? A : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": rt ? z(""[Symbol.iterator]()) : A,
  "%Symbol%": rt ? Symbol : A,
  "%SyntaxError%": at,
  "%ThrowTypeError%": gr,
  "%TypedArray%": vr,
  "%TypeError%": it,
  "%Uint8Array%": typeof Uint8Array > "u" ? A : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? A : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? A : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? A : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? A : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? A : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? A : WeakSet
};
try {
  null.error;
} catch (t) {
  var wr = z(z(t));
  Y["%Error.prototype%"] = wr;
}
var Sr = function t(e) {
  var r;
  if (e === "%AsyncFunction%")
    r = Pt("async function () {}");
  else if (e === "%GeneratorFunction%")
    r = Pt("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    r = Pt("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var o = t("%AsyncGeneratorFunction%");
    o && (r = o.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var n = t("%AsyncGenerator%");
    n && (r = z(n.prototype));
  }
  return Y[e] = r, r;
}, se = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, mt = Qt, St = br, Ar = mt.call(Function.call, Array.prototype.concat), _r = mt.call(Function.apply, Array.prototype.splice), le = mt.call(Function.call, String.prototype.replace), At = mt.call(Function.call, String.prototype.slice), Or = mt.call(Function.call, RegExp.prototype.exec), Er = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, jr = /\\(\\)?/g, Tr = function(t) {
  var e = At(t, 0, 1), r = At(t, -1);
  if (e === "%" && r !== "%")
    throw new at("invalid intrinsic syntax, expected closing `%`");
  if (r === "%" && e !== "%")
    throw new at("invalid intrinsic syntax, expected opening `%`");
  var o = [];
  return le(t, Er, function(n, i, a, s) {
    o[o.length] = a ? le(s, jr, "$1") : i || n;
  }), o;
}, Pr = function(t, e) {
  var r = t, o;
  if (St(se, r) && (o = se[r], r = "%" + o[0] + "%"), St(Y, r)) {
    var n = Y[r];
    if (n === ot && (n = Sr(r)), typeof n > "u" && !e)
      throw new it("intrinsic " + t + " exists, but is not available. Please file an issue!");
    return {
      alias: o,
      name: r,
      value: n
    };
  }
  throw new at("intrinsic " + t + " does not exist!");
}, Kt = function(t, e) {
  if (typeof t != "string" || t.length === 0)
    throw new it("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof e != "boolean")
    throw new it('"allowMissing" argument must be a boolean');
  if (Or(/^%?[^%]*%?$/, t) === null)
    throw new at("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var r = Tr(t), o = r.length > 0 ? r[0] : "", n = Pr("%" + o + "%", e), i = n.name, a = n.value, s = !1, u = n.alias;
  u && (o = u[0], _r(r, Ar([0, 1], u)));
  for (var f = 1, b = !0; f < r.length; f += 1) {
    var v = r[f], m = At(v, 0, 1), S = At(v, -1);
    if ((m === '"' || m === "'" || m === "`" || S === '"' || S === "'" || S === "`") && m !== S)
      throw new at("property names with quotes must have matching quotes");
    if ((v === "constructor" || !b) && (s = !0), o += "." + v, i = "%" + o + "%", St(Y, i))
      a = Y[i];
    else if (a != null) {
      if (!(v in a)) {
        if (!e)
          throw new it("base intrinsic for " + t + " exists, but the property is not available.");
        return;
      }
      if (Z && f + 1 >= r.length) {
        var w = Z(a, v);
        b = !!w, b && "get" in w && !("originalValue" in w.get) ? a = w.get : a = a[v];
      } else
        b = St(a, v), a = a[v];
      b && !s && (Y[i] = a);
    }
  }
  return a;
}, Ue = { exports: {} };
(function(t) {
  var e = Qt, r = Kt, o = r("%Function.prototype.apply%"), n = r("%Function.prototype.call%"), i = r("%Reflect.apply%", !0) || e.call(n, o), a = r("%Object.getOwnPropertyDescriptor%", !0), s = r("%Object.defineProperty%", !0), u = r("%Math.max%");
  if (s)
    try {
      s({}, "a", { value: 1 });
    } catch {
      s = null;
    }
  t.exports = function(b) {
    var v = i(e, n, arguments);
    if (a && s) {
      var m = a(v, "length");
      m.configurable && s(
        v,
        "length",
        { value: 1 + u(0, b.length - (arguments.length - 1)) }
      );
    }
    return v;
  };
  var f = function() {
    return i(e, o, arguments);
  };
  s ? s(t.exports, "apply", { value: f }) : t.exports.apply = f;
})(Ue);
var xr = Ue.exports, De = Kt, Le = xr, kr = Le(De("String.prototype.indexOf")), Rr = function(t, e) {
  var r = De(t, !!e);
  return typeof r == "function" && kr(t, ".prototype.") > -1 ? Le(r) : r;
};
const Me = {}, Cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Me
}, Symbol.toStringTag, { value: "Module" })), qe = /* @__PURE__ */ er(Cr);
var Xt = typeof Map == "function" && Map.prototype, kt = Object.getOwnPropertyDescriptor && Xt ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, _t = Xt && kt && typeof kt.get == "function" ? kt.get : null, ue = Xt && Map.prototype.forEach, Zt = typeof Set == "function" && Set.prototype, Rt = Object.getOwnPropertyDescriptor && Zt ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Ot = Zt && Rt && typeof Rt.get == "function" ? Rt.get : null, ce = Zt && Set.prototype.forEach, Ir = typeof WeakMap == "function" && WeakMap.prototype, pt = Ir ? WeakMap.prototype.has : null, Nr = typeof WeakSet == "function" && WeakSet.prototype, ft = Nr ? WeakSet.prototype.has : null, Fr = typeof WeakRef == "function" && WeakRef.prototype, pe = Fr ? WeakRef.prototype.deref : null, Ur = Boolean.prototype.valueOf, Dr = Object.prototype.toString, Lr = Function.prototype.toString, Mr = String.prototype.match, Yt = String.prototype.slice, V = String.prototype.replace, qr = String.prototype.toUpperCase, fe = String.prototype.toLowerCase, Be = RegExp.prototype.test, ye = Array.prototype.concat, H = Array.prototype.join, Br = Array.prototype.slice, he = Math.floor, zt = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Ct = Object.getOwnPropertySymbols, Ht = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, st = typeof Symbol == "function" && typeof Symbol.iterator == "object", I = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === st || !0) ? Symbol.toStringTag : null, ze = Object.prototype.propertyIsEnumerable, de = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(t) {
  return t.__proto__;
} : null);
function me(t, e) {
  if (t === 1 / 0 || t === -1 / 0 || t !== t || t && t > -1e3 && t < 1e3 || Be.call(/e/, e))
    return e;
  var r = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof t == "number") {
    var o = t < 0 ? -he(-t) : he(t);
    if (o !== t) {
      var n = String(o), i = Yt.call(e, n.length + 1);
      return V.call(n, r, "$&_") + "." + V.call(V.call(i, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return V.call(e, r, "$&_");
}
var $t = qe, be = $t.custom, ge = $e(be) ? be : null, zr = function t(e, r, o, n) {
  var i = r || {};
  if (J(i, "quoteStyle") && i.quoteStyle !== "single" && i.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (J(i, "maxStringLength") && (typeof i.maxStringLength == "number" ? i.maxStringLength < 0 && i.maxStringLength !== 1 / 0 : i.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var a = J(i, "customInspect") ? i.customInspect : !0;
  if (typeof a != "boolean" && a !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (J(i, "indent") && i.indent !== null && i.indent !== "	" && !(parseInt(i.indent, 10) === i.indent && i.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (J(i, "numericSeparator") && typeof i.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var s = i.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return Ge(e, i);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var u = String(e);
    return s ? me(e, u) : u;
  }
  if (typeof e == "bigint") {
    var f = String(e) + "n";
    return s ? me(e, f) : f;
  }
  var b = typeof i.depth > "u" ? 5 : i.depth;
  if (typeof o > "u" && (o = 0), o >= b && b > 0 && typeof e == "object")
    return Wt(e) ? "[Array]" : "[Object]";
  var v = ao(i, o);
  if (typeof n > "u")
    n = [];
  else if (We(n, e) >= 0)
    return "[Circular]";
  function m(l, c, p) {
    if (c && (n = Br.call(n), n.push(c)), p) {
      var y = {
        depth: i.depth
      };
      return J(i, "quoteStyle") && (y.quoteStyle = i.quoteStyle), t(l, y, o + 1, n);
    }
    return t(l, i, o + 1, n);
  }
  if (typeof e == "function" && !ve(e)) {
    var S = Xr(e), w = bt(e, m);
    return "[Function" + (S ? ": " + S : " (anonymous)") + "]" + (w.length > 0 ? " { " + H.call(w, ", ") + " }" : "");
  }
  if ($e(e)) {
    var C = st ? V.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : Ht.call(e);
    return typeof e == "object" && !st ? ct(C) : C;
  }
  if (oo(e)) {
    for (var x = "<" + fe.call(String(e.nodeName)), h = e.attributes || [], k = 0; k < h.length; k++)
      x += " " + h[k].name + "=" + He(Hr(h[k].value), "double", i);
    return x += ">", e.childNodes && e.childNodes.length && (x += "..."), x += "</" + fe.call(String(e.nodeName)) + ">", x;
  }
  if (Wt(e)) {
    if (e.length === 0)
      return "[]";
    var F = bt(e, m);
    return v && !io(F) ? "[" + Gt(F, v) + "]" : "[ " + H.call(F, ", ") + " ]";
  }
  if (Wr(e)) {
    var E = bt(e, m);
    return !("cause" in Error.prototype) && "cause" in e && !ze.call(e, "cause") ? "{ [" + String(e) + "] " + H.call(ye.call("[cause]: " + m(e.cause), E), ", ") + " }" : E.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + H.call(E, ", ") + " }";
  }
  if (typeof e == "object" && a) {
    if (ge && typeof e[ge] == "function" && $t)
      return $t(e, { depth: b - o });
    if (a !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (Zr(e)) {
    var U = [];
    return ue && ue.call(e, function(l, c) {
      U.push(m(c, e, !0) + " => " + m(l, e));
    }), we("Map", _t.call(e), U, v);
  }
  if (eo(e)) {
    var M = [];
    return ce && ce.call(e, function(l) {
      M.push(m(l, e));
    }), we("Set", Ot.call(e), M, v);
  }
  if (Yr(e))
    return It("WeakMap");
  if (ro(e))
    return It("WeakSet");
  if (to(e))
    return It("WeakRef");
  if (Jr(e))
    return ct(m(Number(e)));
  if (Qr(e))
    return ct(m(zt.call(e)));
  if (Vr(e))
    return ct(Ur.call(e));
  if (Gr(e))
    return ct(m(String(e)));
  if (!$r(e) && !ve(e)) {
    var j = bt(e, m), T = de ? de(e) === Object.prototype : e instanceof Object || e.constructor === Object, _ = e instanceof Object ? "" : "null prototype", D = !T && I && Object(e) === e && I in e ? Yt.call(Q(e), 8, -1) : _ ? "Object" : "", q = T || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", $ = q + (D || _ ? "[" + H.call(ye.call([], D || [], _ || []), ": ") + "] " : "");
    return j.length === 0 ? $ + "{}" : v ? $ + "{" + Gt(j, v) + "}" : $ + "{ " + H.call(j, ", ") + " }";
  }
  return String(e);
};
function He(t, e, r) {
  var o = (r.quoteStyle || e) === "double" ? '"' : "'";
  return o + t + o;
}
function Hr(t) {
  return V.call(String(t), /"/g, "&quot;");
}
function Wt(t) {
  return Q(t) === "[object Array]" && (!I || !(typeof t == "object" && I in t));
}
function $r(t) {
  return Q(t) === "[object Date]" && (!I || !(typeof t == "object" && I in t));
}
function ve(t) {
  return Q(t) === "[object RegExp]" && (!I || !(typeof t == "object" && I in t));
}
function Wr(t) {
  return Q(t) === "[object Error]" && (!I || !(typeof t == "object" && I in t));
}
function Gr(t) {
  return Q(t) === "[object String]" && (!I || !(typeof t == "object" && I in t));
}
function Jr(t) {
  return Q(t) === "[object Number]" && (!I || !(typeof t == "object" && I in t));
}
function Vr(t) {
  return Q(t) === "[object Boolean]" && (!I || !(typeof t == "object" && I in t));
}
function $e(t) {
  if (st)
    return t && typeof t == "object" && t instanceof Symbol;
  if (typeof t == "symbol")
    return !0;
  if (!t || typeof t != "object" || !Ht)
    return !1;
  try {
    return Ht.call(t), !0;
  } catch {
  }
  return !1;
}
function Qr(t) {
  if (!t || typeof t != "object" || !zt)
    return !1;
  try {
    return zt.call(t), !0;
  } catch {
  }
  return !1;
}
var Kr = Object.prototype.hasOwnProperty || function(t) {
  return t in this;
};
function J(t, e) {
  return Kr.call(t, e);
}
function Q(t) {
  return Dr.call(t);
}
function Xr(t) {
  if (t.name)
    return t.name;
  var e = Mr.call(Lr.call(t), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function We(t, e) {
  if (t.indexOf)
    return t.indexOf(e);
  for (var r = 0, o = t.length; r < o; r++)
    if (t[r] === e)
      return r;
  return -1;
}
function Zr(t) {
  if (!_t || !t || typeof t != "object")
    return !1;
  try {
    _t.call(t);
    try {
      Ot.call(t);
    } catch {
      return !0;
    }
    return t instanceof Map;
  } catch {
  }
  return !1;
}
function Yr(t) {
  if (!pt || !t || typeof t != "object")
    return !1;
  try {
    pt.call(t, pt);
    try {
      ft.call(t, ft);
    } catch {
      return !0;
    }
    return t instanceof WeakMap;
  } catch {
  }
  return !1;
}
function to(t) {
  if (!pe || !t || typeof t != "object")
    return !1;
  try {
    return pe.call(t), !0;
  } catch {
  }
  return !1;
}
function eo(t) {
  if (!Ot || !t || typeof t != "object")
    return !1;
  try {
    Ot.call(t);
    try {
      _t.call(t);
    } catch {
      return !0;
    }
    return t instanceof Set;
  } catch {
  }
  return !1;
}
function ro(t) {
  if (!ft || !t || typeof t != "object")
    return !1;
  try {
    ft.call(t, ft);
    try {
      pt.call(t, pt);
    } catch {
      return !0;
    }
    return t instanceof WeakSet;
  } catch {
  }
  return !1;
}
function oo(t) {
  return !t || typeof t != "object" ? !1 : typeof HTMLElement < "u" && t instanceof HTMLElement ? !0 : typeof t.nodeName == "string" && typeof t.getAttribute == "function";
}
function Ge(t, e) {
  if (t.length > e.maxStringLength) {
    var r = t.length - e.maxStringLength, o = "... " + r + " more character" + (r > 1 ? "s" : "");
    return Ge(Yt.call(t, 0, e.maxStringLength), e) + o;
  }
  var n = V.call(V.call(t, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, no);
  return He(n, "single", e);
}
function no(t) {
  var e = t.charCodeAt(0), r = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return r ? "\\" + r : "\\x" + (e < 16 ? "0" : "") + qr.call(e.toString(16));
}
function ct(t) {
  return "Object(" + t + ")";
}
function It(t) {
  return t + " { ? }";
}
function we(t, e, r, o) {
  var n = o ? Gt(r, o) : H.call(r, ", ");
  return t + " (" + e + ") {" + n + "}";
}
function io(t) {
  for (var e = 0; e < t.length; e++)
    if (We(t[e], `
`) >= 0)
      return !1;
  return !0;
}
function ao(t, e) {
  var r;
  if (t.indent === "	")
    r = "	";
  else if (typeof t.indent == "number" && t.indent > 0)
    r = H.call(Array(t.indent + 1), " ");
  else
    return null;
  return {
    base: r,
    prev: H.call(Array(e + 1), r)
  };
}
function Gt(t, e) {
  if (t.length === 0)
    return "";
  var r = `
` + e.prev + e.base;
  return r + H.call(t, "," + r) + `
` + e.prev;
}
function bt(t, e) {
  var r = Wt(t), o = [];
  if (r) {
    o.length = t.length;
    for (var n = 0; n < t.length; n++)
      o[n] = J(t, n) ? e(t[n], t) : "";
  }
  var i = typeof Ct == "function" ? Ct(t) : [], a;
  if (st) {
    a = {};
    for (var s = 0; s < i.length; s++)
      a["$" + i[s]] = i[s];
  }
  for (var u in t)
    J(t, u) && (r && String(Number(u)) === u && u < t.length || st && a["$" + u] instanceof Symbol || (Be.call(/[^\w$]/, u) ? o.push(e(u, t) + ": " + e(t[u], t)) : o.push(u + ": " + e(t[u], t))));
  if (typeof Ct == "function")
    for (var f = 0; f < i.length; f++)
      ze.call(t, i[f]) && o.push("[" + e(i[f]) + "]: " + e(t[i[f]], t));
  return o;
}
var te = Kt, ut = Rr, so = zr, lo = te("%TypeError%"), gt = te("%WeakMap%", !0), vt = te("%Map%", !0), uo = ut("WeakMap.prototype.get", !0), co = ut("WeakMap.prototype.set", !0), po = ut("WeakMap.prototype.has", !0), fo = ut("Map.prototype.get", !0), yo = ut("Map.prototype.set", !0), ho = ut("Map.prototype.has", !0), ee = function(t, e) {
  for (var r = t, o; (o = r.next) !== null; r = o)
    if (o.key === e)
      return r.next = o.next, o.next = t.next, t.next = o, o;
}, mo = function(t, e) {
  var r = ee(t, e);
  return r && r.value;
}, bo = function(t, e, r) {
  var o = ee(t, e);
  o ? o.value = r : t.next = {
    // eslint-disable-line no-param-reassign
    key: e,
    next: t.next,
    value: r
  };
}, go = function(t, e) {
  return !!ee(t, e);
}, vo = function() {
  var t, e, r, o = {
    assert: function(n) {
      if (!o.has(n))
        throw new lo("Side channel does not contain " + so(n));
    },
    get: function(n) {
      if (gt && n && (typeof n == "object" || typeof n == "function")) {
        if (t)
          return uo(t, n);
      } else if (vt) {
        if (e)
          return fo(e, n);
      } else if (r)
        return mo(r, n);
    },
    has: function(n) {
      if (gt && n && (typeof n == "object" || typeof n == "function")) {
        if (t)
          return po(t, n);
      } else if (vt) {
        if (e)
          return ho(e, n);
      } else if (r)
        return go(r, n);
      return !1;
    },
    set: function(n, i) {
      gt && n && (typeof n == "object" || typeof n == "function") ? (t || (t = new gt()), co(t, n, i)) : vt ? (e || (e = new vt()), yo(e, n, i)) : (r || (r = { key: {}, next: null }), bo(r, n, i));
    }
  };
  return o;
}, wo = String.prototype.replace, So = /%20/g, Nt = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, re = {
  default: Nt.RFC3986,
  formatters: {
    RFC1738: function(t) {
      return wo.call(t, So, "+");
    },
    RFC3986: function(t) {
      return String(t);
    }
  },
  RFC1738: Nt.RFC1738,
  RFC3986: Nt.RFC3986
}, Ao = re, Ft = Object.prototype.hasOwnProperty, K = Array.isArray, B = function() {
  for (var t = [], e = 0; e < 256; ++e)
    t.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return t;
}(), _o = function(t) {
  for (; t.length > 1; ) {
    var e = t.pop(), r = e.obj[e.prop];
    if (K(r)) {
      for (var o = [], n = 0; n < r.length; ++n)
        typeof r[n] < "u" && o.push(r[n]);
      e.obj[e.prop] = o;
    }
  }
}, Je = function(t, e) {
  for (var r = e && e.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = 0; o < t.length; ++o)
    typeof t[o] < "u" && (r[o] = t[o]);
  return r;
}, Oo = function t(e, r, o) {
  if (!r)
    return e;
  if (typeof r != "object") {
    if (K(e))
      e.push(r);
    else if (e && typeof e == "object")
      (o && (o.plainObjects || o.allowPrototypes) || !Ft.call(Object.prototype, r)) && (e[r] = !0);
    else
      return [e, r];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(r);
  var n = e;
  return K(e) && !K(r) && (n = Je(e, o)), K(e) && K(r) ? (r.forEach(function(i, a) {
    if (Ft.call(e, a)) {
      var s = e[a];
      s && typeof s == "object" && i && typeof i == "object" ? e[a] = t(s, i, o) : e.push(i);
    } else
      e[a] = i;
  }), e) : Object.keys(r).reduce(function(i, a) {
    var s = r[a];
    return Ft.call(i, a) ? i[a] = t(i[a], s, o) : i[a] = s, i;
  }, n);
}, Eo = function(t, e) {
  return Object.keys(e).reduce(function(r, o) {
    return r[o] = e[o], r;
  }, t);
}, jo = function(t, e, r) {
  var o = t.replace(/\+/g, " ");
  if (r === "iso-8859-1")
    return o.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(o);
  } catch {
    return o;
  }
}, To = function(t, e, r, o, n) {
  if (t.length === 0)
    return t;
  var i = t;
  if (typeof t == "symbol" ? i = Symbol.prototype.toString.call(t) : typeof t != "string" && (i = String(t)), r === "iso-8859-1")
    return escape(i).replace(/%u[0-9a-f]{4}/gi, function(f) {
      return "%26%23" + parseInt(f.slice(2), 16) + "%3B";
    });
  for (var a = "", s = 0; s < i.length; ++s) {
    var u = i.charCodeAt(s);
    if (u === 45 || u === 46 || u === 95 || u === 126 || u >= 48 && u <= 57 || u >= 65 && u <= 90 || u >= 97 && u <= 122 || n === Ao.RFC1738 && (u === 40 || u === 41)) {
      a += i.charAt(s);
      continue;
    }
    if (u < 128) {
      a = a + B[u];
      continue;
    }
    if (u < 2048) {
      a = a + (B[192 | u >> 6] + B[128 | u & 63]);
      continue;
    }
    if (u < 55296 || u >= 57344) {
      a = a + (B[224 | u >> 12] + B[128 | u >> 6 & 63] + B[128 | u & 63]);
      continue;
    }
    s += 1, u = 65536 + ((u & 1023) << 10 | i.charCodeAt(s) & 1023), a += B[240 | u >> 18] + B[128 | u >> 12 & 63] + B[128 | u >> 6 & 63] + B[128 | u & 63];
  }
  return a;
}, Po = function(t) {
  for (var e = [{ obj: { o: t }, prop: "o" }], r = [], o = 0; o < e.length; ++o)
    for (var n = e[o], i = n.obj[n.prop], a = Object.keys(i), s = 0; s < a.length; ++s) {
      var u = a[s], f = i[u];
      typeof f == "object" && f !== null && r.indexOf(f) === -1 && (e.push({ obj: i, prop: u }), r.push(f));
    }
  return _o(e), t;
}, xo = function(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}, ko = function(t) {
  return !t || typeof t != "object" ? !1 : !!(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t));
}, Ro = function(t, e) {
  return [].concat(t, e);
}, Co = function(t, e) {
  if (K(t)) {
    for (var r = [], o = 0; o < t.length; o += 1)
      r.push(e(t[o]));
    return r;
  }
  return e(t);
}, Ve = {
  arrayToObject: Je,
  assign: Eo,
  combine: Ro,
  compact: Po,
  decode: jo,
  encode: To,
  isBuffer: ko,
  isRegExp: xo,
  maybeMap: Co,
  merge: Oo
}, Qe = vo, Jt = Ve, yt = re, Io = Object.prototype.hasOwnProperty, Se = {
  brackets: function(t) {
    return t + "[]";
  },
  comma: "comma",
  indices: function(t, e) {
    return t + "[" + e + "]";
  },
  repeat: function(t) {
    return t;
  }
}, W = Array.isArray, No = String.prototype.split, Fo = Array.prototype.push, Ke = function(t, e) {
  Fo.apply(t, W(e) ? e : [e]);
}, Uo = Date.prototype.toISOString, Ae = yt.default, R = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: Jt.encode,
  encodeValuesOnly: !1,
  format: Ae,
  formatter: yt.formatters[Ae],
  // deprecated
  indices: !1,
  serializeDate: function(t) {
    return Uo.call(t);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, Do = function(t) {
  return typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "symbol" || typeof t == "bigint";
}, Ut = {}, Lo = function t(e, r, o, n, i, a, s, u, f, b, v, m, S, w, C, x) {
  for (var h = e, k = x, F = 0, E = !1; (k = k.get(Ut)) !== void 0 && !E; ) {
    var U = k.get(e);
    if (F += 1, typeof U < "u") {
      if (U === F)
        throw new RangeError("Cyclic object value");
      E = !0;
    }
    typeof k.get(Ut) > "u" && (F = 0);
  }
  if (typeof u == "function" ? h = u(r, h) : h instanceof Date ? h = v(h) : o === "comma" && W(h) && (h = Jt.maybeMap(h, function(N) {
    return N instanceof Date ? v(N) : N;
  })), h === null) {
    if (i)
      return s && !w ? s(r, R.encoder, C, "key", m) : r;
    h = "";
  }
  if (Do(h) || Jt.isBuffer(h)) {
    if (s) {
      var M = w ? r : s(r, R.encoder, C, "key", m);
      if (o === "comma" && w) {
        for (var j = No.call(String(h), ","), T = "", _ = 0; _ < j.length; ++_)
          T += (_ === 0 ? "" : ",") + S(s(j[_], R.encoder, C, "value", m));
        return [S(M) + (n && W(h) && j.length === 1 ? "[]" : "") + "=" + T];
      }
      return [S(M) + "=" + S(s(h, R.encoder, C, "value", m))];
    }
    return [S(r) + "=" + S(String(h))];
  }
  var D = [];
  if (typeof h > "u")
    return D;
  var q;
  if (o === "comma" && W(h))
    q = [{ value: h.length > 0 ? h.join(",") || null : void 0 }];
  else if (W(u))
    q = u;
  else {
    var $ = Object.keys(h);
    q = f ? $.sort(f) : $;
  }
  for (var l = n && W(h) && h.length === 1 ? r + "[]" : r, c = 0; c < q.length; ++c) {
    var p = q[c], y = typeof p == "object" && typeof p.value < "u" ? p.value : h[p];
    if (!(a && y === null)) {
      var d = W(h) ? typeof o == "function" ? o(l, p) : l : l + (b ? "." + p : "[" + p + "]");
      x.set(e, F);
      var g = Qe();
      g.set(Ut, x), Ke(D, t(
        y,
        d,
        o,
        n,
        i,
        a,
        s,
        u,
        f,
        b,
        v,
        m,
        S,
        w,
        C,
        g
      ));
    }
  }
  return D;
}, Mo = function(t) {
  if (!t)
    return R;
  if (t.encoder !== null && typeof t.encoder < "u" && typeof t.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var e = t.charset || R.charset;
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var r = yt.default;
  if (typeof t.format < "u") {
    if (!Io.call(yt.formatters, t.format))
      throw new TypeError("Unknown format option provided.");
    r = t.format;
  }
  var o = yt.formatters[r], n = R.filter;
  return (typeof t.filter == "function" || W(t.filter)) && (n = t.filter), {
    addQueryPrefix: typeof t.addQueryPrefix == "boolean" ? t.addQueryPrefix : R.addQueryPrefix,
    allowDots: typeof t.allowDots > "u" ? R.allowDots : !!t.allowDots,
    charset: e,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : R.charsetSentinel,
    delimiter: typeof t.delimiter > "u" ? R.delimiter : t.delimiter,
    encode: typeof t.encode == "boolean" ? t.encode : R.encode,
    encoder: typeof t.encoder == "function" ? t.encoder : R.encoder,
    encodeValuesOnly: typeof t.encodeValuesOnly == "boolean" ? t.encodeValuesOnly : R.encodeValuesOnly,
    filter: n,
    format: r,
    formatter: o,
    serializeDate: typeof t.serializeDate == "function" ? t.serializeDate : R.serializeDate,
    skipNulls: typeof t.skipNulls == "boolean" ? t.skipNulls : R.skipNulls,
    sort: typeof t.sort == "function" ? t.sort : null,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : R.strictNullHandling
  };
}, qo = function(t, e) {
  var r = t, o = Mo(e), n, i;
  typeof o.filter == "function" ? (i = o.filter, r = i("", r)) : W(o.filter) && (i = o.filter, n = i);
  var a = [];
  if (typeof r != "object" || r === null)
    return "";
  var s;
  e && e.arrayFormat in Se ? s = e.arrayFormat : e && "indices" in e ? s = e.indices ? "indices" : "repeat" : s = "indices";
  var u = Se[s];
  if (e && "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var f = u === "comma" && e && e.commaRoundTrip;
  n || (n = Object.keys(r)), o.sort && n.sort(o.sort);
  for (var b = Qe(), v = 0; v < n.length; ++v) {
    var m = n[v];
    o.skipNulls && r[m] === null || Ke(a, Lo(
      r[m],
      m,
      u,
      f,
      o.strictNullHandling,
      o.skipNulls,
      o.encode ? o.encoder : null,
      o.filter,
      o.sort,
      o.allowDots,
      o.serializeDate,
      o.format,
      o.formatter,
      o.encodeValuesOnly,
      o.charset,
      b
    ));
  }
  var S = a.join(o.delimiter), w = o.addQueryPrefix === !0 ? "?" : "";
  return o.charsetSentinel && (o.charset === "iso-8859-1" ? w += "utf8=%26%2310003%3B&" : w += "utf8=%E2%9C%93&"), S.length > 0 ? w + S : "";
}, lt = Ve, Vt = Object.prototype.hasOwnProperty, Bo = Array.isArray, P = {
  allowDots: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decoder: lt.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, zo = function(t) {
  return t.replace(/&#(\d+);/g, function(e, r) {
    return String.fromCharCode(parseInt(r, 10));
  });
}, Xe = function(t, e) {
  return t && typeof t == "string" && e.comma && t.indexOf(",") > -1 ? t.split(",") : t;
}, Ho = "utf8=%26%2310003%3B", $o = "utf8=%E2%9C%93", Wo = function(t, e) {
  var r = {}, o = e.ignoreQueryPrefix ? t.replace(/^\?/, "") : t, n = e.parameterLimit === 1 / 0 ? void 0 : e.parameterLimit, i = o.split(e.delimiter, n), a = -1, s, u = e.charset;
  if (e.charsetSentinel)
    for (s = 0; s < i.length; ++s)
      i[s].indexOf("utf8=") === 0 && (i[s] === $o ? u = "utf-8" : i[s] === Ho && (u = "iso-8859-1"), a = s, s = i.length);
  for (s = 0; s < i.length; ++s)
    if (s !== a) {
      var f = i[s], b = f.indexOf("]="), v = b === -1 ? f.indexOf("=") : b + 1, m, S;
      v === -1 ? (m = e.decoder(f, P.decoder, u, "key"), S = e.strictNullHandling ? null : "") : (m = e.decoder(f.slice(0, v), P.decoder, u, "key"), S = lt.maybeMap(
        Xe(f.slice(v + 1), e),
        function(w) {
          return e.decoder(w, P.decoder, u, "value");
        }
      )), S && e.interpretNumericEntities && u === "iso-8859-1" && (S = zo(S)), f.indexOf("[]=") > -1 && (S = Bo(S) ? [S] : S), Vt.call(r, m) ? r[m] = lt.combine(r[m], S) : r[m] = S;
    }
  return r;
}, Go = function(t, e, r, o) {
  for (var n = o ? e : Xe(e, r), i = t.length - 1; i >= 0; --i) {
    var a, s = t[i];
    if (s === "[]" && r.parseArrays)
      a = [].concat(n);
    else {
      a = r.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var u = s.charAt(0) === "[" && s.charAt(s.length - 1) === "]" ? s.slice(1, -1) : s, f = parseInt(u, 10);
      !r.parseArrays && u === "" ? a = { 0: n } : !isNaN(f) && s !== u && String(f) === u && f >= 0 && r.parseArrays && f <= r.arrayLimit ? (a = [], a[f] = n) : u !== "__proto__" && (a[u] = n);
    }
    n = a;
  }
  return n;
}, Jo = function(t, e, r, o) {
  if (t) {
    var n = r.allowDots ? t.replace(/\.([^.[]+)/g, "[$1]") : t, i = /(\[[^[\]]*])/, a = /(\[[^[\]]*])/g, s = r.depth > 0 && i.exec(n), u = s ? n.slice(0, s.index) : n, f = [];
    if (u) {
      if (!r.plainObjects && Vt.call(Object.prototype, u) && !r.allowPrototypes)
        return;
      f.push(u);
    }
    for (var b = 0; r.depth > 0 && (s = a.exec(n)) !== null && b < r.depth; ) {
      if (b += 1, !r.plainObjects && Vt.call(Object.prototype, s[1].slice(1, -1)) && !r.allowPrototypes)
        return;
      f.push(s[1]);
    }
    return s && f.push("[" + n.slice(s.index) + "]"), Go(f, e, r, o);
  }
}, Vo = function(t) {
  if (!t)
    return P;
  if (t.decoder !== null && t.decoder !== void 0 && typeof t.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var e = typeof t.charset > "u" ? P.charset : t.charset;
  return {
    allowDots: typeof t.allowDots > "u" ? P.allowDots : !!t.allowDots,
    allowPrototypes: typeof t.allowPrototypes == "boolean" ? t.allowPrototypes : P.allowPrototypes,
    allowSparse: typeof t.allowSparse == "boolean" ? t.allowSparse : P.allowSparse,
    arrayLimit: typeof t.arrayLimit == "number" ? t.arrayLimit : P.arrayLimit,
    charset: e,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : P.charsetSentinel,
    comma: typeof t.comma == "boolean" ? t.comma : P.comma,
    decoder: typeof t.decoder == "function" ? t.decoder : P.decoder,
    delimiter: typeof t.delimiter == "string" || lt.isRegExp(t.delimiter) ? t.delimiter : P.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof t.depth == "number" || t.depth === !1 ? +t.depth : P.depth,
    ignoreQueryPrefix: t.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof t.interpretNumericEntities == "boolean" ? t.interpretNumericEntities : P.interpretNumericEntities,
    parameterLimit: typeof t.parameterLimit == "number" ? t.parameterLimit : P.parameterLimit,
    parseArrays: t.parseArrays !== !1,
    plainObjects: typeof t.plainObjects == "boolean" ? t.plainObjects : P.plainObjects,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : P.strictNullHandling
  };
}, Qo = function(t, e) {
  var r = Vo(e);
  if (t === "" || t === null || typeof t > "u")
    return r.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var o = typeof t == "string" ? Wo(t, r) : t, n = r.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, i = Object.keys(o), a = 0; a < i.length; ++a) {
    var s = i[a], u = Jo(s, o[s], r, typeof t == "string");
    n = lt.merge(n, u, r);
  }
  return r.allowSparse === !0 ? n : lt.compact(n);
}, Ko = qo, Xo = Qo, Zo = re, Yo = {
  formats: Zo,
  parse: Xo,
  stringify: Ko
}, jt = {};
(function(t) {
  function e(n, i) {
    var a = typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
    if (!a) {
      if (Array.isArray(n) || (a = r(n)) || i && n && typeof n.length == "number") {
        a && (n = a);
        var s = 0, u = function() {
        };
        return { s: u, n: function() {
          return s >= n.length ? { done: !0 } : { done: !1, value: n[s++] };
        }, e: function(m) {
          throw m;
        }, f: u };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var f = !0, b = !1, v;
    return { s: function() {
      a = a.call(n);
    }, n: function() {
      var m = a.next();
      return f = m.done, m;
    }, e: function(m) {
      b = !0, v = m;
    }, f: function() {
      try {
        !f && a.return != null && a.return();
      } finally {
        if (b)
          throw v;
      }
    } };
  }
  function r(n, i) {
    if (n) {
      if (typeof n == "string")
        return o(n, i);
      var a = Object.prototype.toString.call(n).slice(8, -1);
      if (a === "Object" && n.constructor && (a = n.constructor.name), a === "Map" || a === "Set")
        return Array.from(n);
      if (a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))
        return o(n, i);
    }
  }
  function o(n, i) {
    (i == null || i > n.length) && (i = n.length);
    for (var a = 0, s = new Array(i); a < i; a++)
      s[a] = n[a];
    return s;
  }
  t.type = (n) => n.split(/ *; */).shift(), t.params = (n) => {
    const i = {};
    var a = e(n.split(/ *; */)), s;
    try {
      for (a.s(); !(s = a.n()).done; ) {
        const u = s.value.split(/ *= */), f = u.shift(), b = u.shift();
        f && b && (i[f] = b);
      }
    } catch (u) {
      a.e(u);
    } finally {
      a.f();
    }
    return i;
  }, t.parseLinks = (n) => {
    const i = {};
    var a = e(n.split(/ *, */)), s;
    try {
      for (a.s(); !(s = a.n()).done; ) {
        const u = s.value.split(/ *; */), f = u[0].slice(1, -1), b = u[1].split(/ *= */)[1].slice(1, -1);
        i[b] = f;
      }
    } catch (u) {
      a.e(u);
    } finally {
      a.f();
    }
    return i;
  }, t.cleanHeader = (n, i) => (delete n["content-type"], delete n["content-length"], delete n["transfer-encoding"], delete n.host, i && (delete n.authorization, delete n.cookie), n), t.isObject = (n) => n !== null && typeof n == "object", t.hasOwn = Object.hasOwn || function(n, i) {
    if (n == null)
      throw new TypeError("Cannot convert undefined or null to object");
    return Object.prototype.hasOwnProperty.call(new Object(n), i);
  }, t.mixin = (n, i) => {
    for (const a in i)
      t.hasOwn(i, a) && (n[a] = i[a]);
  };
})(jt);
const _e = qe, Ze = jt, Et = Ze.isObject, dt = Ze.hasOwn;
var tn = O;
function O() {
}
O.prototype.clearTimeout = function() {
  return clearTimeout(this._timer), clearTimeout(this._responseTimeoutTimer), clearTimeout(this._uploadTimeoutTimer), delete this._timer, delete this._responseTimeoutTimer, delete this._uploadTimeoutTimer, this;
};
O.prototype.parse = function(t) {
  return this._parser = t, this;
};
O.prototype.responseType = function(t) {
  return this._responseType = t, this;
};
O.prototype.serialize = function(t) {
  return this._serializer = t, this;
};
O.prototype.timeout = function(t) {
  if (!t || typeof t != "object")
    return this._timeout = t, this._responseTimeout = 0, this._uploadTimeout = 0, this;
  for (const e in t)
    if (dt(t, e))
      switch (e) {
        case "deadline":
          this._timeout = t.deadline;
          break;
        case "response":
          this._responseTimeout = t.response;
          break;
        case "upload":
          this._uploadTimeout = t.upload;
          break;
        default:
          console.warn("Unknown timeout option", e);
      }
  return this;
};
O.prototype.retry = function(t, e) {
  return (arguments.length === 0 || t === !0) && (t = 1), t <= 0 && (t = 0), this._maxRetries = t, this._retries = 0, this._retryCallback = e, this;
};
const en = /* @__PURE__ */ new Set(["ETIMEDOUT", "ECONNRESET", "EADDRINUSE", "ECONNREFUSED", "EPIPE", "ENOTFOUND", "ENETUNREACH", "EAI_AGAIN"]), rn = /* @__PURE__ */ new Set([408, 413, 429, 500, 502, 503, 504, 521, 522, 524]);
O.prototype._shouldRetry = function(t, e) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries)
    return !1;
  if (this._retryCallback)
    try {
      const r = this._retryCallback(t, e);
      if (r === !0)
        return !0;
      if (r === !1)
        return !1;
    } catch (r) {
      console.error(r);
    }
  return !!(e && e.status && rn.has(e.status) || t && (t.code && en.has(t.code) || t.timeout && t.code === "ECONNABORTED" || t.crossDomain));
};
O.prototype._retry = function() {
  return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this.timedoutError = null, this._end();
};
O.prototype.then = function(t, e) {
  if (!this._fullfilledPromise) {
    const r = this;
    this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise((o, n) => {
      r.on("abort", () => {
        if (this._maxRetries && this._maxRetries > this._retries)
          return;
        if (this.timedout && this.timedoutError) {
          n(this.timedoutError);
          return;
        }
        const i = new Error("Aborted");
        i.code = "ABORTED", i.status = this.status, i.method = this.method, i.url = this.url, n(i);
      }), r.end((i, a) => {
        i ? n(i) : o(a);
      });
    });
  }
  return this._fullfilledPromise.then(t, e);
};
O.prototype.catch = function(t) {
  return this.then(void 0, t);
};
O.prototype.use = function(t) {
  return t(this), this;
};
O.prototype.ok = function(t) {
  if (typeof t != "function")
    throw new Error("Callback required");
  return this._okCallback = t, this;
};
O.prototype._isResponseOK = function(t) {
  return t ? this._okCallback ? this._okCallback(t) : t.status >= 200 && t.status < 300 : !1;
};
O.prototype.get = function(t) {
  return this._header[t.toLowerCase()];
};
O.prototype.getHeader = O.prototype.get;
O.prototype.set = function(t, e) {
  if (Et(t)) {
    for (const r in t)
      dt(t, r) && this.set(r, t[r]);
    return this;
  }
  return this._header[t.toLowerCase()] = e, this.header[t] = e, this;
};
O.prototype.unset = function(t) {
  return delete this._header[t.toLowerCase()], delete this.header[t], this;
};
O.prototype.field = function(t, e, r) {
  if (t == null)
    throw new Error(".field(name, val) name can not be empty");
  if (this._data)
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  if (Et(t)) {
    for (const o in t)
      dt(t, o) && this.field(o, t[o]);
    return this;
  }
  if (Array.isArray(e)) {
    for (const o in e)
      dt(e, o) && this.field(t, e[o]);
    return this;
  }
  if (e == null)
    throw new Error(".field(name, val) val can not be empty");
  return typeof e == "boolean" && (e = String(e)), r ? this._getFormData().append(t, e, r) : this._getFormData().append(t, e), this;
};
O.prototype.abort = function() {
  if (this._aborted)
    return this;
  if (this._aborted = !0, this.xhr && this.xhr.abort(), this.req) {
    if (_e.gte(process.version, "v13.0.0") && _e.lt(process.version, "v14.0.0"))
      throw new Error("Superagent does not work in v13 properly with abort() due to Node.js core changes");
    this.req.abort();
  }
  return this.clearTimeout(), this.emit("abort"), this;
};
O.prototype._auth = function(t, e, r, o) {
  switch (r.type) {
    case "basic":
      this.set("Authorization", `Basic ${o(`${t}:${e}`)}`);
      break;
    case "auto":
      this.username = t, this.password = e;
      break;
    case "bearer":
      this.set("Authorization", `Bearer ${t}`);
      break;
  }
  return this;
};
O.prototype.withCredentials = function(t) {
  return t === void 0 && (t = !0), this._withCredentials = t, this;
};
O.prototype.redirects = function(t) {
  return this._maxRedirects = t, this;
};
O.prototype.maxResponseSize = function(t) {
  if (typeof t != "number")
    throw new TypeError("Invalid argument");
  return this._maxResponseSize = t, this;
};
O.prototype.toJSON = function() {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};
O.prototype.send = function(t) {
  const e = Et(t);
  let r = this._header["content-type"];
  if (this._formData)
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  if (e && !this._data)
    Array.isArray(t) ? this._data = [] : this._isHost(t) || (this._data = {});
  else if (t && this._data && this._isHost(this._data))
    throw new Error("Can't merge these send calls");
  if (e && Et(this._data))
    for (const o in t) {
      if (typeof t[o] == "bigint" && !t[o].toJSON)
        throw new Error("Cannot serialize BigInt value to json");
      dt(t, o) && (this._data[o] = t[o]);
    }
  else {
    if (typeof t == "bigint")
      throw new Error("Cannot send value of type BigInt");
    typeof t == "string" ? (r || this.type("form"), r = this._header["content-type"], r && (r = r.toLowerCase().trim()), r === "application/x-www-form-urlencoded" ? this._data = this._data ? `${this._data}&${t}` : t : this._data = (this._data || "") + t) : this._data = t;
  }
  return !e || this._isHost(t) ? this : (r || this.type("json"), this);
};
O.prototype.sortQuery = function(t) {
  return this._sort = typeof t > "u" ? !0 : t, this;
};
O.prototype._finalizeQueryString = function() {
  const t = this._query.join("&");
  if (t && (this.url += (this.url.includes("?") ? "&" : "?") + t), this._query.length = 0, this._sort) {
    const e = this.url.indexOf("?");
    if (e >= 0) {
      const r = this.url.slice(e + 1).split("&");
      typeof this._sort == "function" ? r.sort(this._sort) : r.sort(), this.url = this.url.slice(0, e) + "?" + r.join("&");
    }
  }
};
O.prototype._appendQueryString = () => {
  console.warn("Unsupported");
};
O.prototype._timeoutError = function(t, e, r) {
  if (this._aborted)
    return;
  const o = new Error(`${t + e}ms exceeded`);
  o.timeout = e, o.code = "ECONNABORTED", o.errno = r, this.timedout = !0, this.timedoutError = o, this.abort(), this.callback(o);
};
O.prototype._setTimeouts = function() {
  const t = this;
  this._timeout && !this._timer && (this._timer = setTimeout(() => {
    t._timeoutError("Timeout of ", t._timeout, "ETIME");
  }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(() => {
    t._timeoutError("Response timeout of ", t._responseTimeout, "ETIMEDOUT");
  }, this._responseTimeout));
};
const Dt = jt;
var on = Tt;
function Tt() {
}
Tt.prototype.get = function(t) {
  return this.header[t.toLowerCase()];
};
Tt.prototype._setHeaderProperties = function(t) {
  const e = t["content-type"] || "";
  this.type = Dt.type(e);
  const r = Dt.params(e);
  for (const o in r)
    Object.prototype.hasOwnProperty.call(r, o) && (this[o] = r[o]);
  this.links = {};
  try {
    t.link && (this.links = Dt.parseLinks(t.link));
  } catch {
  }
};
Tt.prototype._setStatusProperties = function(t) {
  const e = Math.trunc(t / 100);
  this.statusCode = t, this.status = this.statusCode, this.statusType = e, this.info = e === 1, this.ok = e === 2, this.redirect = e === 3, this.clientError = e === 4, this.serverError = e === 5, this.error = e === 4 || e === 5 ? this.toError() : !1, this.created = t === 201, this.accepted = t === 202, this.noContent = t === 204, this.badRequest = t === 400, this.unauthorized = t === 401, this.notAcceptable = t === 406, this.forbidden = t === 403, this.notFound = t === 404, this.unprocessableEntity = t === 422;
};
function nn(t, e) {
  var r = typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (!r) {
    if (Array.isArray(t) || (r = an(t)) || e && t && typeof t.length == "number") {
      r && (t = r);
      var o = 0, n = function() {
      };
      return { s: n, n: function() {
        return o >= t.length ? { done: !0 } : { done: !1, value: t[o++] };
      }, e: function(u) {
        throw u;
      }, f: n };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var i = !0, a = !1, s;
  return { s: function() {
    r = r.call(t);
  }, n: function() {
    var u = r.next();
    return i = u.done, u;
  }, e: function(u) {
    a = !0, s = u;
  }, f: function() {
    try {
      !i && r.return != null && r.return();
    } finally {
      if (a)
        throw s;
    }
  } };
}
function an(t, e) {
  if (t) {
    if (typeof t == "string")
      return Oe(t, e);
    var r = Object.prototype.toString.call(t).slice(8, -1);
    if (r === "Object" && t.constructor && (r = t.constructor.name), r === "Map" || r === "Set")
      return Array.from(t);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return Oe(t, e);
  }
}
function Oe(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var r = 0, o = new Array(e); r < e; r++)
    o[r] = t[r];
  return o;
}
function oe() {
  this._defaults = [];
}
for (var Lt = 0, Ee = ["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert", "disableTLSCerts"]; Lt < Ee.length; Lt++) {
  const t = Ee[Lt];
  oe.prototype[t] = function() {
    for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++)
      r[o] = arguments[o];
    return this._defaults.push({
      fn: t,
      args: r
    }), this;
  };
}
oe.prototype._setDefaults = function(t) {
  var e = nn(this._defaults), r;
  try {
    for (e.s(); !(r = e.n()).done; ) {
      const o = r.value;
      t[o.fn](...o.args);
    }
  } catch (o) {
    e.e(o);
  } finally {
    e.f();
  }
};
var sn = oe;
(function(t, e) {
  function r(l, c) {
    var p = typeof Symbol < "u" && l[Symbol.iterator] || l["@@iterator"];
    if (!p) {
      if (Array.isArray(l) || (p = o(l)) || c && l && typeof l.length == "number") {
        p && (l = p);
        var y = 0, d = function() {
        };
        return { s: d, n: function() {
          return y >= l.length ? { done: !0 } : { done: !1, value: l[y++] };
        }, e: function(G) {
          throw G;
        }, f: d };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var g = !0, N = !1, et;
    return { s: function() {
      p = p.call(l);
    }, n: function() {
      var G = p.next();
      return g = G.done, G;
    }, e: function(G) {
      N = !0, et = G;
    }, f: function() {
      try {
        !g && p.return != null && p.return();
      } finally {
        if (N)
          throw et;
      }
    } };
  }
  function o(l, c) {
    if (l) {
      if (typeof l == "string")
        return n(l, c);
      var p = Object.prototype.toString.call(l).slice(8, -1);
      if (p === "Object" && l.constructor && (p = l.constructor.name), p === "Map" || p === "Set")
        return Array.from(l);
      if (p === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(p))
        return n(l, c);
    }
  }
  function n(l, c) {
    (c == null || c > l.length) && (c = l.length);
    for (var p = 0, y = new Array(c); p < c; p++)
      y[p] = l[p];
    return y;
  }
  let i;
  typeof window < "u" ? i = window : typeof self > "u" ? (console.warn("Using browser-only version of superagent in non-browser environment"), i = void 0) : i = self;
  const a = rr, s = or, u = Yo, f = tn, b = jt, v = b.isObject, m = b.mixin, S = b.hasOwn, w = on, C = sn;
  function x() {
  }
  t.exports = function(l, c) {
    return typeof c == "function" ? new e.Request("GET", l).end(c) : arguments.length === 1 ? new e.Request("GET", l) : new e.Request(l, c);
  }, e = t.exports;
  const h = e;
  e.Request = _, h.getXHR = () => {
    if (i.XMLHttpRequest)
      return new i.XMLHttpRequest();
    throw new Error("Browser-only version of superagent could not find XHR");
  };
  const k = "".trim ? (l) => l.trim() : (l) => l.replace(/(^\s*|\s*$)/g, "");
  function F(l) {
    if (!v(l))
      return l;
    const c = [];
    for (const p in l)
      S(l, p) && E(c, p, l[p]);
    return c.join("&");
  }
  function E(l, c, p) {
    if (p !== void 0) {
      if (p === null) {
        l.push(encodeURI(c));
        return;
      }
      if (Array.isArray(p)) {
        var y = r(p), d;
        try {
          for (y.s(); !(d = y.n()).done; ) {
            const g = d.value;
            E(l, c, g);
          }
        } catch (g) {
          y.e(g);
        } finally {
          y.f();
        }
      } else if (v(p))
        for (const g in p)
          S(p, g) && E(l, `${c}[${g}]`, p[g]);
      else
        l.push(encodeURI(c) + "=" + encodeURIComponent(p));
    }
  }
  h.serializeObject = F;
  function U(l) {
    const c = {}, p = l.split("&");
    let y, d;
    for (let g = 0, N = p.length; g < N; ++g)
      y = p[g], d = y.indexOf("="), d === -1 ? c[decodeURIComponent(y)] = "" : c[decodeURIComponent(y.slice(0, d))] = decodeURIComponent(y.slice(d + 1));
    return c;
  }
  h.parseString = U, h.types = {
    html: "text/html",
    json: "application/json",
    xml: "text/xml",
    urlencoded: "application/x-www-form-urlencoded",
    form: "application/x-www-form-urlencoded",
    "form-data": "application/x-www-form-urlencoded"
  }, h.serialize = {
    "application/x-www-form-urlencoded": u.stringify,
    "application/json": s
  }, h.parse = {
    "application/x-www-form-urlencoded": U,
    "application/json": JSON.parse
  };
  function M(l) {
    const c = l.split(/\r?\n/), p = {};
    let y, d, g, N;
    for (let et = 0, G = c.length; et < G; ++et)
      d = c[et], y = d.indexOf(":"), y !== -1 && (g = d.slice(0, y).toLowerCase(), N = k(d.slice(y + 1)), p[g] = N);
    return p;
  }
  function j(l) {
    return /[/+]json($|[^-\w])/i.test(l);
  }
  function T(l) {
    this.req = l, this.xhr = this.req.xhr, this.text = this.req.method !== "HEAD" && (this.xhr.responseType === "" || this.xhr.responseType === "text") || typeof this.xhr.responseType > "u" ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;
    let c = this.xhr.status;
    c === 1223 && (c = 204), this._setStatusProperties(c), this.headers = M(this.xhr.getAllResponseHeaders()), this.header = this.headers, this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), this.text === null && l._responseType ? this.body = this.xhr.response : this.body = this.req.method === "HEAD" ? null : this._parseBody(this.text ? this.text : this.xhr.response);
  }
  m(T.prototype, w.prototype), T.prototype._parseBody = function(l) {
    let c = h.parse[this.type];
    return this.req._parser ? this.req._parser(this, l) : (!c && j(this.type) && (c = h.parse["application/json"]), c && l && (l.length > 0 || l instanceof Object) ? c(l) : null);
  }, T.prototype.toError = function() {
    const l = this.req, c = l.method, p = l.url, y = `cannot ${c} ${p} (${this.status})`, d = new Error(y);
    return d.status = this.status, d.method = c, d.url = p, d;
  }, h.Response = T;
  function _(l, c) {
    const p = this;
    this._query = this._query || [], this.method = l, this.url = c, this.header = {}, this._header = {}, this.on("end", () => {
      let y = null, d = null;
      try {
        d = new T(p);
      } catch (N) {
        return y = new Error("Parser is unable to parse the response"), y.parse = !0, y.original = N, p.xhr ? (y.rawResponse = typeof p.xhr.responseType > "u" ? p.xhr.responseText : p.xhr.response, y.status = p.xhr.status ? p.xhr.status : null, y.statusCode = y.status) : (y.rawResponse = null, y.status = null), p.callback(y);
      }
      p.emit("response", d);
      let g;
      try {
        p._isResponseOK(d) || (g = new Error(d.statusText || d.text || "Unsuccessful HTTP response"));
      } catch (N) {
        g = N;
      }
      g ? (g.original = y, g.response = d, g.status = g.status || d.status, p.callback(g, d)) : p.callback(null, d);
    });
  }
  a(_.prototype), m(_.prototype, f.prototype), _.prototype.type = function(l) {
    return this.set("Content-Type", h.types[l] || l), this;
  }, _.prototype.accept = function(l) {
    return this.set("Accept", h.types[l] || l), this;
  }, _.prototype.auth = function(l, c, p) {
    arguments.length === 1 && (c = ""), typeof c == "object" && c !== null && (p = c, c = ""), p || (p = {
      type: typeof btoa == "function" ? "basic" : "auto"
    });
    const y = p.encoder ? p.encoder : (d) => {
      if (typeof btoa == "function")
        return btoa(d);
      throw new Error("Cannot use basic auth, btoa is not a function");
    };
    return this._auth(l, c, p, y);
  }, _.prototype.query = function(l) {
    return typeof l != "string" && (l = F(l)), l && this._query.push(l), this;
  }, _.prototype.attach = function(l, c, p) {
    if (c) {
      if (this._data)
        throw new Error("superagent can't mix .send() and .attach()");
      this._getFormData().append(l, c, p || c.name);
    }
    return this;
  }, _.prototype._getFormData = function() {
    return this._formData || (this._formData = new i.FormData()), this._formData;
  }, _.prototype.callback = function(l, c) {
    if (this._shouldRetry(l, c))
      return this._retry();
    const p = this._callback;
    this.clearTimeout(), l && (this._maxRetries && (l.retries = this._retries - 1), this.emit("error", l)), p(l, c);
  }, _.prototype.crossDomainError = function() {
    const l = new Error(`Request has been terminated
Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.`);
    l.crossDomain = !0, l.status = this.status, l.method = this.method, l.url = this.url, this.callback(l);
  }, _.prototype.agent = function() {
    return console.warn("This is not supported in browser version of superagent"), this;
  }, _.prototype.ca = _.prototype.agent, _.prototype.buffer = _.prototype.ca, _.prototype.write = () => {
    throw new Error("Streaming is not supported in browser version of superagent");
  }, _.prototype.pipe = _.prototype.write, _.prototype._isHost = function(l) {
    return l && typeof l == "object" && !Array.isArray(l) && Object.prototype.toString.call(l) !== "[object Object]";
  }, _.prototype.end = function(l) {
    this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = l || x, this._finalizeQueryString(), this._end();
  }, _.prototype._setUploadTimeout = function() {
    const l = this;
    this._uploadTimeout && !this._uploadTimeoutTimer && (this._uploadTimeoutTimer = setTimeout(() => {
      l._timeoutError("Upload timeout of ", l._uploadTimeout, "ETIMEDOUT");
    }, this._uploadTimeout));
  }, _.prototype._end = function() {
    if (this._aborted)
      return this.callback(new Error("The request has been aborted even before .end() was called"));
    const l = this;
    this.xhr = h.getXHR();
    const c = this.xhr;
    let p = this._formData || this._data;
    this._setTimeouts(), c.addEventListener("readystatechange", () => {
      const d = c.readyState;
      if (d >= 2 && l._responseTimeoutTimer && clearTimeout(l._responseTimeoutTimer), d !== 4)
        return;
      let g;
      try {
        g = c.status;
      } catch {
        g = 0;
      }
      if (!g)
        return l.timedout || l._aborted ? void 0 : l.crossDomainError();
      l.emit("end");
    });
    const y = (d, g) => {
      g.total > 0 && (g.percent = g.loaded / g.total * 100, g.percent === 100 && clearTimeout(l._uploadTimeoutTimer)), g.direction = d, l.emit("progress", g);
    };
    if (this.hasListeners("progress"))
      try {
        c.addEventListener("progress", y.bind(null, "download")), c.upload && c.upload.addEventListener("progress", y.bind(null, "upload"));
      } catch {
      }
    c.upload && this._setUploadTimeout();
    try {
      this.username && this.password ? c.open(this.method, this.url, !0, this.username, this.password) : c.open(this.method, this.url, !0);
    } catch (d) {
      return this.callback(d);
    }
    if (this._withCredentials && (c.withCredentials = !0), !this._formData && this.method !== "GET" && this.method !== "HEAD" && typeof p != "string" && !this._isHost(p)) {
      const d = this._header["content-type"];
      let g = this._serializer || h.serialize[d ? d.split(";")[0] : ""];
      !g && j(d) && (g = h.serialize["application/json"]), g && (p = g(p));
    }
    for (const d in this.header)
      this.header[d] !== null && S(this.header, d) && c.setRequestHeader(d, this.header[d]);
    this._responseType && (c.responseType = this._responseType), this.emit("request", this), c.send(typeof p > "u" ? null : p);
  }, h.agent = () => new C();
  for (var D = 0, q = ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"]; D < q.length; D++) {
    const l = q[D];
    C.prototype[l.toLowerCase()] = function(c, p) {
      const y = new h.Request(l, c);
      return this._setDefaults(y), p && y.end(p), y;
    };
  }
  C.prototype.del = C.prototype.delete, h.get = (l, c, p) => {
    const y = h("GET", l);
    return typeof c == "function" && (p = c, c = null), c && y.query(c), p && y.end(p), y;
  }, h.head = (l, c, p) => {
    const y = h("HEAD", l);
    return typeof c == "function" && (p = c, c = null), c && y.query(c), p && y.end(p), y;
  }, h.options = (l, c, p) => {
    const y = h("OPTIONS", l);
    return typeof c == "function" && (p = c, c = null), c && y.send(c), p && y.end(p), y;
  };
  function $(l, c, p) {
    const y = h("DELETE", l);
    return typeof c == "function" && (p = c, c = null), c && y.send(c), p && y.end(p), y;
  }
  h.del = $, h.delete = $, h.patch = (l, c, p) => {
    const y = h("PATCH", l);
    return typeof c == "function" && (p = c, c = null), c && y.send(c), p && y.end(p), y;
  }, h.post = (l, c, p) => {
    const y = h("POST", l);
    return typeof c == "function" && (p = c, c = null), c && y.send(c), p && y.end(p), y;
  }, h.put = (l, c, p) => {
    const y = h("PUT", l);
    return typeof c == "function" && (p = c, c = null), c && y.send(c), p && y.end(p), y;
  };
})(Mt, Mt.exports);
var ln = Mt.exports;
const je = /* @__PURE__ */ tr(ln);
class L {
  /**
   * The base URL against which to resolve every API call's (relative) path.
   * Overrides the default value set in spec file if present
   * @param {String} basePath
   */
  constructor(e = "https://api.flyo.cloud/nitro/v1") {
    this.basePath = e.replace(/\/+$/, ""), this.authentications = {
      ApiToken: { type: "apiKey", in: "query", name: "token" }
    }, this.defaultHeaders = {
      "User-Agent": "OpenAPI-Generator/1.0.0-beta.164/Javascript"
    }, this.timeout = 6e4, this.cache = !0, this.enableCookies = !1, typeof window > "u" && (this.agent = new je.agent()), this.requestAgent = null, this.plugins = null;
  }
  /**
  * Returns a string representation for an actual parameter.
  * @param param The actual parameter.
  * @returns {String} The string representation of <code>param</code>.
  */
  paramToString(e) {
    return e == null || e == null ? "" : e instanceof Date ? e.toJSON() : L.canBeJsonified(e) ? JSON.stringify(e) : e.toString();
  }
  /**
  * Returns a boolean indicating if the parameter could be JSON.stringified
  * @param param The actual parameter
  * @returns {Boolean} Flag indicating if <code>param</code> can be JSON.stringified
  */
  static canBeJsonified(e) {
    if (typeof e != "string" && typeof e != "object")
      return !1;
    try {
      const r = e.toString();
      return r === "[object Object]" || r === "[object Array]";
    } catch {
      return !1;
    }
  }
  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * NOTE: query parameters are not handled here.
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
   * @returns {String} The encoded path with parameter values substituted.
   */
  buildUrl(e, r, o) {
    e.match(/^\//) || (e = "/" + e);
    var n = this.basePath + e;
    return o != null && (n = o + e), n = n.replace(/\{([\w-\.]+)\}/g, (i, a) => {
      var s;
      return r.hasOwnProperty(a) ? s = this.paramToString(r[a]) : s = i, encodeURIComponent(s);
    }), n;
  }
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
  isJsonMime(e) {
    return !!(e != null && e.match(/^application\/json(;.*)?$/i));
  }
  /**
  * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
  * @param {Array.<String>} contentTypes
  * @returns {String} The chosen content type, preferring JSON.
  */
  jsonPreferredMime(e) {
    for (var r = 0; r < e.length; r++)
      if (this.isJsonMime(e[r]))
        return e[r];
    return e[0];
  }
  /**
  * Checks whether the given parameter value represents file-like content.
  * @param param The parameter to check.
  * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
  */
  isFileParam(e) {
    if (typeof require == "function") {
      let r;
      try {
        r = require("fs");
      } catch {
      }
      if (r && r.ReadStream && e instanceof r.ReadStream)
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
  normalizeParams(e) {
    var r = {};
    for (var o in e)
      if (e.hasOwnProperty(o) && e[o] != null && e[o] != null) {
        var n = e[o];
        this.isFileParam(n) || Array.isArray(n) ? r[o] = n : r[o] = this.paramToString(n);
      }
    return r;
  }
  /**
  * Builds a string representation of an array-type actual parameter, according to the given collection format.
  * @param {Array} param An array parameter.
  * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
  * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
  * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
  */
  buildCollectionParam(e, r) {
    if (e == null)
      return null;
    switch (r) {
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
        throw new Error("Unknown collection format: " + r);
    }
  }
  /**
  * Applies authentication headers to the request.
  * @param {Object} request The request object created by a <code>superagent()</code> call.
  * @param {Array.<String>} authNames An array of authentication method names.
  */
  applyAuthToRequest(e, r) {
    r.forEach((o) => {
      var n = this.authentications[o];
      switch (n.type) {
        case "basic":
          (n.username || n.password) && e.auth(n.username || "", n.password || "");
          break;
        case "bearer":
          if (n.accessToken) {
            var i = typeof n.accessToken == "function" ? n.accessToken() : n.accessToken;
            e.set({ Authorization: "Bearer " + i });
          }
          break;
        case "apiKey":
          if (n.apiKey) {
            var a = {};
            n.apiKeyPrefix ? a[n.name] = n.apiKeyPrefix + " " + n.apiKey : a[n.name] = n.apiKey, n.in === "header" ? e.set(a) : e.query(a);
          }
          break;
        case "oauth2":
          n.accessToken && e.set({ Authorization: "Bearer " + n.accessToken });
          break;
        default:
          throw new Error("Unknown authentication type: " + n.type);
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
  deserialize(e, r) {
    if (e == null || r == null || e.status == 204)
      return null;
    var o = e.body;
    return (o == null || typeof o == "object" && typeof o.length > "u" && !Object.keys(o).length) && (o = e.text), L.convertToType(o, r);
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
  callApi(e, r, o, n, i, a, s, u, f, b, v, m) {
    var S = this.buildUrl(e, o, m), w = je(r, S);
    if (this.plugins !== null)
      for (var C in this.plugins)
        this.plugins.hasOwnProperty(C) && w.use(this.plugins[C]);
    this.applyAuthToRequest(w, u), r.toUpperCase() === "GET" && this.cache === !1 && (n._ = (/* @__PURE__ */ new Date()).getTime()), w.query(this.normalizeParams(n)), w.set(this.defaultHeaders).set(this.normalizeParams(i)), this.requestAgent && w.agent(this.requestAgent), w.timeout(this.timeout);
    var x = this.jsonPreferredMime(f);
    if (x && x != "multipart/form-data" && w.type(x), x === "application/x-www-form-urlencoded")
      w.send(Me.stringify(this.normalizeParams(a)));
    else if (x == "multipart/form-data") {
      var h = this.normalizeParams(a);
      for (var k in h)
        if (h.hasOwnProperty(k)) {
          let E = h[k];
          this.isFileParam(E) ? w.attach(k, E) : Array.isArray(E) && E.length && this.isFileParam(E[0]) ? E.forEach((U) => w.attach(k, U)) : w.field(k, E);
        }
    } else
      s != null && (w.header["Content-Type"] || w.type("application/json"), w.send(s));
    var F = this.jsonPreferredMime(b);
    return F && w.accept(F), v === "Blob" ? w.responseType("blob") : v === "String" && w.responseType("text"), this.enableCookies && (typeof window > "u" ? this.agent._attachCookies(w) : w.withCredentials()), new Promise((E, U) => {
      w.end((M, j) => {
        if (M) {
          var T = {};
          j && (T.status = j.status, T.statusText = j.statusText, T.body = j.body, T.response = j), T.error = M, U(T);
        } else
          try {
            var _ = this.deserialize(j, v);
            this.enableCookies && typeof window > "u" && this.agent._saveCookies(j), E({ data: _, response: j });
          } catch (D) {
            U(D);
          }
      });
    });
  }
  /**
  * Parses an ISO-8601 string representation or epoch representation of a date value.
  * @param {String} str The date value as a string.
  * @returns {Date} The parsed date object.
  */
  static parseDate(e) {
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
  static convertToType(e, r) {
    if (e == null)
      return e;
    switch (r) {
      case "Boolean":
        return !!e;
      case "Integer":
        return parseInt(e, 10);
      case "Number":
        return parseFloat(e);
      case "String":
        return String(e);
      case "Date":
        return L.parseDate(String(e));
      case "Blob":
        return e;
      default:
        if (r === Object)
          return e;
        if (typeof r.constructFromObject == "function")
          return r.constructFromObject(e);
        if (Array.isArray(r)) {
          var o = r[0];
          return e.map((b) => L.convertToType(b, o));
        } else if (typeof r == "object") {
          var n, i;
          for (var a in r)
            if (r.hasOwnProperty(a)) {
              n = a, i = r[a];
              break;
            }
          var s = {};
          for (var a in e)
            if (e.hasOwnProperty(a)) {
              var u = L.convertToType(a, n), f = L.convertToType(e[a], i);
              s[u] = f;
            }
          return s;
        } else
          return e;
    }
  }
  /**
    * Gets an array of host settings
    * @returns An array of host settings
    */
  hostSettings() {
    return [
      {
        url: "https://api.flyo.cloud/nitro/{version}",
        description: "Production Server",
        variables: {
          version: {
            description: "The api version currently supported is `v1`",
            default_value: "v1"
          }
        }
      }
    ];
  }
  getBasePathFromSettings(e, r = {}) {
    var o = this.hostSettings();
    if (e < 0 || e >= o.length)
      throw new Error("Invalid index " + e + " when selecting the host settings. Must be less than " + o.length);
    var n = o[e], i = n.url;
    for (var a in n.variables)
      if (a in r) {
        let s = n.variables[a];
        if (!("enum_values" in s) || s.enum_values.includes(r[a]))
          i = i.replace("{" + a + "}", r[a]);
        else
          throw new Error("The variable `" + a + "` in the host URL has invalid value " + r[a] + ". Must be " + n.variables[a].enum_values + ".");
      } else
        i = i.replace("{" + a + "}", n.variables[a].default_value);
    return i;
  }
  /**
  * Constructs a new map or array model from REST data.
  * @param data {Object|Array} The REST data.
  * @param obj {Object|Array} The target object or array.
  */
  static constructFromObject(e, r, o) {
    if (Array.isArray(e))
      for (var n = 0; n < e.length; n++)
        e.hasOwnProperty(n) && (r[n] = L.convertToType(e[n], o));
    else
      for (var i in e)
        e.hasOwnProperty(i) && (r[i] = L.convertToType(e[i], o));
  }
}
L.CollectionFormatEnum = {
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
};
L.instance = new L();
const un = /[\p{Lu}]/u, cn = /[\p{Ll}]/u, Te = /^[\p{Lu}](?![\p{Lu}])/gu, Ye = /([\p{Alpha}\p{N}_]|$)/u, ne = /[_.\- ]+/, pn = new RegExp("^" + ne.source), Pe = new RegExp(ne.source + Ye.source, "gu"), xe = new RegExp("\\d+" + Ye.source, "gu"), fn = (t, e, r, o) => {
  let n = !1, i = !1, a = !1, s = !1;
  for (let u = 0; u < t.length; u++) {
    const f = t[u];
    s = u > 2 ? t[u - 3] === "-" : !0, n && un.test(f) ? (t = t.slice(0, u) + "-" + t.slice(u), n = !1, a = i, i = !0, u++) : i && a && cn.test(f) && (!s || o) ? (t = t.slice(0, u - 1) + "-" + t.slice(u - 1), a = i, i = !1, n = !0) : (n = e(f) === f && r(f) !== f, a = i, i = r(f) === f && e(f) !== f);
  }
  return t;
}, yn = (t, e) => (Te.lastIndex = 0, t.replace(Te, (r) => e(r))), hn = (t, e) => (Pe.lastIndex = 0, xe.lastIndex = 0, t.replace(Pe, (r, o) => e(o)).replace(xe, (r) => e(r)));
function dn(t, e) {
  if (!(typeof t == "string" || Array.isArray(t)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (e = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...e
  }, Array.isArray(t) ? t = t.map((i) => i.trim()).filter((i) => i.length).join("-") : t = t.trim(), t.length === 0)
    return "";
  const r = e.locale === !1 ? (i) => i.toLowerCase() : (i) => i.toLocaleLowerCase(e.locale), o = e.locale === !1 ? (i) => i.toUpperCase() : (i) => i.toLocaleUpperCase(e.locale);
  return t.length === 1 ? ne.test(t) ? "" : e.pascalCase ? o(t) : r(t) : (t !== r(t) && (t = fn(t, r, o, e.preserveConsecutiveUppercase)), t = t.replace(pn, ""), t = e.preserveConsecutiveUppercase ? yn(t, r) : r(t), e.pascalCase && (t = o(t.charAt(0)) + t.slice(1)), hn(t, o));
}
function mn(t, e, r) {
  const o = "virtual:flyo-components", n = "\0" + o;
  return {
    name: "vite-plugin-flyo-components",
    async resolveId(i) {
      if (i === o)
        return n;
    },
    async load(i) {
      if (i === n) {
        const a = [];
        for (const [u, f] of Object.entries(e)) {
          const b = await this.resolve(
            "/" + t + "/" + f + ".astro"
          );
          b && a.push(`export { default as ${dn(u)} } from "${b.id}"`);
        }
        let s = null;
        return r && (s = await this.resolve(
          "/" + t + "/" + r + ".astro"
        )), s ? a.push(`export { default as fallback } from "${s.id}"`) : a.push('export { default as fallback } from "@flyo/nitro-astro/src/components/FallbackComponent.astro"'), a.join(";");
      }
    }
  };
}
function bn() {
  return globalThis.flyoNitroInstance || console.error("flyoNitroInstance has not been initialized correctly"), globalThis.flyoNitroInstance;
}
function gn(t) {
  const e = {
    accessToken: !1,
    liveEdit: !1,
    fallbackComponent: null,
    ...t
  };
  return {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript: r, updateConfig: o }) => {
        o({
          vite: {
            plugins: [
              mn(
                t.componentsDir,
                t.components,
                t.fallbackComponent
              )
            ]
          }
        }), r(
          "page-ssr",
          `
            import { ApiClient } from '@flyo/nitro-js'
            var defaultClient = ApiClient.instance;
            defaultClient.defaultHeaders = {}

            let ApiToken = defaultClient.authentications['ApiToken'];
            ApiToken.apiKey = '${e.accessToken}';

            globalThis.flyoNitroInstance = defaultClient;
          `
        ), e.liveEdit && r(
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
  gn as default,
  bn as useFlyoNitro
};
