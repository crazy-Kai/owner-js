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
					var self = $(e.target);
					this.disputeEdit( $.extend( self.data('param'), {title: self.prop('title')} ) );
				},
				// 重启
				'click [data-role="valid"]': function(e){
					toAjax.call(this, $(e.target).data('param'), '/hephaistos/disputeConfigRpc/enable.json');
				},
				// 失效
				'click [data-role="invalid"]': function(e){
					toAjax.call(this, $(e.target).data('param'), '/hephaistos/disputeConfigRpc/unable.json');
				}
			},
			setup: function(){
				var me = this;
				// 新增
				me.triggerNode && me.delegateEvents(me.triggerNode, 'click', function(){
					initUseTpl.call(me, {title: me.triggerNode.prop('title')});
				});
			},
			disputeEdit: function(param){
				var me = this;
				new Ajax({
					request: me.get('requestDisputGet'),
					param: param
				}).on('ajaxSuccess', function(val, msg){
					initUseTpl.call( me, $.extend(val, {title: param.title}) );
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

	// 
	function toAjax(param, url){
		var me = this;
		new Ajax({
			request: url,
			param: param
		}).on('ajaxSuccess', function(){
			me.trigger('ajaxSuccess');
		}).submit();
	};

	return Disputeconfig

});