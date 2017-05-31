"use strict";
/**
 * 组件：滚动条
 */
define(function(require, exports) {

	//依赖
	var $ = require('$'),
		handlerbars = require('common/handlerbars'),
		nwDialog = require('dialog');

	//类
	var Dialog = nwDialog.extend({
		//静态元素
		 attrs:{
		 	timer: 20
		 },
		Statics: {
			show: function(content, config){
				var me = this,
					autoShow,
					dia,
					autoDestroy;
				//设置默认配置
				config = $.extend({
					autoDestroy: true,
					autoShow: true,
					content: content,
					width: 'auto',
					height: 'auto'
				}, config);
				//获取是否自动销毁
				autoDestroy = config.autoDestroy;
				autoShow = config.autoShow;
				//把配置项变得干净
				delete config.autoDestroy;
				delete config.autoShow;
				dia = new me( config ).after('hide', function(){
					autoDestroy && this.destroy();
				})
				autoShow && dia.show();
				return dia;
			},
			showTemplate: function(template, data, config){
				var me = this,
					html,
					tpl = $(template);
				//如果存在DOM
				if(tpl.length){
					html = tpl.html();
				}else{
					html = template;
				}
				//解析
				html = handlerbars.compile(html);
				return me.show(html(data||{}), config);
			}
		}
	});
	return Dialog;

});
