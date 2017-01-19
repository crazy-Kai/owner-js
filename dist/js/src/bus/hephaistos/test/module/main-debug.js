"use strict";
define("src/bus/hephaistos/test/module/main-debug", ["common/jquery-debug", "model/paginator/main-debug", "model/searchList/main-debug", "model/modal/main-debug", "model/selectpicker/main-debug", "model/upload/main-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        Paginator = require("model/paginator/main-debug"),
        SearchList = require("model/searchList/main-debug"),
        Modal = require("model/modal/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        Upload = require("model/upload/main-debug");
    new Paginator({
        element: "#paginator",
        totle: 100
    }), new SearchList({
        element: "#searchList"
    });
    $("#modal").on("click", function() {
        Modal.alert("123", "456")
    });
    Selectpicker.use(".selectpicker");
    Upload.use(".JS-trigger-click-upload")
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});