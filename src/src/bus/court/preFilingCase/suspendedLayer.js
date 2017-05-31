"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		Modal = require('model/modal/main');

	//类
	var SuspendedLayer = MyWidget.extend({
		//组件：类名
		clssName: 'SuspendedLayer',
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
			// 站位
			var statWarp = stations.call(me);
			// 漂浮
			var fixedWarp = fixed.call(me);
			me.element.css({
				"position": "relative",
				"z-index": "2"
			});
			// 绑定事件
			me.delegateEvents(window, 'scroll', function(){
				scroll.call(me, statWarp, fixedWarp);
			});
			scroll.call(me, statWarp, fixedWarp);
		}
	});

	// 占位
	function stations(){
		var me = this,
			warp = $(document.createElement('div'));
		me.element.before(warp);
		warp.append(me.element);
		warp.css({
			"overflow": "hidden"
		});
		warp.height( warp.height() );
		return warp;
	};

	//  漂浮
	function fixed(){
		var me = this,
			warp = $(document.createElement('div')),
			mark = $(document.createElement('div'));
		warp.append(mark);
		$('body').append(warp);
		warp.css({
			"position": "fixed",
			"width": "100%",
			"right": "0",
			"bottom": "0",
			"padding-bottom": "20px",
			"z-index": "999"
		});
		mark.css({
			"position": "absolute",
			"width": "100%",
			"height": "100%",
			"opacity": .5,
			"background": "#000",
			"top": "0"
		});
		return warp;
	};

	// 滚动
	function scroll(statWarp, fixedWarp){
		var me = this,
			scrollY = me.winScrollY();
		if( scrollY <= statWarp.offset().top - me.winInnerHeight() + 74 ){
			fixedWarp.append(me.element).show();
			me.element.addClass('lc-PaLeCal');
		}else{
			fixedWarp.hide();
			statWarp.append(me.element);
			me.element.removeClass('lc-PaLeCal');
		};
	};

	return SuspendedLayer

});