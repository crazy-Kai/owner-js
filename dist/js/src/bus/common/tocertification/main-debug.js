"use strict";
define("src/bus/common/tocertification/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/modal/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var Modal = (require("common/jquery-debug"), require("model/modal/main-debug"));
    window.showError = function(msg) {
        "usedErr" == msg ? Modal.alert(0, "该账户已被使用") : "connectErr" == msg && Modal.alert(0, "暂时无法连接到支付宝，请稍后重试…")
    }
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});