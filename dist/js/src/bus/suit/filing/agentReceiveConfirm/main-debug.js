"use strict";
define("src/bus/suit/filing/agentReceiveConfirm/main-debug", ["bus/global/main-debug", "common/validator-debug", "model/ajax/main-debug", "model/modal/main-debug", "model/upload/main-debug", "model/perChecked/main-debug", "common/delegate-debug", "model/imgView/main-debug", "common/dialog-debug", "common/handlerbars-debug", "model/addLawyer/main-debug", "common/calendar-debug"], function(require, exports, module) {
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

    function setLigintInfor(rtv) {
        validatorExp.removeItems("#selectedLigintDetails"), validatorExp.removeItems('[data-role="commonRelationFile"]');
        var template = handlerbars.compile($("#ligint-info-template").html());
        $("#selectedLigintDetails").html(template(rtv)), Upload.use("#selectedLigintDetails .JS-need-upload"), validatorExp.addItems("#selectedLigintDetails"), rtv.lassenLitigantAgentDto || (rtv.lassenLitigantAgentDto = {}), rtv.lassenLitigantAgentDto.inputName = "agentVo.relationFile", getRelationWithLigint(rtv.entityType, rtv.lassenLitigantAgentDto), $('[data-identifytype="agentDetails"] i.JS-trigger-click-delete-lawyer').size() <= 0 && $('[data-identifytype="agentDetails"] .JS-trigger-add-lawyer').addClass("fn-btn-default").removeClass("fn-btn-disabled"), Calendar.use()
    }

    function getRelationWithLigint(entityType, relationFileDo) {
        var request;
        "normal" == entityType ? request = "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_NORMAL" : "legal" == entityType && (request = "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_LEGAL"), request && new Ajax({
            request: request
        }).on("ajaxSuccess", function(rtv, msg, con) {
            var template = handlerbars.compile('{{#each this}}<option value="{{key}}">{{value}}</option>{{/each}}');
            if ($('select[name="agentVo.relationCode"]').html(template(JSON.parse(rtv))), relationFileDo) {
                var relationCode = relationFileDo.relationCode;
                relationCode ? $('[name="agentVo.relationCode"] option[value="' + relationCode + '"]').prop("selected", !0) : $('[name="agentVo.relationCode"] option:first').prop("selected", !0);
                var relationHand = handlerbars.compile($("#a-common-relationfile-template"), !0);
                $('[data-role="commonRelationFile"]').html(relationHand(relationFileDo)), Upload.use('[data-role="commonRelationFile"] .JS-need-upload'), $('[data-identifytype="agentDetails"] [name="agentVo.relationCode"]').trigger("change")
            }
        }).submit()
    }
    require("bus/global/main-debug");
    var Validator = require("common/validator-debug"),
        pageCheck = $("#page-check"),
        Ajax = require("model/ajax/main-debug"),
        Modal = require("model/modal/main-debug"),
        Upload = require("model/upload/main-debug"),
        PerChecked = require("model/perChecked/main-debug"),
        delegate = require("common/delegate-debug"),
        ImgView = require("model/imgView/main-debug"),
        Dialog = require("common/dialog-debug"),
        handlerbars = require("common/handlerbars-debug"),
        AddLawyer = require("model/addLawyer/main-debug"),
        Calendar = require("common/calendar-debug"),
        validatorExp = Validator.use("#page-param");
    Upload.use(".JS-need-upload"), new AddLawyer, new ImgView, pageCheck.length && new PerChecked({
        element: pageCheck
    }).after("psCheckedNext", function(flag) {
        flag && new Ajax({
            element: "#page-param",
            paramParse: function(json) {
                for (var i in json) {
                    if ("object" == typeof json[i]) {
                        var obj = json[i];
                        for (var k in obj) obj[k].indexOf("*") !== -1 && delete obj[k]
                    } else json[i].indexOf("*") !== -1 && delete json[i];
                    json[i] = JSON.stringify(json[i])
                }
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
    }), window.alipaySetLigintInfor = function(result) {
        result.hasError || 1 != result.content.isSuccess ? result.content && result.content.message ? Modal.alert(0, result.content.message) : result && result.errors && result.errors[0] && result.errors[0].msg ? Modal.alert(0, result.errors[0].msg) : Modal.alert(0, "系统繁忙，请联系管理员。") : setLigintInfor(result.content.retValue), alipayDialog && alipayDialog.hide()
    };
    var alipayDialog = null;
    delegate.on("click", '[data-role="selectLigint"]', function(e) {
        e.preventDefault();
        var type = $(e.target).data("type");
        "alipay" === type ? alipayDialog = Dialog.show("/suit/start/ligintAlipay.htm?type=agent&securityAccusedEntityId=" + $('[name="accusedVo.securityId"]').val(), {
            width: 380,
            height: 380
        }) : new Ajax({
            request: "/suit/lassenLitigantAgentRpc/getLigiantListByAgent.json?",
            param: {
                type: "agent",
                litigantEntityType: $('[data-role="ligintEntityType"]').val(),
                litigantEntityId: $('[name="accusedVo.securityId"]').val()
            }
        }).on("ajaxSuccess", function(rtv, msg, con) {
            var dig = Dialog.showTemplate("#select-history-ligint-template", rtv, {
                width: 720,
                autoDestroy: !0,
                autoShow: !0,
                events: {
                    "click #selectHistoryLigint": function(e) {
                        var entity = $('[data-role="selectHistoryLigintRadio"]:checked');
                        if (entity.size() > 0) {
                            var entityId = entity.val();
                            new Ajax({
                                request: "/suit/lassenLitigantAgentRpc/receiveConfirmCheckUsedLitigant.json?securityId=" + entityId + "&securityAccusedEntityId=" + $('[name="accusedVo.securityId"]').val()
                            }).on("ajaxSuccess", function(rtv, msg, con) {
                                setLigintInfor(rtv), dig.hide()
                            }).submit()
                        } else Modal.alert("提醒", "请选择已代理过的当事人。")
                    },
                    'click [data-role="selectHistoryLigintTr"]': function(e) {
                        var tr = $(e.target).closest("tr");
                        tr.find('[data-role="selectHistoryLigintRadio"]').prop("checked", !0)
                    }
                }
            })
        }).submit()
    }), delegate.on("change", '[data-identifytype="agentDetails"] [name="agentVo.relationCode"]', function(e) {
        var type = $(e.target).val();
        "normal_lawyer" === type || "legal_lawyer" === type ? ($('[data-role="commonRelationFileTr"]').addClass("fn-hide JS-serialize-exclude"), validatorExp.removeItems('[data-role="commonRelationFile"]')) : ($('[data-role="commonRelationFileTr"]').removeClass("fn-hide JS-serialize-exclude"), validatorExp.addItems('[data-role="commonRelationFile"]'))
    })
});
define("common/handlerbars-debug", [], function(require, exports, module) {});