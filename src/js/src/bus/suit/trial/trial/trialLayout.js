"use strict";
/**
 * 庭审布局
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        limit = require('common/limit'),
        MyWidget = require('common/myWidget'),
        trialTool = require('./trialTool'),
        trialConstant = require('./trialConstant'),
        tinymceUse = require('common/tinymce');

    // 模板
    var trialHbs = require('./trial-hbs');

    //类
    var TrialLayout = MyWidget.extend({
        //组件：类名
        clssName: 'TrialLayout',
        //组件：属性
        attrs: {
            replaceNode: $('.lc-center-wrap'),
            store: {
                pageLink: [{key: 'indictment', value: '起诉状'}, {key: 'defence', value: '答辩状'}, {key: 'evidence', value: '证据'}, {key: 'evidenceOppugnDetail', value: '质证'}]
            },
            template: {
                getter: function(){
                    return trialHbs( $.extend( {layoutConfig: trialTool.getComputeLayout()}, this.get('data'), this.get('store'), trialConstant ) );
                }
            }  
        },
        //组件：事件
        events: {

        },
        //组件：初始化数据
        initProps: function(){

        },
        //组件：页面操作入口
        setup: function(){
            var me = this;
            // 渲染布局
            me.get('replaceNode').replaceWith( me.element );
            // 初始化富文本编辑器组件
            me.get('data').role === 're' && tinymceUse({selector: '#record'});
            // 计时器开始走
            me.startTimer();
        },
        // 开始计时器
        startTimer: function(time){
            var me = this;
            if(time){
                trialTool.setLocalStorageByName('openTime', time);
            }else{
                time = trialTool.getLocalStorageByName('openTime');
            };
            // 如果存在才进行计算
            if( time !== undefined){
                clearInterval(me.initTimer);
                timer.call(me, time)
                me.initTimer = setInterval(function(){
                    timer.call(me, time);
                }, 1000);
            };
        }
    });

    // 私有方法
    function timer(time){
        var me = this;
        time = new Date( new Date().getTime() - new Date(time).getTime() );
        me.$('#lastTime').html( '开庭时长 ' + [
            limit.padStart( ''+(time.getHours() - 8), '0', 2 ), 
            limit.padStart( ''+time.getMinutes(), '0', 2 ), 
            limit.padStart( ''+time.getSeconds(), '0', 2 )
        ].join(':') );
    };

    return TrialLayout;

});