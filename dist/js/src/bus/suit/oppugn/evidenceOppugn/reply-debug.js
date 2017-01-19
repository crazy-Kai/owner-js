"use strict";
define("src/bus/suit/oppugn/evidenceOppugn/reply-debug", ["bus/global/main-debug", "common/jquery-debug", "common/myWidget-debug", "common/validator-debug", "model/ajax/main-debug", "model/upload/main-debug", "model/modal/main-debug", "common/dialog-debug", "common/tip-debug"], function(require, exports, module) {
    function useIsAgree(tables) {
        tables.each(function() {
            var table = $(this),
                flag = "y" === table.find('select[name="isAgree"]').val(),
                noAgree = table.find(".noAgree");
            noAgree[flag ? "addClass" : "removeClass"]("fn-hide"), MyWidget[flag ? "disabledTrue" : "disabledFalse"](noAgree)
        })
    }

    function setAjax(theDial, target) {
        var me = this;
        Modal.confirm("警告", "您确定要提交吗？提交后不可修改。", function() {
            new Ajax({
                request: me.get("evidenceOppugnSave"),
                paramName: "evidenceOppugnVos",
                autoSuccessAlert: !0,
                parseForm: theDial.contentElement,
                param: target.data("param"),
                paramParse: function(data) {
                    var evidenceOppugnVos = data.evidenceOppugnVos;
                    return delete data.evidenceOppugnVos, me.breakEachArr(evidenceOppugnVos, function(val) {
                        $.extend(val, data)
                    }), evidenceOppugnVos
                },
                autoSubmit: !0,
                onAjaxSuccess: function(rtv) {
                    var listBlock = target.closest(".JS-target-list-block");
                    theDial.hide(), listBlock.find(".JS-target-isanswer").html("您已回复"), target.next().remove(), target.remove(), listBlock.find(".JS-target-allanswer").html(rtv.allAnswerCount)
                }
            })
        })
    }

    function getView(e, btn, tpl) {
        var me = this,
            target = me.jQuery(e.target).closest(btn);
        new Ajax({
            request: me.get("evidenceOppugnGet"),
            autoSubmit: !0,
            param: target.data("param"),
            onAjaxSuccess: function(rtv, msg, req) {
                Dialog.showTemplate(tpl, rtv)
            }
        })
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        Validator = require("common/validator-debug"),
        Ajax = require("model/ajax/main-debug"),
        Upload = require("model/upload/main-debug"),
        Modal = require("model/modal/main-debug"),
        Dialog = require("common/dialog-debug"),
        Tip = require("common/tip-debug"),
        Reply = MyWidget.extend({
            clssName: "Reply",
            attrs: {
                evidenceOppugnSave: "/suit/evidenceOppugn/save.json",
                evidenceOppugnGet: "/suit/evidenceOppugn/get.json"
            },
            events: {
                "click .JS-trigger-click-reply": function(e) {
                    var me = this,
                        target = me.jQuery(e.target),
                        dialogExp = Dialog.showTemplate("#template-reply", {}, {
                            events: {
                                "click .JS-trigger-click-save": function() {
                                    Validator.oneExecute(dialogExp.contentElement) || setAjax.call(me, dialogExp, target)
                                },
                                'change select[name="isAgree"]': function(e) {
                                    useIsAgree(me.jQuery(e.target).closest(".JS-target-table"))
                                }
                            }
                        }).before("hide", function() {
                            uploadExp.destroy()
                        }),
                        uploadExp = new Upload({
                            trigger: dialogExp.$(".JS-need-upload"),
                            rule: "(.jpg|.jpeg|.png|.bmp)$",
                            ruleErrMsg: "请上传后缀是jpg,jpeg,png,bmp的图片",
                            accept: "image/jpg, image/jpeg, image/png, image/bmp"
                        });
                    useIsAgree(dialogExp.$(".JS-target-table"))
                },
                "click .JS-trigger-click-view": function(e) {
                    getView.call(this, e, ".JS-trigger-click-view", "#template-view")
                },
                "click .JS-trigger-click-evidence-reply": function(e) {
                    var me = this,
                        target = me.jQuery(e.target),
                        dialogExp = Dialog.showTemplate("#template-evidence-reply", {}, {
                            events: {
                                'change select[name="isAgree"]': function(e) {
                                    useIsAgree(me.jQuery(e.target).closest(".JS-target-table"))
                                },
                                "click .JS-trigger-click-save": function() {
                                    Validator.oneExecute(dialogExp.contentElement) || setAjax.call(me, dialogExp, target)
                                }
                            }
                        }).before("hide", function() {
                            Upload.remove(dialogExp.$(".JS-need-upload")), Tip.remove(dialogExp.$(".JS-need-tip"))
                        });
                    Upload.use(dialogExp.$(".JS-need-upload"), {
                        rule: "(.jpg|.jpeg|.png|.bmp)$",
                        ruleErrMsg: "请上传后缀是jpg,jpeg,png,bmp的图片",
                        accept: "image/jpg, image/jpeg, image/png, image/bmp"
                    }), Tip.use(dialogExp.$(".JS-need-tip"), {
                        zIndex: 9999,
                        arrowPosition: 9
                    }), useIsAgree(dialogExp.$(".JS-target-table"))
                },
                "click .JS-trigger-click-evidence-view": function(e) {
                    getView.call(this, e, ".JS-trigger-click-evidence-view", "#template-evidence-view")
                }
            },
            initProps: function() {},
            destroy: function() {
                var me = this;
                Reply.superclass.destroy.call(me)
            }
        });
    module.exports = Reply
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});