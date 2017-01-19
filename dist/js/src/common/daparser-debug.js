"use strict";
define("src/common/daparser-debug", ["common/jquery-debug"], function(require, exports) {
    function camelCase(str) {
        return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
            return (letter + "").toUpperCase()
        })
    }

    function normalizeValues(data) {
        for (var key in data)
            if (data.hasOwnProperty(key)) {
                var val = data[key];
                if ("string" != typeof val) continue;
                JSON_LITERAL_PATTERN.test(val) ? (val = val.replace(/'/g, '"'), data[key] = normalizeValues(parseJSON(val))) : data[key] = normalizeValue(val)
            }
        return data
    }

    function normalizeValue(val) {
        if ("false" === val.toLowerCase()) val = !1;
        else if ("true" === val.toLowerCase()) val = !0;
        else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
            var number = parseFloat(val);
            number + "" === val && (val = number)
        }
        return val
    }
    var $ = require("common/jquery-debug");
    exports.parseElement = function(element, raw) {
        element = $(element)[0];
        var dataset = {};
        if (element.dataset) dataset = $.extend({}, element.dataset);
        else
            for (var attrs = element.attributes, i = 0, len = attrs.length; i < len; i++) {
                var attr = attrs[i],
                    name = attr.name;
                0 === name.indexOf("data-") && (name = camelCase(name.substring(5)), dataset[name] = attr.value)
            }
        return raw === !0 ? dataset : normalizeValues(dataset)
    };
    var RE_DASH_WORD = /-([a-z])/g,
        JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/,
        parseJSON = window.JSON ? JSON.parse : $.parseJSON
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});