"use strict";
/**
 * 原被告的增删改查
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        Dialog = require('common/dialog'),
        domUtil = require('common/domUtil'),
        Ajax = require('model/ajax/main'),
        Modal = require('model/modal/main'),
        Validator = require('common/validator'),
        MyWidget = require('common/myWidget');

    // 模板
    var editHbs = require('./edit-hbs'),
        detailHbs = require('./detail-hbs');

    //类
    var EditPersonInInvers = MyWidget.extend({
        //组件：类名
        clssName: 'EditPersonInInvers',
        //组件：属性
        attrs: {
            "addInvestigationEntity": "/mercury/investigationRpc/addInvestigationEntity.json",
            "queryInvestigationEntityByEntityId": "/mercury/investigationRpc/queryInvestigationEntityByEntityId.json",
            "delInvestigationEntity": "/mercury/investigationRpc/delInvestigationEntity.json"
        },
        //组件：事件
        events: {
            // 编辑
            'click [data-trigger="edit"]': function(e) {
                var me = this,
                    node = $(e.target).closest('[data-entity-id]');
                new Ajax({
                    request: me.get('queryInvestigationEntityByEntityId'),
                    param: { entityId: node.data('entityId') }
                }).on('ajaxSuccess', function(rtv) {
                    initDialog(me, rtv);
                }).submit();
            },
            // 删除
            'click [data-trigger="delete"]': function(e) {
                var me = this,
                    node = $(e.target).closest('[data-entity-id]');
                Modal.confirm('提醒', '您确定要删除嘛？', function() {
                    new Ajax({
                        request: me.get('delInvestigationEntity'),
                        param: { entityId: node.data('entityId') }
                    }).on('ajaxSuccess', function() {
                        node.remove();
                        me.trigger('deleteSuccess');

                    }).submit();
                });
            }
        },
        //组件：初始化数据
        initProps: function() {

        },
        //组件：页面操作入口
        setup: function() {
            var me = this;
            // 新增触发器入口，注册事件代理
            me.delegateEvents(me.triggerNode, 'click', function(e) {
                console.log(me.get('test'))
                //初始化dialog的时候data里传入2个参数:entityType(原告还是被告)，entityType(自然人还是法人),为了区分是自然人还是法人，是原告还是被告
                initDialog(me, $.extend({ entityType: 'normal' }, me.get('param')));
            });
            // 设置
            me.set('parentNode', me.triggerNode.parent());
            // 手动渲染
            me.triggerNode.before(me.element);
        }
    });

    // 私有方法
    // 初始化弹出层
    function initDialog(theEditPersonInInvers, data) {
        var dia = Dialog.show(editHbs(data), {
            width: 500,
            events: {
                // 切换类型
                'change [data-trigger="switchNormalAndLegal"]': function(e) {
                    switchTableFormType.call(this, $(e.target).val())
                },
                // 保存
                'click [data-trigger="submit"]': function() {
                    if (!Validator.oneExecute(this.element, '[data-widget="validator"]')) {
                        // 这里的theEditPersonInInvers指的是EditPersonInInvers这个类，而this指的是dia
                        submitFormToRpc.call(theEditPersonInInvers, this);
                    };
                }
            },
            autoShow: false
        });
        dia.after('show', function() {
            // 初始化的时候做的校验
            disabledInputInHiddenTable.call(dia);
        });
        dia.show();
        return dia;
    };

    // 把隐藏表格里面的表单给置为不可用
    function disabledInputInHiddenTable() {
        var me = this;
        me.$('[data-target]').each(function() {
            var node = $(this);
            if (node.hasClass('fn-hide')) {
                domUtil.disabledTrue(node);
            } else {
                domUtil.disabledFalse(node);
            };
        });

    };

    // 通过类型来切换表格
    function switchTableFormType(type) {
        var me = this;
        me.$('[data-target]').addClass('fn-hide');
        me.$('[data-target="' + type + '"]').removeClass('fn-hide');
        disabledInputInHiddenTable.call(me);
    };

    // 保存数据
    function submitFormToRpc(dia) {
        var me = this;
        new Ajax({
            request: me.get('addInvestigationEntity'),
            paramName: 'filterMap',
            //这里不能写this.elelment,因为这里的this指向的是EditPersonInInvers对象，而请求要发送数据的form是dialog中的elelment,所以必须写成dia.elelment
            parseForm: dia.element
        }).on('ajaxSuccess', function(rtv) {
            dia.hide();
            var node = me.$('[data-entity-id="' + rtv.securityId + '"]')
            if (node.length) {
                node.replaceWith(detailHbs(rtv));
            } else {
                me.element.append(detailHbs(rtv));
            };
            me.trigger('saveSuccess');
        }).submit();
    };

    return EditPersonInInvers;

});
