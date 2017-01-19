"use strict";
define("src/bus/court/preFilingCase/suspendedLayer-debug", ["common/jquery-debug", "common/myWidget-debug", "model/modal/main-debug"], function(require, exports, module) {
    function stations() {
        var me = this,
            warp = $(document.createElement("div"));
        return me.element.before(warp), warp.append(me.element), warp.css({
            overflow: "hidden"
        }), warp.height(warp.height()), warp
    }

    function fixed() {
        var warp = $(document.createElement("div")),
            mark = $(document.createElement("div"));
        return warp.append(mark), $("body").append(warp), warp.css({
            position: "fixed",
            width: "100%",
            right: "0",
            bottom: "0",
            "padding-bottom": "20px",
            "z-index": "999"
        }), mark.css({
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: .5,
            background: "#000",
            top: "0"
        }), warp
    }

    function scroll(statWarp, fixedWarp) {
        var me = this,
            scrollY = me.winScrollY();
        scrollY <= statWarp.offset().top - me.winInnerHeight() + 74 ? (fixedWarp.append(me.element).show(), me.element.addClass("lc-PaLeCal")) : (fixedWarp.hide(), statWarp.append(me.element), me.element.removeClass("lc-PaLeCal"))
    }
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        SuspendedLayer = (require("model/modal/main-debug"), MyWidget.extend({
            clssName: "SuspendedLayer",
            attrs: {},
            events: {},
            initProps: function() {},
            setup: function() {
                var me = this,
                    statWarp = stations.call(me),
                    fixedWarp = fixed.call(me);
                me.element.css({
                    position: "relative",
                    "z-index": "2"
                }), me.delegateEvents(window, "scroll", function() {
                    scroll.call(me, statWarp, fixedWarp)
                }), scroll.call(me, statWarp, fixedWarp)
            }
        }));
    return SuspendedLayer
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});