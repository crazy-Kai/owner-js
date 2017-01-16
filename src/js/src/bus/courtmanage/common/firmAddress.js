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
    var FirmAddress = Address.extend({
        //类名
        clssName: 'FirmAddress',
        //属性
        attrs: {
            element: '#address',
            defaultFirst: false,
            isEncrypt: true,
            defaultCourtId: ''
        },
        //事件
        events: {
           'change [name="firmId"]': function(){
                this.trigger('firmChange', this.areaCode.val(), this.firmId.val());
            }
        },
        //初始化数据
        initProps: function(){
            var me = this;
            me.firmId = me.$('[name="firmId"]');
            me.areaCode = me.$('[name="areaCode"]');
        },
        //入口
        setup: function(){
            var me = this;
            me.on('change', me.get('isEncrypt') ? me.incEncryoeChange : me.incChange);
            FirmAddress.superclass.setup.call(me);
        },
        incEncryoeChange: function(id){
            var me = this;
            me.areaCode.val(id);
            new Ajax({
                request: '/courtmanage/firmManageRpc/getFirmByAreaCode.json',
                param: {areaCode: id}
            }).on('ajaxSuccess', function(content){
                content.unshift({
                    firmName: '',
                    securityId: ''
                });
                domUtil.selectSerialize(me.firmId[0], $.map(content, function(val){
                    return {
                        key: val.firmName,
                        value: val.securityId
                    };
                }));
                me.firmId.val(me.get('defaultFirmId'));
                me.set('defaultFirmId', '');
                me.trigger('firmChange', me.areaCode.val(), me.firmId.val());
            }).submit();
        },
         incChange: function(id){
            var me = this;
            me.areaCode.val(id);
            new Ajax({
                request: '/courtmanage/firmManageRpc/getFirmByAreaCode.json',
                param: {areaCode: id}
            }).on('ajaxSuccess', function(content){
                content.unshift({
                    value: '请选择',
                    key: ''
                });
                domUtil.selectSerialize(me.firmId[0], $.map(content, function(val){
                    return {
                        key: val.value,
                        value: val.key
                    };
                }));
                me.firmId.val(me.get('defaultFirmId'));
                me.set('defaultFirmId', '');
                me.trigger('firmChange', me.areaCode.val(), me.firmId.val());
            }).submit();
        }
    });

    return FirmAddress

});