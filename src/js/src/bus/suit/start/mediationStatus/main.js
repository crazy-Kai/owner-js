"use strict";
/**
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		Tab = require('model/tab/main'),
		Scroller = require('common/scroller'),
		MediationMessage = require('model/mediationMessage/main');

	//组件：切换
	Tab.use('.JS-need-tab', {
		onChose: function(e, index, menu, list){
			e && Scroller.getWidget(list.find('.JS-need-scroller')).reset();
		}
	});

    //组件：调解消息
    MediationMessage.use('.JS-target-mediation-message');


});