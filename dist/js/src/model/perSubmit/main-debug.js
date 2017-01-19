"use strict";
define("src/model/perSubmit/main-debug", ["common/myWidget-debug", "model/modal/main-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        Modal = require("model/modal/main-debug"),
        PerSubmit = MyWidget.extend({
            clssName: "PerSubmit",
            attrs: {
                request: "",
                paramParse: MyWidget.K,
                paramName: null,
                autoDestroy: !0
            },
            initProps: function() {},
            setup: function() {},
            psSubmit: function() {
                var me = this,
                    paramName = me.get("paramName");
                return me.http(me.get("request"), paramName ? me.paseParam(paramName, me.serialize(me.element, me.get("paramParse"))) : me.serialize(me.element, me.get("paramParse")), function(err, rtv, msg, con) {
                    err ? (Modal.alert(0, err), me.trigger("ajaxError", rtv)) : (Modal.alert(1, msg), me.trigger("ajaxSuccess", rtv, msg, con)), me.get("autoDestroy") && me.destroy()
                }), me
            }
        });
    return PerSubmit
});