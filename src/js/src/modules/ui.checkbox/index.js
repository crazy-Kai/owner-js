/* 
* @Author: caoke
* @Date:   2014-12-27 17:02:24
* @Last Modified by:   caoke
* @Last Modified time: 2015-04-13 14:56:27
*/
define(function(require, exports, module) {

    var $ = require('$');
    var crystal = require('crystal');

    return crystal.moduleFactory({
        attrs: {
            model: null,
            stringValue: false,
            field: 'value'
        },
        events: {
            'change': '_onChange'
        },
        setup: function() {
            var me = this;
            me.render();
            var next = me.element.next();
            if (!next.is('s')) {
                me.element.after('<s></s>');
            }
        },
        _onRenderModel: function(model) {
            var me = this;
            var el = me.element;
            if (el.attr('type') === 'radio') {
                el.prop('checked', model[me.get('field')] == el.val());
            } else if (el.attr('type') === 'checkbox') {
                var truly = me.get('stringValue') ? 'true' : true;
                el.prop('checked', model[me.get('field')] === truly);
            }
        },
        _onChange: function() {
            var me = this;
            var el = me.element;
            var model = me.get('model');
            if (model) {
                if (el.attr('type') === 'radio') {
                    if (el.prop('checked')) {
                        model[me.get('field')] = el.val();
                    }
                } else if (el.attr('type') === 'checkbox') {
                    if (el.prop('checked')) {
                        model[me.get('field')] = me.get('stringValue') ? 'true' : true;
                    } else {
                        model[me.get('field')] = me.get('stringValue') ? 'false' : false;
                    }
                }
            }
        }
    });
});
