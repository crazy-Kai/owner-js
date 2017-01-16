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

	//保存按钮
	$('.JS-trigger-click-save').on('click', function(e){
        new Ajax({
            request:'/paymentorder/paymentOrderRpc/terminatePaymentOrder.json?',
            paramName: "lassenPaymentTerminateDo",
            parseForm: $("#endurge-form")
        }).on('ajaxSuccess', function(){
            location.reload();
        }).submit();
	});
	
});