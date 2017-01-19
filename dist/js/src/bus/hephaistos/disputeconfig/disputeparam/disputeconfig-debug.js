"use strict";
define("src/bus/hephaistos/disputeconfig/disputeparam/disputeconfig-debug", ["common/jquery-debug", "common/myWidget-debug", "-debug", "model/modal/main-debug", "common/handlerbars-debug", "model/ajax/main-debug"], function(require, exports, module) {
    function initUseTpl(data) {
        var me = this;
        new UseTpl({
            request: me.get("requestDisputSave"),
            template: me.get("tpl"),
            data: data,
            paramName: me.get("paramName")
        }).on("ajaxSuccess", function() {
            me.trigger("ajaxSuccess")
        }).show()
    }
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        UseTpl = require("-debug"),
        Ajax = (require("model/modal/main-debug"), require("common/handlerbars-debug"), require("model/ajax/main-debug")),
        Disputeconfig = MyWidget.extend({
            className: "Disputeconfig",
            attrs: {},
            events: {
                'click [data-role="edit"]': function(e) {
                    this.disputeEdit($(e.target).data("param"))
                }
            },
            setup: function() {
                var me = this;
                me.triggerNode && me.delegateEvents(me.triggerNode, "click", function() {
                    initUseTpl.call(me)
                })
            },
            disputeEdit: function(param) {
                var me = this;
                return new Ajax({
                    request: me.get("requestDisputGet"),
                    param: param
                }).on("ajaxSuccess", function(val, msg) {
                    initUseTpl.call(me, val)
                }).submit(), me
            }
        });
    return Disputeconfig
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});