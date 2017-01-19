"use strict";
define("src/common/scroller-debug", ["scroller-debug"], function(require, exports) {
    var nwScroller = require("scroller-debug"),
        Scroller = nwScroller.extend({
            setup: function() {
                var me = this;
                Scroller.superclass.setup.call(me), me.scContent = me.get("trigger").find(".kuma-scroller-content"), me.get("trigger").data("myWidget", me)
            },
            setContent: function(content) {
                var me = this;
                me.scContent.html(content), me.reset()
            },
            Statics: {
                use: function(query, config) {
                    var me = this,
                        list = [];
                    return $(query).each(function() {
                        list.push(new me($.extend({
                            trigger: $(this)
                        }, config)))
                    }), list
                },
                getWidget: function(query) {
                    return $(query).data("myWidget")
                }
            }
        });
    return Scroller
});