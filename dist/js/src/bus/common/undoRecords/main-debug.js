define("src/bus/common/undoRecords/main-debug", ["common/jquery-debug", "common/dialog-debug", "model/ajax/main-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        Dialog = require("common/dialog-debug"),
        Ajax = require("model/ajax/main-debug");
    new Ajax({
        element: "#page-form",
        request: "/court/lassenSuitWithdrawalRpc/queryWithdrawalDetail.json",
        autoDestroy: !1,
        events: {
            "click .JS-trigger-click-check": function(e) {
                var me = this,
                    self = $(e.target);
                me.set("param", self.data("param")), this.submit()
            }
        },
        onAjaxSuccess: function(rtv, msg, res) {
            Dialog.showTemplate("#template-check", rtv, {
                width: 420
            })
        }
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});