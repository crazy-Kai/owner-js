"use strict";
/**
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	var Tab = require('model/tab/main');

    //依赖
	var $ = require('$'),
		Scroller = require('common/scroller');

	Tab.use('.JS-need-tab');
	
	 //组件：滚动条
    Scroller.use('.JS-need-scroller');


});