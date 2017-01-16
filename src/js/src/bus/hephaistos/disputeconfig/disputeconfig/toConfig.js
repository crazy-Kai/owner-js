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
		Selectpicker = require('model/selectpicker/main'),
		Ajax = require('model/ajax/main');

	// 类
	var ToConfig = MyWidget.extend({
			// 类名 
			className: 'ToConfig',
			// 配置
			attrs: {
				deleteDisputeValue: '/hephaistos/disputeValueRpc/deleteDisputeValue.json'
			},
			// 事件
			events: {
				// 诉讼请求配置
				'click [data-role="request"]': function(e){
					var me = this;
					me.disputeParam( $(e.target).data('param') );
				}
			},
			setup: function(){
				var me = this,
					seed = me.seed = Handlerbars.compile( $('#tpl-config-seed').html() );
				Handlerbars.registerPartial( 'seed', seed )  
			},
			disputeParam: function(param){
				var me = this;
				new Ajax({
					request: me.get('request'),
					param: param,
					paramName: 'filterMap'
				}).on('ajaxSuccess', function(val, msg, respone){
					val = toFilterData(val, param);
					!val.valList.length && val.valList.push({configtype: param.configtype});
					new UseTpl({
						request: me.get('requestSubmit'),
						template: '#tpl-config',
						data: $.extend({}, val, param),
						paramName: 'LassenDisputeConfigVo',
						events: {
							// 新增
							'click [data-role="add"]': function(e){
								var node = $( me.seed({isDel: true, paramList:val.paramList, configtype: param.configtype}) );
								Selectpicker.use( node.find('[data-widget="selectpicker"]') );
								$(e.target).before( node );
								this.element.find('[data-role="delete"]').show();
							},
							// 删除
							'click [data-role="delete"]': function(e){
								var self = this,
									target = $(e.target),
									node = target.closest('[data-target="row"]'),
									param = target.data('param');
								if(!param){
									Selectpicker.dead( node.find('[data-widget="selectpicker"]') );
									node.closest('[data-target="row"]').remove();
									checkDeleBtn(self.element);
								}else{
									checkDel.call(me, param, node, function(){
										checkDeleBtn(self.element);
									})
								};
							}
				 		}
					}).after('show', function(){
						checkDeleBtn(this.element);
					}).show();
				}).submit();
				return me;
			}
	});

	// 确定删除按钮
	function checkDeleBtn(element){
		var deleteNode = element.find('[data-role="delete"]');
		console.log();
		if(deleteNode.length === 1){
			deleteNode.hide();
		}
	};

	// 数据过滤
	function filterData(data, valName, paramName, cb1, cb2){
		var result = {};
		result.valList = $.map(data[valName], cb1);
		result.paramList = $.map(data[paramName], cb2);
		util.log('warn', 'before:', data, 'after:', result);
		return result;
	};

	// 数据处理
	function toFilterData(val, param){
		return param.configtype !== 'competent_court' ?
			filterData(val, 'lassenDisputeValueVolist', 'lassenDisputeParamDolist', function(val){
				return {parcode: val.parcode, sort: val.sort, configtype: param.configtype, parvalue: val.parvalue, 
						getConfig: true, bussinessid: val.bussinessid, configid: val.configid, securityId: val.securityId};
			}, function(val){
				return {parcode: val.parcode, securityId: val.securityId, parvalue: val.parvalue};
			}) : 
			// 使用管辖法院
			filterData(val, 'lassenDisputeValueVolist', 'lassenCourtlist', function(val){
				return {parcode: val.parvalue, sort: val.sort, configtype: param.configtype, parvalue: val.parvalue, 
					getConfig: true, bussinessid: val.bussinessid, configid: val.configid, securityId: val.securityId};
			}, function(val){
				return {parcode: val.courtName, securityId: val.securityId, parvalue: val.courtName};
			});
	};

	//  验证后删除
	function checkDel(param, node, cb){
		var me = this;
		new Ajax({
			request: me.get('deleteDisputeValue'),
			param: param,
			paramName: 'filterMap'
		}).on('ajaxSuccess', function(val, msg, res){
			node.remove();
			cb();
		}).submit();
	};

	return ToConfig

});