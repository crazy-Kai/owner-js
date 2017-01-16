"use strict";
/**
 * 组件：选择法条
 * 2015,06,28 邵红亮
 */
define(function(require, exports, module) {

	// 依赖
	var $ = require('$'),
		domUtil = require('common/domUtil'),
		MyWidget = require('common/myWidget');

	// 类
	var MainNav = MyWidget.extend({
		// 类名
		clssName: 'MainNav',
		// 属性
		attrs: {
			element: window,
			nav: '#main-nav'
		},
		// 事件
		events: {
			'scroll': function(){
				var me = this;
				me.shouldFixed();
			}
		},
		initProps: function(){
			var me = this,
				nav;
			nav = me.nav = $( me.get('nav') );
			me.navPar = nav.parent();
		},
		setup: function(){
			var me = this;
			me.shouldFixed();
		},
		shouldFixed: function(){
			var me = this;
			// 安全防御
			if(!me.nav.length){
				return;
			};
			var	navParTop = me.navPar.offset().top,
				windowTop = domUtil.winScrollY();
			if(windowTop > navParTop){
				me.nav.addClass('main-nav-fixed');
			}else{
				me.nav.removeClass('main-nav-fixed');
			};
		}
	});

	return MainNav

});