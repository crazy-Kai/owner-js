define("src/bus/paymentorder/fileobjection/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/validator-debug", "model/upload/main-debug", "common/delegate-debug", "model/modal/main-debug", "model/imgView/main-debug", "model/ajax/main-debug"], function(require, exports, module) {
    function tempHideInout() {
        $("#form").find('input[type="text"]').each(function() {
            var self = $(this);
            self.val().indexOf("*") !== -1 && self.prop("defaultValue") === self.prop("value") && self.addClass("fn-hide")
        })
    }

    function testValue() {
        $('[name="phone"]').val() || $('[name="email"]').val() ? $('[data-test="test"]').addClass("fn-hide") : $('[data-test="test"]').removeClass("fn-hide")
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Validator = require("common/validator-debug"),
        Upload = require("model/upload/main-debug"),
        Delegate = require("common/delegate-debug"),
        Modal = require("model/modal/main-debug"),
        ImgView = require("model/imgView/main-debug"),
        Ajax = require("model/ajax/main-debug");
    new ImgView, new Upload({
        trigger: '[data-widget="upload"]'
    }), $("#form").on("blur", "input[type='text']", function() {
        tempHideInout()
    }), Delegate.on("blur", "input[type='text']", function() {
        $(this);
        $("input[type='text']").removeClass("fn-hide")
    }), $('[name="phone"],[name="email"]').keydown(function() {
        $('[data-test="test"]').addClass("fn-hide")
    }), Delegate.on("click", "[data-target='commit']", function() {
        var ValidatorExp = Validator.use("#form", '[data-widget="validator"]');
        tempHideInout(), testValue(), ValidatorExp.execute(function(isErr, list) {
            isErr || ($.trim($('[name="phone"]').val()) || $.trim($('[name="email"]').val())) && new Ajax({
                request: "/paymentorder/paymentObjectionRpc/fileObjection.json",
                parseForm: "#form",
                paramName: "lassenPaymentObjectionVo",
                paramParse: function(json) {
                    for (var i in json) json[i].indexOf("*") !== -1 && delete json[i];
                    return json
                }
            }).on("ajaxSuccess", function() {
                Modal.alert(1, "提交成功", function() {
                    window.location.href = "/suit/newMySuit.htm#paymentAllCase"
                })
            }).submit()
        }), $("#form").find('input[type="text"]').removeClass("fn-hide")
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});