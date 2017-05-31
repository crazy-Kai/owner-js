"use strict";
/**
 * 业务：我的诉讼[suit/quickCase]
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		util = require('common/util'),
		Modal = require('model/modal/main'), //提示框
		SearchList = require('model/searchList/main'),
		FilterConditions = require('model/filterConditions/main'),
		Ajax = require('model/ajax/main');


	var statusMap = require('common/statusMap');

	//组件：条件过滤
	new FilterConditions({element: '#filter-conditions'}).on('change', function(){
		searchListExp[0].searchListReload();
	});

	//组件：查询
	var searchListExp = SearchList.use('.searchList', {
		request: '/account/mySuitRpc/queryMySuitInfo.json',
		map: function (data) {
			var i = 0;
			for (; i < data.length; i++) {
				if (data[i].status) {
					data[i].statusEx = statusMap[data[i].status];
				}
			}
			return data;
		}
	});

	//案件状态，更多和收起
	$('[data-action="toggleStatus"] span').on('click', function(e){
		var target =  $('[data-action="toggleStatus"]'); 

		if(target.find('.kuma-icon-triangle-down').size() > 0){
			$('.JS-tirgger-more').removeClass('fn-hide');
			target.find('a').text('收起');
			target.find('.kuma-icon-triangle-down').addClass('kuma-icon-triangle-up').removeClass("kuma-icon-triangle-down");
		}else{
			$('.JS-tirgger-more').addClass('fn-hide');
			target.find('a').text('更多');
			target.find('.kuma-icon-triangle-up').addClass('kuma-icon-triangle-down').removeClass("kuma-icon-triangle-up");
		}
	});

	//组件：请求
	new Ajax({
		element: '#page-content',
		autoDestroy: false,
		autoSuccessAlert: true,
		type: 'get',
		events: {
			'click .JS-trigger-click-submit': function(e){
				e.preventDefault();
            	var me = this,
            		node = $(e.target),
            		targetsource = node.attr('targetsource');
            	Modal.confirm('提示', '您确定要'+node.html()+'吗？', function(){
            		me.set('request', targetsource);
        			me.submit();
            	})
			}
		},
		onAjaxSuccess: function(){
			searchListExp[0].searchListAjax();
		}
	});

});