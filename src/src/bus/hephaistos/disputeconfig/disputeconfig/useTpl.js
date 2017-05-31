"use strict";
/**
 * 弹出编辑框
 * 2015,06,17 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		util = require('common/util'),
		Modal = require('model/modal/main'),
		Validator = require('common/validator'),
		Handlerbars = require('common/handlerbars'),
		Selectpicker = require('model/selectpicker/main'),
		Ajax = require('model/ajax/main'),
		Upload = require('model/upload/main');

	//变量

	//类
	var ModalEditor = MyWidget.extend({
		//类名
		clssName: 'ModalEditor',
		//属性
		attrs: {
			data: {},
			template: {
				getter: function(){ 
					// 确保不重复编译
					if(!this.compileTpl){
						this.compileTpl = Handlerbars.compile(this.tpl.html())(this.get('data'));
					};
					return this.compileTpl;
				},
				setter: function(val){ this.tpl = $(val) }
			}
		},
		//事件
		events: {
			'click [data-role="submit"]': function(e){
				var me = this;
				if( !Validator.oneExecute(me.element, '[data-widget="validator"]') ){
					me.dataPost();
				};
			}
		},
		//初始化数据
		initProps: function(){
			var me = this;
		},
		//入口
		setup: function(){
			var me = this;
			// 隐藏
			me.element.on('hidden.bs.modal', function(){
				me.trigger('hide');
				me.destroy();
			});
			// 初始化页面
			me.render();
			// 初始化组件：上传
			Upload.use( me.$('[data-widget="upload"]') );
			// 初始化组件：多选
			Selectpicker.use( this.$('[data-widget="selectpicker"]') );
			// 初始化组件：验证
			// me.validatorExp = Validator.use(me.element, '[data-widget="validator"]');
			// console.log(me.validatorExp);
			// me.destroy();
		},
		// 销毁
		destroy: function(){
			var me = this;
			// 销毁上传
			Upload.dead( me.$('[data-widget="upload"]') );
			// 销毁多选
			Selectpicker.dead( me.$('[data-widget="selectpicker"]') );
			ModalEditor.superclass.destroy.call(me);
			return me;
		},
		// 显示
		show: function(){
			var me = this;
			me.element.modal();
			return me;
		},
		hide: function(){
			var me = this;
			me.element.modal('hide');
			return me;
		},
		// 数据传输
		dataPost: function(){
			var me = this;
			new Ajax({
				request: me.get('request'),
				parseForm: me.element,
				paramName: me.get('paramName')
			}).on('ajaxSuccess', function(val, msg, response){
				Modal.alert(1, msg);
				me.element.modal('hide');
				me.trigger('ajaxSuccess', val, response)
			}).submit();
			return me;
		}
	});

	return ModalEditor

});