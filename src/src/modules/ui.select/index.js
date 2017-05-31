/* 
* @Author: caoke
* @Date:   2014-12-21 00:38:23
* @Last Modified by:   caoke
* @Last Modified time: 2015-04-13 16:19:58
*/

define(function(require, exports, module) {
    require('select2');
    require('select2.css');
    var crystal = require('crystal');

    var MySelect = crystal.moduleFactory({
        attrs: {
            field: 'value'
        },
        events: {
            'change': 'onChange'
        },
        setup: function() {
            var me = this;
            me.render();
            me.element.select2({
                width: me.element.outerWidth()
            });
        },
        _onRenderModel: function(model) {
            var me = this;
            me.element.val(model[me.get('field')]).trigger('change');
        },
        onChange: function() {
            var me = this;
            var model = me.get('model');
            if (model) {
                model[me.get('field')] = me.element.val();
            }
        }
    });

    return MySelect;
});