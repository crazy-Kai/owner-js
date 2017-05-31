"use strict";
/**
 * 业务：庭审测试
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		delegate = require('common/delegate'),
		util = require('common/util'),
		FilterConditions = require('model/filterConditions/main'),
		Modal = require('model/modal/main'), //提示框
		domUtil = require('common/domUtil'),
		Ajax = require('model/ajax/main'),
		Handlerbars = require('common/handlerbars'),
		SearchList = require('model/searchList/main');

	var statusMap = require('common/statusMap');

    $.ajaxSetup({ cache: false });
    
	//组件：
	new FilterConditions({element: '#filter-conditions'}).on('change', function(){
		searchListExp[0].searchListReload();
	});
	
	//组件：查询
	var searchListExp = SearchList.use('.searchList', {
		map: function (data) {
			var i = 0;
			for (; i < data.length; i++) {
				if (data[i].status) {
					data[i].statusEx = statusMap[data[i].status];
				}

				if(data[i].reason){
					data[i].reasonEx = getReasons(data[i].reason, data[i].remark, data[i].status);
				}
			}
			return data;
		}
	});

	//搜 索 按钮事件
	$("#search").on('click', function(){
		searchListExp[0].searchListReload();
	});

	//已庭审测试提示框
	delegate.on('click', '[data-role="measured"]', function(e){
		Modal.confirm('提示', '是否确认测试已通过?', function(){
			new Ajax({
				request:'/cooperation/lassenCooperationRpc/confirmTestTrialSuccuse.json',
				param:$(e.target).data('param')
			}).on('ajaxSuccess', function(rtv, msg, con){
				Modal.alert(1, rtv);
				searchListExp[0].searchListReload();
			}).submit();
		});
	});
});