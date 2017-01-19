define("src/modules/ui.select/index-debug", ["select2-debug", "select2-debug.css", "crystal-debug"], function(require, exports, module) {
    require("select2-debug"), require("select2-debug.css");
    var crystal = require("crystal-debug"),
        MySelect = crystal.moduleFactory({
            attrs: {
                field: "value"
            },
            events: {
                change: "onChange"
            },
            setup: function() {
                var me = this;
                me.render(), me.element.select2({
                    width: me.element.outerWidth()
                })
            },
            _onRenderModel: function(model) {
                var me = this;
                me.element.val(model[me.get("field")]).trigger("change")
            },
            onChange: function() {
                var me = this,
                    model = me.get("model");
                model && (model[me.get("field")] = me.element.val())
            }
        });
    return MySelect
});