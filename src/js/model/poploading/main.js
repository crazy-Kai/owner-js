"use strict";
/**
 * 分页组件
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		Widget = require('widget'),
		Dialog = require('dialog'),
		Loading = require('alinw/loading/1.1.0/loading');

	//类
	var Poploading = Widget.extend({
		//类名
		clssName: 'Poploading',
		//属性
		attrs: {
			// template: '<div class="popLoading" style="display:none;"><div class="popLoading-shadow"></div><div class="popLoading-content"></div></div>',
			needText: false
		},
		//事件
		events: {
			
		},
		//初始化数据
		initProps: function(){
			var me = this,
				content = '<div class="popLoading-content"></div>';
			me.get('needText') && (content = '<div class="popLoading-content" style="padding-top:5px;padding-bottom:21px;"></div><span class="fn-color-666" style="position:absolute;bottom:7px;left:45px;">数据保存中</span>')
			me.dialog = new Dialog({
				content: content,
				width: 'auto',
				height: 'auto',
				closeTpl: ''
			}).render();

			me.loadExp = new Loading({
				element: me.dialog.$('.popLoading-content'),
		        size: 32,
		        duration: 800,
		        easing: 'linear',
				ringColor:'#c3c3c3',
				ballColor:'#2495C5'
			});
		},
		//入口
		setup: function(){
			var me = this;
		},
		destroy: function(){
			var me = this;
			me.loadExp.remove();
			me.dialog.destroy();
			Poploading.superclass.destroy.call(me);
		},
		show: function(){
			var me = this;
			me.dialog.show();
			return;
		},
		//隐藏
		hide: function(){
			var me = this;
			me.dialog.hide();
			return me;
		},
		Statics: {
			show: function(config){
				var me = this,
					loading = Poploading.loading;
				if(!loading){
					loading = Poploading.loading = new me(config);
					Poploading.guid = 0;
				}
				//计数器
				Poploading.guid++;
				loading.render().show();
			},
			hide: function(){
				var me = this,
					loading = Poploading.loading;
				if(loading){
					Poploading.guid--;
					if(Poploading.guid === 0){
						loading.hide();
						loading.destroy();
						delete Poploading.loading;
					}
				}
			}
		}
	});

	return Poploading

});