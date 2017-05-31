"use strict";
/**
 * 业务：填写诉讼信息[suit/start/prosecute]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var util = require('common/util'),
		domUtil = require('common/domUtil'),
		PerSubmit = require('model/perSubmit/main'),
		Modal = require('model/modal/main'),
		Validator = require('common/validator'),
		Tip = require('common/tip'),
		PerChecked = require('model/perChecked/main');
	
	//变量
	var isGo = true,
		vaExp,
		causeAction = $('select[name="causeAction"]'),
		selectReason = $('select[name="selectReason"]');

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
		vaExp = Validator.use('#page-allinfo', '.JS-prosecute-required');
		//特殊的
		vaExp.addItem({element: '[name="basisContent"]', skipHidden: false});
		vaExp.execute(function(isError, errList){
			flag = isError;
			if(isError){
				util.log(errList);
			}
		});
		return flag;
	};

	// 组件：提示
	var tipMsg = new Tip({trigger: '#causeActionMsg', width:400});
	//组件：确认下一步
	new PerChecked({
		element: '#page-check',
		checked: '.JS-trigger-click-checked',
		submit: '.JS-trigger-click-submit'
	}).after('psCheckedNext', function(flag){
		//可以提交
		if(flag){
			// 表单非空验证
			if(formValidator()){
				return;
			}
			// 判断金额是否大于 5000000
			var msg = isOverFlow();
			if( msg ){
				return Modal.alert(0, msg)
			}

			// 判断
			if(causeAction.val() === '网络购物合同纠纷' && PerSubmit.getWidget('#selectionOrder').soAccusedGuid > 0){
				return Modal.alert(0, '由于案由是网络购物合同，请把添加的被告删除。');
			}

			//组件：页面数据解析传递
			new PerSubmit( {element: '#page-form'} ).on('ajaxSuccess', function(){
				var me = this,
					DO = me.serialize('#pageParam');
				isGo = false;
           		me.redirect( me.get('jump') + me.getEscapeUrl(DO.securityId) );
			}).psSubmit();
			
		}
	});

	// 联动数据
	var selectReasonData = {
		'网络购物合同纠纷': [{
			key: '被告住所地',
			value: 'accused_location'
		}, {
			key: '合同履行地',
			value: 'contract_location'
		}],
		'网络服务合同纠纷': [{
			key: '被告住所地',
			value: 'accused_location'
		}, {
			key: '合同履行地',
			value: 'contract_location'
		}, {
			key: '协议管辖所在地',
			value: 'agreement_location'
		}],
		'产品责任纠纷': [{
			key: '侵权行为所在地',
			value: 'tort_location'
		}, {
			key: '被告住所地',
			value: 'accused_location'
		}]
	};

	// 联动提示数据
	var causeActionMsgData = {
		"网络购物合同纠纷": "消费者通过网络购物平台向商家购买商品，因商品与约定不符，根据合同约定或法律规定，向商家主张合同责任的，应选择网络购物合同纠纷案由。基于合同相对性，平台经营者不应成为网络购物合同纠纷的共同被告。",
		"网络服务合同纠纷": "网络购物平台提供者为用户提供网络服务，用户因平台提供的服务不符合合同约定而向平台主张合同责任的，应选择网络服务合同纠纷案由。基于合同相对性，其他第三方(含卖家)不应成为网络服务合同纠纷的共同被告。",
		"产品责任纠纷": "消费者因购买的商品存在缺陷而致使其遭受人身伤害、财产损失，或者有此危险，向产品的生产者、销售者、平台经营者主张侵权责任的，应选择产品责任纠纷案由。"
	};


	// 函数


	// 案由联动
	causeAction.on('change', function(e, reason){
		var self = $(this),
			val = self.val(),
			list = selectReasonData[val];
		// 默认选中
		if(reason){
			util.breakEachArr(list, function(val){
				if(val.value === reason){
					val.selected = true;
				}
			})
		}
		// 增加按钮可用不可用
		$('#selectionOrder .JS-trigger-click-add')[val === '网络购物合同纠纷' ? 'addClass': 'removeClass']('fn-btn-disabled');
		//序列化select
		domUtil.selectSerialize(selectReason[0], list);
		// 提示信息
		tipMsg.set('content', causeActionMsgData[val]);
	});
	causeAction.trigger('change', selectReason.data('reason'));


	//离开
	window.onbeforeunload = function(e){
		e = e || event;
		isGo && (e.returnValue="您确定要离开此页面么？");
	}

});