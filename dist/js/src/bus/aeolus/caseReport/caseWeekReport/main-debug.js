"use strict";
define("src/bus/aeolus/caseReport/caseWeekReport/main-debug", ["common/jquery-debug", "common/calendar-debug", "common/delegate-debug", "model/searchList/main-debug", "common/tip-debug", "model/ajax/main-debug"], function(require, exports, module) {
    function doSearch() {
        searchListExp[0].searchListReload()
    }
    var $ = require("common/jquery-debug"),
        Calendar = require("common/calendar-debug"),
        delegate = require("common/delegate-debug"),
        SearchList = require("model/searchList/main-debug"),
        Tip = require("common/tip-debug"),
        c1 = (require("model/ajax/main-debug"), new Calendar({
            trigger: "#submit-date-fr"
        })),
        c2 = new Calendar({
            trigger: "#submit-date-to"
        });
    $.ajaxSetup({
        cache: !1
    });
    var searchListExp = SearchList.use(".searchList", {});
    searchListExp[0].on("ajaxSuccess", function(rtv, msg, con) {
        Tip.use($(".item-tip"))
    }), delegate.on("click", "#search", function() {
        doSearch()
    }), c1.on("selectDate", function(date) {
        c2.range(function(aDate) {
            return !(date && !(date && aDate >= date))
        })
    }), c2.on("selectDate", function(date) {
        c1.range(function(aDate) {
            return !(date && !(date && aDate <= date))
        })
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});