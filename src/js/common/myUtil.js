"use strict";
/**
 * 标题：工具类
 */
define(function(require, exports) {

    //变量
    var util = {},
        arrPro = Array.prototype,
        slice = arrPro.slice;

    //空函数
    var K = util.K = function(k) {
        return k };

    //空对象
    var O = util.O = {};

    //可能是函数
    util.maybeCallback = function(foo, defaultFoo) {
        return typeof foo === 'function' ? foo : defaultFoo || K;
    }

    //控制台
    var log = util.log = function() {
        var args = slice.call(arguments),
            type = args.shift(),
            console = window.console || O,
            log;
        //对type的处理可选值 error[默认] log warn
        if (type !== 'error' && type !== 'log' && type !== 'warn') {
            args.unshift(type);
            type = 'error'
        }
        log = console[type] || K;
        args.unshift('这不是错误:');
        //IE10下的IE8调试模式，console.log 是个对象
        try {
            log.apply(console, args);
        } catch (e) {
            log('这不是错误:', args[1], args[2]);
        };
    }

    //遍历对象
    var breakEachObj = util.breakEachObj = function(obj, callback, context) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (callback.call(context, obj[i], i, obj)) {
                    break;
                }
            }
        }
    }

    //遍历数组
    var breakEachArr = util.breakEachArr = function(arr, callback, context) {
        var index = 0,
            length = arr.length;
        for (; index < length; index++) {
            if (callback.call(context, arr[index], index, arr)) {
                break;
            }
        }
    }

    //数组的indexOf
    var indexOfArr = util.indexOfArr = function(arr, target) {
        var rtv = -1;
        breakEachArr(arr, function(val, index) {
            if (val === target) {
                rtv = index;
                return true;
            }
        });
        return rtv;
    }

    //解析数组
    var setArray = util.setArray = function(obj) {
        return slice.call(obj, 0);
    }

    //格式化日期
    var formatDataRex = /^(yyyy)(.MM)?(.dd)?(.HH)?(.mm)?(.ss)?$/,
        formatDataFoo = ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds'];
    //函数:增加0
    function formatDataAddZero(val) {
        return ('00' + val).slice(-2);
    }
    util.formatData = function(format, timestamp) {
        var date = arguments.length === 1 ? new Date() : new Date(timestamp);
        if (!isNaN(+date)) {
            return format.replace(formatDataRex, function() {
                var index = 0,
                    val,
                    obj,
                    arr = [];
                while (obj = arguments[++index]) {
                    if (!obj) {
                        break;
                    }
                    val = date[formatDataFoo[index - 1]]();
                    //年份的处理
                    if (index === 1) {
                        arr.push('' + val);
                    } else {
                        //月份的处理
                        index === 2 && val++;
                        arr.push(obj.slice(0, 1) + formatDataAddZero(val));
                    }
                }
                return arr.join('');
            });
        } else {
            util.log('日期异常。', timestamp)
        }
    }


    //获取url参数
    util.getUrlParam = function(name, url) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var search = url || window.location.search.substr(1);
        var r = search.match(reg);
        return r ? r[2] : null
    }

    //formatMoney
    var formatMoney = util.formatMoney = function(NUM, MED) {
        var REX = formatMoney.REX;
        //常量的缓存
        if (!REX) {
            REX = formatMoney.REX = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
        };
        return (+NUM).toFixed(~~MED).replace(REX, '$1,');
    }

    return util;

});
