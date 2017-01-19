"use strict";
define("src/bus/suit/start/withdraw/main-debug", ["bus/global/main-debug", "model/ajax/main-debug", "common/validator-debug", "model/modal/main-debug", "model/realTime/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var Ajax = require("model/ajax/main-debug"),
        Validator = require("common/validator-debug"),
        Modal = require("model/modal/main-debug"),
        RealTime = require("model/realTime/main-debug");
    new Ajax({
        element: "#page-form",
        request: "/suit/withdraw/save.json",
        paramName: "paramMap",
        autoSuccessAlert: !0,
        autoDestroy: !1,
        events: {
            "click .JS-trigger-click-submit": function() {
                var me = this;
                Validator.oneExecute(this.element) || Modal.confirm("提醒", "您确认要撤诉么？", function() {
                    me.submit()
                })
            }
        },
        onAjaxSuccess: function(rtv, msg, res) {
            location.reload(!0)
        }
    }), new RealTime({
        element: "#withdraw-memo"
    })
});