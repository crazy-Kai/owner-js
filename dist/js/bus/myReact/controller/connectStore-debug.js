"use strict";
define("js/bus/myReact/controller/connectStore-debug", ["react-debug", "reflux-debug", "js/bus/myReact/controller/connectActions-debug"], function(require, exports, module) {
    var Reflux = (require("react-debug"), require("reflux-debug")),
        ConnectActions = require("js/bus/myReact/controller/connectActions-debug"),
        ConnectStore = Reflux.createStore({
            listenables: [ConnectActions],
            isShow: !1,
            onAdd: function() {
                var me = this;
                me.trigger({
                    boxStyle: {
                        display: me.isShow ? "none" : "block"
                    }
                }, function() {
                    me.isShow = !me.isShow
                })
            },
            onGetTarget: function(e) {}
        });
    return ConnectStore
});
"use strict";
define("js/bus/myReact/controller/connectActions-debug", ["react-debug", "reflux-debug"], function(require, exports, module) {
    var Reflux = (require("react-debug"), require("reflux-debug")),
        ConnectActions = Reflux.createActions(["add", "getTarget"]);
    module.exports = ConnectActions
});