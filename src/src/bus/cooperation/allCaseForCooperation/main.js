"use strict";
/**
 * 业务：第三方运营
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		delegate = require('common/delegate'),
		limit = require('common/limit'),
		util = require('common/util'),
		Validator = require('common/validator'),
		FilterConditions = require('model/filterConditions/main'),
		Modal = require('model/modal/main'), //提示框
		Dialog = require('common/dialog'),
		domUtil = require('common/domUtil'),
		Ajax = require('model/ajax/main'),
		SearchList = require('model/searchList/main'),
		Transfer = require('transfer'),
		Handlerbars = require('common/handlerbars'),
		modifyPhoneHbs = require('./modifyPhone-hbs'),
		sendCodeHbs = require('./sendCode-hbs');

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
				res.width = (res.keys.length) * 160 + 80;/*( (1/res.keys.length * 94) + '%' );*/

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

	//修改手机号码
	delegate.on('click', '[data-role="modifyPhone"]', function(e){
		new Ajax({
			request:'/cooperation/lassenCooperationRpc/queryAccusedAndAgentByCaseId.json',
			param:$(e.target).data('param')
		}).on('ajaxSuccess', function(rtv){
			var dig = Dialog.show(modifyPhoneHbs(rtv.data), {
				width:480,
				autoShow: false,
				events:{
					//确定
					'click [data-role="sure"]':function(){
						this.validatorExp.execute(function(isErr){
							if(!isErr){
								new Ajax({
									request:'/cooperation/lassenCooperationRpc/batchUpdateMobile.json',
									paramName:'filterMap',
									parseForm: dig.element
								}).on('ajaxSuccess', function(rtv, msg, con){
									dig.hide();
									searchListExp[0].searchListAjax();
									Modal.alert(1, rtv);
								}).submit();
							}
						})
						
					},
					//重置
					'click [data-role="reset"]':function(){
						domUtil.resetForm('#modify');
					}
				}
			}).after('show', function(){
				//组件：验证
				this.validatorExp = Validator.use('#modify', '[data-widget="validator"]');
			}).show();
		}).submit();
	});

	//发送关联码
	delegate.on('click', '[data-role="sendCode"]', function(e){
		new Ajax({
			request:'/cooperation/lassenCooperationRpc/queryAccusedByCaseId.json',
			param:$(e.target).data('param')
		}).on('ajaxSuccess', function(rtv){
			var dialog = Dialog.show(sendCodeHbs(rtv.data), {
				width:480,
				events:{
					'change [data-role="allCheck"]':function(e){
						var target = e.target;
						$("[data-role='caseCheck']").prop("checked",$(target).prop("checked"));
					},
					'change [data-role="caseCheck"]':function(e){
						var targets = e.target;
						$("[data-role='allCheck']").prop("checked", $("[data-role='caseCheck']:checked").length == $("[data-role='caseCheck']").length);
					},
					//发送
					'click [data-role="send"]':function(){
						var batchCode = $('[name="entityIds"]:checked').val();
				    	var entityIds = '',
				    		entityidsArray = [];
				    	$('[name="entityIds"]:checked').each(function(index, ele){
				    		entityidsArray.push($(this).val())
				    	})
				    	entityIds = entityidsArray.join(',');
						if(batchCode){
				    		new Ajax({
								request:'/cooperation/lassenCooperationRpc/batchSendAssociateCode.json',
								param:{entityIds:entityIds}
							}).on('ajaxSuccess', function(rtv, msg, con){
								dialog.hide();
								searchListExp[0].searchListAjax();
								Modal.alert(1, rtv);
							}).submit();
				    	}else{
				    		Modal.alert(0, '请选择关联码');
				    	}
					},
				}
			});
		}).submit();
	});
});