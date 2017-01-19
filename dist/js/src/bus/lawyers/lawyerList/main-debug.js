"use strict";
define("src/bus/lawyers/lawyerList/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/filterConditions/main-debug", "model/modal/main-debug", "alinw/handlebars/1.3.0/handlebars-debug", "model/ajax/main-debug", "model/searchList/main-debug"], function(require, exports, module) {
    function initAreaByAreaCode() {
        new Ajax({
            request: "/portal/LawyerServiceRpc/getAllFirmAreaCode.json"
        }).on("ajaxSuccess", function(rtv, msg, con) {
            areaContent.append(templateArea(rtv))
        }).submit()
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        FilterConditions = require("model/filterConditions/main-debug"),
        Handlebars = (require("model/modal/main-debug"), require("alinw/handlebars/1.3.0/handlebars-debug")),
        Ajax = require("model/ajax/main-debug"),
        SearchList = require("model/searchList/main-debug");
    new FilterConditions({
        element: "#filter-conditions"
    }).on("change", function() {
        searchListExp[0].searchListReload()
    });
    var searchListExp = SearchList.use(".searchList", {
            onAjaxSuccess: function(respone) {
                this.$(".JS-target-totle").html(respone.count)
            }
        }),
        templateArea = Handlebars.compile('{{#each this}}\t\t<span class="child-labelbox">            <label class="JS-target-label"><input type="radio" name="areaCode" value="{{areaCode}}" class="child-radio JS-trigger-click">{{getAreaByAreaCode areaCode}}</label>        </span>        {{/each}}'),
        areaContent = $("#areaContent");
    initAreaByAreaCode(), $('[data-action="toggleStatus"] span').on("click", function(e) {
        var target = $('[data-action="toggleStatus"]');
        target.find(".kuma-icon-triangle-down").size() > 0 ? ($("#areaContent").removeClass("fn-H30"), target.find("a").text("收起"), target.find(".kuma-icon-triangle-down").addClass("kuma-icon-triangle-up").removeClass("kuma-icon-triangle-down")) : ($("#areaContent").addClass("fn-H30"), target.find("a").text("更多"), target.find(".kuma-icon-triangle-up").addClass("kuma-icon-triangle-down").removeClass("kuma-icon-triangle-up"))
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});