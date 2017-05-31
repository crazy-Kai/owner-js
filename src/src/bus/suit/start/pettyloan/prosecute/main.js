"use strict";
/**
 * 业务：填写诉讼信息[lawsuit/start/prosecute]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var util = require('common/util'),
		domUtil = require('common/domUtil'),
		Ajax = require('model/ajax/main'),
		Modal = require('model/modal/main'),
		Validator = require('common/validator'),
		PerChecked = require('model/perChecked/main');
	
	//变量
	var isGo = true,
		vaExp;

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

	//函数：验证
	function formValidator(){
		var flag;
		vaExp && vaExp.destroy();
		vaExp = Validator.use('#page-table', '.JS-prosecute-required');
		//特殊的
		vaExp.addItem({element: '[name="basisContent"]', skipHidden: false});
		vaExp.execute(function(isError, errList){
			flag = isError;
			if(isError){
				util.log(errList);
			}
		});
		return flag;
	}

	//组件：确认下一步
	new PerChecked({
		element: '#page-check',
		checked: '.JS-trigger-click-checked',
		submit: '.JS-trigger-click-submit'
	}).after('psCheckedNext', function(flag){

		//可以提交
		if(flag){
			//表单非空验证
			if(formValidator()){
				return;
			}
			var msg = isOverFlow();
			//判断金额是否大于 5000000
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

	//离开
	window.onbeforeunload = function(e){
		e = e || event;
		isGo && (e.returnValue="您确定要离开此页面么？");
	}

});