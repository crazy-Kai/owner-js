"use strict";
define("src/bus/common/findpwdSuc/main-debug", ["common/jquery-debug"], function(require, exports, module) {
    function closeWindows() {
        setTimeout(function() {
            window.close()
        }, 3e3)
    }
    require("common/jquery-debug");
    closeWindows()
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});