"use strict";
define("src/bus/suit/start/chooseType/main-debug", ["bus/global/main-debug", "common/jquery-debug"], function(require, exports, module) {
    function checkedFalse() {
        $(".JS-trigger-hover").removeClass("trigger-chosed"), $('[type="radio"]').prop("checked", !1)
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        SBODY = $("body");
    SBODY.on("mouseenter", ".JS-trigger-hover", function() {
        var node = $(this);
        node.addClass("tigger-show")
    }), SBODY.on("mouseleave", ".JS-trigger-hover", function() {
        var node = $(this);
        node.removeClass("tigger-show")
    }), SBODY.on("click", ".JS-trigger-chose", function() {
        var node = $(this),
            target = node.closest(".JS-trigger-hover");
        checkedFalse(), target.addClass("trigger-chosed"), target.find('[type="radio"]').prop("checked", !0)
    }), SBODY.on("click", ".JS-trigger-chosed", checkedFalse)
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});