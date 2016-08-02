"use strict";
define("js/model/es6reactModules/index-debug", ["common/hoc-debug", "js/model/es6reactModules/view-debug", "common/react-debug", "js/model/es6reactModules/controller-debug", "common/controller-debug"], function(require, exports, module) {
    return require("common/hoc-debug")(require("js/model/es6reactModules/view-debug"), require("js/model/es6reactModules/controller-debug"))
});
"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
}

function _possibleConstructorReturn(self, call) {
    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !call || "object" != typeof call && "function" != typeof call ? self : call
}

function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass)
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
}();
define("js/model/es6reactModules/view-debug", ["common/react-debug", "js/model/es6reactModules/controller-debug", "common/controller-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        Actions = require("js/model/es6reactModules/controller-debug").Actions,
        View = function(_React$Component) {
            function View() {
                return _classCallCheck(this, View), _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments))
            }
            return _inherits(View, _React$Component), _createClass(View, [{
                key: "render",
                value: function() {
                    var me = this,
                        props = me.props;
                    return React.createElement("div", null, props.a, " ", props.b, " ", React.createElement("a", {
                        href: "javascript:;",
                        onClick: Actions.add
                    }, "点击"))
                }
            }]), View
        }(React.Component);
    return View
});
"use strict";
define("js/model/es6reactModules/controller-debug", ["common/controller-debug"], function(require, exports, module) {
    var Control = require("common/controller-debug");
    return Control({
        store: {
            a: "a1"
        },
        getInitialState: function() {
            return this.store
        },
        onAdd: function() {
            var me = this,
                store = me.store;
            me.ajax({
                request: "/portal/mediatorRpc/queryMediator.json",
                param: {
                    filterMap: JSON.stringify({
                        cityId: "",
                        mediatorType: "",
                        page: {
                            begin: 0,
                            length: 8
                        }
                    })
                }
            }).then(function() {
                store.b = "b2", me.updateComponent()
            }, function() {})
        }
    })
});