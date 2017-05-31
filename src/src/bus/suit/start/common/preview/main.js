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
		delegate = require('common/delegate'),
		Scroller = require('common/scroller'),
		Ajax = require('model/ajax/main');

    //组件：滚动条
    Scroller.use('.JS-need-scroller'); 

    //事件：提交诉讼
    delegate.on('click', '.JS-trigger-click-submit', function(){
    	var self = $(this);
    	new Ajax({
    		autoSubmit: true,
    		request: '/suit/legalCaseRpc/submitLegalCase.json',
    		parseForm: '#pageParam',
    		onAjaxSuccess: function(){
    			this.redirect(self.data('href'));
    		}
    	});
    });

    

});