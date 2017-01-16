"use strict";
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var Ajax = require('model/ajax/main'),
		Validator = require('common/validator'),
		Modal = require('model/modal/main'),
		RealTime = require('model/realTime/main');

	if($('#page-form').size()){
		
		//组件
		new Ajax({
			element: '#page-form',
			request: '/suit/withdraw/savePaymentWithdrawal.json',
			paramName: 'paramMap',
			autoSuccessAlert: true,
			autoDestroy: false,
			events: {
				'click .JS-trigger-click-submit': function(){
					var me = this;
					if( !Validator.oneExecute(this.element) ){
						Modal.confirm('提醒', '您确认要撤回申请么？', function(){
							me.submit();
						});
					}
				}
			},
			onAjaxSuccess: function(rtv, msg, res){
				setTimeout(location.reload(), 3000);
			}
		});

		//组件：实时输入
	
		new RealTime({element: '#withdraw-memo'})
	}

});