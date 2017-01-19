"use strict";
define("src/model/mediationMessage/main-debug", ["common/jquery-debug", "common/myWidget-debug", "model/modal/main-debug", "model/ajax/main-debug", "common/validator-debug", "common/scroller-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        Modal = require("model/modal/main-debug"),
        Ajax = require("model/ajax/main-debug"),
        Validator = require("common/validator-debug"),
        Scroller = require("common/scroller-debug"),
        handlerbars = MyWidget.handlerbars,
        mmMessageTemple = handlerbars.compile(["<tr>", '<td width="65" valign="top">', '<span class="fn-left fn-W50 fn-TAC fn-color-FFF fn-BGC-999">', "{{curUser}}", "</span>", "</td>", "<td>", "{{content}}", "</td>", '<td width="120" align="right" valign="bottom">', '{{formatData "yyyy/MM/dd HH:mm" gmtCreate}}', "</td>", "</tr>"].join("")),
        MediationMessage = MyWidget.extend({
            clssName: "MediationMessage",
            attrs: {
                request: "/suit/suitMediation/save.json",
                pageParam: "#page-param"
            },
            events: {
                "click .JS-trigger-click-publish": function() {
                    return this.mmPuhlishMessage()
                }
            },
            initProps: function() {
                var me = this;
                return me.mmMessageTable = me.$(".JS-target-message-table"), me.pageParam = me.jQuery(me.get("pageParam")), me.mmTextarea = me.$(".JS-target-textarea"), me.mmScroller = new Scroller({
                    trigger: me.$(".JS-need-scroller")
                }), me.mmVal = Validator.use(me.element), me
            },
            setup: function() {},
            mmPuhlishMessage: function() {
                var me = this,
                    ele = me.element.find('[name="mediationRecordDo.content"]');
                return /^[\s]+$/.test(ele.val()) && ele.val(""), me.mmVal.execute(function(isErr, errList) {
                    isErr ? me.log(errList) : Modal.confirm("提示", "您确定要提交吗？", function() {
                        new Ajax({
                            request: me.get("request"),
                            element: me.element,
                            paramName: "paramMap",
                            autoSubmit: !0,
                            onAjaxSuccess: function(rtv, msg, res) {
                                me.mmMessageWrite(rtv), me.mmClearTextarea()
                            }
                        })
                    })
                }), me
            },
            mmMessageWrite: function(json) {
                var me = this;
                return me.mmMessageTable.prepend(mmMessageTemple($.extend(json, me.serialize(me.pageParam)))), me.mmScroller.reset(), me.redraw(me.mmMessageTable), me.mmTextarea.focus(), me
            },
            mmClearTextarea: function() {
                var me = this;
                return me.mmTextarea.val(""), me
            }
        });
    return MediationMessage
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});