"use strict";
define("src/bus/suit/caseDocument/main-debug", ["bus/global/main-debug", "common/validator-debug", "model/ajax/main-debug", "model/perChecked/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var Ajax = (require("common/validator-debug"), require("model/ajax/main-debug")),
        PerChecked = require("model/perChecked/main-debug");
    new PerChecked({
        element: "#page-check"
    }).after("psCheckedNext", function(flag) {
        flag && new Ajax({
            element: "#page-param",
            autoSuccessAlert: !0
        }).on("ajaxSuccess", function() {
            window.close()
        }).submit()
    })
});