"use strict";
/**
 * 业务：填写诉讼信息[lawsuit/start/prosecute]
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var util = require('common/util'),
		domUtil = require('common/domUtil'),
		limit = require('common/limit'),
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
			if(val.amount){
				amount += +val.amount;
			};
		} );
		util.log('log', amount);
		if(amount > 5000000){
			msg = '请求赔偿金额超过500万，请前往法院进行线下起诉！';
		}else if( isNaN(amount) ){
			msg = '填写的金额有错误';
		}
		return msg;
	}
	//手机号邮箱只填一个且自然人法人切换不混淆
	function verify(){
		var table;
		var entityType = $('[name="paySuitEntityDo.entityType"]').val();
		var table = $('[data-role="'+entityType+'"]');
		$('[data-role="verify"]').addClass('fn-hide');
		if( !table.find('[name="paySuitEntityDo.mobile"]').val() && !table.find('[name="paySuitEntityDo.email"]').val() ){
			table.find('[data-role="verify"]').removeClass('fn-hide');
			return true;
		}else{
			table.find('[data-role="verify"]').addClass('fn-hide');
			return false;
		};
	} 

	//函数：验证
	function formValidator(){
		var flag;
		vaExp && vaExp.destroy();
		vaExp = Validator.use('#page-allinfo', '.JS-prosecute-required');
		// 特殊的
		 vaExp.addItem({element: '[name="basisContent"]', skipHidden: false});
		
		$('[name="paySuitEntityDo.mobile"],[name="paySuitEntityDo.email"]').off('blur').on('blur', function(){
			$('[data-role="verify"]').addClass('fn-hide');
		});
		vaExp.execute(function(isError, errList){
			flag = isError;
			if(isError){
				util.log(errList);
			}
		});
		return verify() || flag;
	}

	//如果初始化表单里面有*号就暂时隐藏
    function tempHideInout(){
        $('#page-allinfo').find('input[type="text"]').each(function(){
            var self = $(this);
            if( self.val().indexOf('*') !== -1 && self.prop('defaultValue') === self.prop('value') ){
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
			var isError = formValidator();
			$('#page-allinfo').find('input[type="text"]').removeClass('fn-hide');
			//表单非空验证
			if(isError){
				//开启
            	return;
			};
			var msg = isOverFlow();
			//判断金额是否大于 5000000
			if( msg ){
				Modal.alert(0, msg);
			}else{
				//组件：页面数据解析传递
				new Ajax({
					element: '#page-form',
					paramParse: function(json){
						var obj = json.paySuitEntityDo,
							verMap = {'name': 'companyName', 'companyName': 'name'};
						limit.each(obj, function(v, i){
							if(verMap[i]){
		                		obj[verMap[i]] = '';
		                	};
	                        if( obj[i].indexOf('*') !== -1 ){
	                            delete obj[i];
	                        };
						});

		                // 事实
		                json.fact = JSON.stringify(json.fact);
		                // tips
		                json.tips = JSON.stringify(json.tips);
		                return json;
		            }
				}).on('ajaxSuccess', function(){
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