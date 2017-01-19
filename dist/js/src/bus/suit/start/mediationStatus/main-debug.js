"use strict";
define("src/bus/suit/start/mediationStatus/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/tab/main-debug", "common/scroller-debug", "model/mediationMessage/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var Tab = (require("common/jquery-debug"), require("model/tab/main-debug")),
        Scroller = require("common/scroller-debug"),
        MediationMessage = require("model/mediationMessage/main-debug");
    Tab.use(".JS-need-tab", {
        onChose: function(e, index, menu, list) {
            e && Scroller.getWidget(list.find(".JS-need-scroller")).reset()
        }
    }), MediationMessage.use(".JS-target-mediation-message")
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});