"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        util = require('common/util'),
        MyWidget = require('common/myWidget');

    //类
    var PostMessage = MyWidget.extend({
        //组件：类名
        clssName: 'PostMessage',
        //组件：属性
        attrs: {
            win: window.top,
            domail: '*'
        },
        //组件：事件
        events: {

        },
        //组件：初始化数据
        initProps: function() {

        },
        //组件：页面操作入口
        setup: function() {
            var me = this;
            $(window).on('message', function(e){
                me.trigger('message', JSON.parse(e.originalEvent.data));
            });
        },
        // 增加监听事件
        add: function(callback){
            var me = this;
            me.on('message', callback);
        },
        // 
        post: function(obj, win){
            var me = this;
            win = win || me.get('win');
            win.postMessage(JSON.stringify(obj), me.get('domail'));
        },
        destroy: function() {
            var me = this;
            $(window).off('message');
            PostMessage.superclass.destroy.call(this);
        }
    })


    return PostMessage

});
