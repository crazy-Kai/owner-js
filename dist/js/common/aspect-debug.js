"use strict";
define("js/common/aspect-debug", ["common/events-debug"], function(require, exports) {
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