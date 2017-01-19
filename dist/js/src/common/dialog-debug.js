"use strict";
define("src/common/dialog-debug", ["common/jquery-debug", "common/handlerbars-debug", "alinw/dialog/2.0.6/dialog-debug"], function(require, exports) {
    var $ = require("common/jquery-debug"),
        handlerbars = require("common/handlerbars-debug"),
        nwDialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Dialog = nwDialog.extend({
            attrs: {
                timer: 20
            },
            Statics: {
                show: function(content, config) {
                    var autoShow, dia, autoDestroy, me = this;
                    return config = $.extend({
                        autoDestroy: !0,
                        autoShow: !0,
                        content: content,
                        width: "auto",
                        height: "auto"
                    }, config), autoDestroy = config.autoDestroy, autoShow = config.autoShow, delete config.autoDestroy, delete config.autoShow, dia = new me(config).after("hide", function() {
                        autoDestroy && this.destroy()
                    }), autoShow && dia.show(), dia
                },
                showTemplate: function(template, data, config) {
                    var html, me = this,
                        tpl = $(template);
                    return html = tpl.length ? tpl.html() : template, html = handlerbars.compile(html), me.show(html(data || {}), config)
                }
            }
        });
    return Dialog
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});