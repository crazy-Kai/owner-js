"use strict";
define("src/bus/common/registerSuc/main-debug", ["common/jquery-debug"], function(require, exports, module) {
    function closeWindows() {
        setTimeout(function() {
            window.location.href = "/tocertification.htm"
        }, 3e3)
    }
    require("common/jquery-debug");
    closeWindows()
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});