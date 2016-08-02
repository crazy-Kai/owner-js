"use strict";
define("js/bus/myReact/controller/connectStore-debug", ["common/react-debug", "common/reflux-debug", "js/bus/myReact/controller/connectActions-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
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
define("js/bus/myReact/controller/connectActions-debug", ["common/react-debug", "common/reflux-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        ConnectActions = Reflux.createActions(["add", "getTarget"]);
    module.exports = ConnectActions
});