"use strict";
define("src/bus/investigation/addInvestigation/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/upload/main-debug", "common/delegate-debug", "model/ajax/main-debug", "common/validator-debug", "common/dialog-debug", "model/modal/main-debug", "model/editPersonInInvers/main-debug"], function(require, exports, module) {
    function success() {
        var me = this,
            arr = [];
        $('[name="entityNames"]').each(function() {
            arr.push($(this).val())
        }), investigationTarget.html(arr.join(",")), buriedSuccess.call(me)
    }

    function buriedSuccess() {
        var me = this,
            arr = [],
            buriedNodd = (me.get("param").entityRole, $("#buriedAccused"));
        $('[name="entityNames"]').each(function() {
            arr.push($(this).val())
        }), buriedNodd.val(arr.join(",")), buriedNodd.trigger("blur")
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Upload = require("model/upload/main-debug"),
        delegate = require("common/delegate-debug"),
        Ajax = require("model/ajax/main-debug"),
        Validator = require("common/validator-debug"),
        Model = (require("common/dialog-debug"), require("model/modal/main-debug")),
        EditPersonInInvers = require("model/editPersonInInvers/main-debug");
    new EditPersonInInvers({
        trigger: "#addInvestigationAccuser"
    }).on("saveSuccess", success).on("deleteSuccess", success), new EditPersonInInvers({
        trigger: "#addInvestigationAccused"
    }).on("saveSuccess", success).on("deleteSuccess", success), new Upload({
        trigger: '[data-widget="upload"]'
    });
    var validatorExp = Validator.use("#page-form", '[data-widget="validator"]');
    delegate.on("click", '[data-trigger="save"]', function() {
        validatorExp.execute(function(isErr) {
            isErr || new Ajax({
                request: "/mercury/investigationRpc/addInvestigation.json",
                parseForm: "#page-form",
                paramName: "filterMap"
            }).on("ajaxSuccess", function() {
                var modelExp = Model.confirm("提醒", "  提交成功，后台处理需要10分钟左右，请您10分钟后刷新列表查看协查结果。", null, null, {
                    noCancle: !0
                }).after("hide", function() {
                    window.location.href = "/suit/newMySuit.htm#investigation"
                });
                setTimeout(function() {
                    modelExp.hide()
                }, 2e4)
            }).submit()
        })
    });
    var investigationTarget = $("#investigationTarget")
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});