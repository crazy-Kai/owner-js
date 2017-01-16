"use strict";
/**
 * 组件选择法律依据
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		EditAccus = require('model/editAccus/main'),
		Dialog = require('dialog'),
		Modal = require('model/modal/main'),
		Ajax = require('model/ajax/main');

	//变量
	var $ = EditAccus.jQuery,
		handlerbars = EditAccus.handlerbars,
		orderTemplate = handlerbars.compile( [
			'{{#if this}}',
			'{{#each this}}',
			'<tr>',
				'<td>',
					'<input type="radio" name="orderId" value="{{orderId}}" />',
					'<input type="radio" class="fn-hide-input" name="bizOrderId" value="{{orderId}}" />',
					'<input type="radio" class="fn-hide-input" name="auctionTitle" value="{{auctionTitle}}" />',
					'<input type="radio" class="fn-hide-input" name="shopName" value="{{shopName}}" />',
					'<input type="radio" class="fn-hide-input" name="acutalTotalFee" value="{{parseAmount acutalTotalFee}}" />',
					'<input type="radio" class="fn-hide-input" name="status" value="{{status}}" />',
				'</td>',
				'<td>{{orderId}}</td>',
				'<td>{{auctionTitle}}</td>',
				'<td>{{shopName}}</td>',
				'<td>{{parseAmount acutalTotalFee}}</td>',
				'<td>{{status}}</td>',
			'</tr>',
			'{{/each}}',
			'{{else}}',
			'<tr>',
				'<td colspan="6">',
					'当前没有<span class="fn-color-F00">可以起诉的订单</span>，请选择经过购物网站投诉处理过的纠纷订单，未申请客服介入则请通过购物网站的交易纠纷投诉处理，以便调解员尽快对买卖双方进行调解',
				'</td>',
			'</tr>',
			'{{/if}}'
		].join('') );

	//类
	var Selectionorder = EditAccus.extend({
		//类名
		clssName: 'Selectionorder',
		//属性
		attrs: {
			"disputeOrderList" : "/suit/disputeOrder/listTradeOrder.json", //订单：全部查询
			"disputeOrderSelectDisputeOrder": "/suit/disputeOrder/selectDisputeOrder.json", //订单：单个查询
			"pageParam": "#pageParam",
		},
		//事件
		events: {
			'click .JS-trigger-click-search': 'soSelectionSearch' //订单：选择纠纷订单入口
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//继承
			Selectionorder.superclass.initProps.call(me);
			//页面主数据
			me.pageParam = $( me.get('pageParam') );
			//订单：模板
			me.soOrdeTemple = handlerbars.compile( me.$('.JS-temple-orde').html() );
			//订单：触发器
			me.soTriggerNode = me.$('.JS-trigger-click-select');
			//订单：弹出层**
			me.soOrderDialog = new Dialog({
				width: 800,
				closeTpl: '',
				content: me.soOrdeTemple(),
				events: {
					//确定
					'click .JS-trigger-click-sure': function(){
						var DO = me.serialize(me.soOrderDialog.contentElement);
						// 把这个订单数据DO存起来
						me.orderDo = DO;
						if(!DO.orderId){
							Modal.alert(0, '请选择订单');
						}else{
							//如果存在订单ID，且订单ID和选中的ID不一致
							if( !me.get('orderId') ){
								me.soOrderChecked(DO);
							}else if( (''+me.get('orderId')) !== DO.orderId ){
								Modal.confirm('提醒', '填写的信息将会全部更新', function(){
									me.soOrderChecked(DO);
								});
							}else{
								me.log('订单重复选择');
								me.soOrderDialog.hide();
							}
						}
					},
					//取消
					'click .JS-trigger-click-cancel': function(){
						me.soOrderDialog.hide();
					},
					//点击tr后的选择
					'click tr': function(e){
						var target = me.closest(e.target, 'tr');
						this.$('[type="radio"]').prop('checked', false);
						target.find('[type="radio"]').prop('checked',true);
					}
				}
			}).render();
			// 案由
			me.causeAction = $('select[name="causeAction"]');
			// 删除被告
			me.on('successDeleteAccus', function(){
				me.soToggleAddByCauseAction();
			});
		},
		// 订单：运行
		setup: function(){
			var me = this;
			Selectionorder.superclass.setup.call(me);
			me.soToggleAddByCauseAction();
		},
		// 订单：如果案由是网络购物合同纠纷增加不可用
		soToggleAddByCauseAction: function(){
			var me = this;
			me.$('.JS-trigger-click-add')[me.causeAction.val() === '网络购物合同纠纷' ? 'addClass': 'removeClass']('fn-btn-disabled');
			return me;
		},
		// 订单：查询
		soSelectionSearch: function(){
			var me = this;
			new Ajax({
				request: me.get('disputeOrderList'),
				autoSubmit: true,
				paramName: 'paraMap',
				parseForm: ['#bindingName', me.element],
				onAjaxSuccess: function(val, msg, con){
					//模板
					me.soOrderDialog.$('.content').html( orderTemplate(val.data) );
					//选中select
					me.soOrderDialog.$('[value="'+me.get('orderId')+'"]').prop('checked', true);
					//显示
					me.soOrderDialog.show();
				},
				onAjaxSubmitBefore: function(param){
					if(!param.bizOrderId){
						Modal.alert(0, '请输入交易订单号')
						return false;
					}
				}
			});

		},
		//订单：确定
		soOrderChecked: function(DO){
			var me = this;
			if(DO){
				
				new Ajax({
					request: me.get('disputeOrderSelectDisputeOrder'),
					autoSubmit: true,
					paramName: 'paraMap',
					param: DO,
					parseForm: ['#bindingName', '#pageParam'],
					onAjaxSuccess: function(rtv, msg, con){
						//不是[remain]重复 就是 create change
						if(rtv.status !== 'remain'){
							var suitEntityDo = rtv.suitEntityDo;
							//增加控制
							suitEntityDo.firstAccused = true;
							me.soFirstAccused.html( me.soAccusedTemple( $.extend(suitEntityDo, DO) ) );
							//设置文字
							me.soTriggerNode.val('修 改');
							//如果是change重设组件
							me.soReset();
						}else{
							me.log('订单重复选择');
						}
						me.soOrderDialog.hide();
						//显示多余的信息
						me.show('#page-allinfo');
						me.show('#page-check');
						//设置选择后的订单ID
						me.set('orderId', DO.orderId);
						//重新设置计数
						me.soAccusedGuid = me.$('.JS-target-accused').length;
						// 显示隐藏增加按钮
						me.soToggleAddByCauseAction();
					}
				});

				//设置钱
				EditAccus.getWidget('#suitRequest').suAmount = DO.acutalTotalFee;
			}
			return me;
		},
		//订单：重置
		soReset: function(){
			var me = this;
			//纠纷订单的重置
			me.$('.JS-target-accused').remove();
			//诉讼请求的重置
			EditAccus.getWidget('#suitRequest').soReset();
			//法律依据
			EditAccus.getWidget('#select-law').selectLawReset();
			//证据
			EditAccus.getWidget('#evidence').evidenceDataRender();
			//事实重置
			$('[name="fact"]').val('');
			return me;
		}
	});


	return Selectionorder

});