"use strict";
define("src/bus/suit/start/common/preview/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/delegate-debug", "common/scroller-debug", "model/ajax/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        delegate = require("common/delegate-debug"),
        Scroller = require("common/scroller-debug"),
        Ajax = require("model/ajax/main-debug");
    Scroller.use(".JS-need-scroller"), delegate.on("click", ".JS-trigger-click-submit", function() {
        var self = $(this);
        new Ajax({
            autoSubmit: !0,
            request: "/suit/legalCaseRpc/submitLegalCase.json",
            parseForm: "#pageParam",
            onAjaxSuccess: function() {
                this.redirect(self.data("href"))
            }
        })
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});