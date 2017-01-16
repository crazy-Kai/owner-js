"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        MyWidget = require('common/myWidget');

    //类
    var Timer = MyWidget.extend({
        //组件：类名
        clssName: 'Timer',
        //组件：属性
        attrs: {
            time: 30
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
            me.countDown();
        },
        countDown: function() {
            var me = this,
                timeoutId,
                time = me.get('time'),
                //gitTime()方法得到的是毫秒数
                now = new Date().getTime();
 			//此定时器是为了让时间从最初的时间开始显示
            setTimeout(function() {
                me.trigger('progress', time);
            }, 0);
            // 开始计时
            me.timeoutId = setInterval(function() {
                var key = time - Math.floor((new Date().getTime() - now) / 1000);
                // 倒计时结束时要做的事情
                if (key < 0) {
                    clearInterval(me.timeoutId);
                    me.trigger('end');
                } else {
                    //倒计时过程中要做的事情
                    me.trigger('progress', key);
                };
            }, 1000);
        },
        destroy: function() {
            var me = this;
            clearInterval(me.timeoutId);
        }
    })


    return Timer

});
