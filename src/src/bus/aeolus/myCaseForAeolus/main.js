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
		limit = require('common/limit'),
		util = require('common/util'),
		FilterConditions = require('model/filterConditions/main'),
		Modal = require('model/modal/main'), //提示框
		CountDown = require('model/countDown/main'),
		Dialog = require('common/dialog'),
		domUtil = require('common/domUtil'),
		Ajax = require('model/ajax/main'),
		SearchList = require('model/searchList/main'),
		Transfer = require('transfer'),
		Handlerbars = require('common/handlerbars');

	var statusMap = require('common/statusMap');

    $.ajaxSetup({ cache: false });
    
	//组件：
	new FilterConditions({element: '#filter-conditions'}).on('change', function(){
		searchListExp[0].searchListReload();
	});
	
	//组件：查询
	var searchListExp = SearchList.use('.searchList', {
		map: function (data) {
			var res = {};
			// 如果存在数据
			if(data.length){
				res.hasRes = true;
				res.keys = colNames.val().split(',');
				res.list = data;
				res.width = (res.keys.length) * 160;
			};
			return res;
		}
	});

	//搜 索 按钮事件
	$("#search").on('click', function(){
		searchListExp[0].searchListReload();
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

		
   //多列
	var allColNames = $('#allColNames'),
		colNames = $('#colNames');


	// 通过元素获取数据获取数据
	function getTransferModelByDomAllColNamesAndDomColNames(){
		var model = [],
			allValArr,
			valArr;
		// 判断存在
		if(allColNames.length && colNames.length){
			allValArr = allColNames.val().split(','),
			valArr = colNames.val().split(',');
			model = limit.map(allValArr, function(val, key){
				var obj = {name: val, choose: false};
				if( limit.contains(valArr, val) ){
					obj.choose = true;
				};
				return obj;
			});
		};
		return model;
	};

	// 通过组件更新元素中的值
	function updateDomColNamesValByTransfer(){
		var hasCase = false;
		if(colNames.length && transferExp){
			var val = limit.map(transferExp.getSelected(), function(val){
				val.name === '案件' && (hasCase = true);
				return val.name;
			}).join(',');
			// 如果选项中不存在案件
			if(!hasCase) return true;
			colNames.val(val);
		};
	};

	// 初始化列表
	var transferExp = new Transfer({
	    element: '.J_Container',
	    model: getTransferModelByDomAllColNamesAndDomColNames()
	})
	// console.log(a.getSelected())

	// 初始化弹出框
	var dialogExp = new Dialog({
		content: $('#transfer'),width:750,
		events: {
			'click [data-rule="sure"]': function(){
				var val = transferExp.getSelected();
				if(val.length == 0){
					Modal.alert(0, '请至少选择一列');
				}else{
					if(!updateDomColNamesValByTransfer()){
						searchListExp[0].searchListReload();
						this.hide();
					}else{
						Modal.alert(0, '列表中必须选择案件');
					};
				};
			}
		}
	});
	delegate.on('click', '[data-role="transferTable"]', function(e){
		dialogExp.show();
	});

    //导出Excel列表
   	delegate.on('click','[data-role="case"]', function(e){
   		var param = domUtil.paseParam('filterMap', domUtil.serialize('.searchList '));
   		return window.open('/aeolus/lassenMaintenanceRpc/derivedDataToExcel.json?filterMap='+param.filterMap)
   	});

});