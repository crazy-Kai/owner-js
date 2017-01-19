define("src/modules/common.setup/index-debug", ["common/jquery-debug", "crystal-debug", "util-debug", "src/i18n/{locale}-debug", "detect-zoom-debug", "src/modules/common.errorhandler/index-debug", "src/modules/component.lightpop/index-debug", "confirmbox-debug", "src/modules/component.lightpop/testsize-debug", "overlay-debug", "nprogress-debug", "detect-zoom-debug.css", "console-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        crystal = require("crystal-debug"),
        app = crystal.app,
        Util = require("util-debug"),
        gLang = require("src/i18n/{locale}-debug"),
        DetectZoom = require("detect-zoom-debug"),
        errorHandler = require("src/modules/common.errorhandler/index-debug");
    require("nprogress-debug"), require("detect-zoom-debug.css"), require("console-debug"), module.exports = function(config) {
        window.crystal = crystal, crystal.getClassName = function(mod) {
            return mod.id.split("/modules/")[1].split("/")[0].replace(/\./g, "-")
        }, crystal.wrapTpl = function(tpl, rLang) {
            var i18nHelper = (Util.extend({}, gLang, rLang), Util.i18nHelper(Util.extend({}, gLang, rLang))),
                t = function(data, options) {
                    return options = options || {}, options.helpers = options.helpers || {}, options.helpers.i18n = i18nHelper, tpl(data, options)
                };
            return t.i18n = i18nHelper, t
        }, new DetectZoom("en" == seajs.data.vars.locale ? "en" : "cn", (!1)), $(document).ajaxStart(function() {
            NProgress.start()
        }), $(document).ajaxComplete(function() {
            NProgress.done()
        }), document.attachEvent && setInterval(function() {
            "#" == document.title.charAt(0) && (document.title = config.pageTitle || "")
        }, 1e3), app.set("debug", config.debug), app.set("defaultIndex", "index"), app.set("mapping", {
            "^~/": [config.family, config.name, config.gitVersion, "modules/"].join("/")
        }), app.set("ajax", {
            unescapeJson: !0,
            csrfToken: config.csrfToken,
            tokenWhiteList: function(options) {
                if (/^(http(s)?:)?\/\//.test(options.url)) {
                    var lPrefix = location.href.split("/").slice(2, 4).join("/"),
                        uPrefix = options.url.split("/").slice(2, 4).join("/");
                    return lPrefix != uPrefix
                }
                return !1
            },
            data: config.defaultParams,
            isbuctest: config.debug,
            appName: config.appName,
            backUrl: location.protocol + "//" + location.host + config.backUrl,
            errorHandler: errorHandler,
            contextPath: config.contextPath
        }), app.start()
    }
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("src/modules/common.errorhandler/index-debug", ["common/jquery-debug", "crystal-debug", "src/modules/component.lightpop/index-debug", "confirmbox-debug", "src/modules/component.lightpop/testsize-debug", "overlay-debug", "util-debug", "src/errors/{locale}-debug"], function(require, exports, module) {
    var crystal = (require("common/jquery-debug"), require("crystal-debug")),
        app = crystal.app,
        LightPop = require("src/modules/component.lightpop/index-debug"),
        Util = require("util-debug"),
        codes = require("src/errors/{locale}-debug"),
        i18n = Util.i18nHelper(codes);
    module.exports = function(err) {
        err.params.unshift(err.code), LightPop.error(i18n.apply(null, err.params)), app.get("debug") && window.console
    }
});
define("src/modules/component.lightpop/index-debug", ["common/jquery-debug", "confirmbox-debug", "src/modules/component.lightpop/testsize-debug", "overlay-debug"], function(require, exports, module) {
    function showMessage(type, message, callback, modal) {
        var size = sizeTest.test(message, {
                fontSize: "14px"
            }),
            maxWidth = Math.max(.7 * $(window).width(), 500);
        size.width > maxWidth && (size.width = maxWidth);
        var o = ConfirmBox.iconView("", function() {
            $.isFunction(callback) && callback(), $(window).off("scroll", onScroll)
        }, {
            iconType: type,
            msgTile: message,
            hasMask: !1,
            simple: !0,
            zIndex: 999,
            timeout: "error" === type ? 3500 : 1500,
            width: size.width + 100,
            confirmTpl: "",
            cancelTpl: "",
            closeTpl: "error" === type ? "×" : ""
        });
        modal && (exports.loading(), mask.element.css("background", "rgba(255,255,255,.8)"), o.before("hide", function() {
            exports.loaded(), mask.element.css("background", "none")
        }));
        var onScroll = function() {
            try {
                o._setPosition()
            } catch (e) {
                $(window).off("scroll", onScroll)
            }
        };
        $(window).on("scroll", onScroll)
    }
    var $ = require("common/jquery-debug"),
        ConfirmBox = require("confirmbox-debug"),
        sizeTest = require("src/modules/component.lightpop/testsize-debug"),
        Overlay = require("overlay-debug"),
        mask = new Overlay({
            width: "100%",
            height: "100%",
            className: "ui-mask",
            zIndex: 800,
            style: {
                position: "fixed",
                top: 0,
                left: 0
            }
        }),
        maskCount = 0;
    exports.success = function(message, callback) {
        showMessage("success", message, callback)
    }, exports.error = function(message, callback) {
        showMessage("error", message, callback, !0)
    }, exports.loading = function() {
        !maskCount && mask.show(), maskCount++
    }, exports.loaded = function() {
        maskCount--, !maskCount && mask.hide()
    }
});
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