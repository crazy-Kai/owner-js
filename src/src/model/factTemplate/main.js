"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Calendar = require('common/calendar'),
		Dialog = require('dialog'),
		Upload = require('model/upload/main'),
		Ajax = require('model/ajax/main'),
		Validator = require('common/validator'),
		Modal = require('model/modal/main');

	//变量
	var handlerbars = MyWidget.handlerbars;

	//模板

	//类
	var FactTemplate = MyWidget.extend({
		//组件：类名
		clssName: 'FactTemplate',
		//组件：属性
		attrs: {
			"request": "/suit/legalCaseRpc/getFactInfo.json",
			"paramName": "paraMap"
		},
		//组件：事件
		events: {
			'click .JS-trigger-click-select': function(){
				return this.ftDialogForm.show();
			}
		},
		//组件：初始化数据
		initProps: function(){
			var me = this;
			//依据模板：弹出层模板
			me.ftTempleFact = handlerbars.compile ( me.$('.JS-temple-fact').html() );
			//依据模板：弹出层
			me.ftDialogForm = new Dialog({
				width: 600,
				content: me.ftTempleFact(),
				events: {
					//数据提交
					'click .JS-trigger-click-submit': function(){
						//验证
						!Validator.oneExecute(this.element, '.JS-target-required') && me.ftSubmitForm();
					}
				}
			}).render();
			//依据模板：弹出层表单
			me.ftForm = me.ftDialogForm.$('.JS-target-form');
			//依据模板：输入框
			me.ftTextarea = me.$('.JS-target-textarea');
			//组件：上传
			me.ftUpload = new Upload({trigger: '.JS-need-upload'});
			//组件：日期
			me.ftCalendar = new Calendar({trigger: '.JS-need-calendar'});
			return me;
		},
		//组件：页面操作入口
		setup: function(){
			var me = this;
			//初始化组件：上传

			return me;
		},
		//依据模板：数据提交
		ftSubmitForm: function(){
			var me = this;
			new Ajax({
				request: me.get('request'), 
				paramName: me.get('paramName'),
				parseForm: me.ftForm
			}).on('ajaxSuccess', function(rtv, msg, con){
				//内容回写
				me.ftTextarea.val(rtv);
				//隐藏
				me.ftDialogForm.hide();
				//重置上传
				me.ftUpload.uploadRenderClear();
				//重置表单
				me.ftForm[0].reset();
				//重置证据
				MyWidget.getWidget('#evidence').evidenceDataRender();
			}).submit();
			return me;
		}
	});


	return FactTemplate

});