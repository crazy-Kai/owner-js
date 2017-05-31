"use strict";
/**
 * 组件：滚动条
 */
define(function(require, exports) {

	var $ = require('$'),
		nwCalendar = require('calendar');

	//类
	var Calendar = nwCalendar.extend({
		attrs: {
			"zIndex": 9999
		},
		//组件：初始化数据
		initProps: function(){
			var me = this;
			Calendar.superclass.initProps.call(me);
			me.set( 'trigger', $( me.get('trigger') ) );
			return me;
		},
		//入口
		setup: function(){
			var me = this;
			Calendar.superclass.setup.call(me);
			//把数据放入节点
			me.get('trigger').data('myWidget', me);
		},
		//静态元素
		Statics: {
			use: function(query, config){
				var me = this,
					list = [];
				$(query||'.JS-need-calendar').each(function(){
					list.push( new me( $.extend({
						trigger: $(this)
					}, config) ) );
				});
				return list;
			},
			//获取
			getWidget: function(query){
				return $(query).data('myWidget');
			}
		}
	});

	return Calendar;

});
