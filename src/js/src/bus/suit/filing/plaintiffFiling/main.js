"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		domUtil = require('common/domUtil'),
        delegate = require('common/delegate');

    //变量
    var bindingName = $('[name="bindingName"]')

    //事件：确认支付
    delegate.on('click', '.JS-trigger-click-pay', function(e){
    	e.preventDefault();
    	var self = $(this);
    	domUtil.redirect( self.prop('href') + '&nick=' + bindingName.val() );
    });


});