"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
}
define("js/bus/objectExtends/main-debug", [], function(require, exports, module) {
    function Item(x, y) {
        this.name = x, this.old = this.name + y
    }
    var v1 = "abc",
        v2 = !1,
        v3 = 12,
        obj = (Object.assign({}, v1, v2, v3), {});
    Object.defineProperty(obj, "name", {
        value: "2",
        writable: !0,
        enumerable: !1,
        configurable: !0
    });
    var SomeClasee = function SomeClasee(x, y) {
        _classCallCheck(this, SomeClasee), Object.assign(this, {
            x: x,
            y: y
        })
    };
    Object.assign(SomeClasee.prototype, {
        someMethod: function(arg1, arg2) {
            return arg1
        },
        another: function(arg3, arg4) {
            return arg3
        }
    });
    var Pasta = function Pasta(grain, width) {
            _classCallCheck(this, Pasta), this.grain = grain, this.width = width
        },
        spaghetti = new Pasta("wheat", .2),
        proto = Object.getPrototypeOf(spaghetti);
    proto.foodgroup = "carbohydrates";
    Item.prototype.toString = function() {};
    var item = new Item("wukai", "27"),
        items = {};
    items = Object.create(item, {
        test1: {
            value: "w",
            enumerable: !0,
            writable: !0,
            configurable: !0
        },
        test2: {
            configurable: !1,
            get: function() {
                return test2
            },
            set: function(value) {
                test2 = value
            }
        }
    }), items.toString()
});