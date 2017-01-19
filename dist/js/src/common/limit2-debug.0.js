"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
        return arr2
    }
    return Array.from(arr)
}
var _createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor)
            }
        }
        return function(Constructor, protoProps, staticProps) {
            return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
        }
    }(),
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj
    };
define("src/common/limit2-debug.0", [], function(require, exports) {
    var _this = this,
        limit = {},
        WIN = window,
        DOC = WIN.document,
        objectProto = (DOC.body, Object.prototype),
        arrayProto = Array.prototype,
        stringProto = String.prototype,
        functionProto = Function.prototype;
    limit.limitFixed = !1, limit.logClosed = !1;
    var defineProperty = Object.defineProperty,
        is = Object.is,
        assign = Object.assign,
        keys = Object.keys,
        values = Object.values,
        entries = Object.entries,
        getOwnPropertyNames = Object.getOwnPropertyNames,
        toString = objectProto.toString,
        hasOwnProperty = objectProto.hasOwnProperty,
        from = Array.from,
        of = Array.of,
        concat = arrayProto.concat,
        push = arrayProto.push,
        slice = arrayProto.slice,
        unshift = arrayProto.unshift,
        splice = arrayProto.splice,
        forEach = arrayProto.forEach,
        map = arrayProto.map,
        filter = arrayProto.filter,
        some = arrayProto.some,
        every = arrayProto.every,
        indexOf = arrayProto.indexOf,
        lastIndexOf = arrayProto.lastIndexOf,
        reduce = arrayProto.reduce,
        reduceRight = arrayProto.reduceRight,
        find = arrayProto.find,
        findIndex = arrayProto.findIndex,
        fill = arrayProto.fill,
        copyWithin = arrayProto.copyWithin,
        fromCodePoint = String.fromCodePoint,
        trim = stringProto.trim,
        codePointAt = stringProto.codePointAt,
        startsWith = stringProto.startsWith,
        endsWith = stringProto.endsWith,
        repeat = stringProto.repeat,
        padStart = stringProto.padStart,
        padEnd = stringProto.padEnd,
        bind = functionProto.bind,
        K = function(val) {
            return val
        },
        F = function() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return args
        },
        E = function() {},
        O = {},
        getProp = function() {
            var obj = arguments.length <= 0 || void 0 === arguments[0] ? O : arguments[0],
                key = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1],
                deVal = arguments[2];
            return void 0 === obj[key] ? deVal : obj[key]
        },
        defineIt = function defineIt(name) {
            var config = arguments.length <= 1 || void 0 === arguments[1] ? O : arguments[1],
                priority = void 0,
                fixed = void 0,
                when = void 0,
                format = void 0,
                value = void 0,
                arr = name.split(",");
            if (name = arr.shift(), void 0 === config.value ? (priority = getProp(config, "priority", F), fixed = getProp(config, "fixed", K), when = getProp(config, "when", E), format = getProp(config, "format", F), value = function() {
                    var args = concat.call(arrayProto, format.apply(void 0, arguments));
                    return !limit.limitFixed && when.apply(void 0, _toConsumableArray(args)) ? priority.apply(void 0, _toConsumableArray(args)) : fixed.apply(void 0, _toConsumableArray(args))
                }) : value = config.value, "function" == typeof value && (value.toString = function() {
                    return "function () { [native code] }"
                }), defineProperty) defineProperty(limit, name, {
                value: value,
                writable: !1,
                enumerable: !0,
                configurable: !1
            });
            else {
                if (void 0 !== limit[name]) throw new TypeError("Cannot redefine property: " + name);
                limit[name] = value
            }
            return arr.length ? defineIt(arr.join(","), config) : value
        };
    defineIt("K", {
        value: K
    }), defineIt("F", {
        value: F
    }), defineIt("getProp", {
        value: getProp
    });
    var logColor = {
            log: "background:#333;margin-left:11px;padding-right:17px;",
            error: "background:#F00;padding-right:3px;",
            warn: "background:#F70;margin-left:11px;padding-right:10px;"
        },
        typeWarn = {
            toString: function(obj) {
                return limit.log("warn", obj, "change into", "'" + obj + "'")
            },
            toNumber: function(obj) {
                return limit.log("warn", obj, "change into", "NaN")
            },
            toArray: function(obj) {
                return limit.log("warn", obj, "change into []")
            },
            finiteNum: function(obj) {
                return limit.log("warn", obj, "is not a finite Number")
            },
            formatDate: function(obj) {
                return limit.log("warn", "timestamp:", timestamp, "date:", date, "limit.formatDate is called")
            },
            bind: function(obj) {
                return limit.log("warn", fun, "type is not function, limit.bind is called")
            }
        };
    defineIt("log", {
        value: function() {
            if (!limit.logClosed) {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                var type = args.shift(),
                    con = console || O,
                    log = void 0,
                    isChrome = WIN.chrome;
                limit.contains(["error", "log", "warn"], type) || (args.unshift(type), type = "error"), log = con[type] || K;
                try {
                    isChrome && args.unshift(logColor[type] + "color:#FFF;padding-left:3px;border-radius:3px;"), args.unshift((isChrome ? "%c" : "") + type + ":"), log.apply(con, args)
                } catch (e) {
                    log("日志 ", args)
                }
            }
        }
    }), defineIt("T.T", {
        value: function() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
            return limit.log.apply(null, ["error"].concat(args))
        }
    }), defineIt("!!!", {
        value: function() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
            return limit.log.apply(null, ["warn"].concat(args))
        }
    }), defineIt("...", {
        value: function() {
            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) args[_key5] = arguments[_key5];
            return limit.log.apply(null, ["log"].concat(args))
        }
    }), defineIt("isElement", {
        value: function(n) {
            return !!n && 1 === n.nodeType
        }
    }), defineIt("isDocument", {
        value: function(n) {
            return !!n && 9 === n.nodeType
        }
    }), defineIt("isWin", {
        value: function(n) {
            return !!n && n.window === n && n.self == n
        }
    }), defineIt("isUndefined", {
        value: function(n) {
            return void 0 === n
        }
    }), defineIt("isDefined", {
        value: function(n) {
            return !limit.isUndefined(n)
        }
    }), defineIt("isNull", {
        value: function(n) {
            return null === n
        }
    }), defineIt("isFunction", {
        value: function(n) {
            return "function" == typeof n
        }
    }), defineIt("isBoolean", {
        value: function(n) {
            return n === !0 || n === !1 || "[object Boolean]" === toString.call(n)
        }
    }), "String,Number,Array,Date,RegExp,Error,Math".replace(/\w+/g, function(k) {
        return defineIt("is" + k, {
            value: function(n) {
                return toString.call(n) === "[object " + k + "]"
            }
        })
    }), defineIt("isObject", {
        value: function(n) {
            return limit.isFunction(n) || "object" === ("undefined" == typeof n ? "undefined" : _typeof(n)) && !!n
        }
    }), defineIt("isArguments", {
        value: function(n) {
            return limit.has(n, "callee")
        }
    }), defineIt("isArrayLike", {
        value: function(n) {
            return !!n && limit.isNumber(n.length) && !limit.isFunction(n) && !limit.isWin(n)
        }
    }), defineIt("isNaN", {
        when: function() {
            return !!Number.isNaN
        },
        priority: function() {
            return Number.isNaN.apply(Number, arguments)
        },
        fixed: function(n) {
            return limit.isNumber(n) && isNaN(n)
        }
    }), defineIt("isFinite", {
        when: function() {
            return !!Number.isFinite
        },
        priority: function() {
            return Number.isFinite.apply(Number, arguments)
        },
        fixed: function(n) {
            return limit.isNumber(n) && isFinite(n)
        }
    }), defineIt("isInteger", {
        when: function() {
            return !!Number.isInteger
        },
        priority: function() {
            return Number.isInteger.apply(Number, arguments)
        },
        fixed: function(n) {
            return limit.isFinite(n) && Math.floor(n) === n
        }
    }), defineIt("isSafeInteger", {
        when: function() {
            return !!Number.isSafeInteger
        },
        priority: function() {
            return Number.isSafeInteger.apply(Number, arguments)
        },
        fixed: function(n) {
            return limit.isInteger(n) && -9007199254740992 < n && n < 9007199254740992
        }
    }), defineIt("isEmpty", {
        value: function(n) {
            return null == n || 0 === limit.size(n)
        }
    });
    var checkTargetNoEqualNull = function(target) {
            for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) args[_key6 - 1] = arguments[_key6];
            return null == target ? [{}].concat(args) : [target].concat(args)
        },
        checkTargetWithArray = function(target) {
            for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) args[_key7 - 1] = arguments[_key7];
            return [limit.toArray(target)].concat(args)
        },
        checkTargetWithString = function(target) {
            for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) args[_key8 - 1] = arguments[_key8];
            return [limit.toString(target)].concat(args)
        },
        checkTargetWithNumber = function(target) {
            for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) args[_key9 - 1] = arguments[_key9];
            return [limit.toNumber(target)].concat(args)
        },
        checkObjFunction = function(obj, iterator) {
            for (var _len10 = arguments.length, args = Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) args[_key10 - 2] = arguments[_key10];
            return checkTargetNoEqualNull.apply(void 0, [obj, limit.cb(iterator)].concat(args))
        },
        checkArrFunction = function(arr, iterator) {
            for (var _len11 = arguments.length, args = Array(_len11 > 2 ? _len11 - 2 : 0), _key11 = 2; _key11 < _len11; _key11++) args[_key11 - 2] = arguments[_key11];
            return checkTargetWithArray.apply(void 0, [arr, limit.cb(iterator)].concat(args))
        },
        checkTrueIndex = function(length, index) {
            return index = ~~index, length = ~~length, index < 0 && (index = length + index, index < 0 && (index = 0)), index
        },
        checkPositive = function(num) {
            return num = ~~num, num < 0 ? 0 : num
        },
        checkStringNumber = function(str, num) {
            return [limit.toString(str), checkPositive(num)]
        },
        checkPadArgs = function(str, leg, arg) {
            return arg = limit.toString(arg), [limit.toString(str), checkPositive(leg), arg ? arg : " "]
        },
        checkFiniteNum = function() {
            for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) args[_key12] = arguments[_key12];
            return limit.every(limit.flatten(args), function(val) {
                var flag = limit.isFinite(val);
                return flag || typeWarn.finiteNum(val), flag
            })
        },
        checkFlattenArgs = function() {
            for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) args[_key13] = arguments[_key13];
            return limit.flatten(args)
        },
        UID = [0, 0, 0];
    defineIt("getUid", {
        value: function() {
            for (var index = UID.length, code = void 0; index--;)
                if (code = UID[index], 9 === code && (UID[index] = 0), code < 9) return UID[index]++, UID.join(".");
            return UID.unshift(1), UID.join(".")
        }
    }), defineIt("_loop", {
        value: function(obj, iterator, context, isBreak, begin) {
            for (var target = limit._getLoopKey(obj), key = void 0, num = ~~begin, len = target.length; num < len && (key = target[num], iterator.call(context, obj[key], key, obj) !== !1 || !isBreak); num++);
        }
    }), defineIt("_getLoopKey", {
        value: function(obj) {
            return limit.isArrayLike(obj) ? limit.keys(limit.toArray(obj)) : limit.keys(obj)
        }
    }), defineIt("has", {
        format: checkTargetNoEqualNull,
        fixed: function(n, k) {
            return hasOwnProperty.call(n, k)
        }
    }), defineIt("cb", {
        value: function(callback) {
            return limit.isFunction(callback) ? callback : K
        }
    }), defineIt("forin", {
        format: checkObjFunction,
        fixed: function(obj, iterator, context) {
            for (var key in obj) iterator.call(context, obj[key], key, obj)
        }
    }), defineIt("each", {
        format: checkObjFunction,
        when: function(obj) {
            return isArrayLike(obj) && forEach
        },
        priority: function(obj, iterator, context) {
            return forEach.call(obj, function(val, key) {
                iterator.call(_this, val, "" + key)
            }, context)
        },
        value: function(obj, iterator, context) {
            return limit._loop(obj, iterator, context)
        }
    }), defineIt("is", {
        when: function() {
            return !!is
        },
        priority: function() {
            return is.apply(void 0, arguments)
        },
        fixed: function(a, b) {
            return !(!limit.isNaN(a) || !limit.isNaN(b)) || (0 === a && 0 === b ? 1 / a === 1 / b : a === b)
        }
    }), defineIt("assign", {
        when: function() {
            return !!assign
        },
        priority: function() {
            return assign.apply(void 0, arguments)
        },
        format: checkTargetNoEqualNull,
        fixed: function(target) {
            for (var _len14 = arguments.length, args = Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) args[_key14 - 1] = arguments[_key14];
            return limit.each(args, function(val) {
                limit.each(val, function(val, key) {
                    target[key] = val
                })
            }), target
        }
    }), defineIt("values", {
        when: function() {
            return !!values
        },
        priority: function() {
            return values.apply(void 0, arguments)
        },
        format: checkTargetNoEqualNull,
        fixed: function(target) {
            var result = [];
            return limit.each(target, function(val) {
                result.push(val)
            }), result
        }
    }), defineIt("entries", {
        when: function() {
            return !!entries
        },
        priority: function() {
            return entries.apply(void 0, arguments)
        },
        format: checkTargetNoEqualNull,
        fixed: function(target) {
            var result = [];
            return limit.each(target, function(val, key) {
                result.push([key, val])
            }), result
        }
    });
    var keysFixed = function(obj) {
        var arr = [];
        return limit.forin(obj, function(val, key) {
            return limit.has(obj, key) && arr.push(key)
        }), arr
    };
    defineIt("keys", {
        when: function() {
            return !!keys
        },
        priority: function() {
            return keys.apply(void 0, arguments)
        },
        format: checkTargetNoEqualNull,
        fixed: keysFixed
    }), defineIt("keysSuper", {
        when: function() {
            return !!getOwnPropertyNames
        },
        priority: function() {
            return getOwnPropertyNames.apply(void 0, arguments)
        },
        format: checkTargetNoEqualNull,
        fixed: keysFixed
    }), defineIt("assignSuper", {
        format: checkTargetNoEqualNull,
        fixed: function(target) {
            for (var _len15 = arguments.length, args = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) args[_key15 - 1] = arguments[_key15];
            return limit.each(args, function(val) {
                limit.each(val, function(val, key) {
                    limit.isDefined(val) && (target[key] = val)
                })
            }), target
        }
    }), defineIt("extend", {
        format: checkTargetNoEqualNull,
        fixed: function(target) {
            for (var _len16 = arguments.length, args = Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) args[_key16 - 1] = arguments[_key16];
            return limit.each(args, function(val) {
                limit.forin(val, function(val, key) {
                    target[key] = val
                })
            }), target
        }
    }), defineIt("extendSuper", {
        format: checkTargetNoEqualNull,
        fixed: function(target) {
            for (var _len17 = arguments.length, args = Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) args[_key17 - 1] = arguments[_key17];
            return limit.each(args, function(val) {
                limit.forin(val, function(val, key) {
                    limit.isDefined(val) && (target[key] = val)
                })
            }), target
        }
    }), defineIt("getValueInObject", {
        format: checkTargetNoEqualNull,
        fixed: function(obj) {
            for (var _len18 = arguments.length, args = Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) args[_key18 - 1] = arguments[_key18];
            return limit.some(args, function(val) {
                try {
                    return obj = obj[val], !limit.isObject(obj)
                } catch (e) {
                    return obj = void 0, !0
                }
            }), obj
        }
    }), defineIt("size", {
        value: function(n) {
            return limit._getLoopKey(n).length
        }
    });
    var sliceFix = function(obj) {
        for (var arr = [], i = 0; i < obj.length; i++) arr[i] = obj[i];
        return arr
    };
    defineIt("toArray", {
        value: function(obj) {
            if (limit.isArray(obj)) return obj;
            if (!limit.isArrayLike(obj)) return typeWarn.toArray(obj), [];
            try {
                return slice.call(obj)
            } catch (e) {
                return sliceFix(obj)
            }
        }
    }), defineIt("contains", {
        value: function(arr, target) {
            return limit.some(arr, function(val) {
                return limit.is(val, target)
            })
        }
    }), defineIt("flatten", {
        value: function value() {
            for (var value = [], _len19 = arguments.length, args = Array(_len19), _key19 = 0; _key19 < _len19; _key19++) args[_key19] = arguments[_key19];
            return limit.forEach(args, function(val) {
                push.apply(value, limit.isArray(val) ? limit.flatten.apply(void 0, concat.apply(arrayProto, val)) : [val])
            }), value
        }
    }), defineIt("union", {
        format: checkTargetWithArray,
        fixed: function(arr) {
            var target = [];
            return limit.filter(arr, function(val) {
                return !limit.contains(target, val) && (target.push(val), !0)
            })
        }
    });
    var UNION_SORT = function(a, b) {
        if (0 === a && 0 === b) return 1 / a > 1 / b
    };
    defineIt("unionSuper", {
        format: checkTargetWithArray,
        fixed: function(arr) {
            var target = void 0;
            return limit.filter(arr.slice().sort().sort(UNION_SORT), function(val, key) {
                return !(key && limit.is(target, val) || (target = val, 0))
            })
        }
    });
    var whiteBlack = function(factor, val1) {
        return limit.some(factor, function(val2) {
            return limit.every(val2, function(val3, key3) {
                return limit.is(val3, val1[key3])
            })
        })
    };
    defineIt("whiteList", {
        format: checkTargetWithArray,
        fixed: function(arr) {
            for (var _len20 = arguments.length, args = Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) args[_key20 - 1] = arguments[_key20];
            return args = limit.flatten(args), limit.filter(arr, function(val1) {
                return whiteBlack(args, val1)
            })
        }
    }), defineIt("blackList", {
        format: checkTargetWithArray,
        fixed: function(arr) {
            for (var _len21 = arguments.length, args = Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) args[_key21 - 1] = arguments[_key21];
            return args = limit.flatten(args), limit.filter(arr, function(val1) {
                return !whiteBlack(args, val1)
            })
        }
    }), defineIt("difference", {
        value: function(arr) {
            for (var _len22 = arguments.length, args = Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) args[_key22 - 1] = arguments[_key22];
            return args = limit.flatten(args), limit.filter(arr, function(val) {
                return !limit.contains(args, val)
            })
        }
    }), defineIt("remove", {
        format: checkTargetNoEqualNull,
        fixed: function(arr, tar, formIndex) {
            var index = limit.indexOfSuper(arr, tar, formIndex);
            if (index !== -1) try {
                return limit.isArray(arr) ? arr.splice(index, 1) : delete arr[index], !0
            } catch (e) {
                limit["T.T"](e)
            }
            return !1
        }
    }), defineIt("removeAll", {
        value: function(arr, tar) {
            return limit.remove(arr, tar) ? limit.removeAll(arr, tar) : arr
        }
    }), defineIt("forEach", {
        format: checkObjFunction,
        when: function(arr) {
            return forEach && arr.forEach === forEach
        },
        priority: function() {
            return Function.call.apply(forEach, arguments)
        },
        fixed: function(arr, iterator, context) {
            return limit.isArrayLike(arr) ? limit.each(arr, function(val, key) {
                iterator.call(context, val, +key, arr)
            }, context) : limit.each(arr, iterator, context)
        }
    }), defineIt("map", {
        format: checkObjFunction,
        when: function(arr) {
            return map && arr.map === map
        },
        priority: function() {
            return Function.call.apply(map, arguments)
        },
        fixed: function(arr, iterator, context) {
            var result = limit.isArrayLike(arr) ? [] : {};
            return limit.each(arr, function(val, key) {
                result[key] = iterator.call(this, val, key, arr)
            }, context), result
        }
    }), defineIt("filter", {
        format: checkObjFunction,
        when: function(arr) {
            return filter && arr.filter === filter
        },
        priority: function() {
            return Function.call.apply(filter, arguments)
        },
        fixed: function(arr, iterator, context) {
            var isArr = limit.isArrayLike(arr),
                result = isArr ? [] : {};
            return isArr ? limit.each(arr, function(val, key) {
                iterator.call(this, val, key, arr) && result.push(val)
            }, context) : limit.each(arr, function(val, key) {
                iterator.call(this, val, key, arr) && (result[key] = val)
            }), result
        }
    }), defineIt("some", {
        format: checkObjFunction,
        when: function(arr) {
            return some && arr.some === some
        },
        priority: function() {
            return Function.call.apply(some, arguments)
        },
        fixed: function(arr, iterator, context) {
            var result = !1;
            return limit.isArrayLike(arr) ? limit._loop(arr, function(val, key) {
                if (iterator.call(context, val, +key, arr)) return result = !0, !1
            }, void 0, !0) : limit._loop(arr, function(val, key) {
                if (iterator.call(context, val, key, arr)) return result = !0, !1
            }, void 0, !0), result
        }
    }), defineIt("every", {
        format: checkObjFunction,
        when: function(arr) {
            return every && arr.every === every
        },
        priority: function() {
            return Function.call.apply(every, arguments)
        },
        fixed: function(arr, iterator, context) {
            var result = !0;
            return limit.isArrayLike(arr) ? limit._loop(arr, function(val, key) {
                if (!iterator.call(context, val, +key, arr)) return result = !1
            }, void 0, !0) : limit._loop(arr, function(val, key) {
                if (!iterator.call(context, val, key, arr)) return result = !1
            }, void 0, !0), result
        }
    }), defineIt("indexOf", {
        format: checkTargetNoEqualNull,
        when: function(arr) {
            return indexOf && arr.indexOf === indexOf
        },
        priority: function() {
            return Function.call.apply(indexOf, arguments)
        },
        fixed: function(arr, ele, formIndex) {
            var index = -1;
            return limit._loop(arr, function(val, key) {
                if (val === ele) return index = key, !1
            }, void 0, !0, checkTrueIndex(arr.length, formIndex)), limit.isArrayLike(arr) ? +index : index
        }
    }), defineIt("indexOfSuper", {
        format: checkTargetNoEqualNull,
        fixed: function(arr, ele, formIndex) {
            var index = -1;
            return limit._loop(arr, function(val, key) {
                if (limit.is(val, ele)) return index = key, !1
            }, void 0, !0, checkTrueIndex(arr.length, formIndex)), limit.isArrayLike(arr) ? +index : index
        }
    }), defineIt("lastIndexOf", {
        format: checkTargetWithArray,
        when: function(arr) {
            return lastIndexOf && arr.lastIndexOf === lastIndexOf
        },
        priority: function() {
            return Function.call.apply(lastIndexOf, arguments)
        },
        fixed: function(arr, ele, formIndex) {
            formIndex = ~~formIndex;
            var len = arr.length - 1,
                index = limit.indexOf(arr.reverse(), ele, 3 === arguments.length ? len - formIndex : formIndex);
            return index === -1 ? -1 : len - index
        }
    });
    var ERR_MSG_REDUCE = new TypeError("Reduce of empty array with no initial value");
    defineIt("reduce", {
        format: checkArrFunction,
        when: function(arr) {
            return reduce && arr.reduce === reduce
        },
        priority: function() {
            return Function.call.apply(reduce, arguments)
        },
        fixed: function(arr, iterator, init) {
            var len = arguments.length,
                index = 0,
                noInit = 2 === len,
                result = noInit ? arr[index++] : init;
            if (noInit && 0 === arr.length) throw ERR_MSG_REDUCE;
            return limit._loop(arr, function(val, key) {
                result = iterator.call(this, result, val, +key, arr)
            }, void 0, !1, index), result
        }
    }), defineIt("reduceRight", {
        format: checkArrFunction,
        when: function(arr) {
            return reduceRight && arr.reduceRight === reduceRight
        },
        priority: function() {
            return Function.call.apply(reduceRight, arguments)
        },
        fixed: function() {
            for (var _len23 = arguments.length, args = Array(_len23), _key23 = 0; _key23 < _len23; _key23++) args[_key23] = arguments[_key23];
            var len = args[0].length - 1,
                iterator = args[1];
            return args[0].reverse(), args[1] = function(before, val, key, arr) {
                return iterator(before, val, len - key, arr)
            }, limit.reduce.apply(limit, args)
        }
    }), defineIt("from", {
        format: checkObjFunction,
        when: function() {
            return !!from
        },
        priority: function() {
            return from.apply(void 0, arguments)
        },
        fixed: function(obj, iterator, context) {
            var arr = [];
            return obj && obj.length ? (push.apply(arr, limit.toArray(obj)), limit.map(arr, iterator, context)) : arr
        }
    }), defineIt("of", {
        when: function() {
            return !!of
        },
        priority: function() {
            return of.apply(void 0, arguments)
        },
        fixed: function() {
            for (var _len24 = arguments.length, args = Array(_len24), _key24 = 0; _key24 < _len24; _key24++) args[_key24] = arguments[_key24];
            return slice.call(args)
        }
    }), defineIt("find", {
        format: checkObjFunction,
        when: function(arr) {
            return find && arr.find === find
        },
        priority: function() {
            return Function.call.apply(find, arguments)
        },
        fixed: function(arr, iterator, context) {
            var target = void 0;
            return limit.some(arr, function(val, key, arr) {
                if (iterator(val, key, arr)) return target = val, !0
            }), target
        }
    }), defineIt("findIndex", {
        format: checkObjFunction,
        when: function(arr) {
            return findIndex && arr.findIndex === findIndex
        },
        priority: function() {
            return Function.call.apply(findIndex, arguments)
        },
        fixed: function(arr, iterator, context) {
            var target = -1;
            return limit.some(arr, function(val, key, arr) {
                if (iterator(val, key, arr)) return target = key, !0
            }), target
        }
    }), defineIt("fill", {
        format: checkTargetWithArray,
        when: function(arr) {
            return fill && arr.fill === fill
        },
        priority: function() {
            return Function.call.apply(fill, arguments)
        },
        fixed: function(arr, target, start, end) {
            var arrLen = arr.length;
            start = ~~start, end = ~~end, start = start < 0 ? arrLen + start : start, end = end <= 0 ? arrLen + end : end, start < 0 && (start = 0), end > arrLen && (end = arrLen);
            var len = end - start;
            if (len > 0) {
                var arg = limit.from(new Array(len), function() {
                    return target
                });
                unshift.call(arg, start, len), splice.apply(arr, arg)
            }
            return arr
        }
    }), defineIt("includes", {
        when: function(arr) {
            return !!arr.includes
        },
        priority: function(arr, target, index) {
            return arr.includes(target, index)
        },
        fixed: function(arr, target, index) {
            if (limit.isString(arr)) return arr.indexOf(target, index) !== -1;
            if (limit.isNaN(target)) {
                var result = !1;
                return limit._loop(arr, function(val, key) {
                    if (limit.isNaN(val)) return result = !0, !1
                }, void 0, !0, checkTrueIndex(arr.length, index)), result
            }
            return limit.indexOf(arr, target, index) !== -1
        }
    }), defineIt("copyWithin", {
        format: checkTargetWithArray,
        when: function(arr) {
            return copyWithin && arr.copyWithin === copyWithin
        },
        priority: function() {
            return Function.call.apply(copyWithin, arguments)
        },
        fixed: function(arr, target, start, end) {
            var args = arr.slice(start, end);
            return args.unshift(target, args.length), splice.apply(arr, args), arr
        }
    });
    var MyPromise = function() {
        function MyPromise() {
            var _this2 = this;
            if (_classCallCheck(this, MyPromise), this.PromiseStatus = "pedding", this.PromiseValue = void 0, this.Stack = [], limit.isFunction(arguments.length <= 0 ? void 0 : arguments[0])) {
                this.promiseList = [];
                var _fun = arguments.length <= 0 ? void 0 : arguments[0],
                    resolve = function(val) {
                        limit.each([_this2].concat(_this2.promiseList), function(promise) {
                            "pedding" === promise.PromiseStatus && (promise.PromiseStatus = "resolved", promise.PromiseValue = val, promise._clean())
                        })
                    },
                    reject = function(val) {
                        limit.each([_this2].concat(_this2.promiseList), function(promise) {
                            "pedding" === promise.PromiseStatus && (promise.PromiseStatus = "rejected", promise.PromiseValue = val, promise._clean())
                        }), setTimeout(function() {
                            if (!_this2.promiseList.length) throw "(in promise) " + val
                        }, 0)
                    };
                try {
                    _fun(resolve, reject)
                } catch (e) {
                    this.PromiseStatus = "rejected", this.PromiseValue = e
                }
            } else this.PromiseStatus = arguments.length <= 0 ? void 0 : arguments[0], this.PromiseValue = arguments.length <= 1 ? void 0 : arguments[1]
        }
        return _createClass(MyPromise, [{
            key: "then",
            value: function(suc, err) {
                suc = limit.cb(suc), err = limit.cb(err);
                var me = this;
                if (me.promiseList) {
                    var originMe = me;
                    me = new MyPromise(me.PromiseStatus, me.PromiseValue), originMe.promiseList.push(me)
                }
                return me.Stack.push({
                    suc: suc,
                    err: err
                }), "pedding" === me.PromiseStatus || me.cleanStatus || me._clean(), me
            }
        }, {
            key: "Catch",
            value: function(err) {
                return this.then(null, err)
            }
        }, {
            key: "_clean",
            value: function() {
                var me = this,
                    one = me.Stack.shift();
                return me.cleanStatus = "init", one ? setTimeout(function() {
                    try {
                        switch (me.PromiseStatus) {
                            case "resolved":
                                me.PromiseValue = one.suc(me.PromiseValue);
                                break;
                            case "rejected":
                                me.PromiseValue = one.err(me.PromiseValue)
                        }
                        me.PromiseStatus = "resolved"
                    } catch (e) {
                        me.PromiseStatus = "rejected", me.PromiseValue = e, me.Stack.length || setTimeout(function() {
                            throw "(in promise) " + e
                        }, 0)
                    }
                    me._clean()
                }, 0) : delete me.cleanStatus, me
            }
        }], [{
            key: "all",
            value: function(list) {
                function main(arg, key) {
                    args[key] = arg, --guid || back(args)
                }
                var guid = list.length,
                    back = void 0,
                    args = [];
                return new MyPromise(function(resolve, reject) {
                    back = resolve, limit.each(list, function(val, key) {
                        val.PromiseStatus ? val.then(function(sucVal) {
                            main(sucVal, key)
                        }, function(errVal) {
                            reject(errVal)
                        }) : main(val, key)
                    })
                })
            }
        }, {
            key: "race",
            value: function(list) {
                return new MyPromise(function(resolve, reject) {
                    limit.each(list, function(val) {
                        MyPromise.resolve(val).then(function(sucVal) {
                            return resolve(sucVal)
                        }, function(errVal) {
                            return reject(errVal)
                        })
                    })
                })
            }
        }, {
            key: "resolve",
            value: function(val) {
                return new MyPromise(val && val.then ? function(resolve, reject) {
                    val.then(resolve, reject)
                } : function(resolve, reject) {
                    resolve(val)
                })
            }
        }, {
            key: "reject",
            value: function(val) {
                return new MyPromise(function(resolve, reject) {
                    reject(val)
                })
            }
        }]), MyPromise
    }();
    WIN.Promise && (Promise.prototype.Catch = function(fn) {
        return this.then(null, fn)
    }), defineIt("promise", {
        when: function() {
            return !!WIN.Promise
        },
        priority: function() {
            return Promise
        },
        fixed: function() {
            return MyPromise
        }
    }), defineIt("bind", {
        format: function(fn) {
            for (var _len25 = arguments.length, args = Array(_len25 > 1 ? _len25 - 1 : 0), _key25 = 1; _key25 < _len25; _key25++) args[_key25 - 1] = arguments[_key25];
            return [limit.cb(fn)].concat(args)
        },
        when: function(fn) {
            return bind && fn.bind === bind
        },
        priority: function() {
            function main() {
                for (var _len27 = arguments.length, args2 = Array(_len27), _key27 = 0; _key27 < _len27; _key27++) args2[_key27] = arguments[_key27];
                return Function.call.apply(bind, [].concat(args1, args2))()
            }
            for (var _len26 = arguments.length, args1 = Array(_len26), _key26 = 0; _key26 < _len26; _key26++) args1[_key26] = arguments[_key26];
            return main.toString = function() {
                return "function () { [native code] }"
            }, main
        },
        fixed: function(fn) {
            function main() {
                for (var _len29 = arguments.length, args2 = Array(_len29), _key29 = 0; _key29 < _len29; _key29++) args2[_key29] = arguments[_key29];
                return Function.call.apply(fn, [].concat(args1, args2))
            }
            for (var _len28 = arguments.length, args1 = Array(_len28 > 1 ? _len28 - 1 : 0), _key28 = 1; _key28 < _len28; _key28++) args1[_key28 - 1] = arguments[_key28];
            return main.toString = function() {
                return "function () { [native code] }"
            }, main
        }
    }), defineIt("compose", {
        value: function() {
            for (var _len30 = arguments.length, args1 = Array(_len30), _key30 = 0; _key30 < _len30; _key30++) args1[_key30] = arguments[_key30];
            return function() {
                for (var _len31 = arguments.length, args2 = Array(_len31), _key31 = 0; _key31 < _len31; _key31++) args2[_key31] = arguments[_key31];
                for (var result = args2, i = args1.length - 1; i >= 0; i--) result = [].concat(args1[i].apply(this, result));
                return result.length <= 1 ? result[0] : result
            }
        }
    }), defineIt("toString", {
        value: function(obj) {
            return null == obj ? "" : limit.isString(obj) ? obj : (limit.isObject(obj) && typeWarn.toString(obj), limit.is(obj, -0) ? "-0" : "" + obj)
        }
    });
    var REG_EXP_TRIM = /^\s+|\s+$/g;
    defineIt("trim", {
        format: checkTargetWithString,
        when: function(str) {
            return trim && str.trim === trim
        },
        priority: function() {
            return Function.call.apply(trim, arguments)
        },
        fixed: function(str) {
            return str.replace(REG_EXP_TRIM, "")
        }
    });
    var fixCodePointAt = function(codeH, codeL) {
        return codeH = limit.padStart((1023 & codeH).toString(2), 10, "0"), codeL = limit.padStart((1023 & codeL).toString(2), 10, "0"), parseInt(codeH + codeL, 2) + 65536
    };
    defineIt("codePointAt", {
        format: checkStringNumber,
        when: function(str) {
            return codePointAt && str.codePointAt === codePointAt
        },
        priority: function() {
            return Function.call.apply(codePointAt, arguments)
        },
        fixed: function(str, index) {
            var code = str.charCodeAt(index);
            return code >= 55296 && code <= 56319 ? fixCodePointAt(code, str.charCodeAt(++index)) : code
        }
    });
    var parseUnicode = function(str16) {
        if (parseInt(str16, 16) <= 65535) return [str16];
        var origin = parseInt(str16, 16) - 65536,
            originH = origin >> 10,
            originL = 1023 & origin;
        return originH = (55296 | originH).toString(16).toUpperCase(), originL = (56320 | originL).toString(16).toUpperCase(), [originH, originL]
    };
    defineIt("fromCodePoint", {
        format: checkTargetWithNumber,
        when: function() {
            return !!fromCodePoint
        },
        priority: function(code) {
            return fromCodePoint(code)
        },
        fixed: function(code) {
            if (limit.isNaN(code)) throw new RangeError("Invalid code point NaN");
            if (code < 0 || code > 1114111) throw new RangeError("Invalid code point " + code);
            return code = limit.map(parseUnicode(code.toString(16)), function(val) {
                return "\\u" + limit.padStart(val, 4, "0")
            }).join(""), new Function('return "' + code + '"')()
        }
    }), defineIt("repeat", {
        format: checkStringNumber,
        when: function(str) {
            return repeat && str.repeat === repeat
        },
        priority: function() {
            return Function.call.apply(repeat, arguments)
        },
        fixed: function(str, num) {
            return limit.from(new Array(num), function() {
                return str
            }).join("")
        }
    }), defineIt("padStart", {
        format: checkPadArgs,
        when: function(str) {
            return !1
        },
        priority: function() {
            return Function.call.apply(padStart, arguments)
        },
        fixed: function(str, leg, arg) {
            var max = str.length,
                min = void 0;
            return max >= leg ? str : (min = Math.ceil((leg - max) / arg.length), (limit.repeat(arg, min) + str).slice(-leg))
        }
    }), defineIt("padEnd", {
        format: checkPadArgs,
        when: function(str) {
            return !1
        },
        priority: function() {
            return Function.call.apply(padEnd, arguments)
        },
        fixed: function(str, leg, arg) {
            var max = str.length,
                min = void 0;
            return max >= leg ? str : (min = Math.ceil((leg - max) / arg.length), (str + limit.repeat(arg, min)).slice(0, leg))
        }
    }), defineIt("startsWith", {
        format: checkTargetWithString,
        when: function(str) {
            return startsWith && str.startsWith === startsWith
        },
        priority: function() {
            return Function.call.apply(startsWith, arguments)
        },
        fixed: function(str, arg, index) {
            var result = str.indexOf(arg, index);
            return result !== -1 && result === index
        }
    }), defineIt("endsWith", {
        format: checkTargetWithString,
        when: function(str) {
            return endsWith && str.endsWith === endsWith
        },
        priority: function() {
            return Function.call.apply(endsWith, arguments)
        },
        fixed: function(str, arg, index) {
            index = 3 === arguments.length ? ~~index : str.length;
            var leg = index - arg.length,
                result = str.lastIndexOf(arg, leg);
            return result !== -1 && str.lastIndexOf(arg, leg) === leg
        }
    }), defineIt("toNumber", {
        value: function(obj) {
            return null == obj ? 0 : limit.isNumber(obj) ? obj : limit.isDate(obj) || limit.isBoolean(obj) ? +obj : limit.isString(obj) && limit.isNumber(+obj) ? +obj : (typeWarn.toNumber(obj), NaN)
        }
    }), defineIt("random", {
        value: function(form, to) {
            form = ~~form, to = ~~to;
            var max = Math.max(form, to),
                min = Math.min(form, to);
            return Math.floor((max - min + 1) * Math.random() + min)
        }
    });
    var REG_THOUSAND_SEPARATOR = /(\d{1,3})(?=(\d{3})+$)/g,
        REG_THOUSAND_SEPARATOR_COMMA = /,/g;
    defineIt("thousandSeparator", {
        format: checkTargetWithNumber,
        fixed: function(num) {
            var med = arguments.length <= 1 || void 0 === arguments[1] ? 2 : arguments[1];
            return med = checkPositive(med), checkFiniteNum(num) ? (num = limit.toFixed(num, med), num = num.split("."), num[0] = num[0].replace(REG_THOUSAND_SEPARATOR, "$1,"), num.join(".")) : ""
        }
    }), defineIt("unThousandSeparator", {
        value: function(str) {
            return limit.toNumber(str.replace(REG_THOUSAND_SEPARATOR_COMMA, ""))
        }
    });
    var movePointRight = function(sign, leftStr, rightStr, scale) {
            return scale < rightStr.length ? sign + leftStr + rightStr.slice(0, scale) + "." + rightStr.slice(scale) : sign + leftStr + limit.padEnd(rightStr, scale, "0")
        },
        movePointLeft = function(sign, leftStr, rightStr, scale) {
            return leftStr.length > scale ? sign + leftStr.slice(0, -scale) + "." + leftStr.slice(-scale) + rightStr : sign + "0." + limit.padStart(leftStr, scale, "0") + rightStr
        },
        movePoint = function(num, scale) {
            if (num = limit.toNumber(num), !checkFiniteNum(num)) return num;
            if (num = limit.toString(num), scale = ~~scale, 0 === scale) return num;
            var leftStr = void 0,
                rightStr = void 0,
                sign = "";
            return num = num.split("."), leftStr = num[0], rightStr = num[1] || "", "-" === leftStr.charAt(0) && (sign = "-",
                leftStr = leftStr.slice(1)), scale < 0 ? movePointLeft(sign, leftStr, rightStr, -scale) : movePointRight(sign, leftStr, rightStr, scale)
        };
    defineIt("toFixed", {
        value: function(num, scale) {
            return scale = checkPositive(scale), movePoint(Math.round(movePoint(num, scale)), -scale)
        }
    });
    var getMaxScale = function() {
        for (var _len32 = arguments.length, args = Array(_len32), _key32 = 0; _key32 < _len32; _key32++) args[_key32] = arguments[_key32];
        return checkFiniteNum(args) ? Math.max.apply(Math, limit.map(args, function(val) {
            return (("" + val).split(".")[1] || "").length
        })) : null
    };
    defineIt("plus,+", {
        format: checkFlattenArgs,
        fixed: function() {
            for (var _len33 = arguments.length, args = Array(_len33), _key33 = 0; _key33 < _len33; _key33++) args[_key33] = arguments[_key33];
            var maxScale = getMaxScale(args);
            return limit.isNull(maxScale) ? NaN : limit.reduce(args, function(before, val) {
                return +movePoint(+movePoint(before, maxScale) + +movePoint(val, maxScale), -maxScale)
            })
        }
    }), defineIt("minus,-", {
        format: checkFlattenArgs,
        fixed: function() {
            for (var _len34 = arguments.length, args = Array(_len34), _key34 = 0; _key34 < _len34; _key34++) args[_key34] = arguments[_key34];
            var maxScale = getMaxScale(args);
            return limit.isNull(maxScale) ? NaN : limit.reduce(args, function(before, val) {
                return +movePoint(+movePoint(before, maxScale) - +movePoint(val, maxScale), -maxScale)
            })
        }
    });
    var getNeedNum = function(args, falg) {
        var tar = limit.toString(args[0]),
            arg = limit.toString(args[1]),
            medTar = (tar.split(".")[1] || "").length,
            medArg = (arg.split(".")[1] || "").length,
            num = falg ? +movePoint(+tar.replace(".", "") * +arg.replace(".", ""), -(medTar + medArg)) : +movePoint(+tar.replace(".", "") / +arg.replace(".", ""), medArg - medTar);
        return args.splice(0, 2, num), num
    };
    defineIt("multiply,*", {
        format: checkFlattenArgs,
        fixed: function() {
            for (var _len35 = arguments.length, args = Array(_len35), _key35 = 0; _key35 < _len35; _key35++) args[_key35] = arguments[_key35];
            if (!checkFiniteNum(args)) return NaN;
            var num = getNeedNum(args, !0);
            return args.length <= 1 ? num : limit["*"](args)
        }
    }), defineIt("except,/", {
        format: checkFlattenArgs,
        fixed: function() {
            for (var _len36 = arguments.length, args = Array(_len36), _key36 = 0; _key36 < _len36; _key36++) args[_key36] = arguments[_key36];
            if (!checkFiniteNum(args)) return NaN;
            var num = getNeedNum(args, !1);
            return args.length <= 1 ? num : limit["/"](args)
        }
    });
    var BRACKETS_REG = /\(([^()]*)\)/,
        MULTANDDIVISION_REG = /(-?\d+(?:\.\d+)?)(?:\s*)([\*\/])(?:\s*)(-?\d+(?:\.\d+)?)(?:\s*)/,
        EXPRESS_REG = /^(?:\s*)(-?\d+(?:\.\d+)?)(?:\s*)([\+\-])(?:\s*)(-?\d+(?:\.\d+)?)(?:\s*)/;
    defineIt("express,?", {
        value: function(exp) {
            return MULTANDDIVISION_REG.test(exp) ? limit.express(exp.replace(MULTANDDIVISION_REG, function(a, b, c, d) {
                return limit[c](+b, +d)
            })) : BRACKETS_REG.test(exp) ? limit.express(exp.replace(BRACKETS_REG, function(a, b, c, d) {
                return limit.express(b)
            })) : EXPRESS_REG.test(exp) ? limit.express(exp.replace(EXPRESS_REG, function(a, b, c, d) {
                return limit[c](+b, +d)
            })) : limit.toNumber(exp)
        }
    });
    var REG_EXP_DATA = /^(yyyy)(?:(.+)(MM))?(?:(.+)(dd))?(?:(.+)(HH))?(?:(.+)(mm))?(?:(.+)(ss))?(.+)?$/,
        FUN_DATAS = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"];
    return defineIt("formatDate", {
        value: function() {
            var timestamp = arguments.length <= 0 || void 0 === arguments[0] ? (new Date).getTime() : arguments[0],
                formatStr = arguments.length <= 1 || void 0 === arguments[1] ? "yyyy-MM-dd HH:mm:ss" : arguments[1];
            return timestamp = new Date(timestamp), formatStr = limit.toString(formatStr), limit.isNaN(+timestamp) || !REG_EXP_DATA.test(formatStr) ? "" : formatStr.replace(REG_EXP_DATA, function() {
                for (var _len37 = arguments.length, args = Array(_len37), _key37 = 0; _key37 < _len37; _key37++) args[_key37] = arguments[_key37];
                var arr = [];
                return limit.each(slice.call(args, 1, -2), function(val, key) {
                    var value = void 0;
                    val && (key % 2 === 0 ? (value = timestamp[FUN_DATAS[key / 2]](), "MM" === val && value++, "yyyy" !== val && (value = limit.padStart(value, 2, "0")), arr.push(value)) : arr.push(val))
                }), arr.join("")
            })
        }
    }), limit
});