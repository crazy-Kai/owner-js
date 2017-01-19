"use strict";
define("src/bus/hephaistos/i18n/option/main-debug", ["common/jquery-debug", "model/searchList/main-debug", "model/modal/main-debug", "model/ajax/main-debug", "model/selectpicker/main-debug", "model/modalEditor/main-debug", "model/selectProperty/main-debug"], function(require, exports, module) {
    function doSucess(msg) {
        Modal.alert("成功", msg), searchListExp[0].searchListReload()
    }
    var $ = require("common/jquery-debug"),
        SearchList = require("model/searchList/main-debug"),
        Modal = require("model/modal/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        ModalEditor = require("model/modalEditor/main-debug"),
        SelectProperty = require("model/selectProperty/main-debug"),
        searchListExp = SearchList.use(".searchList", {
            onDeleteSuccess: function(rtv, msg, response, target) {
                doSucess(msg)
            },
            onEditorSuccess: function(rtv, msg, response, target) {
                modalEditorExp.set("title", target.prop("title")), rtv.id = rtv.securityId, modalEditorExp.modalEditorWriteback(rtv)
            }
        });
    Selectpicker.use(".selectpicker"), new SelectProperty({
        trigger: $('[name="propertyKey"]')
    });
    var modalEditorExp = new ModalEditor({
        trigger: "#addOption",
        element: "#addOptionModal",
        events: {
            "click .JS-trigger-click-submit": function(e) {
                var me = this;
                return me.validator.execute(function(flag, list) {
                    if (flag) me.log("验证没过。", list);
                    else {
                        var options = [];
                        $("#content > tbody > tr").each(function(index, ele) {
                            var option = {};
                            option.optionType = $("input[name='optionType']").val(), option.optionKey = $(ele).children("td:eq(0)").find("input").val(), option.propertyKey = $(ele).children("td:eq(1)").find("input").val(), option.remarks = $(ele).children("td:eq(2)").find("input").val(), option.value = $(ele).children("td:eq(3)").find("input").val(), option.sort = $(ele).children("td:eq(4)").find("input").val(), options.push(option)
                        }), new Ajax({
                            request: "/hephaistos/optionRpc/save.json",
                            paramName: "options",
                            param: options
                        }).on("ajaxSuccess", function(rtv, msg, con) {
                            me.trigger("modalEditorSuccess", rtv, msg, con), me.modalEditorHide()
                        }).submit()
                    }
                }), me
            },
            "click .JS-trigger-click-delete-row": function(e) {
                var me = this,
                    tr = $(e.target).closest("tr");
                tr.find('[data-required="true"]').each(function() {
                    me.validator.removeItem($(this))
                }), tr.data("widget").destroy(), tr.remove()
            },
            "click .JS-trigger-click": function(e) {
                var me = this;
                me.$("#content > tbody").append($("#rowItem").html());
                var propertyWidget = new SelectProperty({
                    trigger: $('#content > tbody [name="propertyKey"]:last')
                });
                me.$("#content > tbody tr:last").data("widget", propertyWidget), me.$("#content > tbody tr:last").find('[data-required="true"]').each(function() {
                    me.validator.addItem({
                        element: this
                    })
                })
            }
        }
    }).on("modalEditorSuccess", function(rtv, msg, response) {
        doSucess(msg)
    }).before("modalEditorShow", function() {
        var me = this,
            addBtn = me.$(".JS-trigger-click");
        "编辑资源" == me.get("title") ? addBtn.prop("disabled", !0).hide() : addBtn.prop("disabled", !1).show()
    }).before("modalEditorExecute", function() {}).after("modalEditorReset", function() {})
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});