"use strict";
define("src/model/addLawyer/main-debug", ["common/jquery-debug", "common/cookie-debug", "common/myWidget-debug", "common/validator-debug", "alinw/dialog/2.0.6/dialog-debug", "alinw/handlebars/1.3.0/handlebars-debug", "model/address/data-debug", "model/modal/main-debug", "model/upload/main-debug", "model/searchList/main-debug", "model/address/select-debug", "model/ajax/main-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        MyWidget = (require("common/cookie-debug"), require("common/myWidget-debug")),
        Validator = require("common/validator-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Handlebars = require("alinw/handlebars/1.3.0/handlebars-debug"),
        areaData = require("model/address/data-debug"),
        Modal = require("model/modal/main-debug"),
        Upload = require("model/upload/main-debug"),
        SearchList = require("model/searchList/main-debug"),
        Ajax = (require("model/address/select-debug"), require("model/ajax/main-debug"));
    Handlebars.registerHelper("getCityByareaCode", function(areaCode) {
        if (areaCode) {
            var areaCode = areaCode.slice(0, 4) + "00";
            return areaData[areaCode][0]
        }
        return ""
    });
    var $ = MyWidget.jQuery,
        handlerbars = MyWidget.handlerbars,
        AddLawyer = MyWidget.extend({
            clssName: "AddLawyer",
            attrs: {
                element: "body",
                getAllFirmAreaCode: "/portal/LawyerServiceRpc/getAllFirmAreaCode.json",
                getLawyersGoodTypeDo: "/courtmanage/lassenFirmLawyerRpc/getAllGoodType.json",
                getFirmLawyersDo: "/courtmanage/lassenFirmLawyerRpc/getFirmLawyers.json",
                initAgentAuthDo: "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=AGENT_AUTH",
                initLegalRelationDo: "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_LEGAL",
                initNormalRelationDo: "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_NORMAL",
                initAgentListDo: "/suit/lassenLitigantAgentRpc/agentList.json",
                saveLawyerAgent: " /suit/lassenLitigantAgentRpc/saveLawyerAgent.json",
                saveUsedAgent: " /suit/lassenLitigantAgentRpc/saveUsedAgent.json",
                saveNewAgent: " /suit/lassenLitigantAgentRpc/saveNewAgent.json",
                deleteLawyerDo: "/suit/lassenLitigantAgentRpc/delete.json"
            },
            events: {
                "click .JS-trigger-add-lawyer": function(e) {
                    if ($(e.target).hasClass("fn-btn-disabled")) return !0;
                    var me = this,
                        data = {};
                    me.set("addLawyerTrigger", $(e.target));
                    var relationUrl = "",
                        identity = $('[data-role="identifyType"]').val();
                    relationUrl = "agent" === identity ? "normal" === $('input[data-role="ligintEntityType"]').val() ? me.get("initNormalRelationDo") : me.get("initLegalRelationDo") : "normal" === $('input[data-role="entityType"]').val() ? me.get("initNormalRelationDo") : me.get("initLegalRelationDo"), Ajax.when({
                        request: me.get("initAgentAuthDo")
                    }, {
                        request: relationUrl
                    }, {
                        request: me.get("getLawyersGoodTypeDo")
                    }, {
                        request: me.get("initAgentListDo")
                    }, {
                        request: me.get("getAllFirmAreaCode")
                    }).then(function(rs1, rs2, rs3, rs4, rs5) {
                        data.relation = rs1.val ? JSON.parse(rs1.val) : {}, data.agentAuth = rs2.val ? JSON.parse(rs2.val) : {}, data.goodType = rs3.val ? rs3.val : {}, data.agentList = rs4.val ? rs4.val : [];
                        var areaCodeArray = rs5.val ? rs5.val : [],
                            areaCode = new Array;
                        $.each(areaCodeArray, function(i, item) {
                            areaCode.push({
                                key: item.areaCode,
                                value: areaData[item.areaCode][0]
                            })
                        }), data.areaCode = areaCode;
                        var dag = new Dialog({
                            width: 720,
                            content: me.addAgentlawyer(data),
                            events: {
                                "click [data-trigger]": function(e) {
                                    e.preventDefault(), me.$('div[data-role="lawyer-div"]').hide();
                                    var triggerDiv = me.$(e.target).data("trigger");
                                    me.$("#" + triggerDiv).show(), me.$("a[data-trigger]").removeClass("ch-active"), me.$(e.target).addClass("ch-active")
                                },
                                "click #platform-lawyer-next": function(e) {
                                    me.$('[data-role="selectLawyerRadio"]').filter(":checked").size() >= 1 ? (me.$('div[data-role="lawyer-div"]').hide(), me.$("#platform-lawyer-next-div").show(), me.$("a[data-trigger]:first").data("trigger", "platform-lawyer-next-div")) : Modal.alert("提醒", "请选择代理律师。")
                                },
                                "click #platform-lawyer-prev": function(e) {
                                    me.$('div[data-role="lawyer-div"]').hide(), me.$("#platform-lawyer").show(), me.$("a[data-trigger]:first").data("trigger", "platform-lawyer")
                                },
                                "click #platform-lawyer-save": function(e) {
                                    me.doSave(dag, "saveLawyerAgent", "form-platform-lawyer")
                                },
                                "click #common-lawyer-save": function(e) {
                                    me.doSave(dag, "saveUsedAgent", "form-common-lawyer")
                                },
                                "click #other-lawyer-save": function(e) {
                                    me.doSave(dag, "saveNewAgent", "form-other-lawyer")
                                },
                                'click [data-role="selectLawyerTr"]': function(e) {
                                    var tr = $(e.target).closest("tr"),
                                        phone = tr.find('[name="mobile"]').val(),
                                        radio = tr.find('[data-role="selectLawyerRadio"]');
                                    radio.prop("checked", !0), me.$("#lawyer-phonenumber").html(phone), me.$("#lawyer-phonenumber").append('<input type="hidden" name="agentUserId" value="' + radio.data("accountid") + '">')
                                },
                                'change [data-role="selectAgent"]': function(e) {
                                    var tgt = me.$(e.target),
                                        option = tgt.find("option:selected"),
                                        index = option.index('[data-role="selectAgent"] option');
                                    me.validators.saveUsedAgent.removeItems('#common-lawyer [data-role="commonRelationFile"]'), me.changeCommonlawyer(data.agentList[index]), me.uploads = (me.uploads ? me.uploads : []).concat(Upload.use('#common-lawyer [data-role="commonRelationFile"] .JS-need-upload')), $('select[data-relation="commonLawyerRelationCode"]').trigger("change")
                                },
                                'click i[data-role="triggerQuery"]': function(e) {
                                    me.searchListExp[0].searchListReload()
                                },
                                'change select[data-role="triggerQuery"]': function(e) {
                                    me.searchListExp[0].searchListReload()
                                },
                                'change select[data-relation="commonLawyerRelationCode"]': function(e) {
                                    var type = $(e.target).val();
                                    if ("normal_lawyer" === type || "legal_lawyer" === type) me.$('#common-lawyer [data-role="commonRelationFileTr"]').addClass("fn-hide JS-serialize-exclude"), me.validators.saveUsedAgent.removeItems('#common-lawyer [data-role="commonRelationFile"]');
                                    else {
                                        me.$('#common-lawyer [data-role="commonRelationFileTr"]').removeClass("fn-hide JS-serialize-exclude");
                                        var havaTheValidator = !1,
                                            elements = $.map(me.validators.saveUsedAgent.items, function(item) {
                                                return item.element
                                            });
                                        $.each(elements, function(index, item) {
                                            "relationFile" === item.prop("name") && (havaTheValidator = !0)
                                        }), !havaTheValidator && me.validators.saveUsedAgent.addItems('#common-lawyer [data-role="commonRelationFile"]')
                                    }
                                },
                                'change select[data-relation="otherLawyerRelationCode"]': function(e) {
                                    var type = $(e.target).val();
                                    if ("normal_lawyer" === type || "legal_lawyer" === type) me.$('#other-lawyer [data-role="commonRelationFileTr"]').addClass("fn-hide JS-serialize-exclude"), me.validators.saveNewAgent.removeItems('#other-lawyer [data-role="commonRelationFileTr"]');
                                    else {
                                        me.$('#other-lawyer [data-role="commonRelationFileTr"]').removeClass("fn-hide JS-serialize-exclude");
                                        var havaTheValidator = !1,
                                            elements = $.map(me.validators.saveNewAgent.items, function(item) {
                                                return item.element
                                            });
                                        $.each(elements, function(index, item) {
                                            "relationFile" === item.prop("name") && (havaTheValidator = !0)
                                        }), !havaTheValidator && me.validators.saveNewAgent.addItems('#other-lawyer [data-role="commonRelationFileTr"]')
                                    }
                                }
                            }
                        }).after("show", function() {
                            data.agentList.length > 0 && me.changeCommonlawyer(data.agentList[0]), me.$('[name="auth"][value="common_agent"]').prop("checked", !0), me.searchListExp = SearchList.use("#search-list", {
                                template: me.$("#agent-lawyer-table-template").html(),
                                pageParentNode: $(".page")
                            }), me.uploads = Upload.use(".agent-lawyer .JS-need-upload"), me.validators = [], me.validators.saveLawyerAgent = Validator.use("#form-platform-lawyer"), me.validators.saveUsedAgent = Validator.use("#form-common-lawyer"), me.validators.saveNewAgent = Validator.use("#form-other-lawyer");
                            var identity = $('[data-role="identifyType"]').val();
                            "agent" === identity ? "normal" === $('input[data-role="ligintEntityType"]').val() ? $('#form-platform-lawyer [name="relationCode"]').val("normal_lawyer") : $('#form-platform-lawyer [name="relationCode"]').val("legal_lawyer") : "normal" === $('input[data-role="entityType"]').val() ? $('#form-platform-lawyer [name="relationCode"]').val("normal_lawyer") : $('#form-platform-lawyer [name="relationCode"]').val("legal_lawyer"), me.$('.agent-lawyer [name="securityCaseId"]').val(me.$('.fn-margin-center [name="securityCaseId"]').val()), $('select[data-relation="commonLawyerRelationCode"]').trigger("change"), $('select[data-relation="otherLawyerRelationCode"]').trigger("change")
                        }).after("hide", function() {
                            $.each(me.uploads, function(index, item) {
                                item.destroy()
                            }), dag.destroy()
                        }).render();
                        dag.show()
                    }, function(rs1, rs2, rs3, rs4, rs5) {
                        Modal.alert(0, "系统繁忙，请联系管理员")
                    })
                },
                "click .JS-trigger-click-delete-lawyer": function(e) {
                    var me = this,
                        tgt = $(e.target);
                    Modal.confirm("提醒", "您确定要删除嘛？", function() {
                        new Ajax({
                            request: me.get("deleteLawyerDo") + "?securityId=" + tgt.data("param")
                        }).on("ajaxSuccess", function(rtv, msg, con) {
                            tgt.closest("tr").remove();
                            var agent = me.$('[name="agentRelationId"]');
                            if (("agent" != agent.val() || "agent" == agent.val() && 0 == me.$(".JS-trigger-click-delete-lawyer").size()) && agent.val(""), 0 == me.$(".JS-trigger-click-delete-lawyer").size()) {
                                var target = me.$(".JS-trigger-add-lawyer");
                                target.removeClass("fn-btn-disabled").addClass("fn-btn-default"), target.nextAll("#addLawyerNote").size() && target.nextAll("#addLawyerNote").remove()
                            }
                        }).submit()
                    })
                }
            },
            initProps: function() {
                var me = this;
                me.addAgentlawyer = handlerbars.compile(me.$("#add-agent-lawyer-template"), !0), me.agentlawyerInfo = handlerbars.compile(me.$("#my-lawyer-template"), !0), me.commonLawyerRalationFile = handlerbars.compile(me.$("#a-common-relationfile-template"), !0), me.staticLawyerRalationFile = handlerbars.compile(me.$("#a-static-relationfile-template"), !0), me.searchListExp = null
            },
            setup: function() {},
            changeCommonlawyer: function(agentInfo) {
                var me = this;
                agentInfo.inputName = "relationFile", me.$('#common-lawyer [name="agentUserId"]').val(agentInfo.agentUserId), me.$('[data-role="selectrelationCode"] option[value="' + agentInfo.relationCode + '"]').prop("selected", !0), me.$('#common-lawyer [data-role="commonRelationFile"]').html(me.staticLawyerRalationFile(agentInfo))
            },
            afterGetLawyer: function(dag, rtv, msg, con) {
                var me = this,
                    target = me.get("addLawyerTrigger"),
                    tr = target.closest("tr");
                if (tr.size() > 0) {
                    tr.after(me.agentlawyerInfo(rtv)), target.addClass("fn-btn-disabled").removeClass("fn-btn-default"), dag.hide();
                    var next = target.next("input");
                    next.val(rtv.securityId), next.after("<span id='addLawyerNote' class='fn-color-047DC6 fn-BoAlSo fn-LH20 fn-PaAl8 fn-VAMiddle'>如果还需要添加代理人，请操作我的诉讼案件列表，代理人管理进行添加。</span>")
                } else me.trigger("addLawyerSuccess"), Modal.alert(1, msg), dag.hide(), setTimeout(window.location.reload(), 3e3)
            },
            doSave: function(dag, validatorName, formName) {
                var me = this;
                me.validators[validatorName].execute(function(err, errlist) {
                    err || new Ajax({
                        request: me.get(validatorName),
                        paramName: "fileMap",
                        parseForm: $("#" + formName)
                    }).on("ajaxSuccess", function(rtv, msg, con) {
                        me.afterGetLawyer(dag, rtv, msg, con)
                    }).submit()
                })
            }
        });
    return AddLawyer
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});