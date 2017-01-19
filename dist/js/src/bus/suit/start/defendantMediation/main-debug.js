"use strict";
define("src/bus/suit/start/defendantMediation/main-debug", ["bus/global/main-debug", "model/tab/main-debug", "common/jquery-debug", "common/scroller-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var Tab = require("model/tab/main-debug"),
        Scroller = (require("common/jquery-debug"), require("common/scroller-debug"));
    Tab.use(".JS-need-tab"), Scroller.use(".JS-need-scroller")
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});