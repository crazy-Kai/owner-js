define("src/bus/suit/start/paySuccess/main-debug", ["common/jquery-debug", "alinw/dialog/2.0.6/dialog-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        dialogExp = new Dialog({
            content: "#dialog",
            width: "800px"
        });
    $("#paySuccess").on("click", function() {
        dialogExp.show()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});