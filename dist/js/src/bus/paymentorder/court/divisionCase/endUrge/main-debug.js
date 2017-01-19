"use strict";
define("src/bus/paymentorder/court/divisionCase/endUrge/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/ajax/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Ajax = require("model/ajax/main-debug");
    $(".JS-trigger-click-save").on("click", function(e) {
        new Ajax({
            request: "/paymentorder/paymentOrderRpc/terminatePaymentOrder.json?",
            paramName: "lassenPaymentTerminateDo",
            parseForm: $("#endurge-form")
        }).on("ajaxSuccess", function() {
            location.reload()
        }).submit()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});