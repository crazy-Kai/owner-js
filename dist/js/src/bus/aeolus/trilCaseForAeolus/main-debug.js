"use strict";
define("src/bus/aeolus/trilCaseForAeolus/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/delegate-debug", "common/validator-debug", "model/perSearch/main-debug", "model/filterConditions/main-debug", "common/dialog-debug", "model/ajax/main-debug", "model/searchList/main-debug", "model/addspectator/main-debug", "common/statusMap-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        FilterConditions = (require("common/delegate-debug"), require("common/validator-debug"), require("model/perSearch/main-debug"), require("model/filterConditions/main-debug")),
        SearchList = (require("common/dialog-debug"), require("model/ajax/main-debug"), require("model/searchList/main-debug")),
        Addspectator = require("model/addspectator/main-debug"),
        statusMap = require("common/statusMap-debug");
    $.ajaxSetup({
        cache: !1
    }), new FilterConditions({
        element: "#filter-conditions"
    }).on("change", function() {
        searchListExp[0].searchListReload()
    });
    var searchListExp = SearchList.use(".searchList", {
        map: function(data) {
            for (var i = 0; i < data.length; i++) data[i].status && (data[i].statusEx = statusMap[data[i].status]), data[i].reason && (data[i].reasonEx = getReasons(data[i].reason, data[i].remark, data[i].status));
            return data
        }
    });
    $("#search").on("click", function() {
        searchListExp[0].searchListReload()
    }), new Addspectator
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});