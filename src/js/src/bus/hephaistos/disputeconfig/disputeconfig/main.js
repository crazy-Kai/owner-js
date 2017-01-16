"use strict";
/**
 * 业务
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	// 依赖
	var $ = require('$'),
		delegate = require('common/delegate'),
		DisputeEdit = require('./disputeEdit'),
		ToConfig = require('./toConfig'),
		SearchList = require('model/searchList/main'),
		Ajax = require('model/ajax/main');

	// 组件：列表
	var searchListExp = new SearchList({ element: '#searchList' });

	// 组件：新增纠纷类型配置
	new DisputeEdit({ element: '#searchContent', trigger: '#addDisputeConfig', tpl: '#tpl-disputeconfig', paramName: 'filterMap' }).on('ajaxSuccess', function(){
		searchListExp.searchListAjax();
	});

	// 组件：配置
	new ToConfig({ element: '#searchContent' });
	
	var topManager = top.topManager;
	// 维护跳转
	if(topManager){
		delegate.on('click', '[data-role="maintain"]', function(e){
			e.preventDefault();
			var self = $(this);
			topManager.openPage({
				// id: 'maintain',
				href: self.prop('href'),
				title: self.prop('title')
			});
		});
	};

});