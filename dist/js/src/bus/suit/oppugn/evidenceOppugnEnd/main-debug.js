"use strict";
define("src/bus/suit/oppugn/evidenceOppugnEnd/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/myWidget-debug", "model/tab/main-debug", "model/countDown/main-debug", "model/perSearch/main-debug", "model/imgView/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        Tab = require("model/tab/main-debug"),
        CountDown = require("model/countDown/main-debug"),
        ImgView = (require("model/perSearch/main-debug"), require("model/imgView/main-debug")),
        EvidenceOppugnEnd = MyWidget.extend({
            clssName: "EvidenceOppugnEnd",
            attrs: {
                element: "body",
                fixClassName: "go-nav-fix"
            },
            events: {},
            initProps: function() {
                var me = this;
                me.evidenceOppugnNav = me.$("#evidenceOppugnNav");
                var offset = me.evidenceOppugnNav.offset() || {};
                me.tabTop = offset.top || 0, me.tabExp = new Tab({
                    element: "#evidenceOppugnMain"
                }).on("chose", function() {
                    $(window).trigger("scroll"), me.winScrollY() > me.tabTop && me.winScrollY(me.tabTop)
                }), me.imgViewExp = new ImgView
            },
            setup: function() {
                var me = this;
                me.setCountDown(), me.delegateEvents(window, "scroll", function() {
                    me.winScrollY() > me.tabTop ? me.evidenceOppugnNav.addClass(me.get("fixClassName")) : me.evidenceOppugnNav.removeClass(me.get("fixClassName"))
                }), $(window).trigger("scroll")
            },
            destroy: function() {
                var me = this;
                me.tabExp.destroy(), me.imgViewExp.destroy()
            },
            setCountDown: function() {
                var intervalID, me = this,
                    node = me.$(".JS-need-count-down"),
                    endTime = node.data("endTime"),
                    countDownExp = new CountDown({
                        target: endTime
                    });
                return intervalID = setInterval(function() {
                    var data = countDownExp.use();
                    return data ? void node.html('<span class="fn-color-F00">' + data.day + '</span>天 <span class="fn-color-F00">' + data.hour + '</span>时 <span class="fn-color-F00">' + data.minute + '</span>分 <span class="fn-color-F00">' + data.second + "</span>秒</span>") : clearInterval(intervalID)
                }, 1e3), me
            }
        });
    module.exports = EvidenceOppugnEnd
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});