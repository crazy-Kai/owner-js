"use strict";
define("src/model/selectionOrder/main-debug", ["common/jquery-debug", "model/editAccus/main-debug", "alinw/dialog/2.0.6/dialog-debug", "model/modal/main-debug", "model/perSearch/main-debug", "common/tip-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        EditAccus = require("model/editAccus/main-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Modal = require("model/modal/main-debug"),
        PerSearch = require("model/perSearch/main-debug"),
        Tip = require("common/tip-debug"),
        $ = EditAccus.jQuery,
        handlerbars = EditAccus.handlerbars,
        orderTemplate = ["{{#if this}}", "{{#each this}}", '<tr {{#isEqual isDisputeOrder "y"}}class="JS-need-tip" style="color:#ccc;" data-content="该订单已提起过诉讼，请勿重复提起"{{/isEqual}}>', "<td>", '<input {{#isEqual isDisputeOrder "y"}}class="fn-btn-disabled"{{/isEqual}} type="radio" name="orderId" value="{{orderId}}" {{#isEqual isDisputeOrder "y"}}disabled{{/isEqual}}/>', '<input type="radio" class="fn-hide-input" name="bizOrderId" value="{{orderId}}" />', '<input type="radio" class="fn-hide-input" name="parentOrderId" value="{{parentOrderId}}" />', '<input type="radio" class="fn-hide-input" name="auctionTitle" value="{{auctionTitle}}" />', '<input type="radio" class="fn-hide-input" name="shopName" value="{{shopName}}" />', '<input type="radio" class="fn-hide-input" name="acutalTotalFee" value="{{acutalTotalFee}}" />', '<input type="radio" class="fn-hide-input" name="status" value="{{status}}" />', "</td>", "<td>{{parentOrderId}}</td>", "<td>{{auctionTitle}}</td>", "<td>{{shopName}}</td>", "<td>{{parseAmount acutalTotalFee}}</td>", "<td>{{status}}</td>", "</tr>", "{{/each}}", "{{else}}", '<tr class="ch-nohover">', '<td colspan="6">', '1.当前<span class="fn-color-F00">没有可起诉的退款纠纷订单</span>，请先确认购物网站是否正确<br />', '2.如在购物网站未申请退款，<span class="fn-color-F00">请先尝试进行退款</span>，以保障你的权利<br />', '3.如<span class="fn-color-F00">退款未协商好</span>，先在购物网站申请退款（<span class="fn-color-F00">申请过退款即可</span>），再来网上法庭起诉', "</td>", "</tr>", "{{/if}}"].join(""),
        Selectionorder = EditAccus.extend({
            clssName: "Selectionorder",
            attrs: {
                disputeOrderList: "/suit/disputeOrder/list.json",
                disputeOrderSelectDisputeOrder: "/suit/disputeOrder/selectDisputeOrder.json",
                pageParam: "#pageParam"
            },
            events: {
                "click .JS-trigger-click-select": "soDialogShow"
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
                            }) : (me.log("订单重复选择"), me.soPerSearch.destroy(), me.soOrderDialog.hide()) : me.soOrderChecked(DO) : Modal.alert(0, "请选择有退款纠纷的订单")
                        },
                        "click .JS-trigger-click-cancel": function() {
                            me.soPerSearch.destroy(), me.soOrderDialog.hide()
                        },
                        "click tr": function(e) {
                            var target = me.closest(e.target, "tr");
                            this.$('[type="radio"]').prop("checked", !1), target.find('[type="radio"]').prop("checked", !0), target.find(":disabled").prop("checked", !1)
                        },
                        "change .JS-trigger-change-account": function() {
                            me.soPerSearch.searchListReload()
                        }
                    }
                }).after("show", function() {
                    var tips = Tip.use($(".JS-need-tip"));
                    for (var i in tips) tips[i].after("show", function() {
                        $(this.element[0]).css({
                            zIndex: 9999
                        })
                    })
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
            soDialogShow: function() {
                var soPerSearch, me = this;
                soPerSearch = me.soPerSearch = new PerSearch({
                    element: me.soOrderDialog.contentElement,
                    request: me.get("disputeOrderList"),
                    template: orderTemplate,
                    paramName: "paraMap",
                    pageParentNode: me.soOrderDialog.$(".page"),
                    onAjaxSuccess: function() {
                        me.soOrderDialog.show(), this.$('[value="' + me.get("orderId") + '"]').prop("checked", !0)
                    }
                })
            },
            soOrderChecked: function(DO) {
                var me = this;
                return DO && (me.http(me.get("disputeOrderSelectDisputeOrder"), me.paseParam("paraMap", $.extend({}, DO, me.serialize(me.pageParam))), function(err, rtv, msg, con) {
                    if (err) Modal.alert(0, err);
                    else {
                        if ("remain" !== rtv.status) {
                            var suitEntityDo = rtv.suitEntityDo;
                            suitEntityDo.firstAccused = !0, me.soFirstAccused.html(me.soAccusedTemple($.extend(suitEntityDo, DO))), me.soTriggerNode.val("修 改"), me.soReset()
                        } else me.log("订单重复选择");
                        me.soPerSearch.destroy(), me.soOrderDialog.hide(), me.show("#page-allinfo"), me.show("#page-check"), me.set("orderId", DO.orderId), me.soAccusedGuid = me.$(".JS-target-accused").length, me.soToggleAddByCauseAction()
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