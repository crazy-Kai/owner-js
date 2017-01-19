"use strict";
define("src/common/constant-debug", [], function(require, exports, module) {
    var url = {
        domainIndex: "/portal/main/domain/index.htm",
        suitCaseSearch: "/suit/caseSearch.htm"
    };
    exports.getUrl = function(key) {
        return url[key]
    }
});