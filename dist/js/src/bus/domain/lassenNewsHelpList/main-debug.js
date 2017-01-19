"use strict";
define("src/bus/domain/lassenNewsHelpList/main-debug", ["bus/global/main-debug", "common/jquery-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        WIN = window,
        SWIN = $(WIN),
        question = $("#help-center-list li").eq(0),
        helpCenterMenu = $("#help-center-menu");
    SWIN.on("scroll", function(e) {
        var scrollY = WIN.scrollY,
            questionY = question.offset() && question.offset().top || 0;
        scrollY > questionY ? helpCenterMenu.addClass("child-fixed") : helpCenterMenu.removeClass("child-fixed")
    }), SWIN.trigger("scroll")
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});