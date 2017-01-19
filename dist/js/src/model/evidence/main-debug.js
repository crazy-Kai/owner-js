"use strict";
define("src/model/evidence/main-debug", ["common/myWidget-debug", "common/validator-debug", "alinw/dialog/2.0.6/dialog-debug", "model/upload/main-debug", "model/modal/main-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        Validator = require("common/validator-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Upload = require("model/upload/main-debug"),
        Modal = require("model/modal/main-debug"),
        $ = MyWidget.jQuery,
        handlerbars = MyWidget.handlerbars,
        Evidence = MyWidget.extend({
            clssName: "Evidence",
            attrs: {
                dialogForm: ".JS-target-form",
                dataTemple: ".JS-target-temple",
                dataContent: ".JS-target-content",
                pageParam: "#pageParam",
                rpcSaveOrUpdate: "/suit/suitEvidence/saveOrUpdate.json",
                rpcSaveOrUpdateName: "suitEvidenceDTo",
                rpcList: "/suit/suitEvidence/list.json",
                rpcListName: "paraMap",
                rpcDelete: "/suit/suitEvidence/delete.json",
                rpcDeleteName: "paraMap",
                rpcQuery: "/suit/suitEvidence/query.json",
                rpcQueryName: "paraMap"
            },
            events: {
                "click .JS-trigger-click-editor": "evidenceEditor",
                "click .JS-trigger-click-add": "evidenceAdd",
                "click .JS-trigger-click-delete": "evidenceDel"
            },
            initProps: function() {
                var me = this;
                me.pageParam = me.serialize($(me.get("pageParam"))), me.selectLawForm = me.$(me.get("dialogForm")), me.selectLawDialog = new Dialog({
                    width: 420,
                    content: me.selectLawForm,
                    events: {
                        "click .JS-trigger-click-submit": function() {
                            me.validator.execute(function(flag, err) {
                                flag ? me.log(err) : me.evidenceSubmit()
                            })
                        }
                    }
                }).render(), me.selectLawDialog.after("hide", function() {
                    me.evidenceClearForm()
                }), me.selectLawUpload = new Upload({
                    trigger: me.selectLawDialog.$(".JS-target-upload")
                }), me.validator = Validator.use(me.selectLawForm), me.selectLawTemple = handlerbars.compile(me.$(me.get("dataTemple")).html()), me.selectLawContent = me.$(me.get("dataContent"))
            },
            setup: function() {
                var me = this;
                me.evidenceDataRender()
            },
            evidenceAdd: function(e) {
                var me = this;
                return me.evidenceDialogShow(me.closest(e.target, ".JS-trigger-click-add").prop("title")), me
            },
            evidenceEditor: function(e) {
                var me = this,
                    target = $(e.target);
                return me.http(me.get("rpcQuery"), me.paseParam(me.get("rpcQueryName"), target.data("param")), function(err, rtv, msg, con) {
                    err ? Modal.alert(0, err) : (me.unSerialize(me.selectLawForm, rtv), me.selectLawUpload.set("list", $.map(rtv.uploadFileDos, function(val, key) {
                        return {
                            name: val.fileName,
                            id: val.securityId,
                            url: val.url
                        }
                    })), me.selectLawUpload.uploadRenderList(), me.evidenceDialogShow(target.prop("title")))
                }), me
            },
            evidenceDel: function(e) {
                var me = this,
                    target = $(e.target);
                return Modal.confirm("提示", "确认要删除吗？", function() {
                    me.http(me.get("rpcDelete"), me.paseParam(me.get("rpcDeleteName"), target.data("param")), function(err, rtv, msg, con) {
                        err ? Modal.alert(0, err) : (Modal.alert(1, msg), me.evidenceDataRender())
                    })
                }), me
            },
            evidenceDialogShow: function(title) {
                var me = this;
                return me.selectLawDialog.$(".JS-target-title").html(title || ""), me.selectLawDialog.show(), me
            },
            evidenceDialogHide: function(title) {
                var me = this;
                return me.selectLawDialog.hide(), me
            },
            evidenceSubmit: function() {
                var me = this;
                return me.http(me.get("rpcSaveOrUpdate"), me.paseParam(me.get("rpcSaveOrUpdateName"), $.extend(me.pageParam, me.serialize(me.selectLawForm))), "post", function(err, rtv, msg, cont) {
                    err ? Modal.alert(0, err) : (Modal.alert(1, msg), me.evidenceDialogHide(), me.evidenceDataRender())
                }), me
            },
            evidenceDataRender: function() {
                var me = this;
                me.ajax(me.get("rpcList"), me.paseParam(me.get("rpcListName"), me.pageParam), "post", function(err, cont) {
                    err ? Modal.alert(0, err) : (me.get("pageStatus") && (cont.pageStatus = "suit"), me.selectLawContent.html(me.selectLawTemple(cont)))
                })
            },
            evidenceClearForm: function() {
                var me = this;
                return me.selectLawForm.find(".JS-target-input").val(""), me.selectLawUpload.uploadRenderClear(), me
            }
        });
    return Evidence
});