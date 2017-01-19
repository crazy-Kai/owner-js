define("src/bus/paymentorder/court/divisionCase/paymentReqExecution/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/validator-debug", "common/delegate-debug", "model/modal/main-debug", "model/ajax/main-debug"], function(require, exports, module) {
    "use strict";
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Validator = require("common/validator-debug"),
        Delegate = require("common/delegate-debug"),
        Modal = require("model/modal/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        ValidatorExp = Validator.use("#form", '[data-widget="validator"]');
    $('[name="securityCaseId"]').val();
    Delegate.on("click", "[data-target='commit']", function() {
        ValidatorExp.execute(function(isErr, list) {
            isErr || new Ajax({
                request: "/paymentorder/paymentExecutionRpc/requestExecution.json",
                parseForm: "#form",
                paramName: "lassenPaymentExecutionDo"
            }).on("ajaxSuccess", function() {
                Modal.alert(1, "提交成功", function() {
                    window.location.href = "/suit/newMySuit.htm#paymentAllCase"
                })
            }).submit()
        })
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});