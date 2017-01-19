define("src/bus/court/divisionCase/writtenJudgment/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/upload/main-debug", "common/delegate-debug", "common/validator-debug", "model/ajax/main-debug", "common/tinymce-debug"], function(require, exports, module) {
    function handleAction() {
        $("#content").val(tinymce.get("content").getContent()), new Ajax({
            request: "/court/lassenCourtJudgmentRpc/saveCourtJudgment.json?securityCaseId=" + encodeURIComponent($("input[name='securityCaseId']").val()),
            paramName: "lassenCourtJudgmentVo",
            parseForm: $("#writtenJudgment-form")
        }).on("ajaxSuccess", function(rtv, msg, con) {
            location.reload()
        }).submit()
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Upload = require("model/upload/main-debug"),
        delegate = require("common/delegate-debug"),
        Validator = require("common/validator-debug"),
        Ajax = require("model/ajax/main-debug"),
        tinymceUse = require("common/tinymce-debug"),
        validatorExp = Validator.use("#writtenJudgment-form");
    tinymceUse({
        selector: "#content"
    }), delegate.on("click", ".JS-trigger-click-publish", function() {
        $("input[name='division']").val("publish"), validatorExp.execute(function(flag, err) {
            flag || handleAction()
        })
    }), delegate.on("click", ".JS-trigger-click-save", function() {
        $("input[name='division']").val("save"), handleAction()
    }), delegate.on("mouseover", ".JS-trigger-click-link", function(target) {
        $(target.target).addClass("fn-btn-primary")
    }), delegate.on("mouseout", ".JS-trigger-click-link", function(target) {
        $(target.target).removeClass("fn-btn-primary")
    });
    Upload.use(".JS-trigger-click-upload")
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});