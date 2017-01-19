define("src/modules/ui.tip/index-debug", ["common/jquery-debug", "crystal-debug", "tip-debug"], function(require, exports, module) {
    var crystal = (require("common/jquery-debug"), require("crystal-debug")),
        Tip = require("tip-debug"),
        TipTrigger = crystal.moduleFactory({
            attrs: {
                content: "",
                maxWidth: 270,
                html: !1
            },
            setup: function() {
                var me = this;
                me.render(), me._initTip(me.get("content") || "")
            },
            destroy: function() {
                var me = this;
                me.tip && me.tip.destroy(), TipTrigger.superclass.destroy.call(me)
            },
            _initTip: function(content) {
                content += "";
                var me = this,
                    style = {};
                me.get("maxWidth") && (style.maxWidth = me.get("maxWidth")), me.get("html") || (content = content.replace(/(\r\n)|\r|\n/g, "<br>").replace(/[ \t]/g, "&nbsp;")), me.tip = new Tip({
                    trigger: me.element,
                    content: content,
                    arrowPosition: "6",
                    theme: "yellow",
                    inViewport: !0,
                    style: style,
                    zIndex: 600
                })
            }
        });
    return TipTrigger
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});