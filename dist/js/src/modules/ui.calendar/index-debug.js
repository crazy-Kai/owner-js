define("src/modules/ui.calendar/index-debug", ["calendar-debug.css", "calendar-debug", "crystal-debug"], function(require, exports, module) {
    require("calendar-debug.css");
    var Calendar = require("calendar-debug"),
        crystal = require("crystal-debug"),
        Module = crystal.moduleFactory({
            attrs: {
                field: "value"
            },
            events: {
                change: "onChange"
            },
            setup: function() {
                var me = this;
                me.render(), me._caneldar = new Calendar({
                    trigger: me.element
                })
            },
            _onRenderModel: function(model) {
                var me = this;
                me.element.val(model[me.get("field")])
            },
            onChange: function() {
                var me = this,
                    model = me.get("model");
                model && (model[me.get("field")] = me.element.val())
            },
            destroy: function() {
                me._caneldar.destroy(), me._caneldar = null, Module.superclass.destroy.call(this)
            }
        });
    return Module
});