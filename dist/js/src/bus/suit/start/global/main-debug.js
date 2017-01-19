"use strict";
define("src/bus/suit/start/global/main-debug", ["common/jquery-debug", "common/delegate-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        delegate = require("common/delegate-debug"),
        noticCheckNext = $("#notic-check-next");
    delegate.on("click", "#trial-checked", function() {
        var node = $(this);
        node.prop("checked") ? noticCheckNext.removeClass("fn-btn-disabled") : noticCheckNext.addClass("fn-btn-disabled")
    }), delegate.on("click", ".JS-trigger-click-next", function(e) {
        var node = $(this);
        node.hasClass("fn-btn-disabled") && e.preventDefault()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});