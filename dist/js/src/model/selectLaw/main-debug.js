"use strict";
define("src/model/selectLaw/main-debug", ["common/myWidget-debug", "alinw/dialog/2.0.6/dialog-debug", "model/tab/main-debug", "common/scroller-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        Dialog = require("alinw/dialog/2.0.6/dialog-debug"),
        Tab = require("model/tab/main-debug"),
        Scroller = require("common/scroller-debug"),
        handlerbars = (MyWidget.jQuery, MyWidget.handlerbars),
        Selectlaw = MyWidget.extend({
            clssName: "Selectlaw",
            attrs: {
                selectLawContent: ".JS-target-content",
                selectLawTemple: ".JS-target-temple",
                selectLawIntro: ".JS-target-intro"
            },
            events: {
                "click .JS-trigger-click-select": "selectLawShow"
            },
            initProps: function() {
                var selectLawDialog, selectLawContent, selectLawTemple, selectLawIntro, me = this;
                selectLawTemple = me.selectLawTemple = handlerbars.compile(me.$(me.get("selectLawTemple")).html()), selectLawIntro = me.selectLawIntro = me.$(me.get("selectLawIntro")), selectLawContent = me.selectLawContent = me.$(me.get("selectLawContent")), selectLawDialog = me.selectLawDialog = new Dialog({
                    width: 880,
                    height: 400,
                    closeTpl: "",
                    content: selectLawContent,
                    events: {
                        "click .JS-trigger-click-cancel": function() {
                            me.selectLawHide()
                        },
                        "click .JS-trigger-click-sure": function() {
                            me.selectLawHide(), me.selectLawDoParse()
                        }
                    }
                }).render(), me.selectLawTab = new Tab({
                    element: selectLawDialog.contentElement
                }), me.selectLawScroll = new Scroller({
                    trigger: selectLawIntro
                })
            },
            setup: function() {},
            destroy: function() {
                var me = this;
                me.selectLawDialog.destroy(), me.selectLawTab.destroy(), Selectlaw.superclass.destroy.call(this)
            },
            selectLawShow: function() {
                var me = this,
                    selectLawDialog = me.selectLawDialog;
                selectLawDialog.show()
            },
            selectLawHide: function() {
                var me = this,
                    selectLawDialog = me.selectLawDialog;
                selectLawDialog.hide()
            },
            selectLawDoParse: function() {
                var me = this,
                    data = me.serialize(me.selectLawContent),
                    id = [];
                return me.breakEachObj(data, function(val, key) {
                    var arr = data[key] = [];
                    me.breakEachArr(val.split(","), function(val, index) {
                        index % 3 !== 2 ? arr.push(val) : id.push(val)
                    })
                }), me.selectLawScroll.setContent(me.selectLawTemple({
                    data: data,
                    id: id.join(",")
                })), me.$('[name="basisContent"]').val(me.$('[name="basisContent-shadow"]').val()), me
            },
            selectLawReset: function() {
                var me = this;
                return me.selectLawScroll.setContent(""), me.selectLawContent.find('[type="checkbox"]').prop("checked", !1), me
            }
        });
    return Selectlaw
});