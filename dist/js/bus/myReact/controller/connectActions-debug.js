"use strict";
define("js/bus/myReact/controller/connectActions-debug", ["common/react-debug", "common/reflux-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        ConnectActions = Reflux.createActions(["add", "getTarget"]);
    module.exports = ConnectActions
});