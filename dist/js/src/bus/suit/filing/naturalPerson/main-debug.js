"use strict";
define("src/bus/suit/filing/naturalPerson/main-debug", ["bus/global/main-debug", "common/validator-debug", "model/ajax/main-debug", "model/modal/main-debug", "model/upload/main-debug", "model/perChecked/main-debug", "model/imgView/main-debug", "model/addLawyer/main-debug"], function(require, exports, module) {
    function hideSomeInput() {
        $('#page-param [type="text"]').each(function() {
            hideSecretInput($(this))
        })
    }

    function showSomeInput() {
        $('#page-param [type="text"]').removeClass("fn-hide")
    }

    function hideSecretInput(node) {
        var val = node.val(),
            dVal = node.prop("defaultValue");
        val && val === dVal && node.addClass("fn-hide")
    }
    require("bus/global/main-debug");
    var Validator = require("common/validator-debug"),
        pageCheck = $("#page-check"),
        Ajax = require("model/ajax/main-debug"),
        Modal = require("model/modal/main-debug"),
        Upload = require("model/upload/main-debug"),
        PerChecked = require("model/perChecked/main-debug"),
        ImgView = require("model/imgView/main-debug"),
        AddLawyer = require("model/addLawyer/main-debug");
    new ImgView;
    var validatorExp = Validator.use("#page-param");
    Upload.use(".JS-need-upload"), new AddLawyer, pageCheck.length && new PerChecked({
        element: pageCheck
    }).after("psCheckedNext", function(flag) {
        flag && new Ajax({
            element: "#page-param",
            paramParse: function(json) {
                for (var i in json) json[i].indexOf("*") !== -1 && delete json[i];
                return json
            },
            events: {
                "click .JS-trigger-click-submit": function() {
                    var meAjax = this;
                    hideSomeInput(), validatorExp.execute(function(flag) {
                        showSomeInput(), flag || Modal.confirm("提示 ", "提交后无法修改，确认提交么？", function() {
                            meAjax.submit()
                        }, function() {
                            meAjax.destroy()
                        })
                    })
                }
            }
        }).on("ajaxSuccess", function() {
            location.reload(!0)
        })
    }), $("#page-param").find("table").on("blur", 'input[type="text"]', function() {
        hideSecretInput($(this))
    }), $("body").on("blur", 'input[type="text"]', function() {
        $(this).removeClass("fn-hide")
    })
});