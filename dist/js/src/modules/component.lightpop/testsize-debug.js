define("src/modules/component.lightpop/testsize-debug", ["common/jquery-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        style = {
            position: "absolute",
            top: -1e3,
            visibility: "hidden"
        },
        testDiv = $("<div>").css(style).appendTo("body");
    exports.test = function(html, css) {
        testDiv.removeAttr("style").css(style), $.isPlainObject(css) && testDiv.css(css), testDiv.html(html);
        var size = {
            width: testDiv.width(),
            height: testDiv.height()
        };
        return size
    }
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});