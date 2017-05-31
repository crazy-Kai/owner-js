/* 
* @Author: caoke
* @Date:   2014-12-21 00:38:23
* @Last Modified by:   caoke
* @Last Modified time: 2015-04-13 15:01:57
*/

define(function(require, exports, module) {
    require('calendar.css');
    var Calendar = require('calendar');
    var crystal = require('crystal');

    var Module = crystal.moduleFactory({
        attrs: {
            field: 'value'
        },
        events: {
            'change': 'onChange'
        },
        setup: function() {
            var me = this;
            me.render();
            me._caneldar = new Calendar({
                trigger: me.element
            });
        },
        _onRenderModel: function(model) {
            var me = this;
            me.element.val(model[me.get('field')]);
        },
        onChange: function() {
            var me = this;
            var model = me.get('model');
            if (model) {
                model[me.get('field')] = me.element.val();
            }
        },
        destroy: function() {
            me._caneldar.destroy();
            me._caneldar = null;
            Module.superclass.destroy.call(this);
        }
    });

    return Module;
});