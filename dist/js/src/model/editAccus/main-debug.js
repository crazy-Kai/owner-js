"use strict";
define("src/model/editAccus/main-debug", ["common/jquery-debug", "common/myWidget-debug", "common/validator-debug", "alinw/dialog/2.0.6/dialog-debug", "model/modal/main-debug", "common/calendar-debug", "model/ajax/main-debug", "model/selectForCompanyAddress/main-debug"], function(require, exports, module) {
    function hideSecretInput(node) {
        var val = node.val(),
            dVal = node.prop("defaultValue");
        val && val.indexOf("*") !== -1 && val === dVal && node.addClass("fn-hide")
    }

    function resetDo(json) {
        return MyWidget.breakEachObj(json, function(val, key) {
            resetDoObj[key] && (json["lassenSuitEntityDo." + key] = val, delete json[key])
        }), json
    }
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        Validator = require("common/validator-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Modal = require("model/modal/main-debug"),
        Calendar = require("common/calendar-debug"),
        Ajax = require("model/ajax/main-debug"),
        SelectForCompanyAddress = require("model/selectForCompanyAddress/main-debug"),
        $ = MyWidget.jQuery,
        handlerbars = MyWidget.handlerbars,
        EditAccus = MyWidget.extend({
            clssName: "EditAccus",
            attrs: {
                saveSuitEntityDo: " /suit/suitEntityRpc/saveSuitEntityDo.json",
                deleteSuitEntity: "/suit/suitEntityRpc/deleteSuitEntity.json",
                getSuitEntityDo: "/suit/suitEntityRpc/getSuitEntityDo.json",
                maxAccused: 4
            },
            events: {
                "click .JS-trigger-click-add": function(e) {
                    var me = this,
                        target = $(e.target).closest(".JS-trigger-click-add");
                    return target.hasClass("fn-btn-disabled") ? me : (me.soCheckHumenOrCompany("normal"), me.soPersonChange("normal"), me.soAddAccusedShow("新增被告"), me.isFirstAccuse = null, me.soCheckIsFirst(), void delete me.soEditorDom)
                },
                "click .JS-trigger-click-delete": "soDeleteAccused",
                "click .JS-trigger-click-editor": "soEditorAccused"
            },
            initProps: function() {
                var me = this;
                me.soFirstAccused = me.$(".JS-target-first-accused"), me.soTempleAccused = handlerbars.compile(me.$(".JS-temple-accused-edit").html()), me.soAccusedTemple = handlerbars.compile(me.$(".JS-temple-accused-data").html()), me.soAddAccusedDialog = new Dialog({
                    width: 450,
                    content: me.soTempleAccused(),
                    events: {
                        "click .JS-trigger-click-submit": function() {
                            me.soHideSomeInput(), me.validator.execute(function(flag, err) {
                                if (me.soShowSomeInput(), flag) return me.log(err);
                                var formDo = me.serialize(me.soOrderForm);
                                me.paseParam("lassenSuitEntityDo", formDo);
                                return formDo.lassenSuitEntityDo.mobile || formDo.lassenSuitEntityDo.email ? void me.soSaveSuitEntityDo() : Modal.alert("提醒", "手机和邮箱必须填一个")
                            })
                        },
                        "click .JS-trigger-change-person": function(e) {
                            me.soPersonChange($(e.target).val())
                        },
                        'blur [type="text"]': function(e) {
                            $(e.target).removeClass("fn-hide")
                        }
                    }
                }).render(), me.soOrderForm = me.soAddAccusedDialog.$(".JS-target-form"), me.soHumen = me.soAddAccusedDialog.$(".JS-target-humen"), me.soCompany = me.soAddAccusedDialog.$(".JS-target-company"), me.validator = Validator.use(me.soOrderForm), me.soAccusedGuid = me.$(".JS-target-accused").length, me.calendar = new Calendar({
                    trigger: me.soAddAccusedDialog.$('[name="lassenSuitEntityDo.birthday"]')
                }), me.soAddAccusedDialog.$("table").on("blur", '[type="text"]', function() {
                    hideSecretInput($(this))
                })
            },
            setup: function() {
                var me = this;
                me.soAddAccusedDialog.after("hide", function() {
                    me.soResetSuatus(), me.resetForm(me.soOrderForm)
                }).before("show", function() {
                    this.$(".JS-target-title").html(me.soAddAccusedTitle)
                }), me.soTriggerAccuseAddToggle(), new SelectForCompanyAddress({
                    trigger: me.soAddAccusedDialog.$('[name="lassenSuitEntityDo.companyName"]')
                })
            },
            soSaveSuitEntityDo: function() {
                var me = this;
                return me.soOrderForm.find('[name="lassenSuitEntityDo.entityType"]').prop("disabled", !1), new Ajax({
                    request: me.get("saveSuitEntityDo"),
                    autoSubmit: !0,
                    paramName: "filterMap",
                    parseForm: me.soOrderForm,
                    paramParse: function(json) {
                        var verMap = {
                            name: "companyName",
                            companyName: "name"
                        };
                        for (var i in json)
                            for (var j in json[i]) verMap[j] && (json[i][verMap[j]] = ""), json[i][j].indexOf && json[i][j].indexOf("*") !== -1 && delete json[i][j];
                        return json
                    },
                    onAjaxSuccess: function(rtv, msg, con) {
                        me.soEditorDom ? (me.isFirstAccuse ? (me.orderDo || (me.orderDo = me.serialize(me.$(".JS-taget-orderdo"))), rtv.firstAccused = !0, me.soEditorDom.replaceWith(me.soAccusedTemple($.extend(rtv, me.orderDo))), me.soToggleAddByCauseAction()) : me.soEditorDom.replaceWith(me.soAccusedTemple(rtv)), delete me.soEditorDom, me.trigger("successEditAccus")) : (me.element.append(me.soAccusedTemple(rtv)), me.soAccusedGuid++, me.soTriggerAccuseAddToggle(), me.trigger("successAddAccus")), me.soAddAccusedHide()
                    }
                }), me
            },
            soTriggerAccuseAddToggle: function() {
                var me = this,
                    maxAccused = me.get("maxAccused");
                me.soAccusedGuid >= maxAccused ? me.$(".JS-trigger-click-add").addClass("fn-btn-disabled") : me.$(".JS-trigger-click-add").removeClass("fn-btn-disabled")
            },
            soCheckHumenOrCompany: function(flag) {
                var me = this;
                return flag = "normal" === flag ? 0 : 1, me.soOrderForm.find(".JS-trigger-change-person").eq(flag).prop("checked", !0), me
            },
            soAddAccusedShow: function(title) {
                var me = this;
                return me.soAddAccusedTitle = title, me.soAddAccusedDialog.show(), me.soOrderForm.find('[type="text"]').val(""), me
            },
            soAddAccusedHide: function() {
                var me = this;
                return me.soAddAccusedDialog.hide(), me
            },
            soDeleteAccused: function(e) {
                var me = this;
                return e && Modal.confirm("提示", "确定要删除吗？", function() {
                    var node = me.closest(e.target, ".JS-target-accused");
                    me.http(me.get("deleteSuitEntity"), me.serialize(node), function(err, rtv, msg, con) {
                        err ? Modal.alert(0, err) : (node.remove(), me.soAccusedGuid--, me.soTriggerAccuseAddToggle(), me.trigger("successDeleteAccus"))
                    })
                }), me
            },
            soEditorAccused: function(e) {
                var me = this;
                if (e) {
                    var node = me.closest(e.target, ".JS-target-accused,.JS-target-first-accused");
                    me.isFirstAccuse = node.hasClass("JS-target-first-accused"), me.http(me.get("getSuitEntityDo"), me.serialize(node), function(err, rtv, msg, con) {
                        err ? Modal.alert(0, err) : (me.soResetSuatus(), me.soCheckHumenOrCompany(rtv.entityType), me.soAddAccusedShow("编辑被告"), rtv.birthday = me.formatData("yyyy-MM-dd", rtv.birthday), me.unSerialize(me.soOrderForm, resetDo(rtv)), "normal" === rtv.entityType ? me.soCompany.find('[type="text"]').val("") : me.soHumen.find('[type="text"]').val(""), me.soPersonChange(rtv.entityType), me.soCheckIsFirst(), me.soEditorDom = node)
                    })
                }
                return me
            },
            soCheckIsFirst: function() {
                var me = this;
                return me.isFirstAccuse ? (me.soOrderForm.find('[name="lassenSuitEntityDo.name"]').prop("readonly", !0), me.soOrderForm.find('[name="lassenSuitEntityDo.companyName"]').prop("readonly", !0), me.soOrderForm.find('[name="lassenSuitEntityDo.entityType"]').prop("disabled", !0)) : (me.soOrderForm.find('[name="lassenSuitEntityDo.name"]').prop("readonly", !1), me.soOrderForm.find('[name="lassenSuitEntityDo.companyName"]').prop("readonly", !1), me.soOrderForm.find('[name="lassenSuitEntityDo.entityType"]').prop("disabled", !1)), me
            },
            soPersonChange: function(status) {
                var me = this;
                return me.soResetSuatus(), "normal" === status ? (me.disabledFalse(me.soHumen), me.soHumen.removeClass("fn-hide")) : (me.disabledFalse(me.soCompany), me.soCompany.removeClass("fn-hide")), me
            },
            soResetSuatus: function() {
                var me = this;
                return me.validator.clearError(), me.disabledTrue(me.soHumen), me.soHumen.addClass("fn-hide"), me.disabledTrue(me.soCompany), me.soCompany.addClass("fn-hide"), me
            },
            soHideSomeInput: function() {
                var me = this,
                    form = me.soOrderForm;
                form.find('[type="text"]').each(function() {
                    hideSecretInput($(this))
                })
            },
            soShowSomeInput: function() {
                var me = this,
                    form = me.soOrderForm;
                form.find('[type="text"]').removeClass("fn-hide")
            }
        }),
        resetDoObj = {
            name: "姓名",
            gender: "性别",
            curAddress: "住址",
            mobile: "手机",
            email: "邮箱",
            idCard: "身份证号",
            nation: "民族",
            birthday: "出身年月",
            phone: "电话",
            companyName: "公司名",
            legalRepresent: "法人代表",
            contact: "联系人",
            companyAddress: "公司地址",
            job: "职位",
            mailAddress: "通讯地址",
            securityId: "securityId"
        };
    return EditAccus
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});