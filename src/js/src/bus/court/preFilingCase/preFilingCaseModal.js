"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        Ajax = require('model/ajax/main'),
        Dialog = require('common/dialog'),
        Multiple = require('model/multiple/main'),
        Validator = require('common/validator'),
        MyWidget = require('common/myWidget');

    //类
    var preFilingCaseModal = MyWidget.extend({
        //组件：类名
        clssName: 'preFilingCaseModal',
        //组件：属性
        attrs: {
           template: require('./preFilingCaseModal-hbs')()
        },
        //组件：事件
        events: {
            'click [data-role="return"]':function(){
                var me = this;
                // 先删除备注的验证
                me.validatorExp.removeItem(me.$('[name="remark"]'));
                // 如果原因里面有其他选项就增加验证
                var reasonStr = me.$("[name='reason']").val();
                if( reasonStr.indexOf('other') >= 0 ){
                    me.validatorExp.addItem({
                        element: me.$('[name="remark"]'),
                        required: true
                    });
                };
                me.validatorExp.execute(function(err){
                    if(!err){
                        new Ajax({
                            request: '/court/courtHandlerRpc/courtFile.json',
                            parseForm: me.element,
                            autoSuccessAlert: true,
                            paramName:'lassenCourtFilingVo',
                            parseName: 'lassenCourtFilingVo',
                            param: {'securityCaseId':$('input[name="securityCaseId"]').val()}
                        }).on('ajaxSuccess', function(){
                            location.reload();
                            me.diaExp.hide();
                            me.destroy();
                        }).submit(); 
                    };
                });
            }
        },
        setup: function(){
            var me = this;
            me.diaExp = Dialog.show(me.element, {width: 500});
            me.multipleExp = initMultiple.call(me);
            me.validatorExp = Validator.use(me.element);
        },
        destroy: function(){
            var me = this;
            me.multipleExp.destroy();
            me.validatorExp.destroy();
            preFilingCaseModal.superclass.destroy.call(me);
        }
    });

    // 初始化多选
    function initMultiple(){
        var me = this;
        return new Multiple({
            trigger: me.$('#multiple'),
            width: 420,
            data: [
                {"key": "原告主体资格不符",
                    "value": "no_plaintiff_qualification"
                },{
                    "key": "无明确的被告或被告主体资格不符",
                    "value": "no_defendant"
                },{
                    "key": "无具体诉讼请求，事实和理由",
                    "value": "no_request"
                },{
                    "key": "不属于民事诉讼范围",
                    "value": "no_range"
                },{
                    "key": "不属于本院管辖",
                    "value": "no_mycourt"
                },{
                    "key": "没有新的事实和证据重新起诉",
                    "value": "no_proof"
                },{
                    "key": "依法在一定期限内不得起诉的案件",
                    "value": "no_sue"
                },{
                    "key": "其他",
                    "value": "other"
                }
            ]
        });
    };
    
    return preFilingCaseModal;

});