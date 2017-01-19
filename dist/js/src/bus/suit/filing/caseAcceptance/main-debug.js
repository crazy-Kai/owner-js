"use strict";
define("src/bus/suit/filing/caseAcceptance/main-debug", ["bus/global/main-debug", "common/validator-debug", "model/perSubmit/main-debug", "common/delegate-debug"], function(require, exports, module) {
    function toggleBtn(node, btn) {
        node.prop("checked") ? btn.removeClass("fn-btn-disabled") : btn.addClass("fn-btn-disabled")
    }

    function checkNodeCanUse(node) {
        return !node.hasClass("fn-btn-disabled")
    }
    require("bus/global/main-debug");
    var PerSubmit = (require("common/validator-debug"), require("model/perSubmit/main-debug")),
        caseAcceptanceChecked = (require("common/delegate-debug"), $("#caseAcceptanceChecked")),
        caseAcceptanceSure = $("#caseAcceptanceSure");
    caseAcceptanceChecked.on("click", function() {
        toggleBtn($(this), caseAcceptanceSure)
    }), caseAcceptanceSure.on("click", function() {
        checkNodeCanUse($(this)) && new PerSubmit({
            element: "#page-param"
        }).on("ajaxSuccess", function(rtv, msg, con) {}).psSubmit()
    })
});