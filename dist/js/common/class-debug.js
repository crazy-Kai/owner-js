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