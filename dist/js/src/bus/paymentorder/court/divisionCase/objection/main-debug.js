"use strict";
define("src/bus/paymentorder/court/divisionCase/objection/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/ajax/main-debug", "model/imgView/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Ajax = require("model/ajax/main-debug"),
        ImgView = require("model/imgView/main-debug");
    new ImgView, $('[data-role="conclusion"]').on("click", function() {
        "setup" == $(this).val() ? $(".JS-trigger-click-save").removeClass("fn-W150").addClass("fn-W100").val("失效支付令") : $(".JS-trigger-click-save").removeClass("fn-W100").addClass("fn-W150").val("驳回异议申请裁定")
    }), $(".JS-trigger-click-save").on("click", function(e) {
        var conclusion = $('[data-role="conclusion"]').val(),
            url = "setup" == conclusion ? "/paymentorder/paymentOrderRpc/invalidPaymentOrder.json" : "/paymentorder/paymentOrderRpc/rejectPaymentObjection.json";
        new Ajax({
            request: url,
            paramName: "lassenPaymentObjectionDo",
            parseForm: $("#objection-form"),
            autoErrorAlert: !0
        }).on("ajaxSuccess", function() {
            location.reload()
        }).submit()
    }), $('[data-role="load-more"]').on("click", function(e) {
        var iTag = $(this).next("i");
        iTag.hasClass("kuma-icon-title-down") ? (iTag.removeClass("kuma-icon-title-down").addClass("kuma-icon-title-up"), $('[data-role="more-infor"]').removeClass("fn-hide")) : (iTag.removeClass("kuma-icon-title-up").addClass("kuma-icon-title-down"), $('[data-role="more-infor"]').addClass("fn-hide"))
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});