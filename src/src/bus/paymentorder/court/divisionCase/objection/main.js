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
		Ajax = require('model/ajax/main'),
		ImgView = require('model/imgView/main');

	new ImgView();

	//变换审查结论
	$('[data-role="conclusion"]').on('click', function(){
		if($(this).val() == 'setup'){
			$('.JS-trigger-click-save').removeClass('fn-W150').addClass('fn-W100').val('失效支付令');
		}else{
			$('.JS-trigger-click-save').removeClass('fn-W100').addClass('fn-W150').val('驳回异议申请裁定');
		}
	});

	//保存按钮
	$('.JS-trigger-click-save').on('click', function(e){
		var conclusion = $('[data-role="conclusion"]').val();
		var url = (conclusion == 'setup' ? '/paymentorder/paymentOrderRpc/invalidPaymentOrder.json' : '/paymentorder/paymentOrderRpc/rejectPaymentObjection.json');

        new Ajax({
            request: url, 
            paramName: "lassenPaymentObjectionDo",
            parseForm: $("#objection-form"),
            autoErrorAlert: true
        }).on('ajaxSuccess', function(){
            location.reload();
        }).submit();
	});

	//加载支付令申请单事件
	$('[data-role="load-more"]').on('click', function(e){
		var iTag = $(this).next('i');
		if(iTag.hasClass('kuma-icon-title-down')){
			iTag.removeClass('kuma-icon-title-down').addClass('kuma-icon-title-up');
			$('[data-role="more-infor"]').removeClass('fn-hide');
		}else{
			iTag.removeClass('kuma-icon-title-up').addClass('kuma-icon-title-down');
			$('[data-role="more-infor"]').addClass('fn-hide');
		}
	});
	
});