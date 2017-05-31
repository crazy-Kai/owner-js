"use strict";
/**
 * 组件：滚动条
 */
define(function(require, exports) {

	var nwScroller = require('scroller');

	//类
	var Scroller = nwScroller.extend({
		//入口
		setup: function(){
			var me = this;
			Scroller.superclass.setup.call(me);
			me.scContent = me.get('trigger').find('.kuma-scroller-content');
			//把数据放入节点
			me.get('trigger').data('myWidget', me);
		},
		//设置内容
		setContent: function(content){
			var me = this;
			me.scContent.html(content);
			me.reset();
		},
		//静态元素
		Statics: {
			use: function(query, config){
				var me = this,
					list = [];
				$(query).each(function(){
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

	return Scroller;

});
