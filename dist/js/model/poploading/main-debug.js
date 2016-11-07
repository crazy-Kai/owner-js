"use strict";
define("model/poploading/main-debug", ["common/jquery-debug", "common/widget-debug", "common/base-debug", "common/class-debug", "common/attrs-debug", "common/aspect-debug", "common/events-debug", "common/limit-debug", "common/limit-dom-debug"], function(require, exports, module) {
    require("common/jquery-debug"), require("common/widget-debug");
    return Poploading
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
"use strict";
define("common/widget-debug", ["common/jquery-debug", "common/base-debug", "common/class-debug", "common/attrs-debug", "common/aspect-debug", "common/events-debug", "common/limit-debug", "common/limit-dom-debug"], function(require, exports) {
    function setAttr(me, key, element) {
        if ("element" !== key && "template" !== key) {
            var dataVal = element.data(key);
            dataVal && me.set(key, dataVal)
        }
    }

    function parseAttr(me, element) {
        var dataset;
        return (dataset = element[0].dataset) ? Base.limit.each(dataset, function(val, key) {
            setAttr(me, key, element)
        }) : parseAttrByAttributes(element[0].attributes, function(val, key) {
            setAttr(me, key, element)
        }), me
    }

    function parseAttrByAttributes(attributes, callback) {
        Base.limit.each(attributes, function(val, index) {
            var key = val.nodeName;
            REX_DATA.test(key) && (key = RegExp.$1.slice(1).replace(REX_FIRST, function(a, b) {
                return b.toUpperCase()
            }), callback(val.nodeValue, key))
        })
    }

    function formatEventsArr(events) {
        var arr = [];
        return Base.limit.each(events, function(val, key) {
            arr.push(key)
        }), arr
    }

    function destroyWidget(me) {
        var widgetCid = me.widgetCid,
            element = me.element,
            widgetCids = element.attr("widget-cid").split(",");
        delete cacheWidget["widgetCid" + widgetCid], widgetCids.splice(me.limit.indexOf(widgetCids, widgetCid), 1), element.attr("widget-cid", widgetCids.join(",")), "" === element.attr("widget-cid") && element.removeAttr("widget-cid")
    }
    var $ = require("common/jquery-debug"),
        Base = require("common/base-debug"),
        limitDom = require("common/limit-dom-debug"),
        widgetEventsNS = ".widgetEvents",
        WIN = window,
        DOC = document,
        BODY = DOC.body,
        REX_DATA = /^data((?:-.+)+)$/,
        REX_FIRST = /-([a-z])/g,
        cacheWidget = WIN.cacheWidget = {};
    cacheWidget.cid = 0;
    var winOpener = WIN.opener;
    winOpener && Base.limit.extend(cacheWidget, winOpener.cacheWidget);
    var winParent = WIN.parent;
    winParent !== WIN && Base.limit.extend(cacheWidget, winParent.cacheWidget);
    var Widget = Base.extend({
        attrs: {
            trigger: null,
            element: null,
            events: null,
            id: null,
            className: null,
            style: null,
            template: "<div></div>",
            parentNode: BODY
        },
        className: "Widget",
        init: function(config) {
            var me = this;
            return Widget.superClass.init.call(me, config), me.parseElement() ? (me.parseElementAttr(), me.parseTrigger(), me.parseTriggerAttr(), me.widgetCid = "" + ++cacheWidget.cid, cacheWidget["widgetCid" + me.widgetCid] = me, me.initProps(), me.renderAttr(), me.setup(), me.initEvents(), me.delegateEvents(), me) : me
        },
        destroy: function() {
            var me = this;
            return me.undelegateEvents(), me.widgetIsTemplate && me.element.remove(), destroyWidget(me), Widget.superClass.destroy.call(me), me
        },
        parseElement: function() {
            var me = this,
                element = me.get("element");
            return null === element ? (element = $(me.get("template")), me.widgetIsTemplate = !0) : element = $(element), 0 === element.length ? me.limit.log("element构建失败。") : (me.element = element, me)
        },
        parseElementAttr: function() {
            return parseAttr(this, this.element)
        },
        parseTrigger: function() {
            var me = this,
                triggerNode = $(me.get("trigger"));
            return triggerNode.length && (me.triggerNode = triggerNode), me
        },
        parseTriggerAttr: function() {
            var me = this,
                triggerNode = me.triggerNode;
            return triggerNode && me.widgetIsTemplate ? parseAttr(this, triggerNode) : me
        },
        initProps: Base.limit.K,
        setup: Base.limit.K,
        renderAttr: function() {
            var me = this,
                element = me.element,
                id = me.get("id"),
                className = me.get("className"),
                widgetCid = element.attr("widget-cid"),
                style = me.get("style");
            return id && element.prop("id", id), className && element.addClass(className), style && element.css(style), element.attr("widget-cid", widgetCid ? widgetCid + "," + me.widgetCid : me.widgetCid), me
        },
        render: function() {
            var me = this,
                element = me.element,
                elementDom = element[0],
                parentNode = $(me.get("parentNode"));
            return me.set("parentNode", parentNode), elementDom && !$.contains(BODY, elementDom) && parentNode.append(element), me
        },
        initEvents: function() {
            var me = this,
                attrsEvents = me.get("events"),
                recursiveEvents = me.recursiveAttrs("events"),
                events = recursiveEvents.origin,
                eventsArr = recursiveEvents.arr;
            return me.limit.each(attrsEvents, function(val, key) {
                !events[key] && eventsArr.push(key)
            }), me.set("events", me.limit.extend(recursiveEvents.origin, attrsEvents)), me.set("eventsArr", eventsArr), me
        },
        delegateEvents: function(element, events) {
            var eventsArr, me = this,
                length = arguments.length;
            return 0 === length ? (element = me.element, events = me.get("events"), eventsArr = me.get("eventsArr")) : 1 === length ? (events = element, element = me.element, eventsArr = formatEventsArr(events)) : 2 === length && (eventsArr = formatEventsArr(events)), !me.delegateElements && (me.delegateElements = []), !me.limit.contains(me.delegateElements, element) && me.delegateElements.push(element), me.limit.each(eventsArr, function(key, index) {
                var keys = key.split(" "),
                    val = events[key],
                    val = "function" == typeof val ? val : me[val] || me.K;
                element.on(keys[0] + widgetEventsNS + "widgetCid" + me.widgetCid, keys[1], function(e) {
                    val.call(me, this, e)
                })
            }), me
        },
        undelegateEvents: function(element) {
            var delegateElements, me = this,
                length = arguments.length;
            return 0 === length ? delegateElements = me.delegateElements : 1 === length && (delegateElements = [].concat(element)), me.limit.each(delegateElements, function(val) {
                val.off(widgetEventsNS + "widgetCid" + me.widgetCid)
            }), me
        },
        $: function(selector) {
            return this.element.find(selector)
        },
        jQuery: $,
        Implements: {
            limitDom: limitDom
        },
        Statics: {
            query: function(query) {
                var me = this,
                    arr = [],
                    widgetCids = $(query).attr("widget-cid");
                return widgetCids ? (me.limit.each(widgetCids.split(","), function(val) {
                    var wid = cacheWidget["widgetCid" + val];
                    wid && arr.push(wid)
                }), me.limit.getArray(arr)) : null
            },
            limitDom: limitDom
        }
    });
    return Widget
});
"use strict";
define("common/base-debug", ["common/class-debug", "common/attrs-debug", "common/aspect-debug", "common/events-debug", "common/limit-debug", "common/limit-dom-debug"], function(require, exports) {
    function bindEvent(me) {
        var attrsName = (me.getAttrs("attrs"), me.getAttrs("attrsName"));
        me.limit.breakEach(attrsName, function(key) {
            if (REX.test(key)) {
                var val = me.get(key);
                "function" == typeof val && me.on(RegExp.$1.toLowerCase() + RegExp.$2, val)
            }
        })
    }
    var Class = require("common/class-debug"),
        Attrs = require("common/attrs-debug"),
        Aspect = require("common/aspect-debug"),
        limit = require("common/limit-debug"),
        REX = /^on([A-Z])(.*)/,
        Base = Class.create({
            Implements: [Attrs, Aspect, {
                limit: limit
            }],
            Statics: {
                limit: limit
            },
            className: "Base",
            init: function(config) {
                var me = this,
                    attrs = me.getAttrs("attrs");
                return attrs.me = me, attrs.get = function(k) {
                    return me.get(k)
                }, attrs.set = function(k, v) {
                    return me.get(k, v)
                }, me.initAttrs(config), bindEvent(me), me.initBase(), me
            },
            initBase: limit.K,
            destroy: function() {
                var me = this;
                me.clearEvents(), me.clearAttrs();
                for (var i in me) me.hasOwnProperty(i) && delete me[i];
                return me
            }
        });
    return Base
});
"use strict";
define("common/class-debug", [], function(require, exports) {
    function noName(key) {
        return "extend" !== key && "superClass" !== key
    }

    function mix(CUR, TAR, NEEDPROP, CALLBACK) {
        CALLBACK = "function" == typeof CALLBACK ? CALLBACK : K;
        for (var i in TAR)(TAR.hasOwnProperty(i) || NEEDPROP) && CALLBACK(i) && (CUR[i] = TAR[i]);
        return CUR
    }

    function E() {}

    function createPro(PRO) {
        var create = Object.create;
        return create ? create(PRO) : PRO.__proto__ ? {
            __proto__: PRO
        } : (E.prototype = PRO, new E)
    }

    function extend(SUB, PAR) {
        return SUB.prototype = createPro(PAR.prototype), SUB.prototype.constructor = SUB, SUB.superClass = PAR.prototype, SUB
    }

    function implement(CLS, PROP) {
        return "Implements,Statics".replace(Rex, function(a) {
            PROP && (!PROP[a] && (PROP[a] = emptyArr), PROP.hasOwnProperty(a) && Class[a](CLS, PROP[a]), delete PROP[a])
        }), mix(CLS.prototype, PROP), CLS
    }
    var Class = {},
        emptyArr = [],
        K = function(k) {
            return k
        },
        Rex = /\w+/g;
    return Class.create = function(PROP) {
        function subClass() {
            var init = this.init;
            return init && init.apply(this, arguments)
        }
        return implement(subClass, PROP), subClass.prototype.constructor = subClass, subClass.extend = function(PROP) {
            return Class.extend(subClass, PROP)
        }, subClass
    }, Class.extend = function(PAR, PROP) {
        if ("function" != typeof PAR) throw "Class extend error!! parent class need a function";
        return implement(extend(Class.create(), PAR), PROP)
    }, Class.instanceOf = function(OBJ, CLS) {
        return OBJ instanceof CLS && OBJ.constructor === CLS
    }, Class.Statics = function(CLS, ARR) {
        ARR = [].concat(ARR);
        var item;
        for (CLS.superClass && mix(CLS, CLS.superClass.constructor, !1, noName); item = ARR.shift();) mix(CLS, item, !1, noName)
    }, Class.Implements = function(CLS, ARR) {
        var item, prop = CLS.prototype;
        for (ARR = [].concat(ARR); item = ARR.shift();) mix(prop, item.prototype || item, !0)
    }, Class
});
"use strict";
define("common/attrs-debug", ["common/class-debug"], function(require, exports) {
    function K(k) {
        return k
    }

    function isObject(obj) {
        return obj === Object(obj) && !obj.nodeType && !obj.jquery
    }

    function indexOfArr(arr, ele, formIndex) {
        if (arr.indexOf) return arr.indexOf(ele, formIndex);
        var length = arr.length;
        for (formIndex = ~~formIndex; formIndex < length; formIndex++)
            if (arr[formIndex] === ele) return formIndex;
        return -1
    }

    function eachArr(arr, callback, context) {
        if (!arr.forEach) return arr.forEach(callback, context);
        for (var index = 0, length = arr.length; index < length; index++) callback.call(context, arr[index], index, arr)
    }

    function eachObj(obj, callback) {
        for (var key in obj) obj.hasOwnProperty(key) && callback(obj[key], key)
    }

    function extendObj(origin, target, flag) {
        return flag ? eachObj(target, function(val, key) {
            void 0 === origin[key] && (origin[key] = val)
        }) : eachObj(target, function(val, key) {
            origin[key] = val
        }), origin
    }

    function noSetGet(option) {
        return !option || !option.hasOwnProperty("set") && !option.hasOwnProperty("get")
    }

    function formatWritable(writable) {
        return void 0 === writable || !!writable
    }

    function mixOptin(value, option) {
        return option = option || {}, noSetGet(option) ? {
            value: option.value || value,
            writable: formatWritable(option.writable),
            enumerable: !0,
            configurable: !0,
            __isAttr__: !0
        } : {
            get: option.get || K,
            set: option.set || K,
            enumerable: !0,
            configurable: !0,
            __isAttr__: !0
        }
    }

    function fixSet(option, value, name, attrVal, attrs) {
        if (noSetGet(option)) {
            if (!formatWritable(attrVal && attrVal.writable)) throw "TypeError: Cannot redefine property: " + name;
            option.value = value
        } else attrVal && option.set.call(attrs, value)
    }

    function fixGet(option, attrs) {
        var val;
        return noSetGet(option) ? option && option.value : (val = option.get.call(attrs), val && val.__isAttr__ ? fixGet(val, attrs) : val)
    }
    var Class = require("common/class-debug"),
        objectDefineProperty = Object.defineProperty,
        isEcma5 = (Object.getOwnPropertyDescriptor, !!Object.create),
        REX = /\w+/g,
        unshift = Array.prototype.unshift,
        Attrs = Class.create({
            initBseAttr: function() {
                var me = this;
                me.__attrs__ = me.__attrs__ || {}, me.__attrsName__ = me.__attrsName__ || []
            },
            initAttrs: function(config) {
                var me = this;
                eachObj(extendObj(me.recursiveAttrs("attrs").origin, config), function(val, key) {
                    me.set(key, val)
                })
            },
            resetAttrs: function(config) {
                var me = this;
                eachObj(config, function(val, key) {
                    me.set(key, val)
                })
            },
            set: function(name, value, option) {
                var newOption, me = this,
                    attrs = me.getAttrs("attrs"),
                    attrsName = me.getAttrs("attrsName"),
                    attrVal = attrs[name],
                    hasVal = attrs.hasOwnProperty(name);
                return !hasVal && attrsName.push(name), !isObject(value) || !value.hasOwnProperty("value") && noSetGet(value) || (option = value, value = option.value), newOption = mixOptin(value, option), isEcma5 ? hasVal && !option ? attrs[name] = value : objectDefineProperty(attrs, name, newOption) : fixSet(hasVal && !option ? attrVal : attrs[name] = newOption, newOption.value, name, attrVal, attrs), me
            },
            get: function(name) {
                var me = this,
                    attrs = me.getAttrs("attrs");
                return isEcma5 ? attrs[name] : fixGet(attrs[name], attrs)
            },
            getAttrs: function(key) {
                var me = this,
                    some = me["__" + key + "__"];
                return some ? some : (me.initBseAttr(), me["__" + key + "__"])
            },
            eachAttrs: function(callback) {
                var me = this,
                    attrsName = (me.getAttrs("attrs"), me.getAttrs("attrsName"));
                return callback = callback || me.K, eachArr(attrsName, function(val, key) {
                    callback(me.get(val), val)
                }), me
            },
            removeAttrs: function(keys) {
                var me = this,
                    attrs = me.getAttrs("attrs"),
                    attrsName = me.getAttrs("attrsName");
                return keys.replace(REX, function(a) {
                    var index;
                    (index = indexOfArr(attrsName, a)) !== -1 && (attrsName.splice(index, 1), delete attrs[a])
                }), me
            },
            clearAttrs: function() {
                var me = this;
                return me.__attrs__ = {}, me.__attrsName__ = [], me
            },
            recursiveAttrs: function(key) {
                for (var superClass, attrs, me = this, prop = me.constructor.prototype, origin = {}, arr = [], tempArr = [];
                    (superClass = prop.constructor.superClass) && prop;) prop.hasOwnProperty(key) && (attrs = prop[key]) && (tempArr.length = 0, eachObj(attrs, function(val, key) {
                    void 0 === origin[key] && tempArr.push(key)
                }), unshift.apply(arr, tempArr), extendObj(origin, attrs, !0)), prop = superClass;
                return {
                    origin: origin,
                    arr: arr
                }
            }
        });
    return Attrs
});
"use strict";
define("common/aspect-debug", ["common/events-debug", "common/class-debug"], function(require, exports) {
    function indexOfArr(arr, ele, formIndex) {
        if (arr.indexOf) return arr.indexOf(ele, formIndex);
        var length = arr.length;
        for (formIndex = ~~formIndex; formIndex < length; formIndex++)
            if (arr[formIndex] === ele) return formIndex;
        return -1
    }

    function wrap(me, when, methodName, callback) {
        var oldMethod, newMethod;
        me.on(when + "Method." + methodName, callback), oldMethod = me[methodName], oldMethod && !oldMethod.__isAspect__ && indexOfArr(except, methodName) === -1 && (newMethod = me[methodName] = function() {
            var val, args = arrProSlice.call(arguments);
            return args.unshift("beforeMethod." + methodName), me.trigger.apply(me, args) === !1 ? me : (args.shift(), val = oldMethod.apply(me, args), args.unshift(val), args.unshift("afterMethod." + methodName), me.trigger.apply(me, args), val)
        }, newMethod.__isAspect__ = !0)
    }
    var Events = require("common/events-debug"),
        arrProSlice = Array.prototype.slice,
        except = ["trigger"],
        Aspect = Events.extend({
            before: function(methodName, callback) {
                var me = this;
                return wrap(me, "before", methodName, callback), me
            },
            after: function(methodName, callback) {
                var me = this;
                return wrap(me, "after", methodName, callback), me
            }
        });
    return Aspect
});
"use strict";
define("common/events-debug", ["common/class-debug"], function(require, exports) {
    function getNameSpace(type) {
        if (Rex.test(type)) return {
            eventType: RegExp.$1,
            nameSpace: RegExp.$2
        }
    }

    function removeTarget(arr, tar) {
        var index = indexOf(arr, tar);
        index !== -1 && arr.splice(index, 1)
    }

    function indexOf(arr, ele, formIndex) {
        if (arr.indexOf) {
            var length = arr.length;
            for (formIndex = ~~formIndex; formIndex < length; formIndex++)
                if (arr[formIndex] === ele) return formIndex;
            return -1
        }
        return arr.indexOf(ele, formIndex)
    }

    function forEach(arr, callback) {
        if (arr.forEach) return arr.forEach(callback);
        for (var index = 0, length = arr.length; index < length; index++) callback(arr[index], index, arr)
    }

    function eachTrigger(arr, context, args) {
        var val = !0;
        return forEach(arr.slice(0), function(f) {
            f.apply(context, args) === !1 && (val = !1)
        }), val
    }
    var Class = require("common/class-debug"),
        Rex = /(\w+)\.?(.*)/,
        arrProSlice = Array.prototype.slice,
        Events = Class.create({
            add: function(type, callback) {
                var meEventsSpace, meEventsNameSpace, me = this,
                    meEvents = me.__events__,
                    ns = getNameSpace(type);
                return ns && (meEvents || (meEvents = me.__events__ = {}), (meEventsSpace = meEvents[ns.eventType]) || (meEventsSpace = meEvents[ns.eventType] = []), meEventsSpace.push(callback), ns.nameSpace && ((meEventsNameSpace = meEventsSpace[ns.nameSpace]) || (meEventsNameSpace = meEventsSpace[ns.nameSpace] = []), meEventsNameSpace.push(callback))), me
            },
            remove: function(type) {
                var meEventsSpace, meEventsNameSpace, me = this,
                    meEvents = me.__events__,
                    ns = getNameSpace(type);
                ns && meEvents && (meEventsSpace = meEvents[ns.eventType]) && (ns.nameSpace ? ((meEventsNameSpace = meEventsSpace[ns.nameSpace]) && forEach(meEventsNameSpace, function(a) {
                    removeTarget(meEventsSpace, a)
                }), delete meEventsSpace[ns.nameSpace]) : delete meEvents[ns.eventType])
            },
            on: function(type, callback) {
                var me = this;
                return forEach(type.split(","), function(a) {
                    me.add(a, callback)
                }), me
            },
            off: function(type) {
                var me = this;
                return forEach(type.split(","), function(a) {
                    me.remove(a)
                }), me
            },
            once: function(type, callback) {
                var me = this;
                return forEach(type.split(","), function(a) {
                    me.on(a, function() {
                        me.off(a), callback.call(this)
                    })
                }), me
            },
            trigger: function(type, context) {
                var meEventsSpace, meEventsNameSpace, me = this,
                    meEvents = me.__events__,
                    args = arrProSlice.call(arguments),
                    ns = getNameSpace(args.shift());
                return !(ns && meEvents && (meEventsSpace = meEvents[ns.eventType])) || (ns.nameSpace ? (meEventsNameSpace = meEventsSpace[ns.nameSpace]) && eachTrigger(meEventsNameSpace, me, args) : eachTrigger(meEventsSpace, me, args))
            },
            clearEvents: function() {
                var me = this;
                return delete me.__events__, me
            }
        });
    return Events
});
"use strict";
define("common/limit-debug", ["common/limit-dom-debug"], function(require, exports, module) {
    function equalBase(a, b, type) {
        var fn = WIN[type];
        return fn(a) === fn(b)
    }

    function equal(a, b) {
        return size(a) === size(b) && every(getLoopKey(a), function(val, key) {
            return isEqual(a[val], b[val])
        })
    }

    function fixCodePointAt(codeH, codeL) {
        return codeH = padStart((1023 & codeH).toString(2), "0", 10), codeL = padStart((1023 & codeL).toString(2), "0", 10), (parseInt(codeH + codeL, 2) + 65536).toString(16)
    }

    function parseUnicode(str16) {
        if (parseInt(str16, 16) <= 65535) return [str16];
        var origin = parseInt(str16, 16) - 65536,
            originH = origin >> 10,
            originL = 1023 & origin;
        return originH = (55296 | originH).toString(16).toUpperCase(), originL = (56320 | originL).toString(16).toUpperCase(), [originH, originL]
    }

    function stringIncludes(str, arg, index) {
        return str = limitToString(str), nativeStringIncludes ? nativeStringIncludes.call(str, arg, index) : str.indexOf(arg, index) !== -1
    }

    function padStartEnd(str, arg, leg, flag) {
        str = limitToString(str), arg = limitToString(arg), leg = ~~leg;
        var min, max = str.length,
            nativeMethod = flag ? nativePadStart : nativePadEnd;
        return max >= leg ? str : nativeMethod ? nativeMethod.call(str, arg, leg) : (min = Math.ceil((leg - max) / arg.length), flag ? (repeat(arg, min) + str).slice(-leg) : (str + repeat(arg, min)).slice(0, leg))
    }

    function padChar(n, len) {
        for (null == n && (n = ""), n += "", len = ~~len; n.length < len;) n += n;
        return n.slice(0, len)
    }

    function positive(num) {
        return num = ~~num, num < 0 ? 0 : num
    }

    function checkNum() {
        var flag = !0;
        return breakEach(concat.apply(arrayProto, arguments), function(val) {
            if (!limitIsFinite(val)) return log("warn", val, "the num is not a finite number"), flag = !1
        }), flag
    }

    function getMaxScale() {
        if (checkNum.apply(void 0, arguments)) return Math.max.apply(Math, map(arguments, function(val) {
            return (("" + val).split(".")[1] || "").length
        }))
    }

    function movePointRight(sign, leftStr, rightStr, scale) {
        return scale < rightStr.length ? sign + leftStr + rightStr.slice(0, scale) + "." + rightStr.slice(scale) : sign + leftStr + padEnd(rightStr, "0", scale)
    }

    function movePointLeft(sign, leftStr, rightStr, scale) {
        return leftStr.length > scale ? sign + leftStr.slice(0, -scale) + "." + leftStr.slice(-scale) + rightStr : sign + "0." + padStart(leftStr, "0", scale) + rightStr
    }

    function movePoint(num, scale) {
        if (checkNum(num)) {
            if (num += "", scale = ~~scale, 0 === scale) return num;
            var leftStr, rightStr, sign = "";
            return num = num.split("."), leftStr = num[0], rightStr = num[1] || "", "-" === leftStr.charAt(0) && (sign = "-", leftStr = leftStr.slice(1)), scale < 0 ? movePointLeft(sign, leftStr, rightStr, -scale) : movePointRight(sign, leftStr, rightStr, scale)
        }
    }

    function getNeedNum(args, falg) {
        var tar = args[0] + "",
            arg = args[1] + "",
            medTar = (tar.split(".")[1] || "").length,
            medArg = (arg.split(".")[1] || "").length,
            num = falg ? +movePoint(+tar.replace(".", "") * +arg.replace(".", ""), -(medTar + medArg)) : +movePoint(+tar.replace(".", "") / +arg.replace(".", ""), medArg - medTar);
        return args.splice(0, 2, num), num
    }

    function getLoopKey(obj) {
        return keys(isArrayLike(obj) ? toArray(obj) : obj)
    }

    function loop(obj, iterator, context, isBreak, begin) {
        for (var key, target = getLoopKey(obj), num = ~~begin, len = target.length; num < len && (key = target[num], iterator.call(context, obj[key], key, obj) !== !1 || !isBreak); num++);
    }

    function arrayIncludes(arr, target, index) {
        if (nativeArrayIncludes) {
            var result = !1;
            return loop(arr, limitIsNaN(target) ? function(val) {
                if (limitIsNaN(val)) return result = !0, !1
            } : function(val) {
                if (val === target) return result = !0, !1
            }, void 0, !0, index >= 0 ? index : arr.length + index), result
        }
        return nativeArrayIncludes.call(arr, target, index)
    }

    function fixFindAndFindIndex(arr, iterator, context) {
        var result = {
            key: -1,
            val: void 0
        };
        return breakEach(arr, function(val, key) {
            if (iterator.call(this, val, +key)) return result = {
                key: key,
                val: val
            }, !1
        }, context), result
    }

    function whiteBlack(factor, val1) {
        return some(factor, function(val2) {
            return every(val2, function(val3, key3) {
                return val3 === val1[key3]
            })
        })
    }
    var limitDom = require("common/limit-dom-debug"),
        limit = {},
        arrayProto = Array.prototype,
        objectProto = Object.prototype,
        functionProto = Function.prototype,
        stringProto = String.prototype,
        WIN = window,
        slice = (WIN.document, arrayProto.slice),
        splice = arrayProto.splice,
        concat = arrayProto.concat,
        unshift = arrayProto.unshift,
        push = arrayProto.push,
        toString = objectProto.toString,
        hasOwnProperty = objectProto.hasOwnProperty;
    limit.slice = slice;
    var nativeKeys = Object.keys,
        nativeCreate = Object.create,
        nativeForEach = arrayProto.forEach,
        nativeIndexOf = arrayProto.indexOf,
        nativeLastIndexOf = arrayProto.lastIndexOf,
        nativeMap = arrayProto.map,
        nativeFilter = arrayProto.filter,
        nativeEvery = arrayProto.every,
        nativeSome = arrayProto.some,
        nativeReduce = arrayProto.reduce,
        nativeReduceRight = arrayProto.reduceRight,
        nativeBind = functionProto.bind,
        nativeTrim = stringProto.trim,
        nativeCodePointAt = stringProto.codePointAt,
        nativeFromCodePoint = String.fromCodePoint,
        nativeStringIncludes = stringProto.includes,
        nativeStartsWith = stringProto.startsWith,
        nativeEndsWith = stringProto.endsWith,
        nativeRepeat = stringProto.repeat,
        nativePadStart = stringProto.padStart,
        nativePadEnd = stringProto.padEnd,
        nativeArrayIncludes = arrayProto.includes,
        nativeFind = arrayProto.find,
        nativeFindIndex = arrayProto.findIndex,
        nativeFill = arrayProto.fill,
        nativeCopyWithin = arrayProto.copyWithin,
        K = limit.K = function(k) {
            return k
        },
        cb = limit.cb = function(callback) {
            return isFunction(callback) ? callback : K
        },
        O = limit.O = {},
        logColor = {
            log: "background:#333;margin-left:11px;padding-right:17px;",
            error: "background:#F00;padding-right:3px;",
            warn: "background:#F70;margin-left:11px;padding-right:10px;"
        },
        log = limit.log = function() {
            if (!limit.logClosed) {
                var log, args = slice.call(arguments),
                    type = args.shift(),
                    con = console || O,
                    isChrome = limitDom.isChrome;
                contains(["error", "log", "warn"], type) || (args.unshift(type), type = "error"), log = con[type] || K;
                try {
                    isChrome && args.unshift(logColor[type] + "color:#FFF;padding-left:3px;border-radius:3px;"), args.unshift((isChrome ? "%c" : "") + "limitJS " + type + ":"), log.apply(con, args)
                } catch (e) {
                    log("limitJS ", args)
                }
            }
        },
        typeWarn = {
            toString: function(obj) {
                return log("warn", obj, "change into", "'" + obj + "'", "limit.toString is called")
            },
            toArray: function(obj) {
                return log("warn", obj, "change into []", "limit.toArray is called")
            },
            formatDate: function(timestamp, data) {
                return log("warn", "timestamp:", timestamp, "date:", date, "limit.formatDate is called")
            },
            bind: function(obj) {
                return log("warn", fun, "type is not function, limit.bind is called")
            }
        },
        isUndefined = limit.isUndefined = function(n) {
            return void 0 === n
        };
    limit.setDefault = function(n) {
        var result;
        return breakEach(arguments, function(val) {
            return result = val, isUndefined(val)
        }), result
    };
    var isNull = (limit.isDefined = function(n) {
            return !isUndefined(n)
        }, limit.isNull = function(n) {
            return null === n
        }),
        isFunction = limit.isFunction = function(n) {
            return "function" == typeof n
        };
    limit.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" === toString.call(n)
    };
    "String,Number,Array,Date,RegExp,Error,Math".replace(/\w+/g, function(k) {
        limit["is" + k] = function(n) {
            return toString.call(n) === "[object " + k + "]"
        }
    });
    var isNumber = limit.isNumber,
        isArray = limit.isArray,
        isDate = limit.isDate,
        isMath = limit.isMath,
        isError = limit.isError,
        isRegExp = limit.isRegExp,
        isString = limit.isString,
        isObject = limit.isObject = function(n) {
            return isFunction(n) || "object" == typeof n && !!n
        },
        isArrayLike = (limit.isArguments = function(n) {
            return has(n, "callee")
        }, limit.isArrayLike = function(n) {
            return !!n && isNumber(n.length) && !isFunction(n) && !isWin(n)
        }),
        limitIsNaN = limit.isNaN = Number.isNaN || function(n) {
            return isNumber(n) && isNaN(n)
        },
        limitIsFinite = limit.isFinite = Number.isFinite || function(n) {
            return isNumber(n) && isFinite(n)
        },
        isInteger = limit.isInteger = Number.isInteger || function(n) {
            return limitIsFinite(n) && Math.floor(n) === n
        };
    limit.isSafeInteger = Number.isSafeInteger || function(n) {
        return isInteger(n) && -9007199254740992 < n && n < 9007199254740992
    };
    var isEmpty = limit.isEmpty = function(n) {
        return null == n || 0 === size(n)
    };
    limit.isElement = function(n) {
        return !!n && 1 === n.nodeType
    }, limit.isDocument = function(n) {
        return !!n && 9 === n.nodeType
    };
    var isWin = limit.isWin = function(n) {
            return !!n && n.window === n && n.self == n
        },
        equalBaseArr = ["String", "Number", "Boolean"],
        isEqual = limit.isEqual = function(a, b) {
            if (log("log", "limit.isEqual is called ", typeof a, ":", a, typeof b, ":", b), a === b) return !0;
            if (toString.call(a) !== toString.call(b)) return !1;
            if (limitIsNaN(a)) return !0;
            var type;
            return (type = isBase(a, equalBaseArr)) ? equalBase(a, b, type) : isDate(a) ? +a === +b : isRegExp(a) ? "" + a == "" + b : (!isFunction(a) || "" + a == "" + b) && equal(a, b)
        },
        baseArr = ["String", "Number", "Boolean", "Null", "Undefined", "RegExp", "Date", "Math", "Error"],
        isBase = limit.isBase = function(n, list) {
            !isArray(list) && (list = baseArr);
            var type = "";
            return some(list, function(val, key) {
                var fn = limit["is" + val];
                return fn && fn(n) && (type = val)
            }), type
        };
    limit.includes = function(obj, arg, index) {
        return isArray(obj) ? arrayIncludes(obj, arg, index) : stringIncludes(obj, arg, index)
    };
    var limitToString = limit.toString = function(obj) {
            return isString(obj) ? obj : (typeWarn.toString(obj), "" + obj)
        },
        REG_EXP_TRIM = /^\s+|\s+$/g;
    limit.trim = function(n) {
        return n = arguments.length ? n + "" : "", nativeTrim ? nativeTrim.call(n) : n.replace(REG_EXP_TRIM, "")
    };
    limit.codePointAt = function(str, index) {
        if (str = limitToString(str), index = ~~index, nativeCodePointAt) {
            var code = str.charCodeAt(index);
            return code >= 55296 && code <= 56319 ? fixCodePointAt(code, str.charCodeAt(++index)) : code.toString(16)
        }
        return nativeCodePointAt.call(str, index).toString(16)
    }, limit.fromCodePoint = function(code) {
        return isFinite(code) ? nativeFromCodePoint ? nativeFromCodePoint.call(String, code) : (code = map(parseUnicode(code.toString(16)), function(val) {
            return "\\u" + val
        }).join(""), new Function('return "' + code + '"')()) : (log("warn", code, "the code must be a number"), "")
    }, limit.startsWith = function(str, arg, index) {
        return str = limitToString(str), nativeStartsWith ? nativeStartsWith.call(str, arg, index) : (index = ~~index, str.indexOf(arg, index) === index)
    }, limit.endsWith = function(str, arg, index) {
        if (str = limitToString(str), nativeEndsWith) return nativeEndsWith.call(str, arg, index);
        index = 3 === arguments.length ? ~~index : str.length;
        var leg = index - arg.length;
        return str.lastIndexOf(arg, leg) === leg
    };
    var repeat = limit.repeat = function(str, leg) {
            if (str = limitToString(str), leg = positive(leg), nativeRepeat) return nativeRepeat.call(str, leg);
            var arr = new Array(leg),
                tem = [];
            return Array.prototype.push.apply(tem, arr), tem.map(function() {
                return str
            }).join("")
        },
        padStart = limit.padStart = function(str, arg, leg) {
            return padStartEnd(str, arg, leg, !0)
        },
        padEnd = limit.padEnd = function(str, arg, leg) {
            return padStartEnd(str, arg, leg, !1)
        },
        REG_THOUSAND_SEPARATOR = (limit.random = function(form, to) {
            form = ~~form, to = ~~to;
            var max = Math.max(form, to),
                min = Math.min(form, to);
            return Math.floor((max - min + 1) * Math.random() + min)
        }, /(\d{1,3})(?=(\d{3})+$)/g),
        REG_THOUSAND_SEPARATOR_POINT = /(\d{1,3})(?=(\d{3})+\.)/g,
        REG_THOUSAND_SEPARATOR_COMMA = /,/g;
    limit.thousandSeparator = function(num, med) {
        return limitIsFinite(num) ? (isNumber(med) || (med = 2), toFixed(num, med).replace(med ? REG_THOUSAND_SEPARATOR_POINT : REG_THOUSAND_SEPARATOR, "$1,")) : (log("warn", "limit.thousandSeparator is called ", typeof num, ":", num), "")
    }, limit.unThousandSeparator = function(str) {
        return isString(str) ? +str.replace(REG_THOUSAND_SEPARATOR_COMMA, "") : (log("warn", "limit.unThousandSeparator is called ", typeof str, ":", str), NaN)
    };
    var toFixed = limit.toFixed = function(num, scale) {
        scale = positive(scale);
        var num = movePoint(num, scale);
        return isUndefined(num) ? num : movePoint(Math.round(num), -scale)
    };
    limit.plus = function() {
        var maxScale = getMaxScale.apply(void 0, arguments);
        if (!isUndefined(maxScale)) return reduce.call(void 0, arguments, function(before, val) {
            return +movePoint(+movePoint(before, maxScale) + +movePoint(val, maxScale), -maxScale)
        })
    }, limit.minus = function() {
        var maxScale = getMaxScale.apply(void 0, arguments);
        if (!isUndefined(maxScale)) return reduce.call(void 0, arguments, function(before, val) {
            return +movePoint(+movePoint(before, maxScale) - +movePoint(val, maxScale), -maxScale)
        })
    };
    var multiply = limit.multiply = function() {
            if (checkNum.apply(void 0, arguments)) {
                var args = toArray(arguments),
                    num = getNeedNum(args, !0);
                return args.length <= 1 ? num : multiply.apply(void 0, args)
            }
        },
        except = limit.except = function() {
            if (checkNum.apply(void 0, arguments)) {
                var args = toArray(arguments),
                    num = getNeedNum(args, !1);
                return limitIsNaN(num) ? args[0] / args[1] : args.length <= 1 ? num : except.apply(void 0, args)
            }
        },
        has = limit.has = function(n, k) {
            return null != n && hasOwnProperty.call(n, k)
        },
        E = function() {},
        create = limit.create = function(prop) {
            return null == prop ? {} : nativeCreate ? nativeCreate(prop) : prop.__proto__ ? {
                __proto__: prop
            } : (E.prototype = prop, new E)
        },
        forIn = limit.forIn = function(obj, iterator, context) {
            if (null == obj) return obj;
            for (var key in obj) iterator.call(context, obj[key], key, obj);
            return obj
        },
        keys = limit.keys = function(obj) {
            if (null == obj) return [];
            if (nativeKeys) return nativeKeys.call(Object, obj);
            var arr = [];
            return forIn(obj, function(val, key) {
                has(obj, key) && arr.push(key)
            }), arr
        },
        size = limit.size = function(obj) {
            return getLoopKey(obj).length
        },
        each = limit.each = function(obj, iterator, context) {
            return iterator = cb(iterator), isArrayLike(obj) && nativeForEach ? nativeForEach.call(obj, function(val, key) {
                iterator.call(this, val, "" + key)
            }, context) : loop(obj, iterator, context)
        },
        breakEach = limit.breakEach = function(obj, iterator, context) {
            return loop(obj, iterator, context, !0)
        },
        extend = limit.extend = function(obj, isOwn) {
            function main(val, key) {
                obj[key] = val
            }
            return isObject(obj) ? (isOwn !== !0 ? each(slice.call(arguments, 1), function(val) {
                forIn(val, main)
            }) : each(slice.call(arguments, 2), function(val) {
                each(val, main)
            }), obj) : obj
        },
        copyArr = (limit.defaults = function(obj, isOwn) {
            function main(val, key) {
                isUndefined(obj[key]) && (obj[key] = val)
            }
            return isObject(obj) ? (isOwn !== !0 ? each(slice.call(arguments, 1), function(val) {
                forIn(val, main)
            }) : each(slice.call(arguments, 2), function(val) {
                each(val, main)
            }), obj) : obj
        }, limit.clone = function(obj) {
            return isBase(obj) ? copy(obj) : isFunction(obj) ? extend(function() {
                return obj.apply(this, arguments)
            }, obj) : isArray(obj) ? slice.call(obj) : extend({}, obj)
        }, ["String", "Number", "Boolean", "Null", "Undefined"]),
        copy = limit.copy = function(obj) {
            var type;
            if (type = isBase(obj, copyArr)) return isObject(obj) ? new WIN[type](obj.valueOf()) : obj;
            if (isMath(obj)) return obj;
            if (isRegExp(obj)) return new RegExp(obj.source, (obj.global ? "g" : "") + (obj.multiline ? "m" : "") + (obj.ignoreCase ? "i" : ""));
            if (isDate(obj)) return new Date(obj.getTime());
            if (isError(obj)) return new Error(obj.message);
            var value = {};
            return isArray(obj) && (value = []), isFunction(obj) && (value = function() {
                return obj.apply(this, arguments)
            }), forIn(obj, function(val, key) {
                value[key] = copy(val)
            }), value
        };
    limit.getObject = function(obj) {
        return breakEach(slice.call(arguments, 1), function(val) {
            try {
                obj = obj[val]
            } catch (e) {
                return obj = void 0, !1
            }
        }), obj
    };
    var is = limit.is = Object.is || function(a, b) {
            return !(!limitIsNaN(a) || !limitIsNaN(b)) || (0 === a && 0 === b ? 1 / a === 1 / b : a === b)
        },
        from = limit.from = Array.from || function(obj, iterator, context) {
            var arr = [];
            return iterator = cb(iterator), obj && obj.length ? (push.apply(arr, slice.call(obj)), map(arr, iterator, context)) : arr
        };
    limit.of = Array.of || function() {
        return slice.call(arguments)
    };
    var toArray = limit.toArray = function(obj) {
            return isArray(obj) ? obj : isArrayLike(obj) ? slice.call(obj) : (typeWarn.toArray(obj), [])
        },
        getArray = limit.getArray = function(arr) {
            switch (arr = toArray(arr), arr.length) {
                case 0:
                    return null;
                case 1:
                    return arr[0];
                default:
                    return arr
            }
        },
        indexOf = limit.indexOf = function(arr, ele, formIndex) {
            if (isEmpty(arr)) return -1;
            if (isArrayLike(arr) && (arr = toArray(arr)), nativeIndexOf && nativeIndexOf === arr.indexOf) return nativeIndexOf.apply(arr, slice.call(arguments, 1));
            var isArr = isArray(arr),
                index = -1;
            return loop(arr, function(val, key) {
                if (val === ele) return index = key, !1
            }, void 0, !0, ~~formIndex), isArr ? +index : index
        },
        forEach = (limit.lastIndexOf = function(arr, ele, formIndex) {
            if (arr = toArray(arr), nativeLastIndexOf) return nativeLastIndexOf.apply(arr, slice.call(arguments, 1));
            formIndex = ~~formIndex;
            var len = arr.length - 1,
                index = indexOf(arr.reverse(), ele, 3 === arguments.length ? len - formIndex : formIndex);
            return index === -1 ? -1 : len - index
        }, limit.forEach = function(arr, iterator, context) {
            return arr = toArray(arr), iterator = cb(iterator), each(arr, function(val, key) {
                iterator.call(this, val, +key, arr)
            }, context)
        }),
        map = limit.map = function(arr, iterator, context) {
            if (isEmpty(arr)) return arr;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeMap && nativeMap === arr.map) return nativeMap.call(arr, iterator, context);
            var isArr = isArray(arr),
                result = isArr ? [] : {};
            return each(arr, function(val, key) {
                result[key] = iterator.call(this, val, key, arr)
            }, context), result
        },
        filter = limit.filter = function(arr, iterator, context) {
            if (isEmpty(arr)) return arr;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeFilter && nativeFilter === arr.filter) return nativeFilter.call(arr, iterator, context);
            var isArr = isArray(arr),
                result = isArr ? [] : {};
            return isArr ? each(arr, function(val, key) {
                iterator.call(this, val, key, arr) && result.push(val)
            }, context) : each(arr, function(val, key) {
                iterator.call(this, val, key, arr) && (result[key] = val)
            }), result
        },
        every = limit.every = function(arr, iterator, context) {
            if (isEmpty(arr)) return !1;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeEvery && nativeEvery === arr.every) return nativeEvery.call(arr, iterator, context);
            var result = !0,
                isArr = isArray(arr);
            return breakEach(arr, function(val, key) {
                if (!iterator.call(this, val, isArr ? +key : key, arr)) return result = !1
            }, context), result
        },
        some = limit.some = function(arr, iterator, context) {
            if (isEmpty(arr)) return !1;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeSome && nativeSome === arr.some) return nativeSome.call(arr, iterator, context);
            var result = !1,
                isArr = isArray(arr);
            return breakEach(arr, function(val, key) {
                if (iterator.call(this, val, isArr ? +key : key, arr)) return result = !0, !1
            }, context), result
        },
        ERR_MSG_REDUCE = new TypeError("Reduce of empty array with no initial value"),
        reduce = limit.reduce = function(arr, iterator, init) {
            arr = toArray(arr);
            var args = slice.call(arguments, 1);
            if (args[0] = iterator = cb(iterator), nativeReduce) return nativeReduce.apply(arr, args);
            var len = args.length,
                index = 0,
                noInit = 1 === len,
                result = noInit ? arr[index++] : init;
            if (noInit && 0 === arr.length) throw ERR_MSG_REDUCE;
            return loop(arr, function(val, key) {
                result = iterator.call(this, result, val, +key, arr)
            }, void 0, !1, index), result
        },
        contains = (limit.reduceRight = function(arr, iterator, init) {
            arr = toArray(arr);
            var args = slice.call(arguments, 1);
            if (args[0] = iterator = cb(iterator), nativeReduceRight) return nativeReduceRight.apply(arr, args);
            var len = arr.length - 1;
            return args.unshift(arr.reverse()), args[1] = function(before, val, key, arr) {
                return iterator(before, val, len - key, arr)
            }, reduce.apply(void 0, args)
        }, limit.contains = function(arr, target) {
            var result = !1;
            return loop(arr, function(val) {
                if (is(val, target)) return result = !0, !1
            }, void 0, !0), result
        });
    limit.find = function(arr, iterator, context) {
        return arr = toArray(arr), iterator = cb(iterator), nativeFind ? nativeFind.call(arr, iterator, context) : fixFindAndFindIndex(arr, iterator, context).val
    }, limit.findIndex = function(arr, iterator, context) {
        return arr = toArray(arr), iterator = cb(iterator), nativeFindIndex ? nativeFind.call(arr, iterator, context) : fixFindAndFindIndex(arr, iterator, context).key
    };
    var difference = limit.difference = function(arr) {
        arr = toArray(arr);
        var result = concat.apply(arrayProto, slice.call(arguments, 1));
        return filter(arr, function(val) {
            return !contains(result, val)
        })
    };
    limit.without = function(arr) {
        var result = difference.apply(void 0, arguments);
        return arr.length = 0, push.apply(arr, result), arr
    };
    var flatten = (limit.union = function(arr, isEasy) {
        arr = toArray(arr);
        var target;
        return isEasy ? filter(arr.sort(), function(val, key) {
            return !(key && target === val || (target = val, 0))
        }) : (target = [], filter(arr, function(val, key) {
            return !contains(target, val) && (target.push(val), !0)
        }))
    }, limit.flatten = function() {
        var value = [];
        return forEach(arguments, function(val, key) {
            push.apply(value, isArray(val) ? flatten.apply(void 0, concat.apply(arrayProto, val)) : [val])
        }), value
    });
    limit.whiteList = function(arr) {
        var factor = concat.apply(arrayProto, slice.call(arguments, 1));
        return filter(arr, function(val1) {
            return whiteBlack(factor, val1)
        })
    }, limit.blackList = function(arr) {
        var factor = concat.apply(arrayProto, slice.call(arguments, 1));
        return filter(arr, function(val1) {
            return !whiteBlack(factor, val1)
        })
    }, limit.fill = function(arr, target, start, end) {
        if (arr = toArray(arr), nativeFill) return nativeFill.call(arr, target, start, end);
        var arrLen = arr.length;
        start = ~~start, end = ~~end, start = start <= 0 ? arrLen + start : start, end = end <= 0 ? arrLen + end : end, start < 0 && (start = 0), end > arrLen && (end = arrLen);
        var len = end - start;
        if (len > 0) {
            var arg = from(new Array(len), function() {
                return target
            });
            unshift.call(arg, start, len), splice.apply(arr, arg)
        }
        return arr
    }, limit.copyWithin = function(arr, target, start, end) {
        if (arr = toArray(arr), nativeCopyWithin) return nativeCopyWithin.call(arr, target, start, end)
    };
    var bind = limit.bind = function(fun) {
            function main() {
                if (this instanceof main) {
                    args.shift();
                    var context = create(fun.prototype),
                        tar = fun.apply(context, concat.apply(args, arguments));
                    return isObject(tar) ? tar : context
                }
                return fun.apply(args.shift(), concat.apply(args, arguments))
            }
            if (!isFunction(fun)) return typeWarn.bind(fun), K;
            if (nativeBind) return nativeBind.apply(fun, slice.call(arguments, 1));
            var args = slice.call(arguments, 1);
            return main.toString = function() {
                return "function () { [native code] }"
            }, main
        },
        delay = limit.delay = function(fun, wait) {
            var args = slice.call(arguments, 2);
            return unshift.call(args, fun, void 0), setTimeout(function() {
                bind.apply(void 0, args)()
            }, wait)
        },
        defer = limit.defer = function() {
            var args = slice.call(arguments);
            return args.splice(1, 0, 0), delay.apply(void 0, args)
        },
        defered = (limit.once = function(fun) {
            var args = slice.call(arguments, 2);
            return unshift.call(args, fun, arguments[1]),
                function main() {
                    return main.used ? void 0 : (main.used = !0, bind.apply(void 0, concat.apply(args, arguments))())
                }
        }, limit.defered = function() {
            function clean() {
                var one, temp;
                (one = list.shift()) ? (main.status = "pendding", defer(function() {
                    try {
                        var checkIsNull = ~~isNull(back[0]);
                        temp = back.slice(checkIsNull), back.length = 0, back[1] = one[one.allback ? "allback" : checkIsNull ? "sucback" : "errback"].apply(void 0, temp), back[0] = null
                    } catch (e) {
                        back[0] = e
                    }
                    clean()
                })) : main.status = "end"
            }
            var main = {},
                list = [],
                back = [null];
            return main.isDefered = !0, main.status = "init", main.then = function(sucback, errback) {
                return list.push({
                    sucback: sucback || K,
                    errback: errback || K
                }), main
            }, main.always = function(allback) {
                return list.push({
                    allback: allback || K
                }), main
            }, main.pass = function(err) {
                return arguments.length && (back[0] = err, push.apply(back, slice.call(arguments, 1))), clean(), main
            }, main
        });
    limit.when = function() {
        function endDo() {
            if (--guid <= 0) {
                var isSuc = isNull(getArray(errArgs));
                isSuc && sucArgs.unshift(null), theDefer.pass.apply(void 0, isSuc ? sucArgs : errArgs)
            }
        }
        var theDefer = defered(),
            guid = arguments.length,
            sucArgs = [],
            errArgs = [];
        return forEach(arguments, function(val, key) {
            val.isDefered ? (val.then(function() {
                sucArgs[key] = getArray(arguments)
            }, function() {
                errArgs[key] = getArray(arguments)
            }).always(endDo), "end" === val.status && val.pass()) : isFunction(val) ? defer(function() {
                try {
                    sucArgs[key] = val()
                } catch (e) {
                    errArgs[key] = e
                }
                endDo()
            }) : (sucArgs[key] = val, endDo())
        }), theDefer
    };
    var REG_EXP_DATA = /^(yyyy)(?:(.+)(MM))?(?:(.+)(dd))?(?:(.+)(HH))?(?:(.+)(mm))?(?:(.+)(ss))?(.+)?$/,
        FUN_DATAS = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"];
    return limit.formatDate = function(timestamp, formatStr) {
        !isNumber(timestamp) && (timestamp = +new Date), !isString(formatStr) && (formatStr = "yyyy-MM-dd HH:mm:ss");
        var date = new Date(timestamp);
        return limitIsNaN(+date) ? (typeWarn.formatDate(timestamp, data), "") : formatStr.replace(REG_EXP_DATA, function() {
            var arr = [];
            return forEach(slice.call(arguments, 1, -2), function(val, key) {
                var value;
                val && (key % 2 === 0 ? (value = date[FUN_DATAS[key / 2]](), "MM" === val && value++, "yyyy" !== val && (value = (padChar("0", 2) + value).slice(-2)), arr.push(value)) : arr.push(val))
            }), arr.join("")
        })
    }, limit
});
"use strict";
define("common/limit-dom-debug", [], function(require, exports) {
    var limitDom = {},
        WIN = window;
    WIN.document;
    return limitDom.isChrome = !!WIN.chrome, limitDom
});