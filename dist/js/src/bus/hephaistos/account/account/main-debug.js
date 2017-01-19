"use strict";
define("src/bus/hephaistos/account/account/main-debug", ["common/jquery-debug", "model/searchList/main-debug", "model/modal/main-debug", "model/selectpicker/main-debug", "model/modalEditor/main-debug", "model/upload/main-debug"], function(require, exports, module) {
    function doSucess(msg) {
        Modal.alert("成功", msg), searchListExp[0].searchListReload()
    }
    var $ = require("common/jquery-debug"),
        SearchList = require("model/searchList/main-debug"),
        Modal = require("model/modal/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        ModalEditor = require("model/modalEditor/main-debug"),
        Upload = require("model/upload/main-debug"),
        searchListExp = SearchList.use(".searchList", {
            onDeleteSuccess: function(rtv, msg, response, target) {
                doSucess(msg)
            },
            onEditorSuccess: function(rtv, msg, response, target) {
                modalEditorExp.set("title", target.prop("title")), rtv.id = rtv.securityId, modalEditorExp.modalEditorWriteback(rtv)
            }
        });
    Selectpicker.use(".selectpicker");
    Upload.use(".JS-trigger-click-upload");
    if ($("#roleModal").size()) var modalEditorExp = new ModalEditor({
        trigger: "#addRole",
        element: "#roleModal"
    }).on("modalEditorSuccess", function(rtv, msg, response) {
        doSucess(msg)
    }).after("modalEditorReset", function() {})
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});