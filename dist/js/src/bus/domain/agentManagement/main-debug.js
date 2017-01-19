define("src/bus/domain/agentManagement/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/dialog-debug", "model/addLawyer/main-debug", "common/delegate-debug", "model/imgView/main-debug", "common/validator-debug", "model/ajax/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Dialog = require("common/dialog-debug"),
        AddLawyer = require("model/addLawyer/main-debug"),
        delegate = require("common/delegate-debug"),
        ImgView = require("model/imgView/main-debug"),
        Validator = require("common/validator-debug"),
        Ajax = require("model/ajax/main-debug");
    (new AddLawyer).on("addLawyerSuccess", function() {}), new ImgView;
    var validatorExp;
    delegate.on("click", '[data-role="editRight"]', function(e) {
        var securityId = $(e.target).data("param");
        new Ajax({
            request: "/suit/lassenLitigantAgentRpc/getEntityBySecurityId.json?securityId=" + securityId
        }).on("ajaxSuccess", function(rtv, msg, con) {
            var dig = Dialog.showTemplate("#edit-agent-right", rtv, {
                width: 720,
                autoDestroy: !0,
                autoShow: !1,
                events: {
                    "click #save": function(e) {
                        validatorExp && validatorExp.execute(function(err, errlist) {
                            err ? util.log(errlist) : new Ajax({
                                request: "/suit/lassenLitigantAgentRpc/updateEntity.json",
                                paramName: "filemap",
                                parseForm: $("#form-agent"),
                                autoSuccessAlert: !0,
                                autoErrorAlert: !0
                            }).on("ajaxSuccess", function(rtv, msg, con) {
                                setTimeout(window.location.reload(), 3e3), dig.hide()
                            }).submit()
                        })
                    }
                }
            }).after("show", function() {
                if ("normal_lawyer" !== rtv.relationCode && "legal_lawyer" !== rtv.relationCode && $('[data-role="commonRelationFileTr"]').removeClass("fn-hide"), rtv.auth) {
                    var auths = rtv.auth.split(",");
                    $('[name="auth"]').each(function(index, item) {
                        var authValue = $(item).val();
                        $.inArray(authValue, auths) > -1 && $(item).prop("checked", !0)
                    })
                }
                validatorExp = Validator.use("#form-agent")
            }).show()
        }).submit()
    }), delegate.on("click", '[data-role="releaseRight"]', function(e) {
        var agentEntityId = $(e.target).data("param"),
            rtv = {};
        rtv.agentEntityId = agentEntityId, new Ajax({
            request: "/suit/lassenLitigantAgentRpc/relieveEntrustContent.json",
            param: {
                agentEntityId: agentEntityId
            }
        }).on("ajaxSuccess", function(data1, content, data3) {
            rtv.content = content;
            var dig = Dialog.showTemplate("#release-agent", rtv, {
                width: 720,
                autoDestroy: !0,
                autoShow: !0,
                autoSuccessAlert: !0,
                autoErrorAlert: !0,
                events: {
                    "click #noticecheck": function(e) {
                        $(e.target).prop("checked") ? $("#conformRelease").removeClass("fn-btn-disabled") : $("#conformRelease").addClass("fn-btn-disabled")
                    },
                    "click #conformRelease": function(e) {
                        if (!$(e.target).hasClass("fn-btn-disabled")) {
                            var agentEntityId = $('input[name="agentEntityId"]').val(),
                                content = $('[name="content"]').val();
                            new Ajax({
                                request: "/suit/lassenLitigantAgentRpc/relieveEntrust.json",
                                param: {
                                    agentEntityId: agentEntityId,
                                    content: content
                                }
                            }).on("ajaxSuccess", function(rtv, msg, con) {
                                setTimeout(window.location.reload(), 3e3), dig.hide()
                            }).submit()
                        }
                    },
                    "click #cancelRelease": function(e) {
                        dig.hide()
                    }
                }
            })
        }).submit()
    }), delegate.on("click", '[data-role="releaseRightFile"]', function(e) {
        var agentEntityId = $(e.target).data("param"),
            rtv = {};
        rtv.agentEntityId = agentEntityId, new Ajax({
            request: "/suit/lassenLitigantAgentRpc/relieveEntrustFile.json",
            param: {
                agentEntityId: agentEntityId
            }
        }).on("ajaxSuccess", function(data1, content, data3) {
            rtv.content = content;
            Dialog.showTemplate("#release-agent-file", rtv, {
                width: 1180,
                autoDestroy: !0,
                autoShow: !0
            })
        }).submit()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});