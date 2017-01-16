"use strict";
/**
 * 弹出编辑框
 * 2015,06,17 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        MyWidget = require('common/myWidget'),
        domUtil = require('common/domUtil'),
        util = require('common/util'),
        Modal = require('model/modal/main'),
        Validator = require('common/validator'),
        Handlerbars = require('common/handlerbars'),
        Selectpicker = require('model/selectpicker/main'),
        Address = require('model/address/select'),
        Ajax = require('model/ajax/main'),
        Multiple = require('model/multiple/main'),
        Upload = require('model/upload/main');

    //变量

    //类
    var courtmanageTpl = MyWidget.extend({
        //类名
        clssName: 'courtmanageTpl',
        //属性
        attrs: {
            data: {},
            template: {
                getter: function(){ 
                    // 确保不重复编译
                    if(!this.compileTpl){
                        this.compileTpl = Handlerbars.compile(this.tpl.html())(this.get('data'));
                    };
                    return this.compileTpl;
                },
                setter: function(val){ this.tpl = $(val) }
            }
        },
        //事件
        events: {
            'click [data-role="submit"]': function(e){
                var me = this;
                me.validatorExe.execute(function(err){
                    if(!err){
                        me.dataPost();
                    }
                });
            }
        },
        //初始化数据
        initProps: function(){
            var me = this;
            me.validatorExe = Validator.use(me.element, '[data-widget="validator"]');
        },
        //入口
        setup: function(){
            var me = this;
            // 初始化组件：dialog
            me.dialog = Modal.show(me.element, {width: 650}).before('hide', function(){
                me.destroy();
            });
            // 初始化组件：上传
            Upload.use( me.$('[data-widget="upload"]') );
            // 初始化组件：地址
            var address = me.$('[data-target="address"]');
            address.length && ( me.address = new Address({
                element: address,
                defaultFirst: false,
                onChange: function(id){
                    me.$('[name="areaCode"]').val(id);
                    me.trigger('addressChange', id);
                }
            }) );
            // 初始化组件：多选
            var multiple = me.$('[data-widget="multiple"]');
            multiple.length && ( me.multiple = new Multiple({
                trigger: multiple,
                data: $.map( multiple.data('list'), function(val){
                    return {
                        key: val.value,
                        value: val.key
                    };
                } )
            }) );
            me.checkSelect();
            me.trigger('complete');
        },
        // 销毁
        destroy: function(){
            var me = this;
            // 销毁上传
            Upload.dead( me.$('[data-widget="upload"]') );
            // 销毁地址
            me.address && me.address.destroy();
            // 销毁多选
            me.multiple && me.multiple.destroy();

            courtmanageTpl.superclass.destroy.call(me);
            return me;
        },
        // 数据传输
        dataPost: function(){
            var me = this;
            new Ajax({
                request: me.get('request'),
                parseForm: me.element,
                paramName: me.get('paramName')
            }).on('ajaxSuccess', function(val, msg, response){
                me.trigger('ajaxSuccess', val, response);
                Modal.alert(1, msg);
                me.dialog.hide();
            }).submit();
            return me;
        },
        checkSelect: function(){
            var me = this;
            me.$('[data-value]').each(function(){
                var self = $(this),
                    value = self.data('value');
                if(value){
                    self.val(value);
                    if(self.val() === null){
                        self.val('');
                    };
                };
            });
        }
    });


    return courtmanageTpl

});