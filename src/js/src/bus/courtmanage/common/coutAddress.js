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
            element: '#address',
            defaultFirst: false,
            isEncrypt: true,
            defaultCourtId: ''
        },
        //事件
        events: {
           'change [name="courtId"]': function(){
                this.trigger('courtChange', this.areaCode.val(), this.courtId.val());
            }
        },
        //初始化数据
        initProps: function(){
            var me = this;
            me.courtId = me.$('[name="courtId"]');
            me.areaCode = me.$('[name="areaCode"]');
        },
        //入口
        setup: function(){
            var me = this;
            me.on('change', me.get('isEncrypt') ? me.incEncryoeChange : me.incChange);
            CoutAddress.superclass.setup.call(me);
        },
        incEncryoeChange: function(id){
            var me = this;
            me.areaCode.val(id);
            new Ajax({
                request: '/courtmanage/courtManageRpc/getCourtByAreaCode.json',
                param: {areaCode: id}
            }).on('ajaxSuccess', function(content){
                content.unshift({
                    courtName: '请选择',
                    securityId: ''
                });
                domUtil.selectSerialize(me.courtId[0], $.map(content, function(val){
                    return {
                        key: val.courtName,
                        value: val.securityId
                    };
                }));
                me.courtId.val(me.get('defaultCourtId'));
                me.set('defaultCourtId', '');
                me.trigger('courtChange', me.areaCode.val(), me.courtId.val());
            }).submit();
        },
         incChange: function(id){
            var me = this;
            me.areaCode.val(id);
            new Ajax({
                request: '/courtmanage/courtManageRpc/getCourtOptionByAreaCode.json',
                param: {areaCode: id}
            }).on('ajaxSuccess', function(content){
                content.unshift({
                    value: '请选择',
                    key: ''
                });
                domUtil.selectSerialize(me.courtId[0], $.map(content, function(val){
                    return {
                        key: val.value,
                        value: val.key
                    };
                }));
                me.courtId.val(me.get('defaultCourtId'));
                me.set('defaultCourtId', '');
                me.trigger('courtChange', me.areaCode.val(), me.courtId.val());
            }).submit();
        }
    });

    return CoutAddress

});