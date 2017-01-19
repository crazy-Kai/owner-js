"use strict";
define("src/model/modalEditor/main-debug", ["common/myWidget-debug", "model/modal/main-debug", "common/validator-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        Modal = require("model/modal/main-debug"),
        Validator = require("common/validator-debug"),
        ModalEditor = MyWidget.extend({
            clssName: "ModalEditor",
            attrs: {
                request: "/hephaistos/mediatorRpc/queryMediator.json",
                paramName: "paramName",
                title: null,
                autoReset: !0
            },
            events: {
                "click .JS-trigger-click-submit": "modalEditorExecute"
            },
            initProps: function() {
                var me = this;
                me.triggerNode = $(me.get("trigger")), me.form = me.$(".kuma-form"), me.validator = new Validator({
                    element: me.form
                })
            },
            setup: function() {
                var me = this;
                me.modalEditorBindEvent(), me.modalEditorAddValidator(), me.element.on("hidden.bs.modal", function() {
                    me.get("autoReset") && me.modalEditorReset()
                })
            },
            modalEditorShow: function() {
                var me = this,
                    title = me.get("title");
                return me.element.modal(), title && me.$(".JS-target-title").html(title), me
            },
            modalEditorHide: function() {
                var me = this;
                return me.element.modal("hide"), me
            },
            modalEditorBindEvent: function() {
                var me = this;
                return me.triggerNode.on("click", function() {
                    me.set("title", me.triggerNode.prop("title")), me.modalEditorShow()
                }), me
            },
            modalEditorAddValidator: function() {
                var me = this;
                return me.$(".kuma-input,select.kuma-select").each(function() {
                    me.validator.addItem({
                        element: this
                    })
                }), me
            },
            modalEditorExecute: function() {
                var me = this;
                return me.validator.execute(function(flag, list) {
                    flag ? me.log("验证没过。", list) : me.modalEditorPostData()
                }), me
            },
            modalEditorReset: function() {
                var me = this;
                return me.$('[type="text"],textarea,.JS-need-clean').each(function() {
                    this.value = ""
                }), me.$('input[type="checkbox"]').prop("checked", !1), me.$("select.kuma-select").each(function() {
                    this[0] && (this[0].selected = !0, me.jQuery(this).trigger("change"))
                }), me.$('[multiple="multiple"]').each(function() {
                    var self = me.jQuery(this);
                    self.val("请选择"), self.data("selectpicker").refresh()
                }), me.$("#content").find("tr:gt(1)").each(function(index, item) {
                    $(item).find('[data-required="true"]').each(function() {
                        me.validator.removeItem($(this))
                    }), $(item).remove()
                }), me.validator.clearError(), me
            },
            modalEditorPostData: function() {
                var me = this;
                return me.http(me.get("request"), me.paseParam(me.get("paramName"), me.serialize(me.form)), "post", function(err, rtv, msg, response) {
                    err ? (me.log(err), Modal.alert("错误", err)) : (me.trigger("modalEditorSuccess", rtv, msg, response), me.modalEditorHide())
                }), me
            },
            modalEditorWriteback: function(data) {
                var me = this;
                return me.modalEditorShow(), me.unSerialize(me.form, data), me.$("select.kuma-select").each(function() {
                    me.jQuery(this).data("selectpicker").refresh()
                }), me.$('[multiple="multiple"]').each(function() {
                    var self = me.jQuery(this),
                        arr = data[self.prop("name")].split(",");
                    self.val(arr), self.data("selectpicker").refresh()
                }), me
            }
        });
    return ModalEditor
});