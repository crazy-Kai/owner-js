"use strict";
/**
 * 依据模板
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget');

	var paymentFactViewHbs = require('./paymentFactView-hbs')

	//类
	var PaymentFactView = MyWidget.extend({
		//组件：类名
		clssName: 'PaymentFactView',
		//组件：属性
		attrs: {
			signedModeStatus: {
				dataMessage: "数据电文",
				contract: "合同书",
				oral: "口头"
			}
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
				data = me.element.data('data');
			me.element.html( paymentFactViewHbs( $.extend(data, {signedMode: me.get('signedModeStatus')[data.signedMode]}) ) );
		}
	});

	return PaymentFactView;

});