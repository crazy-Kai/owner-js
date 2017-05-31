"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    var $ = require('$'),
        PlaceHolder = require('model/placeHolder/main'),
        delegate = require('common/delegate');

        
    //函数：最大长度
    function maxlength(){
        var self = $(this),
            length = self.attr('maxlength');
        setTimeout(function(){
            var val = self.val();
            if( val.length > length ){
                self.val( val.slice(0, length) );
            }
            //IE9下触发一下input校准
            self.trigger('realTime');
        }, 0);
    }


    //事件：IE8，IE9下输入框对maxlength的兼容性处理
    var documentMode = document.documentMode;
    if( documentMode && (documentMode === 8 || documentMode === 9) ){
        //keypress的触发点，比较弱。
        delegate.on('keydown', '[maxlength]', maxlength);
        delegate.on('paste', '[maxlength]', maxlength);
        //组件：占位符
        $('[placeholder]').each(function() {
            new PlaceHolder({ element: this });
        });
    };


});
