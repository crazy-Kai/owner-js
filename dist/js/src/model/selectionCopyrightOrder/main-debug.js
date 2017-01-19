"use strict";
define("src/model/selectionCopyrightOrder/main-debug", ["common/jquery-debug", "model/editAccus/main-debug", "model/modal/main-debug", "model/ajax/main-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        EditAccus = require("model/editAccus/main-debug"),
        Modal = require("model/modal/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        $ = EditAccus.jQuery,
        SelectionCopyrightOrder = (EditAccus.handlerbars, EditAccus.extend({
            clssName: "SelectionCopyrightOrder",
            attrs: {
                getCopyRightInfo: "/suit/copyRightOrder/getCopyRightInfo.json",
                pageParam: "#pageParam"
            },
            events: {
                "click .JS-trigger-cick-order": function() {
                    return this.soGetInfo()
                }
            },
            initProps: function() {
                var me = this;
                SelectionCopyrightOrder.superclass.initProps.call(me)
            },
            soGetInfo: function() {
                var me = this;
                return new Ajax({
                    autoSubmit: !0,
                    request: me.get("getCopyRightInfo"),
                    parseForm: [me.element, me.get("pageParam"), "#bindingName"],
                    paramName: "paraMap",
                    onAjaxSuccess: function(rtv, msg, res) {
                        if ("error" === rtv.status) Modal.alert(0, "该商品还未被投诉。");
                        else if ("remain" !== rtv.status) {
                            var copyRightOrderDo = rtv.copyRightOrderDo,
                                suitEntityDo = rtv.suitEntityDo;
                            suitEntityDo.firstAccused = !0, suitEntityDo.copyright = !0, me.soFirstAccused.html(me.soAccusedTemple($.extend(suitEntityDo, copyRightOrderDo))), me.soReset(), me.soAccusedGuid = me.$(".JS-target-accused").length, me.show("#page-allinfo"), me.show("#page-check"), me.set("soHasOrder", !0)
                        } else me.log("订单重复选择")
                    }
                }), me
            },
            soReset: function() {
                var me = this;
                return me.$(".JS-target-accused").remove(), EditAccus.getWidget("#suitRequest").soReset(), EditAccus.getWidget("#select-law").selectLawReset(), EditAccus.getWidget("#evidence").evidenceDataRender(), $('[name="fact"]').val(""), me
            }
        }));
    return SelectionCopyrightOrder
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});