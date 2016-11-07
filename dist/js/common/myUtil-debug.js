"use strict";
define("common/myUtil-debug", [], function(require, exports) {
    function formatDataAddZero(val) {
        return ("00" + val).slice(-2)
    }
    var util = {},
        arrPro = Array.prototype,
        slice = arrPro.slice,
        K = util.K = function(k) {
            return k
        },
        O = util.O = {};
    util.maybeCallback = function(foo, defaultFoo) {
        return "function" == typeof foo ? foo : defaultFoo || K
    };
    var breakEachArr = (util.log = function() {
            var log, args = slice.call(arguments),
                type = args.shift(),
                console = window.console || O;
            "error" !== type && "log" !== type && "warn" !== type && (args.unshift(type), type = "error"), log = console[type] || K, args.unshift("这不是错误:");
            try {
                log.apply(console, args)
            } catch (e) {
                log("这不是错误:", args[1], args[2])
            }
        }, util.breakEachObj = function(obj, callback, context) {
            for (var i in obj)
                if (obj.hasOwnProperty(i) && callback.call(context, obj[i], i, obj)) break
        }, util.breakEachArr = function(arr, callback, context) {
            for (var index = 0, length = arr.length; index < length && !callback.call(context, arr[index], index, arr); index++);
        }),
        formatDataRex = (util.indexOfArr = function(arr, target) {
            var rtv = -1;
            return breakEachArr(arr, function(val, index) {
                if (val === target) return rtv = index, !0
            }), rtv
        }, util.setArray = function(obj) {
            return slice.call(obj, 0)
        }, /^(yyyy)(.MM)?(.dd)?(.HH)?(.mm)?(.ss)?$/),
        formatDataFoo = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"];
    util.formatData = function(format, timestamp) {
        var date = 1 === arguments.length ? new Date : new Date(timestamp);
        return isNaN(+date) ? void util.log("日期异常。", timestamp) : format.replace(formatDataRex, function() {
            for (var val, obj, index = 0, arr = [];
                (obj = arguments[++index]) && obj;) val = date[formatDataFoo[index - 1]](), 1 === index ? arr.push("" + val) : (2 === index && val++, arr.push(obj.slice(0, 1) + formatDataAddZero(val)));
            return arr.join("")
        })
    }, util.getUrlParam = function(name, url) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            search = url || window.location.search.substr(1),
            r = search.match(reg);
        return r ? r[2] : null
    };
    var formatMoney = util.formatMoney = function(NUM, MED) {
        var REX = formatMoney.REX;
        return REX || (REX = formatMoney.REX = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g), (+NUM).toFixed(~~MED).replace(REX, "$1,")
    };
    return util
});