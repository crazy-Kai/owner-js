"use strict";
define("src/bus/lawyers/lawyerDetail/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/searchList/main-debug", "common/statusMap-debug", "model/address/data-debug"], function(require, exports, module) {
    function formatAreaByCode() {
        var areaCodeDom = $("#areaCode"),
            areaCode = "" + areaCodeDom.data("codes");
        areaCode = areaCode.slice(0, 4) + "00", areaCodeDom.html(areaData[areaCode][0])
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        SearchList = require("model/searchList/main-debug"),
        statusMap = require("common/statusMap-debug"),
        areaData = require("model/address/data-debug");
    SearchList.use(".searchList", {
        map: function(data) {
            if (data)
                for (var i = 0; i < data.length; i++) data[i].status && (data[i].statusEx = statusMap[data[i].status]);
            return data
        }
    });
    formatAreaByCode()
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});