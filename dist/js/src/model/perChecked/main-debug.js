"use strict";
define("src/model/perChecked/main-debug", ["common/myWidget-debug", "model/modal/main-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        PerSubmit = (require("model/modal/main-debug"), MyWidget.extend({
            clssName: "PerSubmit",
            attrs: {
                checked: ".JS-trigger-click-checked",
                submit: ".JS-trigger-click-submit"
            },
            initProps: function() {
                var me = this,
                    myEvents = {};
                return myEvents["change " + me.get("checked")] = "psToggleBtn", myEvents["click " + me.get("submit")] = "psCheckedNext", me.psChecked = me.$(me.get("checked")), me.psSubmit = me.$(me.get("submit")), me.delegateEvents(myEvents), me
            },
            setup: function() {
                var me = this;
                return me.psSubmit.addClass("fn-btn-disabled"), me.psToggleBtn(), me
            },
            psToggleBtn: function(e) {
                var me = this;
                return me.psChecked.prop("checked") ? me.psSubmit.removeClass("fn-btn-disabled") : me.psSubmit.addClass("fn-btn-disabled"), me
            },
            psCheckedNext: function() {
                var me = this;
                return !me.psSubmit.hasClass("fn-btn-disabled")
            }
        }));
    return PerSubmit
});