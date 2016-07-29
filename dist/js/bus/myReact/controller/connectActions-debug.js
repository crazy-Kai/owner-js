"use strict";
define("js/bus/myReact/controller/connectActions-debug", ["react-debug", "reflux-debug"], function(require, exports, module) {
    var Reflux = (require("react-debug"), require("reflux-debug")),
        ConnectActions = Reflux.createActions(["add", "getTarget"]);
    module.exports = ConnectActions
});