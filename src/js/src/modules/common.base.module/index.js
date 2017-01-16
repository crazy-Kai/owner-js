/* 
* @Author: caoke
* @Date:   2015-01-28 15:09:34
* @Last Modified by:   caoke
* @Last Modified time: 2015-05-22 14:56:26
*/
define(function(require, exports, module) {

    var $ = require('$');
    var crystal = require('crystal');
    var autoRender = crystal.autoRender;
    var app = crystal.app;
    var helpers = require('../common.helpers/index');

    return crystal.moduleFactory({
        attrs: {
            tpl: null,
            helpers: {}
        },
        setup: function() {
            var me = this;
            me.render();
            me.fetch();
        },

        fetch: function() {
        },

        // 返回渲染用的模型，跟实际模型区分
        renderModel: function(model) {
            var me = this;
            return {
                data: model
            };
        },

        _onRenderModel: function(model) {
            var me = this;
            var tpl = me.get('tpl');
            var renderModel = me.renderModel(model);
            autoRender.html(me.element, tpl(renderModel, {
                helpers: $.extend({}, helpers, me.get('helpers'))
            }), function(elements) {
                autoRender.bindSubModel(elements, model);
                setTimeout(function() {
                    me.trigger('render');
                }, 0);
            });
        }
    });
});
