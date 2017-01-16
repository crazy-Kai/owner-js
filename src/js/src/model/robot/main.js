"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget')

	//类
	var Robot = MyWidget.extend({
		//组件：类名
		clssName: 'Robot',
		//组件：属性
		attrs: {

		},
		//组件：事件
		events: {
			'click [data-role="close"]': function(){
				this.element.remove();
				this.destroy();
			}
		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){

		}
	});

	return Robot;

});