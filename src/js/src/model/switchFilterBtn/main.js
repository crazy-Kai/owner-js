"use strict";
/**
 * 地址基础类
 * 2015,11,11 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget');

	//类
	var switchFilterBtn = MyWidget.extend({
		// 组件：类名
		clssName: 'switchFilterBtn',
		// 组件：属性
		attrs: {
			
		},
		events: {
			'click [type="radio"]': 'handler'
		},
		handler: function(e){
			var me = this,
				radio = $(e.target),
				label = radio.closest('label'),
				labels = me.$('label'),
				radios = me.$('[type="radio"]');
			if(label.hasClass('fn-btn-default')){
				return;
			};
			// 删除样式
			labels.removeClass('fn-btn-default').addClass('fn-btn-link')
			radios.prop('checked', false);
			// 增加样式
			label.addClass('fn-btn-default').removeClass('fn-btn-link');
			radio.prop('checked', true);
			// 触发事件
			me.trigger('switchSuccess', radio, radios);
		}
	});

	return switchFilterBtn

});