"use strict";
/**
 * 组件继承
 */
define(function(require, exports) {

	//依赖
	var $ = require('$'),
		Widget = require('widget'),
		util = require('common/util'),
		daparser = require('common/daparser'),
		domUtil = require('common/domUtil');
	//类
	var myWidget = Widget.extend({
		//类名
		className: 'myWidget',
		//接口继承
		Implements: [util, domUtil],
		//初始
		initialize: function(config){
			var me = this;
			// 如果未知的元素就不初始化
			me.after('parseElement', me.parseTrigger);
			try{
				myWidget.superclass.initialize.call(me, config);
				//在element上绑定对象
				me.element.data('myWidget', me);
			}catch(e){
				util.log('error', '找不到元素：', me.get('element'));
			};
			
		},
		//解析触发器
		parseTrigger: function(){
			var me = this,
				trigger = $(me.get('trigger'));
			//一切的基础是触发器是必须存在的
			if(trigger.length){
				me.triggerNode = trigger;
				//如果element是模板生成的就去解析触发器节点的元素
				if(!me.get('element')){
					me.resetConfig( daparser.parseElement(trigger) );
					trigger.data('myWidget', me);
				}
			}
		},
		//重新设置config
		resetConfig: function(config){
			var me = this;
			me.breakEachObj(config, function(val, key){
				me.set(key, val);
			});
			return me;
		},
		//静态属性
		Statics: $.extend(domUtil, util, {
			//使用
			use: function(query, config){
				var me = this,
					list = [];
				$(query).each(function(){
					list.push( new me( $.extend({element: this}, config) ) );
				});
				return list;
			},
			// 销毁
			dead: function(query){
				$(query).each(function(){
					$(this).data('myWidget').destroy();
				});
			},
			//获取
			getWidget: function(query){
				// 如果不同页面的JQ封装的话会返回undefined
				return query.jquery ? query.data('myWidget') : $(query).data('myWidget');
			}

		}),
	});

	return myWidget;

});
