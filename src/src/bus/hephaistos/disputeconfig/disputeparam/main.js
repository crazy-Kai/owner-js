"use strict";
/**
 * 业务
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	// 依赖
	var Disputeconfig = require('../disputeconfig/disputeEdit'),
		SearchList = require('model/searchList/main');

	// 组件：列表
	var searchListExp = new SearchList({ element: '#searchList' });


	// 组件：新增纠纷类型配置
	new Disputeconfig({ element: '#searchContent', trigger: '#addDisputeParam', tpl: '#tpl-disputeparam', paramName: 'filterMap' }).on('ajaxSuccess', function(){
		searchListExp.searchListAjax();
	});

	
	
	

});