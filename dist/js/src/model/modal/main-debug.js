"use strict";
define("src/model/modal/main-debug", ["common/myWidget-debug", "alinw/dialog/2.0.6/dialog-debug", "common/jquery-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        $ = require("common/jquery-debug"),
        handlerbars = MyWidget.handlerbars,
        bootstrap = !!CONFIG.bootstrap,
        template = {
            alert: ['<div class="modal fade"  tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">', '<div class="modal-dialog">', '<div class="modal-content">', '<div class="modal-header">', '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>', '<h4 class="modal-title">标题</h4>', "</div>", '<div class="modal-body">', "内容", "</div>", '<div class="modal-footer">', '<button type="button" class="btn btn-default btn-sm" data-dismiss="modal">确定</button>', "</div>", "</div>", "</div>", "</div>"].join(""),
            confirm: ['<div class="modal fade"  tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">', '<div class="modal-dialog">', '<div class="modal-content">', '<div class="modal-header">', '<button type="button" class="close JS-trigger-click-cancel" aria-label="Close"><span aria-hidden="true">&times;</span></button>', '<h4 class="modal-title">标题</h4>', "</div>", '<div class="modal-body">', "内容", "</div>", '<div class="modal-footer">', '<button type="button" class="btn btn-default btn-sm JS-trigger-click-sure">确定</button>', '<button type="button" class="btn btn-default btn-sm JS-trigger-click-cancel">取消</button>', "</div>", "</div>", "</div>", "</div>"].join(""),
            dialogAlert: handlerbars.compile(['<div class="modal-body">', '<i class="modal-icon {{#isEqual status 0}}modal-icon-error{{/isEqual}}{{#isEqual status 1}}modal-icon-success{{/isEqual}}"></i>{{{content}}}', "</div>"].join("")),
            dialogConfirm: handlerbars.compile(['<div class="modal-confirm-body">', '<div class="child-title fn-word-wrap"><i class="modal-icon modal-icon-warning"></i>{{title}}</div>', '<div class="child-content fn-MT10 fn-word-wrap">{{{content}}}</div>', '<div class=" fn-MT15 fn-TAC fn-MR10">', '{{#if noSure}}<button type="button" class="fn-btn fn-btn-primary fn-btn-sm {{sureBtnOpts/className}} JS-trigger-click-sure">{{sureBtnOpts/text}}</button>{{/if}}', '{{#if noCancle}}<button type="button" class="fn-btn fn-btn-default fn-btn-sm fn-W60 fn-ML10 JS-trigger-click-cancel">取 消</button>{{/if}}', "</div>", "</div>"].join(""))
        },
        Modal = MyWidget.extend({
            clssName: "Modal",
            attrs: {
                status: ["失败", "成功"]
            },
            events: {},
            initProps: function() {},
            setup: function() {},
            Statics: {
                alert: function(status, content, callback) {
                    var modal, me = this;
                    bootstrap ? (modal = new me({
                        template: template.alert
                    }).render(), modal.element.modal().on("hidden.bs.modal", function() {
                        modal.destroy(), callback && callback()
                    }), modal.$(".modal-title").html(modal.get("status")[status] || status), modal.$(".modal-body").html(content)) : (status = ~~status, content = content || (status ? "操作成功" : "操作失败"), modal = new Dialog({
                        content: template.dialogAlert({
                            content: content,
                            status: ~~status
                        }),
                        width: "auto",
                        height: "auto",
                        closeTpl: ""
                    }).after("hide", function() {
                        this.destroy(), callback && callback()
                    }).show(), setTimeout(function() {
                        modal.hide()
                    }, 3e3))
                },
                confirm: function(title, content, sure, cancel, option) {
                    option = option || {};
                    var modal, me = this;
                    return bootstrap ? (modal = new me({
                        template: template.confirm,
                        events: {
                            "click .JS-trigger-click-sure": function() {
                                sure && sure(), modal.element.modal("hide")
                            },
                            "click .JS-trigger-click-cancel": function() {
                                cancel && cancel(), modal.element.modal("hide")
                            }
                        }
                    }).render(), modal.element.modal(), modal.$(".modal-title").html(title), modal.$(".modal-body").html(content)) : modal = new Dialog($.extend({
                        content: template.dialogConfirm({
                            title: title,
                            content: content,
                            noCancle: !option.noCancle,
                            noSure: !option.noSure,
                            sureBtnOpts: option.sureBtnText ? {
                                className: "",
                                text: option.sureBtnText
                            } : {
                                className: "fn-W60",
                                text: "确 定"
                            }
                        }),
                        width: 350,
                        height: "auto",
                        events: {
                            "click .JS-trigger-click-sure": function() {
                                sure && sure(), this.hide()
                            },
                            "click .JS-trigger-click-cancel": function() {
                                cancel && cancel(), this.hide()
                            },
                            'click [data-role="close"]': function() {
                                cancel && cancel()
                            }
                        }
                    }, option)).after("hide", function() {
                        this.destroy()
                    }).show(), modal
                },
                show: function(content, config) {
                    return new Dialog($.extend({
                        content: content,
                        width: "auto",
                        height: "auto"
                    }, config)).after("hide", function() {
                        this.destroy()
                    }).show()
                }
            }
        });
    return Modal
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});