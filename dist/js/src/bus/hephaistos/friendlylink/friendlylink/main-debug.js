"use strict";
define("src/bus/hephaistos/friendlylink/friendlylink/main-debug", ["common/jquery-debug", "model/searchList/main-debug", "model/modal/main-debug", "model/selectpicker/main-debug", "model/modalEditor/main-debug"], function(require, exports, module) {
    function doSucess(msg) {
        Modal.alert("成功", msg), searchListExp[0].searchListReload()
    }
    var SearchList = (require("common/jquery-debug"), require("model/searchList/main-debug")),
        Modal = require("model/modal/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        ModalEditor = require("model/modalEditor/main-debug"),
        searchListExp = SearchList.use(".searchList", {
            onDeleteSuccess: function(rtv, msg, response, target) {
                doSucess(msg)
            },
            onEditorSuccess: function(rtv, msg, response, target) {
                modalEditorExp.set("title", target.prop("title")), modalEditorExp.modalEditorWriteback(rtv)
            }
        });
    Selectpicker.use(".selectpicker");
    var modalEditorExp = new ModalEditor({
        trigger: "#addMedoatpr",
        element: "#medoatprModal"
    }).on("modalEditorSuccess", function(rtv, msg, response) {
        doSucess(msg)
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});