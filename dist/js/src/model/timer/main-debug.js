"use strict";
define("src/model/timer/main-debug", ["common/jquery-debug", "common/myWidget-debug"], function(require, exports, module) {
    var MyWidget = (require("common/jquery-debug"), require("common/myWidget-debug")),
        Timer = MyWidget.extend({
            clssName: "Timer",
            attrs: {
                time: 30
            },
            events: {},
            initProps: function() {},
            setup: function() {
                var me = this;
                me.countDown()
            },
            countDown: function() {
                var me = this,
                    time = me.get("time"),
                    now = (new Date).getTime();
                setTimeout(function() {
                    me.trigger("progress", time)
                }, 0), me.timeoutId = setInterval(function() {
                    var key = time - Math.floor(((new Date).getTime() - now) / 1e3);
                    key < 0 ? (clearInterval(me.timeoutId), me.trigger("end")) : me.trigger("progress", key)
                }, 1e3)
            },
            destroy: function() {
                var me = this;
                clearInterval(me.timeoutId)
            }
        });
    return Timer
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});