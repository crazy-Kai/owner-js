"use strict";
/**
 * 弹出编辑框
 * 2015,06,17 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		UseTpl = require('./useTpl'),
		Modal = require('model/modal/main'),
		Handlerbars = require('common/handlerbars'),
		Ajax = require('model/ajax/main');

	// 类
	var Disputeconfig = MyWidget.extend({
			// 类名 
			className: 'Disputeconfig',
			// 配置
			attrs: {
				
			},
			// 事件
			events: {
				// 编辑
				'click [data-role="edit"]': function(e){
					this.disputeEdit( $(e.target).data('param') );
				}
			},
			setup: function(){
				var me = this;
				// 新增
				me.triggerNode && me.delegateEvents(me.triggerNode, 'click', function(){
					initUseTpl.call(me);
				});
			},
			disputeEdit: function(param){
				var me = this;
				new Ajax({
					request: me.get('requestDisputGet'),
					param: param
				}).on('ajaxSuccess', function(val, msg){
					initUseTpl.call(me, val);
				}).submit();
				return me;
			}
	});

	// 私有方法：纠纷类型配置值集的数据保存
	function initUseTpl(data){
		var me = this;
		new UseTpl({
			request: me.get('requestDisputSave'),
			template: me.get('tpl'),
			data: data,
			paramName: me.get('paramName')
		}).on('ajaxSuccess', function(){
			me.trigger('ajaxSuccess');
		}).show();
	};

	return Disputeconfig

});