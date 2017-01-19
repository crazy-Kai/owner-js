define("src/bus/court/putOnRecord/defendantServed/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/delegate-debug", "common/handlerbars-debug", "common/validator-debug", "model/ajax/main-debug", "model/imgView/main-debug", "common/dialog-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        delegate = require("common/delegate-debug"),
        handlerbars = require("common/handlerbars-debug"),
        delegate = require("common/delegate-debug"),
        Validator = require("common/validator-debug"),
        Ajax = require("model/ajax/main-debug"),
        ImgView = require("model/imgView/main-debug"),
        Dialog = require("common/dialog-debug"),
        service = $("#service");
    new ImgView;
    var ajaxExp = new Ajax({
            element: "#search-list",
            autoDestroy: !1,
            autoSuccessAlert: !1,
            parseForm: "#page-param"
        }).on("ajaxSuccess", function(rtv, msg, res) {
            var me = this,
                content = me.$(".content"),
                template = handlerbars.compile(me.$(".template"), !0);
            content.html(template(rtv)), me.hide(service);
            var endStatus = ["conciliate", "sentenced", "jurisediction_objection", "not_accepted", "return", "dropped", "not_be_served", "cancel_apply", "unpaid_dropped"];
            rtv && $.inArray(rtv.status, endStatus) < 0 && me.breakEachArr(rtv.lassenReceiveConfirmVoList, function(val) {
                if (!val.receiveTime) return me.show(service), !0
            })
        }).submit(),
        templateService = Dialog.showTemplate("#template-service", {
            flag: !0
        }, {
            width: 500,
            autoShow: !1,
            autoDestroy: !1,
            events: {
                "click .JS-trigger-click-submit": function(e) {
                    new Ajax({
                        element: this.element,
                        request: "/court/lassenReceiveConfirmRpc/saveReceiveWithunable.json",
                        paramName: "lassenReceiveWithunableDo",
                        parseForm: "#page-param"
                    }).on("ajaxSuccess", function() {
                        ajaxExp.submit(), templateService.hide()
                    }).submit()
                }
            }
        });
    templateService.render(), templateService.before("show", function(entityMapList) {
        this.$(".JS-target-entitylist").html(entityMapList)
    }), delegate.on("click", ".JS-trigger-click-sended", function() {
        var self = $(this);
        new Ajax({
            request: "/court/lassenReceiveConfirmRpc/queryReceive.json",
            param: self.data("param")
        }).on("ajaxSuccess", function(rtv, msg, res) {
            Dialog.showTemplate("#template-sended", rtv, {
                width: 450
            })
        }).submit()
    }), delegate.on("click", ".JS-trigger-click-treatment", function() {
        var self = $(this);
        new Ajax({
            request: "/court/lassenReceiveConfirmRpc/queryReceiveConfirm.json",
            param: self.data("param")
        }).on("ajaxSuccess", function(rtv, msg, res) {
            Dialog.showTemplate("#template-treatment", rtv, {
                width: 500,
                events: {
                    "click .JS-trigger-click-submit": function(e) {
                        var me = this;
                        Validator.oneExecute(this.element) || new Ajax({
                            element: me.element,
                            request: "/court/lassenReceiveConfirmRpc/saveReceiveConfirm.json",
                            paramName: "lassenReceiveConfirmDo",
                            onAjaxSuccess: function() {
                                ajaxExp.submit(), me.hide()
                            }
                        }).submit()
                    }
                }
            })
        }).submit()
    }), delegate.on("click", ".JS-trigger-click-record", function() {
        var self = $(this);
        new Ajax({
            request: "/court/lassenReceiveConfirmRpc/queryReceive.json",
            param: self.data("param")
        }).on("ajaxSuccess", function(rtv, msg, res) {
            rtv.receiveInfo && "y" === rtv.receiveInfo.isReceive ? Dialog.showTemplate("#template-record", rtv, {
                width: 500
            }) : Dialog.showTemplate("#template-service", rtv, {
                width: 450
            })
        }).submit()
    }), delegate.on("click", ".JS-trigger-click-service", function() {
        new Ajax({
            request: "/court/lassenReceiveConfirmRpc/queryReceiveWithunable.json",
            parseForm: "#page-param"
        }).on("ajaxSuccess", function(rtv, msg, res) {
            templateService.show(rtv.entityMapList.join(","))
        }).submit()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});