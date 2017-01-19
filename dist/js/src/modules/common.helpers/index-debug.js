define("src/modules/common.helpers/index-debug", ["common/jquery-debug", "crystal-debug"], function(require, exports, module) {
    var crystal = (require("common/jquery-debug"), require("crystal-debug")),
        app = crystal.app;
    module.exports = {
        nameNick: function(name, nickName) {
            return nickName ? name + "(" + nickName + ")" : name
        },
        uriBroker: function(prefix, path) {
            var args = Array.prototype.slice.call(arguments, 2, arguments.length - 1);
            return app.get(prefix) + path.replace(/\{(\d+)\}/g, function(p, p1) {
                var index = parseInt(p1);
                return index in args ? args[index] : ""
            })
        }
    }
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});