"use strict";
define(function(require, exports, module) {
        
    //依赖
    var $ = require('$'),
        Ajax = require('model/ajax/main'),
        PerSearch = require('model/perSearch/main'),
        Modal = require('model/modal/main'),
        Validator = require('common/validator'),
        Handlerbars = require('common/handlerbars'),
        MyWidget = require('common/myWidget');

    //类
    var AddSpectator = MyWidget.extend({
        // 组件：类名
        clssName: 'AddSpectator',
        // 组件：属性
        attrs: {
            trigger: '#addSpectator',
            templateNode: '#template-addspectator',
            templateSeedNode: '#template-addspectator-seed',
            template: {
                setter: function(val){
                    var me = this;
                    me.templateNode = val;
                },
                getter: function(){
                    var me = this;
                    if(me.templateStr){
                        return me.templateStr;
                    }else{
                        return me.templateStr = Handlerbars.compile( $(me.get('templateNode')).html()||'<div></div>' )();
                    };
                }
            },
            rpcSave: '/court/suitObserverRpc/save.json', // 保存
            rpcDelete: '/court/suitObserverRpc/delete.json', // 删除
            rpcList: '/court/suitObserverRpc/list.json', // 查询
            size: 10
        },
        // 组件：事件
        events: {

        },
        // 组件：初始化
        setup: function(){
            var me = this;
            // 入口
            me.triggerNode && me.delegateEvents(me.triggerNode, 'click', function(){
                me.show();
            });
        },
        // 组件：显示
        show: function(){
            var me = this;
            var dialog = Modal.show(me.element, {
                width: 650,
                events: {
                    // 新增
                    'click [data-role="save"]': function(){
                        // 验证
                        if( !Validator.oneExecute(me.element, '[data-widget="validator"]') ){
                            save.call(me, dialog);
                        };
                    },
                    // 删除
                    'click [data-role="delete"]': function(e){
                        // 提示
                        Modal.confirm('提醒', '您确定要删除嘛？', function(){
                            remove.call(me, dialog, $(e.target));    
                        });
                    }
                }
            });

            dialog.before('hide', function(){
               search.destroy();
            });
            var search = me.search = new PerSearch({
                request: me.get('rpcList'),
                element: me.element,
                paramName: 'paraMap',
                template: $( me.get('templateSeedNode') ).html(),
                hidePage: true,
                onAjaxSuccess: function(){
                    dialog._setPosition();
                    check.call(me, dialog);
                }
            });
        }
    });
    
    // 保存
    function save(dialog){
        var me = this;
        new Ajax({
            request: me.get('rpcSave'),
            paramName: 'paraMap',
            parseForm: me.element,
            autoSuccessAlert: true
        }).on('ajaxSuccess', function(){
            // 清除
            dialog.$('[name="mobile"]').val('');
            me.search.searchListReload();
            check.call(me, dialog);
        }).submit();
    };

    // 删除
    function remove(dialog, node){
        var me = this;
        new Ajax({
            request: me.get('rpcDelete'),
            paramName: 'paraMap',
            param: node.data('param'),
            autoSuccessAlert: true
        }).on('ajaxSuccess', function(){
            me.search.searchListReload();
            check.call(me, dialog);
        }).submit();
    };

    // 确定新增可用
    function check(dialog){
        var me = this;
        if(dialog.$('[data-role="delete"]').length >= me.get('size')){
            me.$('[data-role="save"]').hide();
        }else{
            me.$('[data-role="save"]').show();
        };
    };

    return AddSpectator
    
});
