"use strict";
define("src/model/realTime/main-debug", ["common/jquery-debug", "common/myWidget-debug"], function(require, exports, module) {
    var MyWidget = (require("common/jquery-debug"), require("common/myWidget-debug")),
        RealTime = MyWidget.extend({
            clssName: "RealTime",
            attrs: {
                textarea: ".JS-target-textarea",
                textshow: ".JS-target-textshow"
            },
            events: {},
            initProps: function() {
                var me = this;
                me.textarea = me.$(me.get("textarea")), me.textshow = me.$(me.get("textshow")), me.maxlength = me.textarea.attr("maxlength"), me.textarea.removeAttr("maxlength"), me.oldVal = null
            },
            setup: function() {
                var me = this;
                me.delegateEvents(me.textarea, "realTime", function() {
                    me.rtCountString()
                }), me.delegateEvents(me.textarea, "input", function() {
                    me.rtCountString()
                }), 9 === document.documentMode && me.delegateEvents(me.textarea, "keyup", function(e) {
                    8 === e.keyCode && me.rtCountString()
                }), 8 === document.documentMode && me.delegateEvents(me.textarea, "propertychange", function(e) {
                    "value" === e.originalEvent.propertyName && me.rtCountString()
                }), 8 === document.documentMode && me.delegateEvents(me.textarea, "paste", function(e) {
                    setTimeout(function() {
                        me.rtCountString()
                    }, 0)
                }), me.rtCountString()
            },
            rtCountString: function() {
                var me = this,
                    val = me.textarea.val(),
                    newVal = val.slice(0, me.maxlength);
                val !== me.oldVal && (me.oldVal = newVal, me.textarea.val(newVal), me.textshow.html(newVal.length))
            }
        });
    return RealTime
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});