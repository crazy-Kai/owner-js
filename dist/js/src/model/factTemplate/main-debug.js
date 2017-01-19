"use strict";
define("src/model/factTemplate/main-debug", ["common/myWidget-debug", "common/calendar-debug", "alinw/dialog/2.0.6/dialog-debug", "model/upload/main-debug", "model/ajax/main-debug", "common/validator-debug", "model/modal/main-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        Calendar = require("common/calendar-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Upload = require("model/upload/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        Validator = require("common/validator-debug"),
        handlerbars = (require("model/modal/main-debug"), MyWidget.handlerbars),
        FactTemplate = MyWidget.extend({
            clssName: "FactTemplate",
            attrs: {
                request: "/suit/legalCaseRpc/getFactInfo.json",
                paramName: "paraMap"
            },
            events: {
                "click .JS-trigger-click-select": function() {
                    return this.ftDialogForm.show()
                }
            },
            initProps: function() {
                var me = this;
                return me.ftTempleFact = handlerbars.compile(me.$(".JS-temple-fact").html()), me.ftDialogForm = new Dialog({
                    width: 600,
                    content: me.ftTempleFact(),
                    events: {
                        "click .JS-trigger-click-submit": function() {
                            !Validator.oneExecute(this.element, ".JS-target-required") && me.ftSubmitForm()
                        }
                    }
                }).render(), me.ftForm = me.ftDialogForm.$(".JS-target-form"), me.ftTextarea = me.$(".JS-target-textarea"), me.ftUpload = new Upload({
                    trigger: ".JS-need-upload"
                }), me.ftCalendar = new Calendar({
                    trigger: ".JS-need-calendar"
                }), me
            },
            setup: function() {
                var me = this;
                return me
            },
            ftSubmitForm: function() {
                var me = this;
                return new Ajax({
                    request: me.get("request"),
                    paramName: me.get("paramName"),
                    parseForm: me.ftForm
                }).on("ajaxSuccess", function(rtv, msg, con) {
                    me.ftTextarea.val(rtv), me.ftDialogForm.hide(), me.ftUpload.uploadRenderClear(), me.ftForm[0].reset(), MyWidget.getWidget("#evidence").evidenceDataRender()
                }).submit(), me
            }
        });
    return FactTemplate
});