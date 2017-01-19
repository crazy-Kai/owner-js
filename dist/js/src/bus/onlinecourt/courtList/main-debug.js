"use strict";
define("src/bus/onlinecourt/courtList/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/address/select-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var Address = (require("common/jquery-debug"), require("model/address/select-debug"));
    new Address({
        element: "#address",
        defaultFirst: !1,
        onChange: function(id) {}
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});