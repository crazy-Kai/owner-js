"use strict";
define("src/bus/court/callDoc/main-debug", ["bus/global/main-debug", "common/dialog-debug", "common/jquery-debug", "common/delegate-debug", "model/modal/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var Dialog = require("common/dialog-debug"),
        $ = require("common/jquery-debug"),
        Delegate = require("common/delegate-debug"),
        Modal = require("model/modal/main-debug");
    Delegate.on("click", '[data-trigger="click"]', function(e) {
        var html = $(e.target).siblings(".details").html();
        Dialog.show(html, {
            width: 1e3
        })
    }), Delegate.on("click", ".JS-trigger-download-video", function(element) {
        var checkUrl = $(element.target).data("url");
        $.ajax({
            url: checkUrl,
            type: "POST",
            data: {},
            cache: !1,
            async: !1
        }).done(function(res) {
            return !(res.hasError || !res.content || !res.content.isSuccess) || (res.content && res.content.message ? Modal.alert(0, res.content.message) : Modal.alert(0, "系统繁忙，请联系管理员"), element && element.preventDefault ? element.preventDefault() : window.event.returnValue = !1, !1)
        })
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});