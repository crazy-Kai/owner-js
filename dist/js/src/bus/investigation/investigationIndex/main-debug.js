"use strict";
define("src/bus/investigation/investigationIndex/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/delegate-debug", "common/dialog-debug", "common/calendar-debug", "model/searchList/main-debug", "model/ajax/main-debug", "model/advancedQuery/main-debug", "common/validator-debug"], function(require, exports, module) {
    function attachSelectDateEvent(c1, c2) {
        c1.on("selectDate", function(data) {
            c2.range([data, null])
        }), c2.on("selectDate", function(data) {
            c1.range([null, data])
        })
    }

    function doSearch() {
        searchListExp[0].searchListReload()
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        delegate = require("common/delegate-debug"),
        Calendar = (require("common/dialog-debug"), require("common/calendar-debug")),
        SearchList = require("model/searchList/main-debug"),
        advancedQuery = (require("model/ajax/main-debug"), require("model/advancedQuery/main-debug")),
        Validator = require("common/validator-debug");
    if ($("#submit-date-fr").length) {
        var c1 = new Calendar({
                trigger: "#submit-date-fr"
            }),
            c2 = new Calendar({
                trigger: "#submit-date-to"
            });
        attachSelectDateEvent(c1, c2)
    }
    if ($("#register-date-fr").length) {
        var c3 = new Calendar({
                trigger: "#register-date-fr"
            }),
            c4 = new Calendar({
                trigger: "#register-date-to"
            });
        attachSelectDateEvent(c3, c4)
    }
    var searchListExp = SearchList.use(".searchList", {});
    new advancedQuery;
    Validator.use(".kuma-form", '[data-widget="validator"]');
    delegate.on("click", "#search", function() {
        doSearch()
    }), delegate.on("click", "#reset", function() {
        $(":reset").trigger("click")
    }), $("input[name='order']").on("click", function() {
        $("[type='radio']").parent().addClass("fn-btn-link").removeClass("fn-btn-default"), $("[type='radio']:checked").parent().removeClass("fn-btn-link").addClass("fn-btn-default"), doSearch()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});