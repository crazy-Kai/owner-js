define("src/modules/common.base.module/index-debug", ["common/jquery-debug", "crystal-debug", "src/modules/common.helpers/index-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        crystal = require("crystal-debug"),
        autoRender = crystal.autoRender,
        helpers = (crystal.app, require("src/modules/common.helpers/index-debug"));
    return crystal.moduleFactory({
        attrs: {
            tpl: null,
            helpers: {}
        },
        setup: function() {
            var me = this;
            me.render(), me.fetch()
        },
        fetch: function() {},
        renderModel: function(model) {
            return {
                data: model
            }
        },
        _onRenderModel: function(model) {
            var me = this,
                tpl = me.get("tpl"),
                renderModel = me.renderModel(model);
            autoRender.html(me.element, tpl(renderModel, {
                helpers: $.extend({}, helpers, me.get("helpers"))
            }), function(elements) {
                autoRender.bindSubModel(elements, model), setTimeout(function() {
                    me.trigger("render")
                }, 0)
            })
        }
    })
});
define("src/modules/common.helpers/index-debug", ["common/jquery-debug", "crystal-debug"], function(require, exports, module) {
    var crystal = (require("common/jquery-debug"), require("crystal-debug")),
        app = crystal.app;
    module.exports = {
        nameNick: function(name, nickName) {
            return nickName ? name + "(" + nickName + ")" : name
        },
        uriBroker: function(prefix, path) {
            var args = Array.prototype.slice.call(arguments, 2, arguments.length - 1);
            return app.get(prefix) + path.replace(/\{(\d+)\}/g, function(p, p1) {
                var index = parseInt(p1);
                return index in args ? args[index] : ""
            })
        }
    }
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});