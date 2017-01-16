"use strict";
/**
 * 业务：我的诉讼[suit/myCase]
 *
 
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		delegate = require('common/delegate'),
		Validator = require('common/validator'),
		PerSearch = require('model/perSearch/main'),
		FilterConditions = require('model/filterConditions/main'),
		Dialog = require('common/dialog'),
		Ajax = require('model/ajax/main'),
		SearchList = require('model/searchList/main'),
		Addspectator = require('model/addspectator/main');

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

	new Addspectator();

});