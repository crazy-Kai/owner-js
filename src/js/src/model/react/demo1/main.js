"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget');

	var HBS = require('./aaa-hbs');

	// 父
	var Demo1 = MyWidget.extend({
		attrs: {
			a: 'a1'
		}
	});

	// 子
	var Demo2 = Demo1.extend({
		//组件：类名
		clssName: 'Demo1',
		//组件：属性
		attrs: {
			a: 'a2'	
		},
		//组件：事件
		events: {
			'click span': function(e){
				
			},
			'input #aa': function(e){
				// console.log('blur', e.target.value);
			}
		},
		//组件：初始化数据
		initProps: function(){
			var me = this;
			me.aaaa = 'aaaa';
			me.set('bbbb', 'bbbb');
		},
		//组件：页面操作入口
		setup: function(){
			var me = this;
			me.element.html( HBS({a: 'a1'}) );
		}
	});

	return Demo2

});