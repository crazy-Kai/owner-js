"use strict";
/**
 * 依据模板
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		domUtil = require('common/domUtil'),
		limit = require('common/limit'),
		Calendar = require('common/calendar'),
		Modal = require('model/modal/main');

	var paymentTipsHbs = require('./paymentTips-hbs')

	//类
	var PaymentTips = MyWidget.extend({
		//组件：类名
		clssName: 'PaymentTips',
		//组件：属性
		attrs: {
			view: true,
			originData:[{
				title: '债务人是否在我国境内且未下落不明',
				key: 'isInChina'
			}, {
				title: '支付令是否能送达债务人',
				key: 'isConfirm'
			}, {
				title: '申请人是否未向人民法院申请诉前保全',
				key: 'isAppeal'
			}]
		},
		//组件：事件
		events: {
			
		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){
			var me = this,
				originData = me.get('originData');
			limit.each(me.get('data'), function(val, key){
				limit.each(originData, function(v, k){
					if(v.key === key){
						v.isChecked = val;
					};
				});
			});
			me.element.html( paymentTipsHbs( {originData: originData, view: me.get('view')} ) );
		}
	});


	return PaymentTips;

});