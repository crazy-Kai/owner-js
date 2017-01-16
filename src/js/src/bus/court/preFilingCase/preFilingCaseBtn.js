"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        Ajax = require('model/ajax/main'),
        Modal = require('model/modal/main'),
        MyWidget = require('common/myWidget');

    //类
    var PreFilingCaseBtn = MyWidget.extend({
        //组件：类名
        clssName: 'PreFilingCaseBtn',
        //组件：属性
        attrs: {
           element: '#preFilingCaseBtn'
        },
        //组件：事件
        events: {
            // 退回
            'click [data-trigger="back"]': function(){
                new ( require('./preFilingCaseModal'))();
            },
            // 预立案通过
            'click [data-trigger="pass"]': function(){
                Modal.confirm('提醒', '你确定要预立案通过吗？', function(){
                    new Ajax({
                        request: '/court/preFilingCaseRpc/savePreFilingCase.json',
                        autoSuccessAlert: true,
                        param: { securityCaseId: $('#pageParam [name="securityCaseId"]').val() }
                    }).on('ajaxSuccess', function(rtv, msg, con){
                        location.reload();
                    }).submit();
                });
            }
        }
    });

    return PreFilingCaseBtn;

});