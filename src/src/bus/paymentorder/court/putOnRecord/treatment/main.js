"use strict";
/**
 * 业务：支付令/立案审核
 * 2016,04,21 陈志文
 */
define(function(require, exports, module) {
	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
	Ajax = require('model/ajax/main');

	//变换审查结论
	$('[data-role="reviewConclusion"]').on('click', function(){
		if($(this).val() == 'agree'){
			$('.JS-trigger-click-save').val('生成支付令');
			$('[data-role="reason"]').addClass('fn-hide');
		}else{
			$('.JS-trigger-click-save').val('驳回申请');
			$('[data-role="reason"]').removeClass('fn-hide');
		}
	});
	
	//保存按钮
	$('.JS-trigger-click-save').on('click', function(e){
        new Ajax({
            request:'/court/courtScheduleRpc/checkSchedule.json?securityCaseId="'+encodeURIComponent($("input[name='securityCaseId']").val()),
            paramName: "courtScheduleDo",
            parseForm: $("#treatment-form")
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