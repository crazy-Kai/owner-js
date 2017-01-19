"use strict";
define("src/bus/domain/index/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/delegate-debug", "carousel-debug", "slide-debug", "common/cookie-debug", "common/dialog-debug", "model/postMessage/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        delegate = require("common/delegate-debug"),
        Carousel = require("carousel-debug"),
        Slide = require("slide-debug"),
        Cookie = require("common/cookie-debug"),
        dialog = require("common/dialog-debug"),
        PostMessage = require("model/postMessage/main-debug");
    delegate.on("click", ".JS-trigger-click-contactus-close", function() {
        $(this).closest(".JS-target-contactus").removeClass("st-open")
    }), delegate.on("click", ".JS-trigger-click-contactus-open", function() {
        $(this).closest(".JS-target-contactus").addClass("st-open")
    }), delegate.on("click", '[data-role="view-vedio"]', function() {
        var Dialog = dialog.show("/portal/main/domain/vedioView.htm", {
                width: 640,
                height: 460
            }),
            postMessageExp = new PostMessage;
        Dialog.after("hide", function() {
            window.top.screenFull = null, window.top.screenSmall = null, postMessageExp.destroy()
        });
        var screenFull = window.top.screenFull = function() {
                Dialog.set("width", "99%"), Dialog.set("height", "99%"), Dialog._setPosition()
            },
            screenSmall = window.top.screenSmall = function() {
                Dialog.set("width", 640), Dialog.set("height", 460), Dialog._setPosition()
            };
        postMessageExp.add(function(data) {
            "screenFull" === data.type && (data.value ? screenFull() : screenSmall())
        })
    }), $("body").on("click", "#logoutbtn", function(event) {
        event.preventDefault(), Cookie.remove("InvestigationPID"), window.location.href = "/loginOut.do"
    }), $("#Carousel-court-trail-case").length && new Carousel({
        element: "#Carousel-court-trail-case",
        effect: "scrollx",
        hasTriggers: !1,
        autoplay: !0,
        interval: 2e3,
        viewSize: [1090]
    }).render(), $("#Slide-focus-notice").length && new Slide({
        element: "#Slide-focus-notice",
        effect: "fade",
        activeIndex: 0
    }).render(), $("#banner").length && new Slide({
        element: "#banner",
        effect: "fade",
        activeIndex: 0
    }).render()
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});