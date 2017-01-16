"use strict";
/**
 * 业务：调解服务[conciliation/mediatorList]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		FilterConditions = require('model/filterConditions/main'),
		SearchList = require('model/searchList/main');

	//组件：
	new FilterConditions({element: '#filter-conditions'}).on('change', function(){
		searchListExp[0].searchListReload();
	});

	//组件：查询
	var searchListExp = SearchList.use('.searchList', {
		onAjaxSuccess: function(respone){
			this.$('.JS-target-totle').html(respone.count);
		}
	});


	var Modal = require('model/modal/main');

});