"use strict";
define("src/bus/court/divisionCase/courtSchedue/addspectator-debug", ["common/jquery-debug", "model/ajax/main-debug", "model/perSearch/main-debug", "model/modal/main-debug", "common/validator-debug", "common/handlerbars-debug", "common/myWidget-debug"], function(require, exports, module) {
    function save(dialog) {
        var me = this;
        new Ajax({
            request: me.get("rpcSave"),
            paramName: "paraMap",
            parseForm: me.element,
            autoSuccessAlert: !0
        }).on("ajaxSuccess", function() {
            dialog.$('[name="mobile"]').val(""), me.search.searchListReload(), check.call(me, dialog)
        }).submit()
    }

    function remove(dialog, node) {
        var me = this;
        new Ajax({
            request: me.get("rpcDelete"),
            paramName: "paraMap",
            param: node.data("param"),
            autoSuccessAlert: !0
        }).on("ajaxSuccess", function() {
            me.search.searchListReload(), check.call(me, dialog)
        }).submit()
    }

    function check(dialog) {
        var me = this;
        dialog.$('[data-role="delete"]').length >= me.get("size") ? me.$('[data-role="save"]').hide() : me.$('[data-role="save"]').show()
    }
    var $ = require("common/jquery-debug"),
        Ajax = require("model/ajax/main-debug"),
        PerSearch = require("model/perSearch/main-debug"),
        Modal = require("model/modal/main-debug"),
        Validator = require("common/validator-debug"),
        Handlerbars = require("common/handlerbars-debug"),
        MyWidget = require("common/myWidget-debug"),
        AddSpectator = MyWidget.extend({
            clssName: "AddSpectator",
            attrs: {
                trigger: "#addSpectator",
                templateNode: "#template-addspectator",
                templateSeedNode: "#template-addspectator-seed",
                template: {
                    setter: function(val) {
                        var me = this;
                        me.templateNode = val
                    },
                    getter: function() {
                        var me = this;
                        return me.templateStr ? me.templateStr : me.templateStr = Handlerbars.compile($(me.get("templateNode")).html() || "<div></div>")()
                    }
                },
                rpcSave: "/court/suitObserverRpc/save.json",
                rpcDelete: "/court/suitObserverRpc/delete.json",
                rpcList: "/court/suitObserverRpc/list.json",
                size: 10
            },
            events: {},
            setup: function() {
                var me = this;
                me.triggerNode && me.delegateEvents(me.triggerNode, "click", function() {
                    me.show()
                })
            },
            show: function() {
                var me = this,
                    dialog = Modal.show(me.element, {
                        width: 650,
                        events: {
                            'click [data-role="save"]': function() {
                                Validator.oneExecute(me.element, '[data-widget="validator"]') || save.call(me, dialog)
                            },
                            'click [data-role="delete"]': function(e) {
                                Modal.confirm("提醒", "您确定要删除嘛？", function() {
                                    remove.call(me, dialog, $(e.target))
                                })
                            }
                        }
                    });
                dialog.before("hide", function() {
                    search.destroy()
                });
                var search = me.search = new PerSearch({
                    request: me.get("rpcList"),
                    element: me.element,
                    paramName: "paraMap",
                    template: $(me.get("templateSeedNode")).html(),
                    hidePage: !0,
                    onAjaxSuccess: function() {
                        dialog._setPosition(), check.call(me, dialog)
                    }
                })
            }
        });
    return AddSpectator
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});