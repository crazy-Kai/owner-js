define("src/modules/ui.selectperson/index-debug", ["selectperson-debug.css", "common/jquery-debug", "crystal-debug", "selectperson-debug", "src/modules/ui.selectperson/i18n/{locale}-debug"], function(require, exports, module) {
    require("selectperson-debug.css");
    var $ = require("common/jquery-debug"),
        crystal = require("crystal-debug"),
        Selectperson = require("selectperson-debug"),
        i18n = require("src/modules/ui.selectperson/i18n/{locale}-debug"),
        SelectPerson = crystal.moduleFactory({
            attrs: {
                count: 1,
                initvalue: "",
                url: "//work.alibaba-inc.com/work/xservice/sns/suggestion/suggestionAt.jsonp",
                showteam: !1,
                width: null,
                type: "jsonp",
                field: "value"
            },
            setup: function() {
                var me = this;
                me.render();
                var sp = me._sp = new Selectperson,
                    width = me.get("width") || me.element.outerWidth() - 12,
                    cfg = {
                        sence: "option1",
                        dataType: me.get("type"),
                        url: me.get("url"),
                        callBack: function(data) {
                            var val = $.map(data, function(n) {
                                    return n.emplId
                                }).join(","),
                                model = me.get("model");
                            model && (model[me.get("field")] = val), me.element.val(val).data("value", data).trigger("validate").trigger("change")
                        },
                        selectNumber: me.get("count"),
                        container: me.element,
                        isShowTeam: me.get("showteam"),
                        css: {
                            width: width
                        },
                        placeholder: {
                            width: 0,
                            name: null
                        },
                        teamTplLable: {
                            direct: i18n.direct,
                            allnum: i18n.allnum,
                            unite: i18n.unite
                        },
                        nodataText: i18n.nodata
                    };
                sp.init(cfg), setTimeout(function() {
                    sp.setData(me.get("initvalue") || [], !0)
                }, 0)
            },
            clean: function() {
                var me = this;
                me._sp.clearData()
            }
        });
    module.exports = SelectPerson
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});