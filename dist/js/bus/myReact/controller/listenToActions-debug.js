"use strict";
define("js/bus/myReact/controller/listenToActions-debug", ["react-debug", "reflux-debug"], function(require, exports, module) {
    var Reflux = (require("react-debug"), require("reflux-debug")),
        ListenToActions = Reflux.createActions(["dataChange", "getInitData", "delete"]);
    module.exports = ListenToActions
});