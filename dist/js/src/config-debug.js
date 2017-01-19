! function() {
    var isDaily = !1;
    if ("undefined" != typeof document) {
        var scripts = document.getElementsByTagName("script");
        isDaily = (scripts[scripts.length - 1].src || "").indexOf("//alinw.alicdn.com") == -1
    }
    var cdnHost = isDaily ? "//g-assets.daily.taobao.net" : "//alinw.alicdn.com",
        global = "undefined" == typeof window ? {} : window;
    global.CONFIG = global.CONFIG || {};
    var config = {
        base: global.CONFIG.assetsLink,
        alias: {
            "seajs-debug": "seajs/seajs-debug/1.1.1/seajs-debug",
            $: "common/jQuery",
            "$-debug": "common/jQuery",
            react: "common/react",
            reactDOM: "common/react-dom",
            reflux: "common/reflux",
            base: "arale/base/1.1.1/base",
            widget: "arale/widget/1.1.1/widget",
            validator: "alinw/validator/3.1.4/validator",
            dialog: "alinw/dialog/2.0.6/dialog",
            handlebars: "alinw/handlebars/1.3.0/handlebars",
            scroller: "alinw/scroller/1.0.1/scroller.js",
            calendar: "alinw/calendar/1.1.17/calendar",
            carousel: "alinw/switchable/1.0.1/carousel",
            slide: "alinw/switchable/1.0.1/slide",
            tip: "alinw/tip/2.2.1/tip",
            transfer: "alinw/transfer/1.0.0/transfer"
        },
        crossorigin: !0,
        comboSyntax: ["??", ","],
        comboMaxLength: 1e3,
        preload: [],
        charset: "utf-8",
        timeout: 1e3,
        debug: !0,
        map: [
            [".js", ".js?buyaozaiyizhege"]
        ]
    };
    return "undefined" != typeof seajs && (config.paths = {
        gallery: "https://alinw.alipayobjects.com/gallery",
        arale: "https://alinw.alipayobjects.com/arale",
        alipay: "https://alinw.alipayobjects.com/alipay",
        seajs: "https://alinw.alipayobjects.com/seajs",
        platform: cdnHost + "/platform",
        alinw: cdnHost + "/alinw",
        crystal: cdnHost + "/crystal"
    }, seajs.config(config), function(seajs, $) {
        var useList = [],
            arrPro = Array.prototype,
            concat = arrPro.concat,
            slice = arrPro.slice;
        seajs.add = function() {
            return useList = concat.apply(useList, slice.call(arguments))
        }, $(function() {
            var widgetMap = ($("body"), []),
                widgetArr = [];
            $("[widget]").each(function() {
                var self = $(this);
                widgetMap[widgetArr.push(self.attr("widget")) - 1] = self
            }), useList = concat.call(arrPro, widgetArr, useList), useList.length && seajs.use(useList, function() {
                $.each(arguments, function(i) {
                    var element = widgetMap[i],
                        config = {};
                    element && (config[void 0 === element.attr("widget-trigger") ? "element" : "trigger"] = element), "function" == typeof this && new this(config)
                })
            })
        })
    }(seajs, $)), "function" == typeof define && define("src/config-debug", [], function(require, exports, module) {
        module.exports = config
    }), config
}();