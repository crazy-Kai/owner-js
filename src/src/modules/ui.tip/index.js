/* 
* @Author: caoke
* @Date:   2015-01-04 15:13:25
* @Last Modified by:   caoke
* @Last Modified time: 2015-04-13 15:02:48
*/
define(function(require, exports, module) {

    var $ = require('$');
    var crystal = require('crystal');
    var Tip = require('tip');

    var TipTrigger = crystal.moduleFactory({
        attrs: {
            content: '',
            maxWidth: 270,
            html: false
        },
        setup: function() {
            var me = this;
            me.render();
            me._initTip(me.get('content') || '');
        },
        destroy: function() {
            var me = this;
            me.tip && me.tip.destroy();
            TipTrigger.superclass.destroy.call(me);
        },
        _initTip: function(content) {
            content = content + '';
            var me = this;
            var style = {};
            if (me.get('maxWidth')) {
                style.maxWidth = me.get('maxWidth');
            }
            if (!me.get('html')) {
                content = content.replace(/(\r\n)|\r|\n/g, '<br>').replace(/[ \t]/g, '&nbsp;');
            }
            me.tip = new Tip({
                trigger: me.element,
                content: content,
                arrowPosition: '6',
                theme: 'yellow',
                inViewport: true,
                style: style,
                zIndex: 600
            });
        }
    });

    return TipTrigger;
});
