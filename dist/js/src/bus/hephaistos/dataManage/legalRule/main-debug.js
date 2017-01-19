"use strict";
define("src/bus/hephaistos/dataManage/legalRule/main-debug", ["common/jquery-debug", "model/searchList/main-debug", "model/selectpicker/main-debug", "model/modal/main-debug", "model/modalEditor/main-debug"], function(require, exports, module) {
    function doSucess(msg) {
        Modal.alert("成功", msg), searchListExp[0].searchListReload()
    }
    var $ = require("common/jquery-debug"),
        SearchList = require("model/searchList/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        Modal = require("model/modal/main-debug"),
        ModalEditor = require("model/modalEditor/main-debug");
    Selectpicker.use(".selectpicker");
    var searchListExp = SearchList.use(".searchList", {
            onDeleteSuccess: function(rtv, msg, response, target) {
                doSucess(msg)
            },
            onEditorSuccess: function(rtv, msg, response, target) {
                modalEditorExp.set("title", target.prop("title")), $("#legalRule_name").val(rtv.name), $("#legalRule_securityId").val(rtv.securityId), modalEditorExp.modalEditorWriteback(rtv)
            }
        }),
        modalEditorExp = new ModalEditor({
            trigger: "#addLegalRule",
            element: "#legalRuleModal"
        }).on("modalEditorSuccess", function(rtv, msg, response) {
            doSucess(msg)
        }).before("modalEditorExecute", function() {}).after("modalEditorReset", function() {})
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});