"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {
	require('bus/global/main');
	//依赖
	var $ = require('$'),
		Modal = require('model/modal/main');

	window.showError = function (msg) {
		if(msg=='usedErr'){
			Modal.alert(0, '该账户已被使用');
		}else if(msg=='connectErr'){
			Modal.alert(0, '暂时无法连接到支付宝，请稍后重试…');
		};
	}

});