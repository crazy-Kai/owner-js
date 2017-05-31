"use strict";
/**
 * 弹出编辑框
 * 2015,06,17 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var Ajax = require('model/ajax/main'),
        domUtil = require('common/domUtil'),
        Address = require('model/address/select');

    //变量

    //类
    var CoutAddress = Address.extend({
        //类名
        clssName: 'CoutAddress',
        //属性
        attrs: {
            defaultFirst: false
        },
        //事件
        events: {
           'change [name="courtId"]': function(){
                this.trigger('courtChange');
            }
        },
        //初始化数据
        initProps: function(){
            var me = this;
            me.courtId = me.$('[name="courtId"]');
        },
        //入口
        setup: function(){
            var me = this;
            me.on('change', me.incChange);
            CoutAddress.superclass.setup.call(me);
        },
        incChange: function(id){
            var me = this,
                courtId = me.get('courtId');
            new Ajax({
                request: '/courtmanage/courtManageRpc/getCourtOptionByAreaCodeAndCaseType.json',
                param: {areaCode: id, caseType: me.get('caseType')},
            }).on('ajaxSuccess', function(content){
                content.unshift({
                    value: '请选择',
                    key: ''
                });

                domUtil.selectSerialize(me.courtId[0], $.map(content, function(val){
                    return {
                        key: val.value,
                        value: val.key,
                        selected: val.key == courtId ? true : false 
                    };
                }));
                me.trigger('courtChange');
            }).submit();

        }
    });

    return CoutAddress

});