! function(global, undefined) {
    function isType(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]"
        }
    }

    function cid() {
        return _cid++
    }

    function dirname(path) {
        return path.match(DIRNAME_RE)[0]
    }

    function realpath(path) {
        for (path = path.replace(DOT_RE, "/"); path.match(DOUBLE_DOT_RE);) path = path.replace(DOUBLE_DOT_RE, "/");
        return path
    }

    function normalize(path) {
        var last = path.length - 1,
            lastC = path.charAt(last);
        return "#" === lastC ? path.substring(0, last) : ".js" === path.substring(last - 2) || path.indexOf("?") > 0 || ".css" === path.substring(last - 3) || "/" === lastC ? path : path + ".js"
    }

    function parseAlias(id) {
        var alias = data.alias;
        return alias && isString(alias[id]) ? alias[id] : id
    }

    function parsePaths(id) {
        var m, paths = data.paths;
        return paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]]) && (id = paths[m[1]] + m[2]), id
    }

    function parseVars(id) {
        var vars = data.vars;
        return vars && id.indexOf("{") > -1 && (id = id.replace(VARS_RE, function(m, key) {
            return isString(vars[key]) ? vars[key] : m
        })), id
    }

    function parseMap(uri) {
        var map = data.map,
            ret = uri;
        if (map)
            for (var i = 0, len = map.length; i < len; i++) {
                var rule = map[i];
                if (ret = isFunction(rule) ? rule(uri) || uri : uri.replace(rule[0], rule[1]), ret !== uri) break
            }
        return ret
    }

    function addBase(id, refUri) {
        var ret, first = id.charAt(0);
        if (ABSOLUTE_RE.test(id)) ret = id;
        else if ("." === first) ret = realpath((refUri ? dirname(refUri) : data.cwd) + id);
        else if ("/" === first) {
            var m = data.cwd.match(ROOT_DIR_RE);
            ret = m ? m[0] + id.substring(1) : id
        } else ret = data.base + id;
        return ret
    }

    function id2Uri(id, refUri) {
        if (!id) return "";
        id = parseAlias(id), id = parsePaths(id), id = parseVars(id), id = normalize(id);
        var uri = addBase(id, refUri);
        return uri = parseMap(uri)
    }

    function getScriptAbsoluteSrc(node) {
        return node.hasAttribute ? node.src : node.getAttribute("src", 4)
    }

    function request(url, callback, charset) {
        var isCSS = IS_CSS_RE.test(url),
            node = doc.createElement(isCSS ? "link" : "script");
        if (charset) {
            var cs = isFunction(charset) ? charset(url) : charset;
            cs && (node.charset = cs)
        }
        addOnload(node, callback, isCSS), isCSS ? (node.rel = "stylesheet", node.href = url) : (node.async = !0, node.src = url), currentlyAddingScript = node, baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node), currentlyAddingScript = null
    }

    function addOnload(node, callback, isCSS) {
        var missingOnload = isCSS && (isOldWebKit || !("onload" in node));
        return missingOnload ? void setTimeout(function() {
            pollCss(node, callback)
        }, 1) : void(node.onload = node.onerror = node.onreadystatechange = function() {
            READY_STATE_RE.test(node.readyState) && (node.onload = node.onerror = node.onreadystatechange = null, isCSS || data.debug || head.removeChild(node), node = null, callback())
        })
    }

    function pollCss(node, callback) {
        var isLoaded, sheet = node.sheet;
        if (isOldWebKit) sheet && (isLoaded = !0);
        else if (sheet) try {
            sheet.cssRules && (isLoaded = !0)
        } catch (ex) {
            "NS_ERROR_DOM_SECURITY_ERR" === ex.name && (isLoaded = !0)
        }
        setTimeout(function() {
            isLoaded ? callback() : pollCss(node, callback)
        }, 20)
    }

    function getCurrentScript() {
        if (currentlyAddingScript) return currentlyAddingScript;
        if (interactiveScript && "interactive" === interactiveScript.readyState) return interactiveScript;
        for (var scripts = head.getElementsByTagName("script"), i = scripts.length - 1; i >= 0; i--) {
            var script = scripts[i];
            if ("interactive" === script.readyState) return interactiveScript = script
        }
    }

    function parseDependencies(code) {
        var ret = [];
        return code.replace(SLASH_RE, "").replace(REQUIRE_RE, function(m, m1, m2) {
            m2 && ret.push(m2)
        }), ret
    }

    function Module(uri, deps) {
        this.uri = uri, this.dependencies = deps || [], this.exports = null, this.status = 0, this._waitings = {}, this._remain = 0
    }
    if (!global.seajs) {
        var seajs = global.seajs = {
                version: "2.1.1"
            },
            data = seajs.data = {},
            isObject = isType("Object"),
            isString = isType("String"),
            isArray = Array.isArray || isType("Array"),
            isFunction = isType("Function"),
            _cid = 0,
            events = data.events = {};
        seajs.on = function(name, callback) {
            var list = events[name] || (events[name] = []);
            return list.push(callback), seajs
        }, seajs.off = function(name, callback) {
            if (!name && !callback) return events = data.events = {}, seajs;
            var list = events[name];
            if (list)
                if (callback)
                    for (var i = list.length - 1; i >= 0; i--) list[i] === callback && list.splice(i, 1);
                else delete events[name];
            return seajs
        };
        var currentlyAddingScript, interactiveScript, anonymousMeta, emit = seajs.emit = function(name, data) {
                var fn, list = events[name];
                if (list)
                    for (list = list.slice(); fn = list.shift();) fn(data);
                return seajs
            },
            DIRNAME_RE = /[^?#]*\//,
            DOT_RE = /\/\.\//g,
            DOUBLE_DOT_RE = /\/[^\/]+\/\.\.\//,
            PATHS_RE = /^([^\/:]+)(\/.+)$/,
            VARS_RE = /{([^{]+)}/g,
            ABSOLUTE_RE = /^\/\/.|:\//,
            ROOT_DIR_RE = /^.*?\/\/.*?\//,
            doc = document,
            loc = location,
            cwd = dirname(loc.href),
            scripts = doc.getElementsByTagName("script"),
            loaderScript = doc.getElementById("seajsnode") || scripts[scripts.length - 1],
            loaderDir = dirname(getScriptAbsoluteSrc(loaderScript) || cwd),
            head = doc.getElementsByTagName("head")[0] || doc.documentElement,
            baseElement = head.getElementsByTagName("base")[0],
            IS_CSS_RE = /\.css(?:\?|$)/i,
            READY_STATE_RE = /^(?:loaded|complete|undefined)$/,
            isOldWebKit = 1 * navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536,
            REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
            SLASH_RE = /\\\\/g,
            cachedMods = seajs.cache = {},
            fetchingList = {},
            fetchedList = {},
            callbackList = {},
            STATUS = Module.STATUS = {
                FETCHING: 1,
                SAVED: 2,
                LOADING: 3,
                LOADED: 4,
                EXECUTING: 5,
                EXECUTED: 6
            };
        Module.prototype.resolve = function() {
            for (var mod = this, ids = mod.dependencies, uris = [], i = 0, len = ids.length; i < len; i++) uris[i] = Module.resolve(ids[i], mod.uri);
            return uris
        }, Module.prototype.load = function() {
            var mod = this;
            if (!(mod.status >= STATUS.LOADING)) {
                mod.status = STATUS.LOADING;
                var uris = mod.resolve();
                emit("load", uris);
                for (var m, len = mod._remain = uris.length, i = 0; i < len; i++) m = Module.get(uris[i]), m.status < STATUS.LOADED ? m._waitings[mod.uri] = (m._waitings[mod.uri] || 0) + 1 : mod._remain--;
                if (0 === mod._remain) return void mod.onload();
                var requestCache = {};
                for (i = 0; i < len; i++) m = cachedMods[uris[i]], m.status < STATUS.FETCHING ? m.fetch(requestCache) : m.status === STATUS.SAVED && m.load();
                for (var requestUri in requestCache) requestCache.hasOwnProperty(requestUri) && requestCache[requestUri]()
            }
        }, Module.prototype.onload = function() {
            var mod = this;
            mod.status = STATUS.LOADED, mod.callback && mod.callback();
            var uri, m, waitings = mod._waitings;
            for (uri in waitings) waitings.hasOwnProperty(uri) && (m = cachedMods[uri], m._remain -= waitings[uri], 0 === m._remain && m.onload());
            delete mod._waitings, delete mod._remain
        }, Module.prototype.fetch = function(requestCache) {
            function sendRequest() {
                request(emitData.requestUri, emitData.onRequest, emitData.charset)
            }

            function onRequest() {
                delete fetchingList[requestUri], fetchedList[requestUri] = !0, anonymousMeta && (Module.save(uri, anonymousMeta), anonymousMeta = null);
                var m, mods = callbackList[requestUri];
                for (delete callbackList[requestUri]; m = mods.shift();) m.load()
            }
            var mod = this,
                uri = mod.uri;
            mod.status = STATUS.FETCHING;
            var emitData = {
                uri: uri
            };
            emit("fetch", emitData);
            var requestUri = emitData.requestUri || uri;
            return !requestUri || fetchedList[requestUri] ? void mod.load() : fetchingList[requestUri] ? void callbackList[requestUri].push(mod) : (fetchingList[requestUri] = !0, callbackList[requestUri] = [mod], emit("request", emitData = {
                uri: uri,
                requestUri: requestUri,
                onRequest: onRequest,
                charset: data.charset
            }), void(emitData.requested || (requestCache ? requestCache[emitData.requestUri] = sendRequest : sendRequest())))
        }, Module.prototype.exec = function() {
            function require(id) {
                return Module.get(require.resolve(id)).exec()
            }
            var mod = this;
            if (mod.status >= STATUS.EXECUTING) return mod.exports;
            mod.status = STATUS.EXECUTING;
            var uri = mod.uri;
            require.resolve = function(id) {
                return Module.resolve(id, uri)
            }, require.async = function(ids, callback) {
                return Module.use(ids, callback, uri + "_async_" + cid()), require
            };
            var factory = mod.factory,
                exports = isFunction(factory) ? factory(require, mod.exports = {}, mod) : factory;
            return exports === undefined && (exports = mod.exports), null !== exports || IS_CSS_RE.test(uri) || emit("error", mod), delete mod.factory, mod.exports = exports, mod.status = STATUS.EXECUTED, emit("exec", mod), exports
        }, Module.resolve = function(id, refUri) {
            var emitData = {
                id: id,
                refUri: refUri
            };
            return emit("resolve", emitData), emitData.uri || id2Uri(emitData.id, refUri)
        }, Module.define = function(id, deps, factory) {
            var argsLen = arguments.length;
            1 === argsLen ? (factory = id, id = undefined) : 2 === argsLen && (factory = deps, isArray(id) ? (deps = id, id = undefined) : deps = undefined), !isArray(deps) && isFunction(factory) && (deps = parseDependencies(factory.toString()));
            var meta = {
                id: id,
                uri: Module.resolve(id),
                deps: deps,
                factory: factory
            };
            if (!meta.uri && doc.attachEvent) {
                var script = getCurrentScript();
                script && (meta.uri = script.src)
            }
            emit("define", meta), meta.uri ? Module.save(meta.uri, meta) : anonymousMeta = meta
        }, Module.save = function(uri, meta) {
            var mod = Module.get(uri);
            mod.status < STATUS.SAVED && (mod.id = meta.id || uri, mod.dependencies = meta.deps || [], mod.factory = meta.factory, mod.status = STATUS.SAVED)
        }, Module.get = function(uri, deps) {
            return cachedMods[uri] || (cachedMods[uri] = new Module(uri, deps))
        }, Module.use = function(ids, callback, uri) {
            var mod = Module.get(uri, isArray(ids) ? ids : [ids]);
            mod.callback = function() {
                for (var exports = [], uris = mod.resolve(), i = 0, len = uris.length; i < len; i++) exports[i] = cachedMods[uris[i]].exec();
                callback && callback.apply(global, exports), delete mod.callback
            }, mod.load()
        }, Module.preload = function(callback) {
            var preloadMods = data.preload,
                len = preloadMods.length;
            len ? Module.use(preloadMods, function() {
                preloadMods.splice(0, len), Module.preload(callback)
            }, data.cwd + "_preload_" + cid()) : callback()
        }, seajs.use = function(ids, callback) {
            return Module.preload(function() {
                Module.use(ids, callback, data.cwd + "_use_" + cid())
            }), seajs
        }, Module.define.cmd = {}, global.define = Module.define, seajs.Module = Module, data.fetchedList = fetchedList, data.cid = cid, seajs.resolve = id2Uri, seajs.require = function(id) {
            return (cachedMods[Module.resolve(id)] || {}).exports
        };
        var BASE_RE = /^(.+?\/)(\?\?)?(seajs\/)+/;
        data.base = (loaderDir.match(BASE_RE) || ["", loaderDir])[1], data.dir = loaderDir, data.cwd = cwd, data.charset = "utf-8", data.preload = function() {
            var plugins = [],
                str = loc.search.replace(/(seajs-\w+)(&|$)/g, "$1=1$2");
            return str += " " + doc.cookie, str.replace(/(seajs-\w+)=1/g, function(m, name) {
                plugins.push(name)
            }), plugins
        }(), seajs.config = function(configData) {
            for (var key in configData) {
                var curr = configData[key],
                    prev = data[key];
                if (prev && isObject(prev))
                    for (var k in curr) prev[k] = curr[k];
                else isArray(prev) ? curr = prev.concat(curr) : "base" === key && ("/" === curr.slice(-1) || (curr += "/"), curr = addBase(curr)), data[key] = curr
            }
            return emit("config", configData), seajs
        }
    }
}(this),
function() {
    var loaderPath = seajs.pluginSDK ? seajs.pluginSDK.util.loaderDir : seajs.data.base,
        lastIndex = loaderPath.lastIndexOf("/");
    lastIndex == loaderPath.length - 1 && (loaderPath = loaderPath.substr(0, lastIndex)), seajs.config({
        charset: "utf-8"
    }), seajs.config({
        paths: {
            bui: loaderPath
        }
    });
    var BUI = window.BUI = window.BUI || {},
        scripts = document.getElementsByTagName("script"),
        loaderScript = scripts[scripts.length - 1];
    BUI.loaderScript = loaderScript, "true" == loaderScript.getAttribute("data-debug") ? BUI.debug = !0 : BUI.debug = !1, BUI.use = seajs.use, BUI.config = function(cfg) {
        cfg.alias && (cfg.paths = cfg.alias, delete cfg.alias), seajs.config(cfg)
    }, BUI.setDebug = function(debug) {
        if (BUI.debug = debug, debug) {
            var map = seajs.data.map,
                index = -1;
            if (map) {
                for (var i = 0; i < map.length; i++) {
                    var item = map[i];
                    if (item[0].toString() == /.js$/.toString() && "-min.js" == item[1]) {
                        index = i;
                        break
                    }
                }
                index != -1 && map.splice(index, 1)
            }
        } else seajs.config({})
    }, BUI.setDebug(BUI.debug)
}(),
function() {
    var requires = ["bui/util", "bui/ua", "bui/json", "bui/date", "bui/array", "bui/keycode", "bui/observable", "bui/base", "bui/component"];
    window.KISSY && !window.KISSY.Node && requires.unshift("bui/adapter"), define("src/hephaistos/js/bui-debug", [], function(require) {
        window.KISSY && !window.KISSY.Node && require("bui/adapter");
        var BUI = require("bui/util");
        return BUI.mix(BUI, {
            UA: require("bui/ua"),
            JSON: require("bui/json"),
            Date: require("bui/date"),
            Array: require("bui/array"),
            KeyCode: require("bui/keycode"),
            Observable: require("bui/observable"),
            Base: require("bui/base"),
            Component: require("bui/component")
        }), BUI
    })
}(), window.BUI = window.BUI || {}, !BUI.use && window.seajs && (BUI.use = seajs.use, BUI.config = seajs.config), define("src/hephaistos/js/bui-debug", [], function(require) {
        function mixAttrs(to, from) {
            for (var c in from) from.hasOwnProperty(c) && (to[c] = to[c] || {}, mixAttr(to[c], from[c]))
        }

        function mixAttr(attr, attrConfig) {
            for (var p in attrConfig) attrConfig.hasOwnProperty(p) && ("value" == p ? BUI.isObject(attrConfig[p]) ? (attr[p] = attr[p] || {}, BUI.mix(attr[p], attrConfig[p])) : BUI.isArray(attrConfig[p]) ? (attr[p] = attr[p] || [], attr[p] = attr[p].concat(attrConfig[p])) : attr[p] = attrConfig[p] : attr[p] = attrConfig[p])
        }! function($) {
            $.fn && ($.fn.on = $.fn.on || $.fn.bind, $.fn.off = $.fn.off || $.fn.unbind)
        }(jQuery);
        var win = window,
            doc = document,
            objectPrototype = Object.prototype,
            toString = objectPrototype.toString,
            BODY = "body",
            DOC_ELEMENT = "documentElement",
            SCROLL = "scroll",
            SCROLL_WIDTH = SCROLL + "Width",
            SCROLL_HEIGHT = SCROLL + "Height",
            ATTRS = "ATTRS",
            PARSER = "PARSER",
            GUID_DEFAULT = "guid";
        $.extend(BUI, {
            version: 1,
            subVersion: 79,
            isFunction: function(fn) {
                return "function" == typeof fn
            },
            isArray: "isArray" in Array ? Array.isArray : function(value) {
                return "[object Array]" === toString.call(value)
            },
            isDate: function(value) {
                return "[object Date]" === toString.call(value)
            },
            isObject: "[object Object]" === toString.call(null) ? function(value) {
                return null !== value && void 0 !== value && "[object Object]" === toString.call(value) && void 0 === value.ownerDocument
            } : function(value) {
                return "[object Object]" === toString.call(value)
            },
            isNumeric: function(value) {
                return !isNaN(parseFloat(value)) && isFinite(value)
            },
            augment: function(r, s1) {
                if (!BUI.isFunction(r)) return r;
                for (var i = 1; i < arguments.length; i++) BUI.mix(r.prototype, arguments[i].prototype || arguments[i]);
                return r
            },
            cloneObject: function(obj) {
                var result = BUI.isArray(obj) ? [] : {};
                return BUI.mix(!0, result, obj)
            },
            error: function(msg) {
                if (BUI.debug) throw msg
            },
            extend: function(subclass, superclass, overrides, staticOverrides) {
                BUI.isFunction(superclass) || (overrides = superclass, superclass = subclass, subclass = function() {});
                var create = Object.create ? function(proto, c) {
                        return Object.create(proto, {
                            constructor: {
                                value: c
                            }
                        })
                    } : function(proto, c) {
                        function F() {}
                        F.prototype = proto;
                        var o = new F;
                        return o.constructor = c, o
                    },
                    superObj = create(superclass.prototype, subclass);
                return subclass.prototype = BUI.mix(superObj, subclass.prototype), subclass.superclass = create(superclass.prototype, superclass), BUI.mix(superObj, overrides), BUI.mix(subclass, staticOverrides), subclass
            },
            guid: function() {
                var map = {};
                return function(prefix) {
                    return prefix = prefix || BUI.prefix + GUID_DEFAULT, map[prefix] ? map[prefix] += 1 : map[prefix] = 1, prefix + map[prefix]
                }
            }(),
            isString: function(value) {
                return "string" == typeof value
            },
            isNumber: function(value) {
                return "number" == typeof value
            },
            isBoolean: function(value) {
                return "boolean" == typeof value
            },
            log: function(obj) {
                BUI.debug && win.console && win.console.log && win.console.log(obj)
            },
            merge: function() {
                var args = $.makeArray(arguments),
                    first = args[0];
                return BUI.isBoolean(first) ? (args.shift(), args.unshift({}), args.unshift(first)) : args.unshift({}), BUI.mix.apply(null, args)
            },
            mix: function() {
                return $.extend.apply(null, arguments)
            },
            app: function(name) {
                return window[name] || (window[name] = {
                    namespace: function(nsName) {
                        return BUI.namespace(nsName, window[name])
                    }
                }), window[name]
            },
            mixAttrs: mixAttrs,
            mixAttr: mixAttr,
            mixin: function(c, mixins, attrs) {
                attrs = attrs || [ATTRS, PARSER];
                var extensions = mixins;
                if (extensions) {
                    c.mixins = extensions;
                    var desc = {},
                        constructors = extensions.concat(c);
                    BUI.each(constructors, function(ext) {
                        ext && BUI.each(attrs, function(K) {
                            ext[K] && (desc[K] = desc[K] || {}, "ATTRS" == K ? mixAttrs(desc[K], ext[K]) : BUI.mix(desc[K], ext[K]))
                        })
                    }), BUI.each(desc, function(v, k) {
                        c[k] = v
                    });
                    var prototype = {};
                    BUI.each(constructors, function(ext) {
                        if (ext) {
                            var proto = ext.prototype;
                            for (var p in proto) proto.hasOwnProperty(p) && (prototype[p] = proto[p])
                        }
                    }), BUI.each(prototype, function(v, k) {
                        c.prototype[k] = v
                    })
                }
                return c
            },
            namespace: function(name, baseNS) {
                if (baseNS = baseNS || BUI, !name) return baseNS;
                for (var list = name.split("."), curNS = baseNS, i = 0; i < list.length; i++) {
                    var nsName = list[i];
                    curNS[nsName] || (curNS[nsName] = {}), curNS = curNS[nsName]
                }
                return curNS
            },
            prefix: "bui-",
            substitute: function(str, o, regexp) {
                return BUI.isString(str) && (BUI.isObject(o) || BUI.isArray(o)) ? str.replace(regexp || /\\?\{([^{}]+)\}/g, function(match, name) {
                    return "\\" === match.charAt(0) ? match.slice(1) : void 0 === o[name] ? "" : o[name]
                }) : str
            },
            ucfirst: function(s) {
                return s += "", s.charAt(0).toUpperCase() + s.substring(1)
            },
            isInView: function(offset) {
                var left = offset.left,
                    top = offset.top,
                    viewWidth = BUI.viewportWidth(),
                    wiewHeight = BUI.viewportHeight(),
                    scrollTop = BUI.scrollTop(),
                    scrollLeft = BUI.scrollLeft();
                return !(left < scrollLeft || left > scrollLeft + viewWidth) && !(top < scrollTop || top > scrollTop + wiewHeight)
            },
            isInVerticalView: function(top) {
                var wiewHeight = BUI.viewportHeight(),
                    scrollTop = BUI.scrollTop();
                return !(top < scrollTop || top > scrollTop + wiewHeight)
            },
            isInHorizontalView: function(left) {
                var viewWidth = BUI.viewportWidth(),
                    scrollLeft = BUI.scrollLeft();
                return !(left < scrollLeft || left > scrollLeft + viewWidth)
            },
            viewportWidth: function() {
                return $(window).width()
            },
            viewportHeight: function() {
                return $(window).height()
            },
            scrollLeft: function() {
                return $(window).scrollLeft()
            },
            scrollTop: function() {
                return $(window).scrollTop()
            },
            docWidth: function() {
                return Math.max(this.viewportWidth(), doc[DOC_ELEMENT][SCROLL_WIDTH], doc[BODY][SCROLL_WIDTH])
            },
            docHeight: function() {
                return Math.max(this.viewportHeight(), doc[DOC_ELEMENT][SCROLL_HEIGHT], doc[BODY][SCROLL_HEIGHT])
            },
            each: function(elements, func) {
                elements && $.each(elements, function(k, v) {
                    return func(v, k)
                })
            },
            wrapBehavior: function(self, action) {
                return self["__bui_wrap_" + action] = function(e) {
                    self.get("disabled") || self[action](e)
                }
            },
            getWrapBehavior: function(self, action) {
                return self["__bui_wrap_" + action]
            },
            getControl: function(id) {
                return BUI.Component.Manager.getComponent(id)
            }
        });
        var formHelper = BUI.FormHelper = {
            serializeToObject: function(form) {
                var array = $(form).serializeArray(),
                    result = {};
                return BUI.each(array, function(item) {
                    var name = item.name;
                    result[name] ? (BUI.isArray(result[name]) || (result[name] = [result[name]]), result[name].push(item.value)) : result[name] = item.value
                }), result
            },
            setFields: function(form, obj) {
                for (var name in obj) obj.hasOwnProperty(name) && BUI.FormHelper.setField(form, name, obj[name])
            },
            clear: function(form) {
                var elements = $.makeArray(form.elements);
                BUI.each(elements, function(element) {
                    "checkbox" === element.type || "radio" === element.type ? $(element).attr("checked", !1) : $(element).val(""), $(element).change()
                })
            },
            setField: function(form, fieldName, value) {
                var fields = form.elements[fieldName];
                fields && fields.type ? formHelper._setFieldValue(fields, value) : (BUI.isArray(fields) || fields && fields.length) && BUI.each(fields, function(field) {
                    formHelper._setFieldValue(field, value)
                })
            },
            _setFieldValue: function(field, value) {
                "checkbox" === field.type ? field.value == "" + value || BUI.isArray(value) && BUI.Array.indexOf(field.value, value) !== -1 ? $(field).attr("checked", !0) : $(field).attr("checked", !1) : "radio" === field.type ? field.value == "" + value ? $(field).attr("checked", !0) : $(field).attr("checked", !1) : $(field).val(value)
            },
            getField: function(form, fieldName) {
                return BUI.FormHelper.serializeToObject(form)[fieldName]
            }
        };
        return BUI
    }), define("src/hephaistos/js/bui-debug", [], function(r) {
        var BUI = r("bui/util");
        return BUI.Array = {
            peek: function(array) {
                return array[array.length - 1]
            },
            indexOf: function(value, array, opt_fromIndex) {
                for (var fromIndex = null == opt_fromIndex ? 0 : opt_fromIndex < 0 ? Math.max(0, array.length + opt_fromIndex) : opt_fromIndex, i = fromIndex; i < array.length; i++)
                    if (i in array && array[i] === value) return i;
                return -1
            },
            contains: function(value, array) {
                return BUI.Array.indexOf(value, array) >= 0
            },
            each: BUI.each,
            equals: function(a1, a2) {
                if (a1 == a2) return !0;
                if (!a1 || !a2) return !1;
                if (a1.length != a2.length) return !1;
                for (var rst = !0, i = 0; i < a1.length; i++)
                    if (a1[i] !== a2[i]) {
                        rst = !1;
                        break
                    }
                return rst
            },
            filter: function(array, func) {
                var result = [];
                return BUI.Array.each(array, function(value, index) {
                    func(value, index) && result.push(value)
                }), result
            },
            map: function(array, func) {
                var result = [];
                return BUI.Array.each(array, function(value, index) {
                    result.push(func(value, index))
                }), result
            },
            find: function(array, func) {
                var i = BUI.Array.findIndex(array, func);
                return i < 0 ? null : array[i]
            },
            findIndex: function(array, func) {
                var result = -1;
                return BUI.Array.each(array, function(value, index) {
                    if (func(value, index)) return result = index, !1
                }), result
            },
            isEmpty: function(array) {
                return 0 == array.length
            },
            add: function(array, value) {
                array.push(value)
            },
            addAt: function(array, value, index) {
                BUI.Array.splice(array, index, 0, value)
            },
            empty: function(array) {
                if (!(array instanceof Array))
                    for (var i = array.length - 1; i >= 0; i--) delete array[i];
                array.length = 0
            },
            remove: function(array, value) {
                var rv, i = BUI.Array.indexOf(value, array);
                return (rv = i >= 0) && BUI.Array.removeAt(array, i), rv
            },
            removeAt: function(array, index) {
                return 1 == BUI.Array.splice(array, index, 1).length
            },
            slice: function(arr, start, opt_end) {
                return arguments.length <= 2 ? Array.prototype.slice.call(arr, start) : Array.prototype.slice.call(arr, start, opt_end)
            },
            splice: function(arr, index, howMany, var_args) {
                return Array.prototype.splice.apply(arr, BUI.Array.slice(arguments, 1))
            }
        }, BUI.Array
    }), define("src/hephaistos/js/bui-debug", [], function(r) {
        function getCallbacks() {
            return new Callbacks
        }
        var BUI = r("bui/util"),
            Callbacks = function() {
                this._init()
            };
        BUI.augment(Callbacks, {
            _functions: null,
            _init: function() {
                var _self = this;
                _self._functions = []
            },
            add: function(fn) {
                this._functions.push(fn)
            },
            remove: function(fn) {
                var functions = this._functions;
                index = BUI.Array.indexOf(fn, functions), index >= 0 && functions.splice(index, 1)
            },
            empty: function() {
                var length = this._functions.length;
                this._functions.splice(0, length)
            },
            pause: function() {
                this._paused = !0
            },
            resume: function() {
                this._paused = !1
            },
            fireWith: function(scope, args) {
                var rst, _self = this;
                if (!this._paused) return BUI.each(_self._functions, function(fn) {
                    if (rst = fn.apply(scope, args), rst === !1) return !1
                }), rst
            }
        });
        var Observable = function(config) {
            this._events = [], this._eventMap = {}, this._bubblesEvents = [], this._initEvents(config)
        };
        return BUI.augment(Observable, {
            _events: [],
            _eventMap: {},
            _bubblesEvents: [],
            _bubbleTarget: null,
            _getCallbacks: function(eventType) {
                var _self = this,
                    eventMap = _self._eventMap;
                return eventMap[eventType]
            },
            _initEvents: function(config) {
                var _self = this,
                    listeners = null;
                if (config && (listeners = config.listeners || {}, config.handler && (listeners.click = config.handler), listeners))
                    for (var name in listeners) listeners.hasOwnProperty(name) && _self.on(name, listeners[name])
            },
            _isBubbles: function(eventType) {
                return BUI.Array.indexOf(eventType, this._bubblesEvents) >= 0
            },
            addTarget: function(target) {
                this._bubbleTarget = target
            },
            addEvents: function(events) {
                function addEvent(eventType) {
                    BUI.Array.indexOf(eventType, existEvents) === -1 && (eventMap[eventType] = getCallbacks(), existEvents.push(eventType))
                }
                var _self = this,
                    existEvents = _self._events,
                    eventMap = _self._eventMap;
                BUI.isArray(events) ? $.each(events, function(index, eventType) {
                    addEvent(eventType)
                }) : addEvent(events)
            },
            clearListeners: function() {
                var _self = this,
                    eventMap = _self._eventMap;
                for (var name in eventMap) eventMap.hasOwnProperty(name) && eventMap[name].empty()
            },
            fire: function(eventType, eventData) {
                var result, _self = this,
                    callbacks = _self._getCallbacks(eventType),
                    args = $.makeArray(arguments);
                if (eventData || (eventData = {}, args.push(eventData)), eventData.target || (eventData.target = _self), callbacks && (result = callbacks.fireWith(_self, Array.prototype.slice.call(args, 1))), _self._isBubbles(eventType)) {
                    var bubbleTarget = _self._bubbleTarget;
                    bubbleTarget && bubbleTarget.fire && bubbleTarget.fire(eventType, eventData)
                }
                return result
            },
            pauseEvent: function(eventType) {
                var _self = this,
                    callbacks = _self._getCallbacks(eventType);
                callbacks && callbacks.pause()
            },
            resumeEvent: function(eventType) {
                var _self = this,
                    callbacks = _self._getCallbacks(eventType);
                callbacks && callbacks.resume()
            },
            on: function(eventType, fn) {
                var arr = eventType.split(" "),
                    _self = this,
                    callbacks = null;
                return arr.length > 1 ? BUI.each(arr, function(name) {
                    _self.on(name, fn)
                }) : (callbacks = _self._getCallbacks(eventType), callbacks ? callbacks.add(fn) : (_self.addEvents(eventType), _self.on(eventType, fn))), _self
            },
            off: function(eventType, fn) {
                if (!eventType && !fn) return this.clearListeners(), this;
                var _self = this,
                    callbacks = _self._getCallbacks(eventType);
                return callbacks && callbacks.remove(fn), _self
            },
            publish: function(eventType, cfg) {
                var _self = this,
                    bubblesEvents = _self._bubblesEvents;
                if (cfg.bubbles) BUI.Array.indexOf(eventType, bubblesEvents) === -1 && bubblesEvents.push(eventType);
                else {
                    var index = BUI.Array.indexOf(eventType, bubblesEvents);
                    index !== -1 && bubblesEvents.splice(index, 1)
                }
            }
        }), Observable
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function numberify(s) {
            var c = 0;
            return parseFloat(s.replace(/\./g, function() {
                return 0 === c++ ? "." : ""
            }))
        }

        function uaMatch(s) {
            s = s.toLowerCase();
            var r = /(chrome)[ \/]([\w.]+)/.exec(s) || /(webkit)[ \/]([\w.]+)/.exec(s) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(s) || /(msie) ([\w.]+)/.exec(s) || s.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(s) || [],
                a = {
                    browser: r[1] || "",
                    version: r[2] || "0"
                },
                b = {};
            return a.browser && (b[a.browser] = !0, b.version = a.version), b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0), b
        }
        var UA = $.UA || function() {
            var browser = $.browser || uaMatch(navigator.userAgent),
                versionNumber = numberify(browser.version),
                ua = {
                    ie: browser.msie && versionNumber,
                    webkit: browser.webkit && versionNumber,
                    opera: browser.opera && versionNumber,
                    mozilla: browser.mozilla && versionNumber
                };
            return ua
        }();
        return UA
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function f(n) {
            return n < 10 ? "0" + n : n
        }

        function quote(string) {
            return escapable.lastIndex = 0, escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return "string" == typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + string + '"'
        }

        function str(key, holder) {
            var i, k, v, length, partial, mind = gap,
                value = holder[key];
            switch (value && "object" == typeof value && "function" == typeof value.toJSON && (value = value.toJSON(key)), "function" == typeof rep && (value = rep.call(holder, key, value)), typeof value) {
                case "string":
                    return quote(value);
                case "number":
                    return isFinite(value) ? String(value) : "null";
                case "boolean":
                case "null":
                    return String(value);
                case "object":
                    if (!value) return "null";
                    if (gap += indent, partial = [], "[object Array]" === Object.prototype.toString.apply(value)) {
                        for (length = value.length, i = 0; i < length; i += 1) partial[i] = str(i, value) || "null";
                        return v = 0 === partial.length ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]", gap = mind, v
                    }
                    if (rep && "object" == typeof rep)
                        for (length = rep.length, i = 0; i < length; i += 1) k = rep[i], "string" == typeof k && (v = str(k, value), v && partial.push(quote(k) + (gap ? ": " : ":") + v));
                    else
                        for (k in value) Object.hasOwnProperty.call(value, k) && (v = str(k, value), v && partial.push(quote(k) + (gap ? ": " : ":") + v));
                    return v = 0 === partial.length ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}", gap = mind, v
            }
        }

        function looseParse(data) {
            try {
                return new Function("return " + data + ";")()
            } catch (e) {
                throw "Json parse error!"
            }
        }
        var win = window,
            UA = require("bui/ua"),
            JSON = win.JSON;
        (!JSON || UA.ie < 9) && (JSON = win.JSON = {}), "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        });
        var gap, indent, rep, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            };
        "function" != typeof JSON.stringify && (JSON.stringify = function(value, replacer, space) {
            var i;
            if (gap = "", indent = "", "number" == typeof space)
                for (i = 0; i < space; i += 1) indent += " ";
            else "string" == typeof space && (indent = space);
            if (rep = replacer, replacer && "function" != typeof replacer && ("object" != typeof replacer || "number" != typeof replacer.length)) throw new Error("JSON.stringify");
            return str("", {
                "": value
            })
        });
        var JSON = {
            parse: $.parseJSON,
            looseParse: looseParse,
            stringify: JSON.stringify
        };
        return JSON
    }), define("src/hephaistos/js/bui-debug", [], function() {
        var keyCode = {
            BACKSPACE: 8,
            TAB: 9,
            NUM_CENTER: 12,
            ENTER: 13,
            RETURN: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAUSE: 19,
            CAPS_LOCK: 20,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            PRINT_SCREEN: 44,
            INSERT: 45,
            DELETE: 46,
            ZERO: 48,
            ONE: 49,
            TWO: 50,
            THREE: 51,
            FOUR: 52,
            FIVE: 53,
            SIX: 54,
            SEVEN: 55,
            EIGHT: 56,
            NINE: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            CONTEXT_MENU: 93,
            NUM_ZERO: 96,
            NUM_ONE: 97,
            NUM_TWO: 98,
            NUM_THREE: 99,
            NUM_FOUR: 100,
            NUM_FIVE: 101,
            NUM_SIX: 102,
            NUM_SEVEN: 103,
            NUM_EIGHT: 104,
            NUM_NINE: 105,
            NUM_MULTIPLY: 106,
            NUM_PLUS: 107,
            NUM_MINUS: 109,
            NUM_PERIOD: 110,
            NUM_DIVISION: 111,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123
        };
        return keyCode
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function dateParse(val, format) {
            if (val instanceof Date) return val;
            if ("undefined" == typeof format || null == format || "" == format) {
                for (var checkList = new Array("y-m-d", "yyyy-mm-dd", "yyyy-mm-dd HH:MM:ss", "H:M:s"), i = 0; i < checkList.length; i++) {
                    var d = dateParse(val, checkList[i]);
                    if (null != d) return d
                }
                return null
            }
            val += "";
            var x, y, i_val = 0,
                i_format = 0,
                c = "",
                token = "",
                now = new Date,
                year = now.getYear(),
                month = now.getMonth() + 1,
                date = 1,
                hh = 0,
                mm = 0,
                ss = 0;
            for (this.isInteger = function(val) {
                    return /^\d*$/.test(val)
                }, this.getInt = function(str, i, minlength, maxlength) {
                    for (var x = maxlength; x >= minlength; x--) {
                        var token = str.substring(i, i + x);
                        if (token.length < minlength) return null;
                        if (this.isInteger(token)) return token
                    }
                    return null
                }; i_format < format.length;) {
                for (c = format.charAt(i_format), token = ""; format.charAt(i_format) == c && i_format < format.length;) token += format.charAt(i_format++);
                if ("yyyy" == token || "yy" == token || "y" == token) {
                    if ("yyyy" == token && (x = 4, y = 4), "yy" == token && (x = 2, y = 2), "y" == token && (x = 2, y = 4), year = this.getInt(val, i_val, x, y), null == year) return null;
                    i_val += year.length, 2 == year.length && (year = year > 70 ? 1900 + (year - 0) : 2e3 + (year - 0))
                } else if ("mm" == token || "m" == token) {
                    if (month = this.getInt(val, i_val, token.length, 2), null == month || month < 1 || month > 12) return null;
                    i_val += month.length
                } else if ("dd" == token || "d" == token) {
                    if (date = this.getInt(val, i_val, token.length, 2), null == date || date < 1 || date > 31) return null;
                    i_val += date.length
                } else if ("hh" == token || "h" == token) {
                    if (hh = this.getInt(val, i_val, token.length, 2), null == hh || hh < 1 || hh > 12) return null;
                    i_val += hh.length
                } else if ("HH" == token || "H" == token) {
                    if (hh = this.getInt(val, i_val, token.length, 2), null == hh || hh < 0 || hh > 23) return null;
                    i_val += hh.length
                } else if ("MM" == token || "M" == token) {
                    if (mm = this.getInt(val, i_val, token.length, 2), null == mm || mm < 0 || mm > 59) return null;
                    i_val += mm.length
                } else if ("ss" == token || "s" == token) {
                    if (ss = this.getInt(val, i_val, token.length, 2), null == ss || ss < 0 || ss > 59) return null;
                    i_val += ss.length
                } else {
                    if (val.substring(i_val, i_val + token.length) != token) return null;
                    i_val += token.length
                }
            }
            if (i_val != val.length) return null;
            if (2 == month)
                if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                    if (date > 29) return null
                } else if (date > 28) return null;
            return (4 == month || 6 == month || 9 == month || 11 == month) && date > 30 ? null : new Date(year, month - 1, date, hh, mm, ss)
        }

        function DateAdd(strInterval, NumDay, dtDate) {
            var dtTmp = new Date(dtDate);
            switch (isNaN(dtTmp) && (dtTmp = new Date), NumDay = parseInt(NumDay, 10), strInterval) {
                case "s":
                    dtTmp = new Date(dtTmp.getTime() + 1e3 * NumDay);
                    break;
                case "n":
                    dtTmp = new Date(dtTmp.getTime() + 6e4 * NumDay);
                    break;
                case "h":
                    dtTmp = new Date(dtTmp.getTime() + 36e5 * NumDay);
                    break;
                case "d":
                    dtTmp = new Date(dtTmp.getTime() + 864e5 * NumDay);
                    break;
                case "w":
                    dtTmp = new Date(dtTmp.getTime() + 6048e5 * NumDay);
                    break;
                case "m":
                    dtTmp = new Date(dtTmp.getFullYear(), dtTmp.getMonth() + NumDay, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                    break;
                case "y":
                    dtTmp = new Date(dtTmp.getFullYear() + NumDay, dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds())
            }
            return dtTmp
        }
        var dateRegex = /^(?:(?!0000)[0-9]{4}([-\/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-\/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/,
            dateFormat = function() {
                var token = /w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                    timezoneClip = /[^-+\dA-Z]/g,
                    pad = function(val, len) {
                        for (val = String(val), len = len || 2; val.length < len;) val = "0" + val;
                        return val
                    },
                    masks = {
                        default: "ddd mmm dd yyyy HH:MM:ss",
                        shortDate: "m/d/yy",
                        longDate: "mmmm d, yyyy",
                        fullDate: "dddd, mmmm d, yyyy",
                        shortTime: "h:MM TT",
                        longTime: "h:MM:ss TT Z",
                        isoDate: "yyyy-mm-dd",
                        isoTime: "HH:MM:ss",
                        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
                        isoUTCDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
                        localShortDate: "yy年mm月dd日",
                        localShortDateTime: "yy年mm月dd日 hh:MM:ss TT",
                        localLongDate: "yyyy年mm月dd日",
                        localLongDateTime: "yyyy年mm月dd日 hh:MM:ss TT",
                        localFullDate: "yyyy年mm月dd日 w",
                        localFullDateTime: "yyyy年mm月dd日 w hh:MM:ss TT"
                    },
                    i18n = {
                        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    };
                return function(date, mask, utc) {
                    if (1 !== arguments.length || "[object String]" !== Object.prototype.toString.call(date) || /\d/.test(date) || (mask = date, date = void 0), date = date ? new Date(date) : new Date, isNaN(date)) throw SyntaxError("invalid date");
                    mask = String(masks[mask] || mask || masks["default"]), "UTC:" === mask.slice(0, 4) && (mask = mask.slice(4), utc = !0);
                    var _ = utc ? "getUTC" : "get",
                        d = date[_ + "Date"](),
                        D = date[_ + "Day"](),
                        m = date[_ + "Month"](),
                        y = date[_ + "FullYear"](),
                        H = date[_ + "Hours"](),
                        M = date[_ + "Minutes"](),
                        s = date[_ + "Seconds"](),
                        L = date[_ + "Milliseconds"](),
                        o = utc ? 0 : date.getTimezoneOffset(),
                        flags = {
                            d: d,
                            dd: pad(d, void 0),
                            ddd: i18n.dayNames[D],
                            dddd: i18n.dayNames[D + 7],
                            w: i18n.dayNames[D + 14],
                            m: m + 1,
                            mm: pad(m + 1, void 0),
                            mmm: i18n.monthNames[m],
                            mmmm: i18n.monthNames[m + 12],
                            yy: String(y).slice(2),
                            yyyy: y,
                            h: H % 12 || 12,
                            hh: pad(H % 12 || 12, void 0),
                            H: H,
                            HH: pad(H, void 0),
                            M: M,
                            MM: pad(M, void 0),
                            s: s,
                            ss: pad(s, void 0),
                            l: pad(L, 3),
                            L: pad(L > 99 ? Math.round(L / 10) : L, void 0),
                            t: H < 12 ? "a" : "p",
                            tt: H < 12 ? "am" : "pm",
                            T: H < 12 ? "A" : "P",
                            TT: H < 12 ? "AM" : "PM",
                            Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                            o: (o > 0 ? "-" : "+") + pad(100 * Math.floor(Math.abs(o) / 60) + Math.abs(o) % 60, 4),
                            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
                        };
                    return mask.replace(token, function($0) {
                        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
                    })
                }
            }(),
            DateUtil = {
                add: function(strInterval, Num, dtDate) {
                    return DateAdd(strInterval, Num, dtDate)
                },
                addHour: function(hours, date) {
                    return DateAdd("h", hours, date)
                },
                addMinute: function(minutes, date) {
                    return DateAdd("n", minutes, date)
                },
                addSecond: function(seconds, date) {
                    return DateAdd("s", seconds, date)
                },
                addDay: function(days, date) {
                    return DateAdd("d", days, date)
                },
                addWeek: function(weeks, date) {
                    return DateAdd("w", weeks, date)
                },
                addMonths: function(months, date) {
                    return DateAdd("m", months, date)
                },
                addYear: function(years, date) {
                    return DateAdd("y", years, date)
                },
                isDateEquals: function(d1, d2) {
                    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
                },
                isEquals: function(d1, d2) {
                    return d1 == d2 || !(!d1 || !d2) && (!(!d1.getTime || !d2.getTime) && d1.getTime() == d2.getTime())
                },
                isDateString: function(str) {
                    return dateRegex.test(str)
                },
                format: function(date, mask, utc) {
                    return dateFormat(date, mask, utc)
                },
                parse: function(date, s) {
                    return BUI.isString(date) && (date = date.replace("/", "-")), dateParse(date, s)
                },
                today: function() {
                    var now = new Date;
                    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
                },
                getDate: function(date) {
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
                }
            };
        return DateUtil
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function ensureNonEmpty(obj, name, create) {
            var ret = obj[name] || {};
            return create && (obj[name] = ret), ret
        }

        function normalFn(host, method) {
            return BUI.isString(method) ? host[method] : method
        }

        function __fireAttrChange(self, when, name, prevVal, newVal) {
            var attrName = name;
            return self.fire(when + BUI.ucfirst(name) + "Change", {
                attrName: attrName,
                prevVal: prevVal,
                newVal: newVal
            })
        }

        function setInternal(self, name, value, opts, attrs) {
            opts = opts || {};
            var ret, prevVal;
            if (prevVal = self.get(name), $.isPlainObject(value) || BUI.isArray(value) || prevVal !== value) return !(!opts.silent && !1 === __fireAttrChange(self, "before", name, prevVal, value)) && (ret = self._set(name, value, opts), ret === !1 ? ret : (opts.silent || (value = self.__attrVals[name], __fireAttrChange(self, "after", name, prevVal, value)), self))
        }

        function initClassAttrs(c) {
            if (!c._attrs && c != Base) {
                var superCon = c.superclass.constructor;
                superCon && !superCon._attrs && initClassAttrs(superCon), c._attrs = {}, BUI.mixAttrs(c._attrs, superCon._attrs), BUI.mixAttrs(c._attrs, c.ATTRS)
            }
        }
        var INVALID = {},
            Observable = require("bui/observable"),
            Base = function(config) {
                var _self = this,
                    c = _self.constructor,
                    constructors = [];
                for (this.__attrs = {}, this.__attrVals = {}, Observable.apply(this, arguments); c;) constructors.push(c), c.extensions && (BUI.mixin(c, c.extensions), delete c.extensions), c = c.superclass ? c.superclass.constructor : null;
                var con = _self.constructor;
                initClassAttrs(con), _self._initStaticAttrs(con._attrs), _self._initAttrs(config)
            };
        return Base.INVALID = INVALID, BUI.extend(Base, Observable), BUI.augment(Base, {
            _initStaticAttrs: function(attrs) {
                var __attrs, _self = this;
                __attrs = _self.__attrs = {};
                for (var p in attrs)
                    if (attrs.hasOwnProperty(p)) {
                        var attr = attrs[p];
                        attr.shared === !1 || attr.valueFn ? (__attrs[p] = {}, BUI.mixAttr(__attrs[p], attrs[p])) : __attrs[p] = attrs[p]
                    }
            },
            addAttr: function(name, attrConfig, overrides) {
                var _self = this,
                    attrs = _self.__attrs,
                    attr = attrs[name];
                attr || (attr = attrs[name] = {});
                for (var p in attrConfig) attrConfig.hasOwnProperty(p) && ("value" == p ? BUI.isObject(attrConfig[p]) ? (attr[p] = attr[p] || {}, BUI.mix(attr[p], attrConfig[p])) : BUI.isArray(attrConfig[p]) ? (attr[p] = attr[p] || [], BUI.mix(attr[p], attrConfig[p])) : attr[p] = attrConfig[p] : attr[p] = attrConfig[p]);
                return _self
            },
            addAttrs: function(attrConfigs, initialValues, overrides) {
                var _self = this;
                return attrConfigs ? ("boolean" == typeof initialValues && (overrides = initialValues, initialValues = null), BUI.each(attrConfigs, function(attrConfig, name) {
                    _self.addAttr(name, attrConfig, overrides)
                }), initialValues && _self.set(initialValues), _self) : _self
            },
            hasAttr: function(name) {
                return name && this.__attrs.hasOwnProperty(name)
            },
            getAttrs: function() {
                return this.__attrs
            },
            getAttrVals: function() {
                return this.__attrVals
            },
            get: function(name) {
                var attrConfig, getter, ret, _self = this,
                    attrVals = _self.__attrVals;
                return attrConfig = ensureNonEmpty(_self.__attrs, name), getter = attrConfig.getter, ret = name in attrVals ? attrVals[name] : _self._getDefAttrVal(name), getter && (getter = normalFn(_self, getter)) && (ret = getter.call(_self, ret, name)), ret
            },
            clearAttrVals: function() {
                this.__attrVals = {}
            },
            removeAttr: function(name) {
                var _self = this;
                return _self.hasAttr(name) && (delete _self.__attrs[name], delete _self.__attrVals[name]), _self
            },
            set: function(name, value, opts) {
                var _self = this;
                if ($.isPlainObject(name)) {
                    opts = value;
                    var all = Object(name);
                    for (name in all) all.hasOwnProperty(name) && setInternal(_self, name, all[name], opts);
                    return _self
                }
                return setInternal(_self, name, value, opts)
            },
            setInternal: function(name, value, opts) {
                return this._set(name, value, opts)
            },
            _getDefAttrVal: function(name) {
                var val, _self = this,
                    attrs = _self.__attrs,
                    attrConfig = ensureNonEmpty(attrs, name),
                    valFn = attrConfig.valueFn;
                return valFn && (valFn = normalFn(_self, valFn)) && (val = valFn.call(_self), void 0 !== val && (attrConfig.value = val), delete attrConfig.valueFn, attrs[name] = attrConfig), attrConfig.value
            },
            _set: function(name, value, opts) {
                var setValue, _self = this,
                    attrConfig = ensureNonEmpty(_self.__attrs, name, !0),
                    setter = attrConfig.setter;
                return setter && (setter = normalFn(_self, setter)) && (setValue = setter.call(_self, value, name)), setValue !== INVALID && (void 0 !== setValue && (value = setValue), _self.__attrVals[name] = value, _self)
            },
            _initAttrs: function(config) {
                var _self = this;
                if (config)
                    for (var attr in config) config.hasOwnProperty(attr) && _self._set(attr, config[attr])
            }
        }), Base
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function create(component, self) {
            var childConstructor, xclass;
            return component && (xclass = component.xclass) && (self && !component.prefixCls && (component.prefixCls = self.get("prefixCls")), childConstructor = Component.Manager.getConstructorByXClass(xclass), childConstructor || BUI.error("can not find class by xclass desc : " + xclass), component = new childConstructor(component)), component
        }
        var Component = {};
        return BUI.mix(Component, {
            Manager: require("bui/component/manage"),
            UIBase: require("bui/component/uibase"),
            View: require("bui/component/view"),
            Controller: require("bui/component/controller")
        }), Component.create = create, Component
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getConstructorByXClass(cls) {
            for (var t, cs = cls.split(/\s+/), p = -1, ui = null, i = 0; i < cs.length; i++) {
                var uic = uis[cs[i]];
                uic && (t = uic.priority) > p && (p = t, ui = uic.constructor)
            }
            return ui
        }

        function getXClassByConstructor(constructor) {
            for (var u in uis) {
                var ui = uis[u];
                if (ui.constructor == constructor) return u
            }
            return 0
        }

        function setConstructorByXClass(cls, uic) {
            BUI.isFunction(uic) ? uis[cls] = {
                constructor: uic,
                priority: 0
            } : (uic.priority = uic.priority || 0, uis[cls] = uic)
        }

        function getCssClassWithPrefix(cls) {
            for (var cs = $.trim(cls).split(/\s+/), i = 0; i < cs.length; i++) cs[i] && (cs[i] = this.get("prefixCls") + cs[i]);
            return cs.join(" ")
        }
        var uis = {},
            componentInstances = {},
            Manager = {
                __instances: componentInstances,
                addComponent: function(id, component) {
                    componentInstances[id] = component
                },
                removeComponent: function(id) {
                    delete componentInstances[id]
                },
                eachComponent: function(fn) {
                    BUI.each(componentInstances, fn)
                },
                getComponent: function(id) {
                    return componentInstances[id]
                },
                getCssClassWithPrefix: getCssClassWithPrefix,
                getXClassByConstructor: getXClassByConstructor,
                getConstructorByXClass: getConstructorByXClass,
                setConstructorByXClass: setConstructorByXClass
            };
        return Manager
    }),
    function() {
        var BASE = "bui/component/uibase/";
        define("src/hephaistos/js/bui-debug", [], function(r) {
            var UIBase = r(BASE + "base");
            return BUI.mix(UIBase, {
                Align: r(BASE + "align"),
                AutoShow: r(BASE + "autoshow"),
                AutoHide: r(BASE + "autohide"),
                Close: r(BASE + "close"),
                Collapsable: r(BASE + "collapsable"),
                Drag: r(BASE + "drag"),
                KeyNav: r(BASE + "keynav"),
                List: r(BASE + "list"),
                ListItem: r(BASE + "listitem"),
                Mask: r(BASE + "mask"),
                Position: r(BASE + "position"),
                Selection: r(BASE + "selection"),
                StdMod: r(BASE + "stdmod"),
                Decorate: r(BASE + "decorate"),
                Tpl: r(BASE + "tpl"),
                ChildCfg: r(BASE + "childcfg"),
                Bindable: r(BASE + "bindable"),
                Depends: r(BASE + "depends")
            }), BUI.mix(UIBase, {
                CloseView: UIBase.Close.View,
                CollapsableView: UIBase.Collapsable.View,
                ChildList: UIBase.List.ChildList,
                ListItemView: UIBase.ListItem.View,
                MaskView: UIBase.Mask.View,
                PositionView: UIBase.Position.View,
                StdModView: UIBase.StdMod.View,
                TplView: UIBase.Tpl.View
            }), UIBase
        })
    }(), define("src/hephaistos/js/bui-debug", [], function(require) {
        function initHierarchy(host, config) {
            callMethodByHierarchy(host, "initializer", "constructor")
        }

        function callMethodByHierarchy(host, mainMethod, extMethod) {
            for (var ext, main, exts, t, c = host.constructor, extChains = []; c;) {
                if (t = [], exts = c.mixins)
                    for (var i = 0; i < exts.length; i++) ext = exts[i], ext && ("constructor" != extMethod && (ext = ext.prototype.hasOwnProperty(extMethod) ? ext.prototype[extMethod] : null), ext && t.push(ext));
                c.prototype.hasOwnProperty(mainMethod) && (main = c.prototype[mainMethod]) && t.push(main), t.length && extChains.push.apply(extChains, t.reverse()), c = c.superclass && c.superclass.constructor
            }
            for (i = extChains.length - 1; i >= 0; i--) extChains[i] && extChains[i].call(host)
        }

        function destroyHierarchy(host) {
            for (var extensions, d, i, c = host.constructor; c;) {
                if (c.prototype.hasOwnProperty("destructor") && c.prototype.destructor.apply(host), extensions = c.mixins)
                    for (i = extensions.length - 1; i >= 0; i--) d = extensions[i] && extensions[i].prototype.__destructor, d && d.apply(host);
                c = c.superclass && c.superclass.constructor
            }
        }

        function constructPlugins(plugins) {
            plugins && BUI.each(plugins, function(plugin, i) {
                BUI.isFunction(plugin) && (plugins[i] = new plugin)
            })
        }

        function actionPlugins(self, plugins, action) {
            plugins && BUI.each(plugins, function(plugin, i) {
                plugin[action] && plugin[action](self)
            })
        }

        function bindUI(self) {}

        function syncUI(self) {
            var v, f, attrs = self.getAttrs();
            for (var a in attrs)
                if (attrs.hasOwnProperty(a)) {
                    var m = UI_SET + ucfirst(a);
                    (f = self[m]) && attrs[a].sync !== !1 && void 0 !== (v = self.get(a)) && f.call(self, v)
                }
        }

        function initConstuctor(c) {
            for (var constructors = []; c.base;) constructors.push(c), c = c.base;
            for (var i = constructors.length - 1; i >= 0; i--) {
                var C = constructors[i];
                BUI.mix(C.prototype, C.px), BUI.mix(C, C.sx), C.base = null, C.px = null, C.sx = null
            }
        }
        var Manager = require("bui/component/manage"),
            UI_SET = "_uiSet",
            ucfirst = BUI.ucfirst,
            noop = $.noop,
            Base = require("bui/base"),
            UIBase = function(config) {
                var _self = this;
                Base.apply(_self, arguments), _self.setInternal("userConfig", config), initHierarchy(_self, config);
                var plugins = _self.get("plugins");
                constructPlugins(plugins);
                var xclass = _self.get("xclass");
                xclass && (_self.__xclass = xclass), actionPlugins(_self, plugins, "initializer"), config && config.autoRender && _self.render()
            };
        return UIBase.ATTRS = {
            userConfig: {},
            autoRender: {
                value: !1
            },
            listeners: {
                value: {}
            },
            plugins: {},
            rendered: {
                value: !1
            },
            xclass: {
                valueFn: function() {
                    return Manager.getXClassByConstructor(this.constructor)
                }
            }
        }, BUI.extend(UIBase, Base), BUI.augment(UIBase, {
            create: function() {
                var self = this;
                return self.get("created") || (self.fire("beforeCreateDom"), callMethodByHierarchy(self, "createDom", "__createDom"), self._set("created", !0), self.fire("afterCreateDom"), actionPlugins(self, self.get("plugins"), "createDom")), self
            },
            render: function() {
                var _self = this;
                if (!_self.get("rendered")) {
                    var plugins = _self.get("plugins");
                    _self.create(void 0), _self.set("created", !0), _self.fire("beforeRenderUI"), callMethodByHierarchy(_self, "renderUI", "__renderUI"), _self.fire("afterRenderUI"), actionPlugins(_self, plugins, "renderUI"), _self.fire("beforeBindUI"), bindUI(_self), callMethodByHierarchy(_self, "bindUI", "__bindUI"), _self.set("binded", !0), _self.fire("afterBindUI"), actionPlugins(_self, plugins, "bindUI"), _self.fire("beforeSyncUI"), syncUI(_self), callMethodByHierarchy(_self, "syncUI", "__syncUI"), _self.fire("afterSyncUI"), actionPlugins(_self, plugins, "syncUI"), _self._set("rendered", !0)
                }
                return _self
            },
            createDom: noop,
            renderUI: noop,
            bindUI: noop,
            syncUI: noop,
            destroy: function() {
                var _self = this;
                return _self.destroyed ? _self : (_self.fire("beforeDestroy"), actionPlugins(_self, _self.get("plugins"), "destructor"), destroyHierarchy(_self), _self.fire("afterDestroy"), _self.off(), _self.clearAttrVals(), _self.destroyed = !0, _self)
            }
        }), BUI.mix(UIBase, {
            define: function(base, extensions, px, sx) {
                function C() {
                    var c = this.constructor;
                    c.base && initConstuctor(c), UIBase.apply(this, arguments)
                }
                return $.isPlainObject(extensions) && (sx = px, px = extensions, extensions = []), BUI.extend(C, base), C.base = base, C.px = px, C.sx = sx, extensions.length && (C.extensions = extensions), C
            },
            extend: function extend(extensions, px, sx) {
                var ret, args = $.makeArray(arguments),
                    last = args[args.length - 1];
                if (args.unshift(this), last.xclass && (args.pop(), args.push(last.xclass)), ret = UIBase.define.apply(UIBase, args), last.xclass) {
                    var priority = last.priority || (this.priority ? this.priority + 1 : 1);
                    Manager.setConstructorByXClass(last.xclass, {
                        constructor: ret,
                        priority: priority
                    }), ret.__xclass = last.xclass, ret.priority = priority, ret.toString = function() {
                        return last.xclass
                    }
                }
                return ret.extend = extend, ret
            }
        }), UIBase
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getOffsetParent(element) {
            var parent, doc = element.ownerDocument,
                body = doc.body,
                positionStyle = $(element).css("position"),
                skipStatic = "fixed" == positionStyle || "absolute" == positionStyle;
            if (!skipStatic) return "html" == element.nodeName.toLowerCase() ? null : element.parentNode;
            for (parent = element.parentNode; parent && parent != body; parent = parent.parentNode)
                if (positionStyle = $(parent).css("position"), "static" != positionStyle) return parent;
            return null
        }

        function getVisibleRectForElement(element) {
            var el, scrollX, scrollY, winSize, visibleRect = {
                    left: 0,
                    right: 1 / 0,
                    top: 0,
                    bottom: 1 / 0
                },
                doc = element.ownerDocument,
                body = doc.body,
                documentElement = doc.documentElement;
            for (el = element; el = getOffsetParent(el);)
                if ((!UA.ie || 0 != el.clientWidth) && el != body && el != documentElement && "visible" != $(el).css("overflow")) {
                    var pos = $(el).offset();
                    pos.left += el.clientLeft, pos.top += el.clientTop, visibleRect.top = Math.max(visibleRect.top, pos.top), visibleRect.right = Math.min(visibleRect.right, pos.left + el.clientWidth), visibleRect.bottom = Math.min(visibleRect.bottom, pos.top + el.clientHeight), visibleRect.left = Math.max(visibleRect.left, pos.left)
                }
            return scrollX = $(win).scrollLeft(), scrollY = $(win).scrollTop(), visibleRect.left = Math.max(visibleRect.left, scrollX), visibleRect.top = Math.max(visibleRect.top, scrollY), winSize = {
                width: BUI.viewportWidth(),
                height: BUI.viewportHeight()
            }, visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width), visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height), visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null
        }

        function getElFuturePos(elRegion, refNodeRegion, points, offset) {
            var xy, diff, p1, p2;
            return xy = {
                left: elRegion.left,
                top: elRegion.top
            }, p1 = getAlignOffset(refNodeRegion, points[0]), p2 = getAlignOffset(elRegion, points[1]), diff = [p2.left - p1.left, p2.top - p1.top], {
                left: xy.left - diff[0] + +offset[0],
                top: xy.top - diff[1] + +offset[1]
            }
        }

        function isFailX(elFuturePos, elRegion, visibleRect) {
            return elFuturePos.left < visibleRect.left || elFuturePos.left + elRegion.width > visibleRect.right
        }

        function isFailY(elFuturePos, elRegion, visibleRect) {
            return elFuturePos.top < visibleRect.top || elFuturePos.top + elRegion.height > visibleRect.bottom
        }

        function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
            var pos = BUI.cloneObject(elFuturePos),
                size = {
                    width: elRegion.width,
                    height: elRegion.height
                };
            return overflow.adjustX && pos.left < visibleRect.left && (pos.left = visibleRect.left), overflow.resizeWidth && pos.left >= visibleRect.left && pos.left + size.width > visibleRect.right && (size.width -= pos.left + size.width - visibleRect.right), overflow.adjustX && pos.left + size.width > visibleRect.right && (pos.left = Math.max(visibleRect.right - size.width, visibleRect.left)), overflow.adjustY && pos.top < visibleRect.top && (pos.top = visibleRect.top), overflow.resizeHeight && pos.top >= visibleRect.top && pos.top + size.height > visibleRect.bottom && (size.height -= pos.top + size.height - visibleRect.bottom), overflow.adjustY && pos.top + size.height > visibleRect.bottom && (pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top)), BUI.mix(pos, size)
        }

        function flip(points, reg, map) {
            var ret = [];
            return $.each(points, function(index, p) {
                ret.push(p.replace(reg, function(m) {
                    return map[m]
                }))
            }), ret
        }

        function flipOffset(offset, index) {
            return offset[index] = -offset[index], offset
        }

        function Align() {}

        function getRegion(node) {
            var offset, w, h;
            return node.length && !$.isWindow(node[0]) ? (offset = node.offset(), w = node.outerWidth(), h = node.outerHeight()) : (offset = {
                left: BUI.scrollLeft(),
                top: BUI.scrollTop()
            }, w = BUI.viewportWidth(), h = BUI.viewportHeight()), offset.width = w, offset.height = h, offset
        }

        function getAlignOffset(region, align) {
            var x, y, V = align.charAt(0),
                H = align.charAt(1),
                w = region.width,
                h = region.height;
            return x = region.left, y = region.top, "c" === V ? y += h / 2 : "b" === V && (y += h), "c" === H ? x += w / 2 : "r" === H && (x += w), {
                left: x,
                top: y
            }
        }

        function clearAlignCls(el) {
            var cls = el.attr("class"),
                regex = new RegExp("s?" + CLS_ALIGN_PREFIX + "[a-z]{2}-[a-z]{2}", "ig"),
                arr = regex.exec(cls);
            arr && el.removeClass(arr.join(" "))
        }
        var UA = require("bui/ua"),
            CLS_ALIGN_PREFIX = "x-align-",
            win = window;
        return Align.__getOffsetParent = getOffsetParent, Align.__getVisibleRectForElement = getVisibleRectForElement, Align.ATTRS = {
            align: {
                shared: !1,
                value: {}
            }
        }, Align.prototype = {
            _uiSetAlign: function(v, ev) {
                var el, selfAlign, alignCls = "";
                v && v.points && (this.align(v.node, v.points, v.offset, v.overflow), this.set("cachePosition", null), el = this.get("el"), clearAlignCls(el), selfAlign = v.points.join("-"), alignCls = CLS_ALIGN_PREFIX + selfAlign, el.addClass(alignCls))
            },
            align: function(refNode, points, offset, overflow) {
                refNode = $(refNode || win), offset = offset && [].concat(offset) || [0, 0], overflow = overflow || {};
                var self = this,
                    el = self.get("el"),
                    fail = 0,
                    visibleRect = getVisibleRectForElement(el[0]),
                    elRegion = getRegion(el),
                    refNodeRegion = getRegion(refNode),
                    elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset),
                    newElRegion = BUI.merge(elRegion, elFuturePos);
                if (visibleRect && (overflow.adjustX || overflow.adjustY)) {
                    isFailX(elFuturePos, elRegion, visibleRect) && (fail = 1, points = flip(points, /[lr]/gi, {
                        l: "r",
                        r: "l"
                    }), offset = flipOffset(offset, 0)), isFailY(elFuturePos, elRegion, visibleRect) && (fail = 1, points = flip(points, /[tb]/gi, {
                        t: "b",
                        b: "t"
                    }), offset = flipOffset(offset, 1)), fail && (elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset), BUI.mix(newElRegion, elFuturePos));
                    var newOverflowCfg = {};
                    newOverflowCfg.adjustX = overflow.adjustX && isFailX(elFuturePos, elRegion, visibleRect), newOverflowCfg.adjustY = overflow.adjustY && isFailY(elFuturePos, elRegion, visibleRect), (newOverflowCfg.adjustX || newOverflowCfg.adjustY) && (newElRegion = adjustForViewport(elFuturePos, elRegion, visibleRect, newOverflowCfg))
                }
                return newElRegion.left != elRegion.left && (self.setInternal("x", null), self.get("view").setInternal("x", null), self.set("x", newElRegion.left)), newElRegion.top != elRegion.top && (self.setInternal("y", null), self.get("view").setInternal("y", null), self.set("y", newElRegion.top)), newElRegion.width != elRegion.width && el.width(el.width() + newElRegion.width - elRegion.width), newElRegion.height != elRegion.height && el.height(el.height() + newElRegion.height - elRegion.height), self
            },
            center: function(node) {
                var self = this;
                return self.set("align", {
                    node: node,
                    points: ["cc", "cc"],
                    offset: [0, 0]
                }), self
            }
        }, Align
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function autoShow() {}
        return autoShow.ATTRS = {
            trigger: {},
            delegateTigger: {
                getter: function() {
                    this.get("delegateTrigger")
                },
                setter: function(v) {
                    this.set("delegateTrigger", v)
                }
            },
            delegateTrigger: {
                value: !1
            },
            autoAlign: {
                value: !0
            },
            autoFocused: {
                value: !0
            },
            triggerActiveCls: {},
            curTrigger: {},
            triggerCallback: {},
            triggerEvent: {
                value: "click"
            },
            triggerHideEvent: {},
            events: {
                value: {
                    triggerchange: !1
                }
            }
        }, autoShow.prototype = {
            __createDom: function() {
                this._setTrigger()
            },
            __bindUI: function() {
                var _self = this,
                    triggerActiveCls = _self.get("triggerActiveCls");
                triggerActiveCls && _self.on("hide", function() {
                    var curTrigger = _self.get("curTrigger");
                    curTrigger && curTrigger.removeClass(triggerActiveCls)
                })
            },
            _setTrigger: function() {
                function tiggerShow(ev) {
                    var prevTrigger = _self.get("curTrigger"),
                        curTrigger = isDelegate ? $(ev.currentTarget) : $(this),
                        align = _self.get("align");
                    prevTrigger && prevTrigger[0] == curTrigger[0] || (prevTrigger && prevTrigger.removeClass(triggerActiveCls), _self.set("curTrigger", curTrigger), _self.fire("triggerchange", {
                        prevTrigger: prevTrigger,
                        curTrigger: curTrigger
                    })), curTrigger.addClass(triggerActiveCls), _self.get("autoAlign") && (align.node = curTrigger), _self.set("align", align), _self.show(), triggerCallback && triggerCallback(ev)
                }

                function tiggerHide(ev) {
                    var toElement = ev.toElement || ev.relatedTarget;
                    toElement && _self.containsElement(toElement) || _self.hide()
                }
                var _self = this,
                    triggerEvent = _self.get("triggerEvent"),
                    triggerHideEvent = _self.get("triggerHideEvent"),
                    triggerCallback = _self.get("triggerCallback"),
                    triggerActiveCls = _self.get("triggerActiveCls") || "",
                    trigger = _self.get("trigger"),
                    isDelegate = _self.get("delegateTrigger"),
                    triggerEl = $(trigger);
                triggerEvent && (isDelegate && BUI.isString(trigger) ? $(document).delegate(trigger, triggerEvent, tiggerShow) : triggerEl.on(triggerEvent, tiggerShow)), triggerHideEvent && (isDelegate && BUI.isString(trigger) ? $(document).delegate(trigger, triggerHideEvent, tiggerHide) : triggerEl.on(triggerHideEvent, tiggerHide))
            },
            __renderUI: function() {
                var _self = this,
                    align = _self.get("align");
                align && !align.node && (align.node = _self.get("render") || _self.get("trigger"))
            }
        }, autoShow
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function isExcept(self, elem) {
            var hideExceptNode = self.get("hideExceptNode");
            return !(!hideExceptNode || !hideExceptNode.length) && $.contains(hideExceptNode[0], elem)
        }

        function autoHide() {}
        var wrapBehavior = BUI.wrapBehavior,
            getWrapBehavior = BUI.getWrapBehavior;
        return autoHide.ATTRS = {
            autoHideType: {
                value: "click"
            },
            autoHide: {
                value: !1
            },
            hideExceptNode: {},
            events: {
                value: {
                    autohide: !1
                }
            }
        }, autoHide.prototype = {
            __bindUI: function() {
                var _self = this;
                _self.on("afterVisibleChange", function(ev) {
                    var visible = ev.newVal;
                    _self.get("autoHide") && (visible ? _self._bindHideEvent() : _self._clearHideEvent())
                })
            },
            handleMoveOuter: function(ev) {
                var _self = this,
                    target = ev.toElement || ev.relatedTarget;
                _self.containsElement(target) || isExcept(_self, target) || _self.fire("autohide") !== !1 && _self.hide()
            },
            handleDocumentClick: function(ev) {
                var _self = this,
                    target = ev.target;
                _self.containsElement(target) || isExcept(_self, target) || _self.fire("autohide") !== !1 && _self.hide()
            },
            _bindHideEvent: function() {
                var _self = this,
                    trigger = _self.get("curTrigger"),
                    autoHideType = _self.get("autoHideType");
                "click" === autoHideType ? $(document).on("mousedown", wrapBehavior(_self, "handleDocumentClick")) : (_self.get("el").on("mouseleave", wrapBehavior(_self, "handleMoveOuter")), trigger && $(trigger).on("mouseleave", wrapBehavior(_self, "handleMoveOuter")))
            },
            _clearHideEvent: function() {
                var _self = this,
                    trigger = _self.get("curTrigger"),
                    autoHideType = _self.get("autoHideType");
                "click" === autoHideType ? $(document).off("mousedown", getWrapBehavior(_self, "handleDocumentClick")) : (_self.get("el").off("mouseleave", getWrapBehavior(_self, "handleMoveOuter")), trigger && $(trigger).off("mouseleave", getWrapBehavior(_self, "handleMoveOuter")))
            }
        }, autoHide
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function getCloseRenderBtn(self) {
            return $(self.get("closeTpl"))
        }

        function CloseView() {}

        function Close() {}
        var CLS_PREFIX = BUI.prefix + "ext-";
        CloseView.ATTRS = {
            closeTpl: {
                value: '<a tabindex="0" href=\'javascript:void("关闭")\' role="button" class="' + CLS_PREFIX + 'close"><span class="' + CLS_PREFIX + 'close-x">关闭</span></a>'
            },
            closeable: {
                value: !0
            },
            closeBtn: {}
        }, CloseView.prototype = {
            _uiSetCloseable: function(v) {
                var self = this,
                    btn = self.get("closeBtn");
                v ? (btn || self.setInternal("closeBtn", btn = getCloseRenderBtn(self)), btn.appendTo(self.get("el"), void 0)) : btn && btn.remove()
            }
        };
        var HIDE = "hide";
        Close.ATTRS = {
            closeTpl: {
                view: !0
            },
            closeable: {
                view: 1
            },
            closeBtn: {
                view: 1
            },
            closeAction: {
                value: HIDE
            }
        };
        var actions = {
            hide: HIDE,
            destroy: "destroy",
            remove: "remove"
        };
        return Close.prototype = {
            _uiSetCloseable: function(v) {
                var self = this;
                v && !self.__bindCloseEvent && (self.__bindCloseEvent = 1, self.get("closeBtn").on("click", function(ev) {
                    self.fire("closeclick", {
                        domTarget: ev.target
                    }) !== !1 && self.close(), ev.preventDefault()
                }))
            },
            __destructor: function() {
                var btn = this.get("closeBtn");
                btn && btn.detach()
            },
            close: function() {
                var self = this,
                    action = actions[self.get("closeAction") || HIDE];
                self.fire("closing", {
                    action: action
                }) !== !1 && (self.fire("beforeclosed", {
                    action: action
                }), "remove" == action ? self[action](!0) : self[action](), self.fire("closed", {
                    action: action
                }))
            }
        }, Close.View = CloseView, Close
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function initBack() {
            var el = $(dragTpl).css("opacity", 0).prependTo("body");
            return el
        }
        var dragBackId = BUI.guid("drag"),
            drag = function() {};
        drag.ATTRS = {
            dragNode: {},
            draging: {
                setter: function(v) {
                    if (v === !0) return {}
                },
                value: null
            },
            constraint: {},
            dragBackEl: {
                getter: function() {
                    return $("#" + dragBackId)
                }
            }
        };
        var dragTpl = '<div id="' + dragBackId + '" style="background-color: red; position: fixed; left: 0px; width: 100%; height: 100%; top: 0px; cursor: move; z-index: 999999; display: none; "></div>';
        return drag.prototype = {
            __bindUI: function() {
                function mouseMove(e) {
                    var draging = _self.get("draging");
                    draging && (e.preventDefault(), _self._dragMoveTo(e.pageX, e.pageY, draging, constraint))
                }

                function mouseUp(e) {
                    if (1 == e.which) {
                        _self.set("draging", !1);
                        var dragBackEl = _self.get("dragBackEl");
                        dragBackEl && dragBackEl.hide(), unregistEvent()
                    }
                }

                function registEvent() {
                    $(document).on("mousemove", mouseMove), $(document).on("mouseup", mouseUp)
                }

                function unregistEvent() {
                    $(document).off("mousemove", mouseMove), $(document).off("mouseup", mouseUp)
                }
                var _self = this,
                    constraint = _self.get("constraint"),
                    dragNode = _self.get("dragNode");
                dragNode && dragNode.on("mousedown", function(e) {
                    1 == e.which && (e.preventDefault(), _self.set("draging", {
                        elX: _self.get("x"),
                        elY: _self.get("y"),
                        startX: e.pageX,
                        startY: e.pageY
                    }), registEvent())
                })
            },
            _dragMoveTo: function(x, y, draging, constraint) {
                var _self = this,
                    dragBackEl = _self.get("dragBackEl"),
                    draging = draging || _self.get("draging"),
                    offsetX = draging.startX - x,
                    offsetY = draging.startY - y;
                dragBackEl.length || (dragBackEl = initBack()), dragBackEl.css({
                    cursor: "move",
                    display: "block"
                }), _self.set("xy", [_self._getConstrainX(draging.elX - offsetX, constraint), _self._getConstrainY(draging.elY - offsetY, constraint)])
            },
            _getConstrainX: function(x, constraint) {
                var _self = this,
                    width = _self.get("el").outerWidth(),
                    endX = x + width,
                    curX = _self.get("x");
                if (constraint) {
                    var constraintOffset = constraint.offset();
                    return constraintOffset.left >= x ? constraintOffset.left : constraintOffset.left + constraint.width() < endX ? constraintOffset.left + constraint.width() - width : x
                }
                return BUI.isInHorizontalView(x) && BUI.isInHorizontalView(endX) ? x : curX
            },
            _getConstrainY: function(y, constraint) {
                var _self = this,
                    height = _self.get("el").outerHeight(),
                    endY = y + height,
                    curY = _self.get("y");
                if (constraint) {
                    var constraintOffset = constraint.offset();
                    return constraintOffset.top > y ? constraintOffset.top : constraintOffset.top + constraint.height() < endY ? constraintOffset.top + constraint.height() - height : y
                }
                return BUI.isInVerticalView(y) && BUI.isInVerticalView(endY) ? y : curY
            }
        }, drag
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var KeyCode = require("bui/keycode"),
            wrapBehavior = BUI.wrapBehavior,
            getWrapBehavior = BUI.getWrapBehavior,
            keyNav = function() {};
        return keyNav.ATTRS = {
            allowKeyNav: {
                value: !0
            },
            navEvent: {
                value: "keydown"
            },
            ignoreInputFields: {
                value: !0
            }
        }, keyNav.prototype = {
            __bindUI: function() {},
            _uiSetAllowKeyNav: function(v) {
                var _self = this,
                    eventName = _self.get("navEvent"),
                    el = _self.get("el");
                v ? el.on(eventName, wrapBehavior(_self, "_handleKeyDown")) : el.off(eventName, getWrapBehavior(_self, "_handleKeyDown"))
            },
            _handleKeyDown: function(ev) {
                var _self = this,
                    ignoreInputFields = _self.get("ignoreInputFields"),
                    code = ev.which;
                if (!ignoreInputFields || !$(ev.target).is("input,select,textarea")) switch (code) {
                    case KeyCode.UP:
                        ev.preventDefault(), _self.handleNavUp(ev);
                        break;
                    case KeyCode.DOWN:
                        ev.preventDefault(), _self.handleNavDown(ev);
                        break;
                    case KeyCode.RIGHT:
                        ev.preventDefault(), _self.handleNavRight(ev);
                        break;
                    case KeyCode.LEFT:
                        ev.preventDefault(), _self.handleNavLeft(ev);
                        break;
                    case KeyCode.ENTER:
                        _self.handleNavEnter(ev);
                        break;
                    case KeyCode.ESC:
                        _self.handleNavEsc(ev);
                        break;
                    case KeyCode.TAB:
                        _self.handleNavTab(ev)
                }
            },
            handleNavUp: function(ev) {},
            handleNavDown: function(ev) {},
            handleNavLeft: function(ev) {},
            handleNavRight: function(ev) {},
            handleNavEnter: function(ev) {},
            handleNavEsc: function(ev) {},
            handleNavTab: function(ev) {}
        }, keyNav
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getMaskCls(self) {
            return self.get("prefixCls") + "ext-mask"
        }

        function docWidth() {
            return ie6 ? BUI.docWidth() + "px" : "100%"
        }

        function docHeight() {
            return ie6 ? BUI.docHeight() + "px" : "100%"
        }

        function initMask(maskCls) {
            var mask = $('<div  style="width:' + docWidth() + ";left:0;top:0;height:" + docHeight() + ";position:" + (ie6 ? "absolute" : "fixed") + ';" class="' + maskCls + '">' + (ie6 ? '<iframe style="position:absolute;left:0;top:0;background:white;width: expression(this.parentNode.offsetWidth);height: expression(this.parentNode.offsetHeight);filter:alpha(opacity=0);z-index:-1;"></iframe>' : "") + "</div>").prependTo("body");
            return mask.on("mousedown", function(e) {
                e.preventDefault()
            }), mask
        }

        function MaskView() {}

        function Mask() {}
        var UA = require("bui/ua"),
            maskMap = {},
            ie6 = 6 == UA.ie;
        return MaskView.ATTRS = {
            maskShared: {
                value: !0
            }
        }, MaskView.prototype = {
            _maskExtShow: function() {
                var zIndex, self = this,
                    maskCls = getMaskCls(self),
                    maskDesc = maskMap[maskCls],
                    maskShared = self.get("maskShared"),
                    mask = self.get("maskNode");
                mask || (maskShared ? maskDesc ? mask = maskDesc.node : (mask = initMask(maskCls), maskDesc = maskMap[maskCls] = {
                    num: 0,
                    node: mask
                }) : mask = initMask(maskCls), self.setInternal("maskNode", mask)), (zIndex = self.get("zIndex")) && mask.css("z-index", zIndex - 1), maskShared && maskDesc.num++, maskShared && 1 != maskDesc.num || mask.show(), $("body").addClass("x-masked-relative")
            },
            _maskExtHide: function() {
                var self = this,
                    maskCls = getMaskCls(self),
                    maskDesc = maskMap[maskCls],
                    maskShared = self.get("maskShared"),
                    mask = self.get("maskNode");
                maskShared && maskDesc ? (maskDesc.num = Math.max(maskDesc.num - 1, 0), 0 == maskDesc.num && mask.hide()) : mask && mask.hide(), $("body").removeClass("x-masked-relative")
            },
            __destructor: function() {
                var self = this,
                    maskShared = self.get("maskShared"),
                    mask = self.get("maskNode");
                self.get("maskNode") && (maskShared ? self.get("visible") && self._maskExtHide() : mask.remove())
            }
        }, Mask.ATTRS = {
            mask: {
                value: !1
            },
            maskNode: {
                view: 1
            },
            maskShared: {
                view: 1
            }
        }, Mask.prototype = {
            __bindUI: function() {
                var self = this,
                    view = self.get("view");
                view._maskExtShow, view._maskExtHide;
                self.get("mask") && (self.on("show", function() {
                    view._maskExtShow()
                }), self.on("hide", function() {
                    view._maskExtHide()
                }))
            }
        }, Mask = Mask, Mask.View = MaskView, Mask
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function PositionView() {}

        function Position() {}
        return PositionView.ATTRS = {
            x: {
                valueFn: function() {
                    var self = this;
                    return self.get("el") && self.get("el").offset().left
                }
            },
            y: {
                valueFn: function() {
                    var self = this;
                    return self.get("el") && self.get("el").offset().top
                }
            },
            zIndex: {},
            visibleMode: {
                value: "visibility"
            }
        }, PositionView.prototype = {
            __createDom: function() {
                this.get("el").addClass(BUI.prefix + "ext-position")
            },
            _uiSetZIndex: function(x) {
                this.get("el").css("z-index", x)
            },
            _uiSetX: function(x) {
                null != x && this.get("el").offset({
                    left: x
                })
            },
            _uiSetY: function(y) {
                null != y && this.get("el").offset({
                    top: y
                })
            },
            _uiSetLeft: function(left) {
                null != left && this.get("el").css({
                    left: left
                })
            },
            _uiSetTop: function(top) {
                null != top && this.get("el").css({
                    top: top
                })
            }
        }, Position.ATTRS = {
            x: {
                view: 1
            },
            y: {
                view: 1
            },
            left: {
                view: 1
            },
            top: {
                view: 1
            },
            xy: {
                setter: function(v) {
                    var self = this,
                        xy = $.makeArray(v);
                    return xy.length && (xy[0] && self.set("x", xy[0]), xy[1] && self.set("y", xy[1])), v
                },
                getter: function() {
                    return [this.get("x"), this.get("y")]
                }
            },
            zIndex: {
                view: 1
            },
            visible: {
                view: !0,
                value: !0
            }
        }, Position.prototype = {
            move: function(x, y) {
                var self = this;
                return BUI.isArray(x) && (y = x[1], x = x[0]), self.set("xy", [x, y]), self
            },
            _uiSetX: function(v) {
                if (null != v) {
                    var _self = this,
                        el = _self.get("el");
                    _self.setInternal("left", el.position().left), v != -999 && this.set("cachePosition", null)
                }
            },
            _uiSetY: function(v) {
                if (null != v) {
                    var _self = this,
                        el = _self.get("el");
                    _self.setInternal("top", el.position().top), v != -999 && this.set("cachePosition", null)
                }
            },
            _uiSetLeft: function(v) {
                var _self = this,
                    el = _self.get("el");
                null != v && _self.setInternal("x", el.offset().left)
            },
            _uiSetTop: function(v) {
                var _self = this,
                    el = _self.get("el");
                null != v && _self.setInternal("y", el.offset().top)
            }
        }, Position.View = PositionView, Position
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function listItemView() {}

        function listItem() {}
        return listItemView.ATTRS = {
            selected: {}
        }, listItemView.prototype = {
            _uiSetSelected: function(v) {
                var _self = this,
                    cls = _self.getStatusCls("selected"),
                    el = _self.get("el");
                v ? el.addClass(cls) : el.removeClass(cls)
            }
        }, listItem.ATTRS = {
            selectable: {
                value: !0
            },
            selected: {
                view: !0,
                sync: !1,
                value: !1
            }
        }, listItem.prototype = {}, listItem.View = listItemView, listItem
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function StdModView() {}

        function createUI(self, part) {
            var el = self.get("contentEl"),
                partEl = self.get(part);
            partEl || (partEl = $('<div class="' + CLS_PREFIX + part + '"  ></div>'), partEl.appendTo(el), self.setInternal(part, partEl))
        }

        function _setStdModRenderContent(self, part, v) {
            part = self.get(part), BUI.isString(v) ? part.html(v) : part.html("").append(v)
        }

        function StdMod() {}
        var CLS_PREFIX = BUI.prefix + "stdmod-";
        return StdModView.ATTRS = {
            header: {},
            body: {},
            footer: {},
            bodyStyle: {},
            footerStyle: {},
            headerStyle: {},
            headerContent: {},
            bodyContent: {},
            footerContent: {}
        }, StdModView.PARSER = {
            header: function(el) {
                return el.one("." + CLS_PREFIX + "header")
            },
            body: function(el) {
                return el.one("." + CLS_PREFIX + "body")
            },
            footer: function(el) {
                return el.one("." + CLS_PREFIX + "footer")
            }
        }, StdModView.prototype = {
            __createDom: function() {
                createUI(this, "header"), createUI(this, "body"), createUI(this, "footer")
            },
            _uiSetBodyStyle: function(v) {
                this.get("body").css(v)
            },
            _uiSetHeaderStyle: function(v) {
                this.get("header").css(v)
            },
            _uiSetFooterStyle: function(v) {
                this.get("footer").css(v)
            },
            _uiSetBodyContent: function(v) {
                _setStdModRenderContent(this, "body", v)
            },
            _uiSetHeaderContent: function(v) {
                _setStdModRenderContent(this, "header", v)
            },
            _uiSetFooterContent: function(v) {
                _setStdModRenderContent(this, "footer", v)
            }
        }, StdMod.ATTRS = {
            header: {
                view: 1
            },
            body: {
                view: 1
            },
            footer: {
                view: 1
            },
            bodyStyle: {
                view: 1
            },
            footerStyle: {
                view: 1
            },
            headerStyle: {
                view: 1
            },
            headerContent: {
                view: 1
            },
            bodyContent: {
                view: 1
            },
            footerContent: {
                view: 1
            }
        }, StdMod.View = StdModView, StdMod
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function isConfigField(name, cfgFields) {
            if (cfgFields[name]) return !0;
            var reg = new RegExp("^" + FIELD_PREFIX);
            return !(name === FIELD_CFG || !reg.test(name))
        }

        function collectConstructorChains(self) {
            for (var constructorChains = [], c = self.constructor; c;) constructorChains.push(c), c = c.superclass && c.superclass.constructor;
            return constructorChains
        }

        function parseFieldValue(value) {
            return value = $.trim(value), regx.test(value) && (value = JSON.looseParse(value)), value
        }

        function setConfigFields(self, cfg) {
            var userConfig = self.userConfig || {};
            for (var p in cfg) p in userConfig || self.setInternal(p, cfg[p])
        }

        function applyParser(srcNode, parser) {
            var p, v, self = this,
                userConfig = self.userConfig || {};
            for (p in parser) p in userConfig || (v = parser[p], BUI.isFunction(v) ? self.setInternal(p, v.call(self, srcNode)) : "string" == typeof v ? self.setInternal(p, srcNode.find(v)) : BUI.isArray(v) && v[0] && self.setInternal(p, srcNode.find(v[0])))
        }

        function initParser(self, srcNode) {
            var len, p, constructorChains, c = self.constructor;
            for (constructorChains = collectConstructorChains(self), len = constructorChains.length - 1; len >= 0; len--) c = constructorChains[len], (p = c[PARSER]) && applyParser.call(self, srcNode, p)
        }

        function initDecorate(self) {
            var userConfig, decorateCfg, _self = self,
                srcNode = _self.get("srcNode");
            srcNode && (srcNode = $(srcNode), _self.setInternal("el", srcNode), _self.setInternal("srcNode", srcNode), userConfig = _self.get("userConfig"), decorateCfg = _self.getDecorateConfig(srcNode), setConfigFields(self, decorateCfg), _self.get("isDecorateChild") && _self.decorateInternal && _self.decorateInternal(srcNode), initParser(self, srcNode))
        }

        function decorate() {
            initDecorate(this)
        }
        var JSON = (require("bui/array"), require("bui/json")),
            prefixCls = BUI.prefix,
            FIELD_PREFIX = "data-",
            FIELD_CFG = FIELD_PREFIX + "cfg",
            PARSER = "PARSER",
            Manager = require("bui/component/manage"),
            regx = /^[\{\[]/;
        return decorate.ATTRS = {
            srcNode: {
                view: !0
            },
            isDecorateChild: {
                value: !1
            },
            decorateCfgFields: {
                value: {
                    id: !0,
                    name: !0,
                    value: !0,
                    title: !0
                }
            }
        }, decorate.prototype = {
            getDecorateConfig: function(el) {
                if (!el.length) return null;
                var _self = this,
                    dom = el[0],
                    attributes = dom.attributes,
                    decorateCfgFields = _self.get("decorateCfgFields"),
                    config = {},
                    statusCfg = _self._getStautsCfg(el);
                return BUI.each(attributes, function(attr) {
                    var name = attr.nodeName;
                    try {
                        if (name === FIELD_CFG) {
                            var cfg = parseFieldValue(attr.nodeValue);
                            BUI.mix(config, cfg)
                        } else if (isConfigField(name, decorateCfgFields)) {
                            name = name.replace(FIELD_PREFIX, "");
                            var value = parseFieldValue(attr.nodeValue);
                            config[name] && BUI.isObject(value) ? BUI.mix(config[name], value) : config[name] = value
                        }
                    } catch (e) {
                        BUI.log("parse field error,the attribute is:" + name)
                    }
                }), BUI.mix(config, statusCfg)
            },
            _getStautsCfg: function(el) {
                var _self = this,
                    rst = {},
                    statusCls = _self.get("statusCls");
                return BUI.each(statusCls, function(v, k) {
                    el.hasClass(v) && (rst[k] = !0)
                }), rst
            },
            getDecorateElments: function() {
                var _self = this,
                    el = _self.get("el"),
                    contentContainer = _self.get("childContainer");
                return contentContainer ? el.find(contentContainer).children() : el.children()
            },
            decorateInternal: function(el) {
                var self = this;
                self.decorateChildren(el)
            },
            findXClassByNode: function(childNode, ignoreError) {
                var _self = this,
                    cls = childNode.attr("class") || "",
                    childClass = _self.get("defaultChildClass");
                cls = cls.replace(new RegExp("\\b" + prefixCls, "ig"), "");
                var UI = Manager.getConstructorByXClass(cls) || Manager.getConstructorByXClass(childClass);
                return UI || ignoreError || (BUI.log(childNode), BUI.error("can not find ui " + cls + " from this markup")), Manager.getXClassByConstructor(UI)
            },
            decorateChildrenInternal: function(xclass, c) {
                var _self = this,
                    children = _self.get("children");
                children.push({
                    xclass: xclass,
                    srcNode: c
                })
            },
            decorateChildren: function(el) {
                var _self = this,
                    children = _self.getDecorateElments();
                BUI.each(children, function(c) {
                    var xclass = _self.findXClassByNode($(c));
                    _self.decorateChildrenInternal(xclass, $(c))
                })
            }
        }, decorate
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function tplView() {}

        function tpl() {}
        return tplView.ATTRS = {
            tpl: {},
            tplEl: {}
        }, tplView.prototype = {
            __renderUI: function() {
                var contentEl, _self = this,
                    contentContainer = _self.get("childContainer");
                contentContainer && (contentEl = _self.get("el").find(contentContainer), contentEl.length && _self.set("contentEl", contentEl))
            },
            getTpl: function(attrs) {
                var _self = this,
                    tpl = _self.get("tpl"),
                    tplRender = _self.get("tplRender");
                return attrs = attrs || _self.getAttrVals(), tplRender ? tplRender(attrs) : tpl ? BUI.substitute(tpl, attrs) : ""
            },
            setTplContent: function(attrs) {
                var _self = this,
                    el = _self.get("el"),
                    content = _self.get("content"),
                    tpl = (_self.get("tplEl"), _self.getTpl(attrs));
                !content && tpl && (el.empty(), el.html(tpl))
            }
        }, tpl.ATTRS = {
            tpl: {
                view: !0,
                sync: !1
            },
            tplRender: {
                view: !0,
                value: null
            },
            childContainer: {
                view: !0
            }
        }, tpl.prototype = {
            __renderUI: function() {
                this.get("srcNode") || this.setTplContent()
            },
            updateContent: function() {
                this.setTplContent()
            },
            setTplContent: function() {
                var _self = this,
                    attrs = _self.getAttrVals();
                _self.get("view").setTplContent(attrs)
            },
            _uiSetTpl: function() {
                this.setTplContent()
            }
        }, tpl.View = tplView, tpl
    }), define("src/hephaistos/js/bui-debug", [], function() {
        var collapsableView = function() {};
        collapsableView.ATTRS = {
            collapsed: {}
        }, collapsableView.prototype = {
            _uiSetCollapsed: function(v) {
                var _self = this,
                    cls = _self.getStatusCls("collapsed"),
                    el = _self.get("el");
                v ? el.addClass(cls) : el.removeClass(cls)
            }
        };
        var collapsable = function() {};
        return collapsable.ATTRS = {
            collapsable: {
                value: !1
            },
            collapsed: {
                view: !0,
                value: !1
            },
            events: {
                value: {
                    expanded: !0,
                    collapsed: !0
                }
            }
        }, collapsable.prototype = {
            _uiSetCollapsed: function(v) {
                var _self = this;
                v ? _self.fire("collapsed") : _self.fire("expanded")
            }
        }, collapsable.View = collapsableView, collapsable
    }), define("src/hephaistos/js/bui-debug", [], function() {
        var selection = function() {};
        return selection.ATTRS = {
            selectedEvent: {
                value: "click"
            },
            events: {
                value: {
                    selectedchange: !1,
                    beforeselectedchange: !1,
                    itemselected: !1,
                    itemunselected: !1
                }
            },
            idField: {
                value: "id"
            },
            multipleSelect: {
                value: !1
            }
        }, selection.prototype = {
            clearSelection: function() {
                var _self = this,
                    selection = _self.getSelection();
                BUI.each(selection, function(item) {
                    _self.clearSelected(item)
                })
            },
            getSelection: function() {},
            getSelected: function() {
                return this.getSelection()[0]
            },
            getSelectedValue: function() {
                var _self = this,
                    field = _self.get("idField"),
                    item = _self.getSelected();
                return _self.getValueByField(item, field)
            },
            getSelectionValues: function() {
                var _self = this,
                    field = _self.get("idField"),
                    items = _self.getSelection();
                return $.map(items, function(item) {
                    return _self.getValueByField(item, field)
                })
            },
            getSelectionText: function() {
                var _self = this,
                    items = _self.getSelection();
                return $.map(items, function(item) {
                    return _self.getItemText(item)
                })
            },
            clearSelected: function(item) {
                var _self = this;
                item = item || _self.getSelected(), item && _self.setItemSelected(item, !1)
            },
            getSelectedText: function() {
                var _self = this,
                    item = _self.getSelected();
                return _self.getItemText(item)
            },
            setSelection: function(items) {
                var _self = this;
                items = BUI.isArray(items) ? items : [items], BUI.each(items, function(item) {
                    _self.setSelected(item)
                })
            },
            setSelected: function(item) {
                var _self = this,
                    multipleSelect = _self.get("multipleSelect");
                if (_self.isItemSelectable(item)) {
                    if (!multipleSelect) {
                        var selectedItem = _self.getSelected();
                        item != selectedItem && _self.clearSelected(selectedItem)
                    }
                    _self.setItemSelected(item, !0)
                }
            },
            isItemSelected: function(item) {},
            isItemSelectable: function(item) {
                return !0
            },
            setItemSelected: function(item, selected) {
                var isSelected, _self = this;
                item && (isSelected = _self.isItemSelected(item), isSelected == selected) || _self.fire("beforeselectedchange", {
                    item: item,
                    selected: selected
                }) !== !1 && _self.setItemSelectedStatus(item, selected)
            },
            setItemSelectedStatus: function(item, selected) {},
            setAllSelection: function() {},
            setSelectedByField: function(field, value) {
                value || (value = field, field = this.get("idField"));
                var _self = this,
                    item = _self.findItemByField(field, value);
                _self.setSelected(item)
            },
            setSelectionByField: function(field, values) {
                values || (values = field, field = this.get("idField"));
                var _self = this;
                BUI.each(values, function(value) {
                    _self.setSelectedByField(field, value)
                })
            },
            afterSelected: function(item, selected, element) {
                var _self = this;
                selected ? (_self.fire("itemselected", {
                    item: item,
                    domTarget: element
                }), _self.fire("selectedchange", {
                    item: item,
                    domTarget: element,
                    selected: selected
                })) : (_self.fire("itemunselected", {
                    item: item,
                    domTarget: element
                }), _self.get("multipleSelect") && _self.fire("selectedchange", {
                    item: item,
                    domTarget: element,
                    selected: selected
                }))
            }
        }, selection
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function beforeAddItem(self, item) {
            var c = item.isController ? item.getAttrVals() : item,
                defaultTpl = self.get("itemTpl"),
                defaultStatusCls = self.get("itemStatusCls"),
                defaultTplRender = self.get("itemTplRender");
            if (defaultTpl && !c.tpl && setItemAttr(item, "tpl", defaultTpl), defaultTplRender && !c.tplRender && setItemAttr(item, "tplRender", defaultTplRender), defaultStatusCls) {
                var statusCls = c.statusCls || item.isController ? item.get("statusCls") : {};
                BUI.each(defaultStatusCls, function(v, k) {
                    v && !statusCls[k] && (statusCls[k] = v)
                }), setItemAttr(item, "statusCls", statusCls)
            }
        }

        function setItemAttr(item, name, val) {
            item.isController ? item.set(name, val) : item[name] = val
        }
        var Selection = require("bui/component/uibase/selection"),
            list = function() {};
        list.ATTRS = {
            items: {
                shared: !1,
                view: !0
            },
            idField: {
                value: "id"
            },
            itemTpl: {
                view: !0
            },
            itemTplRender: {
                view: !0
            },
            itemStatusCls: {
                view: !0,
                value: {}
            },
            events: {
                value: {
                    itemclick: !0
                }
            }
        }, list.prototype = {
            getItemCount: function() {
                return this.getItems().length
            },
            getValueByField: function(item, field) {},
            getItems: function() {},
            getFirstItem: function() {
                return this.getItemAt(0)
            },
            getLastItem: function() {
                return this.getItemAt(this.getItemCount() - 1)
            },
            getItemAt: function(index) {
                return this.getItems()[index] || null
            },
            getItem: function(id) {
                var field = this.get("idField");
                return this.findItemByField(field, id)
            },
            indexOfItem: function(item) {
                return BUI.Array.indexOf(item, this.getItems())
            },
            addItems: function(items) {
                var _self = this;
                BUI.each(items, function(item) {
                    _self.addItem(item)
                })
            },
            addItemsAt: function(items, start) {
                var _self = this;
                BUI.each(items, function(item, index) {
                    _self.addItemAt(item, start + index)
                })
            },
            updateItem: function(item) {},
            addItem: function(item) {
                return this.addItemAt(item, this.getItemCount())
            },
            addItemAt: function(item, index) {},
            findItemByField: function(field, value) {},
            getItemText: function(item) {},
            clearItems: function() {
                var _self = this,
                    items = _self.getItems();
                items.splice(0), _self.clearControl()
            },
            removeItem: function(item) {},
            removeItems: function(items) {
                var _self = this;
                BUI.each(items, function(item) {
                    _self.removeItem(item)
                })
            },
            removeItemAt: function(index) {
                this.removeItem(this.getItemAt(index))
            },
            clearControl: function() {}
        };
        var childList = function() {
            this.__init()
        };
        return childList.ATTRS = BUI.merge(!0, list.ATTRS, Selection.ATTRS, {
            items: {
                sync: !1
            },
            autoInitItems: {
                value: !0
            },
            isDecorateChild: {
                value: !0
            },
            defaultLoaderCfg: {
                value: {
                    property: "children",
                    dataType: "json"
                }
            }
        }), BUI.augment(childList, list, Selection, {
            __init: function() {
                var _self = this,
                    items = _self.get("items");
                items && _self.get("autoInitItems") && _self.addItems(items), _self.on("beforeRenderUI", function() {
                    _self._beforeRenderUI()
                })
            },
            _uiSetItems: function(items) {
                var _self = this;
                _self.clearControl(), _self.addItems(items)
            },
            _beforeRenderUI: function() {
                var _self = this,
                    children = _self.get("children");
                _self.get("items");
                BUI.each(children, function(item) {
                    beforeAddItem(_self, item)
                })
            },
            __bindUI: function() {
                var _self = this,
                    selectedEvent = _self.get("selectedEvent");
                _self.on(selectedEvent, function(e) {
                    var item = e.target;
                    item.get("selectable") && (item.get("selected") ? _self.get("multipleSelect") && _self.clearSelected(item) : _self.setSelected(item))
                }), _self.on("click", function(e) {
                    e.target !== _self && _self.fire("itemclick", {
                        item: e.target,
                        domTarget: e.domTarget,
                        domEvent: e
                    })
                }), _self.on("beforeAddChild", function(ev) {
                    beforeAddItem(_self, ev.child)
                }), _self.on("beforeRemoveChild", function(ev) {
                    var item = ev.child,
                        selected = item.get("selected");
                    selected && (_self.get("multipleSelect") ? _self.clearSelected(item) : _self.setSelected(null)), item.set("selected", !1)
                })
            },
            clearControl: function() {
                this.removeChildren(!0)
            },
            getItems: function() {
                return this.get("children")
            },
            updateItem: function(item) {
                var _self = this,
                    idField = _self.get("idField"),
                    element = _self.findItemByField(idField, item[idField]);
                return element && element.setTplContent(), element
            },
            removeItem: function(item) {
                var _self = this,
                    idField = _self.get("idField");
                item instanceof BUI.Component.Controller || (item = _self.findItemByField(idField, item[idField])), this.removeChild(item, !0)
            },
            addItemAt: function(item, index) {
                return this.addChild(item, index)
            },
            findItemByField: function(field, value, root) {
                root = root || this;
                var _self = this,
                    children = root.get("children"),
                    result = null;
                return $(children).each(function(index, item) {
                    if (item.get(field) == value ? result = item : item.get("children").length && (result = _self.findItemByField(field, value, item)), result) return !1
                }), result
            },
            getItemText: function(item) {
                return item.get("el").text()
            },
            getValueByField: function(item, field) {
                return item && item.get(field)
            },
            setItemSelectedStatus: function(item, selected) {
                var _self = this,
                    element = null;
                item && (item.set("selected", selected), element = item.get("el")), _self.afterSelected(item, selected, element)
            },
            isItemSelected: function(item) {
                return !!item && item.get("selected")
            },
            setAllSelection: function() {
                var _self = this,
                    items = _self.getItems();
                _self.setSelection(items)
            },
            getSelection: function() {
                var _self = this,
                    items = _self.getItems(),
                    rst = [];
                return BUI.each(items, function(item) {
                    _self.isItemSelected(item) && rst.push(item)
                }), rst
            }
        }), list.ChildList = childList, list
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var childCfg = function(config) {
            this._init()
        };
        return childCfg.ATTRS = {
            defaultChildCfg: {}
        }, childCfg.prototype = {
            _init: function() {
                var _self = this,
                    defaultChildCfg = _self.get("defaultChildCfg");
                defaultChildCfg && _self.on("beforeAddChild", function(ev) {
                    var child = ev.child;
                    $.isPlainObject(child) && BUI.each(defaultChildCfg, function(v, k) {
                        null == child[k] && (child[k] = v)
                    })
                })
            }
        }, childCfg
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getDepend(name) {
            var arr = regexp.exec(name),
                id = arr[1],
                eventType = arr[2],
                source = getSource(id);
            return {
                source: source,
                eventType: eventType
            }
        }

        function bindDepend(self, name, action) {
            var callbak, depend = getDepend(name),
                source = depend.source,
                eventType = depend.eventType;
            return source && action && eventType && (BUI.isFunction(action) ? callbak = action : BUI.isArray(action) && (callbak = function() {
                BUI.each(action, function(methodName) {
                    self[methodName] && self[methodName]()
                })
            })), callbak ? (depend.callbak = callbak, source.on(eventType, callbak), depend) : null
        }

        function offDepend(depend) {
            var source = depend.source,
                eventType = depend.eventType,
                callbak = depend.callbak;
            source.off(eventType, callbak)
        }

        function getSource(id) {
            var control = Manager.getComponent(id);
            return control || (control = $("#" + id), control.length || (control = null)), control
        }

        function Depends() {}
        var regexp = /^#(.*):(.*)$/,
            Manager = require("bui/component/manage");
        return Depends.ATTRS = {
            depends: {},
            dependencesMap: {
                shared: !1,
                value: {}
            }
        }, Depends.prototype = {
            __syncUI: function() {
                this.initDependences()
            },
            initDependences: function() {
                var _self = this,
                    depends = _self.get("depends");
                BUI.each(depends, function(action, name) {
                    _self.addDependence(name, action)
                })
            },
            addDependence: function(name, action) {
                var depend, _self = this,
                    dependencesMap = _self.get("dependencesMap");
                _self.removeDependence(name), depend = bindDepend(_self, name, action), depend && (dependencesMap[name] = depend)
            },
            removeDependence: function(name) {
                var _self = this,
                    dependencesMap = _self.get("dependencesMap"),
                    depend = dependencesMap[name];
                depend && (offDepend(depend), delete dependencesMap[name])
            },
            clearDependences: function() {
                var _self = this,
                    map = _self.get("dependencesMap");
                BUI.each(map, function(depend, name) {
                    offDepend(depend)
                }), _self.set("dependencesMap", {})
            },
            __destructor: function() {
                this.clearDependences()
            }
        }, Depends
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function bindable() {}
        return bindable.ATTRS = {
            store: {},
            loadMask: {
                value: !1
            }
        }, BUI.augment(bindable, {
            __bindUI: function() {
                var _self = this,
                    store = _self.get("store"),
                    loadMask = _self.get("loadMask");
                store && (store.on("beforeload", function(e) {
                    _self.onBeforeLoad(e), loadMask && loadMask.show && loadMask.show()
                }), store.on("load", function(e) {
                    _self.onLoad(e), loadMask && loadMask.hide && loadMask.hide()
                }), store.on("exception", function(e) {
                    _self.onException(e), loadMask && loadMask.hide && loadMask.hide()
                }), store.on("add", function(e) {
                    _self.onAdd(e)
                }), store.on("remove", function(e) {
                    _self.onRemove(e)
                }), store.on("update", function(e) {
                    _self.onUpdate(e)
                }), store.on("localsort", function(e) {
                    _self.onLocalSort(e)
                }))
            },
            __syncUI: function() {
                var _self = this,
                    store = _self.get("store");
                store && store.hasData() && _self.onLoad()
            },
            onBeforeLoad: function(e) {},
            onLoad: function(e) {},
            onException: function(e) {},
            onAdd: function(e) {},
            onRemove: function(e) {},
            onUpdate: function(e) {},
            onLocalSort: function(e) {}
        }), bindable
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Manager = (window, require("bui/component/manage")),
            UIBase = require("bui/component/uibase"),
            doc = document,
            View = UIBase.extend([UIBase.TplView], {
                getComponentCssClassWithState: function(state) {
                    var self = this,
                        componentCls = self.get("ksComponentCss");
                    return state = state || "", self.getCssClassWithPrefix(componentCls.split(/\s+/).join(state + " ") + state)
                },
                getCssClassWithPrefix: Manager.getCssClassWithPrefix,
                getKeyEventTarget: function() {
                    return this.get("el")
                },
                getContentElement: function() {
                    return this.get("contentEl") || this.get("el")
                },
                getStatusCls: function(name) {
                    var self = this,
                        statusCls = self.get("statusCls"),
                        cls = statusCls[name];
                    return cls || (cls = self.getComponentCssClassWithState("-" + name)), cls
                },
                renderUI: function() {
                    var self = this;
                    if (!self.get("srcNode")) {
                        var render = self.get("render"),
                            el = self.get("el"),
                            renderBefore = self.get("elBefore");
                        renderBefore ? el.insertBefore(renderBefore, void 0) : render ? el.appendTo(render, void 0) : el.appendTo(doc.body, void 0)
                    }
                },
                createDom: function() {
                    var self = this,
                        contentEl = self.get("contentEl"),
                        el = self.get("el");
                    self.get("srcNode") || (el = $("<" + self.get("elTagName") + ">"), contentEl && el.append(contentEl), self.setInternal("el", el)), el.addClass(self.getComponentCssClassWithState()), contentEl || self.setInternal("contentEl", el)
                },
                _uiSetHighlighted: function(v) {
                    var self = this,
                        componentCls = self.getStatusCls("hover"),
                        el = self.get("el");
                    el[v ? "addClass" : "removeClass"](componentCls)
                },
                _uiSetDisabled: function(v) {
                    var self = this,
                        componentCls = self.getStatusCls("disabled"),
                        el = self.get("el");
                    el[v ? "addClass" : "removeClass"](componentCls).attr("aria-disabled", v), v && self.get("highlighted") && self.set("highlighted", !1), self.get("focusable") && self.getKeyEventTarget().attr("tabIndex", v ? -1 : 0)
                },
                _uiSetActive: function(v) {
                    var self = this,
                        componentCls = self.getStatusCls("active");
                    self.get("el")[v ? "addClass" : "removeClass"](componentCls).attr("aria-pressed", !!v)
                },
                _uiSetFocused: function(v) {
                    var self = this,
                        el = self.get("el"),
                        componentCls = self.getStatusCls("focused");
                    el[v ? "addClass" : "removeClass"](componentCls)
                },
                _uiSetElAttrs: function(attrs) {
                    this.get("el").attr(attrs)
                },
                _uiSetElCls: function(cls) {
                    this.get("el").addClass(cls)
                },
                _uiSetElStyle: function(style) {
                    this.get("el").css(style)
                },
                _uiSetRole: function(role) {
                    role && this.get("el").attr("role", role)
                },
                _uiSetWidth: function(w) {
                    this.get("el").width(w)
                },
                _uiSetHeight: function(h) {
                    var self = this;
                    self.get("el").height(h)
                },
                _uiSetContent: function(c) {
                    var el, self = this;
                    self.get("srcNode") && !self.get("rendered") || (el = self.get("contentEl"), "string" == typeof c ? el.html(c) : c && el.empty().append(c))
                },
                _uiSetVisible: function(isVisible) {
                    var self = this,
                        el = self.get("el"),
                        visibleMode = self.get("visibleMode");
                    "visibility" === visibleMode ? el.css("visibility", isVisible ? "visible" : "hidden") : el.css("display", isVisible ? "" : "none")
                },
                set: function(name, value) {
                    var ev, ucName, m, _self = this,
                        attr = _self.__attrs[name];
                    if (!attr || !_self.get("binded")) return View.superclass.set.call(this, name, value), _self;
                    var prevVal = View.superclass.get.call(this, name);
                    return $.isPlainObject(value) || BUI.isArray(value) || prevVal !== value ? (View.superclass.set.call(this, name, value), value = _self.__attrVals[name], ev = {
                        attrName: name,
                        prevVal: prevVal,
                        newVal: value
                    }, ucName = BUI.ucfirst(name), m = "_uiSet" + ucName, _self[m] && _self[m](value, ev), _self) : _self
                },
                destructor: function() {
                    var el = this.get("el");
                    el && el.remove()
                }
            }, {
                xclass: "view",
                priority: 0
            });
        return View.ATTRS = {
            el: {
                setter: function(v) {
                    return $(v)
                }
            },
            elCls: {},
            elStyle: {},
            role: {},
            width: {},
            height: {},
            statusCls: {
                value: {}
            },
            elTagName: {
                value: "div"
            },
            elAttrs: {},
            content: {},
            elBefore: {},
            render: {},
            visible: {
                value: !0
            },
            visibleMode: {
                value: "display"
            },
            cachePosition: {},
            contentEl: {
                valueFn: function() {
                    return this.get("el")
                }
            },
            prefixCls: {
                value: BUI.prefix
            },
            focusable: {
                value: !0
            },
            focused: {},
            active: {},
            disabled: {},
            highlighted: {}
        }, View
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";
        var BUI = require("bui/util"),
            Base = require("bui/base"),
            Loader = function(config) {
                Loader.superclass.constructor.call(this, config), this._init()
            };
        return Loader.ATTRS = {
            url: {},
            target: {},
            hasLoad: {
                value: !1
            },
            autoLoad: {},
            lazyLoad: {},
            property: {},
            renderer: {
                value: function(value) {
                    return value
                }
            },
            loadMask: {
                value: !1
            },
            dataType: {
                value: "text"
            },
            ajaxOptions: {
                value: {
                    type: "get",
                    cache: !1
                }
            },
            params: {},
            appendParams: {},
            lastParams: {
                shared: !1,
                value: {}
            },
            callback: {},
            failure: {}
        }, BUI.extend(Loader, Base), BUI.augment(Loader, {
            isLoader: !0,
            _init: function() {
                var _self = this,
                    autoLoad = _self.get("autoLoad"),
                    params = _self.get("params");
                _self._initMask(), autoLoad ? _self.load(params) : (_self._initParams(), _self._initLazyLoad())
            },
            _initLazyLoad: function() {
                var _self = this,
                    target = _self.get("target"),
                    lazyLoad = _self.get("lazyLoad");
                target && lazyLoad && lazyLoad.event && target.on(lazyLoad.event, function() {
                    _self.get("hasLoad") && !lazyLoad.repeat || _self.load()
                })
            },
            _initMask: function() {
                var _self = this,
                    target = _self.get("target"),
                    loadMask = _self.get("loadMask");
                target && loadMask && BUI.use("bui/mask", function(Mask) {
                    var cfg = $.isPlainObject(loadMask) ? loadMask : {};
                    loadMask = new Mask.LoadMask(BUI.mix({
                        el: target.get("el")
                    }, cfg)), _self.set("loadMask", loadMask)
                })
            },
            _initParams: function() {
                var _self = this,
                    lastParams = _self.get("lastParams"),
                    params = _self.get("params");
                BUI.mix(lastParams, params)
            },
            load: function(params) {
                var _self = this,
                    url = _self.get("url"),
                    ajaxOptions = _self.get("ajaxOptions"),
                    lastParams = _self.get("lastParams"),
                    appendParams = _self.get("appendParams");
                params = params || lastParams, params = BUI.merge(appendParams, params), _self.set("lastParams", params), url && (_self.onBeforeLoad(), _self.set("hasLoad", !0), $.ajax(BUI.mix({
                    dataType: _self.get("dataType"),
                    data: params,
                    url: url,
                    success: function(data) {
                        _self.onload(data, params)
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        _self.onException({
                            jqXHR: jqXHR,
                            textStatus: textStatus,
                            errorThrown: errorThrown
                        }, params)
                    }
                }, ajaxOptions)))
            },
            onBeforeLoad: function() {
                var _self = this,
                    loadMask = _self.get("loadMask");
                loadMask && loadMask.show && loadMask.show()
            },
            onload: function(data, params) {
                var _self = this,
                    loadMask = _self.get("loadMask"),
                    property = _self.get("property"),
                    callback = _self.get("callback"),
                    renderer = _self.get("renderer"),
                    target = _self.get("target");
                target.set(property, renderer.call(_self, data)), loadMask && loadMask.hide && loadMask.hide(), callback && callback.call(this, data, params)
            },
            onException: function(response, params) {
                var _self = this,
                    failure = _self.get("failure");
                failure && failure.call(this, response, params)
            }
        }), Loader
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";

        function initChild(self, c, renderBefore) {
            self.create();
            var contentEl = self.getContentElement(),
                defaultCls = self.get("defaultChildClass");
            return c.xclass || c instanceof Controller || (c.xtype ? c.xclass = defaultCls + "-" + c.xtype : c.xclass = defaultCls), c = BUI.Component.create(c, self), c.setInternal("parent", self), c.set("render", contentEl), c.set("elBefore", renderBefore), c.create(void 0), c
        }

        function constructView(self) {
            var attrs, attrCfg, attrName, v, cfg = {},
                Render = self.get("xview");
            attrs = self.getAttrs();
            for (attrName in attrs) attrs.hasOwnProperty(attrName) && (attrCfg = attrs[attrName], attrCfg.view && void 0 !== (v = self.get(attrName)) && (cfg[attrName] = v));
            return delete cfg.autoRender, cfg.ksComponentCss = getComponentCss(self), new Render(cfg)
        }

        function getComponentCss(self) {
            for (var cls, constructor = self.constructor, re = []; constructor && constructor !== Controller;) cls = Manager.getXClassByConstructor(constructor), cls && re.push(cls), constructor = constructor.superclass && constructor.superclass.constructor;
            return re.join(" ")
        }

        function isMouseEventWithinElement(e, elem) {
            var relatedTarget = e.relatedTarget;
            return relatedTarget && (relatedTarget === elem[0] || $.contains(elem, relatedTarget))
        }
        var UIBase = require("bui/component/uibase"),
            Manager = require("bui/component/manage"),
            View = require("bui/component/view"),
            Loader = require("bui/component/loader"),
            wrapBehavior = BUI.wrapBehavior,
            getWrapBehavior = BUI.getWrapBehavior,
            Controller = UIBase.extend([UIBase.Decorate, UIBase.Tpl, UIBase.ChildCfg, UIBase.KeyNav, UIBase.Depends], {
                isController: !0,
                getCssClassWithPrefix: Manager.getCssClassWithPrefix,
                initializer: function() {
                    var self = this;
                    self.get("id") || self.set("id", self.getNextUniqueId()), Manager.addComponent(self.get("id"), self);
                    var view = constructView(self);
                    self.setInternal("view", view), self.__view = view
                },
                getNextUniqueId: function() {
                    var self = this,
                        xclass = Manager.getXClassByConstructor(self.constructor);
                    return BUI.guid(xclass)
                },
                createDom: function() {
                    var self = this,
                        view = self.get("view");
                    view.create(void 0)
                },
                renderUI: function() {
                    var self = this,
                        loader = self.get("loader");
                    self.get("view").render(), self._initChildren(), loader && self.setInternal("loader", loader)
                },
                _initChildren: function(children) {
                    var i, children, child, self = this;
                    for (children = children || self.get("children").concat(), self.get("children").length = 0, i = 0; i < children.length; i++) child = self.addChild(children[i]), child.render()
                },
                bindUI: function() {
                    var self = this,
                        events = self.get("events");
                    this.on("afterVisibleChange", function(e) {
                        this.fire(e.newVal ? "show" : "hide")
                    }), BUI.each(events, function(v, k) {
                        self.publish(k, {
                            bubbles: v
                        })
                    })
                },
                containsElement: function(elem) {
                    var _self = this,
                        el = _self.get("el"),
                        children = _self.get("children"),
                        result = !1;
                    return !!_self.get("rendered") && ($.contains(el[0], elem) || el[0] === elem ? result = !0 : BUI.each(children, function(item) {
                        if (item.containsElement(elem)) return result = !0, !1
                    }), result)
                },
                isChildrenElement: function(elem) {
                    var _self = this,
                        children = _self.get("children"),
                        rst = !1;
                    return BUI.each(children, function(child) {
                        if (child.containsElement(elem)) return rst = !0, !1
                    }), rst
                },
                show: function() {
                    var self = this;
                    return self.render(), self.set("visible", !0), self
                },
                hide: function() {
                    var self = this;
                    return self.set("visible", !1), self
                },
                toggle: function() {
                    return this.set("visible", !this.get("visible")), this
                },
                _uiSetFocusable: function(focusable) {
                    var t, self = this,
                        el = self.getKeyEventTarget();
                    focusable ? el.attr("tabIndex", 0).attr("hideFocus", !0).on("focus", wrapBehavior(self, "handleFocus")).on("blur", wrapBehavior(self, "handleBlur")).on("keydown", wrapBehavior(self, "handleKeydown")).on("keyup", wrapBehavior(self, "handleKeyUp")) : (el.removeAttr("tabIndex"), (t = getWrapBehavior(self, "handleFocus")) && el.off("focus", t), (t = getWrapBehavior(self, "handleBlur")) && el.off("blur", t), (t = getWrapBehavior(self, "handleKeydown")) && el.off("keydown", t), (t = getWrapBehavior(self, "handleKeyUp")) && el.off("keyup", t))
                },
                _uiSetHandleMouseEvents: function(handleMouseEvents) {
                    var t, self = this,
                        el = self.get("el");
                    handleMouseEvents ? el.on("mouseenter", wrapBehavior(self, "handleMouseEnter")).on("mouseleave", wrapBehavior(self, "handleMouseLeave")).on("contextmenu", wrapBehavior(self, "handleContextMenu")).on("mousedown", wrapBehavior(self, "handleMouseDown")).on("mouseup", wrapBehavior(self, "handleMouseUp")).on("dblclick", wrapBehavior(self, "handleDblClick")) : (t = getWrapBehavior(self, "handleMouseEnter") && el.off("mouseenter", t), t = getWrapBehavior(self, "handleMouseLeave") && el.off("mouseleave", t), t = getWrapBehavior(self, "handleContextMenu") && el.off("contextmenu", t), t = getWrapBehavior(self, "handleMouseDown") && el.off("mousedown", t), t = getWrapBehavior(self, "handleMouseUp") && el.off("mouseup", t), t = getWrapBehavior(self, "handleDblClick") && el.off("dblclick", t))
                },
                _uiSetFocused: function(v) {
                    v && this.getKeyEventTarget()[0].focus()
                },
                _uiSetVisible: function(isVisible) {
                    var self = this,
                        visibleMode = (self.get("el"), self.get("visibleMode"));
                    if ("visibility" === visibleMode) {
                        if (isVisible) {
                            var position = self.get("cachePosition");
                            position && self.set("xy", position)
                        }
                        if (!isVisible) {
                            var position = [self.get("x"), self.get("y")];
                            self.set("cachePosition", position), self.set("xy", [-999, -999])
                        }
                    }
                },
                _uiSetChildren: function(v) {
                    var self = this,
                        children = BUI.cloneObject(v);
                    self._initChildren(children)
                },
                enable: function() {
                    return this.set("disabled", !1), this
                },
                disable: function() {
                    return this.set("disabled", !0), this
                },
                focus: function() {
                    this.get("focusable") && this.set("focused", !0)
                },
                getContentElement: function() {
                    return this.get("view").getContentElement()
                },
                getKeyEventTarget: function() {
                    return this.get("view").getKeyEventTarget()
                },
                addChild: function(c, index) {
                    var renderBefore, self = this,
                        children = self.get("children");
                    return void 0 === index && (index = children.length), self.fire("beforeAddChild", {
                        child: c,
                        index: index
                    }), renderBefore = children[index] && children[index].get("el") || null, c = initChild(self, c, renderBefore), children.splice(index, 0, c), self.get("rendered") && c.render(), self.fire("afterAddChild", {
                        child: c,
                        index: index
                    }), c
                },
                remove: function(destroy) {
                    var self = this,
                        parent = self.get("parent");
                    return parent ? parent.removeChild(self, destroy) : destroy && self.destroy(), self
                },
                removeChild: function(c, destroy) {
                    var self = this,
                        children = self.get("children"),
                        index = BUI.Array.indexOf(c, children);
                    if (index !== -1) return self.fire("beforeRemoveChild", {
                        child: c,
                        destroy: destroy
                    }), index !== -1 && children.splice(index, 1), destroy && c.destroy && c.destroy(), self.fire("afterRemoveChild", {
                        child: c,
                        destroy: destroy
                    }), c
                },
                removeChildren: function(destroy) {
                    var i, self = this,
                        t = [].concat(self.get("children"));
                    for (i = 0; i < t.length; i++) self.removeChild(t[i], destroy)
                },
                getChildAt: function(index) {
                    var children = this.get("children");
                    return children[index] || null
                },
                getChild: function(id, deep) {
                    return this.getChildBy(function(item) {
                        return item.get("id") === id
                    }, deep)
                },
                getChildBy: function(math, deep) {
                    return this.getChildrenBy(math, deep)[0] || null
                },
                getAppendHeight: function() {
                    var el = this.get("el");
                    return el.outerHeight() - el.height()
                },
                getAppendWidth: function() {
                    var el = this.get("el");
                    return el.outerWidth() - el.width()
                },
                getChildrenBy: function(math, deep) {
                    var self = this,
                        results = [];
                    return math ? (self.eachChild(function(child) {
                        math(child) ? results.push(child) : deep && (results = results.concat(child.getChildrenBy(math, deep)))
                    }), results) : results
                },
                eachChild: function(func) {
                    BUI.each(this.get("children"), func)
                },
                handleDblClick: function(ev) {
                    this.performActionInternal(ev), this.isChildrenElement(ev.target) || this.fire("dblclick", {
                        domTarget: ev.target,
                        domEvent: ev
                    })
                },
                handleMouseOver: function(ev) {
                    var self = this,
                        el = self.get("el");
                    isMouseEventWithinElement(ev, el) || self.handleMouseEnter(ev)
                },
                handleMouseOut: function(ev) {
                    var self = this,
                        el = self.get("el");
                    isMouseEventWithinElement(ev, el) || self.handleMouseLeave(ev)
                },
                handleMouseEnter: function(ev) {
                    var self = this;
                    this.set("highlighted", !!ev), self.fire("mouseenter", {
                        domTarget: ev.target,
                        domEvent: ev
                    })
                },
                handleMouseLeave: function(ev) {
                    var self = this;
                    self.set("active", !1), self.set("highlighted", !ev), self.fire("mouseleave", {
                        domTarget: ev.target,
                        domEvent: ev
                    })
                },
                handleMouseDown: function(ev) {
                    var n, el, self = this,
                        isMouseActionButton = ($(ev.target), 1 === ev.which);
                    isMouseActionButton && (el = self.getKeyEventTarget(), self.get("activeable") && self.set("active", !0), self.get("focusable") && self.setInternal("focused", !0), self.get("allowTextSelection") || (n = ev.target.nodeName, n = n && n.toLowerCase(), "input" !== n && "textarea" !== n && ev.preventDefault()), self.isChildrenElement(ev.target) || self.fire("mousedown", {
                        domTarget: ev.target,
                        domEvent: ev
                    }))
                },
                handleMouseUp: function(ev) {
                    var self = this,
                        isChildrenElement = self.isChildrenElement(ev.target);
                    self.get("active") && 1 === ev.which && (self.performActionInternal(ev), self.set("active", !1), isChildrenElement || self.fire("click", {
                        domTarget: ev.target,
                        domEvent: ev
                    })), isChildrenElement || self.fire("mouseup", {
                        domTarget: ev.target,
                        domEvent: ev
                    })
                },
                handleContextMenu: function(ev) {},
                handleFocus: function(ev) {
                    this.set("focused", !!ev), this.fire("focus", {
                        domEvent: ev,
                        domTarget: ev.target
                    })
                },
                handleBlur: function(ev) {
                    this.set("focused", !ev), this.fire("blur", {
                        domEvent: ev,
                        domTarget: ev.target
                    })
                },
                handleKeyEventInternal: function(ev) {
                    var self = this,
                        isChildrenElement = self.isChildrenElement(ev.target);
                    return 13 === ev.which ? (isChildrenElement || self.fire("click", {
                        domTarget: ev.target,
                        domEvent: ev
                    }), this.performActionInternal(ev)) : void(isChildrenElement || self.fire("keydown", {
                        domTarget: ev.target,
                        domEvent: ev
                    }))
                },
                handleKeydown: function(ev) {
                    var self = this;
                    if (self.handleKeyEventInternal(ev)) return ev.halt(), !0
                },
                handleKeyUp: function(ev) {
                    var self = this;
                    self.isChildrenElement(ev.target) || self.fire("keyup", {
                        domTarget: ev.target,
                        domEvent: ev
                    })
                },
                performActionInternal: function(ev) {},
                destructor: function() {
                    var id, i, self = this,
                        children = self.get("children");
                    for (id = self.get("id"), i = 0; i < children.length; i++) children[i].destroy && children[i].destroy();
                    self.get("view").destroy(), Manager.removeComponent(id)
                },
                set: function(name, value, opt) {
                    var ucName, ev, m, _self = this,
                        view = _self.__view,
                        attr = _self.__attrs[name];
                    if (BUI.isObject(name) && (opt = value, BUI.each(name, function(v, k) {
                            _self.set(k, v, opt)
                        })), !view || !attr || opt && opt.silent) return Controller.superclass.set.call(this, name, value, opt), _self;
                    var prevVal = Controller.superclass.get.call(this, name);
                    return $.isPlainObject(value) || BUI.isArray(value) || prevVal !== value ? (ucName = BUI.ucfirst(name), m = "_uiSet" + ucName, _self.fire("before" + ucName + "Change", {
                        attrName: name,
                        prevVal: prevVal,
                        newVal: value
                    }), _self.setInternal(name, value), value = _self.__attrVals[name], view && attr.view && view.set(name, value), ev = {
                        attrName: name,
                        prevVal: prevVal,
                        newVal: value
                    }, _self.fire("after" + ucName + "Change", ev), _self.get("binded") && _self[m] && _self[m](value, ev), _self) : _self
                },
                get: function(name) {
                    var _self = this,
                        view = _self.__view,
                        attr = _self.__attrs[name],
                        value = Controller.superclass.get.call(this, name);
                    return void 0 !== value ? value : view && attr && attr.view ? view.get(name) : value
                }
            }, {
                ATTRS: {
                    content: {
                        view: 1
                    },
                    elTagName: {
                        view: !0,
                        value: "div"
                    },
                    defaultChildClass: {},
                    xtype: {},
                    id: {
                        view: !0
                    },
                    width: {
                        view: 1
                    },
                    height: {
                        view: 1
                    },
                    elCls: {
                        view: 1
                    },
                    elStyle: {
                        view: 1
                    },
                    elAttrs: {
                        view: 1
                    },
                    elBefore: {
                        view: 1
                    },
                    el: {
                        view: 1
                    },
                    events: {
                        value: {
                            click: !0,
                            dblclick: !0,
                            mouseenter: !0,
                            mouseleave: !0,
                            keydown: !0,
                            keyup: !0,
                            focus: !1,
                            blur: !1,
                            mousedown: !0,
                            mouseup: !0,
                            show: !1,
                            hide: !1
                        }
                    },
                    render: {
                        view: 1
                    },
                    role: {
                        view: 1
                    },
                    statusCls: {
                        view: !0,
                        value: {}
                    },
                    visibleMode: {
                        view: 1,
                        value: "display"
                    },
                    visible: {
                        value: !0,
                        view: 1
                    },
                    handleMouseEvents: {
                        value: !0
                    },
                    focusable: {
                        value: !1,
                        view: 1
                    },
                    defaultLoaderCfg: {
                        value: {
                            property: "content",
                            autoLoad: !0
                        }
                    },
                    loader: {
                        getter: function(v) {
                            var defaultCfg, _self = this;
                            return v && !v.isLoader && (v.target = _self, defaultCfg = _self.get("defaultLoaderCfg"), v = new Loader(BUI.merge(defaultCfg, v)), _self.setInternal("loader", v)), v
                        }
                    },
                    allowTextSelection: {
                        value: !0
                    },
                    activeable: {
                        value: !0
                    },
                    focused: {
                        view: 1
                    },
                    active: {
                        view: 1
                    },
                    highlighted: {
                        view: 1
                    },
                    children: {
                        sync: !1,
                        shared: !1,
                        value: []
                    },
                    prefixCls: {
                        value: BUI.prefix,
                        view: 1
                    },
                    parent: {
                        setter: function(p) {
                            this.addTarget(p)
                        }
                    },
                    disabled: {
                        view: 1,
                        value: !1
                    },
                    xview: {
                        value: View
                    }
                },
                PARSER: {
                    visible: function(el) {
                        var _self = this,
                            display = el.css("display"),
                            visibility = el.css("visibility"),
                            visibleMode = _self.get("visibleMode");
                        return !("none" == display && "display" == visibleMode || "hidden" == visibility && "visibility" == visibleMode)
                    }
                }
            }, {
                xclass: "controller",
                priority: 0
            });
        return Controller
    }), define("src/hephaistos/js/bui-debug", [], function() {
        function isNotEmptyString(val) {
            return "string" == typeof val && "" !== val
        }
        var doc = document,
            MILLISECONDS_OF_DAY = 864e5,
            encode = encodeURIComponent,
            decode = decodeURIComponent,
            Cookie = {
                get: function(name) {
                    var ret, m;
                    return isNotEmptyString(name) && (m = String(doc.cookie).match(new RegExp("(?:^| )" + name + "(?:(?:=([^;]*))|;|$)"))) && (ret = m[1] ? decode(m[1]) : ""), ret
                },
                set: function(name, val, expires, domain, path, secure) {
                    var text = String(encode(val)),
                        date = expires;
                    "number" == typeof date && (date = new Date, date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY)), date instanceof Date && (text += "; expires=" + date.toUTCString()), isNotEmptyString(domain) && (text += "; domain=" + domain), isNotEmptyString(path) && (text += "; path=" + path), secure && (text += "; secure"), doc.cookie = name + "=" + text
                },
                remove: function(name, domain, path, secure) {
                    this.set(name, "", -1, domain, path, secure)
                }
            };
        return BUI.Cookie = Cookie, Cookie
    }),
    function() {
        var BASE = "bui/data/";
        define("src/hephaistos/js/bui-debug", [], function(r) {
            var BUI = r("bui/common"),
                Data = BUI.namespace("Data");
            return BUI.mix(Data, {
                Sortable: r(BASE + "sortable"),
                Proxy: r(BASE + "proxy"),
                AbstractStore: r(BASE + "abstractstore"),
                Store: r(BASE + "store"),
                Node: r(BASE + "node"),
                TreeStore: r(BASE + "treestore")
            }), Data
        })
    }(), define("src/hephaistos/js/bui-debug", [], function() {
        var ASC = "ASC",
            sortable = function() {};
        return sortable.ATTRS = {
            compareFunction: {
                value: function(v1, v2) {
                    return void 0 === v1 && (v1 = ""), void 0 === v2 && (v2 = ""), BUI.isString(v1) ? v1.localeCompare(v2) : v1 > v2 ? 1 : v1 === v2 ? 0 : -1
                }
            },
            sortField: {},
            sortDirection: {
                value: "ASC"
            },
            sortInfo: {
                getter: function() {
                    var _self = this,
                        field = _self.get("sortField");
                    return {
                        field: field,
                        direction: _self.get("sortDirection")
                    }
                },
                setter: function(v) {
                    var _self = this;
                    _self.set("sortField", v.field), _self.set("sortDirection", v.direction)
                }
            }
        }, BUI.augment(sortable, {
            compare: function(obj1, obj2, field, direction) {
                var dir, _self = this;
                return field = field || _self.get("sortField"), direction = direction || _self.get("sortDirection"), field && direction ? (dir = direction === ASC ? 1 : -1, _self.get("compareFunction")(obj1[field], obj2[field]) * dir) : 1
            },
            getSortData: function() {},
            sortData: function(field, direction, records) {
                var _self = this,
                    records = records || _self.getSortData();
                return BUI.isArray(field) && (records = field, field = null), field = field || _self.get("sortField"), direction = direction || _self.get("sortDirection"), _self.set("sortField", field), _self.set("sortDirection", direction), field && direction ? (records.sort(function(obj1, obj2) {
                    return _self.compare(obj1, obj2, field, direction)
                }), records) : records
            }
        }), sortable
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Sortable = require("bui/data/sortable"),
            proxy = function(config) {
                proxy.superclass.constructor.call(this, config)
            };
        proxy.ATTRS = {}, BUI.extend(proxy, BUI.Base), BUI.augment(proxy, {
            _read: function(params, callback) {},
            read: function(params, callback, scope) {
                var _self = this;
                scope = scope || _self, _self._read(params, function(data) {
                    callback.call(scope, data)
                })
            },
            _save: function(ype, data, callback) {},
            save: function(type, saveData, callback, scope) {
                var _self = this;
                scope = scope || _self, _self._save(type, saveData, function(data) {
                    callback.call(scope, data)
                })
            }
        });
        var TYPE_AJAX = {
                READ: "read",
                ADD: "add",
                UPDATE: "update",
                REMOVE: "remove",
                SAVE_ALL: "all"
            },
            ajaxProxy = function(config) {
                ajaxProxy.superclass.constructor.call(this, config)
            };
        ajaxProxy.ATTRS = BUI.mix(!0, proxy.ATTRS, {
            limitParam: {
                value: "limit"
            },
            startParam: {
                value: "start"
            },
            pageIndexParam: {
                value: "pageIndex"
            },
            saveTypeParam: {
                value: "saveType"
            },
            saveDataParam: {},
            pageStart: {
                value: 0
            },
            dataType: {
                value: "json"
            },
            method: {
                value: "GET"
            },
            ajaxOptions: {
                value: {}
            },
            cache: {
                value: !1
            },
            save: {},
            url: {}
        }), BUI.extend(ajaxProxy, proxy), BUI.augment(ajaxProxy, {
            _processParams: function(params) {
                var _self = this,
                    pageStart = _self.get("pageStart"),
                    arr = ["start", "limit", "pageIndex"];
                null != params.pageIndex && (params.pageIndex = params.pageIndex + pageStart), BUI.each(arr, function(field) {
                    var fieldParam = _self.get(field + "Param");
                    fieldParam !== field && (params[fieldParam] = params[field], delete params[field])
                })
            },
            _getUrl: function(type) {
                var url, _self = this,
                    save = _self.get("save");
                return type === TYPE_AJAX.READ ? _self.get("url") : save ? BUI.isString(save) ? save : (url = save[type + "Url"], url || (url = _self.get("url")), url) : _self.get("url")
            },
            _getAppendParams: function(type) {
                var save, saveTypeParam, _self = this,
                    rst = null;
                return type == TYPE_AJAX.READ ? rst : (save = _self.get("save"), saveTypeParam = _self.get("saveTypeParam"), save && !save[type + "Url"] && (rst = {}, rst[saveTypeParam] = type), rst)
            },
            _read: function(params, callback) {
                var cfg, _self = this;
                params = BUI.cloneObject(params), _self._processParams(params), cfg = _self._getAjaxOptions(TYPE_AJAX.READ, params), _self._ajax(cfg, callback)
            },
            _getAjaxOptions: function(type, params) {
                var cfg, _self = this,
                    ajaxOptions = _self.get("ajaxOptions"),
                    url = _self._getUrl(type);
                return BUI.mix(params, _self._getAppendParams(type)), cfg = BUI.merge({
                    url: url,
                    type: _self.get("method"),
                    dataType: _self.get("dataType"),
                    data: params,
                    cache: _self.get("cache")
                }, ajaxOptions)
            },
            _ajax: function(cfg, callback) {
                var success = cfg.success,
                    error = cfg.error;
                cfg.success = function(data) {
                    success && success(data), callback(data)
                }, cfg.error = function(jqXHR, textStatus, errorThrown) {
                    error && error(jqXHR, textStatus, errorThrown);
                    var result = {
                        exception: {
                            status: textStatus,
                            errorThrown: errorThrown,
                            jqXHR: jqXHR
                        }
                    };
                    callback(result)
                }, $.ajax(cfg)
            },
            _save: function(type, data, callback) {
                var cfg, _self = this;
                cfg = _self._getAjaxOptions(type, data), _self._ajax(cfg, callback)
            }
        });
        var memeryProxy = function(config) {
            memeryProxy.superclass.constructor.call(this, config)
        };
        return memeryProxy.ATTRS = {
            matchFields: {
                value: []
            }
        }, BUI.extend(memeryProxy, proxy), BUI.mixin(memeryProxy, [Sortable]), BUI.augment(memeryProxy, {
            _read: function(params, callback) {
                var _self = this,
                    start = (params.pageable, params.start),
                    sortField = params.sortField,
                    sortDirection = params.sortDirection,
                    limit = params.limit,
                    data = _self.get("data"),
                    rows = [];
                data = _self._getMatches(params), _self.sortData(sortField, sortDirection), limit ? (rows = data.slice(start, start + limit), callback({
                    rows: rows,
                    results: data.length
                })) : (rows = data.slice(start), callback(rows))
            },
            _getMatchFn: function(params, matchFields) {
                return function(obj) {
                    var result = !0;
                    return BUI.each(matchFields, function(field) {
                        if (null != params[field] && params[field] !== obj[field]) return result = !1, !1
                    }), result
                }
            },
            _getMatches: function(params) {
                var matchFn, _self = this,
                    matchFields = _self.get("matchFields"),
                    data = _self.get("data") || [];
                return params && matchFields.length && (matchFn = _self._getMatchFn(params, matchFields), data = BUI.Array.filter(data, matchFn)), data
            },
            _save: function(type, saveData, callback) {
                var _self = this,
                    data = _self.get("data");
                type == TYPE_AJAX.ADD ? data.push(saveData) : type == TYPE_AJAX.REMOVE ? BUI.Array.remove(data, saveData) : type == TYPE_AJAX.SAVE_ALL && (BUI.each(saveData.add, function(item) {
                    data.push(item)
                }), BUI.each(saveData.remove, function(item) {
                    BUI.Array.remove(data, item)
                }))
            }
        }), proxy.Ajax = ajaxProxy, proxy.Memery = memeryProxy, proxy
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function AbstractStore(config) {
            AbstractStore.superclass.constructor.call(this, config), this._init()
        }
        var BUI = require("bui/common"),
            Proxy = require("bui/data/proxy");
        return AbstractStore.ATTRS = {
            autoLoad: {
                value: !1
            },
            remoteFilter: {
                value: !1
            },
            lastParams: {
                shared: !1,
                value: {}
            },
            params: {},
            proxy: {
                shared: !1,
                value: {}
            },
            url: {},
            events: {
                value: ["acceptchanges", "load", "beforeload", "beforeprocessload", "add", "exception", "remove", "update", "localsort"]
            },
            data: {
                setter: function(data) {
                    var _self = this,
                        proxy = _self.get("proxy");
                    proxy.set ? proxy.set("data", data) : proxy.data = data, _self.set("autoLoad", !0)
                }
            }
        }, BUI.extend(AbstractStore, BUI.Base), BUI.augment(AbstractStore, {
            isStore: !0,
            _init: function() {
                var _self = this;
                _self.beforeInit(), _self._initParams(), _self._initProxy(), _self._initData()
            },
            beforeInit: function() {},
            _initData: function() {
                var _self = this,
                    autoLoad = _self.get("autoLoad");
                autoLoad && _self.load()
            },
            _initParams: function() {
                var _self = this,
                    lastParams = _self.get("lastParams"),
                    params = _self.get("params");
                BUI.mix(lastParams, params)
            },
            _initProxy: function() {
                var _self = this,
                    url = _self.get("url"),
                    proxy = _self.get("proxy");
                proxy instanceof Proxy || (url && (proxy.url = url), proxy = "ajax" === proxy.type || proxy.url ? new Proxy.Ajax(proxy) : new Proxy.Memery(proxy), _self.set("proxy", proxy))
            },
            load: function(params, callback) {
                var _self = this,
                    proxy = _self.get("proxy"),
                    lastParams = _self.get("lastParams");
                BUI.mix(lastParams, _self.getAppendParams(), params), _self.fire("beforeload", {
                    params: lastParams
                }), params = BUI.cloneObject(lastParams), proxy.read(lastParams, function(data) {
                    _self.onLoad(data, params), callback && callback(data, params)
                }, _self)
            },
            onFiltered: function(data, filter) {
                var _self = this;
                _self.fire("filtered", {
                    data: data,
                    filter: filter
                })
            },
            onLoad: function(data, params) {
                var _self = this,
                    processResult = _self.processLoad(data, params);
                processResult && _self.afterProcessLoad(data, params)
            },
            filter: function(filter) {
                var result, _self = this,
                    remoteFilter = _self.get("remoteFilter");
                remoteFilter ? _self.load({
                    filter: filter
                }) : (_self.set("filter", filter), result = _self._filterLocal(filter), _self.onFiltered(result, filter))
            },
            _filterLocal: function(fn) {},
            _clearLocalFilter: function() {
                this._filterLocal(function() {
                    return !0
                })
            },
            clearFilter: function() {
                var _self = this,
                    remoteFilter = _self.get("remoteFilter");
                remoteFilter ? _self.load({
                    filter: ""
                }) : _self._clearLocalFilter()
            },
            processLoad: function(data, params) {
                var _self = this,
                    hasErrorField = _self.get("hasErrorProperty");
                return _self.fire("beforeprocessload", {
                    data: data
                }), _self.fire("beforeProcessLoad", data), !data[hasErrorField] && !data.exception || (_self.onException(data), !1)
            },
            afterProcessLoad: function(data, params) {},
            onException: function(data) {
                var _self = this,
                    errorProperty = _self.get("errorProperty"),
                    obj = {};
                data.exception ? (obj.type = "exception", obj[errorProperty] = data.exception) : (obj.type = "error", obj[errorProperty] = data[errorProperty]), _self.fire("exception", obj)
            },
            hasData: function() {},
            getAppendParams: function() {
                return {}
            }
        }), AbstractStore
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function mapNode(cfg, map) {
            var rst = {};
            return map ? (BUI.each(cfg, function(v, k) {
                var name = map[k] || k;
                rst[name] = v
            }), rst.record = cfg) : rst = cfg, rst
        }

        function Node(cfg, map) {
            cfg = mapNode(cfg, map), BUI.mix(this, cfg)
        }
        var BUI = require("bui/common");
        return BUI.augment(Node, {
            root: !1,
            leaf: null,
            text: "",
            id: null,
            loaded: !1,
            path: null,
            parent: null,
            level: 0,
            record: null,
            children: null,
            isNode: !0
        }), Node
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function TreeStore(config) {
            TreeStore.superclass.constructor.call(this, config)
        }
        var BUI = require("bui/common"),
            Node = require("bui/data/node"),
            Proxy = require("bui/data/proxy"),
            AbstractStore = require("bui/data/abstractstore");
        return TreeStore.ATTRS = {
            root: {},
            map: {},
            pidField: {},
            dataProperty: {
                value: "nodes"
            },
            events: {
                value: ["add", "update", "remove", "load"]
            }
        }, BUI.extend(TreeStore, AbstractStore), BUI.augment(TreeStore, {
            beforeInit: function() {
                this.initRoot()
            },
            _initData: function() {
                var _self = this,
                    autoLoad = _self.get("autoLoad"),
                    pidField = _self.get("pidField"),
                    proxy = _self.get("proxy"),
                    root = _self.get("root");
                !proxy.get("url") && pidField && proxy.get("matchFields").push(pidField), autoLoad && !root.children && _self.loadNode(root)
            },
            initRoot: function() {
                var _self = this,
                    map = _self.get("map"),
                    root = _self.get("root");
                root || (root = {}), root.isNode || (root = new Node(root, map)), root.path = [root.id], root.level = 0, root.children && _self.setChildren(root, root.children), _self.set("root", root)
            },
            add: function(node, parent, index) {
                var _self = this;
                return node = _self._add(node, parent, index), _self.fire("add", {
                    node: node,
                    record: node,
                    index: index
                }), node
            },
            _add: function(node, parent, index) {
                parent = parent || this.get("root");
                var nodeChildren, _self = this,
                    map = _self.get("map"),
                    nodes = parent.children;
                return node.isNode || (node = new Node(node, map)), nodeChildren = node.children || [], 0 == nodeChildren.length && null == node.leaf && (node.leaf = !0), parent && (parent.leaf = !1), node.parent = parent, node.level = parent.level + 1, node.path = parent.path.concat(node.id), index = null == index ? parent.children.length : index, BUI.Array.addAt(nodes, node, index), _self.setChildren(node, nodeChildren), node
            },
            remove: function(node) {
                var parent = node.parent || _self.get("root"),
                    index = BUI.Array.indexOf(node, parent.children);
                return BUI.Array.remove(parent.children, node), 0 === parent.children.length && (parent.leaf = !0), this.fire("remove", {
                    node: node,
                    record: node,
                    index: index
                }), node.parent = null, node
            },
            setValue: function(node, field, value) {
                var _self = this;
                node[field] = value, _self.fire("update", {
                    node: node,
                    record: node,
                    field: field,
                    value: value
                })
            },
            update: function(node) {
                this.fire("update", {
                    node: node,
                    record: node
                })
            },
            getResult: function() {
                return this.get("root").children
            },
            setResult: function(data) {
                var _self = this,
                    proxy = _self.get("proxy"),
                    root = _self.get("root");
                proxy instanceof Proxy.Memery ? (_self.set("data", data), _self.load({
                    id: root.id
                })) : _self.setChildren(root, data)
            },
            setChildren: function(node, children) {
                var _self = this;
                node.children = [], children.length && BUI.each(children, function(item) {
                    _self._add(item, node)
                })
            },
            findNode: function(id, parent, deep) {
                return this.findNodeBy(function(node) {
                    return node.id === id
                }, parent, deep)
            },
            findNodeBy: function(fn, parent, deep) {
                var _self = this;
                if (deep = null == deep || deep, !parent) {
                    var root = _self.get("root");
                    return fn(root) ? root : _self.findNodeBy(fn, root)
                }
                var children = parent.children,
                    rst = null;
                return BUI.each(children, function(item) {
                    if (fn(item) ? rst = item : deep && (rst = _self.findNodeBy(fn, item)), rst) return !1
                }), rst
            },
            findNodesBy: function(func, parent) {
                var _self = this,
                    rst = [];
                return parent || (parent = _self.get("root")), BUI.each(parent.children, function(item) {
                    func(item) && rst.push(item), rst = rst.concat(_self.findNodesBy(func, item))
                }), rst
            },
            findNodeByPath: function(path) {
                if (!path) return null;
                var node, i, _self = this,
                    root = _self.get("root"),
                    pathArr = path.split(","),
                    tempId = pathArr[0];
                if (!tempId) return null;
                if (node = root.id == tempId ? root : _self.findNode(tempId, root, !1)) {
                    for (i = 1; i < pathArr.length; i += 1) {
                        var tempId = pathArr[i];
                        if (node = _self.findNode(tempId, node, !1), !node) break
                    }
                    return node
                }
            },
            contains: function(node, parent) {
                var _self = this,
                    findNode = _self.findNode(node.id, parent);
                return !!findNode
            },
            afterProcessLoad: function(data, params) {
                var _self = this,
                    pidField = _self.get("pidField"),
                    id = params.id || params[pidField],
                    dataProperty = _self.get("dataProperty"),
                    node = _self.findNode(id) || _self.get("root");
                BUI.isArray(data) ? _self.setChildren(node, data) : _self.setChildren(node, data[dataProperty]), node.loaded = !0, _self.fire("load", {
                    node: node,
                    params: params
                })
            },
            hasData: function() {
                return this.get("root").children && 0 !== this.get("root").children.length
            },
            isLoaded: function(node) {
                var root = this.get("root");
                return !(node == root && !root.children) && (!this.get("url") && !this.get("pidField") || (node.loaded || node.leaf || !(!node.children || !node.children.length)))
            },
            loadNode: function(node, forceLoad) {
                var params, _self = this,
                    pidField = _self.get("pidField");
                !forceLoad && _self.isLoaded(node) || (params = {
                    id: node.id
                }, pidField && (params[pidField] = node.id), _self.load(params))
            },
            reloadNode: function(node) {
                var _self = this;
                node = node || _self.get("root"), node.loaded = !1, _self.loadNode(node, !0)
            },
            loadPath: function(path) {
                var _self = this,
                    arr = path.split(","),
                    id = arr[0];
                _self.findNodeByPath(path) || _self.load({
                    id: id,
                    path: path
                })
            }
        }), TreeStore
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function removeAt(index, array) {
            if (!(index < 0)) {
                var records = array,
                    record = records[index];
                return records.splice(index, 1), record
            }
        }

        function removeFrom(record, array) {
            var index = BUI.Array.indexOf(record, array);
            index >= 0 && removeAt(index, array)
        }

        function contains(record, array) {
            return BUI.Array.indexOf(record, array) !== -1
        }
        var Proxy = require("bui/data/proxy"),
            AbstractStore = require("bui/data/abstractstore"),
            Sortable = require("bui/data/sortable"),
            store = function(config) {
                store.superclass.constructor.call(this, config)
            };
        return store.ATTRS = {
            autoSync: {
                value: !1
            },
            currentPage: {
                value: 0
            },
            deletedRecords: {
                shared: !1,
                value: []
            },
            errorProperty: {
                value: "error"
            },
            hasErrorProperty: {
                value: "hasError"
            },
            matchFunction: {
                value: function(obj1, obj2) {
                    return obj1 == obj2
                }
            },
            modifiedRecords: {
                shared: !1,
                value: []
            },
            newRecords: {
                shared: !1,
                value: []
            },
            remoteSort: {
                value: !1
            },
            resultMap: {
                shared: !1,
                value: {}
            },
            root: {
                value: "rows"
            },
            rowCount: {
                value: 0
            },
            totalProperty: {
                value: "results"
            },
            start: {
                value: 0
            },
            pageSize: {}
        }, BUI.extend(store, AbstractStore), BUI.mixin(store, [Sortable]), BUI.augment(store, {
            add: function(data, noRepeat, match) {
                var _self = this,
                    count = _self.getCount();
                _self.addAt(data, count, noRepeat, match)
            },
            addAt: function(data, index, noRepeat, match) {
                var _self = this;
                match = match || _self._getDefaultMatch(), BUI.isArray(data) || (data = [data]), $.each(data, function(pos, element) {
                    noRepeat && _self.contains(element, match) || (_self._addRecord(element, pos + index), _self.get("newRecords").push(element), removeFrom(element, _self.get("deletedRecords")), removeFrom(element, _self.get("modifiedRecords")))
                })
            },
            contains: function(record, match) {
                return this.findIndexBy(record, match) !== -1
            },
            find: function(field, value) {
                var _self = this,
                    result = null,
                    records = _self.getResult();
                return $.each(records, function(index, record) {
                    if (record[field] === value) return result = record, !1
                }), result
            },
            findAll: function(field, value) {
                var _self = this,
                    result = [],
                    records = _self.getResult();
                return $.each(records, function(index, record) {
                    record[field] === value && result.push(record)
                }), result
            },
            findByIndex: function(index) {
                return this.getResult()[index]
            },
            findIndexBy: function(target, match) {
                var _self = this,
                    position = -1,
                    records = _self.getResult();
                return match = match || _self._getDefaultMatch(), null === target || void 0 === target ? -1 : ($.each(records, function(index, record) {
                    if (match(target, record)) return position = index, !1
                }), position)
            },
            findNextRecord: function(record) {
                var _self = this,
                    index = _self.findIndexBy(record);
                if (index >= 0) return _self.findByIndex(index + 1)
            },
            getCount: function() {
                return this.getResult().length
            },
            getTotalCount: function() {
                var _self = this,
                    resultMap = _self.get("resultMap"),
                    total = _self.get("totalProperty");
                return parseInt(resultMap[total], 10) || 0
            },
            getResult: function() {
                var _self = this,
                    resultMap = _self.get("resultMap"),
                    root = _self.get("root");
                return resultMap[root]
            },
            hasData: function() {
                return 0 !== this.getCount()
            },
            setResult: function(data) {
                var _self = this,
                    proxy = _self.get("proxy");
                proxy instanceof Proxy.Memery ? (_self.set("data", data), _self.load({
                    start: 0
                })) : _self._setResult(data)
            },
            remove: function(data, match) {
                var _self = this;
                match = match || _self._getDefaultMatch(), BUI.isArray(data) || (data = [data]), $.each(data, function(index, element) {
                    var index = _self.findIndexBy(element, match),
                        record = removeAt(index, _self.getResult());
                    contains(record, _self.get("newRecords")) || contains(record, _self.get("deletedRecords")) || _self.get("deletedRecords").push(record), removeFrom(record, _self.get("newRecords")), removeFrom(record, _self.get("modifiedRecords")), _self.fire("remove", {
                        record: record
                    })
                })
            },
            save: function(type, saveData, callback) {
                var _self = this,
                    proxy = _self.get("proxy");
                BUI.isFunction(type) && (callback = type, type = void 0), BUI.isObject(type) && (callback = saveData, saveData = type, type = void 0), type || (type = _self._getSaveType(saveData)), "all" != type || saveData || (saveData = _self._getDirtyData()), _self.fire("beforesave", {
                    type: type,
                    saveData: saveData
                }), proxy.save(type, saveData, function(data) {
                    _self.onSave(type, saveData, data), callback && callback(data, saveData)
                }, _self)
            },
            _getSaveType: function(saveData) {
                var _self = this;
                return saveData ? BUI.Array.contains(saveData, _self.get("newRecords")) ? "add" : BUI.Array.contains(saveData, _self.get("modifiedRecords")) ? "update" : BUI.Array.contains(saveData, _self.get("deletedRecords")) ? "remove" : "custom" : "all"
            },
            _getDirtyData: function() {
                var _self = this,
                    proxy = _self.get("proxy");
                return proxy.get("url") ? {
                    add: BUI.JSON.stringify(_self.get("newRecords")),
                    update: BUI.JSON.stringify(_self.get("modifiedRecords")),
                    remove: BUI.JSON.stringify(_self.get("deletedRecords"))
                } : {
                    add: _self.get("newRecords"),
                    update: _self.get("modifiedRecords"),
                    remove: _self.get("deletedRecords")
                }
            },
            onSave: function(type, saveData, data) {
                var _self = this,
                    hasErrorField = _self.get("hasErrorProperty");
                return data[hasErrorField] || data.exception ? void _self.onException(data) : (_self._clearDirty(type, saveData), _self.fire("saved", {
                    type: type,
                    saveData: saveData,
                    data: data
                }), void(_self.get("autoSync") && _self.load()))
            },
            _clearDirty: function(type, saveData) {
                function removeFrom(obj, name) {
                    BUI.Array.remove(_self.get(name), obj)
                }
                var _self = this;
                switch (type) {
                    case "all":
                        _self._clearChanges();
                        break;
                    case "add":
                        removeFrom(saveData, "newRecords");
                        break;
                    case "update":
                        removeFrom(saveData, "modifiedRecords");
                        break;
                    case "remove":
                        removeFrom(saveData, "deletedRecords")
                }
            },
            sort: function(field, direction) {
                var _self = this,
                    remoteSort = _self.get("remoteSort");
                remoteSort ? (_self.set("sortField", field), _self.set("sortDirection", direction), _self.load(_self.get("sortInfo"))) : _self._localSort(field, direction)
            },
            sum: function(field, data) {
                var _self = this,
                    records = data || _self.getResult(),
                    sum = 0;
                return BUI.each(records, function(record) {
                    var val = record[field];
                    isNaN(val) || (sum += parseFloat(val))
                }), sum
            },
            setValue: function(obj, field, value) {
                var record = obj,
                    _self = this;
                record[field] = value, contains(record, _self.get("newRecords")) || contains(record, _self.get("modifiedRecords")) || _self.get("modifiedRecords").push(record), _self.fire("update", {
                    record: record,
                    field: field,
                    value: value
                })
            },
            update: function(obj, isMatch, match) {
                var record = obj,
                    _self = this,
                    match = null,
                    index = null;
                isMatch && (match = match || _self._getDefaultMatch(), index = _self.findIndexBy(obj, match), index >= 0 && (record = _self.getResult()[index])), record = BUI.mix(record, obj), contains(record, _self.get("newRecords")) || contains(record, _self.get("modifiedRecords")) || _self.get("modifiedRecords").push(record), _self.fire("update", {
                    record: record
                })
            },
            _addRecord: function(record, index) {
                var records = this.getResult();
                void 0 == index && (index = records.length), records.splice(index, 0, record), this.fire("add", {
                    record: record,
                    index: index
                })
            },
            _clearChanges: function() {
                var _self = this;
                BUI.Array.empty(_self.get("newRecords")), BUI.Array.empty(_self.get("modifiedRecords")), BUI.Array.empty(_self.get("deletedRecords"))
            },
            _filterLocal: function(fn, data) {
                var _self = this,
                    rst = [];
                return data = data || _self.getResult(), fn ? (BUI.each(data, function(record) {
                    fn(record) && rst.push(record)
                }), rst) : data
            },
            _getDefaultMatch: function() {
                return this.get("matchFunction")
            },
            _getPageParams: function() {
                var _self = this,
                    sortInfo = _self.get("sortInfo"),
                    start = _self.get("start"),
                    limit = _self.get("pageSize"),
                    pageIndex = _self.get("pageIndex") || (limit ? start / limit : 0);
                return params = {
                    start: start,
                    limit: limit,
                    pageIndex: pageIndex
                }, _self.get("remoteSort") && BUI.mix(params, sortInfo), params
            },
            getAppendParams: function() {
                return this._getPageParams()
            },
            beforeInit: function() {
                this._setResult([])
            },
            _localSort: function(field, direction) {
                var _self = this;
                _self._sortData(field, direction), _self.fire("localsort", {
                    field: field,
                    direction: direction
                })
            },
            _sortData: function(field, direction, data) {
                var _self = this;
                data = data || _self.getResult(), _self.sortData(field, direction, data)
            },
            afterProcessLoad: function(data, params) {
                var _self = this,
                    root = _self.get("root"),
                    start = params.start,
                    limit = params.limit,
                    totalProperty = _self.get("totalProperty");
                BUI.isArray(data) ? _self._setResult(data) : _self._setResult(data[root], data[totalProperty]), _self.set("start", start), limit && _self.set("pageIndex", start / limit), _self.get("remoteSort") || _self._sortData(), _self.fire("load", {
                    params: params
                })
            },
            _setResult: function(rows, totalCount) {
                var _self = this,
                    resultMap = _self.get("resultMap");
                totalCount = totalCount || rows.length, resultMap[_self.get("root")] = rows, resultMap[_self.get("totalProperty")] = totalCount, _self._clearChanges()
            }
        }), store
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Overlay = BUI.namespace("Overlay");
        return BUI.mix(Overlay, {
            Overlay: require("bui/overlay/overlay"),
            Dialog: require("bui/overlay/dialog"),
            Message: require("bui/overlay/message")
        }), BUI.mix(Overlay, {
            OverlayView: Overlay.Overlay.View,
            DialogView: Overlay.Dialog.View
        }), BUI.Message = BUI.Overlay.Message, Overlay
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            CLS_ARROW = "x-align-arrow",
            UIBase = Component.UIBase,
            overlayView = Component.View.extend([UIBase.PositionView, UIBase.CloseView]),
            overlay = Component.Controller.extend([UIBase.Position, UIBase.Align, UIBase.Close, UIBase.AutoShow, UIBase.AutoHide], {
                renderUI: function() {
                    var _self = this,
                        el = _self.get("el"),
                        arrowContainer = _self.get("arrowContainer"),
                        container = arrowContainer ? el.one(arrowContainer) : el;
                    _self.get("showArrow") && $(_self.get("arrowTpl")).appendTo(container)
                },
                show: function() {
                    function callback() {
                        "visibility" === visibleMode ? el.css({
                            display: "block"
                        }) : _self.set("visible", !0), effectCfg.callback && effectCfg.callback.call(_self)
                    }
                    var _self = this,
                        effectCfg = _self.get("effect"),
                        el = _self.get("el"),
                        visibleMode = _self.get("visibleMode"),
                        effect = effectCfg.effect,
                        duration = effectCfg.duration;
                    switch (_self.get("rendered") || (_self.set("visible", !0), _self.render(), _self.set("visible", !1), el = _self.get("el")), "visibility" === visibleMode && (_self.set("visible", !0), el.css({
                        display: "none"
                    })), effect) {
                        case "linear":
                            el.show(duration, callback);
                            break;
                        case "fade":
                            el.fadeIn(duration, callback);
                            break;
                        case "slide":
                            el.slideDown(duration, callback);
                            break;
                        default:
                            callback()
                    }
                },
                hide: function() {
                    function callback() {
                        "visibility" === _self.get("visibleMode") && el.css({
                            display: "block"
                        }), _self.set("visible", !1), effectCfg.callback && effectCfg.callback.call(_self)
                    }
                    var _self = this,
                        effectCfg = _self.get("effect"),
                        el = _self.get("el"),
                        effect = effectCfg.effect,
                        duration = effectCfg.duration;
                    switch (effect) {
                        case "linear":
                            el.hide(duration, callback);
                            break;
                        case "fade":
                            el.fadeOut(duration, callback);
                            break;
                        case "slide":
                            el.slideUp(duration, callback);
                            break;
                        default:
                            callback()
                    }
                }
            }, {
                ATTRS: {
                    effect: {
                        value: {
                            effect: "none",
                            duration: 0,
                            callback: null
                        }
                    },
                    closeable: {
                        value: !1
                    },
                    showArrow: {
                        value: !1
                    },
                    arrowContainer: {
                        view: !0
                    },
                    arrowTpl: {
                        value: '<s class="' + CLS_ARROW + '"><s class="' + CLS_ARROW + '-inner"></s></s>'
                    },
                    visibleMode: {
                        value: "visibility"
                    },
                    visible: {
                        value: !1
                    },
                    xview: {
                        value: overlayView
                    }
                }
            }, {
                xclass: "overlay"
            });
        return overlay.View = overlayView, overlay
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Overlay = require("bui/overlay/overlay"),
            UIBase = BUI.Component.UIBase,
            CLS_TITLE = "header-title",
            PREFIX = BUI.prefix,
            HEIGHT_PADDING = 20,
            dialogView = Overlay.View.extend([UIBase.StdModView, UIBase.MaskView], {
                _uiSetTitle: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    el.find("." + CLS_TITLE).html(v)
                },
                _uiSetContentId: function(v) {
                    var _self = this,
                        body = _self.get("body"),
                        children = $("#" + v).children();
                    children.appendTo(body)
                },
                _uiSetHeight: function(v) {
                    var _self = this,
                        bodyHeight = v,
                        header = _self.get("header"),
                        body = _self.get("body"),
                        footer = _self.get("footer");
                    bodyHeight -= header.outerHeight() + footer.outerHeight(), bodyHeight -= 2 * HEIGHT_PADDING, body.height(bodyHeight)
                },
                _removeContent: function() {
                    var _self = this,
                        body = _self.get("body"),
                        contentId = _self.get("contentId");
                    contentId ? body.children().appendTo($("#" + contentId)) : body.children().remove()
                }
            }, {
                xclass: "dialog-view"
            }),
            dialog = Overlay.extend([UIBase.StdMod, UIBase.Mask, UIBase.Drag], {
                show: function() {
                    var _self = this;
                    dialog.superclass.show.call(this), _self.center()
                },
                bindUI: function() {
                    var _self = this;
                    _self.on("closeclick", function() {
                        return _self.onCancel()
                    })
                },
                onCancel: function() {
                    var _self = this,
                        cancel = _self.get("cancel");
                    return cancel.call(this)
                },
                _uiSetButtons: function(buttons) {
                    var _self = this,
                        footer = _self.get("footer");
                    footer.children().remove(), BUI.each(buttons, function(conf) {
                        _self._createButton(conf, footer)
                    })
                },
                _createButton: function(conf, parent) {
                    var _self = this,
                        temp = '<button class="' + conf.elCls + '">' + conf.text + "</button>",
                        btn = $(temp).appendTo(parent);
                    btn.on("click", function() {
                        conf.handler.call(_self, _self, this)
                    })
                },
                destructor: function() {
                    var _self = this,
                        contentId = _self.get("contentId"),
                        body = _self.get("body"),
                        closeAction = _self.get("closeAction");
                    "destroy" == closeAction && (_self.hide(), contentId && body.children().appendTo("#" + contentId))
                }
            }, {
                ATTRS: {
                    closeTpl: {
                        view: !0,
                        value: '<a tabindex="0" href=javascript:void("关闭") role="button" class="' + PREFIX + 'ext-close" style=""><span class="' + PREFIX + 'ext-close-x x-icon x-icon-normal">×</span></a>'
                    },
                    buttons: {
                        value: [{
                            text: "确定",
                            elCls: "button button-primary",
                            handler: function() {
                                var _self = this,
                                    success = _self.get("success");
                                success && success.call(_self)
                            }
                        }, {
                            text: "取消",
                            elCls: "button button-primary",
                            handler: function(dialog, btn) {
                                this.onCancel() !== !1 && this.close()
                            }
                        }]
                    },
                    contentId: {
                        view: !0
                    },
                    success: {
                        value: function() {
                            this.close()
                        }
                    },
                    cancel: {
                        value: function() {}
                    },
                    dragNode: {
                        valueFn: function() {
                            return this.get("header")
                        }
                    },
                    defaultLoaderCfg: {
                        valueFn: function() {
                            var _self = this;
                            return {
                                property: "bodyContent",
                                autoLoad: !1,
                                lazyLoad: {
                                    event: "show"
                                },
                                loadMask: {
                                    el: _self.get("body")
                                }
                            }
                        }
                    },
                    title: {
                        view: !0,
                        value: ""
                    },
                    mask: {
                        value: !0
                    },
                    maskShared: {
                        value: !1
                    },
                    headerContent: {
                        value: '<div class="' + CLS_TITLE + '">标题</div>'
                    },
                    footerContent: {},
                    closeable: {
                        value: !0
                    },
                    xview: {
                        value: dialogView
                    }
                }
            }, {
                xclass: "dialog"
            });
        return dialog.View = dialogView, dialog
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function messageFun(buttons, defaultIcon) {
            return function(msg, callback, icon) {
                BUI.isString(callback) && (icon = callback, callback = null), icon = icon || defaultIcon, callback = callback || hide, showMessage({
                    buttons: buttons,
                    icon: icon,
                    msg: msg,
                    success: callback
                })
            }
        }

        function showMessage(config) {
            singlelon || (singlelon = new message({
                icon: "info",
                title: ""
            })), singlelon.set(config), singlelon.show()
        }

        function success() {
            var _self = this,
                success = _self.get("success");
            success && (success.call(_self), _self.hide())
        }

        function hide() {
            this.hide()
        }
        var singlelon, Dialog = require("bui/overlay/dialog"),
            PREFIX = BUI.prefix,
            iconText = {
                info: "i",
                error: "×",
                success: '<i class="icon-ok icon-white"></i>',
                question: "?",
                warning: "!"
            },
            message = Dialog.extend({
                renderUI: function() {
                    this._setContent()
                },
                bindUI: function() {
                    var _self = this,
                        body = _self.get("body");
                    _self.on("afterVisibleChange", function(ev) {
                        if (ev.newVal && BUI.UA.ie < 8) {
                            var outerWidth = body.outerWidth();
                            6 == BUI.UA.ie && (outerWidth = outerWidth > 350 ? 350 : outerWidth), _self.get("header").width(outerWidth - 20), _self.get("footer").width(outerWidth)
                        }
                    })
                },
                _setContent: function() {
                    var _self = this,
                        body = _self.get("body"),
                        contentTpl = BUI.substitute(_self.get("contentTpl"), {
                            msg: _self.get("msg"),
                            iconTpl: _self.get("iconTpl")
                        });
                    body.empty(), $(contentTpl).appendTo(body)
                },
                _uiSetIcon: function(v) {
                    this.get("rendered") && this._setContent()
                },
                _uiSetMsg: function(v) {
                    this.get("rendered") && this._setContent()
                }
            }, {
                ATTRS: {
                    icon: {},
                    msg: {},
                    iconTpl: {
                        getter: function() {
                            var _self = this,
                                type = _self.get("icon");
                            return '<div class="x-icon x-icon-' + type + '">' + iconText[type] + "</div>"
                        }
                    },
                    contentTpl: {
                        value: '{iconTpl}<div class="' + PREFIX + 'message-content">{msg}</div>'
                    }
                }
            }, {
                xclass: "message",
                priority: 0
            }),
            Alert = messageFun([{
                text: "确定",
                elCls: "button button-primary",
                handler: success
            }], "info"),
            Confirm = messageFun([{
                text: "确定",
                elCls: "button button-primary",
                handler: success
            }, {
                text: "取消",
                elCls: "button button-primary",
                handler: hide
            }], "question");
        return message.Alert = Alert, message.Confirm = Confirm, message.Show = showMessage, message
    }),
    function() {
        var BASE = "bui/list/";
        define("src/hephaistos/js/bui-debug", [], function(r) {
            var BUI = r("bui/common"),
                List = BUI.namespace("List");
            return BUI.mix(List, {
                List: r(BASE + "list"),
                ListItem: r(BASE + "listitem"),
                SimpleList: r(BASE + "simplelist"),
                Listbox: r(BASE + "listbox")
            }), BUI.mix(List, {
                ListItemView: List.ListItem.View,
                SimpleListView: List.SimpleList.View
            }), List
        })
    }(), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";

        function getItemStatusCls(name, self) {
            var _self = self,
                itemCls = _self.get("itemCls"),
                itemStatusCls = _self.get("itemStatusCls");
            return itemStatusCls && itemStatusCls[name] ? itemStatusCls[name] : itemCls + "-" + name
        }

        function parseItem(element, self) {
            var attrs = element.attributes,
                itemStatusFields = self.get("itemStatusFields"),
                item = {};
            return BUI.each(attrs, function(attr) {
                var name = attr.nodeName;
                name.indexOf(FIELD_PREFIX) !== -1 && (name = name.replace(FIELD_PREFIX, ""), item[name] = attr.nodeValue)
            }), item.text = $(element).text(), BUI.each(itemStatusFields, function(v, k) {
                var cls = getItemStatusCls(k, self);
                $(element).hasClass(cls) && (item[v] = !0)
            }), item
        }
        var BUI = require("bui/common"),
            Selection = BUI.Component.UIBase.Selection,
            FIELD_PREFIX = "data-",
            List = BUI.Component.UIBase.List,
            domListView = function() {};
        domListView.ATTRS = {
            items: {}
        }, domListView.prototype = {
            clearControl: function() {
                var _self = this,
                    listEl = _self.getItemContainer(),
                    itemCls = _self.get("itemCls");
                listEl.find("." + itemCls).remove()
            },
            addItem: function(item, index) {
                return this._createItem(item, index)
            },
            getItems: function() {
                var _self = this,
                    elements = _self.getAllElements(),
                    rst = [];
                return BUI.each(elements, function(elem) {
                    rst.push(_self.getItemByElement(elem))
                }), rst
            },
            updateItem: function(item) {
                var tpl, _self = this,
                    items = _self.getItems(),
                    index = BUI.Array.indexOf(item, items),
                    element = null;
                return index >= 0 && (element = _self.findElement(item), tpl = _self.getItemTpl(item, index), element && $(element).html($(tpl).html())), element
            },
            removeItem: function(item, element) {
                element = element || this.findElement(item), $(element).remove()
            },
            getItemContainer: function() {
                var container = this.get("itemContainer");
                return container.length ? container : this.get("el")
            },
            getItemTpl: function(item, index) {
                var _self = this,
                    render = _self.get("itemTplRender"),
                    itemTpl = _self.get("itemTpl");
                return render ? render(item, index) : BUI.substitute(itemTpl, item)
            },
            _createItem: function(item, index) {
                var _self = this,
                    listEl = _self.getItemContainer(),
                    itemCls = _self.get("itemCls"),
                    dataField = _self.get("dataField"),
                    tpl = _self.getItemTpl(item, index),
                    node = $(tpl);
                if (void 0 !== index) {
                    var target = listEl.find("." + itemCls)[index];
                    target ? node.insertBefore(target) : node.appendTo(listEl)
                } else node.appendTo(listEl);
                return node.addClass(itemCls), node.data(dataField, item), node
            },
            getItemStatusCls: function(name) {
                return getItemStatusCls(name, this)
            },
            setItemStatusCls: function(name, element, value) {
                var _self = this,
                    cls = _self.getItemStatusCls(name),
                    method = value ? "addClass" : "removeClass";
                element && $(element)[method](cls)
            },
            hasStatus: function(name, element) {
                var _self = this,
                    cls = _self.getItemStatusCls(name);
                return $(element).hasClass(cls)
            },
            setItemSelected: function(item, selected, element) {
                var _self = this;
                element = element || _self.findElement(item), _self.setItemStatusCls("selected", element, selected)
            },
            getAllElements: function() {
                var _self = this,
                    itemCls = _self.get("itemCls"),
                    el = _self.get("el");
                return el.find("." + itemCls)
            },
            getItemByElement: function(element) {
                var _self = this,
                    dataField = _self.get("dataField");
                return $(element).data(dataField)
            },
            getFirstElementByStatus: function(name) {
                var _self = this,
                    cls = _self.getItemStatusCls(name),
                    el = _self.get("el");
                return el.find("." + cls)[0]
            },
            getElementsByStatus: function(status) {
                var _self = this,
                    cls = _self.getItemStatusCls(status),
                    el = _self.get("el");
                return el.find("." + cls)
            },
            getSelectedElements: function() {
                var _self = this,
                    cls = _self.getItemStatusCls("selected"),
                    el = _self.get("el");
                return el.find("." + cls)
            },
            findElement: function(item) {
                var _self = this,
                    elements = _self.getAllElements(),
                    result = null;
                return BUI.each(elements, function(element) {
                    if (_self.getItemByElement(element) == item) return result = element, !1
                }), result
            },
            isElementSelected: function(element) {
                var _self = this,
                    cls = _self.getItemStatusCls("selected");
                return element && $(element).hasClass(cls)
            }
        };
        var domList = function() {};
        return domList.ATTRS = BUI.merge(!0, List.ATTRS, Selection.ATTRS, {
            dataField: {
                view: !0,
                value: "data-item"
            },
            itemContainer: {
                view: !0
            },
            itemStatusFields: {
                value: {}
            },
            itemCls: {
                view: !0
            },
            cancelSelected: {
                value: !1
            },
            textGetter: {},
            defaultLoaderCfg: {
                value: {
                    property: "items",
                    dataType: "json"
                }
            },
            events: {
                value: {
                    itemrendered: !0,
                    itemremoved: !0,
                    itemupdated: !0,
                    itemsshow: !1,
                    beforeitemsshow: !1,
                    itemsclear: !1,
                    itemdblclick: !1,
                    beforeitemsclear: !1
                }
            }
        }), domList.PARSER = {
            items: function(el) {
                var _self = this,
                    rst = [],
                    itemCls = _self.get("itemCls"),
                    dataField = _self.get("dataField"),
                    elements = el.find("." + itemCls);
                return elements.length || (elements = el.children(), elements.addClass(itemCls)), BUI.each(elements, function(element) {
                    var item = parseItem(element, _self);
                    rst.push(item), $(element).data(dataField, item)
                }), rst
            }
        }, BUI.augment(domList, List, Selection, {
            _uiSetItems: function(items) {
                var _self = this;
                _self.get("srcNode") && !_self.get("rendered") || this.setItems(items)
            },
            __bindUI: function() {
                function setItemSelectedStatus(item, itemEl) {
                    var isSelected, multipleSelect = _self.get("multipleSelect");
                    isSelected = _self.isItemSelected(item, itemEl), isSelected ? multipleSelect ? _self.setItemSelected(item, !1, itemEl) : _self.get("cancelSelected") && _self.setSelected(null) : (multipleSelect || _self.clearSelected(), _self.setItemSelected(item, !0, itemEl))
                }
                var _self = this,
                    selectedEvent = _self.get("selectedEvent"),
                    itemCls = _self.get("itemCls"),
                    itemContainer = _self.get("view").getItemContainer();
                itemContainer.delegate("." + itemCls, "click", function(ev) {
                    if (!_self.get("disabled")) {
                        var itemEl = $(ev.currentTarget),
                            item = _self.getItemByElement(itemEl);
                        if (!_self.isItemDisabled(item, itemEl)) {
                            var rst = _self.fire("itemclick", {
                                item: item,
                                element: itemEl[0],
                                domTarget: ev.target,
                                domEvent: ev
                            });
                            rst !== !1 && "click" == selectedEvent && _self.isItemSelectable(item) && setItemSelectedStatus(item, itemEl)
                        }
                    }
                }), "click" !== selectedEvent && itemContainer.delegate("." + itemCls, selectedEvent, function(ev) {
                    if (!_self.get("disabled")) {
                        var itemEl = $(ev.currentTarget),
                            item = _self.getItemByElement(itemEl);
                        _self.isItemDisabled(item, itemEl) || _self.isItemSelectable(item) && setItemSelectedStatus(item, itemEl)
                    }
                }), itemContainer.delegate("." + itemCls, "dblclick", function(ev) {
                    if (!_self.get("disabled")) {
                        var itemEl = $(ev.currentTarget),
                            item = _self.getItemByElement(itemEl);
                        _self.isItemDisabled(item, itemEl) || _self.fire("itemdblclick", {
                            item: item,
                            element: itemEl[0],
                            domTarget: ev.target
                        })
                    }
                }), _self.on("itemrendered itemupdated", function(ev) {
                    var item = ev.item,
                        element = ev.element;
                    _self._syncItemStatus(item, element)
                })
            },
            getValueByField: function(item, field) {
                return item && item[field]
            },
            _syncItemStatus: function(item, element) {
                var _self = this,
                    itemStatusFields = _self.get("itemStatusFields");
                BUI.each(itemStatusFields, function(v, k) {
                    null != item[v] && _self.get("view").setItemStatusCls(k, element, item[v])
                })
            },
            getStatusValue: function(item, status) {
                var _self = this,
                    itemStatusFields = _self.get("itemStatusFields"),
                    field = itemStatusFields[status];
                return item[field]
            },
            getCount: function() {
                var items = this.getItems();
                return items ? items.length : 0
            },
            getStatusField: function(status) {
                var _self = this,
                    itemStatusFields = _self.get("itemStatusFields");
                return itemStatusFields[status]
            },
            setStatusValue: function(item, status, value) {
                var _self = this,
                    itemStatusFields = _self.get("itemStatusFields"),
                    field = itemStatusFields[status];
                field && (item[field] = value)
            },
            getItemText: function(item) {
                var _self = this,
                    textGetter = _self.get("textGetter");
                return item ? textGetter ? textGetter(item) : $(_self.findElement(item)).text() : ""
            },
            removeItem: function(item) {
                var index, _self = this,
                    items = _self.get("items"),
                    element = _self.findElement(item);
                index = BUI.Array.indexOf(item, items), index !== -1 && items.splice(index, 1), _self.get("view").removeItem(item, element), _self.fire("itemremoved", {
                    item: item,
                    domTarget: $(element)[0],
                    element: element
                })
            },
            addItemAt: function(item, index) {
                var _self = this,
                    items = _self.get("items");
                return void 0 === index && (index = items.length), items.splice(index, 0, item), _self.addItemToView(item, index), item
            },
            addItemToView: function(item, index) {
                var _self = this,
                    element = _self.get("view").addItem(item, index);
                return _self.fire("itemrendered", {
                    item: item,
                    domTarget: $(element)[0],
                    element: element
                }), element
            },
            updateItem: function(item) {
                var _self = this,
                    element = _self.get("view").updateItem(item);
                _self.fire("itemupdated", {
                    item: item,
                    domTarget: $(element)[0],
                    element: element
                })
            },
            setItems: function(items) {
                var _self = this;
                items != _self.getItems() && _self.setInternal("items", items), _self.clearControl(), _self.fire("beforeitemsshow"), BUI.each(items, function(item, index) {
                    _self.addItemToView(item, index)
                }), _self.fire("itemsshow")
            },
            getItems: function() {
                return this.get("items")
            },
            getItemByElement: function(element) {
                return this.get("view").getItemByElement(element)
            },
            getSelected: function() {
                var _self = this,
                    element = _self.get("view").getFirstElementByStatus("selected");
                return _self.getItemByElement(element) || null
            },
            getItemsByStatus: function(status) {
                var _self = this,
                    elements = _self.get("view").getElementsByStatus(status),
                    rst = [];
                return BUI.each(elements, function(element) {
                    rst.push(_self.getItemByElement(element))
                }), rst
            },
            findElement: function(item) {
                var _self = this;
                return BUI.isString(item) && (item = _self.getItem(item)), this.get("view").findElement(item)
            },
            findItemByField: function(field, value) {
                var _self = this,
                    items = _self.get("items"),
                    result = null;
                return BUI.each(items, function(item) {
                    if (null != item[field] && item[field] == value) return result = item, !1
                }), result
            },
            setItemSelectedStatus: function(item, selected, element) {
                var _self = this;
                element = element || _self.findElement(item), _self.setItemStatus(item, "selected", selected, element)
            },
            setAllSelection: function() {
                var _self = this,
                    items = _self.getItems();
                _self.setSelection(items)
            },
            isItemSelected: function(item, element) {
                var _self = this;
                return element = element || _self.findElement(item), _self.get("view").isElementSelected(element)
            },
            isItemDisabled: function(item, element) {
                return this.hasStatus(item, "disabled", element)
            },
            setItemDisabled: function(item, disabled) {
                var _self = this;
                _self.setItemStatus(item, "disabled", disabled)
            },
            getSelection: function() {
                var _self = this,
                    elements = _self.get("view").getSelectedElements(),
                    rst = [];
                return BUI.each(elements, function(elem) {
                    rst.push(_self.getItemByElement(elem))
                }), rst
            },
            clearControl: function() {
                this.fire("beforeitemsclear"), this.get("view").clearControl(), this.fire("itemsclear")
            },
            hasStatus: function(item, status, element) {
                if (!item) return !1;
                var _self = this;
                _self.getStatusField(status);
                return element = element || _self.findElement(item), _self.get("view").hasStatus(status, element)
            },
            setItemStatus: function(item, status, value, element) {
                var _self = this;
                item && (element = element || _self.findElement(item)), _self.isItemDisabled(item, element) && "disabled" !== status || (item && ("disabled" === status && value && _self.clearItemStatus(item), _self.setStatusValue(item, status, value), _self.get("view").setItemStatusCls(status, element, value), _self.fire("itemstatuschange", {
                    item: item,
                    status: status,
                    value: value,
                    element: element
                })), "selected" === status && _self.afterSelected(item, value, element))
            },
            clearItemStatus: function(item, status, element) {
                var _self = this,
                    itemStatusFields = _self.get("itemStatusFields");
                element = element || _self.findElement(item), status ? _self.setItemStatus(item, status, !1, element) : (BUI.each(itemStatusFields, function(v, k) {
                    _self.setItemStatus(item, k, !1, element)
                }), itemStatusFields.selected || _self.setItemSelected(item, !1), _self.setItemStatus(item, "hover", !1))
            }
        }), domList.View = domListView, domList
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";
        var BUI = require("bui/common"),
            KeyNav = function() {};
        return KeyNav.ATTRS = {
            highlightedStatus: {
                value: "hover"
            }
        }, BUI.augment(KeyNav, {
            setHighlighted: function(item, element) {
                if (!this.hasStatus(item, "hover", element)) {
                    var _self = this,
                        highlightedStatus = _self.get("highlightedStatus"),
                        lightedElement = _self._getHighLightedElement(),
                        lightedItem = lightedElement ? _self.getItemByElement(lightedElement) : null;
                    lightedItem !== item && (lightedItem && this.setItemStatus(lightedItem, highlightedStatus, !1, lightedElement), this.setItemStatus(item, highlightedStatus, !0, element), _self._scrollToItem(item, element))
                }
            },
            _getHighLightedElement: function() {
                var _self = this,
                    highlightedStatus = _self.get("highlightedStatus"),
                    element = _self.get("view").getFirstElementByStatus(highlightedStatus);
                return element
            },
            getHighlighted: function() {
                var _self = this,
                    highlightedStatus = _self.get("highlightedStatus"),
                    element = _self.get("view").getFirstElementByStatus(highlightedStatus);
                return _self.getItemByElement(element) || null
            },
            getColumnCount: function() {
                var _self = this,
                    firstItem = _self.getFirstItem(),
                    element = _self.findElement(firstItem),
                    node = $(element);
                return element ? parseInt(node.parent().width() / node.outerWidth(), 10) : 1
            },
            getRowCount: function(columns) {
                var _self = this;
                return columns = columns || _self.getColumnCount(), (this.getCount() + columns - 1) / columns
            },
            _getNextItem: function(forward, skip, count) {
                var nextIndex, _self = this,
                    currentIndx = _self._getCurrentIndex(),
                    itemCount = _self.getCount(),
                    factor = forward ? 1 : -1;
                return currentIndx === -1 ? forward ? _self.getFirstItem() : _self.getLastItem() : (forward || (skip *= factor), nextIndex = (currentIndx + skip + count) % count, nextIndex > itemCount - 1 && (forward ? nextIndex -= itemCount - 1 : nextIndex += skip), _self.getItemAt(nextIndex))
            },
            _getLeftItem: function() {
                var _self = this,
                    count = _self.getCount(),
                    column = _self.getColumnCount();
                return !count || column <= 1 ? null : _self._getNextItem(!1, 1, count)
            },
            _getCurrentItem: function() {
                return this.getHighlighted()
            },
            _getCurrentIndex: function() {
                var _self = this,
                    item = _self._getCurrentItem();
                return this.indexOfItem(item)
            },
            _getRightItem: function() {
                var _self = this,
                    count = _self.getCount(),
                    column = _self.getColumnCount();
                return !count || column <= 1 ? null : this._getNextItem(!0, 1, count)
            },
            _getDownItem: function() {
                var _self = this,
                    columns = _self.getColumnCount(),
                    rows = _self.getRowCount(columns);
                return rows <= 1 ? null : this._getNextItem(!0, columns, columns * rows)
            },
            getScrollContainer: function() {
                return this.get("el")
            },
            isScrollVertical: function() {
                var _self = this,
                    el = _self.get("el"),
                    container = _self.get("view").getItemContainer();
                return el.height() < container.height()
            },
            _scrollToItem: function(item, element) {
                var _self = this;
                if (_self.isScrollVertical()) {
                    element = element || _self.findElement(item);
                    var container = _self.getScrollContainer(),
                        top = $(element).position().top,
                        ctop = container.position().top,
                        cHeight = container.height(),
                        distance = top - ctop,
                        height = $(element).height(),
                        scrollTop = container.scrollTop();
                    (distance < 0 || distance > cHeight - height) && container.scrollTop(scrollTop + distance)
                }
            },
            _getUpperItem: function() {
                var _self = this,
                    columns = _self.getColumnCount(),
                    rows = _self.getRowCount(columns);
                return rows <= 1 ? null : this._getNextItem(!1, columns, columns * rows)
            },
            handleNavUp: function(ev) {
                var _self = this,
                    upperItem = _self._getUpperItem();
                _self.setHighlighted(upperItem)
            },
            handleNavDown: function(ev) {
                this.setHighlighted(this._getDownItem())
            },
            handleNavLeft: function(ev) {
                this.setHighlighted(this._getLeftItem())
            },
            handleNavRight: function(ev) {
                this.setHighlighted(this._getRightItem())
            },
            handleNavEnter: function(ev) {
                var element, _self = this,
                    current = _self._getCurrentItem();
                current && (element = _self.findElement(current), $(element).trigger("click"))
            },
            handleNavEsc: function(ev) {
                this.setHighlighted(null)
            },
            handleNavTab: function(ev) {
                this.setHighlighted(this._getRightItem())
            }
        }), KeyNav
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            DataSortable = require("bui/data").Sortable,
            Sortable = function() {};
        return Sortable.ATTRS = BUI.merge(!0, DataSortable.ATTRS, {}), BUI.augment(Sortable, DataSortable, {
            compare: function(obj1, obj2, field, direction) {
                var dir, _self = this;
                return field = field || _self.get("sortField"), direction = direction || _self.get("sortDirection"), field && direction ? (dir = "ASC" === direction ? 1 : -1, $.isPlainObject(obj1) || (obj1 = _self.getItemByElement(obj1)), $.isPlainObject(obj2) || (obj2 = _self.getItemByElement(obj2)), _self.get("compareFunction")(obj1[field], obj2[field]) * dir) : 1
            },
            getSortData: function() {
                return $.makeArray(this.get("view").getAllElements())
            },
            sort: function(field, direction) {
                var _self = this,
                    sortedElements = _self.sortData(field, direction),
                    itemContainer = _self.get("view").getItemContainer();
                _self.get("store") || _self.sortData(field, direction, _self.get("items")), BUI.each(sortedElements, function(el) {
                    $(el).appendTo(itemContainer)
                })
            }
        }), Sortable
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            UIBase = BUI.Component.UIBase,
            UA = BUI.UA,
            DomList = require("bui/list/domlist"),
            KeyNav = require("bui/list/keynav"),
            Sortable = require("bui/list/sortable"),
            CLS_ITEM = BUI.prefix + "list-item",
            simpleListView = BUI.Component.View.extend([DomList.View], {
                setElementHover: function(element, hover) {
                    var _self = this;
                    _self.setItemStatusCls("hover", element, hover)
                }
            }, {
                ATTRS: {
                    itemContainer: {
                        valueFn: function() {
                            return this.get("el").find(this.get("listSelector"))
                        }
                    }
                }
            }, {
                xclass: "simple-list-view"
            }),
            simpleList = BUI.Component.Controller.extend([DomList, UIBase.Bindable, KeyNav, Sortable], {
                bindUI: function() {
                    var _self = this,
                        itemCls = _self.get("itemCls"),
                        itemContainer = _self.get("view").getItemContainer();
                    itemContainer.delegate("." + itemCls, "mouseover", function(ev) {
                        if (!_self.get("disabled")) {
                            var element = ev.currentTarget,
                                item = _self.getItemByElement(element);
                            _self.isItemDisabled(ev.item, ev.currentTarget) || (UA.ie && UA.ie < 8 || !_self.get("focusable") || "hover" !== _self.get("highlightedStatus") ? _self.setItemStatus(item, "hover", !0, element) : _self.setHighlighted(item, element))
                        }
                    }).delegate("." + itemCls, "mouseout", function(ev) {
                        if (!_self.get("disabled")) {
                            var sender = $(ev.currentTarget);
                            _self.get("view").setElementHover(sender, !1)
                        }
                    })
                },
                onAdd: function(e) {
                    var _self = this,
                        store = _self.get("store"),
                        item = e.record;
                    0 == _self.getCount() ? _self.setItems(store.getResult()) : _self.addItemToView(item, e.index)
                },
                onRemove: function(e) {
                    var _self = this,
                        item = e.record;
                    _self.removeItem(item)
                },
                onUpdate: function(e) {
                    this.updateItem(e.record)
                },
                onLocalSort: function(e) {
                    this.get("frontSortable") ? this.sort(e.field, e.direction) : this.onLoad(e)
                },
                onLoad: function() {
                    var _self = this,
                        store = _self.get("store"),
                        items = store.getResult();
                    _self.set("items", items)
                }
            }, {
                ATTRS: {
                    frontSortable: {
                        value: !1
                    },
                    focusable: {
                        value: !1
                    },
                    items: {
                        view: !0,
                        value: []
                    },
                    itemCls: {
                        view: !0,
                        value: CLS_ITEM
                    },
                    idField: {
                        value: "value"
                    },
                    listSelector: {
                        view: !0,
                        value: "ul"
                    },
                    itemTpl: {
                        view: !0,
                        value: '<li role="option" class="' + CLS_ITEM + '">{text}</li>'
                    },
                    tpl: {
                        value: "<ul></ul>"
                    },
                    xview: {
                        value: simpleListView
                    }
                }
            }, {
                xclass: "simple-list",
                prority: 0
            });
        return simpleList.View = simpleListView, simpleList
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var SimpleList = require("bui/list/simplelist"),
            listbox = SimpleList.extend({
                bindUI: function() {
                    var _self = this;
                    _self.on("selectedchange", function(e) {
                        var item = e.item,
                            sender = $(e.domTarget),
                            checkbox = sender.find("input");
                        item && checkbox.attr("checked", e.selected)
                    })
                }
            }, {
                ATTRS: {
                    itemTpl: {
                        value: '<li><span class="x-checkbox"></span>{text}</li>'
                    },
                    multipleSelect: {
                        value: !0
                    }
                }
            }, {
                xclass: "listbox"
            });
        return listbox
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            UIBase = Component.UIBase,
            itemView = Component.View.extend([UIBase.ListItemView], {}),
            item = Component.Controller.extend([UIBase.ListItem], {}, {
                ATTRS: {
                    elTagName: {
                        view: !0,
                        value: "li"
                    },
                    xview: {
                        value: itemView
                    },
                    tpl: {
                        view: !0,
                        value: "<span>{text}</span>"
                    }
                }
            }, {
                xclass: "list-item"
            });
        return item.View = itemView, item
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            UIBase = Component.UIBase,
            list = Component.Controller.extend([UIBase.ChildList], {}, {
                ATTRS: {
                    elTagName: {
                        view: !0,
                        value: "ul"
                    },
                    idField: {
                        value: "id"
                    },
                    defaultChildClass: {
                        value: "list-item"
                    }
                }
            }, {
                xclass: "list"
            });
        return list
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Picker = BUI.namespace("Picker");
        return BUI.mix(Picker, {
            Picker: require("bui/picker/picker"),
            ListPicker: require("bui/picker/listpicker")
        }), Picker
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Overlay = require("bui/overlay").Overlay,
            picker = Overlay.extend({
                bindUI: function() {
                    var _self = this;
                    _self.get("hideEvent"), $(_self.get("trigger"));
                    _self.on("show", function(ev) {
                        if (_self.get("isInit") || _self._initControl(), _self.get("autoSetValue")) {
                            var valueField = _self.get("valueField") || _self.get("textField") || _self.get("curTrigger"),
                                val = $(valueField).val();
                            _self.setSelectedValue(val)
                        }
                    })
                },
                _initControl: function() {
                    var _self = this;
                    if (!_self.get("isInit")) {
                        if (!_self.get("innerControl")) {
                            var control = _self.createControl();
                            _self.get("children").push(control)
                        }
                        _self.initControlEvent(), _self.set("isInit", !0)
                    }
                },
                initControl: function() {
                    this._initControl()
                },
                createControl: function() {},
                initControlEvent: function() {
                    var _self = this,
                        innerControl = _self.get("innerControl"),
                        trigger = $(_self.get("trigger")),
                        hideEvent = _self.get("hideEvent");
                    innerControl.on(_self.get("changeEvent"), function(e) {
                        var curTrigger = _self.get("curTrigger"),
                            textField = _self.get("textField") || curTrigger || trigger,
                            valueField = _self.get("valueField"),
                            selValue = _self.getSelectedValue(),
                            isChange = !1;
                        if (textField) {
                            var selText = _self.getSelectedText(),
                                preText = $(textField).val();
                            selText != preText && ($(textField).val(selText), isChange = !0, $(textField).trigger("change"))
                        }
                        if (valueField) {
                            var preValue = $(valueField).val();
                            valueField != preValue && ($(valueField).val(selValue), isChange = !0, $(valueField).trigger("change"))
                        }
                        isChange && _self.onChange(selText, selValue, e)
                    }), hideEvent && innerControl.on(_self.get("hideEvent"), function() {
                        var curTrigger = _self.get("curTrigger");
                        try {
                            curTrigger && curTrigger.focus()
                        } catch (e) {
                            BUI.log(e)
                        }
                        _self.hide()
                    })
                },
                setSelectedValue: function(val) {},
                getSelectedValue: function() {},
                getSelectedText: function() {},
                focus: function() {
                    this.get("innerControl").focus()
                },
                onChange: function(selText, selValue, ev) {
                    var _self = this,
                        curTrigger = _self.get("curTrigger");
                    _self.fire("selectedchange", {
                        value: selValue,
                        text: selText,
                        curTrigger: curTrigger
                    })
                },
                handleNavEsc: function(ev) {
                    this.hide()
                },
                _uiSetValueField: function(v) {
                    var _self = this;
                    null != v && "" !== v && _self.setSelectedValue($(v).val())
                },
                _getTextField: function() {
                    var _self = this;
                    return _self.get("textField") || _self.get("curTrigger")
                }
            }, {
                ATTRS: {
                    innerControl: {
                        getter: function() {
                            return this.get("children")[0]
                        }
                    },
                    triggerEvent: {
                        value: "click"
                    },
                    autoSetValue: {
                        value: !0
                    },
                    changeEvent: {
                        value: "selectedchange"
                    },
                    autoHide: {
                        value: !0
                    },
                    hideEvent: {
                        value: "itemclick"
                    },
                    textField: {},
                    align: {
                        value: {
                            points: ["bl", "tl"],
                            offset: [0, 0]
                        }
                    },
                    valueField: {}
                }
            }, {
                xclass: "picker"
            });
        return picker
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Picker = (require("bui/list"), require("bui/picker/picker")),
            listPicker = Picker.extend({
                initializer: function() {
                    var _self = this,
                        children = _self.get("children"),
                        list = _self.get("list");
                    list || children.push({})
                },
                setSelectedValue: function(val) {
                    val = val ? val.toString() : "", this.get("isInit") || this._initControl();
                    var _self = this,
                        list = _self.get("list"),
                        selectedValue = _self.getSelectedValue();
                    val !== selectedValue && list.getCount() && (list.get("multipleSelect") && list.clearSelection(), list.setSelectionByField(val.split(",")))
                },
                onChange: function(selText, selValue, ev) {
                    var _self = this,
                        curTrigger = _self.get("curTrigger");
                    _self.fire("selectedchange", {
                        value: selValue,
                        text: selText,
                        curTrigger: curTrigger,
                        item: ev.item
                    })
                },
                getSelectedValue: function() {
                    return this.get("isInit") || this._initControl(), this.get("list").getSelectionValues().join(",")
                },
                getSelectedText: function() {
                    return this.get("isInit") || this._initControl(), this.get("list").getSelectionText().join(",")
                }
            }, {
                ATTRS: {
                    defaultChildClass: {
                        value: "simple-list"
                    },
                    list: {
                        getter: function() {
                            return this.get("children")[0]
                        }
                    }
                }
            }, {
                xclass: "list-picker"
            });
        return listPicker
    }),
    function() {
        var BASE = "bui/form/";
        define("src/hephaistos/js/bui-debug", [], function(r) {
            var BUI = r("bui/common"),
                Form = BUI.namespace("Form"),
                Tips = r(BASE + "tips");
            return BUI.mix(Form, {
                Tips: Tips,
                TipItem: Tips.Item,
                FieldContainer: r(BASE + "fieldcontainer"),
                Form: r(BASE + "form"),
                Row: r(BASE + "row"),
                Group: r(BASE + "fieldgroup"),
                HForm: r(BASE + "horizontal"),
                Rules: r(BASE + "rules"),
                Field: r(BASE + "field"),
                FieldGroup: r(BASE + "fieldgroup")
            }), Form
        })
    }(), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            prefix = BUI.prefix,
            Overlay = require("bui/overlay").Overlay,
            FIELD_TIP = "data-tip",
            CLS_TIP_CONTAINER = prefix + "form-tip-container",
            tipItem = Overlay.extend({
                initializer: function() {
                    var _self = this,
                        render = _self.get("render");
                    if (!render) {
                        var parent = $(_self.get("trigger")).parent();
                        _self.set("render", parent)
                    }
                },
                renderUI: function() {
                    var _self = this;
                    _self.resetVisible()
                },
                resetVisible: function() {
                    var _self = this,
                        triggerEl = $(_self.get("trigger"));
                    triggerEl.val() ? _self.set("visible", !1) : (_self.set("align", {
                        node: $(_self.get("trigger")),
                        points: ["cl", "cl"]
                    }), _self.set("visible", !0))
                },
                bindUI: function() {
                    var _self = this,
                        triggerEl = $(_self.get("trigger"));
                    _self.get("el").on("click", function() {
                        _self.hide(), triggerEl.focus()
                    }), triggerEl.on("click focus", function() {
                        _self.hide()
                    }), triggerEl.on("blur", function() {
                        _self.resetVisible()
                    })
                }
            }, {
                ATTRS: {
                    trigger: {},
                    text: {},
                    iconCls: {},
                    tpl: {
                        value: '<span class="{iconCls}"></span><span class="tip-text">{text}</span>'
                    }
                }
            }, {
                xclass: "form-tip"
            }),
            Tips = function(config) {
                return this.constructor !== Tips ? new Tips(config) : (Tips.superclass.constructor.call(this, config), void this._init())
            };
        return Tips.ATTRS = {
            form: {},
            items: {
                valueFn: function() {
                    return []
                }
            }
        }, BUI.extend(Tips, BUI.Base), BUI.augment(Tips, {
            _init: function() {
                var _self = this,
                    form = $(_self.get("form"));
                form.length && (BUI.each($.makeArray(form[0].elements), function(elem) {
                    var tipConfig = $(elem).attr(FIELD_TIP);
                    tipConfig && _self._initFormElement(elem, $.parseJSON(tipConfig))
                }), form.addClass(CLS_TIP_CONTAINER))
            },
            _initFormElement: function(element, config) {
                config && (config.trigger = element);
                var _self = this,
                    items = _self.get("items"),
                    item = new tipItem(config);
                items.push(item)
            },
            getItem: function(name) {
                var _self = this,
                    items = _self.get("items"),
                    result = null;
                return BUI.each(items, function(item) {
                    if ($(item.get("trigger")).attr("name") === name) return result = item, !1
                }), result
            },
            resetVisible: function() {
                var _self = this,
                    items = _self.get("items");
                BUI.each(items, function(item) {
                    item.resetVisible()
                })
            },
            render: function() {
                var _self = this,
                    items = _self.get("items");
                BUI.each(items, function(item) {
                    item.render()
                })
            },
            destroy: function() {
                var _self = this,
                    items = _self.get(items);
                BUI.each(items, function(item) {
                    item.destroy()
                })
            }
        }), Tips.Item = tipItem, Tips
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            TipItem = require("bui/form/tips").Item,
            Valid = require("bui/form/valid"),
            Remote = require("bui/form/remote"),
            CLS_FIELD_ERROR = BUI.prefix + "form-field-error",
            fieldView = Component.View.extend([Remote.View, Valid.View], {
                renderUI: function() {
                    var _self = this,
                        control = _self.get("control");
                    if (control) _self.set("controlContainer", control.parent());
                    else {
                        var controlTpl = _self.get("controlTpl"),
                            container = _self.getControlContainer();
                        if (controlTpl) {
                            var control = $(controlTpl).appendTo(container);
                            _self.set("control", control)
                        }
                    }
                },
                clearErrors: function() {
                    var _self = this,
                        msgEl = _self.get("msgEl");
                    msgEl && (msgEl.remove(), _self.set("msgEl", null)), _self.get("el").removeClass(CLS_FIELD_ERROR);
                },
                showError: function(msg, errorTpl) {
                    var _self = this,
                        control = _self.get("control"),
                        errorMsg = BUI.substitute(errorTpl, {
                            error: msg
                        }),
                        el = $(errorMsg);
                    el.appendTo(control.parent()), _self.set("msgEl", el), _self.get("el").addClass(CLS_FIELD_ERROR)
                },
                getControlContainer: function() {
                    var _self = this,
                        el = _self.get("el"),
                        controlContainer = _self.get("controlContainer");
                    return controlContainer && BUI.isString(controlContainer) && (controlContainer = el.find(controlContainer)), controlContainer && controlContainer.length ? controlContainer : el
                },
                getLoadingContainer: function() {
                    return this.getControlContainer()
                },
                _uiSetName: function(v) {
                    var _self = this;
                    _self.get("control").attr("name", v)
                }
            }, {
                ATTRS: {
                    error: {},
                    controlContainer: {},
                    msgEl: {},
                    control: {}
                }
            }),
            field = Component.Controller.extend([Remote, Valid], {
                isField: !0,
                initializer: function() {
                    var _self = this;
                    _self.on("afterRenderUI", function() {
                        var tip = _self.get("tip");
                        tip && (tip.trigger = _self.getTipTigger(), tip.autoRender = !0, tip = new TipItem(tip), _self.set("tip", tip))
                    })
                },
                bindUI: function() {
                    var _self = this,
                        validEvent = _self.get("validEvent"),
                        changeEvent = _self.get("changeEvent"),
                        firstValidEvent = _self.get("firstValidEvent"),
                        innerControl = _self.getInnerControl();
                    innerControl.is("select") && (validEvent = "change"), innerControl.on(validEvent, function() {
                        var value = _self.getControlValue(innerControl);
                        _self.validControl(value)
                    }), firstValidEvent && innerControl.on(firstValidEvent, function() {
                        if (!_self.get("hasValid")) {
                            var value = _self.getControlValue(innerControl);
                            _self.validControl(value)
                        }
                    }), _self.on(changeEvent, function() {
                        _self.onValid()
                    }), _self.on("remotecomplete", function(ev) {
                        _self._setError(ev.error)
                    })
                },
                onValid: function() {
                    var _self = this,
                        value = _self.getControlValue();
                    value = _self.parseValue(value), _self.isCurrentValue(value) || (_self.setInternal("value", value), _self.onChange())
                },
                onChange: function() {
                    this.fire("change")
                },
                isCurrentValue: function(value) {
                    return value == this.get("value")
                },
                _clearError: function() {
                    this.set("error", null), this.get("view").clearErrors()
                },
                _setError: function(msg) {
                    this.set("error", msg), this.showErrors()
                },
                getControlValue: function(innerControl) {
                    var _self = this;
                    return innerControl = innerControl || _self.getInnerControl(), innerControl.val()
                },
                getControlContainer: function() {
                    return this.get("view").getControlContainer()
                },
                getRemoteParams: function() {
                    var _self = this,
                        rst = {};
                    return rst[_self.get("name")] = _self.getControlValue(), rst
                },
                setControlValue: function(value) {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    innerControl.val(value)
                },
                parseValue: function(value) {
                    return value
                },
                valid: function() {
                    var _self = this;
                    _self.validControl()
                },
                validControl: function(value) {
                    var errorMsg, _self = this;
                    return value = value || _self.getControlValue(), preError = _self.get("error"), errorMsg = _self.getValidError(value), _self.setInternal("hasValid", !0), errorMsg ? (_self._setError(errorMsg), _self.fire("error", {
                        msg: errorMsg,
                        value: value
                    }), preError !== errorMsg && _self.fire("validchange", {
                        valid: !1
                    })) : (_self._clearError(), _self.fire("valid"), preError && _self.fire("validchange", {
                        valid: !0
                    })), !errorMsg
                },
                focus: function() {
                    this.getInnerControl().focus()
                },
                change: function() {
                    var control = this.getInnerControl();
                    control.change()
                },
                blur: function() {
                    this.getInnerControl().blur()
                },
                isValid: function() {
                    var _self = this;
                    return _self.get("hasValid") || _self.validControl(), !_self.get("error")
                },
                getError: function() {
                    return this.get("error")
                },
                getErrors: function() {
                    var error = this.getError();
                    return error ? [error] : []
                },
                clearErrors: function(reset) {
                    var _self = this;
                    _self._clearError(), reset && _self.getControlValue() != _self.get("value") && _self.setControlValue(_self.get("value"))
                },
                getInnerControl: function() {
                    return this.get("view").get("control")
                },
                getTipTigger: function() {
                    return this.getInnerControl()
                },
                destructor: function() {
                    var _self = this,
                        tip = _self.get("tip");
                    tip && tip.destroy && tip.destroy()
                },
                setInnerWidth: function(width) {
                    var _self = this,
                        innerControl = _self.getInnerControl(),
                        siblings = innerControl.siblings(),
                        appendWidth = innerControl.outerWidth() - innerControl.width();
                    BUI.each(siblings, function(dom) {
                        appendWidth += $(dom).outerWidth()
                    }), innerControl.width(width - appendWidth)
                },
                _resetTip: function() {
                    var _self = this,
                        tip = _self.get("tip");
                    tip && tip.resetVisible()
                },
                resetTip: function() {
                    this._resetTip()
                },
                _uiSetValue: function(v) {
                    var _self = this;
                    _self.setControlValue(v), _self.get("rendered") && (_self.validControl(), _self.onChange()), _self._resetTip()
                },
                _uiSetDisabled: function(v) {
                    var _self = this,
                        innerControl = _self.getInnerControl(),
                        children = _self.get("children");
                    innerControl.attr("disabled", v), _self.get("rendered") && (v && _self.clearErrors(), v || _self.valid()), BUI.each(children, function(child) {
                        child.set("disabled", v)
                    })
                },
                _uiSetWidth: function(v) {
                    var _self = this;
                    null != v && _self.get("forceFit") && _self.setInnerWidth(v)
                }
            }, {
                ATTRS: {
                    hasValid: {
                        value: !1
                    },
                    forceFit: {
                        value: !1
                    },
                    tip: {},
                    changeEvent: {
                        value: "valid"
                    },
                    firstValidEvent: {
                        value: "blur"
                    },
                    validEvent: {
                        value: "keyup change"
                    },
                    name: {
                        view: !0
                    },
                    showError: {
                        view: !0,
                        value: !0
                    },
                    value: {
                        view: !0
                    },
                    label: {},
                    controlContainer: {
                        view: !0
                    },
                    control: {
                        view: !0
                    },
                    controlTpl: {
                        view: !0,
                        value: '<input type="text"/>'
                    },
                    events: {
                        value: {
                            error: !1,
                            valid: !1,
                            change: !0,
                            validchange: !0
                        }
                    },
                    tpl: {
                        value: "<label>{label}</label>"
                    },
                    xview: {
                        value: fieldView
                    }
                },
                PARSER: {
                    control: function(el) {
                        var control = el.find("input,select,textarea");
                        return control.length ? control : el
                    },
                    disabled: function(el) {
                        return !!el.attr("disabled")
                    },
                    value: function(el) {
                        var _self = this,
                            selector = "select,input,textarea",
                            value = _self.get("value");
                        return value || (el.is(selector) ? (value = el.val(), !value && el.is("select") && (value = el.attr("value"))) : value = el.find(selector).val()), value
                    },
                    name: function(el) {
                        var _self = this,
                            selector = "select,input,textarea",
                            name = _self.get("name");
                        return name || (name = el.is(selector) ? el.attr("name") : el.find(selector).attr("name")), name
                    }
                }
            }, {
                xclass: "form-field"
            });
        return field.View = fieldView, field
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Field = require("bui/form/basefield"),
            textField = Field.extend({}, {
                xclass: "form-field-text"
            });
        return textField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Field = require("bui/form/basefield"),
            TextAreaField = Field.extend({
                _uiSetRows: function(v) {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    v && innerControl.attr("rows", v)
                },
                _uiSetCols: function(v) {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    v && innerControl.attr("cols", v)
                }
            }, {
                ATTRS: {
                    controlTpl: {
                        value: "<textarea></textarea>"
                    },
                    rows: {},
                    cols: {},
                    decorateCfgFields: {
                        value: {
                            rows: !0,
                            cols: !0
                        }
                    }
                }
            }, {
                xclass: "form-field-textarea"
            });
        return TextAreaField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Field = require("bui/form/basefield"),
            numberField = Field.extend({
                parseValue: function(value) {
                    if ("" == value || null == value) return null;
                    if (BUI.isNumber(value)) return value;
                    var _self = this,
                        allowDecimals = _self.get("allowDecimals");
                    return value = value.replace(/\,/g, ""), allowDecimals ? parseFloat(parseFloat(value).toFixed(_self.get("decimalPrecision"))) : parseInt(value, 10)
                },
                _uiSetMax: function(v) {
                    this.addRule("max", v)
                },
                _uiSetMin: function(v) {
                    this.addRule("min", v)
                }
            }, {
                ATTRS: {
                    max: {},
                    min: {},
                    decorateCfgFields: {
                        value: {
                            min: !0,
                            max: !0
                        }
                    },
                    validEvent: {
                        value: "keyup change"
                    },
                    defaultRules: {
                        value: {
                            number: !0
                        }
                    },
                    allowDecimals: {
                        value: !0
                    },
                    decimalPrecision: {
                        value: 2
                    },
                    step: {
                        value: 1
                    }
                }
            }, {
                xclass: "form-field-number"
            });
        return numberField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Field = require("bui/form/basefield"),
            hiddenField = Field.extend({}, {
                ATTRS: {
                    controlTpl: {
                        value: '<input type="hidden"/>'
                    },
                    tpl: {
                        value: ""
                    }
                }
            }, {
                xclass: "form-field-hidden"
            });
        return hiddenField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Field = require("bui/form/basefield"),
            readonlyField = Field.extend({}, {
                ATTRS: {
                    controlTpl: {
                        value: '<input type="text" readonly="readonly"/>'
                    }
                }
            }, {
                xclass: "form-field-readonly"
            });
        return readonlyField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function resetOptions(select, options, self) {
            select.children().remove();
            var emptyText = self.get("emptyText");
            emptyText && self.get("showBlank") && appendItem("", emptyText, select), BUI.each(options, function(option) {
                appendItem(option.value, option.text, select)
            })
        }

        function appendItem(value, text, select) {
            var str = '<option value="' + value + '">' + text + "</option>";
            $(str).appendTo(select)
        }
        var BUI = require("bui/common"),
            Field = require("bui/form/basefield"),
            selectField = Field.extend({
                renderUI: function() {
                    var _self = this,
                        innerControl = _self.getInnerControl(),
                        select = _self.get("select");
                    _self.get("srcNode") && innerControl.is("select") || $.isPlainObject(select) && _self._initSelect(select)
                },
                _initSelect: function(select) {
                    var _self = this;
                    _self.get("items");
                    BUI.use("bui/select", function(Select) {
                        select.render = _self.getControlContainer(), select.valueField = _self.getInnerControl(), select.autoRender = !0, select = new Select.Select(select), _self.set("select", select), _self.set("isCreate", !0), _self.get("children").push(select), select.on("change", function(ev) {
                            var val = select.getSelectedValue();
                            _self.set("value", val)
                        })
                    })
                },
                setItems: function(items) {
                    var _self = this,
                        select = _self.get("select");
                    if ($.isPlainObject(items)) {
                        var tmp = [];
                        BUI.each(items, function(v, n) {
                            tmp.push({
                                value: n,
                                text: v
                            })
                        }), items = tmp
                    }
                    var control = _self.getInnerControl();
                    control.is("select") && (resetOptions(control, items, _self), _self.setControlValue(_self.get("value")), _self.getControlValue() || _self.setInternal("value", "")), select && (select.set ? select.set("items", items) : select.items = items)
                },
                setControlValue: function(value) {
                    var _self = this,
                        select = _self.get("select"),
                        innerControl = _self.getInnerControl();
                    innerControl.val(value), select && select.set && select.getSelectedValue() !== value && select.setSelectedValue(value)
                },
                getSelectedText: function() {
                    var _self = this,
                        select = _self.get("select"),
                        innerControl = _self.getInnerControl();
                    if (innerControl.is("select")) {
                        var dom = innerControl[0],
                            item = dom.options[dom.selectedIndex];
                        return item ? item.text : ""
                    }
                    return select.getSelectedText()
                },
                getTipTigger: function() {
                    var _self = this,
                        select = _self.get("select");
                    return select && select.rendered ? select.get("el").find("input") : _self.get("el")
                },
                _uiSetItems: function(v) {
                    v && this.setItems(v)
                },
                setInnerWidth: function(width) {
                    var _self = this,
                        innerControl = _self.getInnerControl(),
                        select = _self.get("select"),
                        appendWidth = innerControl.outerWidth() - innerControl.width();
                    innerControl.width(width - appendWidth), select && select.set && select.set("width", width)
                }
            }, {
                ATTRS: {
                    items: {},
                    controlTpl: {
                        value: '<input type="hidden"/>'
                    },
                    showBlank: {
                        value: !0
                    },
                    emptyText: {
                        value: "请选择"
                    },
                    select: {
                        shared: !1,
                        value: {}
                    }
                },
                PARSER: {
                    emptyText: function(el) {
                        if (!this.get("showBlank")) return "";
                        var options = el.find("option"),
                            rst = this.get("emptyText");
                        return options.length && (rst = $(options[0]).text()), rst
                    }
                }
            }, {
                xclass: "form-field-select"
            });
        return selectField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Field = require("bui/form/basefield"),
            DateUtil = BUI.Date,
            dateField = Field.extend({
                renderUI: function() {
                    var _self = this,
                        datePicker = _self.get("datePicker");
                    $.isPlainObject(datePicker) && _self.initDatePicker(datePicker), (datePicker.get && datePicker.get("showTime") || datePicker.showTime) && _self.getInnerControl().addClass("calendar-time")
                },
                initDatePicker: function(datePicker) {
                    var _self = this;
                    BUI.use("bui/calendar", function(Calendar) {
                        datePicker.trigger = _self.getInnerControl(), datePicker.autoRender = !0, datePicker = new Calendar.DatePicker(datePicker), _self.set("datePicker", datePicker), _self.set("isCreatePicker", !0), _self.get("children").push(datePicker)
                    })
                },
                setControlValue: function(value) {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    BUI.isDate(value) && (value = DateUtil.format(value, _self._getFormatMask())), innerControl.val(value)
                },
                _getFormatMask: function() {
                    var _self = this,
                        datePicker = _self.get("datePicker");
                    return datePicker.showTime || datePicker.get && datePicker.get("showTime") ? "yyyy-mm-dd HH:MM:ss" : "yyyy-mm-dd"
                },
                parseValue: function(value) {
                    return BUI.isNumber(value) ? new Date(value) : DateUtil.parse(value)
                },
                isCurrentValue: function(value) {
                    return DateUtil.isEquals(value, this.get("value"))
                },
                _uiSetMax: function(v) {
                    this.addRule("max", v);
                    var _self = this,
                        datePicker = _self.get("datePicker");
                    datePicker && (datePicker.set ? datePicker.set("maxDate", v) : datePicker.maxDate = v)
                },
                _uiSetMin: function(v) {
                    this.addRule("min", v);
                    var _self = this,
                        datePicker = _self.get("datePicker");
                    datePicker && (datePicker.set ? datePicker.set("minDate", v) : datePicker.minDate = v)
                }
            }, {
                ATTRS: {
                    controlTpl: {
                        value: '<input type="text" class="calendar"/>'
                    },
                    defaultRules: {
                        value: {
                            date: !0
                        }
                    },
                    max: {},
                    min: {},
                    value: {
                        setter: function(v) {
                            return BUI.isNumber(v) ? new Date(v) : v
                        }
                    },
                    datePicker: {
                        shared: !1,
                        value: {}
                    },
                    isCreatePicker: {
                        value: !0
                    }
                },
                PARSER: {
                    datePicker: function(el) {
                        var _self = this,
                            cfg = _self.get("datePicker") || {};
                        return el.hasClass("calendar-time") && BUI.mix(cfg, {
                            showTime: !0
                        }), cfg
                    }
                }
            }, {
                xclass: "form-field-date"
            });
        return dateField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Field = require("bui/form/basefield"),
            checkField = Field.extend({
                onValid: function() {
                    var _self = this,
                        checked = _self._getControlChecked();
                    _self.setInternal("checked", checked), _self.fire("change"), checked ? _self.fire("checked") : _self.fire("unchecked")
                },
                _setControlChecked: function(checked) {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    innerControl.attr("checked", !!checked)
                },
                _getControlChecked: function() {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    return !!innerControl.attr("checked")
                },
                _uiSetValue: function(v) {},
                _uiSetWidth: function(v) {},
                _uiSetChecked: function(v) {
                    var _self = this;
                    _self._setControlChecked(v), _self.get("rendered") && _self.onValid()
                }
            }, {
                ATTRS: {
                    validEvent: {
                        value: "click"
                    },
                    checked: {
                        value: !1
                    },
                    events: {
                        value: {
                            checked: !1,
                            unchecked: !1
                        }
                    }
                },
                PARSER: {
                    checked: function(el) {
                        return !!el.attr("checked")
                    }
                }
            }, {
                xclass: "form-check-field"
            });
        return checkField
    }), define("src/hephaistos/js/bui-debug", [], function(required) {
        var CheckField = required("bui/form/checkfield"),
            CheckBoxField = CheckField.extend({}, {
                ATTRS: {
                    controlTpl: {
                        view: !0,
                        value: '<input type="checkbox"/>'
                    },
                    controlContainer: {
                        value: ".checkbox"
                    },
                    tpl: {
                        value: '<label><span class="checkbox"></span>{label}</label>'
                    }
                }
            }, {
                xclass: "form-field-checkbox"
            });
        return CheckBoxField
    }), define("src/hephaistos/js/bui-debug", [], function(required) {
        var CheckField = required("bui/form/checkfield"),
            RadioField = CheckField.extend({
                bindUI: function() {
                    var _self = this,
                        parent = _self.get("parent"),
                        name = _self.get("name");
                    parent && _self.getInnerControl().on("click", function(ev) {
                        var fields = parent.getFields(name);
                        BUI.each(fields, function(field) {
                            field != _self && field.set("checked", !1)
                        })
                    })
                }
            }, {
                ATTRS: {
                    controlTpl: {
                        view: !0,
                        value: '<input type="radio"/>'
                    },
                    controlContainer: {
                        value: ".radio"
                    },
                    tpl: {
                        value: '<label><span class="radio"></span>{label}</label>'
                    }
                }
            }, {
                xclass: "form-field-radio"
            });
        return RadioField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Field = require("bui/form/basefield"),
            PlainFieldView = Field.View.extend({
                _uiSetValue: function(v) {
                    var textTpl, _self = this,
                        textEl = _self.get("textEl"),
                        container = _self.getControlContainer(),
                        renderer = _self.get("renderer"),
                        text = renderer ? renderer(v) : v,
                        width = _self.get("width"),
                        appendWidth = 0;
                    textEl && textEl.remove(), text = text || "&nbsp;", textTpl = BUI.substitute(_self.get("textTpl"), {
                        text: text
                    }), textEl = $(textTpl).appendTo(container), appendWidth = textEl.outerWidth() - textEl.width(), textEl.width(width - appendWidth), _self.set("textEl", textEl)
                }
            }, {
                ATTRS: {
                    textEl: {},
                    value: {}
                }
            }, {
                xclass: "form-field-plain-view"
            }),
            PlainField = Field.extend({}, {
                ATTRS: {
                    controlTpl: {
                        value: '<input type="hidden"/>'
                    },
                    textTpl: {
                        view: !0,
                        value: '<span class="x-form-text">{text}</span>'
                    },
                    renderer: {
                        view: !0,
                        value: function(value) {
                            return value
                        }
                    },
                    tpl: {
                        value: ""
                    },
                    xview: {
                        value: PlainFieldView
                    }
                }
            }, {
                xclass: "form-field-plain"
            });
        return PlainField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function parseItems(items) {
            var rst = items;
            return $.isPlainObject(items) && (rst = [], BUI.each(items, function(v, k) {
                rst.push({
                    text: v,
                    value: k
                })
            })), rst
        }
        var BUI = require("bui/common"),
            List = require("bui/list"),
            Field = require("bui/form/basefield"),
            List = Field.extend({
                initializer: function() {
                    var _self = this;
                    _self._initList()
                },
                _getList: function() {
                    var _self = this,
                        children = _self.get("children");
                    return children[0]
                },
                bindUI: function() {
                    var _self = this,
                        list = _self._getList();
                    list && list.on("selectedchange", function() {
                        var value = _self._getListValue(list);
                        _self.set("value", value)
                    })
                },
                _getListValue: function(list) {
                    var _self = this;
                    return list = list || _self._getList(), list.getSelectionValues().join(",")
                },
                setControlValue: function(value) {
                    var _self = this,
                        innerControl = _self.getInnerControl(),
                        list = _self._getList();
                    innerControl.val(value), _self._getListValue(list) !== value && list.getCount() && (list.get("multipleSelect") && list.clearSelection(), list.setSelectionByField(value.split(",")))
                },
                syncUI: function() {
                    this.set("list", this._getList())
                },
                _initList: function() {
                    var _self = this,
                        defaultListCfg = _self.get("defaultListCfg"),
                        children = _self.get("children"),
                        list = _self.get("list") || {};
                    children[0] || ($.isPlainObject(list) && BUI.mix(list, defaultListCfg), children.push(list))
                },
                setItems: function(items) {
                    var _self = this,
                        value = _self.get("value"),
                        list = _self._getList();
                    list.set("items", parseItems(items)), list.setSelectionByField(value.split(","))
                },
                _uiSetItems: function(v) {
                    v && this.setItems(v)
                }
            }, {
                ATTRS: {
                    controlTpl: {
                        value: '<input type="hidden"/>'
                    },
                    defaultListCfg: {
                        value: {
                            xclass: "simple-list"
                        }
                    },
                    items: {
                        setter: function(v) {
                            if ($.isPlainObject(v)) {
                                var rst = [];
                                BUI.each(v, function(v, k) {
                                    rst.push({
                                        value: k,
                                        text: v
                                    })
                                }), v = rst
                            }
                            return v
                        }
                    },
                    list: {}
                },
                PARSER: {
                    list: function(el) {
                        var listEl = el.find(".bui-simple-list");
                        if (listEl.length) return {
                            srcNode: listEl
                        }
                    }
                }
            }, {
                xclass: "form-field-list"
            });
        return List
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            JSON = BUI.JSON,
            Field = require("bui/form/basefield"),
            Rules = require("bui/form/rules"),
            uploaderField = Field.extend({
                renderUI: function() {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    _self.get("srcNode") && "file" === innerControl.get(0).type || (_self._initControlValue(), _self._initUpload())
                },
                _initUpload: function() {
                    var _self = this,
                        uploader = (_self.get("children"), _self.get("uploader") || {});
                    BUI.use("bui/uploader", function(Uploader) {
                        uploader.render = _self.getControlContainer(), uploader.autoRender = !0, uploader = new Uploader.Uploader(uploader), _self.set("uploader", uploader), _self.set("isCreate", !0), _self.get("children").push(uploader), _self._initQueue(uploader.get("queue")), uploader.on("success", function(ev) {
                            var result = _self._getUploaderResult();
                            _self.setControlValue(result)
                        }), uploader.get("queue").on("itemremoved", function() {
                            var result = _self._getUploaderResult();
                            _self.setControlValue(result)
                        })
                    })
                },
                _getUploaderResult: function() {
                    var _self = this,
                        uploader = _self.get("uploader"),
                        queue = uploader.get("queue"),
                        items = queue.getItems(),
                        result = [];
                    return BUI.each(items, function(item) {
                        item.result && result.push(item.result)
                    }), result
                },
                setControlValue: function(items) {
                    var _self = this,
                        innerControl = _self.getInnerControl();
                    innerControl.val(JSON.stringify(items))
                },
                _initControlValue: function() {
                    var value, _self = this,
                        textValue = _self.getControlValue();
                    textValue && (value = BUI.JSON.parse(textValue), _self.set("value", value))
                },
                _initQueue: function(queue) {
                    var _self = this,
                        value = _self.get("value"),
                        result = [];
                    BUI.each(value, function(item) {
                        var newItem = BUI.cloneObject(item);
                        newItem.success = !0, newItem.result = item, result.push(newItem)
                    }), queue && queue.setItems(result)
                }
            }, {
                ATTRS: {
                    controlTpl: {
                        value: '<input type="hidden"/>'
                    },
                    uploader: {
                        setter: function(v) {
                            var disabled = this.get("disabled");
                            return v && v.isController && v.set("disabled", disabled), v
                        }
                    },
                    disabled: {
                        setter: function(v) {
                            var _self = this,
                                uploader = _self.get("uploader");
                            uploader && uploader.isController && uploader.set("disabled", v)
                        }
                    },
                    value: {
                        shared: !1,
                        value: []
                    },
                    defaultRules: function() {}
                }
            }, {
                xclass: "form-field-uploader"
            });
        return Rules.add({
            name: "uploader",
            msg: "上传文件选择有误！",
            validator: function(value, baseValue, formatMsg, field) {
                var uploader = field.get("uploader");
                if (uploader && !uploader.isValid()) return formatMsg
            }
        }), uploaderField
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";
        var ListField = (require("bui/common"), require("bui/form/listfield")),
            CheckList = ListField.extend({}, {
                ATTRS: {
                    defaultListCfg: {
                        value: {
                            itemTpl: '<li><span class="x-checkbox"></span>{text}</li>',
                            multipleSelect: !0,
                            allowTextSelection: !1
                        }
                    }
                }
            }, {
                xclass: "form-field-checklist"
            });
        return CheckList
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";
        var ListField = (require("bui/common"), require("bui/form/listfield")),
            RadioList = ListField.extend({}, {
                ATTRS: {
                    defaultListCfg: {
                        value: {
                            itemTpl: '<li><span class="x-radio"></span>{text}</li>',
                            allowTextSelection: !1
                        }
                    }
                }
            }, {
                xclass: "form-field-radiolist"
            });
        return RadioList
    }),
    function() {
        var BASE = "bui/form/";
        define("src/hephaistos/js/bui-debug", [], function(require) {
            var BUI = require("bui/common"),
                Field = require(BASE + "basefield");
            return BUI.mix(Field, {
                Text: require(BASE + "textfield"),
                Date: require(BASE + "datefield"),
                Select: require(BASE + "selectfield"),
                Hidden: require(BASE + "hiddenfield"),
                Number: require(BASE + "numberfield"),
                Check: require(BASE + "checkfield"),
                Radio: require(BASE + "radiofield"),
                Checkbox: require(BASE + "checkboxfield"),
                Plain: require(BASE + "plainfield"),
                List: require(BASE + "listfield"),
                TextArea: require(BASE + "textareafield"),
                Uploader: require(BASE + "uploaderfield"),
                CheckList: require(BASE + "checklistfield"),
                RadioList: require(BASE + "radiolistfield")
            }), Field
        })
    }(), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Rules = require("bui/form/rules"),
            ValidView = function() {};
        ValidView.prototype = {
            getErrorsContainer: function() {
                var _self = this,
                    errorContainer = _self.get("errorContainer");
                return errorContainer ? BUI.isString(errorContainer) ? _self.get("el").find(errorContainer) : errorContainer : _self.getContentElement()
            },
            showErrors: function(errors) {
                var _self = this,
                    errorsContainer = _self.getErrorsContainer(),
                    errorTpl = _self.get("errorTpl");
                if (_self.clearErrors(), _self.get("showError")) return _self.get("showOneError") ? void(errors && errors.length && _self.showError(errors[0], errorTpl, errorsContainer)) : void BUI.each(errors, function(error) {
                    error && _self.showError(error, errorTpl, errorsContainer)
                })
            },
            showError: function(msg, errorTpl, container) {},
            clearErrors: function() {}
        };
        var Valid = function() {};
        return Valid.ATTRS = {
            defaultRules: {
                value: {}
            },
            defaultMessages: {
                value: {}
            },
            rules: {
                shared: !1,
                value: {}
            },
            messages: {
                shared: !1,
                value: {}
            },
            validator: {},
            errorContainer: {
                view: !0
            },
            errorTpl: {
                view: !0,
                value: '<span class="x-field-error"><span class="x-icon x-icon-mini x-icon-error">!</span><label class="x-field-error-text">{error}</label></span>'
            },
            showError: {
                view: !0,
                value: !0
            },
            showOneError: {},
            error: {}
        }, Valid.prototype = {
            __bindUI: function() {
                var _self = this;
                _self.on("afterDisabledChange", function(ev) {
                    var disabled = ev.newVal;
                    disabled ? _self.clearErrors(!1, !1) : _self.valid()
                })
            },
            isValid: function() {},
            valid: function() {},
            validControl: function() {},
            validRules: function(rules, value) {
                if (rules) {
                    var _self = this,
                        messages = _self._getValidMessages(),
                        error = null;
                    for (var name in rules)
                        if (rules.hasOwnProperty(name)) {
                            var baseValue = rules[name];
                            if (error = Rules.valid(name, value, baseValue, messages[name], _self)) break
                        }
                    return error
                }
            },
            _getValidMessages: function() {
                var _self = this,
                    defaultMessages = _self.get("defaultMessages"),
                    messages = _self.get("messages");
                return BUI.merge(defaultMessages, messages)
            },
            getValidError: function(value) {
                var _self = this,
                    validator = _self.get("validator"),
                    error = null;
                return error = _self.validRules(_self.get("defaultRules"), value) || _self.validRules(_self.get("rules"), value), error || (_self.parseValue && (value = _self.parseValue(value)), error = validator ? validator.call(this, value) : ""), error
            },
            getErrors: function() {},
            showErrors: function(errors) {
                var _self = this,
                    errors = errors || _self.getErrors();
                _self.get("view").showErrors(errors)
            },
            clearErrors: function(reset, deep) {
                deep = null == deep || deep;
                var _self = this,
                    children = _self.get("children");
                deep && BUI.each(children, function(item) {
                    item.clearErrors && (item.field ? item.clearErrors(reset) : item.clearErrors(deep, reset))
                }), _self.set("error", null), _self.get("view").clearErrors()
            },
            addRule: function(name, value, message) {
                var _self = this,
                    rules = _self.get("rules"),
                    messages = _self.get("messages");
                rules[name] = value, message && (messages[name] = message)
            },
            addRules: function(rules, messages) {
                var _self = this;
                BUI.each(rules, function(value, name) {
                    var msg = messages ? messages[name] : null;
                    _self.addRule(name, value, msg)
                })
            },
            removeRule: function(name) {
                var _self = this,
                    rules = _self.get("rules");
                delete rules[name]
            },
            clearRules: function() {
                var _self = this;
                _self.set("rules", {})
            }
        }, Valid.View = ValidView, Valid
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function GroupValidView() {}

        function GroupValid() {}
        var CLS_ERROR = "x-form-error",
            Valid = require("bui/form/valid");
        return BUI.augment(GroupValidView, Valid.View, {
            showError: function(msg, errorTpl, container) {
                var errorMsg = BUI.substitute(errorTpl, {
                        error: msg
                    }),
                    el = $(errorMsg);
                el.appendTo(container), el.addClass(CLS_ERROR)
            },
            clearErrors: function() {
                var _self = this,
                    errorContainer = _self.getErrorsContainer();
                errorContainer.children("." + CLS_ERROR).remove()
            }
        }), GroupValid.ATTRS = ATTRS = BUI.merge(!0, Valid.ATTRS, {
            events: {
                value: {
                    validchange: !0,
                    change: !0
                }
            }
        }), BUI.augment(GroupValid, Valid, {
            __bindUI: function() {
                var _self = this,
                    validEvent = "validchange change";
                _self.on(validEvent, function(ev) {
                    var sender = ev.target;
                    if (sender != this && _self.get("showError")) {
                        var valid = sender.isValid();
                        _self._hasAllChildrenValid() && (valid = valid && _self.isChildrenValid(), valid && (_self.validControl(_self.getRecord()), valid = _self.isSelfValid())), valid ? _self.clearErrors() : _self.showErrors()
                    }
                })
            },
            isValid: function() {
                if (this.get("disabled")) return !0;
                var _self = this,
                    isValid = _self.isChildrenValid();
                return isValid && _self.isSelfValid()
            },
            valid: function() {
                var _self = this,
                    children = _self.get("children");
                _self.get("disabled") || BUI.each(children, function(item) {
                    item.get("disabled") || item.valid()
                })
            },
            _hasAllChildrenValid: function() {
                var _self = this,
                    children = _self.get("children"),
                    rst = !0;
                return BUI.each(children, function(item) {
                    if (!item.get("disabled") && item.get("hasValid") === !1) return rst = !1, !1
                }), rst
            },
            isChildrenValid: function() {
                var _self = this,
                    children = _self.get("children"),
                    isValid = !0;
                return BUI.each(children, function(item) {
                    if (!item.get("disabled") && !item.isValid()) return isValid = !1, !1
                }), isValid
            },
            isSelfValid: function() {
                return !this.get("error")
            },
            validControl: function(record) {
                var _self = this,
                    error = _self.getValidError(record);
                _self.set("error", error)
            },
            getErrors: function() {
                var _self = this,
                    children = _self.get("children"),
                    showChildError = _self.get("showChildError"),
                    validError = null,
                    rst = [];
                return showChildError && BUI.each(children, function(child) {
                    child.getErrors && (rst = rst.concat(child.getErrors()))
                }), _self._hasAllChildrenValid() && _self.isChildrenValid() && (validError = _self.get("error"), validError && rst.push(validError)), rst
            },
            _uiSetErrorTpl: function(v) {
                var _self = this,
                    children = _self.get("children");
                BUI.each(children, function(item) {
                    item.get("userConfig").errorTpl || item.set("errorTpl", v)
                })
            }
        }), GroupValid.View = GroupValidView, GroupValid
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function isField(node) {
            return node.is(FIELD_TAGS)
        }

        function getDecorateChilds(node, srcNode) {
            if (node != srcNode) {
                if (isField(node)) return [node];
                var cls = node.attr("class");
                if (cls && (cls.indexOf(CLS_GROUP) !== -1 || cls.indexOf(CLS_FIELD) !== -1)) return [node]
            }
            var rst = [],
                children = node.children();
            return BUI.each(children, function(subNode) {
                rst = rst.concat(getDecorateChilds($(subNode), srcNode))
            }), rst
        }
        var BUI = require("bui/common"),
            Field = require("bui/form/field"),
            GroupValid = require("bui/form/groupvalid"),
            PREFIX = BUI.prefix,
            FIELD_XCLASS = "form-field",
            CLS_FIELD = PREFIX + FIELD_XCLASS,
            CLS_GROUP = PREFIX + "form-group",
            FIELD_TAGS = "input,select,textarea",
            containerView = BUI.Component.View.extend([GroupValid.View]),
            container = BUI.Component.Controller.extend([GroupValid], {
                syncUI: function() {
                    var _self = this,
                        fields = _self.getFields(),
                        validators = _self.get("validators");
                    BUI.each(fields, function(field) {
                        var name = field.get("name");
                        validators[name] && field.set("validator", validators[name])
                    }), BUI.each(validators, function(item, key) {
                        if (0 == key.indexOf("#")) {
                            var id = key.replace("#", ""),
                                child = _self.getChild(id, !0);
                            child && child.set("validator", item)
                        }
                    })
                },
                getDecorateElments: function() {
                    var _self = this,
                        el = _self.get("el"),
                        items = getDecorateChilds(el, el);
                    return items
                },
                findXClassByNode: function(childNode, ignoreError) {
                    return "checkbox" === childNode.attr("type") ? FIELD_XCLASS + "-checkbox" : "radio" === childNode.attr("type") ? FIELD_XCLASS + "-radio" : "number" === childNode.attr("type") ? FIELD_XCLASS + "-number" : childNode.hasClass("calendar") ? FIELD_XCLASS + "-date" : "SELECT" == childNode[0].tagName ? FIELD_XCLASS + "-select" : isField(childNode) ? FIELD_XCLASS : BUI.Component.Controller.prototype.findXClassByNode.call(this, childNode, ignoreError)
                },
                getRecord: function() {
                    var _self = this,
                        rst = {},
                        fields = _self.getFields();
                    return BUI.each(fields, function(field) {
                        var name = field.get("name"),
                            value = _self._getFieldValue(field);
                        if (rst[name]) {
                            if (BUI.isArray(rst[name]) && null != value) rst[name].push(value);
                            else if (null != value) {
                                var arr = [rst[name]];
                                arr.push(value), rst[name] = arr
                            }
                        } else rst[name] = value
                    }), rst
                },
                getFields: function(name) {
                    var _self = this,
                        rst = [],
                        children = _self.get("children");
                    return BUI.each(children, function(item) {
                        item instanceof Field ? name && item.get("name") != name || rst.push(item) : item.getFields && (rst = rst.concat(item.getFields(name)))
                    }), rst
                },
                getField: function(name) {
                    var _self = this,
                        fields = _self.getFields(),
                        rst = null;
                    return BUI.each(fields, function(field) {
                        if (field.get("name") === name) return rst = field, !1
                    }), rst
                },
                getFieldAt: function(index) {
                    return this.getFields()[index]
                },
                setFieldValue: function(name, value) {
                    var _self = this,
                        fields = _self.getFields(name);
                    BUI.each(fields, function(field) {
                        _self._setFieldValue(field, value)
                    })
                },
                _setFieldValue: function(field, value) {
                    if (!field.get("disabled"))
                        if (field instanceof Field.Check) {
                            var fieldValue = field.get("value");
                            value && (fieldValue === value || BUI.isArray(value) && BUI.Array.contains(fieldValue, value)) ? field.set("checked", !0) : field.set("checked", !1)
                        } else null == value && (value = ""), field.set("value", value)
                },
                getFieldValue: function(name) {
                    var _self = this,
                        fields = _self.getFields(name),
                        rst = [];
                    return BUI.each(fields, function(field) {
                        var value = _self._getFieldValue(field);
                        value && rst.push(value)
                    }), 0 === rst.length ? null : 1 === rst.length ? rst[0] : rst
                },
                _getFieldValue: function(field) {
                    return field instanceof Field.Check && !field.get("checked") ? null : field.get("value")
                },
                clearFields: function() {
                    this.clearErrors(), this.setRecord({})
                },
                setRecord: function(record) {
                    var _self = this,
                        fields = _self.getFields();
                    BUI.each(fields, function(field) {
                        var name = field.get("name");
                        _self._setFieldValue(field, record[name])
                    })
                },
                updateRecord: function(record) {
                    var _self = this,
                        fields = _self.getFields();
                    BUI.each(fields, function(field) {
                        var name = field.get("name");
                        record.hasOwnProperty(name) && _self._setFieldValue(field, record[name])
                    })
                },
                focus: function() {
                    var _self = this,
                        fields = _self.getFields(),
                        firstField = fields[0];
                    firstField && firstField.focus()
                },
                _uiSetDisabled: function(v) {
                    var _self = this,
                        children = _self.get("children");
                    BUI.each(children, function(item) {
                        item.set("disabled", v)
                    })
                }
            }, {
                ATTRS: {
                    record: {
                        setter: function(v) {
                            this.setRecord(v)
                        },
                        getter: function() {
                            return this.getRecord()
                        }
                    },
                    validators: {
                        value: {}
                    },
                    defaultLoaderCfg: {
                        value: {
                            property: "children",
                            dataType: "json"
                        }
                    },
                    disabled: {
                        sync: !1
                    },
                    isDecorateChild: {
                        value: !0
                    },
                    xview: {
                        value: containerView
                    }
                }
            }, {
                xclass: "form-field-container"
            });
        return container.View = containerView, container
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var FieldContainer = (require("bui/common"), require("bui/form/fieldcontainer")),
            Group = FieldContainer.extend({}, {
                ATTRS: {
                    label: {
                        view: !0
                    },
                    defaultChildClass: {
                        value: "form-field"
                    }
                }
            }, {
                xclass: "form-group"
            });
        return Group
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function testRange(self, curVal, prevVal) {
            var allowEqual = self.get("allowEqual");
            return allowEqual ? prevVal <= curVal : prevVal < curVal
        }
        var Group = require("bui/form/group/base"),
            Range = Group.extend({}, {
                ATTRS: {
                    rangeText: {
                        value: "开始不能大于结束！"
                    },
                    allowEqual: {
                        value: !0
                    },
                    validator: {
                        value: function(record) {
                            for (var _self = this, fields = _self.getFields(), valid = !0, i = 1; i < fields.length; i++) {
                                var curVal, prevVal, cur = fields[i],
                                    prev = fields[i - 1];
                                if (cur && prev && (curVal = cur.get("value"), prevVal = prev.get("value"), !testRange(_self, curVal, prevVal))) {
                                    valid = !1;
                                    break
                                }
                            }
                            return valid ? null : _self.get("rangeText")
                        }
                    }
                }
            }, {
                xclass: "form-group-range"
            });
        return Range
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getFieldName(self) {
            var firstField = self.getFieldAt(0);
            return firstField ? firstField.get("name") : "";
        }
        var Group = require("bui/form/group/base"),
            Check = Group.extend({
                bindUI: function() {
                    var _self = this;
                    _self.on("change", function(ev) {
                        var name = getFieldName(_self),
                            range = _self.get("range"),
                            record = _self.getRecord(),
                            value = record[name],
                            max = range[1];
                        value && value.length >= max ? _self._setFieldsEnable(name, !1) : _self._setFieldsEnable(name, !0)
                    })
                },
                _setFieldsEnable: function(name, enable) {
                    var _self = this,
                        fields = _self.getFields(name);
                    BUI.each(fields, function(field) {
                        enable ? field.enable() : field.get("checked") || field.disable()
                    })
                },
                _uiSetRange: function(v) {
                    this.addRule("checkRange", v)
                }
            }, {
                ATTRS: {
                    range: {
                        setter: function(v) {
                            return (BUI.isString(v) || BUI.isNumber(v)) && (v = [parseInt(v, 10)]), v
                        }
                    }
                }
            }, {
                xclass: "form-group-check"
            });
        return Check
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getItems(nodes) {
            var items = [];
            return BUI.each(nodes, function(node) {
                items.push({
                    text: node.text,
                    value: node.id
                })
            }), items
        }
        var Group = require("bui/form/group/base"),
            Data = require("bui/data"),
            Bindable = BUI.Component.UIBase.Bindable,
            Select = Group.extend([Bindable], {
                initializer: function() {
                    var _self = this,
                        url = _self.get("url"),
                        store = _self.get("store") || _self._getStore();
                    store.isStore || (store.autoLoad = !0, url && (store.url = url), store = new Data.TreeStore(store), _self.set("store", store))
                },
                bindUI: function() {
                    var _self = this;
                    _self.on("change", function(ev) {
                        var target = ev.target;
                        if (target != _self) {
                            var field = target,
                                value = field.get("value"),
                                level = _self._getFieldIndex(field) + 1;
                            _self._valueChange(value, level)
                        }
                    })
                },
                onLoad: function(e) {
                    var _self = this,
                        node = e ? e.node : _self.get("store").get("root");
                    _self._setFieldItems(node.level, node.children)
                },
                _getStore: function() {
                    var _self = this,
                        type = _self.get("type");
                    return type && TypeMap[type] ? TypeMap[type] : {}
                },
                _valueChange: function(value, level) {
                    var _self = this,
                        store = _self.get("store");
                    if (value) {
                        var node = store.findNode(value);
                        if (!node) return;
                        store.isLoaded(node) ? _self._setFieldItems(level, node.children) : store.loadNode(node)
                    } else _self._setFieldItems(level, [])
                },
                _setFieldItems: function(level, nodes) {
                    var _self = this,
                        field = _self.getFieldAt(level),
                        items = getItems(nodes);
                    field && (field.setItems(items), _self._valueChange(field.get("value"), level + 1))
                },
                _getFieldIndex: function(field) {
                    var _self = this,
                        fields = _self.getFields();
                    return BUI.Array.indexOf(field, fields)
                }
            }, {
                ATTRS: {
                    type: {},
                    store: {}
                }
            }, {
                xclass: "form-group-select"
            }),
            TypeMap = {};
        return Select.addType = function(name, cfg) {
            TypeMap[name] = cfg
        }, Select.addType("city", {
            proxy: {
                url: "http://lp.taobao.com/go/rgn/citydistrictdata.php",
                dataType: "jsonp"
            },
            map: {
                isleaf: "leaf",
                value: "text"
            }
        }), Select
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Group = require("bui/form/group/base");
        return BUI.mix(Group, {
            Range: require("bui/form/group/range"),
            Check: require("bui/form/group/check"),
            Select: require("bui/form/group/select")
        }), Group
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            TYPE_SUBMIT = {
                NORMAL: "normal",
                AJAX: "ajax",
                IFRAME: "iframe"
            },
            FieldContainer = require("bui/form/fieldcontainer"),
            FormView = (BUI.Component, FieldContainer.View.extend({
                _uiSetMethod: function(v) {
                    this.get("el").attr("method", v)
                },
                _uiSetAction: function(v) {
                    this.get("el").attr("action", v)
                }
            }, {
                ATTRS: {
                    method: {},
                    action: {}
                }
            }, {
                xclass: "form-view"
            })),
            Form = FieldContainer.extend({
                renderUI: function() {
                    var cfg, _self = this,
                        buttonBar = _self.get("buttonBar");
                    $.isPlainObject(buttonBar) && _self.get("buttons") && (cfg = BUI.merge(_self.getDefaultButtonBarCfg(), buttonBar), _self._initButtonBar(cfg)), _self._initSubmitMask()
                },
                _initButtonBar: function(cfg) {
                    var _self = this;
                    BUI.use("bui/toolbar", function(Toolbar) {
                        buttonBar = new Toolbar.Bar(cfg), _self.set("buttonBar", buttonBar)
                    })
                },
                bindUI: function() {
                    var _self = this,
                        formEl = _self.get("el");
                    formEl.on("submit", function(ev) {
                        return _self.valid(), _self.isValid() && _self.onBeforeSubmit() !== !1 ? void(_self.isValid() && _self.get("submitType") === TYPE_SUBMIT.AJAX && (ev.preventDefault(), _self.ajaxSubmit())) : (ev.preventDefault(), void _self.focusError())
                    })
                },
                getDefaultButtonBarCfg: function() {
                    var _self = this,
                        buttons = _self.get("buttons");
                    return {
                        autoRender: !0,
                        elCls: "toolbar",
                        render: _self.get("el"),
                        items: buttons,
                        defaultChildClass: "bar-item-button"
                    }
                },
                focusError: function() {
                    var _self = this,
                        fields = _self.getFields();
                    BUI.each(fields, function(field) {
                        if (field.get("visible") && !field.get("disabled") && !field.isValid()) {
                            try {
                                field.focus()
                            } catch (e) {
                                BUI.log(e)
                            }
                            return !1
                        }
                    })
                },
                submit: function(options) {
                    var _self = this,
                        submitType = _self.get("submitType");
                    if (_self.valid(), _self.isValid()) {
                        if (0 == _self.onBeforeSubmit()) return;
                        submitType === TYPE_SUBMIT.NORMAL ? _self.get("el")[0].submit() : submitType === TYPE_SUBMIT.AJAX && _self.ajaxSubmit(options)
                    } else _self.focusError()
                },
                ajaxSubmit: function(options) {
                    var success, _self = this,
                        method = _self.get("method"),
                        action = _self.get("action"),
                        callback = _self.get("callback"),
                        submitMask = _self.get("submitMask"),
                        data = _self.serializeToObject(),
                        ajaxParams = BUI.merge(!0, {
                            url: action,
                            type: method,
                            dataType: "json",
                            data: data
                        }, options);
                    options && options.success && (success = options.success), ajaxParams.success = function(data) {
                        submitMask && submitMask.hide && submitMask.hide(), success && success(data), callback && callback.call(_self, data)
                    }, submitMask && submitMask.show && submitMask.show(), $.ajax(ajaxParams)
                },
                _initSubmitMask: function() {
                    var _self = this,
                        submitType = _self.get("submitType"),
                        submitMask = _self.get("submitMask");
                    submitType === TYPE_SUBMIT.AJAX && submitMask && BUI.use("bui/mask", function(Mask) {
                        var cfg = $.isPlainObject(submitMask) ? submitMask : {};
                        submitMask = new Mask.LoadMask(BUI.mix({
                            el: _self.get("el")
                        }, cfg)), _self.set("submitMask", submitMask)
                    })
                },
                serializeToObject: function() {
                    return BUI.FormHelper.serializeToObject(this.get("el")[0])
                },
                toObject: function() {
                    return this.serializeToObject()
                },
                onBeforeSubmit: function() {
                    return this.fire("beforesubmit")
                },
                reset: function() {
                    var _self = this,
                        initRecord = _self.get("initRecord");
                    _self.setRecord(initRecord)
                },
                resetTips: function() {
                    var _self = this,
                        fields = _self.getFields();
                    BUI.each(fields, function(field) {
                        field.resetTip()
                    })
                },
                destructor: function() {
                    var _self = this,
                        buttonBar = _self.get("buttonBar"),
                        submitMask = _self.get("submitMask");
                    buttonBar && buttonBar.destroy && buttonBar.destroy(), submitMask && submitMask.destroy && submitMask.destroy()
                },
                _uiSetInitRecord: function(v) {
                    this.setRecord(v)
                }
            }, {
                ATTRS: {
                    action: {
                        view: !0,
                        value: ""
                    },
                    allowTextSelection: {
                        value: !0
                    },
                    events: {
                        value: {
                            beforesubmit: !1
                        }
                    },
                    method: {
                        view: !0,
                        value: "get"
                    },
                    defaultLoaderCfg: {
                        value: {
                            autoLoad: !0,
                            property: "record",
                            dataType: "json"
                        }
                    },
                    submitMask: {
                        value: {
                            msg: "正在提交。。。"
                        }
                    },
                    submitType: {
                        value: "normal"
                    },
                    focusError: {
                        value: !0
                    },
                    callback: {},
                    decorateCfgFields: {
                        value: {
                            method: !0,
                            action: !0
                        }
                    },
                    defaultChildClass: {
                        value: "form-field"
                    },
                    elTagName: {
                        value: "form"
                    },
                    buttons: {},
                    buttonBar: {
                        shared: !1,
                        value: {}
                    },
                    childContainer: {
                        value: ".x-form-fields"
                    },
                    initRecord: {},
                    showError: {
                        value: !1
                    },
                    xview: {
                        value: FormView
                    },
                    tpl: {
                        value: '<div class="x-form-fields"></div>'
                    }
                }
            }, {
                xclass: "form"
            });
        return Form.View = FormView, Form
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Form = (require("bui/common"), require("bui/form/form")),
            Horizontal = Form.extend({
                getDefaultButtonBarCfg: function() {
                    var _self = this,
                        buttons = _self.get("buttons");
                    return {
                        autoRender: !0,
                        elCls: "actions-bar toolbar row",
                        tpl: '<div class="form-actions span21 offset3"></div>',
                        childContainer: ".form-actions",
                        render: _self.get("el"),
                        items: buttons,
                        defaultChildClass: "bar-item-button"
                    }
                }
            }, {
                ATTRS: {
                    defaultChildClass: {
                        value: "form-row"
                    },
                    errorTpl: {
                        value: '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>'
                    },
                    elCls: {
                        value: "form-horizontal"
                    }
                },
                PARSER: {}
            }, {
                xclass: "form-horizontal"
            });
        return Horizontal
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var FieldContainer = (require("bui/common"), require("bui/form/fieldcontainer")),
            Row = FieldContainer.extend({}, {
                ATTRS: {
                    elCls: {
                        value: "row"
                    },
                    defaultChildCfg: {
                        value: {
                            tpl: ' <label class="control-label">{label}</label>                <div class="controls">                </div>',
                            childContainer: ".controls",
                            showOneError: !0,
                            controlContainer: ".controls",
                            elCls: "control-group span8",
                            errorTpl: '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>'
                        }
                    },
                    defaultChildClass: {
                        value: "form-field-text"
                    }
                }
            }, {
                xclass: "form-row"
            });
        return Row
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function valid(self, value, baseValue, msg, control) {
            BUI.isArray(baseValue) && BUI.isString(baseValue[1]) && (baseValue[1] && (msg = baseValue[1]), baseValue = baseValue[0]);
            var _self = self,
                validator = _self.get("validator"),
                formatedMsg = formatError(self, baseValue, msg);
            return value = null == value ? "" : value, validator.call(_self, value, baseValue, formatedMsg, control)
        }

        function parseParams(values) {
            if (null == values) return {};
            if ($.isPlainObject(values)) return values;
            var ars = values,
                rst = {};
            if (BUI.isArray(values)) {
                for (var i = 0; i < ars.length; i++) rst[i] = ars[i];
                return rst
            }
            return {
                0: values
            }
        }

        function formatError(self, values, msg) {
            var ars = parseParams(values);
            return msg = msg || self.get("msg"), BUI.substitute(msg, ars)
        }
        var BUI = require("bui/common"),
            Rule = function(config) {
                Rule.superclass.constructor.call(this, config)
            };
        return BUI.extend(Rule, BUI.Base), Rule.ATTRS = {
            name: {},
            msg: {},
            validator: {
                value: function(value, baseValue, formatedMsg, control) {}
            }
        }, BUI.augment(Rule, {
            valid: function(value, baseValue, msg, control) {
                var _self = this;
                return valid(_self, value, baseValue, msg, control)
            }
        }), Rule
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function toNumber(value) {
            return parseFloat(value)
        }

        function toDate(value) {
            return BUI.Date.parse(value)
        }

        function testRange(baseValue, curVal, prevVal) {
            var allowEqual = baseValue && baseValue.equals !== !1;
            return allowEqual ? prevVal <= curVal : prevVal < curVal
        }

        function isEmpty(value) {
            return "" == value || null == value
        }

        function rangeValid(value, baseValue, formatedMsg, group) {
            for (var fields = group.getFields(), valid = !0, i = 1; i < fields.length; i++) {
                var curVal, prevVal, cur = fields[i],
                    prev = fields[i - 1];
                if (cur && prev && (curVal = cur.get("value"), prevVal = prev.get("value"), !isEmpty(curVal) && !isEmpty(prevVal) && !testRange(baseValue, curVal, prevVal))) {
                    valid = !1;
                    break
                }
            }
            return valid ? null : formatedMsg
        }

        function getFieldName(self) {
            var firstField = self.getFieldAt(0);
            return firstField ? firstField.get("name") : ""
        }

        function testCheckRange(value, range) {
            if (BUI.isArray(range) || (range = [range]), !value || !range.length) return !1;
            var len = value ? BUI.isArray(value) ? value.length : 1 : 0;
            if (1 == range.length) {
                var number = range[0];
                if (!number) return !0;
                if (number > len) return !1
            } else {
                var min = range[0],
                    max = range[1];
                if (min > len || max < len) return !1
            }
            return !0
        }
        var Rule = require("bui/form/rule"),
            ruleMap = {},
            rules = {
                add: function(rule) {
                    var name;
                    return $.isPlainObject(rule) ? (name = rule.name, ruleMap[name] = new Rule(rule)) : rule.get && (name = rule.get("name"), ruleMap[name] = rule), ruleMap[name]
                },
                remove: function(name) {
                    delete ruleMap[name]
                },
                get: function(name) {
                    return ruleMap[name]
                },
                valid: function(name, value, baseValue, msg, control) {
                    var rule = rules.get(name);
                    return rule ? rule.valid(value, baseValue, msg, control) : null
                },
                isValid: function(name, value, baseValue, control) {
                    return null == rules.valid(name, value, baseValue, control)
                }
            };
        rules.add({
            name: "required",
            msg: "不能为空！",
            validator: function(value, required, formatedMsg) {
                if (required !== !1 && /^\s*$/.test(value)) return formatedMsg
            }
        }), rules.add({
            name: "equalTo",
            msg: "两次输入不一致！",
            validator: function(value, equalTo, formatedMsg) {
                var el = $(equalTo);
                return el.length && (equalTo = el.val()), value === equalTo ? void 0 : formatedMsg
            }
        }), rules.add({
            name: "min",
            msg: "输入值不能小于{0}！",
            validator: function(value, min, formatedMsg) {
                if ("" !== value && toNumber(value) < toNumber(min)) return formatedMsg
            }
        }), rules.add({
            name: "max",
            msg: "输入值不能大于{0}！",
            validator: function(value, max, formatedMsg) {
                if ("" !== value && toNumber(value) > toNumber(max)) return formatedMsg
            }
        }), rules.add({
            name: "length",
            msg: "输入值长度为{0}！",
            validator: function(value, len, formatedMsg) {
                if (null != value && (value = $.trim(value.toString()), len != value.length)) return formatedMsg
            }
        }), rules.add({
            name: "minlength",
            msg: "输入值长度不小于{0}！",
            validator: function(value, min, formatedMsg) {
                if (null != value) {
                    value = $.trim(value.toString());
                    var len = value.length;
                    if (len < min) return formatedMsg
                }
            }
        }), rules.add({
            name: "maxlength",
            msg: "输入值长度不大于{0}！",
            validator: function(value, max, formatedMsg) {
                if (value) {
                    value = $.trim(value.toString());
                    var len = value.length;
                    if (len > max) return formatedMsg
                }
            }
        }), rules.add({
            name: "regexp",
            msg: "输入值不符合{0}！",
            validator: function(value, regexp, formatedMsg) {
                if (regexp) return regexp.test(value) ? void 0 : formatedMsg
            }
        }), rules.add({
            name: "email",
            msg: "不是有效的邮箱地址！",
            validator: function(value, baseValue, formatedMsg) {
                if (value = $.trim(value)) return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) ? void 0 : formatedMsg
            }
        }), rules.add({
            name: "date",
            msg: "不是有效的日期！",
            validator: function(value, baseValue, formatedMsg) {
                if (!BUI.isNumber(value) && !BUI.isDate(value)) return value = $.trim(value), value ? BUI.Date.isDateString(value) ? void 0 : formatedMsg : void 0
            }
        }), rules.add({
            name: "minDate",
            msg: "输入日期不能小于{0}！",
            validator: function(value, minDate, formatedMsg) {
                if (value) {
                    var date = toDate(value);
                    if (date && date < toDate(minDate)) return formatedMsg
                }
            }
        }), rules.add({
            name: "maxDate",
            msg: "输入日期不能大于{0}！",
            validator: function(value, maxDate, formatedMsg) {
                if (value) {
                    var date = toDate(value);
                    if (date && date > toDate(maxDate)) return formatedMsg
                }
            }
        }), rules.add({
            name: "mobile",
            msg: "不是有效的手机号码！",
            validator: function(value, baseValue, formatedMsg) {
                if (value = $.trim(value)) return /^\d{11}$/.test(value) ? void 0 : formatedMsg
            }
        }), rules.add({
            name: "number",
            msg: "不是有效的数字！",
            validator: function(value, baseValue, formatedMsg) {
                if (!BUI.isNumber(value)) return value = value.replace(/\,/g, ""), isNaN(value) ? formatedMsg : void 0
            }
        }), rules.add({
            name: "dateRange",
            msg: "结束日期不能小于起始日期！",
            validator: rangeValid
        }), rules.add({
            name: "numberRange",
            msg: "结束数字不能小于开始数字！",
            validator: rangeValid
        }), rules.add({
            name: "checkRange",
            msg: "必须选中{0}项！",
            validator: function(record, baseValue, formatedMsg, group) {
                var value, name = getFieldName(group),
                    range = baseValue;
                return name && range && (value = record[name], !testCheckRange(value, range)) ? formatedMsg : null
            }
        });
        return rules
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            RemoteView = function() {};
        RemoteView.ATTRS = {
            isLoading: {},
            loadingEl: {}
        }, RemoteView.prototype = {
            getLoadingContainer: function() {},
            _setLoading: function() {
                var _self = this,
                    loadingEl = _self.get("loadingEl"),
                    loadingTpl = _self.get("loadingTpl");
                loadingEl || (loadingEl = $(loadingTpl).appendTo(_self.getLoadingContainer()), _self.setInternal("loadingEl", loadingEl))
            },
            _clearLoading: function() {
                var _self = this,
                    loadingEl = _self.get("loadingEl");
                loadingEl && (loadingEl.remove(), _self.setInternal("loadingEl", null))
            },
            _uiSetIsLoading: function(v) {
                var _self = this;
                v ? _self._setLoading() : _self._clearLoading()
            }
        };
        var Remote = function() {};
        return Remote.ATTRS = {
            defaultRemote: {
                value: {
                    method: "GET",
                    cache: !0,
                    callback: function(data) {
                        return data
                    }
                }
            },
            remoteDaly: {
                value: 500
            },
            cacheMap: {
                value: {}
            },
            loadingTpl: {
                view: !0,
                value: '<img src="http://img02.taobaocdn.com/tps/i2/T1NU8nXCVcXXaHNz_X-16-16.gif" alt="loading"/>'
            },
            isLoading: {
                view: !0,
                value: !1
            },
            remote: {
                setter: function(v) {
                    return BUI.isString(v) && (v = {
                        url: v
                    }), v
                }
            },
            remoteHandler: {},
            events: {
                value: {
                    remotecomplete: !1,
                    remotestart: !1
                }
            }
        }, Remote.prototype = {
            __bindUI: function() {
                var _self = this;
                _self.on("valid", function(ev) {
                    if (_self.get("remote") && _self.isValid()) {
                        var value = _self.getControlValue(),
                            data = _self.getRemoteParams();
                        _self._startRemote(data, value)
                    }
                }), _self.on("error", function(ev) {
                    _self.get("remote") && _self._cancelRemote()
                })
            },
            _startRemote: function(data, value) {
                function dalayFunc() {
                    _self._remoteValid(data, remoteHandler, value), _self.set("isLoading", !0)
                }
                var _self = this,
                    remoteHandler = _self.get("remoteHandler"),
                    cacheMap = _self.get("cacheMap"),
                    remoteDaly = _self.get("remoteDaly");
                return remoteHandler && _self._cancelRemote(remoteHandler), null != cacheMap[value] ? void _self._validResult(_self._getCallback(), cacheMap[value]) : (remoteHandler = setTimeout(dalayFunc, remoteDaly), void _self.setInternal("remoteHandler", remoteHandler))
            },
            _validResult: function(callback, data) {
                var _self = this,
                    error = callback(data);
                _self.onRemoteComplete(error, data)
            },
            onRemoteComplete: function(error, data, remoteHandler) {
                var _self = this;
                remoteHandler == _self.get("remoteHandler") && (_self.fire("remotecomplete", {
                    error: error,
                    data: data
                }), _self.set("isLoading", !1), _self.setInternal("remoteHandler", null))
            },
            _getOptions: function(data) {
                var _self = this,
                    remote = _self.get("remote"),
                    defaultRemote = _self.get("defaultRemote"),
                    options = BUI.merge(defaultRemote, remote, {
                        data: data
                    });
                return options
            },
            _getCallback: function() {
                return this._getOptions().callback
            },
            _remoteValid: function(data, remoteHandler, value) {
                var _self = this,
                    cacheMap = _self.get("cacheMap"),
                    options = _self._getOptions(data);
                options.success = function(data) {
                    var callback = options.callback,
                        error = callback(data);
                    cacheMap[value] = data, _self.onRemoteComplete(error, data, remoteHandler)
                }, options.error = function(jqXHR, textStatus, errorThrown) {
                    _self.onRemoteComplete(errorThrown, null, remoteHandler)
                }, _self.fire("remotestart", {
                    data: data
                }), $.ajax(options)
            },
            getRemoteParams: function() {},
            clearCache: function() {
                this.set("cacheMap", {})
            },
            _cancelRemote: function(remoteHandler) {
                var _self = this;
                remoteHandler = remoteHandler || _self.get("remoteHandler"), remoteHandler && (clearTimeout(remoteHandler), _self.setInternal("remoteHandler", null)), _self.set("isLoading", !1)
            }
        }, Remote.View = RemoteView, Remote
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Select = BUI.namespace("Select");
        return BUI.mix(Select, {
            Select: require("bui/select/select"),
            Combox: require("bui/select/combox"),
            Suggest: require("bui/select/suggest")
        }), Select
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";

        function formatItems(items) {
            if ($.isPlainObject(items)) {
                var tmp = [];
                return BUI.each(items, function(v, n) {
                    tmp.push({
                        value: n,
                        text: v
                    })
                }), tmp
            }
            var rst = [];
            return BUI.each(items, function(item, index) {
                BUI.isString(item) ? rst.push({
                    value: item,
                    text: item
                }) : rst.push(item)
            }), rst
        }
        var BUI = require("bui/common"),
            ListPicker = require("bui/picker").ListPicker,
            PREFIX = BUI.prefix,
            Component = BUI.Component,
            Picker = ListPicker,
            CLS_INPUT = PREFIX + "select-input",
            select = Component.Controller.extend({
                initializer: function() {
                    var xclass, _self = this,
                        multipleSelect = _self.get("multipleSelect"),
                        picker = _self.get("picker");
                    picker ? _self.get("valueField") && picker.set("valueField", _self.get("valueField")) : (xclass = multipleSelect ? "listbox" : "simple-list", picker = new Picker({
                        children: [{
                            xclass: xclass,
                            elCls: PREFIX + "select-list",
                            store: _self.get("store"),
                            items: formatItems(_self.get("items"))
                        }],
                        valueField: _self.get("valueField")
                    }), _self.set("picker", picker)), multipleSelect && picker.set("hideEvent", "")
                },
                renderUI: function() {
                    var _self = this,
                        picker = _self.get("picker"),
                        el = _self.get("el"),
                        textEl = el.find("." + _self.get("inputCls"));
                    picker.set("trigger", el), picker.set("triggerEvent", _self.get("triggerEvent")), picker.set("autoSetValue", _self.get("autoSetValue")), picker.set("textField", textEl), picker.render(), _self.set("list", picker.get("list"))
                },
                bindUI: function() {
                    var _self = this,
                        picker = _self.get("picker"),
                        list = picker.get("list");
                    list.get("store");
                    picker.on("selectedchange", function(ev) {
                        _self.fire("change", {
                            text: ev.text,
                            value: ev.value,
                            item: ev.item
                        })
                    }), list.on("itemsshow", function() {
                        _self._syncValue()
                    }), picker.on("show", function() {
                        _self.get("forceFit") && picker.set("width", _self.get("el").outerWidth())
                    })
                },
                containsElement: function(elem) {
                    var _self = this,
                        picker = _self.get("picker");
                    return Component.Controller.prototype.containsElement.call(this, elem) || picker.containsElement(elem)
                },
                _uiSetItems: function(items) {
                    if (items) {
                        var _self = this,
                            picker = _self.get("picker"),
                            list = picker.get("list");
                        list.set("items", formatItems(items)), _self._syncValue()
                    }
                },
                _syncValue: function() {
                    var _self = this,
                        picker = _self.get("picker"),
                        valueField = _self.get("valueField");
                    valueField && picker.setSelectedValue($(valueField).val())
                },
                _uiSetName: function(v) {
                    var _self = this,
                        textEl = _self._getTextEl();
                    v && textEl.attr("name", v)
                },
                _uiSetWidth: function(v) {
                    var _self = this;
                    if (null != v) {
                        var textEl = _self._getTextEl(),
                            iconEl = _self.get("el").find(".x-icon"),
                            appendWidth = textEl.outerWidth() - textEl.width(),
                            picker = _self.get("picker"),
                            width = v - iconEl.outerWidth() - appendWidth;
                        textEl.width(width), _self.get("forceFit") && picker.set("width", v)
                    }
                },
                _getTextEl: function() {
                    var _self = this,
                        el = _self.get("el");
                    return el.find("." + _self.get("inputCls"))
                },
                destructor: function() {
                    var _self = this,
                        picker = _self.get("picker");
                    picker && picker.destroy()
                },
                _getList: function() {
                    var _self = this,
                        picker = _self.get("picker"),
                        list = picker.get("list");
                    return list
                },
                getSelectedValue: function() {
                    return this.get("picker").getSelectedValue()
                },
                setSelectedValue: function(value) {
                    var _self = this,
                        picker = _self.get("picker");
                    picker.setSelectedValue(value)
                },
                getSelectedText: function() {
                    return this.get("picker").getSelectedText()
                }
            }, {
                ATTRS: {
                    picker: {},
                    list: {},
                    valueField: {},
                    store: {},
                    focusable: {
                        value: !0
                    },
                    multipleSelect: {
                        value: !1
                    },
                    name: {},
                    items: {
                        sync: !1
                    },
                    inputCls: {
                        value: CLS_INPUT
                    },
                    forceFit: {
                        value: !0
                    },
                    events: {
                        value: {
                            change: !1
                        }
                    },
                    tpl: {
                        view: !0,
                        value: '<input type="text" readonly="readonly" class="' + CLS_INPUT + '"/><span class="x-icon x-icon-normal"><i class="icon icon-caret icon-caret-down"></i></span>'
                    },
                    triggerEvent: {
                        value: "click"
                    }
                }
            }, {
                xclass: "select"
            });
        return select
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Select = require("bui/select/select"),
            CLS_INPUT = BUI.prefix + "combox-input",
            combox = Select.extend({
                renderUI: function() {
                    var _self = this,
                        picker = _self.get("picker");
                    picker.set("autoFocused", !1)
                },
                _uiSetItems: function(v) {
                    for (var _self = this, i = 0; i < v.length; i++) {
                        var item = v[i];
                        BUI.isString(item) && (v[i] = {
                            value: item,
                            text: item
                        })
                    }
                    combox.superclass._uiSetItems.call(_self, v)
                },
                bindUI: function() {
                    var _self = this,
                        picker = _self.get("picker"),
                        list = picker.get("list"),
                        textField = picker.get("textField");
                    $(textField).on("keyup", function(ev) {
                        var item = list.getSelected();
                        item && list.clearItemStatus(item)
                    })
                }
            }, {
                ATTRS: {
                    tpl: {
                        view: !0,
                        value: '<input type="text" class="' + CLS_INPUT + '"/>'
                    },
                    inputCls: {
                        value: CLS_INPUT
                    }
                }
            }, {
                xclass: "combox"
            });
        return combox
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        "use strict";
        var BUI = require("bui/common"),
            Combox = require("bui/select/combox"),
            TIMER_DELAY = 200,
            EMPTY = "",
            suggest = Combox.extend({
                bindUI: function() {
                    var _self = this,
                        textEl = _self.get("el").find("input"),
                        triggerEvent = "keyup" === _self.get("triggerEvent") ? "keyup" : "keyup click";
                    textEl.on(triggerEvent, function() {
                        _self._start()
                    })
                },
                _start: function() {
                    var _self = this;
                    _self._timer = _self.later(function() {
                        _self._updateContent()
                    }, TIMER_DELAY)
                },
                _updateContent: function() {
                    var text, _self = this,
                        isStatic = _self.get("data"),
                        textEl = _self.get("el").find("input");
                    if ((isStatic || textEl.val() !== _self.get("query")) && (_self.set("query", textEl.val()), text = textEl.val(), isStatic || text)) {
                        var cacheable = _self.get("cacheable"),
                            url = _self.get("url"),
                            data = _self.get("data");
                        if (cacheable && url) {
                            var dataCache = _self.get("dataCache");
                            void 0 !== dataCache[text] ? _self._handleResponse(dataCache[text]) : _self._requestData()
                        } else url ? _self._requestData() : data && _self._handleResponse(data, !0)
                    }
                },
                _getStore: function() {
                    var _self = this,
                        picker = _self.get("picker"),
                        list = picker.get("list");
                    if (list) return list.get("store")
                },
                _requestData: function() {
                    var _self = this,
                        textEl = _self.get("el").find("input"),
                        callback = _self.get("callback"),
                        store = _self.get("store"),
                        param = {};
                    param[textEl.attr("name")] = textEl.val(), store ? (param.start = 0, store.load(param, callback)) : $.ajax({
                        url: _self.get("url"),
                        type: "post",
                        dataType: _self.get("dataType"),
                        data: param,
                        success: function(data) {
                            _self._handleResponse(data), callback && callback(data)
                        }
                    })
                },
                _handleResponse: function(data, filter) {
                    var _self = this,
                        items = filter ? _self._getFilterItems(data) : data;
                    _self.set("items", items), _self.get("cacheable") && (_self.get("dataCache")[_self.get("query")] = items)
                },
                _getItemText: function(item) {
                    var _self = this,
                        picker = _self.get("picker"),
                        list = picker.get("list");
                    return list ? list.getItemText(item) : ""
                },
                _getFilterItems: function(data) {
                    function push(str, item) {
                        BUI.isString(item) ? result.push(str) : result.push(item)
                    }
                    var _self = this,
                        result = [],
                        textEl = _self.get("el").find("input"),
                        text = textEl.val(),
                        isStatic = _self.get("data");
                    return data = data || [], BUI.each(data, function(item) {
                        var str = BUI.isString(item) ? item : _self._getItemText(item);
                        isStatic ? str.indexOf($.trim(text)) !== -1 && push(str, item) : push(str, item)
                    }), result
                },
                later: function(fn, when, periodic) {
                    when = when || 0;
                    var r = periodic ? setInterval(fn, when) : setTimeout(fn, when);
                    return {
                        id: r,
                        interval: periodic,
                        cancel: function() {
                            this.interval ? clearInterval(r) : clearTimeout(r)
                        }
                    }
                }
            }, {
                ATTRS: {
                    data: {
                        value: null
                    },
                    query: {
                        value: EMPTY
                    },
                    cacheable: {
                        value: !1
                    },
                    dataCache: {
                        shared: !1,
                        value: {}
                    },
                    dataType: {
                        value: "jsonp"
                    },
                    url: {},
                    callback: {},
                    triggerEvent: {
                        valueFn: function() {
                            return this.get("data") ? "click" : "keyup"
                        }
                    },
                    autoSetValue: {
                        value: !1
                    }
                }
            }, {
                xclass: "suggest"
            });
        return suggest
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Mask = (require("bui/common"), require("bui/mask/mask"));
        return Mask.LoadMask = require("bui/mask/loadmask"), Mask
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Mask = BUI.namespace("Mask"),
            UA = BUI.UA,
            CLS_MASK = BUI.prefix + "ext-mask",
            CLS_MASK_MSG = CLS_MASK + "-msg";
        return BUI.mix(Mask, {
            maskElement: function(element, msg, msgCls) {
                var maskedEl = $(element),
                    maskDiv = $("." + CLS_MASK, maskedEl),
                    tpl = null,
                    msgDiv = null,
                    top = null,
                    left = null;
                if (!maskDiv.length && (maskDiv = $('<div class="' + CLS_MASK + '"></div>').appendTo(maskedEl), maskedEl.addClass("x-masked-relative x-masked"), 6 === UA.ie && maskDiv.height(maskedEl.height()), msg)) {
                    tpl = ['<div class="' + CLS_MASK_MSG + '"><div>', msg, "</div></div>"].join(""), msgDiv = $(tpl).appendTo(maskedEl), msgCls && msgDiv.addClass(msgCls);
                    try {
                        top = (maskedEl.height() - msgDiv.height()) / 2, left = (maskedEl.width() - msgDiv.width()) / 2, msgDiv.css({
                            left: left,
                            top: top
                        })
                    } catch (ex) {
                        BUI.log("mask error occurred")
                    }
                }
                return maskDiv
            },
            unmaskElement: function(element) {
                var maskedEl = $(element),
                    msgEl = maskedEl.children("." + CLS_MASK_MSG),
                    maskDiv = maskedEl.children("." + CLS_MASK);
                msgEl && msgEl.remove(), maskDiv && maskDiv.remove(), maskedEl.removeClass("x-masked-relative x-masked")
            }
        }), Mask
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function LoadMask(config) {
            var _self = this;
            LoadMask.superclass.constructor.call(_self, config)
        }
        var Mask = require("bui/mask/mask");
        return BUI.extend(LoadMask, BUI.Base), LoadMask.ATTRS = {
            el: {},
            msg: {
                value: "Loading..."
            },
            msgCls: {
                value: "x-mask-loading"
            },
            disabled: {
                value: !1
            }
        }, BUI.augment(LoadMask, {
            disable: function() {
                this.set("disabled", !0)
            },
            onLoad: function() {
                Mask.unmaskElement(this.get("el"))
            },
            onBeforeLoad: function() {
                var _self = this;
                _self.get("disabled") || Mask.maskElement(_self.get("el"), _self.get("msg"), this.get("msgCls"))
            },
            show: function() {
                this.onBeforeLoad()
            },
            hide: function() {
                this.onLoad()
            },
            destroy: function() {
                this.hide(), this.clearAttrVals(), this.off()
            }
        }), LoadMask
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Menu = BUI.namespace("Menu");
        return BUI.mix(Menu, {
            Menu: require("bui/menu/menu"),
            MenuItem: require("bui/menu/menuitem"),
            ContextMenu: require("bui/memu/contextmenu"),
            PopMenu: require("bui/menu/popmenu"),
            SideMenu: require("bui/menu/sidemenu")
        }), Menu.ContextMenuItem = Menu.ContextMenu.Item, Menu
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            UIBase = Component.UIBase,
            CLS_CARET = (BUI.prefix, "x-caret"),
            DATA_ID = "data-id",
            menuItemView = Component.View.extend([UIBase.ListItemView, UIBase.CollapsableView], {
                _uiSetOpen: function(v) {
                    var _self = this,
                        cls = _self.getStatusCls("open");
                    v ? _self.get("el").addClass(cls) : _self.get("el").removeClass(cls)
                }
            }, {
                ATTRS: {}
            }, {
                xclass: "menu-item-view"
            }),
            menuItem = Component.Controller.extend([UIBase.ListItem, UIBase.Collapsable], {
                renderUI: function() {
                    var _self = this,
                        el = _self.get("el"),
                        id = _self.get("id");
                    id || (id = BUI.guid("menu-item"), _self.set("id", id)), el.attr(DATA_ID, id)
                },
                handleMouseEnter: function(ev) {
                    this.get("subMenu") && this.set("open", !0), menuItem.superclass.handleMouseEnter.call(this, ev)
                },
                handleMouseLeave: function(ev) {
                    var _self = this,
                        subMenu = _self.get("subMenu"),
                        toElement = ev.toElement || ev.relatedTarget;
                    toElement && subMenu && subMenu.containsElement(toElement) ? _self.set("open", !0) : _self.set("open", !1), menuItem.superclass.handleMouseLeave.call(this, ev)
                },
                containsElement: function(elem) {
                    var subMenu, _self = this,
                        contains = menuItem.superclass.containsElement.call(_self, elem);
                    return contains || (subMenu = _self.get("subMenu"), contains = subMenu && subMenu.containsElement(elem)), contains
                },
                _uiSetOpen: function(v) {
                    var _self = this,
                        subMenu = _self.get("subMenu"),
                        subMenuAlign = _self.get("subMenuAlign");
                    if (subMenu)
                        if (v) subMenuAlign.node = _self.get("el"), subMenu.set("align", subMenuAlign), subMenu.show();
                        else {
                            var menuAlign = subMenu.get("align");
                            menuAlign && menuAlign.node != _self.get("el") || subMenu.hide()
                        }
                },
                _uiSetSubMenu: function(subMenu) {
                    if (subMenu) {
                        var _self = this,
                            el = _self.get("el"),
                            parent = _self.get("parent");
                        subMenu.get("parentMenu") || (subMenu.set("parentMenu", parent), parent.get("autoHide") && subMenu.set("autoHide", !1)), $(_self.get("arrowTpl")).appendTo(el)
                    }
                },
                destructor: function() {
                    var _self = this,
                        subMenu = _self.get("subMenu");
                    subMenu && subMenu.destroy()
                }
            }, {
                ATTRS: {
                    elTagName: {
                        value: "li"
                    },
                    xview: {
                        value: menuItemView
                    },
                    open: {
                        view: !0,
                        value: !1
                    },
                    subMenu: {
                        view: !0
                    },
                    subMenuAlign: {
                        valueFn: function(argument) {
                            return {
                                points: ["tr", "tl"],
                                offset: [-5, 0]
                            }
                        }
                    },
                    arrowTpl: {
                        value: '<span class="' + CLS_CARET + " " + CLS_CARET + '-left"></span>'
                    },
                    events: {
                        value: {
                            afterOpenChange: !0
                        }
                    }
                },
                PARSER: {
                    subMenu: function(el) {
                        var sub, subList = el.find("ul");
                        return subList && subList.length && (sub = BUI.Component.create({
                            srcNode: subList,
                            xclass: "pop-menu"
                        }), subList.appendTo("body")), sub
                    }
                }
            }, {
                xclass: "menu-item",
                priority: 0
            }),
            separator = menuItem.extend({}, {
                ATTRS: {
                    focusable: {
                        value: !1
                    },
                    selectable: {
                        value: !1
                    },
                    handleMouseEvents: {
                        value: !1
                    }
                }
            }, {
                xclass: "menu-item-sparator"
            });
        return menuItem.View = menuItemView, menuItem.Separator = separator, menuItem
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            UIBase = Component.UIBase,
            Menu = Component.Controller.extend([UIBase.ChildList], {
                bindUI: function() {
                    var _self = this;
                    _self.on("click", function(e) {
                        var item = e.target,
                            multipleSelect = _self.get("multipleSelect");
                        _self != item && (multipleSelect || !_self.get("clickHide") || item.get("subMenu") || _self.getTopAutoHideMenu().hide())
                    }), _self.on("afterOpenChange", function(ev) {
                        var target = ev.target,
                            opened = ev.newVal,
                            children = _self.get("children");
                        opened && BUI.each(children, function(item) {
                            item !== target && item.get("open") && item.set("open", !1)
                        })
                    }), _self.on("afterVisibleChange", function(ev) {
                        ev.newVal, _self.get("parentMenu");
                        _self._clearOpen()
                    })
                },
                getTopAutoHideMenu: function() {
                    var _self = this,
                        parentMenu = _self.get("parentMenu");
                    return parentMenu && parentMenu.get("autoHide") ? parentMenu.getTopAutoHideMenu() : _self.get("autoHide") ? _self : null
                },
                _clearOpen: function() {
                    var _self = this,
                        children = _self.get("children");
                    BUI.each(children, function(item) {
                        item.set && item.set("open", !1)
                    })
                },
                findItemById: function(id) {
                    return this.findItemByField("id", id)
                },
                _uiSetSelectedItem: function(item) {
                    item && _self.setSelected(item)
                }
            }, {
                ATTRS: {
                    elTagName: {
                        view: !0,
                        value: "ul"
                    },
                    idField: {
                        value: "id"
                    },
                    isDecorateChild: {
                        value: !0
                    },
                    defaultChildClass: {
                        value: "menu-item"
                    },
                    selectedItem: {},
                    parentMenu: {}
                }
            }, {
                xclass: "menu",
                priority: 0
            });
        return Menu
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            UIBase = BUI.Component.UIBase,
            Menu = require("bui/menu/menu"),
            popMenuView = BUI.Component.View.extend([UIBase.PositionView], {}),
            popMenu = Menu.extend([UIBase.Position, UIBase.Align, UIBase.AutoShow, , UIBase.AutoHide], {}, {
                ATTRS: {
                    clickHide: {
                        value: !0
                    },
                    align: {
                        value: {
                            points: ["bl", "tl"],
                            offset: [0, 0]
                        }
                    },
                    visibleMode: {
                        value: "visibility"
                    },
                    autoHide: {
                        value: !0
                    },
                    visible: {
                        value: !1
                    },
                    xview: {
                        value: popMenuView
                    }
                }
            }, {
                xclass: "pop-menu"
            });
        return popMenu
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            MenuItem = require("bui/menu/menuitem"),
            PopMenu = require("bui/menu/popmenu"),
            PREFIX = BUI.prefix,
            CLS_Link = PREFIX + "menu-item-link",
            CLS_ITEM_ICON = PREFIX + "menu-item-icon",
            Component = BUI.Component,
            contextMenuItem = (Component.UIBase, MenuItem.extend({
                bindUI: function() {
                    var _self = this;
                    _self.get("el").delegate("." + CLS_Link, "click", function(ev) {
                        ev.preventDefault()
                    })
                },
                _uiSetIconCls: function(v, ev) {
                    var _self = this,
                        preCls = ev.prevVal,
                        iconEl = _self.get("el").find("." + CLS_ITEM_ICON);
                    iconEl.removeClass(preCls), iconEl.addClass(v)
                }
            }, {
                ATTRS: {
                    text: {
                        veiw: !0,
                        value: ""
                    },
                    iconCls: {
                        sync: !1,
                        value: ""
                    },
                    tpl: {
                        value: '<a class="' + CLS_Link + '" href="#">        <span class="' + CLS_ITEM_ICON + ' {iconCls}"></span><span class="' + PREFIX + 'menu-item-text">{text}</span></a>'
                    }
                }
            }, {
                xclass: "context-menu-item"
            })),
            contextMenu = PopMenu.extend({}, {
                ATTRS: {
                    defaultChildClass: {
                        value: "context-menu-item"
                    },
                    align: {
                        value: null
                    }
                }
            }, {
                xclass: "context-menu"
            });
        return contextMenu.Item = contextMenuItem, contextMenu
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Menu = require("bui/menu/menu"),
            CLS_MENU_TITLE = (BUI.Component, BUI.prefix + "menu-title"),
            CLS_MENU_LEAF = "menu-leaf",
            sideMenu = Menu.extend({
                initializer: function() {
                    var _self = this,
                        items = _self.get("items"),
                        children = _self.get("children");
                    BUI.each(items, function(item) {
                        var menuCfg = _self._initMenuCfg(item);
                        children.push(menuCfg)
                    })
                },
                bindUI: function() {
                    var _self = this,
                        children = _self.get("children");
                    BUI.each(children, function(item) {
                        var menu = item.get("children")[0];
                        menu && menu.publish("click", {
                            bubbles: 1
                        })
                    }), _self.get("el").delegate("a", "click", function(ev) {
                        ev.preventDefault()
                    }), _self.on("itemclick", function(ev) {
                        var item = ev.item,
                            titleEl = $(ev.domTarget).closest("." + CLS_MENU_TITLE);
                        if (titleEl.length) {
                            var collapsed = item.get("collapsed");
                            item.set("collapsed", !collapsed)
                        } else item.get("el").hasClass(CLS_MENU_LEAF) && (_self.fire("menuclick", {
                            item: item
                        }), _self.clearSelection(), _self.setSelected(item))
                    })
                },
                getItems: function() {
                    var _self = this,
                        items = [],
                        children = _self.get("children");
                    return BUI.each(children, function(item) {
                        var menu = item.get("children")[0];
                        items = items.concat(menu.get("children"))
                    }), items
                },
                _initMenuCfg: function(item) {
                    var _self = this,
                        items = item.items,
                        subItems = [],
                        cfg = {
                            xclass: "menu-item",
                            elCls: "menu-second",
                            collapsed: item.collapsed,
                            selectable: !1,
                            children: [{
                                xclass: "menu",
                                children: subItems
                            }],
                            content: '<div class="' + CLS_MENU_TITLE + '"><s></s><span class="' + CLS_MENU_TITLE + '-text">' + item.text + "</span></div>"
                        };
                    return BUI.each(items, function(subItem) {
                        var subItemCfg = _self._initSubMenuCfg(subItem);
                        subItems.push(subItemCfg)
                    }), cfg
                },
                _initSubMenuCfg: function(subItem) {
                    var cfg = {
                        xclass: "menu-item",
                        elCls: "menu-leaf",
                        tpl: '<a href="{href}"><em>{text}</em></a>'
                    };
                    return BUI.mix(cfg, subItem)
                }
            }, {
                ATTRS: {
                    autoInitItems: {
                        value: !1
                    },
                    events: {
                        value: {
                            menuclick: !1
                        }
                    }
                }
            }, {
                xclass: "side-menu"
            });
        return sideMenu
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Tab = BUI.namespace("Tab");
        return BUI.mix(Tab, {
            Tab: require("bui/tab/tab"),
            TabItem: require("bui/tab/tabitem"),
            NavTabItem: require("bui/tab/navtabitem"),
            NavTab: require("bui/tab/navtab"),
            TabPanel: require("bui/tab/tabpanel"),
            TabPanelItem: require("bui/tab/tabpanelitem")
        }), Tab
    }), define("src/hephaistos/js/bui-debug", [], function(requrie) {
        var PanelItem = function() {};
        return PanelItem.ATTRS = {
            panel: {},
            panelContent: {},
            panelVisibleStatus: {
                value: "selected"
            },
            defaultLoaderCfg: {
                valueFn: function() {
                    var _self = this,
                        eventName = _self._getVisibleEvent();
                    return {
                        property: "panelContent",
                        autoLoad: !1,
                        lazyLoad: {
                            event: eventName
                        },
                        loadMask: {
                            el: _self.get("panel")
                        }
                    }
                }
            },
            panelDestroyable: {
                value: !0
            }
        }, BUI.augment(PanelItem, {
            __renderUI: function() {
                this._resetPanelVisible()
            },
            __bindUI: function() {
                var _self = this,
                    eventName = _self._getVisibleEvent();
                _self.on(eventName, function(ev) {
                    _self._setPanelVisible(ev.newVal)
                })
            },
            _resetPanelVisible: function() {
                var _self = this,
                    status = _self.get("panelVisibleStatus"),
                    visible = _self.get(status);
                _self._setPanelVisible(visible)
            },
            _getVisibleEvent: function() {
                var _self = this,
                    status = _self.get("panelVisibleStatus");
                return "after" + BUI.ucfirst(status) + "Change"
            },
            _setPanelVisible: function(visible) {
                var _self = this,
                    panel = _self.get("panel"),
                    method = visible ? "show" : "hide";
                panel && $(panel)[method]()
            },
            __destructor: function() {
                var _self = this,
                    panel = _self.get("panel");
                panel && _self.get("panelDestroyable") && $(panel).remove()
            },
            _setPanelContent: function(panel, content) {
                $(panel);
                $(panel).html(content)
            },
            _uiSetPanelContent: function(v) {
                var _self = this,
                    panel = _self.get("panel");
                _self._setPanelContent(panel, v)
            },
            _uiSetPanel: function(v) {
                var _self = this,
                    content = _self.get("panelContent");
                content && _self._setPanelContent(v, content), _self._resetPanelVisible()
            }
        }), PanelItem
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Panels = function() {};
        return Panels.ATTRS = {
            panelTpl: {},
            panelContainer: {},
            panelCls: {}
        }, BUI.augment(Panels, {
            __renderUI: function() {
                var _self = this,
                    children = _self.get("children"),
                    panelContainer = _self._initPanelContainer(),
                    panelCls = _self.get("panelCls"),
                    panels = panelCls ? panelContainer.find("." + panels) : panelContainer.children();
                BUI.each(children, function(item, index) {
                    var panel = panels[index];
                    _self._initPanelItem(item, panel)
                })
            },
            __bindUI: function() {
                var _self = this;
                _self.on("beforeAddChild", function(ev) {
                    var item = ev.child;
                    _self._initPanelItem(item)
                })
            },
            _initPanelContainer: function() {
                var _self = this,
                    panelContainer = _self.get("panelContainer");
                return panelContainer && BUI.isString(panelContainer) && (panelContainer = 0 == panelContainer.indexOf("#") ? $(panelContainer) : _self.get("el").find(panelContainer), _self.setInternal("panelContainer", panelContainer)), panelContainer
            },
            _initPanelItem: function(item, panel) {
                var _self = this;
                item.set ? item.get("panel") || (panel = panel || _self._getPanel(item.get("userConfig")), item.set("panel", panel)) : item.panel || (panel = panel || _self._getPanel(item), item.panel = panel)
            },
            _getPanel: function(item) {
                var _self = this,
                    panelContainer = _self.get("panelContainer"),
                    panelTpl = BUI.substitute(_self.get("panelTpl"), item);
                return $(panelTpl).appendTo(panelContainer)
            }
        }), Panels
    }), define("src/hephaistos/js/bui-debug", [], function(requrie) {
        var BUI = requrie("bui/common"),
            Component = BUI.Component,
            CLS_ITEM_TITLE = "tab-item-title",
            CLS_ITEM_CLOSE = "tab-item-close",
            CLS_ITEM_INNER = "tab-item-inner",
            CLS_NAV_ACTIVED = "tab-nav-actived",
            CLS_CONTENT = "tab-content",
            navTabItemView = Component.View.extend({
                renderUI: function() {
                    var _self = this,
                        contentContainer = _self.get("tabContentContainer"),
                        contentTpl = _self.get("tabContentTpl");
                    if (contentContainer) {
                        var tabContentEl = $(contentTpl).appendTo(contentContainer);
                        _self.set("tabContentEl", tabContentEl)
                    }
                },
                _uiSetHref: function(v) {
                    this._setHref(v)
                },
                _setHref: function(href) {
                    var _self = this,
                        tabContentEl = _self.get("tabContentEl");
                    href = href || _self.get("href"), tabContentEl && $("iframe", tabContentEl).attr("src", href)
                },
                resetHref: function() {
                    this._setHref()
                },
                _uiSetTitle: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    el.attr("title", v), $("." + CLS_ITEM_TITLE, el).text(v)
                },
                _uiSetActived: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    _self.setTabContentVisible(v), v ? el.addClass(CLS_NAV_ACTIVED) : el.removeClass(CLS_NAV_ACTIVED)
                },
                destructor: function() {
                    var _self = this,
                        tabContentEl = _self.get("tabContentEl");
                    tabContentEl && tabContentEl.remove()
                },
                setTabContentVisible: function(v) {
                    var _self = this,
                        tabContentEl = _self.get("tabContentEl");
                    tabContentEl && (v ? tabContentEl.show() : tabContentEl.hide())
                }
            }, {
                ATTRS: {
                    tabContentContainer: {},
                    tabContentEl: {},
                    title: {},
                    href: {}
                }
            }),
            navTabItem = Component.Controller.extend({
                createDom: function() {
                    var _self = this,
                        parent = _self.get("parent");
                    parent && _self.set("tabContentContainer", parent.getTabContentContainer())
                },
                bindUI: function() {
                    var _self = this,
                        el = _self.get("el");
                    _self.get("events");
                    el.on("click", function(ev) {
                        var sender = $(ev.target);
                        sender.hasClass(CLS_ITEM_CLOSE) && _self.fire("closing") !== !1 && _self.close()
                    })
                },
                handleDblClick: function(ev) {
                    var _self = this;
                    _self.get("closeable") && _self.fire("closing") !== !1 && _self.close(), _self.fire("dblclick", {
                        domTarget: ev.target,
                        domEvent: ev
                    })
                },
                handleContextMenu: function(ev) {
                    ev.preventDefault(), this.fire("showmenu", {
                        position: {
                            x: ev.pageX,
                            y: ev.pageY
                        }
                    })
                },
                setTitle: function(title) {
                    this.set("title", title)
                },
                close: function() {
                    this.fire("closed")
                },
                reload: function() {
                    this.get("view").resetHref()
                },
                show: function() {
                    var _self = this;
                    _self.get("el").show(500, function() {
                        _self.set("visible", !0)
                    })
                },
                hide: function(callback) {
                    var _self = this;
                    this.get("el").hide(500, function() {
                        _self.set("visible", !1), callback && callback()
                    })
                },
                _uiSetActived: function(v) {
                    var _self = this,
                        parent = _self.get("parent");
                    parent && v && parent._setItemActived(_self)
                },
                _uiSetCloseable: function(v) {
                    var _self = this,
                        el = _self.get("el"),
                        closeEl = el.find("." + CLS_ITEM_CLOSE);
                    v ? closeEl.show() : closeEl.hide()
                }
            }, {
                ATTRS: {
                    elTagName: {
                        value: "li"
                    },
                    actived: {
                        view: !0,
                        value: !1
                    },
                    closeable: {
                        value: !0
                    },
                    allowTextSelection: {
                        view: !1,
                        value: !1
                    },
                    events: {
                        value: {
                            click: !0,
                            closing: !0,
                            closed: !0,
                            showmenu: !0,
                            afterVisibleChange: !0
                        }
                    },
                    tabContentContainer: {
                        view: !0
                    },
                    tabContentTpl: {
                        view: !0,
                        value: '<div class="' + CLS_CONTENT + '" style="display:none;"><iframe src="" width="100%" height="100%" frameborder="0"></iframe></div>'
                    },
                    href: {
                        view: !0,
                        value: ""
                    },
                    visible: {
                        view: !0,
                        value: !0
                    },
                    title: {
                        view: !0,
                        value: ""
                    },
                    tpl: {
                        view: !0,
                        value: '<s class="l"></s><div class="' + CLS_ITEM_INNER + '">{icon}<span class="' + CLS_ITEM_TITLE + '"></span><s class="' + CLS_ITEM_CLOSE + '"></s></div><s class="r"></s>'
                    },
                    xview: {
                        value: navTabItemView
                    }
                }
            }, {
                xclass: "nav-tab-item",
                priority: 0
            });
        return navTabItem.View = navTabItemView, navTabItem
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Menu = require("bui/menu"),
            Component = BUI.Component,
            CLS_NAV_LIST = "tab-nav-list",
            CLS_ARROW_LEFT = "arrow-left",
            CLS_ARROW_RIGHT = "arrow-right",
            CLS_FORCE_FIT = BUI.prefix + "tab-force",
            ID_CLOSE = "m_close",
            ITEM_WIDTH = 140,
            navTabView = Component.View.extend({
                renderUI: function() {
                    var _self = this,
                        el = _self.get("el"),
                        listEl = null;
                    listEl = el.find("." + CLS_NAV_LIST), _self.setInternal("listEl", listEl)
                },
                getContentElement: function() {
                    return this.get("listEl")
                },
                getTabContentContainer: function() {
                    return this.get("el").find(".tab-content-container")
                },
                _uiSetHeight: function(v) {
                    var _self = this,
                        el = _self.get("el"),
                        barEl = el.find(".tab-nav-bar"),
                        containerEl = _self.getTabContentContainer();
                    v && containerEl.height(v - barEl.height()), el.height(v)
                },
                _uiSetForceFit: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    v ? el.addClass(CLS_FORCE_FIT) : el.removeClass(CLS_FORCE_FIT)
                }
            }, {
                ATTRS: {
                    forceFit: {}
                }
            }, {
                xclass: "nav-tab-view",
                priority: 0
            }),
            navTab = Component.Controller.extend({
                addTab: function(config, reload) {
                    var _self = this,
                        id = config.id || BUI.guid("tab-item"),
                        forceFit = _self.get("forceFit"),
                        item = _self.getItemById(id);
                    if (item) {
                        var hrefChage = !1;
                        config.href && item.get("href") != config.href && (item.set("href", config.href), hrefChage = !0), _self._setItemActived(item), reload && !hrefChage && item.reload()
                    } else config = BUI.mix({
                        id: id,
                        visible: !1,
                        actived: !0,
                        xclass: "nav-tab-item"
                    }, config), item = _self.addChild(config), forceFit && _self.forceFit(), item.show(), _self._resetItemList();
                    return item
                },
                getTabContentContainer: function() {
                    return this.get("view").getTabContentContainer()
                },
                bindUI: function() {
                    var _self = this,
                        forceFit = _self.get("forceFit");
                    forceFit || (_self._bindScrollEvent(), _self.on("afterVisibleChange", function(ev) {
                        var item = ev.target;
                        item.get("actived") && _self._scrollToItem(item)
                    })), _self.on("click", function(ev) {
                        var item = ev.target;
                        item != _self && (_self._setItemActived(item), _self.fire("itemclick", {
                            item: item
                        }))
                    }), _self.on("closed", function(ev) {
                        var item = ev.target;
                        _self._closeItem(item)
                    }), _self.on("showmenu", function(ev) {
                        _self._showMenu(ev.target, ev.position)
                    })
                },
                _bindScrollEvent: function() {
                    var _self = this,
                        el = _self.get("el");
                    el.find(".arrow-left").on("click", function() {
                        el.hasClass(CLS_ARROW_LEFT + "-active") && _self._scrollLeft()
                    }), el.find(".arrow-right").on("click", function() {
                        el.hasClass(CLS_ARROW_RIGHT + "-active") && _self._scrllRight()
                    })
                },
                _showMenu: function(item, position) {
                    var closeItem, _self = this,
                        menu = _self._getMenu(),
                        closeable = item.get("closeable");
                    _self.set("showMenuItem", item), menu.set("xy", [position.x, position.y]), menu.show(), closeItem = menu.getItem(ID_CLOSE), closeItem && closeItem.set("disabled", !closeable)
                },
                setActived: function(id) {
                    var _self = this,
                        item = _self.getItemById(id);
                    _self._setItemActived(item)
                },
                getActivedItem: function() {
                    var _self = this,
                        children = _self.get("children"),
                        result = null;
                    return BUI.each(children, function(item) {
                        if (item.get("actived")) return result = item, !1
                    }), result
                },
                getItemById: function(id) {
                    var _self = this,
                        children = _self.get("children"),
                        result = null;
                    return BUI.each(children, function(item) {
                        if (item.get("id") === id) return result = item, !1
                    }), result
                },
                _getMenu: function() {
                    var _self = this;
                    return _self.get("menu") || _self._initMenu()
                },
                _initMenu: function() {
                    var _self = this,
                        menu = new Menu.ContextMenu({
                            children: [{
                                xclass: "context-menu-item",
                                iconCls: "icon icon-refresh",
                                text: "刷新",
                                listeners: {
                                    click: function() {
                                        var item = _self.get("showMenuItem");
                                        item && item.reload()
                                    }
                                }
                            }, {
                                id: ID_CLOSE,
                                xclass: "context-menu-item",
                                iconCls: "icon icon-remove",
                                text: "关闭",
                                listeners: {
                                    click: function() {
                                        var item = _self.get("showMenuItem");
                                        item && item.close()
                                    }
                                }
                            }, {
                                xclass: "context-menu-item",
                                iconCls: "icon icon-remove-sign",
                                text: "关闭其他",
                                listeners: {
                                    click: function() {
                                        var item = _self.get("showMenuItem");
                                        item && _self.closeOther(item)
                                    }
                                }
                            }, {
                                xclass: "context-menu-item",
                                iconCls: "icon icon-remove-sign",
                                text: "关闭所有",
                                listeners: {
                                    click: function() {
                                        _self.closeAll()
                                    }
                                }
                            }]
                        });
                    return _self.set("menu", menu), menu
                },
                _closeItem: function(item) {
                    var _self = this,
                        index = _self._getIndex(item),
                        activedItem = _self.getActivedItem(),
                        preItem = _self.get("preItem") || _self._getItemByIndex(index - 1),
                        nextItem = _self._getItemByIndex(index + 1);
                    item.hide(function() {
                        _self.removeChild(item, !0), _self._resetItemList(), activedItem === item ? preItem ? _self._setItemActived(preItem) : _self._setItemActived(nextItem) : _self._scrollToItem(activedItem), _self.forceFit()
                    })
                },
                closeAll: function() {
                    var _self = this,
                        children = _self.get("children");
                    BUI.each(children, function(item) {
                        item.get("closeable") && item.close()
                    })
                },
                closeOther: function(curItem) {
                    var _self = this,
                        children = _self.get("children");
                    BUI.each(children, function(item) {
                        curItem !== item && item.close()
                    })
                },
                _getItemByIndex: function(index) {
                    var _self = this,
                        children = _self.get("children");
                    return children[index]
                },
                _getIndex: function(item) {
                    var _self = this,
                        children = _self.get("children");
                    return BUI.Array.indexOf(item, children)
                },
                _resetItemList: function() {
                    if (!this.get("forceFit")) {
                        var _self = this,
                            container = _self.getContentElement();
                        container.width(_self._getTotalWidth())
                    }
                },
                _getTotalWidth: function() {
                    var _self = this,
                        children = _self.get("children");
                    return children.length * _self.get("itemWidth")
                },
                _getForceItemWidth: function() {
                    var _self = this,
                        width = _self.getContentElement().width(),
                        children = _self.get("children"),
                        totalWidth = _self._getTotalWidth(),
                        itemWidth = _self.get(itemWidth);
                    return totalWidth > width && (itemWidth = width / children.length), itemWidth
                },
                forceFit: function() {
                    var _self = this;
                    _self._forceItemWidth(_self._getForceItemWidth())
                },
                _forceItemWidth: function(width) {
                    width = width || this.get("itemWidth");
                    var _self = this,
                        children = _self.get("children");
                    BUI.each(children, function(item) {
                        item.set("width", width)
                    })
                },
                _scrollToItem: function(item) {
                    if (!this.get("forceFit")) {
                        var _self = this,
                            container = _self.getContentElement(),
                            containerPosition = container.position(),
                            disWidth = _self._getDistanceToEnd(item, container, containerPosition),
                            disBegin = _self._getDistanceToBegin(item, containerPosition);
                        if (container.width() < container.parent().width()) _self._scrollTo(container, 0);
                        else if (disBegin < 0) _self._scrollTo(container, containerPosition.left - disBegin);
                        else if (disWidth > 0) _self._scrollTo(container, containerPosition.left + disWidth * -1);
                        else if (containerPosition.left < 0) {
                            var lastDistance = _self._getLastDistance(container, containerPosition),
                                toLeft = 0;
                            lastDistance < 0 && (toLeft = containerPosition.left - lastDistance, toLeft = toLeft < 0 ? toLeft : 0, _self._scrollTo(container, toLeft))
                        }
                    }
                },
                _getDistanceToBegin: function(item, containerPosition) {
                    var position = item.get("el").position();
                    return position.left + containerPosition.left
                },
                _getDistanceToEnd: function(item, container, containerPosition) {
                    var _self = this,
                        container = container || _self.getContentElement(),
                        wraperWidth = container.parent().width(),
                        containerPosition = containerPosition || container.position(),
                        offsetLeft = _self._getDistanceToBegin(item, containerPosition),
                        disWidth = offsetLeft + _self.get("itemWidth") - wraperWidth;
                    return disWidth
                },
                _getLastDistance: function(container, containerPosition) {
                    var _self = this,
                        children = _self.get("children"),
                        lastItem = children[children.length - 1];
                    return lastItem ? _self._getDistanceToEnd(lastItem, container, containerPosition) : 0
                },
                _scrollTo: function(el, left, callback) {
                    var _self = this;
                    el.animate({
                        left: left
                    }, 500, function() {
                        _self._setArrowStatus(el)
                    })
                },
                _scrollLeft: function() {
                    var toLeft, _self = this,
                        container = _self.getContentElement(),
                        position = container.position(),
                        disWidth = _self._getLastDistance(container, position);
                    disWidth > 0 && (toLeft = disWidth > _self.get("itemWidth") ? _self.get("itemWidth") : disWidth, _self._scrollTo(container, position.left - toLeft))
                },
                _scrllRight: function() {
                    var toRight, _self = this,
                        container = _self.getContentElement(),
                        position = container.position();
                    position.left < 0 && (toRight = position.left + _self.get("itemWidth"), toRight = toRight < 0 ? toRight : 0, _self._scrollTo(container, toRight))
                },
                _setArrowStatus: function(container, containerPosition) {
                    container = container || this.getContentElement();
                    var _self = this,
                        wapperEl = _self.get("el"),
                        position = containerPosition || container.position(),
                        disWidth = _self._getLastDistance(container, containerPosition);
                    position.left < 0 ? wapperEl.addClass(CLS_ARROW_RIGHT + "-active") : wapperEl.removeClass(CLS_ARROW_RIGHT + "-active"), disWidth > 0 ? wapperEl.addClass(CLS_ARROW_LEFT + "-active") : wapperEl.removeClass(CLS_ARROW_LEFT + "-active")
                },
                _setItemActived: function(item) {
                    var _self = this,
                        preActivedItem = _self.getActivedItem();
                    item !== preActivedItem && (preActivedItem && preActivedItem.set("actived", !1), _self.set("preItem", preActivedItem), item && (item.get("actived") || item.set("actived", !0), item.get("visible") && _self._scrollToItem(item), _self.fire("activeChange", {
                        item: item
                    }), _self.fire("activedchange", {
                        item: item
                    })))
                }
            }, {
                ATTRS: {
                    defaultChildClass: {
                        value: "nav-tab-item"
                    },
                    menu: {},
                    forceFit: {
                        view: !0,
                        value: !1
                    },
                    itemWidth: {
                        value: ITEM_WIDTH
                    },
                    tpl: {
                        view: !0,
                        value: '<div class="tab-nav-bar"><s class="tab-nav-arrow arrow-left"></s><div class="tab-nav-wrapper"><div class="tab-nav-inner"><ul class="' + CLS_NAV_LIST + '"></ul></div></div><s class="tab-nav-arrow arrow-right"></s></div><div class="tab-content-container"></div>'
                    },
                    xview: {
                        value: navTabView
                    },
                    events: {
                        value: {
                            itemclick: !1,
                            activedchange: !1
                        }
                    }
                }
            }, {
                xclass: "nav-tab",
                priority: 0
            });
        return navTab
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            UIBase = Component.UIBase,
            itemView = Component.View.extend([UIBase.ListItemView], {}, {
                xclass: "tab-item-view"
            }),
            item = Component.Controller.extend([UIBase.ListItem], {}, {
                ATTRS: {
                    elTagName: {
                        view: !0,
                        value: "li"
                    },
                    xview: {
                        value: itemView
                    },
                    tpl: {
                        view: !0,
                        value: '<span class="bui-tab-item-text">{text}</span>'
                    }
                }
            }, {
                xclass: "tab-item"
            });
        return item.View = itemView, item
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            UIBase = Component.UIBase,
            tab = Component.Controller.extend([UIBase.ChildList], {}, {
                ATTRS: {
                    elTagName: {
                        view: !0,
                        value: "ul"
                    },
                    defaultChildClass: {
                        value: "tab-item"
                    }
                }
            }, {
                xclass: "tab"
            });
        return tab
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            TabItem = require("bui/tab/tabitem"),
            PanelItem = require("bui/tab/panelitem"),
            CLS_TITLE = "bui-tab-item-text",
            Component = BUI.Component,
            itemView = TabItem.View.extend([Component.UIBase.Close.View], {
                _uiSetTitle: function(v) {
                    var _self = this,
                        el = _self.get("el"),
                        titleEl = el.find("." + CLS_TITLE);
                    titleEl.text(v)
                }
            }, {
                xclass: "tab-panel-item-view"
            }),
            item = TabItem.extend([PanelItem, Component.UIBase.Close], {}, {
                ATTRS: {
                    closeAction: {
                        value: "remove"
                    },
                    title: {
                        view: !0,
                        sync: !1
                    },
                    tpl: {
                        value: '<span class="' + CLS_TITLE + '">{text}{title}</span>'
                    },
                    closeable: {
                        value: !1
                    },
                    events: {
                        value: {
                            beforeclosed: !0
                        }
                    },
                    xview: {
                        value: itemView
                    }
                }
            }, {
                xclass: "tab-panel-item"
            });
        return item.View = itemView, item
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Tab = (require("bui/common"), require("bui/tab/tab")),
            Panels = require("bui/tab/panels"),
            tabPanel = Tab.extend([Panels], {
                bindUI: function() {
                    var _self = this;
                    _self.on("beforeclosed", function(ev) {
                        var item = ev.target;
                        _self._beforeClosedItem(item)
                    })
                },
                _beforeClosedItem: function(item) {
                    if (item.get("selected")) {
                        var preItem, nextItem, _self = this,
                            index = _self.indexOfItem(item),
                            count = _self.getItemCount();
                        index !== count - 1 ? (nextItem = _self.getItemAt(index + 1), _self.setSelected(nextItem)) : 0 !== index && (preItem = _self.getItemAt(index - 1), _self.setSelected(preItem))
                    }
                }
            }, {
                ATTRS: {
                    elTagName: {
                        value: "div"
                    },
                    childContainer: {
                        value: "ul"
                    },
                    tpl: {
                        value: '<div class="tab-panel-inner"><ul></ul><div class="tab-panels"></div></div>'
                    },
                    panelTpl: {
                        value: "<div></div>"
                    },
                    panelContainer: {
                        value: ".tab-panels"
                    },
                    defaultChildClass: {
                        value: "tab-panel-item"
                    }
                }
            }, {
                xclass: "tab-panel"
            });
        return tabPanel
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Toolbar = BUI.namespace("Toolbar");
        return BUI.mix(Toolbar, {
            BarItem: require("bui/toolbar/baritem"),
            Bar: require("bui/toolbar/bar"),
            PagingBar: require("bui/toolbar/pagingbar"),
            NumberPagingBar: require("bui/toolbar/numberpagingbar")
        }), Toolbar
    }), define("src/hephaistos/js/bui-debug", [], function() {
        var PREFIX = BUI.prefix,
            Component = BUI.Component,
            UIBase = Component.UIBase,
            BarItemView = Component.View.extend([UIBase.ListItemView]),
            BarItem = Component.Controller.extend([UIBase.ListItem], {
                renderUI: function() {
                    var el = this.get("el");
                    el.addClass(PREFIX + "inline-block"), el.attr("id") || el.attr("id", this.get("id"))
                }
            }, {
                ATTRS: {
                    elTagName: {
                        view: !0,
                        value: "li"
                    },
                    selectable: {
                        value: !1
                    },
                    focusable: {
                        value: !1
                    },
                    xview: {
                        value: BarItemView
                    }
                }
            }, {
                xclass: "bar-item",
                priority: 1
            }),
            ButtonBarItem = BarItem.extend({
                _uiSetDisabled: function(value) {
                    var _self = this,
                        el = _self.get("el"),
                        method = value ? "addClass" : "removeClass";
                    el.find("button").attr("disabled", value)[method](PREFIX + "button-disabled")
                },
                _uiSetChecked: function(value) {
                    var _self = this,
                        el = _self.get("el"),
                        method = value ? "addClass" : "removeClass";
                    el.find("button")[method](PREFIX + "button-checked")
                },
                _uiSetText: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    el.find("button").text(v)
                },
                _uiSetbtnCls: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    el.find("button").addClass(v)
                }
            }, {
                ATTRS: {
                    checked: {
                        value: !1
                    },
                    tpl: {
                        view: !0,
                        value: '<button type="button" class="{btnCls}">{text}</button>'
                    },
                    btnCls: {
                        sync: !1
                    },
                    text: {
                        sync: !1,
                        value: ""
                    }
                }
            }, {
                xclass: "bar-item-button",
                priority: 2
            }),
            SeparatorBarItem = BarItem.extend({
                renderUI: function() {
                    var el = this.get("el");
                    el.attr("role", "separator")
                }
            }, {
                xclass: "bar-item-separator",
                priority: 2
            }),
            SpacerBarItem = BarItem.extend({}, {
                ATTRS: {
                    width: {
                        view: !0,
                        value: 2
                    }
                }
            }, {
                xclass: "bar-item-spacer",
                priority: 2
            }),
            TextBarItem = BarItem.extend({
                _uiSetText: function(text) {
                    var _self = this,
                        el = _self.get("el");
                    el.html(text)
                }
            }, {
                ATTRS: {
                    text: {
                        value: ""
                    }
                }
            }, {
                xclass: "bar-item-text",
                priority: 2
            });
        return BarItem.types = {
            button: ButtonBarItem,
            separator: SeparatorBarItem,
            spacer: SpacerBarItem,
            text: TextBarItem
        }, BarItem
    }), define("src/hephaistos/js/bui-debug", [], function() {
        var Component = BUI.Component,
            UIBase = Component.UIBase,
            barView = Component.View.extend({
                renderUI: function() {
                    var el = this.get("el");
                    el.attr("role", "toolbar"), el.attr("id") || el.attr("id", BUI.guid("bar"))
                }
            }),
            Bar = Component.Controller.extend([UIBase.ChildList], {
                getItem: function(id) {
                    return this.getChild(id)
                }
            }, {
                ATTRS: {
                    elTagName: {
                        view: !0,
                        value: "ul"
                    },
                    defaultChildClass: {
                        value: "bar-item"
                    },
                    focusable: {
                        value: !1
                    },
                    xview: {
                        value: barView
                    }
                }
            }, {
                xclass: "bar",
                priority: 1
            });
        return Bar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Bar = require("bui/toolbar/bar"),
            Component = BUI.Component,
            Bindable = Component.UIBase.Bindable,
            PREFIX = BUI.prefix,
            ID_FIRST = "first",
            ID_PREV = "prev",
            ID_NEXT = "next",
            ID_LAST = "last",
            ID_SKIP = "skip",
            ID_REFRESH = "refresh",
            ID_TOTAL_PAGE = "totalPage",
            ID_CURRENT_PAGE = "curPage",
            ID_TOTAL_COUNT = "totalCount",
            ID_BUTTONS = [ID_FIRST, ID_PREV, ID_NEXT, ID_LAST, ID_SKIP, ID_REFRESH],
            ID_TEXTS = [ID_TOTAL_PAGE, ID_CURRENT_PAGE, ID_TOTAL_COUNT],
            PagingBar = Bar.extend([Bindable], {
                initializer: function() {
                    var _self = this,
                        children = _self.get("children"),
                        items = _self.get("items"),
                        store = _self.get("store");
                    items ? BUI.each(items, function(item, index) {
                        BUI.isString(item) && (item = BUI.Array.contains(item, ID_BUTTONS) ? _self._getButtonItem(item) : BUI.Array.contains(item, ID_TEXTS) ? _self._getTextItem(item) : {
                            xtype: item
                        }), children.push(item)
                    }) : (items = _self._getItems(), BUI.each(items, function(item) {
                        children.push(item)
                    })), store && store.get("pageSize") && _self.set("pageSize", store.get("pageSize"))
                },
                bindUI: function() {
                    var _self = this;
                    _self._bindButtonEvent()
                },
                jumpToPage: function(page) {
                    if (!(page <= 0 || page > this.get("totalPage"))) {
                        var _self = this,
                            store = _self.get("store"),
                            pageSize = _self.get("pageSize"),
                            index = page - 1,
                            start = index * pageSize,
                            result = _self.fire("beforepagechange", {
                                from: _self.get("curPage"),
                                to: page
                            });
                        store && result !== !1 && store.load({
                            start: start,
                            limit: pageSize,
                            pageIndex: index
                        })
                    }
                },
                _afterStoreLoad: function(store, params) {
                    var end, totalCount, curPage, totalPage, _self = this,
                        pageSize = _self.get("pageSize"),
                        start = 0;
                    start = store.get("start"), totalCount = store.getTotalCount(), end = totalCount - start > pageSize ? start + store.getCount() - 1 : totalCount, totalPage = parseInt((totalCount + pageSize - 1) / pageSize, 10), totalPage = totalPage > 0 ? totalPage : 1, curPage = parseInt(start / pageSize, 10) + 1, _self.set("start", start), _self.set("end", end), _self.set("totalCount", totalCount), _self.set("curPage", curPage), _self.set("totalPage", totalPage), _self._setAllButtonsState(), _self._setNumberPages()
                },
                _bindButtonEvent: function() {
                    function handleSkip() {
                        var value = parseInt(_self._getCurrentPageValue(), 10);
                        _self._isPageAllowRedirect(value) ? _self.jumpToPage(value) : _self._setCurrentPageValue(_self.get("curPage"))
                    }
                    var _self = this;
                    _self._bindButtonItemEvent(ID_FIRST, function() {
                        _self.jumpToPage(1)
                    }), _self._bindButtonItemEvent(ID_PREV, function() {
                        _self.jumpToPage(_self.get("curPage") - 1)
                    }), _self._bindButtonItemEvent(ID_NEXT, function() {
                        _self.jumpToPage(_self.get("curPage") + 1)
                    }), _self._bindButtonItemEvent(ID_LAST, function() {
                        _self.jumpToPage(_self.get("totalPage"))
                    }), _self._bindButtonItemEvent(ID_SKIP, function() {
                        handleSkip()
                    }), _self._bindButtonItemEvent(ID_REFRESH, function() {
                        _self.jumpToPage(_self.get("curPage"))
                    });
                    var curPage = _self.getItem(ID_CURRENT_PAGE);
                    curPage && curPage.get("el").on("keyup", function(event) {
                        event.stopPropagation(), 13 === event.keyCode && handleSkip()
                    })
                },
                _bindButtonItemEvent: function(id, func) {
                    var _self = this,
                        item = _self.getItem(id);
                    item && item.on("click", func)
                },
                onLoad: function(params) {
                    var _self = this,
                        store = _self.get("store");
                    _self._afterStoreLoad(store, params)
                },
                _getItems: function() {
                    var _self = this,
                        items = _self.get("items");
                    return items && items.length ? items : (items = [], items.push(_self._getButtonItem(ID_FIRST)), items.push(_self._getButtonItem(ID_PREV)), items.push(_self._getSeparator()), items.push(_self._getTextItem(ID_TOTAL_PAGE)), items.push(_self._getTextItem(ID_CURRENT_PAGE)), items.push(_self._getButtonItem(ID_SKIP)), items.push(_self._getSeparator()), items.push(_self._getButtonItem(ID_NEXT)), items.push(_self._getButtonItem(ID_LAST)), items.push(_self._getSeparator()), items.push(_self._getTextItem(ID_TOTAL_COUNT)), items)
                },
                _getButtonItem: function(id) {
                    var _self = this;
                    return {
                        id: id,
                        xclass: "bar-item-button",
                        text: _self.get(id + "Text"),
                        disabled: !0,
                        elCls: _self.get(id + "Cls")
                    }
                },
                _getSeparator: function() {
                    return {
                        xclass: "bar-item-separator"
                    }
                },
                _getTextItem: function(id) {
                    var _self = this;
                    return {
                        id: id,
                        xclass: "bar-item-text",
                        text: _self._getTextItemTpl(id)
                    }
                },
                _getTextItemTpl: function(id) {
                    var _self = this,
                        obj = _self.getAttrVals();
                    return BUI.substitute(this.get(id + "Tpl"), obj)
                },
                _isPageAllowRedirect: function(value) {
                    var _self = this;
                    return value && value > 0 && value <= _self.get("totalPage") && value !== _self.get("curPage")
                },
                _setAllButtonsState: function() {
                    var _self = this,
                        store = _self.get("store");
                    store && _self._setButtonsState([ID_PREV, ID_NEXT, ID_FIRST, ID_LAST, ID_SKIP], !0), 1 === _self.get("curPage") && _self._setButtonsState([ID_PREV, ID_FIRST], !1), _self.get("curPage") === _self.get("totalPage") && _self._setButtonsState([ID_NEXT, ID_LAST], !1)
                },
                _setButtonsState: function(buttons, enable) {
                    var _self = this,
                        children = _self.get("children");
                    BUI.each(children, function(child) {
                        BUI.Array.indexOf(child.get("id"), buttons) !== -1 && child.set("disabled", !enable)
                    })
                },
                _setNumberPages: function() {
                    var _self = this,
                        items = _self.getItems();
                    BUI.each(items, function(item) {
                        "bar-item-text" === item.__xclass && item.set("content", _self._getTextItemTpl(item.get("id")))
                    })
                },
                _getCurrentPageValue: function(curItem) {
                    var _self = this;
                    if (curItem = curItem || _self.getItem(ID_CURRENT_PAGE)) {
                        var textEl = curItem.get("el").find("input");
                        return textEl.val()
                    }
                },
                _setCurrentPageValue: function(value, curItem) {
                    var _self = this;
                    if (curItem = curItem || _self.getItem(ID_CURRENT_PAGE)) {
                        var textEl = curItem.get("el").find("input");
                        textEl.val(value)
                    }
                }
            }, {
                ATTRS: {
                    firstText: {
                        value: "首 页"
                    },
                    firstCls: {
                        value: PREFIX + "pb-first"
                    },
                    prevText: {
                        value: "上一页"
                    },
                    prevCls: {
                        value: PREFIX + "pb-prev"
                    },
                    nextText: {
                        value: "下一页"
                    },
                    nextCls: {
                        value: PREFIX + "pb-next"
                    },
                    lastText: {
                        value: "末 页"
                    },
                    lastCls: {
                        value: PREFIX + "pb-last"
                    },
                    skipText: {
                        value: "确定"
                    },
                    skipCls: {
                        value: PREFIX + "pb-skip"
                    },
                    refreshText: {
                        value: "刷新"
                    },
                    refreshCls: {
                        value: PREFIX + "pb-refresh"
                    },
                    totalPageTpl: {
                        value: "共 {totalPage} 页"
                    },
                    curPageTpl: {
                        value: '第 <input type="text" autocomplete="off" class="' + PREFIX + 'pb-page" size="20" value="{curPage}" name="inputItem"> 页'
                    },
                    totalCountTpl: {
                        value: "共{totalCount}条记录"
                    },
                    autoInitItems: {
                        value: !1
                    },
                    curPage: {
                        value: 0
                    },
                    totalPage: {
                        value: 0
                    },
                    totalCount: {
                        value: 0
                    },
                    pageSize: {
                        value: 30
                    },
                    store: {}
                },
                ID_FIRST: ID_FIRST,
                ID_PREV: ID_PREV,
                ID_NEXT: ID_NEXT,
                ID_LAST: ID_LAST,
                ID_SKIP: ID_SKIP,
                ID_REFRESH: ID_REFRESH,
                ID_TOTAL_PAGE: ID_TOTAL_PAGE,
                ID_CURRENT_PAGE: ID_CURRENT_PAGE,
                ID_TOTAL_COUNT: ID_TOTAL_COUNT
            }, {
                xclass: "pagingbar",
                priority: 2
            });
        return PagingBar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var PBar = (BUI.Component, require("bui/toolbar/pagingbar")),
            PREFIX = BUI.prefix,
            CLS_NUMBER_BUTTON = PREFIX + "button-number",
            NumberPagingBar = PBar.extend({
                _getItems: function() {
                    var _self = this,
                        items = _self.get("items");
                    return items ? items : (items = [], items.push(_self._getButtonItem(PBar.ID_PREV)), items.push(_self._getButtonItem(PBar.ID_NEXT)), items)
                },
                _getButtonItem: function(id) {
                    var _self = this;
                    return {
                        id: id,
                        content: '<a href="javascript:;">' + _self.get(id + "Text") + "</a>",
                        disabled: !0
                    }
                },
                _bindButtonEvent: function() {
                    var _self = this,
                        cls = _self.get("numberButtonCls");
                    _self.constructor.superclass._bindButtonEvent.call(this), _self.get("el").delegate("a", "click", function(ev) {
                        ev.preventDefault()
                    }), _self.on("click", function(ev) {
                        var item = ev.target;
                        if (item && item.get("el").hasClass(cls)) {
                            var page = item.get("id");
                            _self.jumpToPage(page)
                        }
                    })
                },
                _setNumberPages: function() {
                    var _self = this;
                    _self._setNumberButtons()
                },
                _setNumberButtons: function() {
                    var curItem, _self = this,
                        curPage = _self.get("curPage"),
                        totalPage = _self.get("totalPage"),
                        numberItems = _self._getNumberItems(curPage, totalPage);
                    _self._clearNumberButtons(), BUI.each(numberItems, function(item) {
                        _self._appendNumberButton(item)
                    }), curItem = _self.getItem(curPage), curItem && curItem.set("selected", !0)
                },
                _appendNumberButton: function(cfg) {
                    var _self = this,
                        count = _self.getItemCount();
                    _self.addItemAt(cfg, count - 1)
                },
                _clearNumberButtons: function() {
                    for (var _self = this, count = (_self.getItems(), _self.getItemCount()); count > 2;) _self.removeItemAt(count - 2), count = _self.getItemCount()
                },
                _getNumberItems: function(curPage, totalPage) {
                    function addNumberItem(from, to) {
                        for (var i = from; i <= to; i++) result.push(_self._getNumberItem(i))
                    }

                    function addEllipsis() {
                        result.push(_self._getEllipsisItem())
                    }
                    var maxPage, _self = this,
                        result = [],
                        maxLimitCount = _self.get("maxLimitCount"),
                        showRangeCount = _self.get("showRangeCount");
                    if (totalPage < maxLimitCount) maxPage = totalPage, addNumberItem(1, totalPage);
                    else {
                        var startNum = curPage <= maxLimitCount ? 1 : curPage - showRangeCount,
                            lastLimit = curPage + showRangeCount,
                            endNum = lastLimit < totalPage ? lastLimit > maxLimitCount ? lastLimit : maxLimitCount : totalPage;
                        startNum > 1 && (addNumberItem(1, 1), startNum > 2 && addEllipsis()), maxPage = endNum, addNumberItem(startNum, endNum)
                    }
                    return maxPage < totalPage && (maxPage < totalPage - 1 && addEllipsis(), addNumberItem(totalPage, totalPage)), result
                },
                _getEllipsisItem: function() {
                    var _self = this;
                    return {
                        disabled: !0,
                        content: _self.get("ellipsisTpl")
                    }
                },
                _getNumberItem: function(page) {
                    var _self = this;
                    return {
                        id: page,
                        elCls: _self.get("numberButtonCls")
                    }
                }
            }, {
                ATTRS: {
                    itemStatusCls: {
                        value: {
                            selected: "active",
                            disabled: "disabled"
                        }
                    },
                    itemTpl: {
                        value: '<a href="">{id}</a>'
                    },
                    prevText: {
                        value: "<<"
                    },
                    nextText: {
                        value: ">>"
                    },
                    maxLimitCount: {
                        value: 4
                    },
                    showRangeCount: {
                        value: 1
                    },
                    numberButtonCls: {
                        value: CLS_NUMBER_BUTTON
                    },
                    ellipsisTpl: {
                        value: '<a href="#">...</a>'
                    }
                }
            }, {
                xclass: "pagingbar-number",
                priority: 3
            });
        return NumberPagingBar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            ProgressBar = BUI.namespace("ProgressBar");
        return BUI.mix(ProgressBar, {
            Base: require("bui/progressbar/base"),
            Load: require("bui/progressbar/load")
        }), ProgressBar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            progressBarView = BUI.Component.View.extend({
                _uiSetPercent: function(v) {
                    var _self = this,
                        innerEl = _self.get("el").children();
                    BUI.isArray(v) || (v = [v]), BUI.each(innerEl, function(item, index) {
                        $(item).width(v[index] + "%")
                    })
                }
            }, {
                ATTRS: {
                    percent: {}
                }
            }),
            progressBar = BUI.Component.Controller.extend({}, {
                ATTRS: {
                    percent: {
                        view: !0,
                        value: 0
                    },
                    tpl: {
                        value: '<div class="progress-bar-inner"></div>'
                    },
                    xview: {
                        value: progressBarView
                    }
                }
            }, {
                xclass: "progress-bar"
            });
        return progressBar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Base = require("bui/progressbar/base"),
            notStarted = 0,
            hasStarted = 1,
            hasEnded = 2,
            loadProgressBar = Base.extend({
                bindUI: function() {
                    var _self = this;
                    _self.on("afterPercentChange", function(ev) {
                        if (_self.isLoading()) {
                            var percent = _self.get("percent");
                            100 == percent && _self.onCompleted(), _self.onChange()
                        }
                    })
                },
                start: function() {
                    var _self = this;
                    _self.isLoading() || _self.onstart()
                },
                complete: function() {
                    var _self = this;
                    clearTimeout(_self.get("t")), _self.set("percent", 100)
                },
                cancel: function() {
                    var _self = this;
                    clearTimeout(_self.get("t")), _self.get("percent") && _self.set("percent", 0), _self.set("status", notStarted)
                },
                onstart: function() {
                    var _self = this,
                        cfg = _self.get("cfg");
                    _self.set("percent", 0), _self.set("status", hasStarted), _self.fire("start", cfg), _self._startLoad()
                },
                onChange: function() {
                    var _self = this;
                    _self.fire("loadchange")
                },
                onCompleted: function() {
                    var _self = this;
                    _self.set("status", hasEnded), _self.fire("completed")
                },
                isLoading: function() {
                    return this.get("status") === hasStarted
                },
                isCompleted: function() {
                    return this.get("status") === hasEnded
                },
                _startLoad: function() {
                    var t, _self = this,
                        ajaxCfg = _self.get("ajaxCfg"),
                        interval = _self.get("interval");
                    ajaxCfg.success = function(data) {
                        var percent = data.percent;
                        _self.set("percent", percent), percent < 100 && _self.isLoading() && (t = setTimeout(function() {
                            $.ajax(ajaxCfg)
                        }, interval), _self.set("t", t))
                    }, $.ajax(ajaxCfg)
                }
            }, {
                ATTRS: {
                    status: {
                        value: 0
                    },
                    ajaxCfg: {},
                    interval: {
                        value: 500
                    },
                    events: {}
                }
            }, {
                xclass: "progress-bar-load"
            });
        return loadProgressBar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Calendar = BUI.namespace("Calendar");
        return BUI.mix(Calendar, {
            Calendar: require("bui/calendar/calendar"),
            MonthPicker: require("bui/calendar/monthpicker"),
            DatePicker: require("bui/calendar/datepicker")
        }), Calendar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getMonths() {
            return $.map(months, function(month, index) {
                return {
                    text: month,
                    value: index
                }
            })
        }
        var BUI = require("bui/common"),
            Overlay = (BUI.Component, require("bui/overlay").Overlay),
            List = require("bui/list").SimpleList,
            Toolbar = require("bui/toolbar"),
            PREFIX = BUI.prefix,
            CLS_MONTH = "x-monthpicker-month",
            CLS_YEAR = "x-monthpicker-year",
            CLS_YEAR_NAV = "x-monthpicker-yearnav",
            CLS_ITEM = "x-monthpicker-item",
            months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            MonthPanel = List.extend({
                bindUI: function() {
                    var _self = this;
                    _self.get("el").delegate("a", "click", function(ev) {
                        ev.preventDefault()
                    }).delegate("." + CLS_MONTH, "dblclick", function() {
                        _self.fire("dblclick")
                    })
                }
            }, {
                ATTRS: {
                    itemTpl: {
                        view: !0,
                        value: '<li class="' + CLS_ITEM + ' x-monthpicker-month"><a href="#" hidefocus="on">{text}</a></li>'
                    },
                    itemCls: {
                        value: CLS_ITEM
                    },
                    items: {
                        view: !0,
                        value: getMonths()
                    },
                    elCls: {
                        view: !0,
                        value: "x-monthpicker-months"
                    }
                }
            }, {
                xclass: "calendar-month-panel"
            }),
            YearPanel = List.extend({
                bindUI: function() {
                    var _self = this,
                        el = _self.get("el");
                    el.delegate("a", "click", function(ev) {
                        ev.preventDefault()
                    }), el.delegate("." + CLS_YEAR, "dblclick", function() {
                        _self.fire("dblclick")
                    }), el.delegate(".x-icon", "click", function(ev) {
                        var sender = $(ev.currentTarget);
                        sender.hasClass(CLS_YEAR_NAV + "-prev") ? _self._prevPage() : sender.hasClass(CLS_YEAR_NAV + "-next") && _self._nextPage()
                    }), _self.on("itemselected", function(ev) {
                        ev.item && _self.setInternal("year", ev.item.value)
                    })
                },
                _prevPage: function() {
                    var _self = this,
                        start = _self.get("start"),
                        yearCount = _self.get("yearCount");
                    _self.set("start", start - yearCount)
                },
                _nextPage: function() {
                    var _self = this,
                        start = _self.get("start"),
                        yearCount = _self.get("yearCount");
                    _self.set("start", start + yearCount)
                },
                _uiSetStart: function() {
                    var _self = this;
                    _self._setYearsContent()
                },
                _uiSetYear: function(v) {
                    var _self = this,
                        item = _self.findItemByField("value", v);
                    item ? _self.setSelectedByField(v) : _self.set("start", v)
                },
                _setYearsContent: function() {
                    for (var _self = this, year = _self.get("year"), start = _self.get("start"), yearCount = _self.get("yearCount"), items = [], i = start; i < start + yearCount; i++) {
                        var text = i.toString();
                        items.push({
                            text: text,
                            value: i
                        })
                    }
                    _self.set("items", items), _self.setSelectedByField(year)
                }
            }, {
                ATTRS: {
                    items: {
                        view: !0,
                        value: []
                    },
                    elCls: {
                        view: !0,
                        value: "x-monthpicker-years"
                    },
                    itemCls: {
                        value: CLS_ITEM
                    },
                    year: {},
                    start: {
                        value: (new Date).getFullYear()
                    },
                    yearCount: {
                        value: 10
                    },
                    itemTpl: {
                        view: !0,
                        value: '<li class="' + CLS_ITEM + " " + CLS_YEAR + '"><a href="#" hidefocus="on">{text}</a></li>'
                    },
                    tpl: {
                        view: !0,
                        value: '<div class="' + CLS_YEAR_NAV + '"><span class="' + CLS_YEAR_NAV + '-prev x-icon x-icon-normal x-icon-small"><span class="icon icon-caret icon-caret-left"></span></span><span class="' + CLS_YEAR_NAV + '-next x-icon x-icon-normal x-icon-small"><span class="icon icon-caret icon-caret-right"></span></span></div><ul></ul>'
                    }
                }
            }, {
                xclass: "calendar-year-panel"
            }),
            monthPicker = Overlay.extend({
                initializer: function() {
                    var _self = this,
                        children = _self.get("children"),
                        monthPanel = new MonthPanel,
                        yearPanel = new YearPanel,
                        footer = _self._createFooter();
                    children.push(monthPanel), children.push(yearPanel), children.push(footer), _self.set("yearPanel", yearPanel), _self.set("monthPanel", monthPanel)
                },
                bindUI: function() {
                    var _self = this;
                    _self.get("monthPanel").on("itemselected", function(ev) {
                        ev.item && _self.setInternal("month", ev.item.value)
                    }).on("dblclick", function() {
                        _self._successCall()
                    }), _self.get("yearPanel").on("itemselected", function(ev) {
                        ev.item && _self.setInternal("year", ev.item.value)
                    }).on("dblclick", function() {
                        _self._successCall()
                    })
                },
                _successCall: function() {
                    var _self = this,
                        callback = _self.get("success");
                    callback && callback.call(_self)
                },
                _createFooter: function() {
                    var _self = this;
                    return new Toolbar.Bar({
                        elCls: PREFIX + "clear x-monthpicker-footer",
                        children: [{
                            xclass: "bar-item-button",
                            text: "确定",
                            btnCls: "button button-small button-primary",
                            handler: function() {
                                _self._successCall()
                            }
                        }, {
                            xclass: "bar-item-button",
                            text: "取消",
                            btnCls: "button button-small last",
                            handler: function() {
                                var callback = _self.get("cancel");
                                callback && callback.call(_self)
                            }
                        }]
                    })
                },
                _uiSetYear: function(v) {
                    this.get("yearPanel").set("year", v)
                },
                _uiSetMonth: function(v) {
                    this.get("monthPanel").setSelectedByField(v)
                }
            }, {
                ATTRS: {
                    footer: {},
                    align: {
                        value: {}
                    },
                    year: {},
                    success: {
                        value: function() {}
                    },
                    cancel: {
                        value: function() {}
                    },
                    width: {
                        value: 180
                    },
                    month: {},
                    yearPanel: {},
                    monthPanel: {}
                }
            }, {
                xclass: "monthpicker"
            });
        return monthPicker
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            PREFIX = BUI.prefix,
            Component = BUI.Component,
            CLS_TEXT_YEAR = "year-text",
            CLS_TEXT_MONTH = "month-text",
            CLS_ARROW = "x-datepicker-arrow",
            CLS_PREV = "x-datepicker-prev",
            CLS_NEXT = "x-datepicker-next",
            header = Component.Controller.extend({
                bindUI: function() {
                    var _self = this,
                        el = _self.get("el");
                    el.delegate("." + CLS_ARROW, "click", function(e) {
                        e.preventDefault();
                        var sender = $(e.currentTarget);
                        sender.hasClass(CLS_NEXT) ? _self.nextMonth() : sender.hasClass(CLS_PREV) && _self.prevMonth()
                    }), el.delegate(".x-datepicker-month", "click", function() {
                        _self.fire("headerclick")
                    })
                },
                setMonth: function(year, month) {
                    var _self = this,
                        curYear = _self.get("year"),
                        curMonth = _self.get("month");
                    year === curYear && month === curMonth || (_self.set("year", year), _self.set("month", month), _self.fire("monthchange", {
                        year: year,
                        month: month
                    }))
                },
                nextMonth: function() {
                    var _self = this,
                        date = new Date(_self.get("year"), _self.get("month") + 1);
                    _self.setMonth(date.getFullYear(), date.getMonth())
                },
                prevMonth: function() {
                    var _self = this,
                        date = new Date(_self.get("year"), _self.get("month") - 1);
                    _self.setMonth(date.getFullYear(), date.getMonth())
                },
                _uiSetYear: function(v) {
                    var _self = this;
                    _self.get("el").find("." + CLS_TEXT_YEAR).text(v)
                },
                _uiSetMonth: function(v) {
                    var _self = this;
                    _self.get("el").find("." + CLS_TEXT_MONTH).text(v + 1)
                }
            }, {
                ATTRS: {
                    year: {
                        sync: !1
                    },
                    month: {
                        sync: !1,
                        setter: function(v) {
                            this.set("monthText", v + 1)
                        }
                    },
                    monthText: {},
                    tpl: {
                        view: !0,
                        value: '<div class="' + CLS_ARROW + " " + CLS_PREV + '"><span class="icon icon-white icon-caret  icon-caret-left"></span></div><div class="x-datepicker-month"><div class="month-text-container"><span><span class="year-text">{year}</span>年 <span class="month-text">{monthText}</span>月</span><span class="' + PREFIX + "caret " + PREFIX + 'caret-down"></span></div></div><div class="' + CLS_ARROW + " " + CLS_NEXT + '"><span class="icon icon-white icon-caret  icon-caret-right"></span></div>'
                    },
                    elCls: {
                        view: !0,
                        value: "x-datepicker-header"
                    },
                    events: {
                        value: {
                            monthchange: !0
                        }
                    }
                }
            }, {
                xclass: "calendar-header"
            });
        return header
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Component = BUI.Component,
            DateUtil = BUI.Date,
            CLS_DATE = "x-datepicker-date",
            CLS_TODAY = "x-datepicker-today",
            CLS_DISABLED = "x-datepicker-disabled",
            DATE_MASK = "isoDate",
            CLS_SELECTED = "x-datepicker-selected",
            SHOW_WEEKS = 6,
            dateTypes = {
                deactive: "prevday",
                active: "active",
                disabled: "disabled"
            },
            weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            panelView = Component.View.extend({
                renderUI: function() {
                    this.updatePanel()
                },
                updatePanel: function() {
                    var _self = this,
                        el = _self.get("el"),
                        bodyEl = el.find("tbody"),
                        innerTem = _self._getPanelInnerTpl();
                    bodyEl.empty(), $(innerTem).appendTo(bodyEl)
                },
                _getPanelInnerTpl: function() {
                    for (var _self = this, startDate = _self._getFirstDate(), temps = [], i = 0; i < SHOW_WEEKS; i++) {
                        var weekStart = DateUtil.addWeek(i, startDate);
                        temps.push(_self._getWeekTpl(weekStart))
                    }
                    return temps.join("")
                },
                _getWeekTpl: function(startDate) {
                    for (var _self = this, weekTpl = _self.get("weekTpl"), daysTemps = [], i = 0; i < weekDays.length; i++) {
                        var date = DateUtil.addDay(i, startDate);
                        daysTemps.push(_self._getDayTpl(date))
                    }
                    return BUI.substitute(weekTpl, {
                        daysTpl: daysTemps.join("")
                    })
                },
                _getDayTpl: function(date) {
                    var _self = this,
                        dayTpl = _self.get("dayTpl"),
                        day = date.getDay(),
                        todayCls = _self._isToday(date) ? CLS_TODAY : "",
                        dayOfWeek = weekDays[day],
                        dateNumber = date.getDate(),
                        dateType = _self._isInRange(date) ? _self._isCurrentMonth(date) ? dateTypes.active : dateTypes.deactive : dateTypes.disabled;
                    return BUI.substitute(dayTpl, {
                        dayOfWeek: dayOfWeek,
                        dateType: dateType,
                        dateNumber: dateNumber,
                        todayCls: todayCls,
                        date: DateUtil.format(date, DATE_MASK)
                    })
                },
                _getFirstDate: function(year, month) {
                    var _self = this,
                        monthFirstDate = _self._getMonthFirstDate(year, month),
                        day = monthFirstDate.getDay();
                    return DateUtil.addDay(day * -1, monthFirstDate)
                },
                _getMonthFirstDate: function(year, month) {
                    var _self = this,
                        year = year || _self.get("year"),
                        month = month || _self.get("month");
                    return new Date(year, month)
                },
                _isCurrentMonth: function(date) {
                    return date.getMonth() === this.get("month")
                },
                _isToday: function(date) {
                    var tody = new Date;
                    return tody.getFullYear() === date.getFullYear() && tody.getMonth() === date.getMonth() && tody.getDate() === date.getDate()
                },
                _isInRange: function(date) {
                    var _self = this,
                        maxDate = _self.get("maxDate"),
                        minDate = _self.get("minDate");
                    return !(minDate && date < minDate) && !(maxDate && date > maxDate)
                },
                _clearSelectedDate: function() {
                    var _self = this;
                    _self.get("el").find("." + CLS_SELECTED).removeClass(CLS_SELECTED)
                },
                _findDateElement: function(date) {
                    var _self = this,
                        dateStr = DateUtil.format(date, DATE_MASK),
                        activeList = _self.get("el").find("." + CLS_DATE),
                        result = null;
                    return dateStr && activeList.each(function(index, item) {
                        if ($(item).attr("title") === dateStr) return result = $(item), !1
                    }), result
                },
                _setSelectedDate: function(date) {
                    var _self = this,
                        dateEl = _self._findDateElement(date);
                    _self._clearSelectedDate(), dateEl && dateEl.addClass(CLS_SELECTED)
                }
            }, {
                ATTRS: {}
            }),
            panel = Component.Controller.extend({
                initializer: function() {
                    var _self = this,
                        now = new Date;
                    _self.get("year") || _self.set("year", now.getFullYear()), _self.get("month") || _self.set("month", now.getMonth())
                },
                bindUI: function() {
                    var _self = this,
                        el = _self.get("el");
                    el.delegate("." + CLS_DATE, "click", function(e) {
                        e.preventDefault()
                    }), el.delegate("." + CLS_DISABLED, "mouseup", function(e) {
                        e.stopPropagation()
                    })
                },
                performActionInternal: function(ev) {
                    var _self = this,
                        sender = $(ev.target).closest("." + CLS_DATE);
                    if (sender) {
                        var date = sender.attr("title");
                        date && (date = DateUtil.parse(date), _self.get("view")._isInRange(date) && _self.set("selected", date))
                    }
                },
                setMonth: function(year, month) {
                    var _self = this,
                        curYear = _self.get("year"),
                        curMonth = _self.get("month");
                    year === curYear && month === curMonth || (_self.set("year", year), _self.set("month", month), _self.get("view").updatePanel())
                },
                _uiSetSelected: function(date, ev) {
                    var _self = this;
                    ev && ev.prevVal && DateUtil.isDateEquals(date, ev.prevVal) || (_self.setMonth(date.getFullYear(), date.getMonth()), _self.get("view")._setSelectedDate(date), _self.fire("selectedchange", {
                        date: date
                    }))
                },
                _uiSetMaxDate: function(v) {
                    v && this.get("view").updatePanel()
                },
                _uiSetMinDate: function(v) {
                    v && this.get("view").updatePanel()
                }
            }, {
                ATTRS: {
                    year: {
                        view: !0
                    },
                    month: {
                        view: !0
                    },
                    selected: {},
                    focusable: {
                        value: !0
                    },
                    dayTpl: {
                        view: !0,
                        value: '<td class="x-datepicker-date x-datepicker-{dateType} {todayCls} day-{dayOfWeek}" title="{date}"><a href="#" hidefocus="on" tabindex="1"><em><span>{dateNumber}</span></em></a></td>'
                    },
                    events: {
                        value: {
                            click: !1,
                            selectedchange: !0
                        }
                    },
                    maxDate: {
                        view: !0,
                        setter: function(val) {
                            if (val) return BUI.isString(val) ? DateUtil.parse(val) : val
                        }
                    },
                    minDate: {
                        view: !0,
                        setter: function(val) {
                            if (val) return BUI.isString(val) ? DateUtil.parse(val) : val
                        }
                    },
                    weekTpl: {
                        view: !0,
                        value: "<tr>{daysTpl}</tr>"
                    },
                    tpl: {
                        view: !0,
                        value: '<table class="x-datepicker-inner" cellspacing="0"><thead><tr><th  title="Sunday"><span>日</span></th><th  title="Monday"><span>一</span></th><th  title="Tuesday"><span>二</span></th><th  title="Wednesday"><span>三</span></th><th  title="Thursday"><span>四</span></th><th  title="Friday"><span>五</span></th><th  title="Saturday"><span>六</span></th></tr></thead><tbody class="x-datepicker-body"></tbody></table>'
                    },
                    xview: {
                        value: panelView
                    }
                }
            }, {
                xclass: "calendar-panel",
                priority: 0
            });
        return panel
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function today() {
            var now = new Date;
            return new Date(now.getFullYear(), now.getMonth(), now.getDate())
        }

        function fixedNumber(n) {
            return n < 10 ? "0" + n : n.toString()
        }

        function getNumberItems(end) {
            for (var items = [], i = 0; i < end; i++) items.push({
                text: fixedNumber(i),
                value: fixedNumber(i)
            });
            return items
        }

        function setTimeUnit(self, cls, val) {
            var inputEl = self.get("el").find("." + cls);
            BUI.isNumber(val) && (val = fixedNumber(val)), inputEl.val(val)
        }
        var BUI = require("bui/common"),
            PREFIX = BUI.prefix,
            CLS_PICKER_TIME = "x-datepicker-time",
            CLS_PICKER_HOUR = "x-datepicker-hour",
            CLS_PICKER_MINUTE = "x-datepicker-minute",
            CLS_PICKER_SECOND = "x-datepicker-second",
            CLS_TIME_PICKER = "x-timepicker",
            Picker = require("bui/picker").ListPicker,
            MonthPicker = require("bui/calendar/monthpicker"),
            Header = require("bui/calendar/header"),
            Panel = require("bui/calendar/panel"),
            Toolbar = require("bui/toolbar"),
            Component = BUI.Component,
            DateUtil = BUI.Date,
            calendar = Component.Controller.extend({
                initializer: function() {
                    var _self = this,
                        children = _self.get("children"),
                        header = new Header,
                        panel = new Panel,
                        footer = _self.get("footer") || _self._createFooter();
                    children.push(header), children.push(panel), children.push(footer), _self.set("header", header), _self.set("panel", panel), _self.set("footer", footer)
                },
                renderUI: function() {
                    var _self = this,
                        children = _self.get("children");
                    if (_self.get("showTime")) {
                        var timepicker = _self.get("timepicker") || _self._initTimePicker();
                        children.push(timepicker), _self.set("timepicker", timepicker)
                    }
                },
                bindUI: function() {
                    var _self = this,
                        header = _self.get("header"),
                        panel = _self.get("panel");
                    panel.on("selectedchange", function(e) {
                        var date = e.date;
                        DateUtil.isDateEquals(date, _self.get("selectedDate")) || _self.set("selectedDate", date)
                    }), _self.get("showTime") ? _self._initTimePickerEvent() : panel.on("click", function() {
                        _self.fire("accept")
                    }), header.on("monthchange", function(e) {
                        _self._setYearMonth(e.year, e.month)
                    }), header.on("headerclick", function() {
                        var monthPicker = _self.get("monthpicker") || _self._createMonthPicker();
                        monthPicker.set("year", header.get("year")), monthPicker.set("month", header.get("month")), monthPicker.show()
                    })
                },
                _initTimePicker: function() {
                    var _self = this,
                        lockTime = _self.get("lockTime"),
                        _timePickerEnum = {
                            hour: CLS_PICKER_HOUR,
                            minute: CLS_PICKER_MINUTE,
                            second: CLS_PICKER_SECOND
                        };
                    if (lockTime)
                        for (var key in lockTime) {
                            var noCls = _timePickerEnum[key.toLowerCase()];
                            _self.set(key, lockTime[key]), _self.get("el").find("." + noCls).attr("disabled", "")
                        }
                    var picker = new Picker({
                        elCls: CLS_TIME_PICKER,
                        children: [{
                            itemTpl: '<li><a href="#">{text}</a></li>'
                        }],
                        autoAlign: !1,
                        align: {
                            node: _self.get("el"),
                            points: ["bl", "bl"],
                            offset: [0, -30]
                        },
                        trigger: _self.get("el").find("." + CLS_PICKER_TIME)
                    });
                    return picker.render(), _self._initTimePickerEvent(picker), picker
                },
                _initTimePickerEvent: function(picker) {
                    var _self = this,
                        picker = _self.get("timepicker");
                    picker && (picker.get("el").delegate("a", "click", function(ev) {
                        ev.preventDefault()
                    }), picker.on("triggerchange", function(ev) {
                        var curTrigger = ev.curTrigger;
                        curTrigger.hasClass(CLS_PICKER_HOUR) ? picker.get("list").set("items", getNumberItems(24)) : picker.get("list").set("items", getNumberItems(60))
                    }), picker.on("selectedchange", function(ev) {
                        var curTrigger = ev.curTrigger,
                            val = ev.value;
                        curTrigger.hasClass(CLS_PICKER_HOUR) ? _self.setInternal("hour", val) : curTrigger.hasClass(CLS_PICKER_MINUTE) ? _self.setInternal("minute", val) : _self.setInternal("second", val)
                    }))
                },
                _setYearMonth: function(year, month) {
                    var _self = this,
                        selectedDate = _self.get("selectedDate"),
                        date = selectedDate.getDate();
                    year === selectedDate.getFullYear() && month === selectedDate.getMonth() || _self.set("selectedDate", new Date(year, month, date))
                },
                _createMonthPicker: function() {
                    var monthpicker, _self = this;
                    return monthpicker = new MonthPicker({
                        render: _self.get("el"),
                        effect: {
                            effect: "slide",
                            duration: 300
                        },
                        visibleMode: "display",
                        success: function() {
                            var picker = this;
                            _self._setYearMonth(picker.get("year"), picker.get("month")), picker.hide()
                        },
                        cancel: function() {
                            this.hide()
                        }
                    }), _self.set("monthpicker", monthpicker), _self.get("children").push(monthpicker), monthpicker
                },
                _createFooter: function() {
                    var _self = this,
                        showTime = this.get("showTime"),
                        items = [];
                    return showTime ? (items.push({
                        content: _self.get("timeTpl")
                    }), items.push({
                        xclass: "bar-item-button",
                        text: "确定",
                        btnCls: "button button-small button-primary",
                        listeners: {
                            click: function() {
                                _self.fire("accept")
                            }
                        }
                    })) : items.push({
                        xclass: "bar-item-button",
                        text: "今天",
                        btnCls: "button button-small",
                        id: "todayBtn",
                        listeners: {
                            click: function() {
                                var day = today();
                                _self.set("selectedDate", day), _self.fire("accept")
                            }
                        }
                    }), new Toolbar.Bar({
                        elCls: PREFIX + "calendar-footer",
                        children: items
                    })
                },
                _updateTodayBtnAble: function() {
                    var _self = this;
                    if (!_self.get("showTime")) {
                        var footer = _self.get("footer"),
                            panelView = _self.get("panel").get("view"),
                            now = today(),
                            btn = footer.getItem("todayBtn");
                        panelView._isInRange(now) ? btn.enable() : btn.disable()
                    }
                },
                _uiSetSelectedDate: function(v) {
                    var _self = this,
                        year = v.getFullYear(),
                        month = v.getMonth();
                    _self.get("header").setMonth(year, month), _self.get("panel").set("selected", v), _self.fire("datechange", {
                        date: v
                    })
                },
                _uiSetHour: function(v) {
                    setTimeUnit(this, CLS_PICKER_HOUR, v)
                },
                _uiSetMinute: function(v) {
                    setTimeUnit(this, CLS_PICKER_MINUTE, v)
                },
                _uiSetSecond: function(v) {
                    setTimeUnit(this, CLS_PICKER_SECOND, v)
                },
                _uiSetMaxDate: function(v) {
                    var _self = this;
                    _self.get("panel").set("maxDate", v), _self._updateTodayBtnAble()
                },
                _uiSetMinDate: function(v) {
                    var _self = this;
                    _self.get("panel").set("minDate", v), _self._updateTodayBtnAble()
                }
            }, {
                ATTRS: {
                    header: {},
                    panel: {},
                    maxDate: {},
                    minDate: {},
                    monthPicker: {},
                    timepicker: {},
                    width: {
                        value: 180
                    },
                    events: {
                        value: {
                            click: !1,
                            accept: !1,
                            datechange: !1,
                            monthchange: !1
                        }
                    },
                    showTime: {
                        value: !1
                    },
                    lockTime: {},
                    timeTpl: {
                        value: '<input type="text" readonly class="' + CLS_PICKER_TIME + " " + CLS_PICKER_HOUR + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + " " + CLS_PICKER_MINUTE + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + " " + CLS_PICKER_SECOND + '" />'
                    },
                    selectedDate: {
                        value: today()
                    },
                    hour: {
                        value: (new Date).getHours()
                    },
                    minute: {
                        value: (new Date).getMinutes()
                    },
                    second: {
                        value: 0
                    }
                }
            }, {
                xclass: "calendar",
                priority: 0
            });
        return calendar
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Picker = require("bui/picker").Picker,
            Calendar = require("bui/calendar/calendar"),
            DateUtil = BUI.Date,
            datepicker = Picker.extend({
                initializer: function() {},
                createControl: function() {
                    var _self = this,
                        children = _self.get("children"),
                        calendar = new Calendar({
                            render: _self.get("el"),
                            showTime: _self.get("showTime"),
                            lockTime: _self.get("lockTime"),
                            minDate: _self.get("minDate"),
                            maxDate: _self.get("maxDate"),
                            autoRender: !0
                        });
                    return _self.get("dateMask") || (_self.get("showTime") ? _self.set("dateMask", "yyyy-mm-dd HH:MM:ss") : _self.set("dateMask", "yyyy-mm-dd")), children.push(calendar), _self.set("calendar", calendar), calendar
                },
                setSelectedValue: function(val) {
                    if (this.get("calendar")) {
                        var _self = this,
                            calendar = this.get("calendar"),
                            date = DateUtil.parse(val, _self.get("dateMask"));
                        if (date = date || new Date((new Date).setSeconds(0)), calendar.set("selectedDate", DateUtil.getDate(date)), _self.get("showTime")) {
                            var lockTime = this.get("lockTime"),
                                hour = lockTime && lockTime.hour ? lockTime.hour : date.getHours(),
                                minute = lockTime && lockTime.minute ? lockTime.minute : date.getMinutes(),
                                second = lockTime && lockTime.second ? lockTime.second : date.getSeconds();
                            calendar.set("hour", hour), calendar.set("minute", minute), calendar.set("second", second)
                        }
                    }
                },
                getSelectedValue: function() {
                    if (!this.get("calendar")) return null;
                    var _self = this,
                        calendar = _self.get("calendar"),
                        date = DateUtil.getDate(calendar.get("selectedDate"));
                    return _self.get("showTime") && (date = DateUtil.addHour(calendar.get("hour"), date), date = DateUtil.addMinute(calendar.get("minute"), date), date = DateUtil.addSecond(calendar.get("second"), date)), date
                },
                getSelectedText: function() {
                    return this.get("calendar") ? DateUtil.format(this.getSelectedValue(), this._getFormatType()) : ""
                },
                _getFormatType: function() {
                    return this.get("dateMask")
                },
                _uiSetMaxDate: function(v) {
                    if (!this.get("calendar")) return null;
                    var _self = this;
                    _self.get("calendar").set("maxDate", v)
                },
                _uiSetMinDate: function(v) {
                    if (!this.get("calendar")) return null;
                    var _self = this;
                    _self.get("calendar").set("minDate", v)
                }
            }, {
                ATTRS: {
                    showTime: {
                        value: !1
                    },
                    lockTime: {},
                    maxDate: {},
                    minDate: {},
                    dateMask: {},
                    changeEvent: {
                        value: "accept"
                    },
                    hideEvent: {
                        value: "accept"
                    },
                    calendar: {}
                }
            }, {
                xclass: "datepicker",
                priority: 0
            });
        return datepicker
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Editor = (require("bui/form"), BUI.namespace("Editor"));
        return BUI.mix(Editor, {
            Editor: require("bui/editor/editor"),
            RecordEditor: require("bui/editor/record"),
            DialogEditor: require("bui/editor/dialog")
        }), Editor
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function initEditor(self) {
            var _self = self,
                controlCfgField = _self.get("controlCfgField"),
                control = _self.get(controlCfgField),
                c = _self.addChild(control);
            _self.setInternal(controlCfgField, c)
        }
        var Mixin = function() {
            initEditor(this)
        };
        return Mixin.ATTRS = {
            acceptEvent: {
                value: "autohide"
            },
            preventHide: {
                value: !0
            },
            changeSourceEvent: {
                value: "show triggerchange"
            },
            ignoreInputFields: {
                value: !0
            },
            innerValueField: {},
            emptyValue: {},
            controlCfgField: {},
            focusable: {
                value: !0
            },
            autoUpdate: {
                value: !0
            },
            events: {
                value: {
                    accept: !1,
                    cancel: !1
                }
            }
        }, Mixin.prototype = {
            __bindUI: function() {
                var _self = this,
                    acceptEvent = _self.get("acceptEvent"),
                    changeSourceEvent = _self.get("changeSourceEvent");
                acceptEvent && _self.on(acceptEvent, function() {
                    if (!_self.accept()) return !_self.get("preventHide") && void _self.cancel()
                }), changeSourceEvent && _self.on(changeSourceEvent, function() {
                    _self.setValue(_self.getSourceValue()), _self.get("visible") && _self.focus()
                })
            },
            getInnerControl: function() {
                var _self = this,
                    children = _self.get("children");
                return children[0]
            },
            setValue: function(value, hideError) {
                var _self = this,
                    innerControl = _self.getInnerControl();
                _self.set("editValue", value), _self.clearControlValue(), innerControl.set(_self.get("innerValueField"), value), value || _self.valid(), hideError && _self.clearErrors()
            },
            getValue: function() {
                var _self = this,
                    innerControl = _self.getInnerControl();
                return innerControl.get(_self.get("innerValueField"))
            },
            isValid: function() {
                var _self = this,
                    innerControl = _self.getInnerControl();
                return !innerControl.isValid || innerControl.isValid()
            },
            valid: function() {
                var _self = this,
                    innerControl = _self.getInnerControl();
                innerControl.valid && innerControl.valid()
            },
            getErrors: function() {
                var _self = this,
                    innerControl = _self.getInnerControl();
                return innerControl.getErrors ? innerControl.getErrors() : []
            },
            isChange: function() {
                var _self = this,
                    editValue = _self.get("editValue"),
                    value = _self.getValue();
                return editValue !== value
            },
            clearValue: function() {
                this.clearControlValue(), this.clearErrors()
            },
            clearControlValue: function() {
                var _self = this,
                    innerControl = _self.getInnerControl();
                innerControl.set(_self.get("innerValueField"), _self.get("emptyValue"))
            },
            clearErrors: function() {
                var _self = this,
                    innerControl = _self.getInnerControl();
                innerControl.clearErrors()
            },
            getSourceValue: function() {},
            updateSource: function() {},
            handleNavEsc: function() {
                this.cancel()
            },
            handleNavEnter: function(ev) {
                var sender = ev.target;
                "TEXTAREA" !== sender.tagName && ("BUTTON" === sender.tagName && $(sender).trigger("click"), this.accept())
            },
            focus: function() {
                var _self = this,
                    innerControl = _self.getInnerControl();
                innerControl.focus && innerControl.focus()
            },
            accept: function() {
                var value, _self = this;
                return _self.valid(), !!_self.isValid() && (value = _self.getValue(), _self.get("autoUpdate") && _self.updateSource(value), 0 != _self.fire("beforeaccept", {
                    value: value
                }) ? (_self.fire("accept", {
                    value: value,
                    editValue: _self.get("editValue")
                }), _self.hide(), !0) : void 0)
            },
            cancel: function() {
                this.fire("cancel"), this.clearValue(), this.close()
            }
        }, Mixin
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Overlay = require("bui/overlay").Overlay;
        CLS_TIPS = "x-editor-tips", Mixin = require("bui/editor/mixin");
        var editor = Overlay.extend([Mixin], {
            bindUI: function() {
                var _self = this;
                _self.getInnerControl();
                _self.on("validchange", function(ev) {
                    !_self.isValid() && _self.get("visible") ? _self._showError(_self.getErrors()) : _self._hideError()
                }), _self.on("hide", function() {
                    _self._hideError()
                }), _self.on("show", function() {
                    _self.isValid() || _self._showError(_self.getErrors())
                })
            },
            _initOverlay: function() {
                var _self = this,
                    tooltip = _self.get("tooltip"),
                    overlay = new Overlay(tooltip);
                return overlay.render(), _self.set("overlay", overlay), overlay
            },
            _getErrorList: function() {
                var _self = this,
                    overlay = _self.get("overlay");
                return overlay && overlay.get("children")[0]
            },
            _showError: function(errors) {
                var _self = this,
                    overlay = _self.get("overlay") || _self._initOverlay(),
                    list = _self._getErrorList(),
                    align = _self.get("errorAlign"),
                    items = BUI.Array.map(errors, function(text) {
                        return {
                            error: text
                        }
                    });
                list.set("items", items), align.node = _self.get("el"), overlay.set("align", align), overlay.show()
            },
            _hideError: function() {
                var _self = this,
                    overlay = _self.get("overlay");
                overlay && overlay.hide()
            },
            getSourceValue: function() {
                var _self = this,
                    trigger = _self.get("curTrigger"),
                    parser = _self.get("parser"),
                    text = trigger.text();
                return parser && (text = parser.call(this, text, trigger)), text
            },
            updateSource: function(text) {
                var _self = this,
                    trigger = _self.get("curTrigger");
                trigger && trigger.length && (text = _self._formatText(text), trigger.text(text))
            },
            _formatText: function(text) {
                var _self = this,
                    formatter = _self.get("formatter");
                return formatter && (text = formatter.call(_self, text)), text
            },
            _uiSetWidth: function(v) {
                var _self = this;
                if (null != v) {
                    var innerControl = _self.getInnerControl();
                    innerControl.set && innerControl.set("width", v)
                }
            }
        }, {
            ATTRS: {
                innerValueField: {
                    value: "value"
                },
                emptyValue: {
                    value: ""
                },
                autoHide: {
                    value: !0
                },
                controlCfgField: {
                    value: "field"
                },
                defaultChildCfg: {
                    value: {
                        tpl: "",
                        forceFit: !0,
                        errorTpl: ""
                    }
                },
                tooltip: {
                    valueFn: function() {
                        return {
                            children: [{
                                xclass: "simple-list",
                                itemTpl: '<li><span class="x-icon x-icon-mini x-icon-error" title="{error}">!</span>&nbsp;<span>{error}</span></li>'
                            }],
                            elCls: CLS_TIPS
                        }
                    }
                },
                defaultChildClass: {
                    value: "form-field"
                },
                align: {
                    value: {
                        points: ["tl", "tl"]
                    }
                },
                parser: {},
                formatter: {},
                errorAlign: {
                    value: {
                        points: ["bl", "tl"],
                        offset: [0, 10]
                    }
                },
                overlay: {},
                field: {
                    value: {}
                }
            }
        }, {
            xclass: "editor"
        });
        return editor
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Editor = require("bui/editor/editor"),
            editor = Editor.extend({
                getSourceValue: function() {
                    return this.get("record")
                },
                updateSource: function(value) {
                    var _self = this,
                        record = _self.get("record");
                    BUI.mix(record, value)
                },
                _uiSetRecord: function(v) {
                    this.setValue(v)
                }
            }, {
                ATTRS: {
                    innerValueField: {
                        value: "record"
                    },
                    acceptEvent: {
                        value: ""
                    },
                    emptyValue: {
                        value: {}
                    },
                    autoHide: {
                        value: !1
                    },
                    record: {
                        value: {}
                    },
                    controlCfgField: {
                        value: "form"
                    },
                    form: {
                        value: {}
                    },
                    errorAlign: {
                        value: {
                            points: ["tr", "tl"],
                            offset: [10, 0]
                        }
                    },
                    defaultChildCfg: {
                        valueFn: function() {
                            var _self = this;
                            return {
                                xclass: "form",
                                errorTpl: "",
                                showError: !0,
                                showChildError: !0,
                                defaultChildCfg: {
                                    elCls: "bui-inline-block",
                                    tpl: "",
                                    forceFit: !0
                                },
                                buttons: [{
                                    btnCls: "button button-primary",
                                    text: "确定",
                                    handler: function() {
                                        _self.accept()
                                    }
                                }, {
                                    btnCls: "button",
                                    text: "取消",
                                    handler: function() {
                                        _self.cancel()
                                    }
                                }]
                            }
                        }
                    }
                }
            }, {
                xclass: "record-editor"
            });
        return editor
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Dialog = require("bui/overlay").Dialog,
            Mixin = require("bui/editor/mixin"),
            editor = Dialog.extend([Mixin], {
                getSourceValue: function() {
                    return this.get("record")
                },
                handleNavEnter: function(ev) {
                    var _self = this,
                        success = _self.get("success"),
                        sender = ev.target;
                    "TEXTAREA" !== sender.tagName && ("BUTTON" === sender.tagName && $(sender).trigger("click"), success ? success.call(_self) : this.accept())
                },
                cancel: function() {
                    this.fire("cancel"), this.clearValue(), this.close()
                },
                updateSource: function(value) {
                    var _self = this,
                        record = _self.get("record");
                    BUI.mix(record, value)
                },
                _uiSetRecord: function(v) {
                    this.setValue(v)
                }
            }, {
                ATTRS: {
                    innerValueField: {
                        value: "record"
                    },
                    acceptEvent: {
                        value: ""
                    },
                    record: {
                        value: {}
                    },
                    emptyValue: {
                        shared: !1,
                        value: {}
                    },
                    controlCfgField: {
                        value: "form"
                    },
                    changeSourceEvent: {
                        value: ""
                    },
                    defaultChildCfg: {
                        value: {
                            xclass: "form-horizontal"
                        }
                    },
                    focusable: {
                        value: !1
                    },
                    success: {
                        value: function() {
                            this.accept()
                        }
                    },
                    cancel: {
                        value: function() {
                            this.cancel()
                        }
                    },
                    form: {
                        value: {}
                    }
                }
            }, {
                xclass: "dialog-editor"
            });
        return editor
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Grid = BUI.namespace("Grid");
        return BUI.mix(Grid, {
            SimpleGrid: require("bui/grid/simplegrid"),
            Grid: require("bui/grid/grid"),
            Column: require("bui/grid/column"),
            Header: require("bui/grid/header"),
            Format: require("bui/grid/format"),
            Plugins: require("bui/grid/plugins")
        }), Grid
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            List = require("bui/list"),
            Component = BUI.Component,
            PREFIX = (Component.UIBase, BUI.prefix),
            CLS_GRID = PREFIX + "grid",
            CLS_GRID_ROW = CLS_GRID + "-row",
            CLS_ROW_ODD = PREFIX + "grid-row-odd",
            CLS_ROW_EVEN = PREFIX + "grid-row-even",
            CLS_GRID_BORDER = PREFIX + "grid-border",
            simpleGridView = List.SimpleListView.extend({
                setColumns: function(columns) {
                    var _self = this,
                        headerRowEl = _self.get("headerRowEl");
                    columns = columns || _self.get("columns"), headerRowEl.empty(), BUI.each(columns, function(column) {
                        _self._createColumn(column, headerRowEl)
                    })
                },
                _createColumn: function(column, parent) {
                    var _self = this,
                        columnTpl = BUI.substitute(_self.get("columnTpl"), column);
                    $(columnTpl).appendTo(parent)
                },
                getItemTpl: function(record, index) {
                    var _self = this,
                        columns = _self.get("columns"),
                        rowTpl = _self.get("rowTpl"),
                        oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN,
                        cellsTpl = [];
                    return BUI.each(columns, function(column) {
                        var dataIndex = column.dataIndex;
                        cellsTpl.push(_self._getCellTpl(column, dataIndex, record))
                    }), rowTpl = BUI.substitute(rowTpl, {
                        cellsTpl: cellsTpl.join(""),
                        oddCls: oddCls
                    })
                },
                _getCellTpl: function(column, dataIndex, record) {
                    var _self = this,
                        renderer = column.renderer,
                        text = renderer ? renderer(record[dataIndex], record) : record[dataIndex],
                        cellTpl = _self.get("cellTpl");
                    return BUI.substitute(cellTpl, {
                        elCls: column.elCls,
                        text: text
                    })
                },
                clearData: function() {
                    var _self = this,
                        tbodyEl = _self.get("itemContainer");
                    tbodyEl.empty()
                },
                showData: function(data) {
                    var _self = this;
                    BUI.each(data, function(record, index) {
                        _self._createRow(record, index)
                    })
                },
                _uiSetInnerBorder: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    v ? el.addClass(CLS_GRID_BORDER) : el.removeClass(CLS_GRID_BORDER)
                },
                _uiSetTableCls: function(v) {
                    var _self = this,
                        tableEl = _self.get("el").find("table");
                    tableEl.attr("class", v)
                }
            }, {
                ATTRS: {
                    headerRowEl: {
                        valueFn: function() {
                            var _self = this,
                                thead = _self.get("el").find("thead");
                            return thead.children("tr")
                        }
                    },
                    itemContainer: {
                        valueFn: function() {
                            return this.get("el").find("tbody")
                        }
                    },
                    tableCls: {}
                }
            }, {
                xclass: "simple-grid-veiw"
            }),
            simpleGrid = BUI.List.SimpleList.extend({
                renderUI: function() {
                    this.get("view").setColumns()
                },
                bindUI: function() {
                    var _self = this,
                        itemCls = _self.get("itemCls"),
                        hoverCls = itemCls + "-hover",
                        el = _self.get("el");
                    el.delegate("." + itemCls, "mouseover", function(ev) {
                        var sender = $(ev.currentTarget);
                        sender.addClass(hoverCls)
                    }).delegate("." + itemCls, "mouseout", function(ev) {
                        var sender = $(ev.currentTarget);
                        sender.removeClass(hoverCls)
                    })
                },
                showData: function(data) {
                    this.clearData(), this.set("items", data)
                },
                clearData: function() {
                    this.get("view").clearData()
                },
                _uiSetColumns: function(columns) {
                    var _self = this;
                    _self.clearData(), _self.get("view").setColumns(columns)
                }
            }, {
                ATTRS: {
                    itemCls: {
                        view: !0,
                        value: CLS_GRID_ROW
                    },
                    tableCls: {
                        view: !0,
                        value: CLS_GRID + "-table"
                    },
                    columns: {
                        view: !0,
                        sync: !1,
                        value: []
                    },
                    tpl: {
                        view: !0,
                        value: '<table cellspacing="0" class="{tableCls}" cellpadding="0"><thead><tr></tr></thead><tbody></tbody></table>'
                    },
                    innerBorder: {
                        view: !0,
                        value: !0
                    },
                    rowTpl: {
                        view: !0,
                        value: '<tr class="' + CLS_GRID_ROW + ' {oddCls}">{cellsTpl}</tr>'
                    },
                    cellTpl: {
                        view: !0,
                        value: '<td class="' + CLS_GRID + '-cell {elCls}"><div class="' + CLS_GRID + '-cell-inner"><span class="' + CLS_GRID + '-cell-text">{text}</span></div></td>'
                    },
                    columnTpl: {
                        view: !0,
                        value: '<th class="' + CLS_GRID + '-hd {elCls}" width="{width}"><div class="' + CLS_GRID + '-hd-inner"><span class="' + CLS_GRID + '-hd-title">{title}</span></div></th>'
                    },
                    events: {
                        value: {}
                    },
                    xview: {
                        value: simpleGridView
                    }
                }
            }, {
                xclass: "simple-grid"
            });
        return simpleGrid.View = simpleGridView, simpleGrid
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            PREFIX = BUI.prefix,
            CLS_HD_TITLE = PREFIX + "grid-hd-title",
            CLS_OPEN = PREFIX + "grid-hd-open",
            SORT_PREFIX = "sort-",
            SORT_ASC = "ASC",
            SORT_DESC = "DESC",
            CLS_TRIGGER = PREFIX + "grid-hd-menu-trigger",
            CLS_HD_TRIGGER = "grid-hd-menu-trigger",
            columnView = BUI.Component.View.extend({
                setTplContent: function(attrs) {
                    var titleEl, _self = this,
                        sortTpl = _self.get("sortTpl"),
                        triggerTpl = _self.get("triggerTpl"),
                        el = _self.get("el");
                    columnView.superclass.setTplContent.call(_self, attrs), titleEl = el.find("." + CLS_HD_TITLE), $(sortTpl).insertAfter(titleEl), $(triggerTpl).insertAfter(titleEl)
                },
                _setContent: function() {
                    this.setTplContent()
                },
                _uiSetShowMenu: function(v) {
                    var _self = this,
                        triggerTpl = _self.get("triggerTpl"),
                        el = _self.get("el"),
                        titleEl = el.find("." + CLS_HD_TITLE);
                    v ? $(triggerTpl).insertAfter(titleEl) : el.find("." + CLS_TRIGGER).remove()
                },
                _uiSetTitle: function(title) {
                    this.get("rendered") && this._setContent()
                },
                _uiSetDraggable: function(v) {
                    this.get("rendered") && this._setContent()
                },
                _uiSetSortable: function(v) {
                    this.get("rendered") && this._setContent()
                },
                _uiSetTpl: function(v) {
                    this.get("rendered") && this._setContent()
                },
                _uiSetSortState: function(v) {
                    var _self = this,
                        el = _self.get("el"),
                        ascCls = SORT_PREFIX + "asc",
                        desCls = SORT_PREFIX + "desc";
                    el.removeClass(ascCls + " " + desCls), "ASC" === v ? el.addClass(ascCls) : "DESC" === v && el.addClass(desCls)
                },
                _uiSetOpen: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    v ? el.addClass(CLS_OPEN) : el.removeClass(CLS_OPEN)
                }
            }, {
                ATTRS: {
                    sortTpl: {
                        view: !0,
                        getter: function() {
                            var _self = this,
                                sortable = _self.get("sortable");
                            return sortable ? '<span class="' + PREFIX + 'grid-sort-icon">&nbsp;</span>' : ""
                        }
                    },
                    tpl: {}
                }
            }),
            column = BUI.Component.Controller.extend({
                _toggleSortState: function() {
                    var _self = this,
                        sortState = _self.get("sortState"),
                        v = sortState && sortState === SORT_ASC ? SORT_DESC : SORT_ASC;
                    _self.set("sortState", v)
                },
                performActionInternal: function(ev) {
                    var _self = this,
                        sender = $(ev.target),
                        prefix = _self.get("prefixCls");
                    sender.hasClass(prefix + CLS_HD_TRIGGER) || _self.get("sortable") && _self._toggleSortState()
                },
                _uiSetWidth: function(v) {
                    v && this.set("originWidth", v)
                }
            }, {
                ATTRS: {
                    elTagName: {
                        value: "th"
                    },
                    open: {
                        view: !0,
                        value: !1
                    },
                    dataIndex: {
                        view: !0,
                        value: ""
                    },
                    draggable: {
                        sync: !1,
                        view: !0,
                        value: !0
                    },
                    editor: {},
                    focusable: {
                        value: !1
                    },
                    fixed: {
                        value: !1
                    },
                    id: {},
                    renderer: {},
                    resizable: {
                        value: !0
                    },
                    sortable: {
                        sync: !1,
                        view: !0,
                        value: !0
                    },
                    sortState: {
                        view: !0,
                        value: null
                    },
                    title: {
                        sync: !1,
                        view: !0,
                        value: "&#160;"
                    },
                    width: {
                        value: 100
                    },
                    showMenu: {
                        view: !0,
                        value: !1
                    },
                    triggerTpl: {
                        view: !0,
                        value: '<span class="' + CLS_TRIGGER + '"></span>'
                    },
                    tpl: {
                        sync: !1,
                        view: !0,
                        value: '<div class="' + PREFIX + 'grid-hd-inner"><span class="' + CLS_HD_TITLE + '">{title}</span></div>'
                    },
                    cellTpl: {
                        value: ""
                    },
                    events: {
                        value: {
                            afterWidthChange: !0,
                            afterSortStateChange: !0,
                            afterVisibleChange: !0,
                            click: !0,
                            resize: !0,
                            move: !0
                        }
                    },
                    xview: {
                        value: columnView
                    }
                }
            }, {
                xclass: "grid-hd",
                priority: 1
            });
        return column.Empty = column.extend({}, {
            ATTRS: {
                type: {
                    value: "empty"
                },
                sortable: {
                    view: !0,
                    value: !1
                },
                width: {
                    view: !0,
                    value: null
                },
                tpl: {
                    view: !0,
                    value: '<div class="' + PREFIX + 'grid-hd-inner"></div>'
                }
            }
        }, {
            xclass: "grid-hd-empty",
            priority: 1
        }), column
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            PREFIX = BUI.prefix,
            Column = (BUI.namespace("Grid"), require("bui/grid/column")),
            View = BUI.Component.View,
            Controller = BUI.Component.Controller,
            CLS_SCROLL_WITH = 17,
            UA = BUI.UA,
            headerView = View.extend({
                getContentElement: function() {
                    return this.get("el").find("tr")
                },
                scrollTo: function(obj) {
                    var _self = this,
                        el = _self.get("el");
                    void 0 !== obj.top && el.scrollTop(obj.top), void 0 !== obj.left && el.scrollLeft(obj.left)
                },
                _uiSetTableCls: function(v) {
                    var _self = this,
                        tableEl = _self.get("el").find("table");
                    tableEl.attr("class", v)
                }
            }, {
                ATTRS: {
                    emptyCellEl: {},
                    tableCls: {}
                }
            }, {
                xclass: "header-view"
            }),
            header = Controller.extend({
                addColumn: function(c, index) {
                    var _self = this,
                        insertIndex = index,
                        columns = _self.get("columns");
                    return c = _self._createColumn(c), void 0 === index && (index = columns.length, insertIndex = _self.get("children").length - 1), columns.splice(index, 0, c), _self.addChild(c, insertIndex), _self.fire("add", {
                        column: c,
                        index: index
                    }), c
                },
                removeColumn: function(c) {
                    var index, _self = this,
                        columns = _self.get("columns");
                    return c = BUI.isNumber(c) ? columns[c] : c, index = BUI.Array.indexOf(c, columns), columns.splice(index, 1), _self.fire("remove", {
                        column: c,
                        index: index
                    }), _self.removeChild(c, !0)
                },
                bindUI: function() {
                    var _self = this;
                    _self._bindColumnsEvent()
                },
                initializer: function() {
                    var _self = this,
                        children = _self.get("children"),
                        columns = _self.get("columns"),
                        emptyColumn = _self._createEmptyColumn();
                    $.each(columns, function(index, item) {
                        var columnControl = _self._createColumn(item);
                        children[index] = columnControl, columns[index] = columnControl
                    }), children.push(emptyColumn), _self.set("emptyColumn", emptyColumn)
                },
                getColumns: function() {
                    return this.get("columns")
                },
                getColumnsWidth: function() {
                    var _self = this,
                        columns = _self.getColumns(),
                        totalWidth = 0;
                    return $.each(columns, function(index, column) {
                        column.get("visible") && (totalWidth += column.get("el").outerWidth())
                    }), totalWidth
                },
                getColumnOriginWidth: function() {
                    var _self = this,
                        columns = _self.getColumns(),
                        totalWidth = 0;
                    return $.each(columns, function(index, column) {
                        if (column.get("visible")) {
                            var width = column.get("originWidth") || column.get("width");
                            totalWidth += width
                        }
                    }), totalWidth
                },
                getColumnByIndex: function(index) {
                    var _self = this,
                        columns = _self.getColumns(),
                        result = columns[index];
                    return result
                },
                getColumn: function(func) {
                    var _self = this,
                        columns = _self.getColumns(),
                        result = null;
                    return $.each(columns, function(index, column) {
                        if (func(column)) return result = column, !1
                    }), result
                },
                getColumnById: function(id) {
                    var _self = this;
                    return _self.getColumn(function(column) {
                        return column.get("id") === id
                    })
                },
                getColumnIndex: function(column) {
                    var _self = this,
                        columns = _self.getColumns();
                    return BUI.Array.indexOf(column, columns)
                },
                scrollTo: function(obj) {
                    this.get("view").scrollTo(obj)
                },
                _bindColumnsEvent: function() {
                    var _self = this;
                    _self.on("afterWidthChange", function(e) {
                        var sender = e.target;
                        sender !== _self && _self.setTableWidth()
                    }), _self.on("afterVisibleChange", function(e) {
                        var sender = e.target;
                        sender !== _self && _self.setTableWidth()
                    }), _self.on("afterSortStateChange", function(e) {
                        var sender = e.target,
                            columns = _self.getColumns(),
                            val = e.newVal;
                        val && $.each(columns, function(index, column) {
                            column !== sender && column.set("sortState", "")
                        })
                    }), _self.on("add", function() {
                        _self.setTableWidth()
                    }), _self.on("remove", function() {
                        _self.setTableWidth()
                    })
                },
                _createColumn: function(cfg) {
                    return cfg instanceof Column ? cfg : (cfg.id || (cfg.id = BUI.guid("col")), new Column(cfg))
                },
                _createEmptyColumn: function() {
                    return new Column.Empty
                },
                _isAllowScrollLeft: function() {
                    var _self = this,
                        parent = _self.get("parent");
                    return parent && !!parent.get("height")
                },
                forceFitColumns: function() {
                    function setColoumnWidthSilent(column, colWidth) {
                        var columnEl = column.get("el");
                        column.set("width", colWidth, {
                            silent: 1
                        }), columnEl.width(colWidth)
                    }
                    var _self = this,
                        columns = _self.getColumns(),
                        width = _self.get("width"),
                        totalWidth = width,
                        totalColumnsWidth = _self.getColumnOriginWidth(),
                        realWidth = 0,
                        appendWidth = 0,
                        lastShowColumn = null,
                        allowScroll = _self._isAllowScrollLeft();
                    if (width) {
                        allowScroll && (width -= CLS_SCROLL_WITH, totalWidth = width);
                        var adjustCount = 0;
                        $.each(columns, function(index, column) {
                            if (column.get("visible") && column.get("resizable") && adjustCount++, column.get("visible") && !column.get("resizable")) {
                                var colWidth = column.get("el").outerWidth();
                                totalWidth -= colWidth, totalColumnsWidth -= colWidth
                            }
                        });
                        var colWidth = Math.floor(totalWidth / adjustCount),
                            ratio = totalWidth / totalColumnsWidth;
                        if (1 === ratio) return;
                        $.each(columns, function(index, column) {
                            if (column.get("visible") && column.get("resizable")) {
                                var borderWidth = _self._getColumnBorderWith(column, index),
                                    originWidth = column.get("originWidth");
                                originWidth || (column.set("originWidth", column.get("width")), originWidth = column.get("width")), colWidth = Math.floor((originWidth + borderWidth) * ratio), setColoumnWidthSilent(column, colWidth - borderWidth), realWidth += colWidth, lastShowColumn = column
                            }
                        }), lastShowColumn && (appendWidth = totalWidth - realWidth, setColoumnWidthSilent(lastShowColumn, lastShowColumn.get("width") + appendWidth)), _self.fire("forceFitWidth")
                    }
                },
                _getColumnBorderWith: function(column, index) {
                    var columnEl = column.get("el"),
                        borderWidth = Math.round(parseFloat(columnEl.css("border-left-width")) || 0) + Math.round(parseFloat(columnEl.css("border-right-width")) || 0);
                    return borderWidth = UA.ie && UA.ie < 8 && 0 === index ? 1 : borderWidth
                },
                setTableWidth: function() {
                    var _self = this,
                        width = _self.get("width"),
                        totalWidth = 0,
                        emptyColumn = null;
                    "auto" != width && (_self.get("forceFit") ? _self.forceFitColumns() : _self._isAllowScrollLeft() && (totalWidth = _self.getColumnsWidth(), emptyColumn = _self.get("emptyColumn"), width < totalWidth ? emptyColumn.get("el").width(CLS_SCROLL_WITH) : emptyColumn.get("el").width("auto")))
                },
                _uiSetWidth: function() {
                    var _self = this;
                    _self.setTableWidth()
                },
                _uiSetForceFit: function(v) {
                    var _self = this;
                    v && _self.setTableWidth()
                }
            }, {
                ATTRS: {
                    columns: {
                        value: []
                    },
                    emptyColumn: {},
                    focusable: {
                        value: !1
                    },
                    forceFit: {
                        sync: !1,
                        view: !0,
                        value: !1
                    },
                    tpl: {
                        view: !0,
                        value: '<table cellspacing="0" class="' + PREFIX + 'grid-table" cellpadding="0"><thead><tr></tr></thead></table>'
                    },
                    tableCls: {
                        view: !0
                    },
                    xview: {
                        value: headerView
                    },
                    events: {
                        value: {
                            add: !1,
                            remove: !1
                        }
                    }
                }
            }, {
                xclass: "grid-header",
                priority: 1
            });
        return header
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function isPercent(str) {
            return !!BUI.isString(str) && str.indexOf("%") !== -1
        }

        function getInnerWidth(width) {
            return BUI.isNumber(width) && (width -= WIDTH_BORDER), width
        }
        var BUI = require("bui/common"),
            UA = (require("bui/mask"), BUI.UA),
            Component = BUI.Component,
            List = (require("bui/toolbar"), require("bui/list")),
            Header = require("bui/grid/header"),
            Column = require("bui/grid/column"),
            PREFIX = BUI.prefix,
            CLS_GRID_HEADER_CONTAINER = PREFIX + "grid-header-container",
            CLS_GRID_BODY = PREFIX + "grid-body",
            CLS_GRID_WITH = PREFIX + "grid-width",
            CLS_GRID_HEIGHT = PREFIX + "grid-height",
            CLS_GRID_BORDER = PREFIX + "grid-border",
            CLS_GRID_TBAR = PREFIX + "grid-tbar",
            CLS_GRID_BBAR = PREFIX + "grid-bbar",
            CLS_BUTTON_BAR = PREFIX + "grid-button-bar",
            CLS_GRID_STRIPE = PREFIX + "grid-strip",
            CLS_GRID_ROW = PREFIX + "grid-row",
            CLS_ROW_ODD = PREFIX + "grid-row-odd",
            CLS_ROW_EVEN = PREFIX + "grid-row-even",
            CLS_GRID_CELL = PREFIX + "grid-cell",
            CLS_GRID_CELL_INNER = PREFIX + "grid-cell-inner",
            CLS_TD_PREFIX = "grid-td-",
            CLS_CELL_TEXT = PREFIX + "grid-cell-text",
            CLS_CELL_EMPTY = PREFIX + "grid-cell-empty",
            CLS_SCROLL_WITH = "17",
            CLS_HIDE = PREFIX + "hidden",
            ATTR_COLUMN_FIELD = "data-column-field",
            WIDTH_BORDER = 2,
            gridView = List.SimpleListView.extend({
                renderUI: function() {
                    var _self = this,
                        el = _self.get("el"),
                        bodyEl = el.find("." + CLS_GRID_BODY);
                    _self.set("bodyEl", bodyEl), _self._setTableTpl()
                },
                getItemTpl: function(record, index) {
                    var _self = this,
                        columns = _self._getColumns(),
                        rowTpl = (_self.get("tbodyEl"), _self.get("rowTpl")),
                        oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN,
                        cellsTpl = [];
                    return BUI.each(columns, function(column) {
                        var dataIndex = column.get("dataIndex");
                        cellsTpl.push(_self._getCellTpl(column, dataIndex, record, index))
                    }), _self.get("useEmptyCell") && cellsTpl.push(_self._getEmptyCellTpl()), rowTpl = BUI.substitute(rowTpl, {
                        cellsTpl: cellsTpl.join(""),
                        oddCls: oddCls
                    })
                },
                findRow: function(record) {
                    var _self = this;
                    return $(_self.findElement(record))
                },
                findCell: function(id, rowEl) {
                    var cls = CLS_TD_PREFIX + id;
                    return rowEl.find("." + cls)
                },
                resetHeaderRow: function() {
                    if (this.get("useHeaderRow")) {
                        var _self = this,
                            headerRowEl = _self.get("headerRowEl"),
                            tbodyEl = _self.get("tbodyEl");
                        headerRowEl && headerRowEl.remove(), headerRowEl = _self._createHeaderRow(), headerRowEl.prependTo(tbodyEl), _self.set("headerRowEl", headerRowEl)
                    }
                },
                resetColumnsWidth: function(column, width) {
                    var _self = this,
                        headerRowEl = _self.get("headerRowEl"),
                        cell = _self.findCell(column.get("id"), headerRowEl);
                    width = width || column.get("width"), cell && cell.width(width), _self.setTableWidth()
                },
                setTableWidth: function(columnsWidth) {
                    if (!columnsWidth && isPercent(this.get("width"))) return void this.get("tableEl").width("100%");
                    var _self = this,
                        width = _self._getInnerWidth(),
                        height = _self.get("height"),
                        tableEl = _self.get("tableEl");
                    _self.get("forceFit"), _self.get("headerRowEl");
                    if (!isPercent(columnsWidth)) {
                        if (columnsWidth = columnsWidth || _self._getColumnsWidth(), !width) return;
                        if (width >= columnsWidth && (columnsWidth = width, height)) {
                            var scrollWidth = 6 == UA.ie || 7 == UA.ie ? CLS_SCROLL_WITH + 2 : CLS_SCROLL_WITH;
                            columnsWidth = width - scrollWidth
                        }
                    }
                    tableEl.width(columnsWidth)
                },
                setBodyWidth: function(width) {
                    var _self = this,
                        bodyEl = _self.get("bodyEl");
                    width = width || _self._getInnerWidth(), bodyEl.width(width)
                },
                setBodyHeight: function(height) {
                    var _self = this,
                        bodyEl = _self.get("bodyEl"),
                        bodyHeight = height,
                        siblings = bodyEl.siblings();
                    BUI.each(siblings, function(item) {
                        "none" !== $(item).css("display") && (bodyHeight -= $(item).outerHeight())
                    }), bodyEl.height(bodyHeight)
                },
                setColumnVisible: function(column) {
                    var _self = this,
                        hide = !column.get("visible"),
                        colId = column.get("id"),
                        tbodyEl = _self.get("tbodyEl"),
                        cells = $("." + CLS_TD_PREFIX + colId, tbodyEl);
                    hide ? cells.hide() : cells.show()
                },
                updateItem: function(record) {
                    var _self = this,
                        items = _self.getItems(),
                        index = BUI.Array.indexOf(record, items),
                        columns = _self._getColumns(),
                        element = null;
                    if (index >= 0) return element = _self.findElement(record), BUI.each(columns, function(column) {
                        var cellEl = _self.findCell(column.get("id"), $(element)),
                            innerEl = cellEl.find("." + CLS_GRID_CELL_INNER),
                            textTpl = _self._getCellText(column, record, index);
                        innerEl.html(textTpl)
                    }), element
                },
                showEmptyText: function() {
                    var _self = this,
                        bodyEl = _self.get("bodyEl"),
                        emptyDataTpl = _self.get("emptyDataTpl"),
                        emptyEl = _self.get("emptyEl");
                    emptyEl && emptyEl.remove();
                    var emptyEl = $(emptyDataTpl).appendTo(bodyEl);
                    _self.set("emptyEl", emptyEl)
                },
                clearEmptyText: function() {
                    var _self = this,
                        emptyEl = _self.get("emptyEl");
                    emptyEl && emptyEl.remove()
                },
                _createHeaderRow: function() {
                    var rowEl, _self = this,
                        columns = _self._getColumns(),
                        tbodyEl = _self.get("tbodyEl"),
                        rowTpl = _self.get("headerRowTpl"),
                        cellsTpl = [];
                    return $.each(columns, function(index, column) {
                        cellsTpl.push(_self._getHeaderCellTpl(column))
                    }), _self.get("useEmptyCell") && cellsTpl.push(_self._getEmptyCellTpl()), rowTpl = BUI.substitute(rowTpl, {
                        cellsTpl: cellsTpl.join("")
                    }), rowEl = $(rowTpl).appendTo(tbodyEl)
                },
                _getColumnsWidth: function() {
                    var _self = this,
                        columns = _self.get("columns"),
                        totalWidth = 0;
                    return BUI.each(columns, function(column) {
                        column.get("visible") && (totalWidth += column.get("el").outerWidth())
                    }), totalWidth
                },
                _getColumns: function() {
                    return this.get("columns")
                },
                _getCellText: function(column, record, index) {
                    var _self = this,
                        dataIndex = column.get("dataIndex"),
                        textTpl = column.get("cellTpl") || _self.get("cellTextTpl"),
                        text = _self._getCellInnerText(column, dataIndex, record, index);
                    return BUI.substitute(textTpl, {
                        text: text,
                        tips: _self._getTips(column, dataIndex, record)
                    })
                },
                _getCellInnerText: function(column, dataIndex, record, index) {
                    try {
                        var renderer = column.get("renderer"),
                            text = renderer ? renderer(record[dataIndex], record, index) : record[dataIndex];
                        return null == text ? "" : text
                    } catch (ex) {
                        throw "column:" + column.get("title") + " fomat error!"
                    }
                },
                _getCellTpl: function(column, dataIndex, record, index) {
                    var _self = this,
                        cellText = _self._getCellText(column, record, index),
                        cellTpl = _self.get("cellTpl");
                    return BUI.substitute(cellTpl, {
                        elCls: column.get("elCls"),
                        id: column.get("id"),
                        dataIndex: dataIndex,
                        cellText: cellText,
                        hideCls: column.get("visible") ? "" : CLS_HIDE
                    })
                },
                _getEmptyCellTpl: function() {
                    return '<td class="' + CLS_GRID_CELL + " " + CLS_CELL_EMPTY + '">&nbsp;</td>'
                },
                _getHeaderCellTpl: function(column) {
                    var _self = this,
                        headerCellTpl = _self.get("headerCellTpl");
                    return BUI.substitute(headerCellTpl, {
                        id: column.get("id"),
                        width: column.get("width"),
                        hideCls: column.get("visible") ? "" : CLS_HIDE
                    })
                },
                _getInnerWidth: function() {
                    return getInnerWidth(this.get("width"))
                },
                _getTips: function(column, dataIndex, record) {
                    var showTip = column.get("showTip"),
                        value = "";
                    return showTip && (value = record[dataIndex], BUI.isFunction(showTip) && (value = showTip(value, record))), value
                },
                _uiSetInnerBorder: function(v) {
                    var _self = this,
                        el = _self.get("el");
                    v ? el.addClass(CLS_GRID_BORDER) : el.removeClass(CLS_GRID_BORDER)
                },
                _setTableTpl: function(tpl) {
                    var _self = this,
                        bodyEl = _self.get("bodyEl");
                    tpl = tpl || _self.get("tableTpl"), $(tpl).appendTo(bodyEl);
                    var tableEl = bodyEl.find("table"),
                        tbodyEl = bodyEl.find("tbody");
                    _self.set("tableEl", tableEl), _self.set("tbodyEl", tbodyEl), _self.set("itemContainer", tbodyEl), _self._setTableCls(_self.get("tableCls"))
                },
                _uiSetTableCls: function(v) {
                    this._setTableCls(v)
                },
                _uiSetHeight: function(h) {
                    var _self = this;
                    _self.get("bodyEl");
                    _self.get("el").height(h), _self.get("el").addClass(CLS_GRID_HEIGHT)
                },
                _uiSetWidth: function(w) {
                    var _self = this;
                    _self.get("el").width(w), _self.setBodyWidth(_self._getInnerWidth(w)), _self.get("el").addClass(CLS_GRID_WITH)
                },
                _uiSetStripeRows: function(v) {
                    var _self = this,
                        method = v ? "addClass" : "removeClass";
                    _self.get("el")[method](CLS_GRID_STRIPE)
                },
                _setTableCls: function(cls) {
                    var _self = this,
                        tableEl = _self.get("tableEl");
                    tableEl.attr("class", cls)
                }
            }, {
                ATTRS: {
                    tableCls: {},
                    bodyEl: {},
                    tbodyEl: {},
                    headerRowEl: {},
                    tableEl: {},
                    emptyEl: {}
                }
            }, {
                xclass: "grid-view"
            }),
            grid = List.SimpleList.extend({
                initializer: function() {
                    var _self = this,
                        render = _self.get("render"),
                        width = _self.get("width");
                    width || _self.set("width", $(render).width())
                },
                createDom: function() {
                    var _self = this;
                    _self.get("width") && _self.get("el").addClass(CLS_GRID_WITH), _self.get("height") && _self.get("el").addClass(CLS_GRID_HEIGHT), _self.get("innerBorder") && _self.get("el").addClass(CLS_GRID_BORDER)
                },
                renderUI: function() {
                    var _self = this;
                    _self._initHeader(), _self._initBars(), _self._initLoadMask(), _self.get("view").resetHeaderRow()
                },
                bindUI: function() {
                    var _self = this;
                    _self._bindHeaderEvent(), _self._bindBodyEvent(), _self._bindItemsEvent()
                },
                addColumn: function(column, index) {
                    var _self = this,
                        header = _self.get("header");
                    return header ? column = header.addColumn(column, index) : (column = new Column(column), _self.get("columns").splice(index, 0, column)), column
                },
                clearData: function() {
                    this.clearItems()
                },
                getRecords: function() {
                    return this.getItems()
                },
                findColumn: function(id) {
                    var _self = this,
                        header = _self.get("header");
                    return BUI.isNumber(id) ? header.getColumnByIndex(id) : header.getColumnById(id)
                },
                findColumnByField: function(field) {
                    var _self = this,
                        header = _self.get("header");
                    return header.getColumn(function(column) {
                        return column.get("dataIndex") === field
                    })
                },
                findCell: function(id, record) {
                    var _self = this,
                        rowEl = null;
                    return rowEl = record instanceof $ ? record : _self.findRow(record), rowEl ? _self.get("view").findCell(id, rowEl) : null
                },
                findRow: function(record) {
                    var _self = this;
                    return _self.get("view").findRow(record)
                },
                removeColumn: function(column) {
                    var _self = this;
                    _self.get("header").removeColumn(column)
                },
                showData: function(data) {
                    var _self = this;
                    _self.set("items", data)
                },
                resetColumns: function() {
                    var _self = this,
                        store = _self.get("store");
                    _self.get("view").resetHeaderRow(), store && _self.onLoad()
                },
                _bindScrollEvent: function() {
                    var _self = this,
                        el = _self.get("el"),
                        bodyEl = el.find("." + CLS_GRID_BODY),
                        header = _self.get("header");
                    bodyEl.on("scroll", function() {
                        var left = bodyEl.scrollLeft(),
                            top = bodyEl.scrollTop();
                        header.scrollTo({
                            left: left,
                            top: top
                        }), _self.fire("scroll", {
                            scrollLeft: left,
                            scrollTop: top,
                            bodyWidth: bodyEl.width(),
                            bodyHeight: bodyEl.height()
                        })
                    })
                },
                _bindHeaderEvent: function() {
                    var _self = this,
                        header = _self.get("header"),
                        view = _self.get("view"),
                        store = _self.get("store");
                    header.on("afterWidthChange", function(e) {
                        var sender = e.target;
                        sender !== header && view.resetColumnsWidth(sender)
                    }), header.on("afterSortStateChange", function(e) {
                        var column = e.target,
                            val = e.newVal;
                        val && store && store.sort(column.get("dataIndex"), column.get("sortState"))
                    }), header.on("afterVisibleChange", function(e) {
                        var sender = e.target;
                        sender !== header && (view.setColumnVisible(sender), _self.fire("columnvisiblechange", {
                            column: sender
                        }))
                    }), header.on("click", function(e) {
                        var sender = e.target;
                        sender !== header && _self.fire("columnclick", {
                            column: sender,
                            domTarget: e.domTarget
                        })
                    }), header.on("forceFitWidth", function() {
                        _self.get("rendered") && _self.resetColumns()
                    }), header.on("add", function(e) {
                        _self.get("rendered") && (_self.fire("columnadd", {
                            column: e.column,
                            index: e.index
                        }), _self.resetColumns())
                    }), header.on("remove", function(e) {
                        _self.get("rendered") && (_self.resetColumns(), _self.fire("columnremoved", {
                            column: e.column,
                            index: e.index
                        }))
                    })
                },
                _bindBodyEvent: function() {
                    var _self = this;
                    _self._bindScrollEvent()
                },
                _bindItemsEvent: function() {
                    function getEventObj(ev) {
                        return {
                            record: ev.item,
                            row: ev.domTarget,
                            domTarget: ev.domTarget
                        }
                    }
                    var _self = this;
                    _self.get("store");
                    _self.on("itemsshow", function() {
                        _self.fire("aftershow")
                    }), _self.on("itemsclear", function() {
                        _self.fire("clear")
                    }), _self.on("itemclick", function(ev) {
                        var rst, target = ev.domTarget,
                            record = ev.item,
                            cell = $(target).closest("." + CLS_GRID_CELL),
                            rowEl = $(target).closest("." + CLS_GRID_ROW);
                        return cell.length && (rst = _self.fire("cellclick", {
                            record: record,
                            row: rowEl[0],
                            cell: cell[0],
                            field: cell.attr(ATTR_COLUMN_FIELD),
                            domTarget: target,
                            domEvent: ev.domEvent
                        })), rst === !1 ? rst : _self.fire("rowclick", {
                            record: record,
                            row: rowEl[0],
                            domTarget: target
                        })
                    }), _self.on("itemunselected", function(ev) {
                        _self.fire("rowunselected", getEventObj(ev))
                    }), _self.on("itemselected", function(ev) {
                        _self.fire("rowselected", getEventObj(ev))
                    }), _self.on("itemrendered", function(ev) {
                        _self.fire("rowcreated", getEventObj(ev))
                    }), _self.on("itemremoved", function(ev) {
                        _self.fire("rowremoved", getEventObj(ev))
                    }), _self.on("itemupdated", function(ev) {
                        _self.fire("rowupdated", getEventObj(ev))
                    })
                },
                _getInnerWidth: function(width) {
                    return width = width || this.get("width"), getInnerWidth(width)
                },
                _initHeader: function() {
                    var _self = this,
                        header = _self.get("header"),
                        container = _self.get("el").find("." + CLS_GRID_HEADER_CONTAINER);
                    header || (header = new Header({
                        columns: _self.get("columns"),
                        tableCls: _self.get("tableCls"),
                        forceFit: _self.get("forceFit"),
                        width: _self._getInnerWidth(),
                        render: container,
                        parent: _self
                    }).render(), _self.set("header", header))
                },
                _initBars: function() {
                    var _self = this,
                        bbar = _self.get("bbar"),
                        tbar = _self.get("tbar");
                    _self._initBar(bbar, CLS_GRID_BBAR, "bbar"), _self._initBar(tbar, CLS_GRID_TBAR, "tbar")
                },
                _initBar: function(bar, cls, name) {
                    var _self = this,
                        store = null,
                        pagingBarCfg = null;
                    if (bar) {
                        if (bar.xclass || bar instanceof Component.Controller || (bar.xclass = "bar", bar.children = bar.children || [], bar.items && (bar.children.push({
                                xclass: "bar",
                                defaultChildClass: "bar-item-button",
                                elCls: CLS_BUTTON_BAR,
                                children: bar.items
                            }), bar.items = null), bar.pagingBar && (store = _self.get("store"), pagingBarCfg = {
                                xclass: "pagingbar",
                                store: store,
                                pageSize: store.pageSize
                            }, bar.pagingBar !== !0 && (pagingBarCfg = BUI.merge(pagingBarCfg, bar.pagingBar)), bar.children.push(pagingBarCfg))), bar.xclass) {
                            var barContainer = _self.get("el").find("." + cls);
                            barContainer.show(), bar.render = barContainer, bar.elTagName = "div", bar.autoRender = !0, bar = _self.addChild(bar)
                        }
                        _self.set(name, bar)
                    }
                    return bar
                },
                _initLoadMask: function() {
                    var _self = this,
                        loadMask = _self.get("loadMask");
                    loadMask && !loadMask.show && (loadMask = new BUI.Mask.LoadMask({
                        el: _self.get("el")
                    }), _self.set("loadMask", loadMask))
                },
                _uiSetWidth: function(w) {
                    var _self = this;
                    _self.get("rendered") && (isPercent(w) ? _self.get("header").set("width", "100%") : _self.get("header").set("width", _self._getInnerWidth(w))), _self.get("view").setTableWidth()
                },
                _uiSetForceFit: function(v) {
                    var _self = this;
                    _self.get("header").set("forceFit", v)
                },
                _uiSetHeight: function(h, obj) {
                    var _self = this,
                        header = _self.get("header");
                    _self.get("view").setBodyHeight(h), _self.get("rendered") && (_self.get("forceFit") && !obj.prevVal && (header.forceFitColumns(), _self.get("view").setTableWidth()), header.setTableWidth())
                },
                onLoad: function() {
                    var _self = this,
                        store = _self.get("store");
                    grid.superclass.onLoad.call(this), _self.get("emptyDataTpl") && (store && 0 == store.getCount() ? _self.get("view").showEmptyText() : _self.get("view").clearEmptyText())
                }
            }, {
                ATTRS: {
                    header: {},
                    bbar: {},
                    itemCls: {
                        value: CLS_GRID_ROW
                    },
                    columns: {
                        view: !0,
                        value: []
                    },
                    forceFit: {
                        sync: !1,
                        value: !1
                    },
                    emptyDataTpl: {
                        view: !0
                    },
                    headerRowTpl: {
                        view: !0,
                        value: '<tr class="' + PREFIX + 'grid-header-row">{cellsTpl}</tr>'
                    },
                    headerCellTpl: {
                        view: !0,
                        value: '<td class="{hideCls} ' + CLS_TD_PREFIX + '{id}" width="{width}" style="height:0"></td>'
                    },
                    rowTpl: {
                        view: !0,
                        value: '<tr class="' + CLS_GRID_ROW + ' {oddCls}">{cellsTpl}</tr>'
                    },
                    cellTpl: {
                        view: !0,
                        value: '<td  class="{elCls} {hideCls} ' + CLS_GRID_CELL + " " + CLS_TD_PREFIX + '{id}" data-column-id="{id}" data-column-field = "{dataIndex}" ><div class="' + CLS_GRID_CELL_INNER + '" >{cellText}</div></td>'
                    },
                    cellTextTpl: {
                        view: !0,
                        value: '<span class="' + CLS_CELL_TEXT + ' " title = "{tips}">{text}</span>'
                    },
                    events: {
                        value: {
                            aftershow: !1,
                            clear: !1,
                            cellclick: !1,
                            columnclick: !1,
                            rowclick: !1,
                            rowcreated: !1,
                            rowremoved: !1,
                            rowselected: !1,
                            rowunselected: !1,
                            scroll: !1
                        }
                    },
                    stripeRows: {
                        view: !0,
                        value: !0
                    },
                    tbar: {},
                    tableCls: {
                        view: !0,
                        sync: !1,
                        value: PREFIX + "grid-table"
                    },
                    tableTpl: {
                        view: !0,
                        value: '<table cellspacing="0" cellpadding="0" ><tbody></tbody></table>'
                    },
                    tpl: {
                        value: '<div class="' + CLS_GRID_TBAR + '" style="display:none"></div><div class="' + CLS_GRID_HEADER_CONTAINER + '"></div><div class="' + CLS_GRID_BODY + '"></div><div style="display:none" class="' + CLS_GRID_BBAR + '"></div>'
                    },
                    innerBorder: {
                        sync: !1,
                        value: !0
                    },
                    useEmptyCell: {
                        view: !0,
                        value: !0
                    },
                    useHeaderRow: {
                        view: !0,
                        value: !0
                    },
                    xview: {
                        value: gridView
                    }
                }
            }, {
                xclass: "grid"
            });
        return grid.View = gridView, grid
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function formatTimeUnit(v) {
            return v < 10 ? "0" + v : v
        }
        var Format = {
            dateRenderer: function(d) {
                if (!d) return "";
                if (BUI.isString(d)) return d;
                var date = null;
                try {
                    date = new Date(d)
                } catch (e) {
                    return ""
                }
                return date && date.getFullYear ? date.getFullYear() + "-" + formatTimeUnit(date.getMonth() + 1) + "-" + formatTimeUnit(date.getDate()) : ""
            },
            datetimeRenderer: function(d) {
                if (!d) return "";
                if (BUI.isString(d)) return d;
                var date = null;
                try {
                    date = new Date(d)
                } catch (e) {
                    return ""
                }
                return date && date.getFullYear ? date.getFullYear() + "-" + formatTimeUnit(date.getMonth() + 1) + "-" + formatTimeUnit(date.getDate()) + " " + formatTimeUnit(date.getHours()) + ":" + formatTimeUnit(date.getMinutes()) + ":" + formatTimeUnit(date.getSeconds()) : ""
            },
            cutTextRenderer: function(length) {
                return function(value) {
                    return value = value || "", value.toString().length > length ? value.toString().substring(0, length) + "..." : value
                }
            },
            enumRenderer: function(enumObj) {
                return function(value) {
                    return enumObj[value] || ""
                }
            },
            multipleItemsRenderer: function(enumObj) {
                var enumFun = Format.enumRenderer(enumObj);
                return function(values) {
                    var result = [];
                    return values ? (BUI.isArray(values) || (values = values.toString().split(",")), $.each(values, function(index, value) {
                        result.push(enumFun(value))
                    }), result.join(",")) : ""
                }
            },
            moneyCentRenderer: function(v) {
                return BUI.isString(v) && (v = parseFloat(v)), $.isNumberic(v) ? (.01 * v).toFixed(2) : v
            }
        };
        return Format
    }),
    function() {
        var BASE = "bui/grid/plugins/";
        define("src/hephaistos/js/bui-debug", [], function(r) {
            var BUI = r("bui/common"),
                Selection = r(BASE + "selection"),
                Plugins = {};
            return BUI.mix(Plugins, {
                CheckSelection: Selection.CheckSelection,
                RadioSelection: Selection.RadioSelection,
                Cascade: r(BASE + "cascade"),
                CellEditing: r(BASE + "cellediting"),
                RowEditing: r(BASE + "rowediting"),
                DialogEditing: r(BASE + "dialogediting"),
                AutoFit: r(BASE + "autofit"),
                GridMenu: r(BASE + "menu"),
                Summary: r(BASE + "summary"),
                RowNumber: r(BASE + "rownumber")
            }), Plugins
        })
    }(), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            AutoFit = function(cfg) {
                AutoFit.superclass.constructor.call(this, cfg)
            };
        return BUI.extend(AutoFit, BUI.Base), AutoFit.ATTRS = {}, BUI.augment(AutoFit, {
            bindUI: function(grid) {
                var handler, _self = this;
                $(window).on("resize", function() {
                    function autoFit() {
                        clearTimeout(handler), handler = setTimeout(function() {
                            _self._autoFit(grid)
                        }, 100)
                    }
                    autoFit()
                })
            },
            _autoFit: function(grid) {
                var width, render = grid.get("render");
                grid.set("visible", !1), width = $(render).width(), grid.set("visible", !0), grid.set("width", width)
            }
        }), AutoFit
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Menu = require("bui/menu"),
            PREFIX = BUI.prefix,
            ID_SORT_ASC = "sort-asc",
            ID_SORT_DESC = "sort-desc",
            ID_COLUMNS_SET = "column-setting",
            gridMenu = function(config) {
                gridMenu.superclass.constructor.call(this, config)
            };
        return BUI.extend(gridMenu, BUI.Base), gridMenu.ATTRS = {
            menu: {},
            activedColumn: {},
            triggerCls: {
                value: PREFIX + "grid-hd-menu-trigger"
            },
            items: {
                value: [{
                    id: ID_SORT_ASC,
                    text: "升序",
                    iconCls: "icon-arrow-up"
                }, {
                    id: ID_SORT_DESC,
                    text: "降序",
                    iconCls: "icon-arrow-down"
                }, {
                    xclass: "menu-item-sparator"
                }, {
                    id: ID_COLUMNS_SET,
                    text: "设置列",
                    iconCls: "icon-list-alt"
                }]
            }
        }, BUI.augment(gridMenu, {
            initializer: function(grid) {
                var _self = this;
                _self.set("grid", grid)
            },
            renderUI: function(grid) {
                var _self = this,
                    columns = grid.get("columns");
                BUI.each(columns, function(column) {
                    _self._addShowMenu(column)
                })
            },
            bindUI: function(grid) {
                var _self = this;
                grid.on("columnadd", function(ev) {
                    _self._addShowMenu(ev.column)
                }), grid.on("columnclick", function(ev) {
                    var menu, sender = $(ev.domTarget),
                        column = ev.column;
                    _self.set("activedColumn", column), sender.hasClass(_self.get("triggerCls")) && (menu = _self.get("menu") || _self._initMenu(), menu.set("align", {
                        node: sender,
                        points: ["bl", "tl"],
                        offset: [0, 0]
                    }), menu.show(), _self._afterShow(column, menu))
                })
            },
            _addShowMenu: function(column) {
                column.get("fixed") || column.set("showMenu", !0)
            },
            _afterShow: function(column, menu) {
                var _self = this;
                _self.get("grid");
                menu = menu || _self.get("menu"), _self._resetSortMenuItems(column, menu), _self._resetColumnsVisible(menu)
            },
            _resetColumnsVisible: function(menu) {
                var _self = this,
                    settingItem = menu.findItemById(ID_COLUMNS_SET),
                    subMenu = settingItem.get("subMenu") || _self._initColumnsMenu(settingItem),
                    columns = _self.get("grid").get("columns");
                subMenu.removeChildren(!0), $.each(columns, function(index, column) {
                    if (!column.get("fixed")) {
                        var config = {
                                xclass: "context-menu-item",
                                text: column.get("title"),
                                column: column,
                                iconCls: "icon"
                            },
                            menuItem = subMenu.addChild(config);
                        column.get("visible") && menuItem.set("selected", !0)
                    }
                })
            },
            _resetSortMenuItems: function(column, menu) {
                var ascItem = menu.findItemById(ID_SORT_ASC),
                    descItem = menu.findItemById(ID_SORT_DESC);
                column.get("sortable") ? (ascItem.set("disabled", !1), descItem.set("disabled", !1)) : (ascItem.set("disabled", !0), descItem.set("disabled", !0))
            },
            _initMenu: function() {
                var menuItems, _self = this,
                    menu = _self.get("menu");
                return menu || (menuItems = _self.get("items"), $.each(menuItems, function(index, item) {
                    item.xclass || (item.xclass = "context-menu-item")
                }), menu = new Menu.ContextMenu({
                    children: menuItems,
                    elCls: "grid-menu"
                }), _self._initMenuEvent(menu), _self.set("menu", menu)), menu
            },
            _initMenuEvent: function(menu) {
                var _self = this;
                menu.on("itemclick", function(ev) {
                    var item = ev.item,
                        id = item.get("id"),
                        activedColumn = _self.get("activedColumn");
                    id === ID_SORT_ASC ? activedColumn.set("sortState", "ASC") : id === ID_SORT_DESC && activedColumn.set("sortState", "DESC")
                }), menu.on("afterVisibleChange", function(ev) {
                    var visible = ev.newVal,
                        activedColumn = _self.get("activedColumn");
                    visible && activedColumn ? activedColumn.set("open", !0) : activedColumn.set("open", !1)
                })
            },
            _initColumnsMenu: function(settingItem) {
                var subMenu = new Menu.ContextMenu({
                    multipleSelect: !0,
                    elCls: "grid-column-menu"
                });
                return settingItem.set("subMenu", subMenu), subMenu.on("itemclick", function(ev) {
                    var item = ev.item,
                        column = item.get("column"),
                        selected = item.get("selected");
                    selected ? column.set("visible", !0) : column.set("visible", !1)
                }), subMenu
            },
            destructor: function() {
                var _self = this,
                    menu = _self.get("menu");
                menu && menu.destroy(), _self.off(), _self.clearAttrVals()
            }
        }), gridMenu
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            PREFIX = BUI.prefix,
            DATA_RECORD = "data-record",
            CLS_CASCADE = PREFIX + "grid-cascade",
            CLS_CASCADE_EXPAND = CLS_CASCADE + "-expand",
            CLS_CASCADE_ROW = CLS_CASCADE + "-row",
            CLS_CASCADE_CELL = CLS_CASCADE + "-cell",
            CLS_CASCADE_ROW_COLLAPSE = CLS_CASCADE + "-collapse",
            cascade = function(config) {
                cascade.superclass.constructor.call(this, config)
            };
        return BUI.extend(cascade, BUI.Base), cascade.ATTRS = {
            width: {
                value: 40
            },
            cellInner: {
                value: '<span class="' + CLS_CASCADE + '"><i class="' + CLS_CASCADE + '-icon"></i></span>'
            },
            rowTpl: {
                value: '<tr class="' + CLS_CASCADE_ROW + '"><td class="' + CLS_CASCADE_CELL + '"></td></tr>'
            },
            renderer: {},
            events: ["expand", "collapse", "removed"]
        }, BUI.augment(cascade, {
            initializer: function(grid) {
                var _self = this,
                    cfg = {
                        title: "",
                        elCls: "center",
                        width: _self.get("width"),
                        resizable: !1,
                        fixed: !0,
                        sortable: !1,
                        cellTpl: _self.get("cellInner")
                    };
                grid.addColumn(cfg, 0);
                grid.set("innerBorder", !1), _self.set("grid", grid)
            },
            bindUI: function(grid) {
                var _self = this;
                grid.on("cellclick", function(ev) {
                    var sender = $(ev.domTarget),
                        cascadeEl = sender.closest("." + CLS_CASCADE);
                    cascadeEl.length && (cascadeEl.hasClass(CLS_CASCADE_EXPAND) ? _self._onCollapse(ev.record, ev.row, cascadeEl) : _self._onExpand(ev.record, ev.row, cascadeEl))
                }), grid.on("columnvisiblechange", function() {
                    _self._resetColspan()
                }), grid.on("rowremoved", function(ev) {
                    _self.remove(ev.record)
                }), grid.on("clear", function() {
                    _self.removeAll()
                })
            },
            expandAll: function() {
                var _self = this,
                    grid = _self.get("grid"),
                    records = grid.getRecords();
                $.each(records, function(index, record) {
                    _self.expand(record)
                })
            },
            expand: function(record) {
                var _self = this,
                    grid = _self.get("grid"),
                    row = grid.findRow(record);
                row && _self._onExpand(record, row)
            },
            collapse: function(record) {
                var _self = this,
                    grid = _self.get("grid"),
                    row = grid.findRow(record);
                row && _self._onCollapse(record, row)
            },
            removeAll: function() {
                var _self = this,
                    rows = _self._getAllCascadeRows();
                rows.each(function(index, row) {
                    _self._removeCascadeRow(row)
                })
            },
            remove: function(record) {
                var _self = this,
                    cascadeRow = _self._findCascadeRow(record);
                cascadeRow && _self._removeCascadeRow(cascadeRow)
            },
            collapseAll: function() {
                var _self = this,
                    grid = _self.get("grid"),
                    records = grid.getRecords();
                $.each(records, function(index, record) {
                    _self.collapse(record)
                })
            },
            _getRowRecord: function(cascadeRow) {
                return $(cascadeRow).data(DATA_RECORD)
            },
            _removeCascadeRow: function(row) {
                this.fire("removed", {
                    record: $(row).data(DATA_RECORD),
                    row: row
                }), $(row).remove()
            },
            _findCascadeRow: function(record) {
                var _self = this,
                    rows = _self._getAllCascadeRows(),
                    result = null;
                return $.each(rows, function(index, row) {
                    if (_self._getRowRecord(row) === record) return result = row, !1
                }), result
            },
            _getAllCascadeRows: function() {
                var _self = this,
                    grid = _self.get("grid");
                return grid.get("el").find("." + CLS_CASCADE_ROW)
            },
            _getCascadeRow: function(gridRow) {
                var nextRow = $(gridRow).next();
                return nextRow.hasClass(CLS_CASCADE_ROW) ? nextRow : null
            },
            _getRowContent: function(record) {
                var _self = this,
                    renderer = _self.get("renderer"),
                    content = renderer ? renderer(record) : "";
                return content
            },
            _createCascadeRow: function(record, gridRow) {
                var _self = this,
                    rowTpl = _self.get("rowTpl"),
                    content = _self._getRowContent(record),
                    rowEl = $(rowTpl).insertAfter(gridRow);
                return rowEl.find("." + CLS_CASCADE_CELL).append($(content)), rowEl.data(DATA_RECORD, record), rowEl
            },
            _onExpand: function(record, row, cascadeEl) {
                var _self = this,
                    cascadeRow = _self._getCascadeRow(row);
                _self._getColumnCount(row);
                cascadeEl = cascadeEl || $(row).find("." + CLS_CASCADE), cascadeEl.addClass(CLS_CASCADE_EXPAND), cascadeRow && cascadeRow.length || (cascadeRow = _self._createCascadeRow(record, row)), $(cascadeRow).removeClass(CLS_CASCADE_ROW_COLLAPSE), _self._setColSpan(cascadeRow, row), _self.fire("expand", {
                    record: record,
                    row: cascadeRow[0]
                })
            },
            _onCollapse: function(record, row, cascadeEl) {
                var _self = this,
                    cascadeRow = _self._getCascadeRow(row);
                cascadeEl = cascadeEl || $(row).find("." + CLS_CASCADE), cascadeEl.removeClass(CLS_CASCADE_EXPAND), !cascadeRow && cascadeRow.length || ($(cascadeRow).addClass(CLS_CASCADE_ROW_COLLAPSE), _self.fire("collapse", {
                    record: record,
                    row: cascadeRow[0]
                }))
            },
            _getColumnCount: function(row) {
                return $(row).children().filter(function() {
                    return "none" !== $(this).css("display")
                }).length
            },
            _setColSpan: function(cascadeRow, gridRow) {
                gridRow = gridRow || $(cascadeRow).prev();
                var _self = this,
                    colspan = _self._getColumnCount(gridRow);
                $(cascadeRow).find("." + CLS_CASCADE_CELL).attr("colspan", colspan)
            },
            _resetColspan: function() {
                var _self = this,
                    cascadeRows = _self._getAllCascadeRows();
                $.each(cascadeRows, function(index, cascadeRow) {
                    _self._setColSpan(cascadeRow)
                })
            },
            destructor: function() {
                var _self = this;
                _self.removeAll(), _self.off(), _self.clearAttrVals()
            }
        }), cascade
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function checkSelection(config) {
            checkSelection.superclass.constructor.call(this, config)
        }
        var BUI = require("bui/common"),
            PREFIX = BUI.prefix,
            CLS_CHECKBOX = PREFIX + "grid-checkBox",
            CLS_CHECK_ICON = "x-grid-checkbox",
            CLS_RADIO = PREFIX + "grid-radio";
        BUI.extend(checkSelection, BUI.Base), checkSelection.ATTRS = {
            width: {
                value: 40
            },
            column: {},
            cellInner: {
                value: '<div class="' + CLS_CHECKBOX + '-container"><span class="' + CLS_CHECK_ICON + '"></span></div>'
            }
        }, BUI.augment(checkSelection, {
            createDom: function(grid) {
                var _self = this,
                    cfg = {
                        title: "",
                        width: _self.get("width"),
                        fixed: !0,
                        resizable: !1,
                        sortable: !1,
                        tpl: '<div class="' + PREFIX + 'grid-hd-inner">' + _self.get("cellInner"),
                        cellTpl: _self.get("cellInner")
                    },
                    checkColumn = grid.addColumn(cfg, 0);
                grid.set("multipleSelect", !0), _self.set("column", checkColumn)
            },
            bindUI: function(grid) {
                var _self = this,
                    col = _self.get("column"),
                    colEl = col.get("el"),
                    checkBox = colEl.find("." + CLS_CHECK_ICON);
                checkBox.on("click", function() {
                    var checked = colEl.hasClass("checked");
                    checked ? (grid.clearSelection(), colEl.removeClass("checked")) : (grid.setAllSelection(), colEl.addClass("checked"))
                }), grid.on("rowunselected", function(e) {
                    colEl.removeClass("checked")
                }), grid.on("clear", function() {
                    colEl.removeClass("checked")
                })
            }
        });
        var radioSelection = function(config) {
            radioSelection.superclass.constructor.call(this, config)
        };
        BUI.extend(radioSelection, BUI.Base), radioSelection.ATTRS = {
            width: {
                value: 40
            },
            column: {},
            cellInner: {
                value: '<div class="' + PREFIX + 'grid-radio-container"><input  class="' + CLS_RADIO + '" type="radio"></div>'
            }
        }, BUI.augment(radioSelection, {
            createDom: function(grid) {
                var _self = this,
                    cfg = {
                        title: "",
                        width: _self.get("width"),
                        resizable: !1,
                        fixed: !0,
                        sortable: !1,
                        cellTpl: _self.get("cellInner")
                    },
                    column = grid.addColumn(cfg, 0);
                grid.set("multipleSelect", !1), _self.set("column", column)
            },
            bindUI: function(grid) {
                var _self = this;
                grid.on("rowselected", function(e) {
                    _self._setRowChecked(e.row, !0)
                }), grid.on("rowunselected", function(e) {
                    _self._setRowChecked(e.row, !1)
                })
            },
            _setRowChecked: function(row, checked) {
                var rowEl = $(row),
                    radio = rowEl.find("." + CLS_RADIO);
                radio.attr("checked", checked)
            }
        });
        var Selection = {
            CheckSelection: checkSelection,
            RadioSelection: radioSelection
        };
        return Selection
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getEmptyCellTemplate(colspan) {
            return colspan > 0 ? '<td class="' + CLS_GRID_CELL + '" colspan="' + colspan + '">&nbsp;</td>' : ""
        }

        function getCellTemplate(text, id) {
            return '<td class="' + CLS_GRID_CELL + " " + CLS_COLUMN_PREFIX + id + '">' + getInnerTemplate(text) + "</td>"
        }

        function getInnerTemplate(text) {
            return '<div class="' + CLS_GRID_CELL_INNER + '" ><span class="' + CLS_GRID_CELL_TEXT + ' ">' + text + "</span></div>"
        }

        function getLastEmptyCell() {
            return '<td class="' + CLS_GRID_CELL + " " + CLS_GRID_CELL + '-empty">&nbsp;</td>'
        }
        var BUI = require("bui/common"),
            PREFIX = BUI.prefix,
            CLS_GRID_ROW = PREFIX + "grid-row",
            CLS_GRID_BODY = PREFIX + "grid-body",
            CLS_SUMMARY_ROW = PREFIX + "grid-summary-row",
            CLS_GRID_CELL_INNER = PREFIX + "grid-cell-inner",
            CLS_COLUMN_PREFIX = "grid-td-",
            CLS_GRID_CELL_TEXT = PREFIX + "grid-cell-text",
            CLS_GRID_CELL = PREFIX + "grid-cell",
            summary = function(config) {
                summary.superclass.constructor.call(this, config)
            };
        return summary.ATTRS = {
            footerTpl: {
                value: "<tfoot></tfoot>"
            },
            footerEl: {},
            summaryTitle: {
                value: "查询合计"
            },
            pageSummaryTitle: {
                value: "本页合计"
            },
            field: {
                value: "summary"
            },
            pageSummaryField: {
                value: "pageSummary"
            },
            summaryField: {
                value: "summary"
            },
            pageSummary: {},
            summary: {}
        }, BUI.extend(summary, BUI.Base), BUI.augment(summary, {
            initializer: function(grid) {
                var _self = this;
                _self.set("grid", grid)
            },
            renderUI: function(grid) {
                var _self = this,
                    bodyEl = grid.get("el").find("." + CLS_GRID_BODY),
                    bodyTable = bodyEl.find("table"),
                    footerEl = $(_self.get("footerTpl")).appendTo(bodyTable);
                _self.set("footerEl", footerEl)
            },
            bindUI: function(grid) {
                var _self = this,
                    store = grid.get("store");
                store && (store.on("beforeprocessload", function(ev) {
                    _self._processSummary(ev.data)
                }), store.on("add", function() {
                    _self.resetPageSummary()
                }), store.on("remove", function() {
                    _self.resetPageSummary()
                }), store.on("update", function() {
                    _self.resetPageSummary()
                })), grid.on("aftershow", function() {
                    _self.resetSummary()
                }), grid.get("header").on("afterVisibleChange", function() {
                    _self.resetSummary()
                })
            },
            _processSummary: function(data) {
                var _self = this,
                    footerEl = _self.get("footerEl");
                if (footerEl.empty(), data) {
                    var pageSummary = data[_self.get("pageSummaryField")],
                        summary = data[_self.get("summaryField")];
                    _self.set("pageSummary", pageSummary), _self.set("summary", summary)
                }
            },
            resetPageSummary: function() {
                var _self = this,
                    grid = _self.get("grid"),
                    columns = grid.get("columns"),
                    pageSummary = _self._calculatePageSummary(),
                    pageEl = _self.get("pageEl");
                _self.set("pageSummary", pageSummary), pageEl && (BUI.each(columns, function(column) {
                    if (column.get("summary") && column.get("visible")) {
                        var id = column.get("id"),
                            cellEl = pageEl.find("." + CLS_COLUMN_PREFIX + id),
                            text = _self._getSummaryCellText(column, pageSummary);
                        cellEl.find("." + CLS_GRID_CELL_TEXT).text(text)
                    }
                }), _self._updateFirstRow(pageEl, _self.get("pageSummaryTitle")))
            },
            resetSummary: function(pageSummary, summary) {
                var _self = this,
                    footerEl = _self.get("footerEl"),
                    pageEl = null;
                footerEl.empty(), pageSummary = pageSummary || _self.get("pageSummary"), pageSummary || (pageSummary = _self._calculatePageSummary(), _self.set("pageSummary", pageSummary)), summary = summary || _self.get("summary"), pageEl = _self._creatSummaryRow(pageSummary, _self.get("pageSummaryTitle")), _self.set("pageEl", pageEl), _self._creatSummaryRow(summary, _self.get("summaryTitle"))
            },
            _creatSummaryRow: function(summary, title) {
                if (!summary) return null;
                var _self = this,
                    footerEl = _self.get("footerEl"),
                    tpl = _self._getSummaryTpl(summary),
                    rowEl = $(tpl).appendTo(footerEl);
                return _self._updateFirstRow(rowEl, title), rowEl
            },
            _updateFirstRow: function(rowEl, title) {
                var firstCell = rowEl.find("td").first(),
                    textEl = firstCell.find("." + CLS_GRID_CELL_INNER);
                if (textEl.length) {
                    var textPrefix = title + ": ";
                    text = textEl.text(), text.indexOf(textPrefix) === -1 && (text = textPrefix + text), firstCell.html(getInnerTemplate(text))
                } else firstCell.html(getInnerTemplate(title + ":"))
            },
            _getSummaryTpl: function(summary) {
                var _self = this,
                    grid = _self.get("grid"),
                    columns = grid.get("columns"),
                    cellTempArray = [],
                    prePosition = -1,
                    currentPosition = -1,
                    rowTemplate = null;
                return $.each(columns, function(colindex, column) {
                    if (column.get("visible") && (currentPosition += 1, column.get("summary"))) {
                        cellTempArray.push(getEmptyCellTemplate(currentPosition - prePosition - 1));
                        var text = _self._getSummaryCellText(column, summary),
                            temp = getCellTemplate(text, column.get("id"));
                        cellTempArray.push(temp), prePosition = currentPosition
                    }
                }), prePosition !== currentPosition && cellTempArray.push(getEmptyCellTemplate(currentPosition - prePosition)), rowTemplate = ['<tr class="', CLS_SUMMARY_ROW, " ", CLS_GRID_ROW, '">', cellTempArray.join(""), getLastEmptyCell(), "</tr>"].join("")
            },
            _getSummaryCellText: function(column, summary) {
                var val = summary[column.get("dataIndex")],
                    value = null == val ? "" : val,
                    renderer = column.get("renderer"),
                    text = renderer ? renderer(value, summary) : value;
                return text
            },
            _calculatePageSummary: function() {
                var _self = this,
                    grid = _self.get("grid"),
                    store = grid.get("store"),
                    columns = grid.get("columns"),
                    rst = {};
                return BUI.each(columns, function(column) {
                    if (column.get("summary")) {
                        var dataIndex = column.get("dataIndex");
                        rst[dataIndex] = store.sum(dataIndex)
                    }
                }), rst
            }
        }), summary
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function Editing(config) {
            Editing.superclass.constructor.call(this, config)
        }
        var CLS_CELL_INNER = BUI.prefix + "grid-cell-inner",
            CLS_CELL_ERROR = BUI.prefix + "grid-cell-error";
        return BUI.extend(Editing, BUI.Base), Editing.ATTRS = {
            align: {
                value: {
                    points: ["cl", "cl"]
                }
            },
            showError: {
                value: !0
            },
            errorTpl: {
                value: '<span class="x-icon ' + CLS_CELL_ERROR + ' x-icon-mini x-icon-error" title="{error}">!</span>'
            },
            isInitEditors: {
                value: !1
            },
            record: {},
            curEditor: {},
            hasValid: {},
            editors: {
                shared: !1,
                value: []
            },
            triggerCls: {},
            triggerSelected: {
                value: !0
            }
        }, BUI.augment(Editing, {
            initializer: function(grid) {
                var _self = this;
                _self.set("grid", grid), _self.initEditing(grid)
            },
            renderUI: function() {
                var _self = this,
                    grid = _self.get("grid");
                BUI.use("bui/editor", function(Editor) {
                    _self.initEditors(Editor), _self._initGridEvent(grid), _self.set("isInitEditors", !0)
                })
            },
            initEditing: function(grid) {},
            _getCurEditor: function() {
                return this.get("curEditor")
            },
            _initGridEvent: function(grid) {
                function validRow(record, row) {
                    _self.get("hasValid") && _self.validRecord(record, _self.getFields(), $(row))
                }
                var _self = this,
                    header = grid.get("header");
                grid.on("cellclick", function(ev) {
                    var editor = null,
                        domTarget = ev.domTarget,
                        triggerCls = _self.get("triggerCls"),
                        curEditor = _self._getCurEditor();
                    if (curEditor && curEditor.get("acceptEvent") ? (curEditor.accept(), curEditor.hide()) : curEditor && curEditor.cancel(), editor = _self.getEditor(ev.field), editor && $(domTarget).closest("." + triggerCls).length && (_self.showEditor(editor, ev), !_self.get("triggerSelected"))) return !1
                }), grid.on("rowcreated", function(ev) {
                    validRow(ev.record, ev.row)
                }), grid.on("rowremoved", function(ev) {
                    _self.get("record") == ev.record && _self.cancel()
                }), grid.on("rowupdated", function(ev) {
                    validRow(ev.record, ev.row)
                }), grid.on("scroll", function(ev) {
                    var editor = _self._getCurEditor();
                    if (editor) {
                        var align = editor.get("align"),
                            node = align.node,
                            pos = node.position();
                        pos.top < 0 || pos.top > ev.bodyHeight ? editor.hide() : (editor.set("align", align), editor.show())
                    }
                }), header.on("afterVisibleChange", function(ev) {
                    if (ev.target && ev.target != header) {
                        var column = ev.target;
                        _self.onColumnVisibleChange(column)
                    }
                })
            },
            initEditors: function(Editor) {
                var _self = this,
                    grid = _self.get("grid"),
                    fields = [],
                    columns = grid.get("columns");
                BUI.each(columns, function(column) {
                    var field = _self.getFieldConfig(column);
                    field && (field.name = column.get("dataIndex"), field.id = column.get("id"), field.validator && (field.validator = _self.wrapValidator(field.validator)), fields.push(field))
                });
                var cfgs = _self.getEditorCfgs(fields);
                BUI.each(cfgs, function(cfg) {
                    _self.initEidtor(cfg, Editor)
                })
            },
            getFieldConfig: function(column) {
                return column.get("editor")
            },
            wrapValidator: function(validator) {
                var _self = this;
                return function(value) {
                    var record = _self.get("record");
                    return validator(value, record)
                }
            },
            onColumnVisibleChange: function(column) {},
            getEditorCfgs: function(fields) {},
            getEditorConstructor: function(Editor) {
                return Editor.Editor
            },
            initEidtor: function(cfg, Editor) {
                var _self = this,
                    con = _self.getEditorConstructor(Editor),
                    editor = new con(cfg);
                return editor.render(), _self.get("editors").push(editor), _self.bindEidtor(editor), editor
            },
            bindEidtor: function(editor) {
                var _self = this,
                    grid = _self.get("grid"),
                    store = grid.get("store");
                editor.on("accept", function() {
                    var record = _self.get("record");
                    _self.updateRecord(store, record, editor), _self.fire("accept", {
                        editor: editor,
                        record: record
                    }), _self.set("curEditor", null)
                }), editor.on("cancel", function() {
                    _self.fire("cancel", {
                        editor: editor,
                        record: _self.get("record")
                    }), _self.set("curEditor", null)
                })
            },
            getEditor: function(options) {},
            getAlignNode: function(options) {},
            getEditValue: function(options) {},
            showEditor: function(editor, options) {
                var _self = this,
                    value = _self.getEditValue(options),
                    alignNode = _self.getAlignNode(options);
                if (_self.beforeShowEditor(editor, options), _self.set("record", options.record), editor.setValue(value), alignNode) {
                    var align = _self.get("align");
                    align.node = alignNode, editor.set("align", align)
                }
                editor.show(), _self.focusEditor(editor, options.field), _self.set("curEditor", editor), _self.fire("editorshow", {
                    editor: editor
                })
            },
            focusEditor: function(editor, field) {
                editor.focus()
            },
            beforeShowEditor: function(editor, options) {},
            _createEditOptions: function(record, field) {
                var _self = this,
                    grid = _self.get("grid"),
                    rowEl = grid.findRow(record),
                    column = grid.findColumnByField(field),
                    cellEl = grid.findCell(column.get("id"), rowEl);
                return {
                    record: record,
                    field: field,
                    cell: cellEl[0],
                    row: rowEl[0]
                }
            },
            valid: function() {
                var _self = this,
                    grid = _self.get("grid"),
                    store = grid.get("store");
                if (store) {
                    var records = store.getResult();
                    BUI.each(records, function(record) {
                        _self.validRecord(record, _self.getFields())
                    })
                }
                _self.set("hasValid", !0)
            },
            isValid: function() {
                var _self = this,
                    grid = _self.get("grid");
                return _self.get("hasValid") || _self.valid(), !grid.get("el").find("." + CLS_CELL_ERROR).length
            },
            clearErrors: function() {
                var _self = this,
                    grid = _self.get("grid");
                grid.get("el").find("." + CLS_CELL_ERROR).remove()
            },
            getFields: function(editors) {},
            validRecord: function(record, fields, row) {
                var _self = this,
                    errors = [];
                _self.setInternal("record", record), fields = fields || _self.getFields(), BUI.each(fields, function(field) {
                    var name = field.get("name"),
                        value = record[name] || "",
                        error = field.getValidError(value);
                    error && errors.push({
                        name: name,
                        error: error,
                        id: field.get("id")
                    })
                }), _self.showRecordError(record, errors, row)
            },
            showRecordError: function(record, errors, row) {
                var _self = this,
                    grid = _self.get("grid");
                row = row || grid.findRow(record), row && (_self._clearRowError(row), BUI.each(errors, function(item) {
                    var cell = grid.findCell(item.id, row);
                    _self._showCellError(cell, item.error)
                }))
            },
            updateRecord: function(store, record, editor) {},
            _clearRowError: function(row) {
                row.find("." + CLS_CELL_ERROR).remove()
            },
            _showCellError: function(cell, error) {
                var _self = this,
                    errorTpl = BUI.substitute(_self.get("errorTpl"), {
                        error: error
                    }),
                    innerEl = cell.find("." + CLS_CELL_INNER);
                $(errorTpl).appendTo(innerEl)
            },
            edit: function(record, field) {
                var _self = this,
                    options = _self._createEditOptions(record, field),
                    editor = _self.getEditor(field);
                _self.showEditor(editor, options)
            },
            cancel: function() {
                var _self = this,
                    editors = _self.get("editors");
                BUI.each(editors, function(editor) {
                    editor.get("visible") && editor.cancel()
                }), _self.set("curEditor", null), _self.set("record", null)
            },
            destructor: function() {
                var _self = this,
                    editors = _self.get("editors");
                BUI.each(editors, function(editor) {
                    editor.destroy || editor.destroy()
                }), _self.off(), _self.clearAttrVals()
            }
        }), Editing
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var Editing = require("bui/grid/plugins/editing"),
            CLS_BODY = BUI.prefix + "grid-body",
            CLS_CELL = BUI.prefix + "grid-cell",
            CellEditing = function(config) {
                CellEditing.superclass.constructor.call(this, config)
            };
        return CellEditing.ATTRS = {
            triggerCls: {
                value: CLS_CELL
            }
        }, BUI.extend(CellEditing, Editing), BUI.augment(CellEditing, {
            getEditorCfgs: function(fields) {
                var _self = this,
                    grid = _self.get("grid"),
                    bodyNode = grid.get("el").find("." + CLS_BODY),
                    rst = [];
                return BUI.each(fields, function(field) {
                    var cfg = {
                        field: field,
                        changeSourceEvent: null,
                        hideExceptNode: bodyNode,
                        autoUpdate: !1,
                        preventHide: !1,
                        editableFn: field.editableFn
                    };
                    "checkbox" === field.xtype && (cfg.innerValueField = "checked"), rst.push(cfg)
                }), rst
            },
            getEditor: function(field) {
                if (!field) return null;
                var _self = this,
                    editors = _self.get("editors"),
                    editor = null;
                return BUI.each(editors, function(item) {
                    if (item.get("field").get("name") === field) return editor = item, !1
                }), editor
            },
            beforeShowEditor: function(editor, options) {
                var _self = this,
                    cell = $(options.cell);
                _self.resetWidth(editor, cell.outerWidth()), _self._makeEnable(editor, options)
            },
            _makeEnable: function(editor, options) {
                var field, enable, record, editableFn = editor.get("editableFn");
                BUI.isFunction(editableFn) && (field = options.field, record = options.record, record && field && (enable = editableFn(record[field], record), enable ? editor.get("field").enable() : editor.get("field").disable()))
            },
            resetWidth: function(editor, width) {
                editor.set("width", width)
            },
            updateRecord: function(store, record, editor) {
                var value = editor.getValue(),
                    fieldName = editor.get("field").get("name"),
                    preValue = record[fieldName];
                value = BUI.isDate(value) ? value.getTime() : value, preValue !== value && store.setValue(record, fieldName, value)
            },
            getAlignNode: function(options) {
                return $(options.cell)
            },
            getFields: function() {
                var rst = [],
                    _self = this,
                    editors = _self.get("editors");
                return BUI.each(editors, function(editor) {
                    rst.push(editor.get("field"))
                }), rst
            },
            getEditValue: function(options) {
                if (options.record && options.field) {
                    var value = options.record[options.field];
                    return null == value ? "" : value
                }
                return ""
            }
        }), CellEditing
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Editing = require("bui/grid/plugins/editing"),
            CLS_ROW = BUI.prefix + "grid-row",
            RowEditing = function(config) {
                RowEditing.superclass.constructor.call(this, config)
            };
        return RowEditing.ATTRS = {
            autoSave: {
                value: !1
            },
            align: {
                value: {
                    points: ["tl", "tl"],
                    offset: [-2, 0]
                }
            },
            triggerCls: {
                value: CLS_ROW
            }
        }, BUI.extend(RowEditing, Editing), BUI.augment(RowEditing, {
            getEditorCfgs: function(fields) {
                var rst = [];
                return rst.push({
                    changeSourceEvent: null,
                    autoUpdate: !1,
                    form: {
                        children: fields,
                        buttonBar: {
                            elCls: "centered toolbar"
                        }
                    }
                }), rst
            },
            wrapValidator: function(validator) {
                var _self = this;
                return function(value) {
                    var editor = _self.get("curEditor"),
                        origin = _self.get("record"),
                        record = editor ? editor.getValue() : origin;
                    if (record) return validator(value, record, origin)
                }
            },
            focusEditor: function(editor, field) {
                var form = editor.get("form"),
                    control = form.getField(field);
                control && control.focus()
            },
            getFieldConfig: function(column) {
                var editor = column.get("editor");
                if (editor) return "checkbox" === editor.xtype && (editor.innerValueField = "checked"), editor;
                var cfg = {
                    xtype: "plain"
                };
                return column.get("dataIndex") && column.get("renderer") && (cfg.renderer = column.get("renderer")), cfg
            },
            updateRecord: function(store, record, editor) {
                var _self = this,
                    value = editor.getValue();
                BUI.each(value, function(v, k) {
                    BUI.isDate(v) && (value[k] = v.getTime())
                }), BUI.mix(record, value), store.update(record), _self.get("autoSave") && store.save(record)
            },
            getEditor: function(field) {
                var _self = this,
                    editors = _self.get("editors");
                return editors[0]
            },
            onColumnVisibleChange: function(column) {
                var _self = this,
                    id = column.get("id"),
                    editor = _self.getEditor(),
                    field = editor.getChild(id, !0);
                field && field.set("visible", column.get("visible"))
            },
            beforeShowEditor: function(editor, options) {
                var _self = this,
                    grid = _self.get("grid"),
                    columns = grid.get("columns"),
                    form = editor.get("form"),
                    row = $(options.row);
                editor.set("width", row.width()), BUI.each(columns, function(column) {
                    var fieldName = column.get("dataIndex"),
                        field = form.getField(fieldName);
                    if (column.get("visible")) {
                        var width = column.get("el").outerWidth() - field.getAppendWidth();
                        field.set("width", width)
                    } else field && field.set("visible", !1)
                })
            },
            getEditValue: function(options) {
                return options.record
            },
            getEditorConstructor: function(Editor) {
                return Editor.RecordEditor
            },
            getAlignNode: function(options) {
                return $(options.row)
            },
            getFields: function() {
                var _self = this,
                    editors = _self.get("editors");
                return editors[0].get("form").get("children")
            }
        }), RowEditing
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function Dialog(config) {
            Dialog.superclass.constructor.call(this, config)
        }
        var BUI = require("bui/common"),
            TYPE_ADD = "add",
            TYPE_EDIT = "edit";
        return Dialog.ATTRS = {
            autoSave: {
                value: !1
            },
            record: {},
            curIndex: {},
            contentId: {},
            editor: {},
            form: {},
            events: {
                value: {
                    recordchange: !1
                }
            },
            editType: {}
        }, BUI.extend(Dialog, BUI.Base), BUI.augment(Dialog, {
            initializer: function(grid) {
                var _self = this;
                _self.set("grid", grid), BUI.use("bui/editor", function(Editor) {
                    _self._initEditor(Editor)
                })
            },
            bindUI: function(grid) {
                var _self = this,
                    triggerCls = _self.get("triggerCls");
                triggerCls && grid.on("cellclick", function(ev) {
                    var sender = $(ev.domTarget),
                        editor = _self.get("editor");
                    if (sender.hasClass(triggerCls) && editor && (_self.edit(ev.record), grid.get("multipleSelect"))) return !1
                })
            },
            _initEditor: function(Editor) {
                var _self = this,
                    contentId = _self.get("contentId"),
                    formNode = $("#" + contentId).find("form"),
                    editor = _self.get("editor"),
                    cfg = BUI.merge(editor, {
                        contentId: contentId,
                        form: {
                            srcNode: formNode
                        }
                    });
                editor = new Editor.DialogEditor(cfg), _self._bindEditor(editor), _self.set("editor", editor), _self.set("form", editor.get("form"))
            },
            _bindEditor: function(editor) {
                var _self = this;
                editor.on("accept", function() {
                    var form = editor.get("form"),
                        record = form.serializeToObject();
                    _self.saveRecord(record), _self.fire("accept", {
                        editor: editor,
                        record: _self.get("record"),
                        form: form
                    })
                }), editor.on("cancel", function() {
                    _self.fire("cancel", {
                        editor: editor,
                        record: _self.get("record"),
                        form: editor.get("form")
                    })
                })
            },
            edit: function(record) {
                var _self = this;
                _self.set("editType", TYPE_EDIT), _self.showEditor(record)
            },
            add: function(record, index) {
                var _self = this;
                _self.set("editType", TYPE_ADD), _self.set("curIndex", index), _self.showEditor(record)
            },
            saveRecord: function(record) {
                var _self = this,
                    grid = _self.get("grid"),
                    editType = _self.get("editType"),
                    curIndex = _self.get("curIndex"),
                    store = grid.get("store"),
                    curRecord = _self.get("record");
                BUI.mix(curRecord, record), editType == TYPE_ADD ? null != curIndex ? store.addAt(curRecord, curIndex) : store.add(curRecord) : store.update(curRecord), _self.get("autoSave") && store.save(curRecord)
            },
            showEditor: function(record) {
                var _self = this,
                    editor = _self.get("editor");
                _self.set("record", record), editor.show(), editor.setValue(record, !0), _self.fire("recordchange", {
                    record: record,
                    editType: _self.get("editType")
                }), _self.fire("editorshow", {
                    eidtor: editor,
                    editType: _self.get("editType")
                })
            },
            cancel: function() {
                var _self = this,
                    editor = _self.get("editor");
                editor.cancel()
            },
            destructor: function() {
                var _self = this,
                    editor = _self.get("editor");
                editor && editor.destroy(), _self.off(), _self.clearAttrVals()
            }
        }), Dialog
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function RowNumber(config) {
            RowNumber.superclass.constructor.call(this, config)
        }
        var CLS_NUMBER = "x-grid-rownumber";
        return BUI.extend(RowNumber, BUI.Base), RowNumber.ATTRS = {
            width: {
                value: 40
            },
            column: {}
        }, BUI.augment(RowNumber, {
            createDom: function(grid) {
                var _self = this,
                    cfg = {
                        title: "",
                        width: _self.get("width"),
                        fixed: !0,
                        resizable: !1,
                        sortable: !1,
                        renderer: function(value, obj, index) {
                            return index + 1
                        },
                        elCls: CLS_NUMBER
                    },
                    column = grid.addColumn(cfg, 0);
                _self.set("column", column)
            }
        }), RowNumber
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Tree = BUI.namespace("Tree");
        return BUI.mix(Tree, {
            TreeList: require("bui/tree/treelist"),
            Mixin: require("bui/tree/treemixin"),
            TreeMenu: require("bui/tree/treemenu")
        }), Tree
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function makeSureNode(self, node) {
            return BUI.isString(node) && (node = self.findNode(node)), node
        }
        var BUI = require("bui/common"),
            Data = require("bui/data"),
            EXPAND = "expanded",
            LOADING = "loading",
            CHECKED = "checked",
            PARTIAL_CHECKED = "partial-checked",
            MAP_TYPES = {
                NONE: "none",
                ALL: "all",
                CUSTOM: "custom",
                ONLY_LEAF: "onlyLeaf"
            },
            CLS_ICON = "x-tree-icon",
            CLS_ELBOW = "x-tree-elbow",
            CLS_SHOW_LINE = "x-tree-show-line",
            CLS_ICON_PREFIX = CLS_ELBOW + "-",
            CLS_ICON_WRAPER = CLS_ICON + "-wraper",
            CLS_LINE = CLS_ICON_PREFIX + "line",
            CLS_END = CLS_ICON_PREFIX + "end",
            CLS_EMPTY = CLS_ICON_PREFIX + "empty",
            CLS_EXPANDER = CLS_ICON_PREFIX + "expander",
            CLS_CHECKBOX = CLS_ICON + "-checkbox",
            CLS_RADIO = CLS_ICON + "-radio",
            CLS_EXPANDER_END = CLS_EXPANDER + "-end",
            Mixin = function() {};
        return Mixin.ATTRS = {
            store: {
                getter: function(v) {
                    if (!v) {
                        var _self = this,
                            store = new Data.TreeStore({
                                root: _self.get("root"),
                                data: _self.get("nodes")
                            });
                        return _self.setInternal("store", store), store
                    }
                    return v
                }
            },
            root: {},
            nodes: {
                sync: !1
            },
            iconContainer: {},
            iconWraperTpl: {
                value: '<span class="' + CLS_ICON_WRAPER + '">{icons}</span>'
            },
            showLine: {
                value: !1
            },
            showIcons: {
                value: !0
            },
            iconTpl: {
                value: '<span class="x-tree-icon {cls}"></span>'
            },
            leafCls: {
                value: CLS_ICON_PREFIX + "leaf"
            },
            dirCls: {
                value: CLS_ICON_PREFIX + "dir"
            },
            checkType: {
                value: "custom"
            },
            accordion: {
                value: !1
            },
            multipleCheck: {
                value: !0
            },
            checkedField: {
                valueFn: function() {
                    return this.getStatusField("checked")
                }
            },
            checkableField: {
                value: "checkable"
            },
            itemStatusFields: {
                value: {
                    expanded: "expanded",
                    disabled: "disabled",
                    checked: "checked"
                }
            },
            dirSelectable: {
                value: !0
            },
            showRoot: {
                value: !1
            },
            events: {
                value: {
                    expanded: !1,
                    collapsed: !1,
                    checkedchange: !1
                }
            },
            expandEvent: {
                value: "itemdblclick"
            },
            expandAnimate: {
                value: !1
            },
            collapseEvent: {
                value: "itemdblclick"
            },
            startLevel: {
                value: 1
            }
        }, BUI.augment(Mixin, {
            collapseAll: function() {
                var _self = this,
                    elements = _self.get("view").getAllElements();
                BUI.each(elements, function(element) {
                    var item = _self.getItemByElement(element);
                    item && _self._collapseNode(item, element, !0)
                })
            },
            collapseNode: function(node) {
                var element, _self = this;
                BUI.isString(node) && (node = _self.findNode(node)), node && (element = _self.findElement(node), _self._collapseNode(node, element))
            },
            expandAll: function() {
                var _self = this,
                    elements = _self.get("view").getAllElements();
                BUI.each(elements, function(element) {
                    var item = _self.getItemByElement(element);
                    _self._expandNode(item, element, !0)
                })
            },
            expandNode: function(node, deep) {
                var element, _self = this;
                BUI.isString(node) && (node = _self.findNode(node)), node && (node.parent && !_self.isExpanded(node.parent) && _self.expandNode(node.parent), element = _self.findElement(node), _self._expandNode(node, element, deep))
            },
            expandPath: function(path, async, startIndex) {
                if (path) {
                    startIndex = startIndex || 0;
                    var preNode, node, i, id, _self = this,
                        store = _self.get("store"),
                        arr = path.split(",");
                    for (preNode = _self.findNode(arr[startIndex]), i = startIndex + 1; i < arr.length; i++)
                        if (id = arr[i], node = _self.findNode(id, preNode), preNode && node) _self.expandNode(preNode), preNode = node;
                        else if (preNode && async) {
                        store.load({
                            id: preNode.id
                        }, function() {
                            node = _self.findNode(id, preNode), node && _self.expandPath(path, async, i)
                        });
                        break
                    }
                }
            },
            findNode: function(id, parent) {
                return this.get("store").findNode(id, parent)
            },
            getCheckedLeaf: function(parent) {
                var _self = this,
                    store = _self.get("store");
                return store.findNodesBy(function(node) {
                    return node.leaf && _self.isChecked(node)
                }, parent)
            },
            getCheckedNodes: function(parent) {
                var _self = this,
                    store = _self.get("store");
                return store.findNodesBy(function(node) {
                    return _self.isChecked(node)
                }, parent)
            },
            isItemSelectable: function(item) {
                var _self = this,
                    dirSelectable = _self.get("dirSelectable"),
                    node = item;
                return !(node && !dirSelectable && !node.leaf)
            },
            isExpanded: function(node) {
                if (!node || node.leaf) return !1;
                var element, _self = this;
                return !(!_self._isRoot(node) || _self.get("showRoot")) || (BUI.isString(node) && (item = _self.getItem(node)), element = _self.findElement(node), this._isExpanded(node, element))
            },
            isChecked: function(node) {
                return !!node && !!node[this.get("checkedField")]
            },
            toggleExpand: function(node) {
                var element, _self = this;
                BUI.isString(node) && (item = _self.getItem(node)), element = _self.findElement(node), _self._toggleExpand(node, element)
            },
            setNodeChecked: function(node, checked, deep) {
                if (deep = null == deep || deep, node) {
                    var parent, element, _self = this,
                        multipleCheck = _self.get("multipleCheck");
                    if (node = makeSureNode(this, node), node && (parent = node.parent, _self.isCheckable(node))) {
                        if (_self.isChecked(node) !== checked || _self.hasStatus(node, "checked") !== checked) {
                            if (element = _self.findElement(node), element ? (_self.setItemStatus(node, CHECKED, checked, element), multipleCheck ? _self._resetPatialChecked(node, checked, checked, element) : checked && parent && _self.isChecked(parent) != checked && _self.setNodeChecked(parent, checked, !1)) : _self.isItemDisabled(node) || _self.setStatusValue(node, "checked", checked), parent && (_self.isChecked(parent) != checked ? _self._resetParentChecked(parent) : multipleCheck && _self._resetPatialChecked(parent, null, null, null, !0)), checked && !multipleCheck && (_self.isChecked(parent) || parent == _self.get("root"))) {
                                var nodes = parent.children;
                                BUI.each(nodes, function(slibNode) {
                                    slibNode !== node && _self.isChecked(slibNode) && _self.setNodeChecked(slibNode, !1)
                                })
                            }
                            _self.fire("checkedchange", {
                                node: node,
                                element: element,
                                checked: checked
                            })
                        }!node.leaf && deep && BUI.each(node.children, function(subNode, index) {
                            (multipleCheck || !checked || !multipleCheck && 0 == index) && _self.setNodeChecked(subNode, checked, deep)
                        })
                    }
                }
            },
            setChecked: function(node) {
                this.setNodeChecked(node, !0)
            },
            clearAllChecked: function() {
                var _self = this,
                    nodes = _self.getCheckedNodes();
                BUI.each(nodes, function(node) {
                    _self.setNodeChecked(node, !1)
                })
            },
            _initRoot: function() {
                var root, nodes, _self = this,
                    store = _self.get("store"),
                    showRoot = _self.get("showRoot");
                store && (root = store.get("root"), _self.setInternal("root", root), nodes = showRoot ? [root] : root.children, BUI.each(nodes, function(subNode) {
                    _self._initChecked(subNode, !0)
                }), _self.clearItems(), _self.addItems(nodes))
            },
            _initChecked: function(node, deep) {
                var parent, _self = this,
                    checkType = _self.get("checkType"),
                    checkedField = _self.get("checkedField"),
                    multipleCheck = _self.get("multipleCheck"),
                    checkableField = _self.get("checkableField");
                return checkType === MAP_TYPES.NONE ? (node[checkableField] = !1, void(node[checkedField] = !1)) : checkType === MAP_TYPES.ONLY_LEAF ? void(node.leaf ? node[checkableField] = !0 : (node[checkableField] = !1, node[checkedField] = !1, deep && BUI.each(node.children, function(subNode) {
                    _self._initChecked(subNode, deep)
                }))) : (checkType === MAP_TYPES.CUSTOM && null == node[checkableField] && (node[checkableField] = null != node[checkedField]), checkType === MAP_TYPES.ALL && (node[checkableField] = !0), void(node && _self.isCheckable(node) && (parent = node.parent, _self.isChecked(node) || (parent && _self.isChecked(parent) && (!multipleCheck && _self._hasChildChecked(parent) || _self.setStatusValue(node, "checked", !0)), (node.children && node.children.length && _self._isAllChildrenChecked(node) || !multipleCheck && _self._hasChildChecked(node)) && _self.setStatusValue(node, "checked", !0)), deep && BUI.each(node.children, function(subNode) {
                    _self._initChecked(subNode, deep)
                }))))
            },
            _resetPatialChecked: function(node, checked, hasChecked, element, upper) {
                if (!node || node.leaf) return !0;
                var hasChecked, _self = this;
                return (checked = null == checked ? _self.isChecked(node) : checked) ? void _self.setItemStatus(node, PARTIAL_CHECKED, !1, element) : (hasChecked = null == hasChecked ? _self._hasChildChecked(node) : hasChecked, _self.setItemStatus(node, PARTIAL_CHECKED, hasChecked, element), void(upper && node.parent && _self._resetPatialChecked(node.parent, !1, hasChecked ? hasChecked : null, null, upper)))
            },
            _resetParentChecked: function(parentNode) {
                if (this.isCheckable(parentNode)) {
                    var _self = this,
                        multipleCheck = _self.get("multipleCheck"),
                        allChecked = multipleCheck ? _self._isAllChildrenChecked(parentNode) : _self._hasChildChecked(parentNode);
                    _self.setStatusValue(parentNode, "checked", allChecked), _self.setNodeChecked(parentNode, allChecked, !1), multipleCheck && _self._resetPatialChecked(parentNode, allChecked, null, null)
                }
            },
            __bindUI: function() {
                var _self = this,
                    multipleCheck = (_self.get("el"), _self.get("multipleCheck"));
                _self.on("itemclick", function(ev) {
                    var sender = $(ev.domTarget),
                        element = ev.element,
                        node = ev.item;
                    if (sender.hasClass(CLS_EXPANDER)) return _self._toggleExpand(node, element), !1;
                    if (sender.hasClass(CLS_CHECKBOX)) {
                        var checked = _self.isChecked(node);
                        _self.setNodeChecked(node, !checked)
                    } else sender.hasClass(CLS_RADIO) && _self.setNodeChecked(node, !0)
                }), _self.on("itemrendered", function(ev) {
                    var node = ev.item,
                        element = ev.domTarget;
                    _self._resetIcons(node, element), _self.isCheckable(node) && multipleCheck && _self._resetPatialChecked(node, null, null, element), _self._isExpanded(node, element) && _self._showChildren(node)
                }), _self._initExpandEvent()
            },
            _initExpandEvent: function() {
                function createCallback(methodName) {
                    return function(ev) {
                        var sender = $(ev.domTarget),
                            element = ev.element,
                            node = ev.item;
                        sender.hasClass(CLS_EXPANDER) || _self[methodName](node, element)
                    }
                }
                var _self = this,
                    expandEvent = (_self.get("el"), _self.get("expandEvent")),
                    collapseEvent = _self.get("collapseEvent");
                expandEvent == collapseEvent ? _self.on(expandEvent, createCallback("_toggleExpand")) : (expandEvent && _self.on(expandEvent, createCallback("_expandNode")), collapseEvent && _self.on(collapseEvent, createCallback("_collapseNode")))
            },
            _isForceChecked: function(node) {
                var _self = this,
                    multipleCheck = _self.get("multipleCheck");
                return multipleCheck ? _self._isAllChildrenChecked() : _isForceChecked()
            },
            _isAllChildrenChecked: function(node) {
                if (!node || node.leaf) return !1;
                var _self = this,
                    children = node.children,
                    rst = !0;
                return BUI.each(children, function(subNode) {
                    if (rst = rst && _self.isChecked(subNode), !rst) return !1
                }), rst
            },
            _hasChildChecked: function(node) {
                if (!node || node.leaf) return !1;
                var _self = this;
                return 0 != _self.getCheckedNodes(node).length
            },
            _isRoot: function(node) {
                var _self = this,
                    store = _self.get("store");
                return !(!store || store.get("root") != node)
            },
            _setLoadStatus: function(node, element, loading) {
                var _self = this;
                _self.setItemStatus(node, LOADING, loading, element)
            },
            _beforeLoadNode: function(node) {
                var element, _self = this;
                BUI.isString(node) && (node = _self.findNode(node)), element = _self.findElement(node), element ? (_self._collapseNode(node, element), _self._setLoadStatus(node, element, !0)) : node && BUI.each(node.children, function(subNode) {
                    _self._removeNode(subNode)
                })
            },
            onBeforeLoad: function(e) {
                var _self = this,
                    params = e.params,
                    id = params.id,
                    node = _self.findNode(id) || _self.get("root");
                _self._beforeLoadNode(node)
            },
            _addNode: function(node, index) {
                var scount, prevNode, cIndex, _self = this,
                    parent = node.parent;
                _self._initChecked(node, !0), parent ? (_self.isExpanded(parent) && (scount = parent.children.length, cIndex = _self._getInsetIndex(node), _self.addItemAt(node, cIndex), index == scount - 1 && index > 0 && (prevNode = parent.children[index - 1], _self._updateIcons(prevNode))), _self._updateIcons(parent)) : (cIndex = _self._getInsetIndex(node), _self.addItemAt(node, cIndex), prevNode = _self.get("nodes")[index - 1], _self._updateIcons(prevNode))
            },
            _getInsetIndex: function(node) {
                var nextNode, _self = this;
                return nextNode = _self._getNextItem(node), nextNode ? _self.indexOfItem(nextNode) : _self.getItemCount()
            },
            _getNextItem: function(item) {
                var slibings, cIndex, _self = this,
                    parent = item.parent,
                    rst = null;
                return parent ? (slibings = parent.children, cIndex = BUI.Array.indexOf(item, slibings), rst = slibings[cIndex + 1], rst || _self._getNextItem(parent)) : null
            },
            onAdd: function(e) {
                var _self = this,
                    node = e.node,
                    index = e.index;
                _self._addNode(node, index)
            },
            _updateNode: function(node) {
                var _self = this;
                _self.updateItem(node), _self._updateIcons(node)
            },
            onUpdate: function(e) {
                var _self = this,
                    node = e.node;
                _self._updateNode(node)
            },
            _removeNode: function(node, index) {
                var scount, prevNode, _self = this,
                    parent = node.parent;
                _self.collapseNode(node), parent && (_self.removeItem(node), _self.isExpanded(parent) && (scount = parent.children.length, scount == index && 0 !== index && (prevNode = parent.children[index - 1], _self._updateIcons(prevNode))), _self._updateIcons(parent), _self._resetParentChecked(parent))
            },
            onRemove: function(e) {
                var _self = this,
                    node = e.node,
                    index = e.index;
                _self._removeNode(node, index)
            },
            _loadNode: function(node) {
                var _self = this;
                _self._initChecked(node, !0), _self.expandNode(node), _self._updateIcons(node), _self.setItemStatus(node, LOADING, !1)
            },
            __syncUI: function() {
                var _self = this,
                    store = _self.get("store"),
                    showRoot = _self.get("showRoot");
                showRoot && !store.hasData() && _self._initRoot()
            },
            onLoad: function(e) {
                var _self = this,
                    store = _self.get("store"),
                    root = store.get("root");
                e && e.node != root || _self._initRoot(), e && e.node && _self._loadNode(e.node)
            },
            _isExpanded: function(node, element) {
                return this.hasStatus(node, EXPAND, element)
            },
            _getIconsTpl: function(node) {
                var i, _self = this,
                    level = node.level,
                    start = _self.get("startLevel"),
                    iconWraperTpl = _self.get("iconWraperTpl"),
                    icons = [];
                for (i = start; i < level; i += 1) icons.push(_self._getLevelIcon(node, i));
                return icons.push(_self._getExpandIcon(node)), icons.push(_self._getCheckedIcon(node)), icons.push(_self._getNodeTypeIcon(node)), BUI.substitute(iconWraperTpl, {
                    icons: icons.join("")
                })
            },
            _getCheckedIcon: function(node) {
                var cls, _self = this,
                    checkable = _self.isCheckable(node);
                return checkable ? (cls = _self.get("multipleCheck") ? CLS_CHECKBOX : CLS_RADIO, _self._getIcon(cls)) : ""
            },
            isCheckable: function(node) {
                return node[this.get("checkableField")]
            },
            _getExpandIcon: function(node) {
                var _self = this,
                    cls = CLS_EXPANDER;
                return node.leaf ? _self._getLevelIcon(node) : (_self._isLastNode(node) && (cls = cls + " " + CLS_EXPANDER_END), _self._getIcon(cls))
            },
            _getNodeTypeIcon: function(node) {
                var _self = this,
                    cls = node.cls ? node.cls : node.leaf ? _self.get("leafCls") : _self.get("dirCls");
                return _self._getIcon(cls)
            },
            _getLevelIcon: function(node, level) {
                var levelNode, _self = this,
                    showLine = _self.get("showLine"),
                    cls = CLS_EMPTY;
                return showLine && (node.level === level || null == level ? cls = _self._isLastNode(node) ? CLS_END : CLS_ELBOW : (levelNode = _self._getParentNode(node, level), cls = _self._isLastNode(levelNode) ? CLS_EMPTY : CLS_LINE)), _self._getIcon(cls)
            },
            _getParentNode: function(node, level) {
                var nodeLevel = node.level,
                    parent = node.parent,
                    i = nodeLevel - 1;
                if (nodeLevel <= level) return null;
                for (; i > level;) parent = parent.parent, i -= 1;
                return parent
            },
            _getIcon: function(cls) {
                var _self = this,
                    iconTpl = _self.get("iconTpl");
                return BUI.substitute(iconTpl, {
                    cls: cls
                })
            },
            _isLastNode: function(node) {
                if (!node) return !1;
                if (node == this.get("root")) return !0;
                var count, _self = this,
                    parent = node.parent,
                    siblings = parent ? parent.children : _self.get("nodes");
                return count = siblings.length, siblings[count - 1] === node
            },
            _initNodes: function(nodes, level, parent) {
                var _self = this;
                BUI.each(nodes, function(node) {
                    node.level = level, null == node.leaf && (node.leaf = !node.children), parent && !node.parent && (node.parent = parent), _self._initChecked(node), node.children && _self._initNodes(node.children, level + 1, node)
                })
            },
            _collapseNode: function(node, element, deep) {
                var _self = this;
                node.leaf || _self.hasStatus(node, EXPAND, element) && (_self.setItemStatus(node, EXPAND, !1, element), deep ? (_self._collapseChildren(node, deep), _self.removeItems(node.children)) : _self._hideChildrenNodes(node), _self.fire("collapsed", {
                    node: node,
                    element: element
                }))
            },
            _hideChildrenNodes: function(node) {
                var _self = this,
                    children = node.children,
                    elements = [];
                BUI.each(children, function(subNode) {
                    var element = _self.findElement(subNode);
                    element && (elements.push(element), _self._hideChildrenNodes(subNode))
                }), _self.get("expandAnimate") ? (elements = $(elements), elements.animate({
                    height: 0
                }, function() {
                    _self.removeItems(children)
                })) : _self.removeItems(children)
            },
            _collapseChildren: function(parentNode, deep) {
                var _self = this,
                    children = parentNode.children;
                BUI.each(children, function(node) {
                    _self.collapseNode(node, deep)
                })
            },
            _expandNode: function(node, element, deep) {
                var _self = this,
                    accordion = _self.get("accordion"),
                    store = _self.get("store");
                if (!node.leaf) {
                    if (!_self.hasStatus(node, EXPAND, element)) {
                        if (accordion && node.parent) {
                            var slibings = node.parent.children;
                            BUI.each(slibings, function(sNode) {
                                sNode != node && _self.collapseNode(sNode)
                            })
                        }
                        store && !store.isLoaded(node) ? _self._isLoading(node, element) || store.loadNode(node) : element && (_self.setItemStatus(node, EXPAND, !0, element), _self._showChildren(node), _self.fire("expanded", {
                            node: node,
                            element: element
                        }))
                    }
                    BUI.each(node.children, function(subNode) {
                        (deep || _self.isExpanded(subNode)) && _self.expandNode(subNode, deep)
                    })
                }
            },
            _showChildren: function(node) {
                if (node && node.children) {
                    var subNode, _self = this,
                        index = _self.indexOfItem(node),
                        length = node.children.length,
                        i = length - 1;
                    for (i = length - 1; i >= 0; i--) subNode = node.children[i], _self.getItem(subNode) || (_self.get("expandAnimate") ? (el = _self._addNodeAt(subNode, index + 1), el.hide(), el.slideDown()) : _self.addItemAt(subNode, index + 1))
                }
            },
            _addNodeAt: function(item, index) {
                var _self = this,
                    items = _self.get("items");
                return void 0 === index && (index = items.length), items.splice(index, 0, item), _self.addItemToView(item, index)
            },
            _isLoading: function(node, element) {
                var _self = this;
                return _self.hasStatus(node, LOADING, element)
            },
            _resetIcons: function(node, element) {
                if (this.get("showIcons")) {
                    var containerEl, _self = this,
                        iconContainer = _self.get("iconContainer"),
                        iconsTpl = _self._getIconsTpl(node);
                    $(element).find("." + CLS_ICON_WRAPER).remove(), containerEl = $(element).find(iconContainer).first(), iconContainer && containerEl.length ? $(iconsTpl).prependTo(containerEl) : $(element).prepend($(iconsTpl))
                }
            },
            _toggleExpand: function(node, element) {
                var _self = this;
                _self._isExpanded(node, element) ? _self._collapseNode(node, element) : _self._expandNode(node, element)
            },
            _updateIcons: function(node) {
                var _self = this,
                    element = _self.findElement(node);
                element && (_self._resetIcons(node, element), _self._isExpanded(node, element) && !node.leaf && BUI.each(node.children, function(subNode) {
                    _self._updateIcons(subNode)
                }))
            },
            _uiSetShowRoot: function(v) {
                var _self = this,
                    start = this.get("showRoot") ? 0 : 1;
                _self.set("startLevel", start)
            },
            _uiSetNodes: function(v) {
                var _self = this,
                    store = _self.get("store");
                store.setResult(v)
            },
            _uiSetShowLine: function(v) {
                var _self = this,
                    el = _self.get("el");
                v ? el.addClass(CLS_SHOW_LINE) : el.removeClass(CLS_SHOW_LINE)
            }
        }), Mixin
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            SimpleList = require("bui/list").SimpleList,
            Selection = function() {};
        return Selection.ATTRS = {}, BUI.augment(Selection, {
            getSelection: function() {
                var store, _self = this,
                    field = _self.getStatusField("selected");
                return field ? (store = _self.get("store"), store.findNodesBy(function(node) {
                    return node[field]
                })) : SimpleList.prototype.getSelection.call(this)
            },
            getSelected: function() {
                var store, _self = this,
                    field = _self.getStatusField("selected");
                return field ? (store = _self.get("store"), store.findNodeBy(function(node) {
                    return node[field]
                })) : SimpleList.prototype.getSelected.call(this)
            }
        }), Selection
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            List = require("bui/list"),
            Mixin = require("bui/tree/treemixin"),
            Selection = require("bui/tree/selection"),
            TreeList = List.SimpleList.extend([Mixin, Selection], {}, {
                ATTRS: {
                    itemCls: {
                        value: BUI.prefix + "tree-item"
                    },
                    itemTpl: {
                        value: "<li>{text}</li>"
                    },
                    idField: {
                        value: "id"
                    }
                }
            }, {
                xclass: "tree-list"
            });
        return TreeList
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            List = require("bui/list"),
            Mixin = require("bui/tree/treemixin"),
            Selection = require("bui/tree/selection"),
            TreeMenuView = List.SimpleList.View.extend({
                getItemTpl: function(item, index) {
                    var _self = this,
                        render = _self.get("itemTplRender"),
                        itemTpl = item.leaf ? _self.get("leafTpl") : _self.get("dirTpl");
                    return render ? render(item, index) : BUI.substitute(itemTpl, item)
                }
            }, {
                xclass: "tree-menu-view"
            }),
            TreeMenu = List.SimpleList.extend([Mixin, Selection], {}, {
                ATTRS: {
                    itemCls: {
                        value: BUI.prefix + "tree-item"
                    },
                    dirSelectable: {
                        value: !1
                    },
                    expandEvent: {
                        value: "itemclick"
                    },
                    itemStatusFields: {
                        value: {
                            selected: "selected"
                        }
                    },
                    collapseEvent: {
                        value: "itemclick"
                    },
                    xview: {
                        value: TreeMenuView
                    },
                    dirTpl: {
                        view: !0,
                        value: '<li class="{cls}"><a href="#">{text}</a></li>'
                    },
                    leafTpl: {
                        view: !0,
                        value: '<li class="{cls}"><a href="{href}">{text}</a></li>'
                    },
                    idField: {
                        value: "id"
                    }
                }
            }, {
                xclass: "tree-menu"
            });
        return TreeMenu.View = TreeMenuView, TreeMenu
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        var BUI = require("bui/common"),
            Tooltip = BUI.namespace("Tooltip"),
            Tip = require("bui/tooltip/tip"),
            Tips = require("bui/tooltip/tips");
        return BUI.mix(Tooltip, {
            Tip: Tip,
            Tips: Tips
        }), Tooltip
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function getOffset(type, offset) {
            return "left" === type ? [-1 * offset, -4] : "right" === type ? [offset, -4] : type.indexOf("top") ? [0, offset] : type.indexOf("bottom") ? [0, -1 * offset] : void 0
        }
        var BUI = require("bui/common"),
            Overlay = require("bui/overlay"),
            CLS_ALIGN_PREFIX = "x-align-",
            MAP_TYPES = {
                left: ["cl", "cr"],
                right: ["cr", "cl"],
                top: ["tc", "bc"],
                bottom: ["bc", "tc"],
                "top-left": ["tl", "bl"],
                "top-right": ["tr", "br"],
                "bottom-left": ["bl", "tl"],
                "bottom-right": ["br", "tr"]
            },
            TipView = Overlay.OverlayView.extend({
                renderUI: function() {},
                _getTitleContainer: function() {
                    return this.get("el")
                },
                _uiSetTitle: function(title) {
                    var tem, _self = this,
                        titleTpl = _self.get("titleTpl"),
                        container = _self._getTitleContainer(),
                        titleEl = _self.get("titleEl");
                    titleEl && titleEl.remove(), title = title || "", BUI.isString(title) && (title = {
                        title: title
                    }), tem = BUI.substitute(titleTpl, title), titleEl = $(tem).appendTo(container), _self.set("titleEl", titleEl)
                },
                _uiSetAlignType: function(type, ev) {
                    var _self = this;
                    ev && ev.prevVal && _self.get("el").removeClass(CLS_ALIGN_PREFIX + ev.prevVal), type && _self.get("el").addClass(CLS_ALIGN_PREFIX + type)
                }
            }, {
                ATTRS: {
                    title: {},
                    titleEl: {},
                    alignType: {}
                }
            }, {
                xclass: "tooltip-view"
            }),
            Tip = Overlay.Overlay.extend({
                _uiSetAlignType: function(type) {
                    var _self = this,
                        offset = _self.get("offset"),
                        align = _self.get("align") || {},
                        points = MAP_TYPES[type];
                    points && (align.points = points, offset && (align.offset = getOffset(type, offset)), _self.set("align", align))
                }
            }, {
                ATTRS: {
                    delegateTrigger: {
                        value: !0
                    },
                    alignType: {
                        view: !0
                    },
                    title: {
                        view: !0
                    },
                    showArrow: {
                        value: !0
                    },
                    arrowContainer: {
                        view: !0
                    },
                    autoHide: {
                        value: !0
                    },
                    autoHideType: {
                        value: "leave"
                    },
                    offset: {
                        value: 0
                    },
                    triggerEvent: {
                        value: "mouseover"
                    },
                    titleTpl: {
                        view: !0,
                        value: "<span>{title}</span>"
                    },
                    xview: {
                        value: TipView
                    }
                }
            }, {
                xclass: "tooltip"
            });
        return Tip.View = TipView, Tip
    }), define("src/hephaistos/js/bui-debug", [], function(require) {
        function isObjectString(str) {
            return /^{.*}$/.test(str)
        }
        var BUI = require("bui/common"),
            Tip = require("bui/tooltip/tip"),
            Tips = function(config) {
                Tips.superclass.constructor.call(this, config)
            };
        return Tips.ATTRS = {
            tip: {},
            defaultAlignType: {}
        }, BUI.extend(Tips, BUI.Base), BUI.augment(Tips, {
            _init: function() {
                this._initDom(), this._initEvent()
            },
            _initDom: function() {
                var defaultAlignType, _self = this,
                    tip = _self.get("tip");
                tip && !tip.isController && (defaultAlignType = tip.alignType, tip = new Tip(tip), tip.render(), _self.set("tip", tip), defaultAlignType && _self.set("defaultAlignType", defaultAlignType))
            },
            _initEvent: function() {
                var _self = this,
                    tip = _self.get("tip");
                tip.on("triggerchange", function(ev) {
                    var curTrigger = ev.curTrigger;
                    _self._replaceTitle(curTrigger), _self._setTitle(curTrigger, tip)
                })
            },
            _replaceTitle: function(triggerEl) {
                var title = triggerEl.attr("title");
                title && (triggerEl.attr("data-title", title), triggerEl[0].removeAttribute("title"))
            },
            _setTitle: function(triggerEl, tip) {
                var _self = this,
                    title = triggerEl.attr("data-title"),
                    alignType = triggerEl.attr("data-align") || _self.get("defaultAlignType");
                isObjectString(title) && (title = BUI.JSON.looseParse(title)), tip.set("title", title), alignType && tip.set("alignType", alignType)
            },
            render: function() {
                return this._init(), this
            }
        }), Tips
    }),
    function() {
        "false" != BUI.loaderScript.getAttribute("data-auto-use") && BUI.use(["bui/common"], function(a) {})
    }();