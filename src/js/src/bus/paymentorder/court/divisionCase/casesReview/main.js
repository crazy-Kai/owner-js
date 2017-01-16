"use strict";
/**
 * 业务：支付令/案件审查
 * 2016,04,21 陈志文
 */
define(function(require, exports, module) {
	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		domUtil = require('common/domUtil'),
		Ajax = require('model/ajax/main');

	//变换审查结论
	$('[data-role="reviewConclusion"]').on('change', function(){
		if($(this).val() == 'agree'){
			$('.JS-trigger-click-save').val('生成支付令');
			$('[data-role="reason"]').val("");
			$('[data-role="reason"]').addClass('fn-hide');
			$('[data-role="not_accepted_condition"]').val("");
			$("#not_accepted_condition_div").addClass('fn-hide');
		}else{
			$('.JS-trigger-click-save').val('驳回申请');
			$('[data-role="reason"]').removeClass('fn-hide');
		}
	});
	
	//变换审查结论
	$('[data-role="reason"]').on('change', function(){
		//不符合受理条件
		if($(this).val() == 'pm_reject_reason_5'){
			$("#not_accepted_condition_div").removeClass('fn-hide');
		}else{
			$('[data-role="not_accepted_condition"]').val("");
			$("#not_accepted_condition_div").addClass('fn-hide');
		}
	});

	//保存按钮
	$('.JS-trigger-click-save').on('click', function(e){
        new Ajax({
            request:'/paymentorder/paymentOrderRpc/checkPaymentOrder.json?securityCaseId='+encodeURIComponent($("input[name='securityCaseId']").val()),
            paramName: "paymentorderMap",
            parseForm: $("#caseReview-form"),
            autoSuccessAlert: true
        }).on('ajaxSuccess', function(){
        	if($('[data-role="reviewConclusion"]').val() == 'agree'){
				setTimeout(domUtil.redirect('/paymentorder/court/divisionCase/paymentOrderSend.htm?securityCaseId=' + $("input[name='securityCaseId']").val()), 3000);
        	}else{
            	setTimeout(location.reload(), 3000);
            }
        }).submit();

	});

});