"use strict";
define("src/bus/suit/caseSearch/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/filterConditions/main-debug", "model/searchList/main-debug", "common/statusMap-debug"], function(require, exports, module) {
    function getReasons(code, remark, status) {
        var result = [];
        if (code)
            for (var codes = code.split(","), c = 0; c < codes.length; c++) result.length > 0 && result.push(", "), "other" == codes[c] && remark ? result.push(remark) : result.push(multiple[codes[c]]);
        return "return" == status ? result.unshift("退回原因：") : "not_accepted" == status && result.unshift("不予受理原因："), result.join("")
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        FilterConditions = require("model/filterConditions/main-debug"),
        SearchList = require("model/searchList/main-debug"),
        statusMap = require("common/statusMap-debug"),
        multiple = {
            no_plaintiff_qualification: "原告主体资格不符",
            no_defendant: "无明确的被告或被告主体资格不符",
            no_request: "无具体诉讼请求，事实和理由",
            no_range: "不属于民事诉讼范围",
            no_mycourt: "不属于本院管辖",
            no_proof: "没有新的事实和证据重新起诉",
            no_sue: "依法在一定期限内不得起诉的案件",
            other: "其他"
        },
        searchListExp = SearchList.use(".searchList", {
            map: function(data) {
                for (var i = 0; i < data.length; i++) data[i].status && (data[i].statusEx = statusMap[data[i].status]), data[i].reason && (data[i].reasonEx = getReasons(data[i].reason, data[i].remark, data[i].status));
                return data
            }
        });
    new FilterConditions({
        element: "#filter-conditions"
    }).on("change", function() {
        searchListExp[0].searchListReload()
    }), $("#search").on("click", function() {
        searchListExp[0].searchListReload()
    }), $('[data-action="toggleStatus"] span').on("click", function(e) {
        var target = $('[data-action="toggleStatus"]');
        target.find(".kuma-icon-triangle-down").size() > 0 ? ($(".JS-tirgger-more").removeClass("fn-hide"), target.find("a").text("收起"), target.find(".kuma-icon-triangle-down").addClass("kuma-icon-triangle-up").removeClass("kuma-icon-triangle-down")) : ($(".JS-tirgger-more").addClass("fn-hide"), target.find("a").text("更多"), target.find(".kuma-icon-triangle-up").addClass("kuma-icon-triangle-down").removeClass("kuma-icon-triangle-up"))
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});