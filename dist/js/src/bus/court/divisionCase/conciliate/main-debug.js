define("src/bus/court/divisionCase/conciliate/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/upload/main-debug", "common/delegate-debug", "common/validator-debug", "model/modal/main-debug", "model/ajax/main-debug"], function(require, exports, module) {
    function handleAction() {
        return $("[name=conciliateFileIds]").val() ? void new Ajax({
            request: "/court/conciliateRpc/saveConciliate.json?",
            paramName: "paramMap",
            parseForm: $("#conciliate-form")
        }).on("ajaxSuccess", function(rtv, msg, con) {
            location.reload()
        }).submit() : void Modal.alert(0, "请上传调解书")
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Upload = require("model/upload/main-debug"),
        delegate = require("common/delegate-debug"),
        Validator = require("common/validator-debug"),
        Modal = require("model/modal/main-debug"),
        Ajax = require("model/ajax/main-debug");
    Validator.use("#mediate-form");
    delegate.on("click", ".JS-trigger-click-save", function() {
        handleAction()
    });
    Upload.use(".JS-trigger-click-upload")
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});