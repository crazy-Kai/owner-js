"use strict";
/**
 * 组件：滚动条
 */
define(function(require, exports) {

	//依赖
	var $ = require('$'),
		nwTip = require('tip');

	//类
	var Tip = nwTip.extend({
		//静态元素
		Statics: {
			use: function(query, config){
				var me = this,
					list = [];
				$(query||'.JS-need-tip').each(function(){
					var node = $(this),
						content = node.data('content') || config.content;
					if(content){
						var the = new me( $.extend({
							trigger: node,
							content: node.data('content')
						}, config));
						list.push(the);
						node.data('myWidget', the);
					}
				});
				return list;
			},
			remove: function(query){
				$(query||'.JS-need-tip').each(function(){
					$(this).data('myWidget').destroy();
				});
			}
		}
	});

	return Tip;

});
