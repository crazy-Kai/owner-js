"use strict";
/**
 * 组件类[占位符]
 * 2015,06,10 陈志文
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		Widget = require('widget');

	//变量
	var config = window.CONFIG;

	//类
    var PlaceHolderInput = Widget.extend({
		attrs : {
			shadowTextCss: null,
			parentTextCss: null,
			shadowMoreTextCss: null
		},
	    events: {
			'input ': 'showPlaceHolder',
			'propertychange': 'showPlaceHolder',
			'keydown': 'showPlaceHolder',
			'paste': 'showPlaceHolder',
			'blur': 'showPlaceHolder'
        },
		
		isEmpty : function(){
		    return !$(this.element).val();
		},
		showPlaceHolder : function(e){
			var me = this,
				$holder = me.get('holder');
			if(me.inEvent && (e.type === 'blur' || e.type === 'paste' || e.type === 'keydown' || e.type === 'input' || e.originalEvent.propertyName === 'values') ){
				me.inEvent = false;
				setTimeout(function(){
					if(me.isEmpty()){
						$holder.show();
					}else{
						$holder.hide();
					}
					me.inEvent = true;
				}, 0);
			}
		},
		setup : function() {
			var me = this,
				documentMode = document.documentMode;
			//判断IE9-的时候就
			if( documentMode && (documentMode === 8 || documentMode === 9) ){
				me.initNode();
				// 初始化触发
				me.element.trigger('blur');
			};	
		},
		initNode: function(){
			//原始的输入表单
			var me = this,
				$input = $(me.element),
				inputOuterHeight = $input.outerHeight() - 2,
				lineHeight = inputOuterHeight,
				textareaCss,
				placeHolderText = $input.attr('placeholder'),//获取表单的文本
				$parent = $('<div>'),//初始化父级div
				$holder = $('<div>');//初始化文本div
			//事件的开关
			me.inEvent = true
			// //干掉原始属性
			$input.removeAttr('placeholder');
			$input.css({
				'position': 'relative',
				'z-index': 2,
				'background':'url("'+config.assetsLink+'assets/img/tran.gif")'
			});

			//设置父级的样式
			$parent.css( $.extend({
				'display': 'inline-block',
				'position': 'relative',
				'background-color': '#FFF'
			}, me.get('parentTextCss')));
			//设置文本div内容和样式
			$holder.html(placeHolderText);
			// 如果是textarea行高就定死
			console.log($input.prop('type'));
			if($input.prop('type') === 'textarea'){
				textareaCss = {
					'line-height': '20px',
					'top': '10px'
				};
			};
			//初始化文本的基本信息，宽度，高度，位置，行高
			$holder.css( $.extend({
				'width': $input.outerWidth() - 22,
				'line-height': lineHeight + 'px',
				'position': 'absolute',
				'top': '1px',
				'left': '10px',
				'color': '#999',
				'z-index': 1
			}, textareaCss, me.get('shadowTextCss'), me.get('shadowMoreTextCss') ) );
			//存入对象
			me.set('holder', $holder);
			//放入文档中国
			$input.after($parent);
			$input.appendTo($parent);
			$input.before($holder);
		}
        
    });
	//函数

	return PlaceHolderInput;

});