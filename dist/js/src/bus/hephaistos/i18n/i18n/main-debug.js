"use strict";
define("src/bus/hephaistos/i18n/i18n/main-debug", ["common/jquery-debug", "model/searchList/main-debug", "model/modal/main-debug", "model/selectpicker/main-debug", "model/ajax/main-debug", "model/modalEditor/main-debug"], function(require, exports, module) {
    function doSucess(msg) {
        Modal.alert("成功", msg), searchListExp[0].searchListReload()
    }
    var $ = require("common/jquery-debug"),
        SearchList = require("model/searchList/main-debug"),
        Modal = require("model/modal/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        ModalEditor = require("model/modalEditor/main-debug"),
        searchListExp = SearchList.use(".searchList", {
            onDeleteSuccess: function(rtv, msg, response, target) {
                doSucess(msg)
            },
            onEditorSuccess: function(rtv, msg, response, target) {
                modalEditorExp.set("title", target.prop("title")), rtv.id = rtv.securityId, modalEditorExp.modalEditorWriteback(rtv)
            }
        });
    Selectpicker.use(".selectpicker");
    var modalEditorExp = new ModalEditor({
        trigger: "#addI18N",
        element: "#addI18NModal"
    }).on("modalEditorSuccess", function(rtv, msg, response) {
        doSucess(msg)
    }).after("modalEditorReset", function() {});
    $("#refreshI18N").on("click", function() {
        new Ajax({
            request: "/hephaistos/i18nRpc/refresh.json"
        }).on("ajaxSuccess", function(rtv, msg, con) {
            Modal.alert("成功", msg), searchListExp[0].searchListReload()
        }).submit()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});