"use strict";
define("src/model/switchFilterBtn/main-debug", ["common/jquery-debug", "common/myWidget-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        switchFilterBtn = MyWidget.extend({
            clssName: "switchFilterBtn",
            attrs: {},
            events: {
                'click [type="radio"]': "handler"
            },
            handler: function(e) {
                var me = this,
                    radio = $(e.target),
                    label = radio.closest("label"),
                    labels = me.$("label"),
                    radios = me.$('[type="radio"]');
                label.hasClass("fn-btn-default") || (labels.removeClass("fn-btn-default").addClass("fn-btn-link"), radios.prop("checked", !1), label.addClass("fn-btn-default").removeClass("fn-btn-link"), radio.prop("checked", !0), me.trigger("switchSuccess", radio, radios))
            }
        });
    return switchFilterBtn
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});