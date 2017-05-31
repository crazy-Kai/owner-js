"use strict";
/**
 * 依据模板
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		Ajax = require('model/ajax/main'),
		domUtil = require('common/domUtil'),
		Dialog = require('common/dialog'),
		Upload = require('model/upload/main'),
		Validator = require('common/validator'),
		Modal = require('model/modal/main');

	var applicationMattersHbs = require('./applicationMatters-hbs')
	var dataTemplateHbs = require('./dataTemplate-hbs')
	var paymentCountHbs = require('./paymentCount-hbs')

	//验证
    var validatorExp = Validator.use('#template');
	//类
	var ApplicationMatters = MyWidget.extend({
		//组件：类名
		clssName: 'ApplicationMatters',
		//组件：属性
		attrs: {
			pageParam: domUtil.serialize('#pageParam')
		},
		//组件：事件
		events: {
			'click [data-role="data"]':function(rtv){
				var me = this;
				var dialog = Dialog.show(dataTemplateHbs(me.get('pageParam')),{
					width:480,
					events:{
						'click [data-role="submit"]':function(){
							new Ajax({
								request:'/suit/billCalculationRpc/calculationExcel.json',
								parseForm:this.element
							}).on('ajaxSuccess', function(rtv, msg, con){
								$('#noneDataTemplate').replaceAll(paymentCountHbs());

								dialog.hide();
							}).submit();
						}
					}
				}).after('hide',function(){
					dataUpload.destroy();
				});
		        var dataUpload = Upload.use( dialog.$('[data-widget="upload"]'))[0];
			}
		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){
			var me = this,
				data = me.get('data');
			me.element.html( applicationMattersHbs({application: data[0], other: data[1]}) );
			domUtil.onChange(me.$('#amoutChangeHandle'), function(){
				var val = $(this).val();
				getAllAmount();
			});
		}
	});

	function getAllAmount(){
	}

	return ApplicationMatters;

});