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
			
			return data;
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

	//关联状态
	delegate.on('click','[data-role="related"]', function(e){
		$('[data-role="confirm"]').removeClass('fn-btn-disabled');
		$('[data-role="batch"]').addClass('fn-btn-disabled');
	});

	delegate.on('click','[data-role="norelation"]', function(){
		$('[data-role="batch"]').removeClass('fn-btn-disabled');
		$('[data-role="confirm"]').addClass('fn-btn-disabled');
	});

	delegate.on('click','[data-role="any"]', function(){
		$('[data-role="batch"]').addClass('fn-btn-disabled');
		$('[data-role="confirm"]').addClass('fn-btn-disabled');
	});
		
	
	//全选
	delegate.on('change', '[data-role="subCheck"]', function(){
		$("[data-role='check']").prop("checked",$(this).prop("checked"));
		if($("[data-role='check']:checked").length == 0){
    		$("[data-role='batch']").addClass('fn-btn-disabled');
    	}else{
    		$("[data-role='batch']").removeClass('fn-btn-disabled');
    	}
	});

	//checkbox有一个没选中时，取消全选
    delegate.on('change', '[data-role="check"]', function(){
    	$("[data-role='subCheck']").prop("checked", $("[data-role='check']:checked").length == $("[data-role='check']").length);
    	if($("[data-role='check']:checked").length == 0){
    		$("[data-role='batch']").addClass('fn-btn-disabled');
    	}else{
    		$("[data-role='batch']").removeClass('fn-btn-disabled');
    	}
    });

    //批量关联
    delegate.on('click','[data-role="batch"]', function(e){
    	// 状态防御
    	if($(this).hasClass('fn-btn-disabled')){
    		return;
    	};
    	var batchId = $('[name="caseIds"]:checked').val();
    	var caseIds = '',
    		caseidArray = new Array;
    	$('[name="caseIds"]:checked').each(function(index, ele){
    		caseidArray.push($(this).val())
    	})
    	caseIds = caseidArray.join(',');
    	if(batchId){
    		//校验
    		new Ajax({
            	request: "/aeolus/lassenMaintenanceRpc/checkAccusedCompany.json",
            	param:{caseIds:caseIds},
            	autoErrorAlert:false,
       		}).on('ajaxSuccess', function(rtv, msg, con){
           		associateTemplate(caseIds);
        	}).on('ajaxError', function(rtv, msg, con){
           		Modal.confirm('提示', rtv, function(){
					associateTemplate(caseIds);
				});
        	}).submit();
    	}else{
    		Modal.alert(0, '请选择关联案件');
    	}
    });

    function associateTemplate(caseIds){
    	new Ajax({
    		request:"/aeolus/lassenMaintenanceRpc/queryAllAeolusAccounts.json"
    	}).on('ajaxSuccess', function(aeolusAccountInfo){
    		Dialog.showTemplate('#template-associate', aeolusAccountInfo.data, {
    			width:400, autoDestroy:true, autoShow:true, 
		    	events: {			
		    	//确定
		    		'click .JS-trigger-click-sure': function(){
		    			var me = this,
		        		aeolusAccountInfoId = me.$('[name="aeolusAccountInfoId"]:selected').val();
		        		if(aeolusAccountInfoId){
		        			new Ajax({
		        				request: "/aeolus/lassenMaintenanceRpc/batchConfirmAssociate.json",
		           				param : $.extend({}, {caseIds:caseIds, aeolusAccountInfoId:aeolusAccountInfoId}),
		            			paramName : 'filterMap'
		            		}).on('ajaxSuccess', function(rtv, msg, con){
		            			me.hide();
		            			Modal.alert(1, msg, function(){
		            				searchListExp[0].searchListAjax();
		            			});
	            			}).submit();
		        		}else{
		        			Modal.alert(0, '请选择关联账号');
		        		}
		    		}
		    		}
		    	});	
    	}).submit();
    	
    };
    //批量确认送达
    delegate.on('click','[data-role="confirm"]', function(e){
    	// 状态防御
    	if($(this).hasClass('fn-btn-disabled')){
    		return;
    	};
    	var param = $(e.target).data("param");
		new Ajax({
    		request:"/aeolus/lassenMaintenanceRpc/batchConfirmReceive.json",
    		parseForm : $('#suit-content')
		}).on('ajaxSuccess', function(rtv, msg, con){
			Modal.alert(1, msg, function(){
				searchListExp[0].searchListAjax();
			});
		}).submit();
    });
});