"use strict";
define("src/bus/hephaistos/news/lassenNewsList/main-debug", ["common/jquery-debug", "model/upload/main-debug", "model/searchList/main-debug", "model/modal/main-debug", "model/selectpicker/main-debug", "model/modalEditor/main-debug", "alinw/imgareaselect/1.0.1/imgareaselect-debug", "common/tinymce-debug"], function(require, exports, module) {
    function openCloseInput(flag) {
        shearX.prop("disabled", flag), shearY.prop("disabled", flag), shearWidth.prop("disabled", flag), shearHeight.prop("disabled", flag), ratio.prop("disabled", flag)
    }

    function doSucess(msg) {
        Modal.alert("成功", msg), searchListExp[0].searchListReload()
    }

    function setTinymceVal() {
        tinymce.get("content").setContent($("#content").val())
    }
    var $ = require("common/jquery-debug"),
        Upload = require("model/upload/main-debug"),
        SearchList = require("model/searchList/main-debug"),
        Modal = require("model/modal/main-debug"),
        Selectpicker = require("model/selectpicker/main-debug"),
        ModalEditor = require("model/modalEditor/main-debug"),
        tinymceUse = (require("alinw/imgareaselect/1.0.1/imgareaselect-debug"), require("common/tinymce-debug"));
    tinymceUse({
        selector: "#content"
    });
    var searchListExp = SearchList.use(".searchList", {
            onDeleteSuccess: function(rtv, msg, response, target) {
                doSucess(msg)
            },
            onEditorSuccess: function(rtv, msg, response, target) {
                modalEditorExp.set("title", target.prop("title")), modalEditorExp.modalEditorWriteback(response.retValue), modalEditorExp.set("title", target.prop("title")), rtv.id = rtv.securityId, modalEditorExp.modalEditorWriteback(rtv), rtv.newsMap ? uploadExp[0] && uploadExp[0].set("list", {
                    id: rtv.newsMap.securityId,
                    name: rtv.newsMap.fileName,
                    url: rtv.newsMap.url
                }) : uploadExp[0] && uploadExp[0].set("list", []), uploadExp[0] && uploadExp[0].uploadRenderList(), setTinymceVal()
            }
        }),
        width = 530,
        height = 290,
        imgOption = {},
        imgShearsModal = $("#imgShearsModal"),
        imgShears = $("#imgShears"),
        shearX = $('[name="shearX"]'),
        shearY = $('[name="shearY"]'),
        shearWidth = $('[name="shearWidth"]'),
        shearHeight = $('[name="shearHeight"]'),
        ratio = $('[name="ratio"]'),
        imgShowModal = $("#imgShowModal"),
        imgShow = $("#imgShow");
    $("body").on("click", '[data-rule="imgView"]', function(e) {
        e.preventDefault(), imgShowModal.modal(), imgShow.prop("src", this.href)
    }), $("body").on("click", '[data-role="closeImgShow"]', function() {
        imgShowModal.modal("hide")
    }), $("body").on("click", '[data-role="shearDown"]', function() {
        imgShearsModal.modal("hide")
    }), imgShearsModal.on("hide.bs.modal", function() {
        imgShears.imgAreaSelect({
            hide: !0
        }), shearX.val(imgOption.shearX), shearY.val(imgOption.shearY), shearWidth.val(imgOption.shearWidth), shearHeight.val(imgOption.shearHeight), ratio.val(imgOption.ratio), openCloseInput(!1)
    }), imgShearsModal.on("shown.bs.modal", function() {}), imgShears.on("load", function() {
        $.extend(imgOption, {
            ratio: mainWidth / imgShears.width(),
            shearWidth: width,
            shearHeight: height,
            shearX: 0,
            shearY: 0
        }), imgOption.ratio > 1 && imgShears.imgAreaSelect({
            minWidth: width,
            minHeight: height,
            x1: 0,
            y1: 0,
            x2: width,
            y2: height,
            resizable: !1,
            show: !0,
            onSelectEnd: function(img, opt) {
                $.extend(imgOption, {
                    shearX: opt.x1,
                    shearY: opt.y1
                })
            }
        })
    });
    var mainWidth, uploadExp = Upload.use(".JS-trigger-click-upload", {
        imgView: !0
    });
    uploadExp[0] && uploadExp[0].on("success", function(response) {
        var img = new Image;
        img.onload = function() {
            img.onload = null;
            var $img = $(img);
            mainWidth = $img.appendTo("body").width(), $img.remove(), imgShears.prop("src", response.url), imgShearsModal.modal({
                backdrop: "static"
            })
        }, img.src = response.url
    }), Selectpicker.use(".selectpicker");
    var modalEditorExp = new ModalEditor({
        trigger: "#addMedoatpr",
        element: "#medoatprModal"
    }).on("modalEditorSuccess", function(rtv, msg, response) {
        doSucess(msg)
    }).after("modalEditorReset", function() {
        uploadExp[0] && uploadExp[0].uploadRenderClear(), openCloseInput(!0)
    }).before("modalEditorExecute", function() {
        var me = this,
            content = tinymce.get("content").getContent();
        return content.length > 15e3 ? (Modal.alert(0, "输入的字符太长，请输入15000之内。"), !1) : void me.$("#content").val(content)
    }).after("modalEditorReset", function() {
        setTinymceVal()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});