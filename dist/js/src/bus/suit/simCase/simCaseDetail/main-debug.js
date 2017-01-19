"use strict";
define("src/bus/suit/simCase/simCaseDetail/main-debug", ["common/delegate-debug", "src/bus/suit/simCase/common/feedback-debug", "src/bus/suit/simCase/common/main-debug", "common/jquery-debug", "model/placeHolder/main-debug", "common/myWidget-debug", "model/ajax/main-debug", "model/modal/main-debug", "common/validator-debug", "src/bus/suit/simCase/common/feedback-hbs-debug", "common/handlerbars-debug"], function(require, exports, module) {
    var Delegate = require("common/delegate-debug");
    new(require("src/bus/suit/simCase/common/feedback-debug")), Delegate.on("click", ".dialogLink", function(e) {
        $(".dialogLink").removeClass("fn-color-0073bf"), $(this).addClass("fn-color-0073bf"), $(".currentImg").hide(), $(".seconddialogImg").show(), $(this).parent().find(".seconddialogImg").hide(), $(this).parent().find(".currentImg").show()
    })
});
"use strict";
define("src/bus/suit/simCase/common/feedback-debug", ["src/bus/suit/simCase/common/main-debug", "common/jquery-debug", "model/placeHolder/main-debug", "common/delegate-debug", "common/myWidget-debug", "model/ajax/main-debug", "model/modal/main-debug", "common/validator-debug", "src/bus/suit/simCase/common/feedback-hbs-debug", "common/handlerbars-debug"], function(require, exports, module) {
    require("src/bus/suit/simCase/common/main-debug");
    var MyWidget = (require("common/jquery-debug"), require("common/myWidget-debug")),
        Ajax = require("model/ajax/main-debug"),
        Model = require("model/modal/main-debug"),
        PlaceHolder = require("model/placeHolder/main-debug"),
        Validator = (require("common/delegate-debug"), require("common/validator-debug")),
        feedbackHbs = require("src/bus/suit/simCase/common/feedback-hbs-debug"),
        Feedback = MyWidget.extend({
            clssName: "Feedback",
            attrs: {
                trigger: "#feedBack",
                template: feedbackHbs()
            },
            events: {
                'click [data-trigger="submit"]': function() {
                    var me = this;
                    me.validatorExp.execute(function(isErr) {
                        isErr || new Ajax({
                            request: "/suit/simCaseRpc/saveFeedback.json",
                            parseForm: me.element
                        }).on("ajaxSuccess", function() {
                            me.hide(), me.modelExp = Model.confirm("提示", "反馈内容发送成功.", null, null, {
                                noCancle: !0,
                                noSure: !0
                            }), window.setTimeout(function() {
                                me.modelExp.hide()
                            }, 3e3)
                        }).submit()
                    })
                },
                'click [data-trigger="cancal"]': function() {
                    var me = this;
                    me.hide()
                }
            },
            initProps: function() {},
            setup: function() {
                var me = this;
                me.delegateEvents(me.triggerNode, "click", function() {
                    me.show()
                }), me.render();
                var documentMode = document.documentMode;
                !documentMode || 8 !== documentMode && 9 !== documentMode || me.$("[placeholder]").each(function() {
                    new PlaceHolder({
                        element: this
                    })
                }), me.validatorExp = Validator.use(me.element, '[data-widget="validator"]')
            },
            show: function() {
                var me = this;
                me.element.removeClass("fn-hide")
            },
            hide: function() {
                var me = this,
                    form = me.$("form");
                form[0].reset(), me.element.addClass("fn-hide"), me.validatorExp.clearError()
            }
        });
    return Feedback
});
"use strict";
define("src/bus/suit/simCase/common/main-debug", ["common/jquery-debug", "model/placeHolder/main-debug", "common/delegate-debug"], function(require, exports, module) {
    function maxlength() {
        var self = $(this),
            length = self.attr("maxlength");
        setTimeout(function() {
            var val = self.val();
            val.length > length && self.val(val.slice(0, length)), self.trigger("realTime")
        }, 0)
    }
    var $ = require("common/jquery-debug"),
        PlaceHolder = require("model/placeHolder/main-debug"),
        delegate = require("common/delegate-debug"),
        documentMode = document.documentMode;
    !documentMode || 8 !== documentMode && 9 !== documentMode || (delegate.on("keydown", "[maxlength]", maxlength), delegate.on("paste", "[maxlength]", maxlength), $("[placeholder]").each(function() {
        new PlaceHolder({
            element: this
        })
    }))
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("src/bus/suit/simCase/common/feedback-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="feedback fn-hide">\t<div class="ch-content">\t\t<form action="" method="post" class="fn-MT40 fn-ML45" id="paraform" >\t\t\t<table class="fn-table  fn-table-input">\t\t\t\t<tr>\t\t\t\t\t<td width="70" align="right" class="fn-FS14 fn-WRH fn-LH30">您的邮箱：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<input type="text" name="feedEmail" class="fn-input-text fn-input-text-sm fn-W230 kuma-input" data-rule="email" data-errormessage-required="请填写邮箱。" maxlength="50" data-errormessage-email="请填写正确的邮箱。" data-widget="validator" placeholder="输入您的邮箱，以方便联系您">\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td class="fn-FS14 fn-WRH fn-LH36">反馈内容：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<textarea name="suggestion"  data-trim="true" class="fn-textarea kuma-input  fn-W230 fn-H80" placeholder="您想反馈的问题、意见和建议，这将是我们产品持续优化的方向" value="" maxlength="500" data-widget="validator" data-required="true" data-errormessage="请输入反馈内容。" maxlength="12000"></textarea>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td></td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type="button" class="fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-wrh" data-trigger="submit" value="发送">\t\t\t\t\t\t\t<input type="button" class="fn-ML10 fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-ddd fn-BoCo-ebebeb" data-trigger="cancal" value="取消">\t\t\t\t\t\t</div>\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t</table>\t\t</form>\t</div>\t<div class="ch-shadow"></div><div>');
    return compile.source = '<div class="feedback fn-hide">\t<div class="ch-content">\t\t<form action="" method="post" class="fn-MT40 fn-ML45" id="paraform" >\t\t\t<table class="fn-table  fn-table-input">\t\t\t\t<tr>\t\t\t\t\t<td width="70" align="right" class="fn-FS14 fn-WRH fn-LH30">您的邮箱：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<input type="text" name="feedEmail" class="fn-input-text fn-input-text-sm fn-W230 kuma-input" data-rule="email" data-errormessage-required="请填写邮箱。" maxlength="50" data-errormessage-email="请填写正确的邮箱。" data-widget="validator" placeholder="输入您的邮箱，以方便联系您">\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td class="fn-FS14 fn-WRH fn-LH36">反馈内容：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<textarea name="suggestion"  data-trim="true" class="fn-textarea kuma-input  fn-W230 fn-H80" placeholder="您想反馈的问题、意见和建议，这将是我们产品持续优化的方向" value="" maxlength="500" data-widget="validator" data-required="true" data-errormessage="请输入反馈内容。" maxlength="12000"></textarea>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td></td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type="button" class="fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-wrh" data-trigger="submit" value="发送">\t\t\t\t\t\t\t<input type="button" class="fn-ML10 fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-ddd fn-BoCo-ebebeb" data-trigger="cancal" value="取消">\t\t\t\t\t\t</div>\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t</table>\t\t</form>\t</div>\t<div class="ch-shadow"></div><div>', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});