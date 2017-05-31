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
		util.breakEachArr( domUtil.serialize('#page-allinfo').lassenSuitRequestDoList, function(val){
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
	function test(){
		if( !$('[name="paySuitEntityDo.mobile"]').val() && !$('[name="paySuitEntityDo.email"]').val() ){
				$('[data-test="test"]').removeClass('fn-hide');
		}else{
			$('[data-test="test"]').addClass('fn-hide');
		}
	}
	//函数：验证
	function formValidator(){
		var flag;
		vaExp = Validator.use('#page-allinfo', '.JS-prosecute-required');
		// 特殊的
		 vaExp.addItem({element: '[name="basisContent"]', skipHidden: false});
		test();
		$('[name="paySuitEntityDo.mobile"],[name="paySuitEntityDo.email"]').blur(function(){
		test();
		})
		vaExp.execute(function(isError, errList){
			flag = isError;
			if(isError){
				util.log(errList);
			}
		});
		return flag;
	}

	//如果初始化表单里面有*号就暂时隐藏
    function tempHideInout(){
        $('#page-allinfo').find('input[type="text"]').each(function(){
            var self = $(this);
            if( self.val().indexOf('*') !== -1 ){
                self.addClass('fn-hide');
            }
        });
    }

	//组件：确认下一步
	new PerChecked({
		element: '#page-check',
		checked: '.JS-trigger-click-checked',
		submit: '.JS-trigger-click-submit'
	}).after('psCheckedNext', function(flag){

		//可以提交
		if(flag){
			tempHideInout();
			//表单非空验证
			if(formValidator()){
				//开启
            	return $('#page-allinfo').find('input[type="text"]').removeClass('fn-hide');
				
			};
			var msg = isOverFlow();
			//判断金额是否大于 5000000
			if( false ){
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