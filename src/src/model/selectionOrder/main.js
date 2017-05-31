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
		PerSearch = require('model/perSearch/main');

	//变量JS-trigger-click-editor
	var $ = EditAccus.jQuery,
		handlerbars = EditAccus.handlerbars,
		orderTemplate = [
			'{{#if this}}',
			'{{#each this}}',
			'<tr>',
				'<td>',
					'<input type="radio" name="orderId" value="{{orderId}}" />',
					'<input type="radio" class="fn-hide-input" name="bizOrderId" value="{{orderId}}" />',
					'<input type="radio" class="fn-hide-input" name="auctionTitle" value="{{auctionTitle}}" />',
					'<input type="radio" class="fn-hide-input" name="shopName" value="{{shopName}}" />',
					'<input type="radio" class="fn-hide-input" name="acutalTotalFee" value="{{acutalTotalFee}}" />',
					'<input type="radio" class="fn-hide-input" name="status" value="{{status}}" />',
				'</td>',
				'<td>{{parentOrderId}}</td>',
				'<td>{{auctionTitle}}</td>',
				'<td>{{shopName}}</td>',
				'<td>{{parseAmount acutalTotalFee}}</td>',
				'<td>{{status}}</td>',
			'</tr>',
			'{{/each}}',
			'{{else}}',
			'<tr class="ch-nohover">',
				'<td colspan="6">',
					'1.当前<span class="fn-color-F00">没有可起诉的退款纠纷订单</span>，请先确认购物网站是否正确<br />',
					'2.如在购物网站未申请退款，<span class="fn-color-F00">请先尝试进行退款</span>，以保障你的权利<br />',
					'3.如<span class="fn-color-F00">退款未协商好</span>，先在购物网站申请退款（<span class="fn-color-F00">申请过退款即可</span>），再来网上法庭起诉',
				'</td>',
			'</tr>',
			'{{/if}}'
		].join('');

	//类
	var Selectionorder = EditAccus.extend({
		//类名
		clssName: 'Selectionorder',
		//属性
		attrs: {
			"disputeOrderList" : "/suit/disputeOrder/list.json", //订单：全部查询
			"disputeOrderSelectDisputeOrder": "/suit/disputeOrder/selectDisputeOrder.json", //订单：单个查询
			"pageParam": "#pageParam",
		},
		//事件
		events: {
			'click .JS-trigger-click-select': 'soDialogShow' //订单：选择纠纷订单入口
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
							Modal.alert(0, '请选择有退款纠纷的订单');
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
								me.soPerSearch.destroy();
								me.soOrderDialog.hide();
							}
						}
					},
					//取消
					'click .JS-trigger-click-cancel': function(){
						me.soPerSearch.destroy();
						me.soOrderDialog.hide();
					},
					//点击tr后的选择
					'click tr': function(e){
						var target = me.closest(e.target, 'tr');
						this.$('[type="radio"]').prop('checked', false);
						target.find('[type="radio"]').prop('checked',true);
					},
					//改变关联账号
					'change .JS-trigger-change-account': function(){
						me.soPerSearch.searchListReload();
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
		//订单：显示
		soDialogShow: function(){
			var me = this,
				soPerSearch;
			soPerSearch = me.soPerSearch = new PerSearch({
				element: me.soOrderDialog.contentElement,
				request: me.get('disputeOrderList'),
				template: orderTemplate,
				paramName: 'paraMap',
				pageParentNode: me.soOrderDialog.$('.page'),
				onAjaxSuccess: function(){
					me.soOrderDialog.show();
					//选中select
					this.$('[value="'+me.get('orderId')+'"]').prop('checked', true);
				}
			});
		},
		//订单：确定
		soOrderChecked: function(DO){
			var me = this;
			if(DO){
				//获取被告
				me.http(me.get('disputeOrderSelectDisputeOrder'), me.paseParam( 'paraMap', $.extend( {}, DO, me.serialize(me.pageParam) ) ), function(err, rtv, msg, con){
					if(err){
						Modal.alert(0, err);
					}else{
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
						me.soPerSearch.destroy();
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