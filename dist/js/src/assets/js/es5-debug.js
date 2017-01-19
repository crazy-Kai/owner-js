! function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("src/assets/js/es5-debug", [], e) : "object" == typeof exports ? module.exports = e() : t.returnExports = e()
}(this, function() {
    var v, t = Array.prototype,
        e = Object.prototype,
        r = Function.prototype,
        n = String.prototype,
        i = Number.prototype,
        a = t.slice,
        o = t.splice,
        u = t.push,
        l = t.unshift,
        f = t.concat,
        s = r.call,
        c = e.toString,
        p = Array.isArray || function(t) {
            return "[object Array]" === c.call(t)
        },
        h = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag,
        g = Function.prototype.toString,
        y = function(t) {
            try {
                return g.call(t), !0
            } catch (e) {
                return !1
            }
        },
        d = "[object Function]",
        m = "[object GeneratorFunction]";
    v = function(t) {
        if ("function" != typeof t) return !1;
        if (h) return y(t);
        var e = c.call(t);
        return e === d || e === m
    };
    var b, w = RegExp.prototype.exec,
        T = function(t) {
            try {
                return w.call(t), !0
            } catch (e) {
                return !1
            }
        },
        x = "[object RegExp]";
    b = function(t) {
        return "object" == typeof t && (h ? T(t) : c.call(t) === x)
    };
    var O, j = String.prototype.valueOf,
        S = function(t) {
            try {
                return j.call(t), !0
            } catch (e) {
                return !1
            }
        },
        N = "[object String]";
    O = function(t) {
        return "string" == typeof t || "object" == typeof t && (h ? S(t) : c.call(t) === N)
    };
    var E = function(t) {
            var e = c.call(t),
                r = "[object Arguments]" === e;
            return r || (r = !p(t) && null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && v(t.callee)), r
        },
        I = function(t) {
            var r, e = Object.defineProperty && function() {
                try {
                    var t = {};
                    Object.defineProperty(t, "x", {
                        enumerable: !1,
                        value: t
                    });
                    for (var e in t) return !1;
                    return t.x === t
                } catch (r) {
                    return !1
                }
            }();
            return r = e ? function(t, e, r, n) {
                    !n && e in t || Object.defineProperty(t, e, {
                        configurable: !0,
                        enumerable: !1,
                        writable: !0,
                        value: r
                    })
                } : function(t, e, r, n) {
                    !n && e in t || (t[e] = r)
                },
                function(e, i, a) {
                    for (var o in i) t.call(i, o) && r(e, o, i[o], a)
                }
        }(e.hasOwnProperty),
        D = function(t) {
            var e = typeof t;
            return null === t || "object" !== e && "function" !== e
        },
        M = {
            ToInteger: function(t) {
                var e = +t;
                return e !== e ? e = 0 : 0 !== e && e !== 1 / 0 && e !== -(1 / 0) && (e = (e > 0 || -1) * Math.floor(Math.abs(e))), e
            },
            ToPrimitive: function(t) {
                var e, r, n;
                if (D(t)) return t;
                if (r = t.valueOf, v(r) && (e = r.call(t), D(e))) return e;
                if (n = t.toString, v(n) && (e = n.call(t), D(e))) return e;
                throw new TypeError
            },
            ToObject: function(t) {
                if (null == t) throw new TypeError("can't convert " + t + " to object");
                return Object(t)
            },
            ToUint32: function(t) {
                return t >>> 0
            }
        },
        k = function() {};
    I(r, {
        bind: function(t) {
            var e = this;
            if (!v(e)) throw new TypeError("Function.prototype.bind called on incompatible " + e);
            for (var n, r = a.call(arguments, 1), i = function() {
                    if (this instanceof n) {
                        var i = e.apply(this, f.call(r, a.call(arguments)));
                        return Object(i) === i ? i : this
                    }
                    return e.apply(t, f.call(r, a.call(arguments)))
                }, o = Math.max(0, e.length - r.length), u = [], l = 0; l < o; l++) u.push("$" + l);
            return n = Function("binder", "return function (" + u.join(",") + "){ return binder.apply(this, arguments); }")(i), e.prototype && (k.prototype = e.prototype, n.prototype = new k, k.prototype = null), n
        }
    });
    var A = s.bind(e.hasOwnProperty),
        F = function() {
            var t = [1, 2],
                e = t.splice();
            return 2 === t.length && p(e) && 0 === e.length
        }();
    I(t, {
        splice: function(t, e) {
            return 0 === arguments.length ? [] : o.apply(this, arguments)
        }
    }, !F);
    var R = function() {
        var e = {};
        return t.splice.call(e, 0, 0, 1), 1 === e.length
    }();
    I(t, {
        splice: function(t, e) {
            if (0 === arguments.length) return [];
            var r = arguments;
            return this.length = Math.max(M.ToInteger(this.length), 0), arguments.length > 0 && "number" != typeof e && (r = a.call(arguments), r.length < 2 ? r.push(this.length - t) : r[1] = M.ToInteger(e)), o.apply(this, r)
        }
    }, !R);
    var U = 1 !== [].unshift(0);
    I(t, {
        unshift: function() {
            return l.apply(this, arguments), this.length
        }
    }, U), I(Array, {
        isArray: p
    });
    var C = Object("a"),
        P = "a" !== C[0] || !(0 in C),
        Z = function(t) {
            var e = !0,
                r = !0;
            return t && (t.call("foo", function(t, r, n) {
                "object" != typeof n && (e = !1)
            }), t.call([1], function() {
                "use strict";
                r = "string" == typeof this
            }, "x")), !!t && e && r
        };
    I(t, {
        forEach: function(t) {
            var a, e = M.ToObject(this),
                r = P && O(this) ? this.split("") : e,
                n = -1,
                i = r.length >>> 0;
            if (arguments.length > 1 && (a = arguments[1]), !v(t)) throw new TypeError("Array.prototype.forEach callback must be a function");
            for (; ++n < i;) n in r && ("undefined" != typeof a ? t.call(a, r[n], n, e) : t(r[n], n, e))
        }
    }, !Z(t.forEach)), I(t, {
        map: function(t) {
            var a, e = M.ToObject(this),
                r = P && O(this) ? this.split("") : e,
                n = r.length >>> 0,
                i = Array(n);
            if (arguments.length > 1 && (a = arguments[1]), !v(t)) throw new TypeError("Array.prototype.map callback must be a function");
            for (var o = 0; o < n; o++) o in r && ("undefined" != typeof a ? i[o] = t.call(a, r[o], o, e) : i[o] = t(r[o], o, e));
            return i
        }
    }, !Z(t.map)), I(t, {
        filter: function(t) {
            var a, o, e = M.ToObject(this),
                r = P && O(this) ? this.split("") : e,
                n = r.length >>> 0,
                i = [];
            if (arguments.length > 1 && (o = arguments[1]), !v(t)) throw new TypeError("Array.prototype.filter callback must be a function");
            for (var u = 0; u < n; u++) u in r && (a = r[u], ("undefined" == typeof o ? t(a, u, e) : t.call(o, a, u, e)) && i.push(a));
            return i
        }
    }, !Z(t.filter)), I(t, {
        every: function(t) {
            var i, e = M.ToObject(this),
                r = P && O(this) ? this.split("") : e,
                n = r.length >>> 0;
            if (arguments.length > 1 && (i = arguments[1]), !v(t)) throw new TypeError("Array.prototype.every callback must be a function");
            for (var a = 0; a < n; a++)
                if (a in r && !("undefined" == typeof i ? t(r[a], a, e) : t.call(i, r[a], a, e))) return !1;
            return !0
        }
    }, !Z(t.every)), I(t, {
        some: function(t) {
            var i, e = M.ToObject(this),
                r = P && O(this) ? this.split("") : e,
                n = r.length >>> 0;
            if (arguments.length > 1 && (i = arguments[1]), !v(t)) throw new TypeError("Array.prototype.some callback must be a function");
            for (var a = 0; a < n; a++)
                if (a in r && ("undefined" == typeof i ? t(r[a], a, e) : t.call(i, r[a], a, e))) return !0;
            return !1
        }
    }, !Z(t.some));
    var J = !1;
    t.reduce && (J = "object" == typeof t.reduce.call("es5", function(t, e, r, n) {
        return n
    })), I(t, {
        reduce: function(t) {
            var e = M.ToObject(this),
                r = P && O(this) ? this.split("") : e,
                n = r.length >>> 0;
            if (!v(t)) throw new TypeError("Array.prototype.reduce callback must be a function");
            if (0 === n && 1 === arguments.length) throw new TypeError("reduce of empty array with no initial value");
            var a, i = 0;
            if (arguments.length >= 2) a = arguments[1];
            else
                for (;;) {
                    if (i in r) {
                        a = r[i++];
                        break
                    }
                    if (++i >= n) throw new TypeError("reduce of empty array with no initial value")
                }
            for (; i < n; i++) i in r && (a = t(a, r[i], i, e));
            return a
        }
    }, !J);
    var z = !1;
    t.reduceRight && (z = "object" == typeof t.reduceRight.call("es5", function(t, e, r, n) {
        return n
    })), I(t, {
        reduceRight: function(t) {
            var e = M.ToObject(this),
                r = P && O(this) ? this.split("") : e,
                n = r.length >>> 0;
            if (!v(t)) throw new TypeError("Array.prototype.reduceRight callback must be a function");
            if (0 === n && 1 === arguments.length) throw new TypeError("reduceRight of empty array with no initial value");
            var i, a = n - 1;
            if (arguments.length >= 2) i = arguments[1];
            else
                for (;;) {
                    if (a in r) {
                        i = r[a--];
                        break
                    }
                    if (--a < 0) throw new TypeError("reduceRight of empty array with no initial value")
                }
            if (a < 0) return i;
            do a in r && (i = t(i, r[a], a, e)); while (a--);
            return i
        }
    }, !z);
    var $ = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    I(t, {
        indexOf: function(t) {
            var e = P && O(this) ? this.split("") : M.ToObject(this),
                r = e.length >>> 0;
            if (0 === r) return -1;
            var n = 0;
            for (arguments.length > 1 && (n = M.ToInteger(arguments[1])), n = n >= 0 ? n : Math.max(0, r + n); n < r; n++)
                if (n in e && e[n] === t) return n;
            return -1
        }
    }, $);
    var B = Array.prototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    I(t, {
        lastIndexOf: function(t) {
            var e = P && O(this) ? this.split("") : M.ToObject(this),
                r = e.length >>> 0;
            if (0 === r) return -1;
            var n = r - 1;
            for (arguments.length > 1 && (n = Math.min(n, M.ToInteger(arguments[1]))), n = n >= 0 ? n : r - Math.abs(n); n >= 0; n--)
                if (n in e && t === e[n]) return n;
            return -1
        }
    }, B);
    var G = !{
            toString: null
        }.propertyIsEnumerable("toString"),
        H = function() {}.propertyIsEnumerable("prototype"),
        L = !A("x", "0"),
        X = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
        Y = X.length;
    I(Object, {
        keys: function(t) {
            var e = v(t),
                r = E(t),
                n = null !== t && "object" == typeof t,
                i = n && O(t);
            if (!n && !e && !r) throw new TypeError("Object.keys called on a non-object");
            var a = [],
                o = H && e;
            if (i && L || r)
                for (var u = 0; u < t.length; ++u) a.push(String(u));
            if (!r)
                for (var l in t) o && "prototype" === l || !A(t, l) || a.push(String(l));
            if (G)
                for (var f = t.constructor, s = f && f.prototype === t, c = 0; c < Y; c++) {
                    var p = X[c];
                    s && "constructor" === p || !A(t, p) || a.push(p)
                }
            return a
        }
    });
    var q = Object.keys && function() {
            return 2 === Object.keys(arguments).length
        }(1, 2),
        K = Object.keys;
    I(Object, {
        keys: function(e) {
            return K(E(e) ? t.slice.call(e) : e)
        }
    }, !q);
    var Q = -621987552e5,
        V = "-000001",
        W = Date.prototype.toISOString && new Date(Q).toISOString().indexOf(V) === -1;
    I(Date.prototype, {
        toISOString: function() {
            var t, e, r, n, i;
            if (!isFinite(this)) throw new RangeError("Date.prototype.toISOString called on non-finite value.");
            for (n = this.getUTCFullYear(), i = this.getUTCMonth(), n += Math.floor(i / 12), i = (i % 12 + 12) % 12, t = [i + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()], n = (n < 0 ? "-" : n > 9999 ? "+" : "") + ("00000" + Math.abs(n)).slice(0 <= n && n <= 9999 ? -4 : -6), e = t.length; e--;) r = t[e], r < 10 && (t[e] = "0" + r);
            return n + "-" + t.slice(0, 2).join("-") + "T" + t.slice(2).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
        }
    }, W);
    var _ = function() {
        try {
            return Date.prototype.toJSON && null === new Date(NaN).toJSON() && new Date(Q).toJSON().indexOf(V) !== -1 && Date.prototype.toJSON.call({
                toISOString: function() {
                    return !0
                }
            })
        } catch (t) {
            return !1
        }
    }();
    _ || (Date.prototype.toJSON = function(t) {
        var e = Object(this),
            r = M.ToPrimitive(e);
        if ("number" == typeof r && !isFinite(r)) return null;
        var n = e.toISOString;
        if (!v(n)) throw new TypeError("toISOString property is not callable");
        return n.call(e)
    });
    var tt = 1e15 === Date.parse("+033658-09-27T01:46:40.000Z"),
        et = !isNaN(Date.parse("2012-04-04T24:00:00.500Z")) || !isNaN(Date.parse("2012-11-31T23:59:59.000Z")) || !isNaN(Date.parse("2012-12-31T23:59:60.000Z")),
        rt = isNaN(Date.parse("2000-01-01T00:00:00.000Z"));
    Date.parse && !rt && !et && tt || (Date = function(t) {
        var e = function(r, n, i, a, o, u, f) {
                var c, s = arguments.length;
                return c = this instanceof t ? 1 === s && String(r) === r ? new t(e.parse(r)) : s >= 7 ? new t(r, n, i, a, o, u, f) : s >= 6 ? new t(r, n, i, a, o, u) : s >= 5 ? new t(r, n, i, a, o) : s >= 4 ? new t(r, n, i, a) : s >= 3 ? new t(r, n, i) : s >= 2 ? new t(r, n) : s >= 1 ? new t(r) : new t : t.apply(this, arguments), I(c, {
                    constructor: e
                }, !0), c
            },
            r = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"),
            n = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
            i = function(t, e) {
                var r = e > 1 ? 1 : 0;
                return n[e] + Math.floor((t - 1969 + r) / 4) - Math.floor((t - 1901 + r) / 100) + Math.floor((t - 1601 + r) / 400) + 365 * (t - 1970)
            },
            a = function(e) {
                return Number(new t(1970, 0, 1, 0, 0, 0, e))
            };
        for (var o in t) A(t, o) && (e[o] = t[o]);
        I(e, {
            now: t.now,
            UTC: t.UTC
        }, !0), e.prototype = t.prototype, I(e.prototype, {
            constructor: e
        }, !0);
        var u = function c(e) {
            var n = r.exec(e);
            if (n) {
                var d, o = Number(n[1]),
                    u = Number(n[2] || 1) - 1,
                    l = Number(n[3] || 1) - 1,
                    f = Number(n[4] || 0),
                    s = Number(n[5] || 0),
                    c = Number(n[6] || 0),
                    p = Math.floor(1e3 * Number(n[7] || 0)),
                    h = Boolean(n[4] && !n[8]),
                    v = "-" === n[9] ? 1 : -1,
                    g = Number(n[10] || 0),
                    y = Number(n[11] || 0);
                return f < (s > 0 || c > 0 || p > 0 ? 24 : 25) && s < 60 && c < 60 && p < 1e3 && u > -1 && u < 12 && g < 24 && y < 60 && l > -1 && l < i(o, u + 1) - i(o, u) && (d = 60 * (24 * (i(o, u) + l) + f + g * v), d = 1e3 * (60 * (d + s + y * v) + c) + p, h && (d = a(d)), -864e13 <= d && d <= 864e13) ? d : NaN
            }
            return t.parse.apply(this, arguments)
        };
        return I(e, {
            parse: u
        }), e
    }(Date)), Date.now || (Date.now = function() {
        return (new Date).getTime()
    });
    var nt = i.toFixed && ("0.000" !== 8e-5.toFixed(3) || "1" !== .9.toFixed(0) || "1.25" !== 1.255.toFixed(2) || "1000000000000000128" !== (0xde0b6b3a7640080).toFixed(0)),
        it = {
            base: 1e7,
            size: 6,
            data: [0, 0, 0, 0, 0, 0],
            multiply: function(t, e) {
                for (var r = -1, n = e; ++r < it.size;) n += t * it.data[r], it.data[r] = n % it.base, n = Math.floor(n / it.base)
            },
            divide: function(t) {
                for (var e = it.size, r = 0; --e >= 0;) r += it.data[e], it.data[e] = Math.floor(r / t), r = r % t * it.base
            },
            numToString: function() {
                for (var t = it.size, e = ""; --t >= 0;)
                    if ("" !== e || 0 === t || 0 !== it.data[t]) {
                        var r = String(it.data[t]);
                        "" === e ? e = r : e += "0000000".slice(0, 7 - r.length) + r
                    }
                return e
            },
            pow: function Qt(t, e, r) {
                return 0 === e ? r : e % 2 === 1 ? Qt(t, e - 1, r * t) : Qt(t * t, e / 2, r)
            },
            log: function(t) {
                for (var e = 0, r = t; r >= 4096;) e += 12, r /= 4096;
                for (; r >= 2;) e += 1, r /= 2;
                return e
            }
        };
    I(i, {
        toFixed: function(t) {
            var e, r, n, i, a, o, u, l;
            if (e = Number(t), e = e !== e ? 0 : Math.floor(e), e < 0 || e > 20) throw new RangeError("Number.toFixed called with invalid number of decimals");
            if (r = Number(this), r !== r) return "NaN";
            if (r <= -1e21 || r >= 1e21) return String(r);
            if (n = "", r < 0 && (n = "-", r = -r), i = "0", r > 1e-21)
                if (a = it.log(r * it.pow(2, 69, 1)) - 69, o = a < 0 ? r * it.pow(2, -a, 1) : r / it.pow(2, a, 1), o *= 4503599627370496, a = 52 - a, a > 0) {
                    for (it.multiply(0, o), u = e; u >= 7;) it.multiply(1e7, 0), u -= 7;
                    for (it.multiply(it.pow(10, u, 1), 0), u = a - 1; u >= 23;) it.divide(1 << 23), u -= 23;
                    it.divide(1 << u), it.multiply(1, 1), it.divide(2), i = it.numToString()
                } else it.multiply(0, o), it.multiply(1 << -a, 0), i = it.numToString() + "0.00000000000000000000".slice(2, 2 + e);
            return e > 0 ? (l = i.length, i = l <= e ? n + "0.0000000000000000000".slice(0, e - l + 2) + i : n + i.slice(0, l - e) + "." + i.slice(l - e)) : i = n + i, i
        }
    }, nt);
    var at = n.split;
    2 !== "ab".split(/(?:ab)*/).length || 4 !== ".".split(/(.?)(.?)/).length || "t" === "tesst".split(/(s)*/)[1] || 4 !== "test".split(/(?:)/, -1).length || "".split(/.?/).length || ".".split(/()()/).length > 1 ? ! function() {
        var t = "undefined" == typeof /()??/.exec("")[1];
        n.split = function(e, r) {
            var n = this;
            if ("undefined" == typeof e && 0 === r) return [];
            if (!b(e)) return at.call(this, e, r);
            var l, f, s, c, i = [],
                a = (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.extended ? "x" : "") + (e.sticky ? "y" : ""),
                o = 0,
                p = new RegExp(e.source, a + "g");
            n += "", t || (l = new RegExp("^" + p.source + "$(?!\\s)", a));
            var h = "undefined" == typeof r ? -1 >>> 0 : M.ToUint32(r);
            for (f = p.exec(n); f && (s = f.index + f[0].length, !(s > o && (i.push(n.slice(o, f.index)), !t && f.length > 1 && f[0].replace(l, function() {
                    for (var t = 1; t < arguments.length - 2; t++) "undefined" == typeof arguments[t] && (f[t] = void 0)
                }), f.length > 1 && f.index < n.length && u.apply(i, f.slice(1)), c = f[0].length, o = s, i.length >= h)));) p.lastIndex === f.index && p.lastIndex++, f = p.exec(n);
            return o === n.length ? !c && p.test("") || i.push("") : i.push(n.slice(o)), i.length > h ? i.slice(0, h) : i
        }
    }() : "0".split(void 0, 0).length && (n.split = function(t, e) {
        return "undefined" == typeof t && 0 === e ? [] : at.call(this, t, e)
    });
    var ot = n.replace,
        ut = function() {
            var t = [];
            return "x".replace(/x(.)?/g, function(e, r) {
                t.push(r)
            }), 1 === t.length && "undefined" == typeof t[0]
        }();
    ut || (n.replace = function(t, e) {
        var r = v(e),
            n = b(t) && /\)[*?]/.test(t.source);
        if (r && n) {
            var i = function(r) {
                var n = arguments.length,
                    i = t.lastIndex;
                t.lastIndex = 0;
                var a = t.exec(r) || [];
                return t.lastIndex = i, a.push(arguments[n - 2], arguments[n - 1]), e.apply(this, a)
            };
            return ot.call(this, t, i)
        }
        return ot.call(this, t, e)
    });
    var lt = n.substr,
        ft = "".substr && "b" !== "0b".substr(-1);
    I(n, {
        substr: function(t, e) {
            var r = t;
            return t < 0 && (r = Math.max(this.length + t, 0)), lt.call(this, r, e)
        }
    }, ft);
    var st = "\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff",
        ct = "​",
        pt = "[" + st + "]",
        ht = new RegExp("^" + pt + pt + "*"),
        vt = new RegExp(pt + pt + "*$"),
        gt = n.trim && (st.trim() || !ct.trim());
    I(n, {
        trim: function() {
            if ("undefined" == typeof this || null === this) throw new TypeError("can't convert " + this + " to object");
            return String(this).replace(ht, "").replace(vt, "")
        }
    }, gt), 8 === parseInt(st + "08") && 22 === parseInt(st + "0x16") || (parseInt = function(t) {
        var e = /^0[xX]/;
        return function(n, i) {
            var a = String(n).trim(),
                o = Number(i) || (e.test(a) ? 16 : 10);
            return t(a, o)
        }
    }(parseInt))
}),
function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define("src/assets/js/es5-debug", [], t) : "object" == typeof exports ? module.exports = t() : e.returnExports = t()
}(this, function() {
    var n, o, c, i, e = Function.prototype.call,
        t = Object.prototype,
        r = e.bind(t.hasOwnProperty),
        f = r(t, "__defineGetter__");
    f && (n = e.bind(t.__defineGetter__), o = e.bind(t.__defineSetter__), c = e.bind(t.__lookupGetter__), i = e.bind(t.__lookupSetter__)), Object.getPrototypeOf || (Object.getPrototypeOf = function(e) {
        var r = e.__proto__;
        return r || null === r ? r : e.constructor ? e.constructor.prototype : t
    });
    var l = function(e) {
        try {
            return e.sentinel = 0, 0 === Object.getOwnPropertyDescriptor(e, "sentinel").value
        } catch (t) {
            return !1
        }
    };
    if (Object.defineProperty) {
        var a = l({}),
            u = "undefined" == typeof document || l(document.createElement("div"));
        if (!u || !a) var p = Object.getOwnPropertyDescriptor
    }
    if (!Object.getOwnPropertyDescriptor || p) {
        var b = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function(e, n) {
            if ("object" != typeof e && "function" != typeof e || null === e) throw new TypeError(b + e);
            if (p) try {
                return p.call(Object, e, n)
            } catch (o) {}
            var l;
            if (!r(e, n)) return l;
            if (l = {
                    enumerable: !0,
                    configurable: !0
                }, f) {
                var a = e.__proto__,
                    u = e !== t;
                u && (e.__proto__ = t);
                var s = c(e, n),
                    O = i(e, n);
                if (u && (e.__proto__ = a), s || O) return s && (l.get = s), O && (l.set = O), l
            }
            return l.value = e[n], l.writable = !0, l
        }
    }
    if (Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function(e) {
            return Object.keys(e)
        }), !Object.create) {
        var s, O = !({
                    __proto__: null
                }
                instanceof Object),
            j = function() {
                if (!document.domain) return !1;
                try {
                    return !!new ActiveXObject("htmlfile")
                } catch (e) {
                    return !1
                }
            },
            d = function() {
                var e, t;
                return t = new ActiveXObject("htmlfile"), t.write("<script></script>"), t.close(), e = t.parentWindow.Object.prototype, t = null, e
            },
            y = function() {
                var r, e = document.createElement("iframe"),
                    t = document.body || document.documentElement;
                return e.style.display = "none", t.appendChild(e), e.src = "javascript:", r = e.contentWindow.Object.prototype, t.removeChild(e), e = null, r
            };
        s = O || "undefined" == typeof document ? function() {
            return {
                __proto__: null
            }
        } : function() {
            var e = j() ? d() : y();
            delete e.constructor, delete e.hasOwnProperty, delete e.propertyIsEnumerable, delete e.isPrototypeOf, delete e.toLocaleString, delete e.toString, delete e.valueOf, e.__proto__ = null;
            var t = function() {};
            return t.prototype = e, s = function() {
                return new t
            }, new t
        }, Object.create = function(e, t) {
            var r, n = function() {};
            if (null === e) r = s();
            else {
                if ("object" != typeof e && "function" != typeof e) throw new TypeError("Object prototype may only be an Object or null");
                n.prototype = e, r = new n, r.__proto__ = e
            }
            return void 0 !== t && Object.defineProperties(r, t), r
        }
    }
    var _ = function(e) {
        try {
            return Object.defineProperty(e, "sentinel", {}), "sentinel" in e
        } catch (t) {
            return !1
        }
    };
    if (Object.defineProperty) {
        var v = _({}),
            w = "undefined" == typeof document || _(document.createElement("div"));
        if (!v || !w) var h = Object.defineProperty,
            m = Object.defineProperties
    }
    if (!Object.defineProperty || h) {
        var P = "Property description must be an object: ",
            E = "Object.defineProperty called on non-object: ",
            g = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function(e, r, l) {
            if ("object" != typeof e && "function" != typeof e || null === e) throw new TypeError(E + e);
            if ("object" != typeof l && "function" != typeof l || null === l) throw new TypeError(P + l);
            if (h) try {
                return h.call(Object, e, r, l)
            } catch (a) {}
            if ("value" in l)
                if (f && (c(e, r) || i(e, r))) {
                    var u = e.__proto__;
                    e.__proto__ = t, delete e[r], e[r] = l.value, e.__proto__ = u
                } else e[r] = l.value;
            else {
                if (!f) throw new TypeError(g);
                "get" in l && n(e, r, l.get), "set" in l && o(e, r, l.set)
            }
            return e
        }
    }
    Object.defineProperties && !m || (Object.defineProperties = function(e, t) {
        if (m) try {
            return m.call(Object, e, t)
        } catch (r) {}
        return Object.keys(t).forEach(function(r) {
            "__proto__" !== r && Object.defineProperty(e, r, t[r])
        }), e
    }), Object.seal || (Object.seal = function(e) {
        if (Object(e) !== e) throw new TypeError("Object.seal can only be called on Objects.");
        return e
    }), Object.freeze || (Object.freeze = function(e) {
        if (Object(e) !== e) throw new TypeError("Object.freeze can only be called on Objects.");
        return e
    });
    try {
        Object.freeze(function() {})
    } catch (T) {
        Object.freeze = function(e) {
            return function(r) {
                return "function" == typeof r ? r : e(r)
            }
        }(Object.freeze)
    }
    Object.preventExtensions || (Object.preventExtensions = function(e) {
        if (Object(e) !== e) throw new TypeError("Object.preventExtensions can only be called on Objects.");
        return e
    }), Object.isSealed || (Object.isSealed = function(e) {
        if (Object(e) !== e) throw new TypeError("Object.isSealed can only be called on Objects.");
        return !1
    }), Object.isFrozen || (Object.isFrozen = function(e) {
        if (Object(e) !== e) throw new TypeError("Object.isFrozen can only be called on Objects.");
        return !1
    }), Object.isExtensible || (Object.isExtensible = function(e) {
        if (Object(e) !== e) throw new TypeError("Object.isExtensible can only be called on Objects.");
        for (var t = ""; r(e, t);) t += "?";
        e[t] = !0;
        var n = r(e, t);
        return delete e[t], n
    })
});