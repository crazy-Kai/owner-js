"use strict";
define("src/model/selectionOrder/mainBnk-debug", ["common/jquery-debug", "model/editAccus/main-debug", "alinw/dialog/2.0.6/dialog-debug", "model/modal/main-debug", "model/ajax/main-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        EditAccus = require("model/editAccus/main-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Modal = require("model/modal/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        $ = EditAccus.jQuery,
        handlerbars = EditAccus.handlerbars,
        orderTemplate = handlerbars.compile(["{{#if this}}", "{{#each this}}", "<tr>", "<td>", '<input type="radio" name="orderId" value="{{orderId}}" />', '<input type="radio" class="fn-hide-input" name="bizOrderId" value="{{orderId}}" />', '<input type="radio" class="fn-hide-input" name="auctionTitle" value="{{auctionTitle}}" />', '<input type="radio" class="fn-hide-input" name="shopName" value="{{shopName}}" />', '<input type="radio" class="fn-hide-input" name="acutalTotalFee" value="{{parseAmount acutalTotalFee}}" />', '<input type="radio" class="fn-hide-input" name="status" value="{{status}}" />', "</td>", "<td>{{orderId}}</td>", "<td>{{auctionTitle}}</td>", "<td>{{shopName}}</td>", "<td>{{parseAmount acutalTotalFee}}</td>", "<td>{{status}}</td>", "</tr>", "{{/each}}", "{{else}}", "<tr>", '<td colspan="6">', '当前没有<span class="fn-color-F00">可以起诉的订单</span>，请选择经过购物网站投诉处理过的纠纷订单，未申请客服介入则请通过购物网站的交易纠纷投诉处理，以便调解员尽快对买卖双方进行调解', "</td>", "</tr>", "{{/if}}"].join("")),
        Selectionorder = EditAccus.extend({
            clssName: "Selectionorder",
            attrs: {
                disputeOrderList: "/suit/disputeOrder/listTradeOrder.json",
                disputeOrderSelectDisputeOrder: "/suit/disputeOrder/selectDisputeOrder.json",
                pageParam: "#pageParam"
            },
            events: {
                "click .JS-trigger-click-search": "soSelectionSearch"
            },
            initProps: function() {
                var me = this;
                Selectionorder.superclass.initProps.call(me), me.pageParam = $(me.get("pageParam")), me.soOrdeTemple = handlerbars.compile(me.$(".JS-temple-orde").html()), me.soTriggerNode = me.$(".JS-trigger-click-select"), me.soOrderDialog = new Dialog({
                    width: 800,
                    closeTpl: "",
                    content: me.soOrdeTemple(),
                    events: {
                        "click .JS-trigger-click-sure": function() {
                            var DO = me.serialize(me.soOrderDialog.contentElement);
                            me.orderDo = DO, DO.orderId ? me.get("orderId") ? "" + me.get("orderId") !== DO.orderId ? Modal.confirm("提醒", "填写的信息将会全部更新", function() {
                                me.soOrderChecked(DO)
                            }) : (me.log("订单重复选择"), me.soOrderDialog.hide()) : me.soOrderChecked(DO) : Modal.alert(0, "请选择订单")
                        },
                        "click .JS-trigger-click-cancel": function() {
                            me.soOrderDialog.hide()
                        },
                        "click tr": function(e) {
                            var target = me.closest(e.target, "tr");
                            this.$('[type="radio"]').prop("checked", !1), target.find('[type="radio"]').prop("checked", !0)
                        }
                    }
                }).render(), me.causeAction = $('select[name="causeAction"]'), me.on("successDeleteAccus", function() {
                    me.soToggleAddByCauseAction()
                })
            },
            setup: function() {
                var me = this;
                Selectionorder.superclass.setup.call(me), me.soToggleAddByCauseAction()
            },
            soToggleAddByCauseAction: function() {
                var me = this;
                return me.$(".JS-trigger-click-add")["网络购物合同纠纷" === me.causeAction.val() ? "addClass" : "removeClass"]("fn-btn-disabled"), me
            },
            soSelectionSearch: function() {
                var me = this;
                new Ajax({
                    request: me.get("disputeOrderList"),
                    autoSubmit: !0,
                    paramName: "paraMap",
                    parseForm: ["#bindingName", me.element],
                    onAjaxSuccess: function(val, msg, con) {
                        me.soOrderDialog.$(".content").html(orderTemplate(val.data)), me.soOrderDialog.$('[value="' + me.get("orderId") + '"]').prop("checked", !0), me.soOrderDialog.show()
                    },
                    onAjaxSubmitBefore: function(param) {
                        if (!param.bizOrderId) return Modal.alert(0, "请输入交易订单号"), !1
                    }
                })
            },
            soOrderChecked: function(DO) {
                var me = this;
                return DO && (new Ajax({
                    request: me.get("disputeOrderSelectDisputeOrder"),
                    autoSubmit: !0,
                    paramName: "paraMap",
                    param: DO,
                    parseForm: ["#bindingName", "#pageParam"],
                    onAjaxSuccess: function(rtv, msg, con) {
                        if ("remain" !== rtv.status) {
                            var suitEntityDo = rtv.suitEntityDo;
                            suitEntityDo.firstAccused = !0, me.soFirstAccused.html(me.soAccusedTemple($.extend(suitEntityDo, DO))), me.soTriggerNode.val("修 改"), me.soReset()
                        } else me.log("订单重复选择");
                        me.soOrderDialog.hide(), me.show("#page-allinfo"), me.show("#page-check"), me.set("orderId", DO.orderId), me.soAccusedGuid = me.$(".JS-target-accused").length, me.soToggleAddByCauseAction()
                    }
                }), EditAccus.getWidget("#suitRequest").suAmount = DO.acutalTotalFee), me
            },
            soReset: function() {
                var me = this;
                return me.$(".JS-target-accused").remove(), EditAccus.getWidget("#suitRequest").soReset(), EditAccus.getWidget("#select-law").selectLawReset(), EditAccus.getWidget("#evidence").evidenceDataRender(), $('[name="fact"]').val(""), me
            }
        });
    return Selectionorder
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});