"use strict";
define("js/bus/myReact/main/main-debug", ["react-debug", "reactDOM-debug", "bus/myReact/jsx/reactContainer-debug"], function(require, exports, module) {
    var React = require("react-debug"),
        ReactDOM = require("reactDOM-debug"),
        Container = require("bus/myReact/jsx/reactContainer-debug");
    ReactDOM.render(React.createElement(Container, {
        sourceData: "bus/myReact/data.json"
    }), document.getElementById("test"))
});