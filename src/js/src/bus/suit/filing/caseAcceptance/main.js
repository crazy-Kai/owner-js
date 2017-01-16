"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var Validator = require('common/validator'),
        PerSubmit = require('model/perSubmit/main'),
        delegate = require('common/delegate');

    //变量
    var caseAcceptanceChecked = $('#caseAcceptanceChecked'),
        caseAcceptanceSure = $('#caseAcceptanceSure');

    //请求
    var request = {
        "defenceRpcSave" : "/suit/caseAcceptanceRpc/receiveCase.json"
    }


	//组件：验证
	// var validatorExp = Validator.use('#updatesInformation-form');


    //函数：按钮的切换
    function toggleBtn(node, btn){
        //未勾选
        if(node.prop('checked')){
            btn.removeClass('fn-btn-disabled');
        }else{
            btn.addClass('fn-btn-disabled');
        }
    }

    //函数：确认结点拥有类名
    function checkNodeCanUse(node){
        return !node.hasClass('fn-btn-disabled');
    }

    //事件：确认
    caseAcceptanceChecked.on('click', function(){
        toggleBtn( $(this), caseAcceptanceSure );
    });

    //事件：诉讼须知下一步
    caseAcceptanceSure.on('click', function(){
        if(checkNodeCanUse($(this))){
            new PerSubmit({
                element: '#page-param'
            }).on('ajaxSuccess', function(rtv, msg, con){
                console.log('win');
            }).psSubmit();
        }
    });


});