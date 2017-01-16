"use strict";
/**
 * 依据模板
 */
define(function(require, exports, module) {

	//依赖 
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		Ajax = require('model/ajax/main'),
		util = require('common/util'),
		limit = require('common/limit'),
		domUtil = require('common/domUtil'),
		Dialog = require('common/dialog'),
		Upload = require('model/upload/main'),
		Calendar = require('common/calendar'),
		Validator = require('common/validator'),
		Modal = require('model/modal/main');

	var applicationMattersHbs = require('./applicationMatters-hbs')
	var dataTemplateHbs = require('./dataTemplate-hbs')
	var paymentCountHbs = require('./paymentCount-hbs')
	var paymentStatesHbs = require('./paymentStates-hbs')

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
				var dialog = Dialog.show(dataTemplateHbs($.extend({
						url: me.get('url'), 
						businessDate: me.$('[name="businessDate"]').val(),
						requestType:me.$('[name="requestType"]').val()
					}, me.get('pageParam')) ),{
						width:480,
						events:{
							//上传并计算
							'click [data-role="submit"]':function(){
								var innerMe = this;
								validatorExp.execute(function(isError){
									if(!isError){
										new Ajax({
											request:'/suit/billCalculationRpc/calculationExcel.json',
											parseForm:innerMe.element
										}).on('ajaxSuccess', function(rtv, msg, con){
											//失去焦点时表单的值设置为true
											me.$('[data-targer="creditCardFulldata"]').val("true").blur();
											// 模板
											me.$('#noneDataTemplate').html( paymentCountHbs(rtv) );
											// 计算应还总金额
											totalAmount.call(me, rtv.billMonthDataVos)
											dialog.hide();
										}).submit();
									}
								});
							},
							//上传
							'click [data-role="paymentUpload"]':function(){
								var uploadMe = this;
								validatorExp.execute(function(isError){
									if(!isError){
										new Ajax({
											request:'/suit/billCalculationRpc/uploadOtherExcel.json',
											parseForm:uploadMe.element
										}).on('ajaxSuccess', function(rtv, msg, con){
											me.$('[data-targer="paymentFullstates"]').val("true").blur();
											//模板
											me.$('#paymentStates').append( paymentStatesHbs(rtv) );
											dialog.hide();
										}).submit();
									}
								});
							}			
						}
				}).before('hide',function(){
					dataUpload.destroy();
					// 验证销毁
					validatorExp.destroy();
				});
		        var dataUpload = Upload.use( dialog.$('[data-widget="upload"]'))[0];
		        // 验证实例化
		        var validatorExp = Validator.use(dialog.element, '[data-widget="validator"]');
			},
			//申请事项下拉框选择
			'change [data-role="typeChange"]': function(e){
				var me = this,
					self = $(e.target);
				// 花呗
				if( self.val() === 'creditCard' ){
					me.$('[data-role="creditCard"]').removeClass('fn-hide');
					me.$('[data-role="payment_other"]').addClass('fn-hide');
					domUtil.disabledTrue( me.$('[data-role="payment_other"]') );
					domUtil.disabledFalse( me.$('[data-role="creditCard"]') );
				}else{
					me.$('[data-role="creditCard"]').addClass('fn-hide');
					me.$('[data-role="payment_other"]').removeClass('fn-hide');
					domUtil.disabledTrue( me.$('[data-role="creditCard"]') );
					domUtil.disabledFalse( me.$('[data-role="payment_other"]') );
				};
			},
			//删除导入的文件
			'click .JS-trigger-click-remove': function(e){
				var me = this,
					target = me.closest(e.target, '.JS-target-item');
				new Ajax({
					request:'/fileOperation/deleteFile.json',
					param:{fileIdStr: target.data('id')}
				}).on('ajaxSuccess',function(rtv, msg, con){
					target.remove();
					if(!me.$('#paymentStates .JS-target-item').length){
						me.$('[data-targer="paymentFullstates"]').val('')
					};
				}).submit();
			},
			//下拉框选择百分制
			'click [name="rateType"]':function(e){
				var me = this,
					self = $(e.target);
				if(self.val() == 'hundredMarkSystem'){
					me.$('[data-role="hundredMarkSystem"]').removeClass('fn-hide');
					me.$('[data-role="micrometerSystem"]').addClass('fn-hide');
				}else{
					me.$('[data-role="hundredMarkSystem"]').addClass('fn-hide');
					me.$('[data-role="micrometerSystem"]').removeClass('fn-hide');
				}
			},
			'blur [data-role="otherAmount"]':function(){
				var me = this;
				getSumAmount.call(me);
			}
		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){
			var me = this,
				temp = {creditCard: 'payment_other', payment_other: 'creditCard'},
				data = me.get('data'),
				billList = me.get('billList'),
				fileDos = me.get('fileDos');
			data = {
				application: $.extend({requestType: 'creditCard', businessDate: new Date().getTime(),rateType:'hundredMarkSystem'}, data[0]), 
				other: $.extend({}, data[1]), 
				amount: me.get('amount')};
			formatAmout(data);
			me.element.html( applicationMattersHbs(data) );

			//disable表单
			var table = me.$('[data-role="'+temp[data.application.requestType]+'"]');
			domUtil.disabledTrue( table );
		    table.addClass('fn-hide');
		    table.find('input[type="text"]')
		    	.not('[name="businessDate"]')
		    	.not('[data-targer="paymentFullstates"]')
		    	.not('[data-targer="creditCardFulldata"]')
		    	.not('#amoutChangeHandle')
		    	.val('');

			if(billList.billMonthDataVos.length){
				me.$('[data-targer="creditCardFulldata"]').val("true").blur();
				data.application && (billList.content = data.application.content);
				me.$('#noneDataTemplate').html( paymentCountHbs(billList) );
				// 计算应还总金额
				totalAmount.call(me, billList.billMonthDataVos);
			};
			
			if(fileDos.length){
				me.$('[data-targer="paymentFullstates"]').val("true").blur();
				//模板
				me.$('#paymentStates').html( paymentStatesHbs(fileDos) );
			};
			
			domUtil.onChange(me.$('#amoutChangeHandle'), function(){
				var self = $(this);
				setTimeout(function(){
					var val = self.val();
					getAllAmount.call(me);
				}, 0);
			});
			//组件：日期
		    new Calendar({
		    	trigger: me.$('#businessDate'),
		    	onSelectDate:function(date){
		    		new Ajax({
		    			request:"/suit/billCalculationRpc/recalculateExcel.json",
		    			param:{securityCaseId:me.get('pageParam').securityCaseId,businessDate:util.formatData("yyyy-MM-dd", +date)}
		    		}).on('ajaxSuccess',function(rtv, msg, con){
		    			// 模板
						me.$('#noneDataTemplate').html( paymentCountHbs(rtv) );
						// 计算应还总金额
						totalAmount.call(me, rtv.billMonthDataVos)
		    		}).submit();
		    	},
		        range:function(date){
		            return date <= new Date().getTime();
		        }
		    });
		    //其他选项的日期
		    new Calendar({
		    	trigger: me.$('#paymentFullBusinessDate'),
		    	range:function(date){
		            return date <= new Date().getTime();
		        }
		    });
		}
	});
	//累计应还总金额
	function totalAmount(list){
		var me = this,
			amount = 0;
		if(list.length){
			amount = limit.reduce(list, function(res, val){return res + val.currentAccum}, 0);
		};
		me.$('[data-trigger="totalAmount"]').each(function(){
			var self = $(this);
			// 如果是表单不需要千分位
			if(self.prop('type') === 'hidden'){
				self.val(amount);
			}else{
				self.html( util.formatMoney(amount, 2) );
			};
		});
		getAllAmount.call(me);
	};
	//申请总金额
	function getAllAmount(){
		var me = this,
			amountNodes = me.$('[data-role="sumAmount"]'),
			allAmount = limit.reduce( amountNodes, function(res, val){
				return res + (+val.value || 0);
			}, 0 );
		me.$('[data-role="applyAmount"]').html( util.formatMoney(allAmount, 2) );
		me.$('[data-role="applyAmountValue"]').val(allAmount);
	};
	//其他中三项金额相加
	function getSumAmount(){
		var me = this,
			sumAmountNodes = me.$('[data-role="otherAmount"]'),
			sumAllAmount = limit.reduce( sumAmountNodes, function(res,val){
				return res + (+val.value || 0);
			},0);
		me.$('[data-role="otherAmountValue"]').val(sumAllAmount);
	};
	// 格式化amount
	function formatAmout(data){
		// 格式化数据，正确显示amount
		switch(data.application.requestType){
			// 花呗
			case 'creditCard': 
				data.application.creditCardAmount = data.application.amount;
				delete data.application.amount;
				data.other.creditCardAmount = data.other.amount;
				delete data.other.amount;
				data.creditCardAmount = data.amount;
				delete data.amount;
			break;
			// 其他
			case 'payment_other': 
				data.application.paymentOtherAmount = data.application.amount;
				delete data.application.amount;
				data.other.paymentOtherAmount = data.other.amount;
				delete data.other.amount;
				data.paymentOtherAmount = +data.amount;
				delete data.amount;
			break
		};
	};

	return ApplicationMatters;

});