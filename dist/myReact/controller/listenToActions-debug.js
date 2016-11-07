"use strict";
define("js/bus/myReact/controller/listenToActions-debug", ["common/react-debug", "common/reflux-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        ListenToActions = Reflux.createActions(["dataChange", "getInitData", "delete"]);
    module.exports = ListenToActions
});