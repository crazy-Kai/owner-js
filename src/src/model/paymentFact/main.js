"use strict";
/**
 * 依据模板
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		domUtil = require('common/domUtil'),
		Calendar = require('common/calendar'),
		Modal = require('model/modal/main');

	var paymentFactHbs = require('./paymentFact-hbs')

	//类
	var PaymentFact = MyWidget.extend({
		//组件：类名
		clssName: 'PaymentFact',
		//组件：属性
		attrs: {

		},
		//组件：事件
		events: {
			
		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){
			var me = this;
			me.element.html( paymentFactHbs( me.element.data('data') ) );
			me.calendar = new Calendar({trigger: me.$('[name="fact.contractDate"]')});
		}
	});


	return PaymentFact;

});