"use strict";
/**
 * 业务：填写诉讼信息[lawsuit/start/prosecute]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		util = require('common/util'),
		domUtil = require('common/domUtil'),
		delegate = require('common/delegate'),
		Modal = require('model/modal/main'),
		Ajax = require('model/ajax/main'),
		Validator = require('common/validator'),
		PerChecked = require('model/perChecked/main');
				
	//组件：确认下一步
	new PerChecked({
		element: '#page-check',
		checked: '.JS-trigger-click-checked',
		submit: '.JS-trigger-click-submit'
	}).after('psCheckedNext', function(flag){
		//验证
		//可以提交 且验证通过
		if(flag && !Validator.oneExecute('#page-table', '.JS-prosecute-required')){
			var msg = isOverFlow();
			if( msg ){
				Modal.alert(0, msg);
			}else{
				//组件：页面数据解析传递
				new Ajax( {element: '#page-form'} ).on('ajaxSuccess', function(){
					var me = this,
						DO = me.serialize('#pageParam');
					isGo = false;
	           		me.redirect( me.get('jump') + me.getEscapeUrl(DO.securityId) );
				}).submit();	
			}
		}
	});

	//函数：判断钱大于
	function isOverFlow(){
		var amount = 0,
		 	msg = null;
		util.breakEachArr( domUtil.serialize('#suitRequest').lassenSuitRequestDoList, function(val){
			amount += +val.amount;
		} );
		util.log('log', amount);
		if(amount > 5000000){
			msg = '请求赔偿金额超过500万，请前往法院进行线下起诉！';
		}else if( isNaN(amount) ){
			msg = '填写的金额有错误';
		}
		return msg;
	}

	//变量
	var pageOrder = $('#page-order'),
		pageAllinfo = $('#page-allinfo'),
		pageCheck = $('#page-check'),
		isGo = true;


	//事件投诉&未投诉
	delegate.on('change', '[name="complaint"]', function(){
		//未投诉
		if(this.value === 'y'){
			domUtil.hide(pageOrder);
			domUtil.hide(pageAllinfo);
			domUtil.hide(pageCheck);
		}else{
			domUtil.show(pageOrder);
			if(Ajax.getWidget('#selectionOrder').get('soHasOrder')){
				//显示
				domUtil.show('#page-allinfo');
				domUtil.show('#page-check');
			}
		}
	});

	//离开
	window.onbeforeunload = function(e){
		e = e || event;
		isGo && (e.returnValue="您确定要离开此页面么？");
	}


});