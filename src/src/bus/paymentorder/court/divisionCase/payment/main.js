"use strict";
/**
 * 业务：支付令/支付令
 * 2016,04,21 陈志文
 */
define(function(require, exports, module) {
	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
	    tinymceUse = require('common/tinymce'),//编辑器
	    Ajax = require('model/ajax/main');

	//变换审查结论
	$('[data-role="edit"]').on('click', function(){
		if($(this).html() == '编辑支付令'){
			$(this).html('保存支付令');
			tinymceUse({selector: '#content'});
			$('#edit-payment').removeClass('fn-hide');
			$('#view-payment').addClass('fn-hide');
			//$("#paymentNote").addClass('fn-color-F00').removeClass('fn-color-008000');
		}else{
	        $("#content").val( tinymce.get("content").getContent());
			new Ajax({
				request: "/paymentorder/paymentOrderRpc/updatePaymentOrderDo.json", 
				paramName: "lassenPaymentOrderDo",
				parseForm: $("#payment-form")
			}).on('ajaxSuccess', function(rtv, msg, con){
				location.reload();
	            // location.href = "writtenJudgment.htm?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val());
			}).submit();
		}
	});
	
	//变换审查结论
	$('[data-role="send"]').on('click', function(){
		new Ajax({
			request: "/court/lassenCourtJudgmentRpc/saveCourtJudgment.json", 
			paramName: "lassenPaymentOrderDo",
			parseForm: $("#payment-form")
		}).on('ajaxSuccess', function(rtv, msg, con){
			location.reload();
            // location.href = "writtenJudgment.htm?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val());
		}).submit();
	});
});