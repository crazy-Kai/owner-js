"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$');

	function closeWindows(){
		setTimeout(function(){
			//注册成功，跳转到实名认证页面
			
            window.location.href = '/tocertification.htm';
        }, 3000);
	}

	closeWindows();
});