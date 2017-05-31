"use strict";
/**
 * 业务：首页[domain/helpCenter]
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		domUtil = require('common/domUtil'),
		Tab = require('model/tab/main');

	var next = $('[data-role="next"]');

	function checkNext(){
		var me = this;
		if(me.get('mainIndex') >= me.maxIndex){
			next.hide();
		}else{
			next.show();
		};

	};

	function initScroll(){
		var node = $(location.hash);
		if( node.length ){
			var top = node.offset().top;
			setTimeout(function(){ domUtil.winScrollY(top) }, 0);
		};
	};

	// 大切换
	new Tab({
		element: '#helpCenter',
		 menu: '[data-role="menu"]', 
		 list: '[data-role="list"]', 
		 active: 'focus',
		 mainIndex: location.hash ? 3 : 0,
		 onChose: function(e, index){
		 	console.log(123);
		 	(index === 1 || index === 2) && checkNext.call(index === 1 ? a : b);
		 }
	});
	
	initScroll();

	//原告
	var a = new Tab({
		element: '#prosecutor',
		active: 'focus',
		events: {
			'click [data-role="next"]': function(e){
				var me = this;
				me.tabShow(e, me.get('mainIndex') + 1);
				checkNext.call(me);
				// 滚动条会位置
				domUtil.winScrollY($('#helpCenter').offset().top - 30);
			}
		},
		onChose: function(e, index){
			var me = this;
			checkNext.call(me);
		}
	});
	//被告
	var b = new Tab({
		element: '#defendant',
		menu:'[data-role="demenu"]',
		list:'[data-role="delist"]',
		active: 'focus',
		events: {
			'click [data-role="next"]': function(e){
				var me = this;
				me.tabShow(e, me.get('mainIndex') + 1);
				checkNext.call(me);
				// 滚动条会位置
				domUtil.winScrollY($('#helpCenter').offset().top - 30);
			}
		},
		onChose: function(e, index){
			var me = this;
			checkNext.call(me);
		}
	});
});