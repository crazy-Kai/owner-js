"use strict";
/**
 * 组件：选择法条
 * 2015,06,28 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget');

	//变量
	var $ = MyWidget.jQuery;

	//函数

	//类
	var Tab = MyWidget.extend({
		//类名
		clssName: 'Tab',
		//属性
		attrs: {
			menu: '.JS-target-menu',
			list: '.JS-target-list',
			mainIndex: 0,
			active: 'ch-active'
		},
		//初始化数据
		initProps: function(){
			var me = this;
			me.tabMenu = me.$(me.get('menu'));
			me.tabList = me.$(me.get('list'));
			me.maxIndex = me.tabMenu.length - 1;
		},
		//入口
		setup: function(){
			var me = this;
			me.delegateEvents(me.element, 'click ' + me.get('menu'), function(e){
				e.preventDefault();
				var me = this,
					target = $(e.target);
				me.tabShow(e, me.tabMenu.index(target));
			});
			me.tabShow(null, me.get('mainIndex'));
		},
		//显示
		tabShow: function(e, index){
			var me = this,
				active = me.get('active');
			me.set('mainIndex', index);
			me.tabMenu.removeClass(active).eq(index).addClass(active);
			me.tabList.addClass('fn-hide').eq(index).removeClass('fn-hide');
			me.trigger('chose', e, index, me.tabMenu.eq(index), me.tabList.eq(index));
			return me;
		},
		//隐藏
		tabHide: function(){
			var me = this;
			me.tabList.addClass('fn-hide');
			return me;
		}
	});

	return Tab

});