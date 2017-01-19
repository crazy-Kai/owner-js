"use strict";
define("src/bus/court/preFilingCase/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/imgView/main-debug", "src/bus/court/preFilingCase/preFilingCaseBtn-debug", "model/ajax/main-debug", "model/modal/main-debug", "common/myWidget-debug", "src/bus/court/preFilingCase/preFilingCaseModal-debug", "common/dialog-debug", "model/multiple/main-debug", "common/validator-debug", "src/bus/court/preFilingCase/preFilingCaseModal-hbs-debug", "common/handlerbars-debug", "src/bus/court/preFilingCase/suspendedLayer-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var ImgView = (require("common/jquery-debug"), require("model/imgView/main-debug"));
    new ImgView, new(require("src/bus/court/preFilingCase/preFilingCaseBtn-debug")), new(require("src/bus/court/preFilingCase/suspendedLayer-debug"))({
        element: "#preFilingCaseBtn"
    })
});
"use strict";
define("src/bus/court/preFilingCase/preFilingCaseBtn-debug", ["common/jquery-debug", "model/ajax/main-debug", "model/modal/main-debug", "common/myWidget-debug", "src/bus/court/preFilingCase/preFilingCaseModal-debug", "common/dialog-debug", "model/multiple/main-debug", "common/validator-debug", "src/bus/court/preFilingCase/preFilingCaseModal-hbs-debug", "common/handlerbars-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        Ajax = require("model/ajax/main-debug"),
        Modal = require("model/modal/main-debug"),
        MyWidget = require("common/myWidget-debug"),
        PreFilingCaseBtn = MyWidget.extend({
            clssName: "PreFilingCaseBtn",
            attrs: {
                element: "#preFilingCaseBtn"
            },
            events: {
                'click [data-trigger="back"]': function() {
                    new(require("src/bus/court/preFilingCase/preFilingCaseModal-debug"))
                },
                'click [data-trigger="pass"]': function() {
                    Modal.confirm("提醒", "你确定要预立案通过吗？", function() {
                        new Ajax({
                            request: "/court/preFilingCaseRpc/savePreFilingCase.json",
                            autoSuccessAlert: !0,
                            param: {
                                securityCaseId: $('#pageParam [name="securityCaseId"]').val()
                            }
                        }).on("ajaxSuccess", function(rtv, msg, con) {
                            location.reload()
                        }).submit()
                    })
                }
            }
        });
    return PreFilingCaseBtn
});
"use strict";
define("src/bus/court/preFilingCase/preFilingCaseModal-debug", ["common/jquery-debug", "model/ajax/main-debug", "common/dialog-debug", "model/multiple/main-debug", "common/validator-debug", "common/myWidget-debug", "src/bus/court/preFilingCase/preFilingCaseModal-hbs-debug", "common/handlerbars-debug"], function(require, exports, module) {
    function initMultiple() {
        var me = this;
        return new Multiple({
            trigger: me.$("#multiple"),
            width: 420,
            data: [{
                key: "原告主体资格不符",
                value: "no_plaintiff_qualification"
            }, {
                key: "无明确的被告或被告主体资格不符",
                value: "no_defendant"
            }, {
                key: "无具体诉讼请求，事实和理由",
                value: "no_request"
            }, {
                key: "不属于民事诉讼范围",
                value: "no_range"
            }, {
                key: "不属于本院管辖",
                value: "no_mycourt"
            }, {
                key: "没有新的事实和证据重新起诉",
                value: "no_proof"
            }, {
                key: "依法在一定期限内不得起诉的案件",
                value: "no_sue"
            }, {
                key: "其他",
                value: "other"
            }]
        })
    }
    var $ = require("common/jquery-debug"),
        Ajax = require("model/ajax/main-debug"),
        Dialog = require("common/dialog-debug"),
        Multiple = require("model/multiple/main-debug"),
        Validator = require("common/validator-debug"),
        MyWidget = require("common/myWidget-debug"),
        preFilingCaseModal = MyWidget.extend({
            clssName: "preFilingCaseModal",
            attrs: {
                template: require("src/bus/court/preFilingCase/preFilingCaseModal-hbs-debug")()
            },
            events: {
                'click [data-role="return"]': function() {
                    var me = this;
                    me.validatorExp.removeItem(me.$('[name="remark"]'));
                    var reasonStr = me.$("[name='reason']").val();
                    reasonStr.indexOf("other") >= 0 && me.validatorExp.addItem({
                        element: me.$('[name="remark"]'),
                        required: !0
                    }), me.validatorExp.execute(function(err) {
                        err || new Ajax({
                            request: "/court/courtHandlerRpc/courtFile.json",
                            parseForm: me.element,
                            autoSuccessAlert: !0,
                            paramName: "lassenCourtFilingVo",
                            parseName: "lassenCourtFilingVo",
                            param: {
                                securityCaseId: $('input[name="securityCaseId"]').val()
                            }
                        }).on("ajaxSuccess", function() {
                            location.reload(), me.diaExp.hide(), me.destroy()
                        }).submit()
                    })
                }
            },
            setup: function() {
                var me = this;
                me.diaExp = Dialog.show(me.element, {
                    width: 500
                }), me.multipleExp = initMultiple.call(me), me.validatorExp = Validator.use(me.element)
            },
            destroy: function() {
                var me = this;
                me.multipleExp.destroy(), me.validatorExp.destroy(), preFilingCaseModal.superclass.destroy.call(me)
            }
        });
    return preFilingCaseModal
});
define("src/bus/court/preFilingCase/preFilingCaseModal-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-PaAl15 fn-color-666" data-filter="lassenCourtFilingVo">\t<div class="global-tab fn-BBS-ebebeb"> <i></i>请选择退回原因</div>\t<table width="100%" class="fn-table fn-table-input fn-table-input-sm fn-MT20 fn-LH25">\t\t<tr>\t\t\t<td align="right" width="80" class="fn-LH30"><span class="global-require fn-VA1D">*</span>退回原因：</td>\t\t\t<td>\t\t\t\t<div class="kuma-form-item">                    <input type="text" class="fn-input-text fn-input-text-sm fn-W360 kuma-input JS-target-required" id="multiple" data-input-name="reason" readonly="readonly" data-required="true" data-errormessage="请选择原因" />                    <input type="hidden" name="reason"  value="$!lassenCourtFilingVo.reason"/>                </div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td align="right">备注：</td>\t\t\t<td>\t\t\t\t<div class="fn-MR20 kuma-form-item">\t\t\t\t\t<textarea rows="3" name="remark" class="fn-textarea fn-W100P kuma-input" data-required="true" maxlength="400" data-errormessage="请填写备注"></textarea>\t\t\t\t\t<input type="hidden" name="conclusion" value="return">\t\t\t\t\t<input type="hidden" name="isPreFiling" value="y">\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td colspan="2">\t\t\t\t<div class="fn-ML80">\t\t\t\t\t<button class="fn-btn fn-btn-sm fn-btn-primary fn-W80" data-role="return" type="button">确认退回</button>\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t</table>    \t</div>');
    return compile.source = '<div class="fn-PaAl15 fn-color-666" data-filter="lassenCourtFilingVo">\t<div class="global-tab fn-BBS-ebebeb"> <i></i>请选择退回原因</div>\t<table width="100%" class="fn-table fn-table-input fn-table-input-sm fn-MT20 fn-LH25">\t\t<tr>\t\t\t<td align="right" width="80" class="fn-LH30"><span class="global-require fn-VA1D">*</span>退回原因：</td>\t\t\t<td>\t\t\t\t<div class="kuma-form-item">                    <input type="text" class="fn-input-text fn-input-text-sm fn-W360 kuma-input JS-target-required" id="multiple" data-input-name="reason" readonly="readonly" data-required="true" data-errormessage="请选择原因" />                    <input type="hidden" name="reason"  value="$!lassenCourtFilingVo.reason"/>                </div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td align="right">备注：</td>\t\t\t<td>\t\t\t\t<div class="fn-MR20 kuma-form-item">\t\t\t\t\t<textarea rows="3" name="remark" class="fn-textarea fn-W100P kuma-input" data-required="true" maxlength="400" data-errormessage="请填写备注"></textarea>\t\t\t\t\t<input type="hidden" name="conclusion" value="return">\t\t\t\t\t<input type="hidden" name="isPreFiling" value="y">\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td colspan="2">\t\t\t\t<div class="fn-ML80">\t\t\t\t\t<button class="fn-btn fn-btn-sm fn-btn-primary fn-W80" data-role="return" type="button">确认退回</button>\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t</table>    \t</div>', compile
});
"use strict";
define("src/bus/court/preFilingCase/suspendedLayer-debug", ["common/jquery-debug", "common/myWidget-debug", "model/modal/main-debug"], function(require, exports, module) {
    function stations() {
        var me = this,
            warp = $(document.createElement("div"));
        return me.element.before(warp), warp.append(me.element), warp.css({
            overflow: "hidden"
        }), warp.height(warp.height()), warp
    }

    function fixed() {
        var warp = $(document.createElement("div")),
            mark = $(document.createElement("div"));
        return warp.append(mark), $("body").append(warp), warp.css({
            position: "fixed",
            width: "100%",
            right: "0",
            bottom: "0",
            "padding-bottom": "20px",
            "z-index": "999"
        }), mark.css({
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: .5,
            background: "#000",
            top: "0"
        }), warp
    }

    function scroll(statWarp, fixedWarp) {
        var me = this,
            scrollY = me.winScrollY();
        scrollY <= statWarp.offset().top - me.winInnerHeight() + 74 ? (fixedWarp.append(me.element).show(), me.element.addClass("lc-PaLeCal")) : (fixedWarp.hide(), statWarp.append(me.element), me.element.removeClass("lc-PaLeCal"))
    }
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        SuspendedLayer = (require("model/modal/main-debug"), MyWidget.extend({
            clssName: "SuspendedLayer",
            attrs: {},
            events: {},
            initProps: function() {},
            setup: function() {
                var me = this,
                    statWarp = stations.call(me),
                    fixedWarp = fixed.call(me);
                me.element.css({
                    position: "relative",
                    "z-index": "2"
                }), me.delegateEvents(window, "scroll", function() {
                    scroll.call(me, statWarp, fixedWarp)
                }), scroll.call(me, statWarp, fixedWarp)
            }
        }));
    return SuspendedLayer
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});