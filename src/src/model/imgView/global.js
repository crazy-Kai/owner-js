"use strict";
/**
 * 组件：选择法条
 * 2015,06,28 邵红亮
 */
define(function(require, exports, module) {

	// 依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		Dialog = require('common/dialog'),
		Modal = require('model/modal/main'),
		Poploading = require('model/poploading/main');
	// 图片下载模板
	var imgloadHbs = require('./imgload-hbs');

	// 类
	var ImgView = MyWidget.extend({
		// 类名
		clssName: 'ImgView',
		// 属性
		attrs: {
			element: 'body',
			rule: /(\.jpg|\.jpeg|.png|.bmp)$/i,
			sliceRep: /fileIdStr=(.*)/  //正则表达式匹配
		},
		// 事件
		events: {
			'click a': function(e){
				var me = this,
					target = me.jQuery(e.target);
				if( !target.data('rule') &&  me.get('rule').test( $.trim(target.html()) ) ){
					e.preventDefault();
					me.imgShow( target.prop('href') );
				};
			}
		},
		// 图片显示
		imgShow: function(href){
			var me = this;
			if(href){
				// 初始化图片元素
				var img = new Image();
				Poploading.show();
				// 绑定回调
				img.onload = function(){
					var width;
					me.element.append(img);		
					if(img.clientWidth >= 800){
						width = 800;
						//  IE浏览器会写入宽高
						$(img).removeAttr('height');
					};
					Dialog.show( imgloadHbs( {href: href, id: href.match( me.get('sliceRep') )[1], width: width} ));
					closeCb(img);
				}
				img.onerror = function(){
					Modal.alert(0, '您无权限查看或者图片地址错误。');
					closeCb(img);
				}
				// 设置地址s
				img.src = href;
			}
			return me;
		}
	});

	// 函数：关闭
	function closeCb(img){
		img.onload = img.onerror = null;
		$(img).remove();
		Poploading.hide();
	}

	return ImgView

});