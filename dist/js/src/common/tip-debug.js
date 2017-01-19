"use strict";
define("src/common/tip-debug", ["common/jquery-debug", "tip-debug"], function(require, exports) {
    var $ = require("common/jquery-debug"),
        nwTip = require("tip-debug"),
        Tip = nwTip.extend({
            Statics: {
                use: function(query, config) {
                    var me = this,
                        list = [];
                    return $(query || ".JS-need-tip").each(function() {
                        var node = $(this),
                            content = node.data("content") || config.content;
                        if (content) {
                            var the = new me($.extend({
                                trigger: node,
                                content: node.data("content")
                            }, config));
                            list.push(the), node.data("myWidget", the)
                        }
                    }), list
                },
                remove: function(query) {
                    $(query || ".JS-need-tip").each(function() {
                        $(this).data("myWidget").destroy()
                    })
                }
            }
        });
    return Tip
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});