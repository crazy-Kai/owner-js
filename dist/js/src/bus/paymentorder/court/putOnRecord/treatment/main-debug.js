"use strict";
define("src/bus/paymentorder/court/putOnRecord/treatment/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/delegate-debug", "common/dialog-debug", "common/handlerbars-debug", "model/ajax/main-debug", "common/tinymce-debug", "model/modal/main-debug"], function(require, exports, module) {
    function queryAndOpen(element) {
        var param = $(element.target).data("sendParam");
        new Ajax({
            request: "/court/lassenSuitWithdrawalRpc/queryWithdrawalDocument.json",
            paramName: "withdrawalDocMap",
            param: param
        }).on("ajaxSuccess", function(rtv, msg, con) {
            openFullTextDialog(rtv, param)
        }).submit()
    }

    function openFullTextDialog(fullTextContent, param) {
        var temp = handlerbars.compile("#template-full-text", !0),
            html = temp(fullTextContent);
        new Dialog({
            content: html,
            width: 800,
            events: {
                "click .JS-trigger-click-save": function(e) {
                    var me = this;
                    me.$("#content").val(tinymce.get("content").getContent()), new Ajax({
                        request: "/court/lassenSuitWithdrawalRpc/saveWithdrawalDocument.json",
                        paramName: "withdrawalDocMap",
                        param: $.extend(param, {
                            content: me.$("#content").val()
                        }),
                        autoSuccessAlert: !0
                    }).on("ajaxSuccess", function(rtv, msg, con) {
                        tinymce.remove("#content"), me.hide()
                    }).submit()
                },
                "click .JS-trigger-click-send": function(e) {
                    var me = this;
                    me.$("#content").val(tinymce.get("content").getContent()), new Ajax({
                        request: "/court/lassenSuitWithdrawalRpc/resendWithdrawalNofity.json",
                        paramName: "withdrawalDocMap",
                        param: $.extend(param, {
                            content: me.$("#content").val()
                        }),
                        autoSuccessAlert: !0
                    }).on("ajaxSuccess", function(rtv, msg, con) {
                        tinymce.remove("#content"), me.hide()
                    }).submit()
                }
            }
        }).after("show", function() {
            var me = this;
            tinymceUse({
                selector: "#content",
                init_instance_callback: function(eb) {
                    me._setPosition()
                }
            })
        }).after("hide", function() {
            this.destroy()
        }).show()
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        delegate = require("common/delegate-debug"),
        Dialog = require("common/dialog-debug"),
        handlerbars = require("common/handlerbars-debug"),
        Ajax = require("model/ajax/main-debug"),
        tinymceUse = require("common/tinymce-debug"),
        Modal = require("model/modal/main-debug"),
        ajaxExp = new Ajax({
            element: "#search-list",
            autoDestroy: !1,
            autoSuccessAlert: !1
        }).on("ajaxSuccess", function(rtv, msg, res) {
            var me = this,
                content = me.$(".content"),
                template = handlerbars.compile(me.$(".template"), !0);
            content.html(template(rtv)), "cased" == rtv.status && "y" != rtv.isPaid ? $("#notPay").show() : $("#notPay").hide(), $("input[name='name']").val(rtv.name)
        }).submit();
    delegate.on("click", ".JS-trigger-click-sendagain", function(element) {
        queryAndOpen(element)
    }), delegate.on("click", ".JS-trigger-click-detail", function(element) {
        new Ajax({
            request: "/court/lassenSuitWithdrawalRpc/querySuitWithdrawal.json",
            param: $(element.target).data("param")
        }).on("ajaxSuccess", function(rtv, msg, con) {
            Dialog.showTemplate("#template-detail", rtv, {
                width: 420
            })
        }).submit()
    }), delegate.on("click", ".JS-trigger-click-treat-auto", function(element) {
        new Ajax({
            request: "/court/lassenSuitWithdrawalRpc/querySuitWithdrawal.json?",
            param: $(element.target).data("param")
        }).on("ajaxSuccess", function(rtv, msg, con) {
            var templateAuto = Dialog.showTemplate("#template-treat-auto", rtv, {
                width: 500,
                events: {
                    "click .JS-trigger-click-save": function(e) {
                        "y" == $('[name="isPaymentOrderSend"]').val() && "agreed" == $('select[name="deal"]').val() ? Modal.alert(0, "该支付令已经发送，同意撤回不符合支付令程序！") : new Ajax({
                            request: "/court/lassenSuitWithdrawalRpc/saveSuitWithdrawal.json",
                            parseForm: "#suitWithdrawal-form-auto",
                            paramName: "suitWithdrawalMap",
                            autoSuccessAlert: !0
                        }).on("ajaxSuccess", function(rtv, msg, con) {
                            ajaxExp.submit(), "agreed" === $('select[name="deal"]').val() && queryAndOpen(element), templateAuto.hide()
                        }).submit()
                    }
                }
            })
        }).submit()
    }), delegate.on("click", ".JS-trigger-click-treat-unpaid", function(element) {
        var parameter = {};
        parameter.name = $("input[name='name']").val(), parameter.applyTime = (new Date).getTime(), $("input[name='applyTime']").val(parameter.applyTime);
        var templateUnpaid = Dialog.showTemplate("#template-treat-unpaid", parameter, {
            width: 500,
            events: {
                "click .JS-trigger-click-save": function(e) {
                    "y" == $('[name="isPaymentOrderSend"]').val() ? Modal.alert(0, "该支付令已经发送，同意撤回不符合支付令程序！") : new Ajax({
                        request: "/court/lassenSuitWithdrawalRpc/saveSuitWithdrawal.json",
                        parseForm: "#suitWithdrawal-form-unpaid",
                        paramName: "suitWithdrawalMap"
                    }).on("ajaxSuccess", function(rtv, msg, con) {
                        ajaxExp.submit(), templateUnpaid.hide(), queryAndOpen(element)
                    }).submit()
                }
            }
        })
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});