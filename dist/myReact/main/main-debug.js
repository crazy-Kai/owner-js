"use strict";
define("js/bus/myReact/main/main-debug", ["common/react-debug", "common/react-dom-debug", "bus/myReact/jsx/reactContainer-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ReactDOM = require("common/react-dom-debug"),
        Container = require("bus/myReact/jsx/reactContainer-debug");
    ReactDOM.render(React.createElement(Container, {
        sourceData: "bus/myReact/data.json"
    }), document.getElementById("test"))
});