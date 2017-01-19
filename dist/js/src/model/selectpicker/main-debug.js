"use strict";
define("src/model/selectpicker/main-debug", ["common/myWidget-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        Selectpicker = MyWidget.extend({
            clssName: "Selectpicker",
            attrs: {
                noneSelectedText: "请选择",
                selectpickerInitChange: !0
            },
            events: {},
            initProps: function() {
                var me = this;
                me.multiple = !!me.element.prop("multiple")
            },
            setup: function() {
                var me = this;
                me.element.selectpicker({
                    noneSelectedText: me.get("noneSelectedText")
                }), me.element.prop("multiple") && me.selectpickerShadow(), me.selectpickerChange()
            },
            destroy: function() {
                var me = this;
                me.element.data("selectpicker").destroy(), Selectpicker.superclass.destroy.call(me)
            },
            selectpickerModel: function(list) {
                var me = this,
                    node = me.element[0];
                return node.length = 0, me.breakEachArr(list, function(val, key) {
                    var option = new Option(val.key, val.value, (!!val.selected), (!!val.selected));
                    option.disabled = !!val.disabled, node.add(option)
                }), me.element.data("selectpicker").refresh(), me.selectpickerWirteValue(), me
            },
            selectpickerShadow: function() {
                var me = this,
                    input = document.createElement("input");
                return input.name = me.element.prop("name"), input.type = "hidden", me.element.after(input), me.selectpickerShadowNode = input, me
            },
            selectpickerChange: function() {
                var me = this;
                return me.element.on("change", function() {
                    me.selectpickerWirteValue(), me.trigger("change", me.selectpickerValue())
                }), me.get("selectpickerInitChange") && me.element.trigger("change"), me.selectpickerWirteValue(), me
            },
            selectpickerValue: function() {
                var me = this,
                    arr = [],
                    element = me.element;
                return me.multiple ? (me.breakEachArr(element[0], function(val) {
                    val.selected && arr.push(val.value)
                }), arr) : element.val()
            },
            selectpickerWirteValue: function() {
                var me = this;
                return me.multiple && (me.selectpickerShadowNode.value = me.selectpickerValue().join(",")), me
            }
        });
    return Selectpicker
});