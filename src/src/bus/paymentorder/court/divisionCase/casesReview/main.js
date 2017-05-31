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
	 Ajax = require('model/ajax/main');

	//变换审查结论
	$('[data-role="reviewConclusion"]').on('change', function(){
		if($(this).val() == 'agree'){
			$('.JS-trigger-click-save').val('生成支付令');
			$('[data-role="reason"]').addClass('fn-hide');
		}else{
			$('.JS-trigger-click-save').val('驳回申请');
			$('[data-role="reason"]').removeClass('fn-hide');
		}
	});
	
		//变换审查结论
	$('[data-role="reason"]').on('change', function(){
		if($(this).val() == 'not_accepted'){
			$("#not_accepted_condition_div").removeClass('fn-hide');
		}else{
			$("#not_accepted_condition_div").addClass('fn-hide');
		}
	});

	//保存按钮
	$('.JS-trigger-click-save').on('click', function(e){
        new Ajax({
            request:'/paymentorder/paymentOrderRpc/checkPaymentOrder.json?securityCaseId='+encodeURIComponent($("input[name='securityCaseId']").val()),
            paramName: "paymentorderMap",
            parseForm: $("#caseReview-form")
        }).on('ajaxSuccess', function(){
            location.reload();
        }).submit();
	});

});