"use strict";
define("src/bus/suit/oppugn/evidenceOppugn/main-debug", ["bus/global/main-debug", "common/jquery-debug", "src/bus/suit/oppugn/evidenceOppugn/reply-debug", "common/myWidget-debug", "common/validator-debug", "model/ajax/main-debug", "model/upload/main-debug", "model/modal/main-debug", "common/dialog-debug", "common/tip-debug", "model/tab/main-debug", "model/countDown/main-debug", "model/perSearch/main-debug", "common/handlerbars-debug", "model/imgView/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        Reply = require("src/bus/suit/oppugn/evidenceOppugn/reply-debug"),
        Tab = require("model/tab/main-debug"),
        CountDown = require("model/countDown/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        PerSearch = require("model/perSearch/main-debug"),
        Handlerbars = require("common/handlerbars-debug"),
        ImgView = require("model/imgView/main-debug"),
        EvidenceOppugn = Reply.extend({
            clssName: "EvidenceOppugn",
            attrs: {
                element: "body"
            },
            events: {},
            initProps: function() {
                var me = this;
                EvidenceOppugn.superclass.initProps.call(me), me.evidenceOppugnNav = me.$("#evidenceOppugnNav");
                var offset = me.evidenceOppugnNav.offset() || {};
                me.tabTop = offset.top || 0, me.tabExp = new Tab({
                    element: "#evidenceOppugnMain",
                    mainIndex: 0
                }).on("chose", function(e, index, menu, list) {
                    if ($(window).trigger("scroll"), me.winScrollY() > me.tabTop && me.winScrollY(me.tabTop), 3 === index) me.perSearchExp.searchListAjax();
                    else {
                        var param = menu.data("param"),
                            template = me["template" + param.source] || Handlerbars.compile($(param.template).html());
                        me["template" + param.source] = template, new Ajax({
                            request: "/suit/evidenceOppugn/list.json",
                            autoSubmit: !0,
                            param: menu.data("param"),
                            paramName: "map",
                            onAjaxSuccess: function(rtv, msg, res) {
                                2 === index ? list.html(template(rtv)) : list.html(template(rtv[param.source]))
                            }
                        })
                    }
                }), me.perSearchExp = new PerSearch({
                    element: "#testimony",
                    autoStart: !1,
                    mapResponse: function(response) {
                        return response.retValue.EVIDENCE
                    },
                    map: function(data) {
                        return me.breakEachArr(data, function(val) {
                            if (val && val.value && val.value.uploadFileDos) {
                                var lastArr, arr = val.value.uploadFile = [];
                                me.breakEachArr(val.value.uploadFileDos, function(fileVal, key) {
                                    return key > 9 || (key % 5 === 0 && (lastArr = [], arr.push(lastArr)), void lastArr.push(fileVal))
                                })
                            }
                        }), data
                    }
                }), me.imgViewExp = new ImgView
            },
            setup: function() {
                var me = this;
                me.setCountDown(), me.delegateEvents(window, "scroll", function() {
                    me.winScrollY() > me.tabTop ? me.evidenceOppugnNav.addClass("go-nav-fix") : me.evidenceOppugnNav.removeClass("go-nav-fix")
                }), $(window).trigger("scroll")
            },
            destroy: function() {
                var me = this;
                me.tabExp.destroy(), me.imgViewExp.destroy(), EvidenceOppugn.superclass.destroy.call(me)
            },
            setCountDown: function() {
                var intervalID, me = this,
                    node = me.$(".JS-need-count-down"),
                    endTime = node.data("endTime"),
                    countDownExp = new CountDown({
                        target: endTime
                    });
                return intervalID = setInterval(function() {
                    var data = countDownExp.use();
                    return data ? void node.html(data.day + "天") : clearInterval(intervalID)
                }, 1e3), me
            }
        });
    module.exports = EvidenceOppugn
});
"use strict";
define("src/bus/suit/oppugn/evidenceOppugn/reply-debug", ["bus/global/main-debug", "common/jquery-debug", "common/myWidget-debug", "common/validator-debug", "model/ajax/main-debug", "model/upload/main-debug", "model/modal/main-debug", "common/dialog-debug", "common/tip-debug"], function(require, exports, module) {
    function useIsAgree(tables) {
        tables.each(function() {
            var table = $(this),
                flag = "y" === table.find('select[name="isAgree"]').val(),
                noAgree = table.find(".noAgree");
            noAgree[flag ? "addClass" : "removeClass"]("fn-hide"), MyWidget[flag ? "disabledTrue" : "disabledFalse"](noAgree)
        })
    }

    function setAjax(theDial, target) {
        var me = this;
        Modal.confirm("警告", "您确定要提交吗？提交后不可修改。", function() {
            new Ajax({
                request: me.get("evidenceOppugnSave"),
                paramName: "evidenceOppugnVos",
                autoSuccessAlert: !0,
                parseForm: theDial.contentElement,
                param: target.data("param"),
                paramParse: function(data) {
                    var evidenceOppugnVos = data.evidenceOppugnVos;
                    return delete data.evidenceOppugnVos, me.breakEachArr(evidenceOppugnVos, function(val) {
                        $.extend(val, data)
                    }), evidenceOppugnVos
                },
                autoSubmit: !0,
                onAjaxSuccess: function(rtv) {
                    var listBlock = target.closest(".JS-target-list-block");
                    theDial.hide(), listBlock.find(".JS-target-isanswer").html("您已回复"), target.next().remove(), target.remove(), listBlock.find(".JS-target-allanswer").html(rtv.allAnswerCount)
                }
            })
        })
    }

    function getView(e, btn, tpl) {
        var me = this,
            target = me.jQuery(e.target).closest(btn);
        new Ajax({
            request: me.get("evidenceOppugnGet"),
            autoSubmit: !0,
            param: target.data("param"),
            onAjaxSuccess: function(rtv, msg, req) {
                Dialog.showTemplate(tpl, rtv)
            }
        })
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        Validator = require("common/validator-debug"),
        Ajax = require("model/ajax/main-debug"),
        Upload = require("model/upload/main-debug"),
        Modal = require("model/modal/main-debug"),
        Dialog = require("common/dialog-debug"),
        Tip = require("common/tip-debug"),
        Reply = MyWidget.extend({
            clssName: "Reply",
            attrs: {
                evidenceOppugnSave: "/suit/evidenceOppugn/save.json",
                evidenceOppugnGet: "/suit/evidenceOppugn/get.json"
            },
            events: {
                "click .JS-trigger-click-reply": function(e) {
                    var me = this,
                        target = me.jQuery(e.target),
                        dialogExp = Dialog.showTemplate("#template-reply", {}, {
                            events: {
                                "click .JS-trigger-click-save": function() {
                                    Validator.oneExecute(dialogExp.contentElement) || setAjax.call(me, dialogExp, target)
                                },
                                'change select[name="isAgree"]': function(e) {
                                    useIsAgree(me.jQuery(e.target).closest(".JS-target-table"))
                                }
                            }
                        }).before("hide", function() {
                            uploadExp.destroy()
                        }),
                        uploadExp = new Upload({
                            trigger: dialogExp.$(".JS-need-upload"),
                            rule: "(.jpg|.jpeg|.png|.bmp)$",
                            ruleErrMsg: "请上传后缀是jpg,jpeg,png,bmp的图片",
                            accept: "image/jpg, image/jpeg, image/png, image/bmp"
                        });
                    useIsAgree(dialogExp.$(".JS-target-table"))
                },
                "click .JS-trigger-click-view": function(e) {
                    getView.call(this, e, ".JS-trigger-click-view", "#template-view")
                },
                "click .JS-trigger-click-evidence-reply": function(e) {
                    var me = this,
                        target = me.jQuery(e.target),
                        dialogExp = Dialog.showTemplate("#template-evidence-reply", {}, {
                            events: {
                                'change select[name="isAgree"]': function(e) {
                                    useIsAgree(me.jQuery(e.target).closest(".JS-target-table"))
                                },
                                "click .JS-trigger-click-save": function() {
                                    Validator.oneExecute(dialogExp.contentElement) || setAjax.call(me, dialogExp, target)
                                }
                            }
                        }).before("hide", function() {
                            Upload.remove(dialogExp.$(".JS-need-upload")), Tip.remove(dialogExp.$(".JS-need-tip"))
                        });
                    Upload.use(dialogExp.$(".JS-need-upload"), {
                        rule: "(.jpg|.jpeg|.png|.bmp)$",
                        ruleErrMsg: "请上传后缀是jpg,jpeg,png,bmp的图片",
                        accept: "image/jpg, image/jpeg, image/png, image/bmp"
                    }), Tip.use(dialogExp.$(".JS-need-tip"), {
                        zIndex: 9999,
                        arrowPosition: 9
                    }), useIsAgree(dialogExp.$(".JS-target-table"))
                },
                "click .JS-trigger-click-evidence-view": function(e) {
                    getView.call(this, e, ".JS-trigger-click-evidence-view", "#template-evidence-view")
                }
            },
            initProps: function() {},
            destroy: function() {
                var me = this;
                Reply.superclass.destroy.call(me)
            }
        });
    module.exports = Reply
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});