"use strict";
define("src/bus/suit/simCase/lassenSimCase/main-debug", ["src/bus/suit/simCase/common/main-debug", "common/jquery-debug", "model/placeHolder/main-debug", "common/delegate-debug", "src/bus/suit/simCase/lassenSimCase/page-debug", "common/myWidget-debug", "common/limit-debug", "common/limit-dom-debug", "model/paginator/main-debug", "model/ajax/main-debug", "src/bus/suit/simCase/lassenSimCase/page-hbs-debug", "common/handlerbars-debug", "src/bus/suit/simCase/common/feedback-debug", "model/modal/main-debug", "common/validator-debug", "src/bus/suit/simCase/common/feedback-hbs-debug"], function(require, exports, module) {
    require("src/bus/suit/simCase/common/main-debug"), new(require("src/bus/suit/simCase/lassenSimCase/page-debug")), new(require("src/bus/suit/simCase/common/feedback-debug"))
});
"use strict";
define("src/bus/suit/simCase/lassenSimCase/page-debug", ["common/jquery-debug", "common/myWidget-debug", "common/limit-debug", "common/limit-dom-debug", "model/paginator/main-debug", "model/ajax/main-debug", "src/bus/suit/simCase/lassenSimCase/page-hbs-debug", "common/handlerbars-debug"], function(require, exports, module) {
    function formatData(data) {
        var list = data.simCaseList.data = limit.whiteList(data.simCaseList.data, {
            winner: "1"
        }, {
            winner: "2"
        }, {
            winner: "3"
        });
        data.simCaseList.sourceList = list, data.simCaseList.count = data.statistics.count = list.length
    }

    function secondFormat(type) {
        var me = this,
            data = me.sourceData,
            list = data.simCaseList.data = type ? limit.whiteList(data.simCaseList.sourceList, {
                winner: type
            }) : data.simCaseList.sourceList;
        return data.simCaseList.count = list.length, data
    }

    function initPage(data) {
        var me = this,
            size = me.get("size");
        paginatorExp && paginatorExp.destroy(), data.simCaseList.data || (data.simCaseList.data = []), data.simCaseList.count && (paginatorExp = new Paginator({
            element: me.$(".paginator"),
            size: size,
            totle: data.simCaseList.count
        }).on("change", function(index) {
            parseHtml.call(me, data, index)
        })), parseHtml.call(me, data, 1)
    }

    function parseHtml(data, index) {
        var me = this,
            size = me.get("size");
        data.simCaseList.list = data.simCaseList.data.slice((index - 1) * size, index * size), me.$('[data-target="content"]').html(pageHbs(data))
    }

    function fictionalPost(url, flag) {
        var me = this,
            form = document.createElement("form"),
            obj = me.serialize(me.get("pageParam"));
        form.action = url, !flag && (form.target = "_blank"), form.method = "post", limit.each(obj, function(val, name) {
            var input = document.createElement("input");
            input.type = "hidden", input.name = name, input.value = val, form.appendChild(input)
        }), document.body.appendChild(form), form.submit(), $(form).remove()
    }
    var paginatorExp, $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        limit = require("common/limit-debug"),
        Paginator = require("model/paginator/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        pageHbs = require("src/bus/suit/simCase/lassenSimCase/page-hbs-debug"),
        Page = MyWidget.extend({
            clssName: "Page",
            attrs: {
                element: "#simCasePage",
                pageParam: "#pageParam",
                size: 5,
                showTitle: ["全部结果", "全部支持", "部分支持", "全部驳回"]
            },
            events: {
                'click [data-trigger="type"]': function(e) {
                    var me = this,
                        self = $(e.target),
                        type = self.data("type");
                    me.$('[data-target="show"]').html(me.get("showTitle")[~~type]), initPage.call(me, secondFormat.call(me, "" + type))
                },
                "mouseenter .sim-select": function(e) {
                    var me = this;
                    me.$('[data-target="list"]').removeClass("fn-hide")
                },
                'mouseleave [data-target="list"]': function(e) {
                    var me = this;
                    $(e.target);
                    me.$('[data-target="list"]').addClass("fn-hide")
                },
                'click [data-trigger="post"]': function(e) {
                    var me = this;
                    e.preventDefault(), fictionalPost.call(me, $(e.target).prop("href"))
                },
                'click [data-trigger="reSearch"]': function(e) {
                    var me = this;
                    e.preventDefault(), fictionalPost.call(me, $(e.target).prop("href"), !0)
                }
            },
            initProps: function() {},
            setup: function() {
                var me = this;
                me.ajax()
            },
            ajax: function() {
                var me = this;
                new Ajax({
                    request: "/suit/simCaseRpc/querySimCaseInfo.json",
                    paramName: "simCase",
                    parseForm: me.get("pageParam"),
                    autoErrorAlert: !1
                }).on("ajaxSuccess", function(rtv) {
                    formatData(rtv), me.sourceData = rtv, initPage.call(me, rtv)
                }).on("ajaxError", function() {
                    me.$('[data-target="content"]').html(pageHbs({
                        simCaseList: {},
                        statistics: {
                            count: 0
                        }
                    }))
                }).submit()
            }
        });
    return Page
});
define("src/bus/suit/simCase/lassenSimCase/page-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="ch-title">\t{{#noEqual statistics.count 0}}\t\t总计检索到 <a class="ch-num ch-black" href="javascript:;" data-trigger="type" data-type="">{{statistics.count}}</a> 个案件，\t\t其中原告诉请被全部支持 <a class="ch-num ch-green" href="javascript:;" data-trigger="type" data-type="1" >{{statistics.win}}</a> 件，\t\t原告诉请被全部驳回 <a class="ch-num ch-red" href="javascript:;" data-trigger="type" data-type="3">{{statistics.reject}}</a> 件，\t\t原告诉请被部分支持 <a class="ch-num ch-orange" href="javascript:;" data-trigger="type" data-type="2">{{statistics.win_reject}}</a> 件。\t{{else}}\t\t总计检索到 <a class="ch-num ch-black" href="javascript:;" data-trigger="type" data-type="">{{statistics.count}}</a> 个案件。\t{{/noEqual}}</div><ul class="ch-list fn-MT20">\t{{#if simCaseList.list}}\t\t{{#each simCaseList.list}}\t\t<li class="fn-clear">\t\t\t<i class="ch-status \t\t\t\t{{#isEqual winner "1"}}ch-status-green{{/isEqual}}\t\t\t\t{{#isEqual winner "2"}}ch-status-orange{{/isEqual}}\t\t\t\t{{#isEqual winner "3"}}ch-status-red{{/isEqual}}\t\t\t\t"></i>\t\t\t<div class="ch-text-title">\t\t\t\t<a href="simCaseDetail.htm?caseKey={{doc_desc}}" data-trigger="post" target="_blank" class="global-link">{{wrapWord title 130}}</a>\t\t\t</div>\t\t\t<div class="ch-text-detail">\t\t\t\t{{#if plaintiff_claim }} {{wrapWord plaintiff_claim 130}} {{/if}}\t\t\t</div>\t\t\t<div class="fn-color-999">\t\t\t\t{{case_id}} <span class="fn-ML20">{{court}}</span> <span class="fn-ML20"> {{#if compensation_money}} {{#noEqual compensation_money "0.0"}} 涉及金额：{{compensation_money}} {{/noEqual}} {{/if}} </span>\t\t\t</div>\t\t</li>\t\t{{/each}}\t{{else}}\t\t<div class="fn-TAC">\t\t\t<div class="sim-case-nolist"></div>\t\t\t<div class="fn-FS16 fn-color-999 fn-MT20 fn-LH30">\t\t\t\t当前检索条件未匹配到任何结果<br />\t\t\t\t建议您输入2个以上关键词，选择正确案由，案情描述在50个字以上，将更容易匹配到相似案件\t\t\t</div>\t\t\t<div class="fn-MT20"> \t\t\t\t<a class="fn-btn fn-btn-primary fn-W120 fn-WRH fn-BGC-wrh" href="/suit/simCase/simCaseIndex.htm" data-trigger="reSearch">重新检索</a>\t\t\t</div>\t\t</div>\t{{/if}}</ul>');
    return compile.source = '<div class="ch-title">\t{{#noEqual statistics.count 0}}\t\t总计检索到 <a class="ch-num ch-black" href="javascript:;" data-trigger="type" data-type="">{{statistics.count}}</a> 个案件，\t\t其中原告诉请被全部支持 <a class="ch-num ch-green" href="javascript:;" data-trigger="type" data-type="1" >{{statistics.win}}</a> 件，\t\t原告诉请被全部驳回 <a class="ch-num ch-red" href="javascript:;" data-trigger="type" data-type="3">{{statistics.reject}}</a> 件，\t\t原告诉请被部分支持 <a class="ch-num ch-orange" href="javascript:;" data-trigger="type" data-type="2">{{statistics.win_reject}}</a> 件。\t{{else}}\t\t总计检索到 <a class="ch-num ch-black" href="javascript:;" data-trigger="type" data-type="">{{statistics.count}}</a> 个案件。\t{{/noEqual}}</div><ul class="ch-list fn-MT20">\t{{#if simCaseList.list}}\t\t{{#each simCaseList.list}}\t\t<li class="fn-clear">\t\t\t<i class="ch-status \t\t\t\t{{#isEqual winner "1"}}ch-status-green{{/isEqual}}\t\t\t\t{{#isEqual winner "2"}}ch-status-orange{{/isEqual}}\t\t\t\t{{#isEqual winner "3"}}ch-status-red{{/isEqual}}\t\t\t\t"></i>\t\t\t<div class="ch-text-title">\t\t\t\t<a href="simCaseDetail.htm?caseKey={{doc_desc}}" data-trigger="post" target="_blank" class="global-link">{{wrapWord title 130}}</a>\t\t\t</div>\t\t\t<div class="ch-text-detail">\t\t\t\t{{#if plaintiff_claim }} {{wrapWord plaintiff_claim 130}} {{/if}}\t\t\t</div>\t\t\t<div class="fn-color-999">\t\t\t\t{{case_id}} <span class="fn-ML20">{{court}}</span> <span class="fn-ML20"> {{#if compensation_money}} {{#noEqual compensation_money "0.0"}} 涉及金额：{{compensation_money}} {{/noEqual}} {{/if}} </span>\t\t\t</div>\t\t</li>\t\t{{/each}}\t{{else}}\t\t<div class="fn-TAC">\t\t\t<div class="sim-case-nolist"></div>\t\t\t<div class="fn-FS16 fn-color-999 fn-MT20 fn-LH30">\t\t\t\t当前检索条件未匹配到任何结果<br />\t\t\t\t建议您输入2个以上关键词，选择正确案由，案情描述在50个字以上，将更容易匹配到相似案件\t\t\t</div>\t\t\t<div class="fn-MT20"> \t\t\t\t<a class="fn-btn fn-btn-primary fn-W120 fn-WRH fn-BGC-wrh" href="/suit/simCase/simCaseIndex.htm" data-trigger="reSearch">重新检索</a>\t\t\t</div>\t\t</div>\t{{/if}}</ul>', compile
});
"use strict";
define("src/bus/suit/simCase/common/main-debug", ["common/jquery-debug", "model/placeHolder/main-debug", "common/delegate-debug"], function(require, exports, module) {
    function maxlength() {
        var self = $(this),
            length = self.attr("maxlength");
        setTimeout(function() {
            var val = self.val();
            val.length > length && self.val(val.slice(0, length)), self.trigger("realTime")
        }, 0)
    }
    var $ = require("common/jquery-debug"),
        PlaceHolder = require("model/placeHolder/main-debug"),
        delegate = require("common/delegate-debug"),
        documentMode = document.documentMode;
    !documentMode || 8 !== documentMode && 9 !== documentMode || (delegate.on("keydown", "[maxlength]", maxlength), delegate.on("paste", "[maxlength]", maxlength), $("[placeholder]").each(function() {
        new PlaceHolder({
            element: this
        })
    }))
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
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
define("common/handlerbars-debug", [], function(require, exports, module) {});
"use strict";
define("src/bus/suit/simCase/common/feedback-debug", ["src/bus/suit/simCase/common/main-debug", "common/jquery-debug", "model/placeHolder/main-debug", "common/delegate-debug", "common/myWidget-debug", "model/ajax/main-debug", "model/modal/main-debug", "common/validator-debug", "src/bus/suit/simCase/common/feedback-hbs-debug", "common/handlerbars-debug"], function(require, exports, module) {
    require("src/bus/suit/simCase/common/main-debug");
    var MyWidget = (require("common/jquery-debug"), require("common/myWidget-debug")),
        Ajax = require("model/ajax/main-debug"),
        Model = require("model/modal/main-debug"),
        PlaceHolder = require("model/placeHolder/main-debug"),
        Validator = (require("common/delegate-debug"), require("common/validator-debug")),
        feedbackHbs = require("src/bus/suit/simCase/common/feedback-hbs-debug"),
        Feedback = MyWidget.extend({
            clssName: "Feedback",
            attrs: {
                trigger: "#feedBack",
                template: feedbackHbs()
            },
            events: {
                'click [data-trigger="submit"]': function() {
                    var me = this;
                    me.validatorExp.execute(function(isErr) {
                        isErr || new Ajax({
                            request: "/suit/simCaseRpc/saveFeedback.json",
                            parseForm: me.element
                        }).on("ajaxSuccess", function() {
                            me.hide(), me.modelExp = Model.confirm("提示", "反馈内容发送成功.", null, null, {
                                noCancle: !0,
                                noSure: !0
                            }), window.setTimeout(function() {
                                me.modelExp.hide()
                            }, 3e3)
                        }).submit()
                    })
                },
                'click [data-trigger="cancal"]': function() {
                    var me = this;
                    me.hide()
                }
            },
            initProps: function() {},
            setup: function() {
                var me = this;
                me.delegateEvents(me.triggerNode, "click", function() {
                    me.show()
                }), me.render();
                var documentMode = document.documentMode;
                !documentMode || 8 !== documentMode && 9 !== documentMode || me.$("[placeholder]").each(function() {
                    new PlaceHolder({
                        element: this
                    })
                }), me.validatorExp = Validator.use(me.element, '[data-widget="validator"]')
            },
            show: function() {
                var me = this;
                me.element.removeClass("fn-hide")
            },
            hide: function() {
                var me = this,
                    form = me.$("form");
                form[0].reset(), me.element.addClass("fn-hide"), me.validatorExp.clearError()
            }
        });
    return Feedback
});
define("src/bus/suit/simCase/common/feedback-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="feedback fn-hide">\t<div class="ch-content">\t\t<form action="" method="post" class="fn-MT40 fn-ML45" id="paraform" >\t\t\t<table class="fn-table  fn-table-input">\t\t\t\t<tr>\t\t\t\t\t<td width="70" align="right" class="fn-FS14 fn-WRH fn-LH30">您的邮箱：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<input type="text" name="feedEmail" class="fn-input-text fn-input-text-sm fn-W230 kuma-input" data-rule="email" data-errormessage-required="请填写邮箱。" maxlength="50" data-errormessage-email="请填写正确的邮箱。" data-widget="validator" placeholder="输入您的邮箱，以方便联系您">\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td class="fn-FS14 fn-WRH fn-LH36">反馈内容：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<textarea name="suggestion"  data-trim="true" class="fn-textarea kuma-input  fn-W230 fn-H80" placeholder="您想反馈的问题、意见和建议，这将是我们产品持续优化的方向" value="" maxlength="500" data-widget="validator" data-required="true" data-errormessage="请输入反馈内容。" maxlength="12000"></textarea>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td></td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type="button" class="fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-wrh" data-trigger="submit" value="发送">\t\t\t\t\t\t\t<input type="button" class="fn-ML10 fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-ddd fn-BoCo-ebebeb" data-trigger="cancal" value="取消">\t\t\t\t\t\t</div>\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t</table>\t\t</form>\t</div>\t<div class="ch-shadow"></div><div>');
    return compile.source = '<div class="feedback fn-hide">\t<div class="ch-content">\t\t<form action="" method="post" class="fn-MT40 fn-ML45" id="paraform" >\t\t\t<table class="fn-table  fn-table-input">\t\t\t\t<tr>\t\t\t\t\t<td width="70" align="right" class="fn-FS14 fn-WRH fn-LH30">您的邮箱：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<input type="text" name="feedEmail" class="fn-input-text fn-input-text-sm fn-W230 kuma-input" data-rule="email" data-errormessage-required="请填写邮箱。" maxlength="50" data-errormessage-email="请填写正确的邮箱。" data-widget="validator" placeholder="输入您的邮箱，以方便联系您">\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td class="fn-FS14 fn-WRH fn-LH36">反馈内容：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<textarea name="suggestion"  data-trim="true" class="fn-textarea kuma-input  fn-W230 fn-H80" placeholder="您想反馈的问题、意见和建议，这将是我们产品持续优化的方向" value="" maxlength="500" data-widget="validator" data-required="true" data-errormessage="请输入反馈内容。" maxlength="12000"></textarea>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td></td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type="button" class="fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-wrh" data-trigger="submit" value="发送">\t\t\t\t\t\t\t<input type="button" class="fn-ML10 fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-ddd fn-BoCo-ebebeb" data-trigger="cancal" value="取消">\t\t\t\t\t\t</div>\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t</table>\t\t</form>\t</div>\t<div class="ch-shadow"></div><div>', compile
});