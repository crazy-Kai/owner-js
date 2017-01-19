"use strict";
define("src/bus/hephaistos/mediator/mediator/main-debug", ["common/jquery-debug", "model/searchList/main-debug", "model/modal/main-debug", "model/selectpicker/main-debug", "model/modalEditor/main-debug", "model/upload/main-debug"], function(require, exports, module) {
    function doSucess(msg) {
        Modal.alert("成功", msg), searchListExp[0].searchListReload()
    }
    var SearchList = (require("common/jquery-debug"), require("model/searchList/main-debug")),
        Modal = require("model/modal/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        ModalEditor = require("model/modalEditor/main-debug"),
        Upload = require("model/upload/main-debug"),
        searchListExp = SearchList.use(".searchList", {
            onDeleteSuccess: function(rtv, msg, response, target) {
                doSucess(msg)
            },
            onEditorSuccess: function(rtv, msg, response, target) {
                modalEditorExp.set("title", target.prop("title")), rtv.id = rtv.securityId, modalEditorExp.modalEditorWriteback(rtv), rtv.mediatorFileIds ? uploadExp[0] && uploadExp[0].set("list", {
                    id: rtv.mediatorFileIds,
                    name: rtv.mediatorFileName,
                    url: rtv.mediatorFilesURL
                }) : uploadExp[0] && uploadExp[0].set("list", []), uploadExp[0] && uploadExp[0].uploadRenderList()
            }
        });
    Selectpicker.use(".selectpicker");
    var uploadExp = Upload.use(".JS-trigger-click-upload"),
        modalEditorExp = new ModalEditor({
            trigger: "#addMedoatpr",
            element: "#medoatprModal"
        }).on("modalEditorSuccess", function(rtv, msg, response) {
            doSucess(msg)
        }).after("modalEditorReset", function() {
            uploadExp[0] && uploadExp[0].uploadRenderClear()
        })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});