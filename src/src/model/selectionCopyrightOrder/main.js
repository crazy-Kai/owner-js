"use strict";
/**
 * 组件选择法律依据
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		EditAccus = require('model/editAccus/main'),
		Modal = require('model/modal/main'),
		Ajax = require('model/ajax/main');

	//变量
	var $ = EditAccus.jQuery,
		handlerbars = EditAccus.handlerbars;

	//类
	var SelectionCopyrightOrder = EditAccus.extend({
		//类名
		clssName: 'SelectionCopyrightOrder',
		//属性
		attrs: {
			"getCopyRightInfo" : "/suit/copyRightOrder/getCopyRightInfo.json", //订单：全部查询
			"pageParam": "#pageParam",
		},
		//事件
		events: {
			//订单：选择纠纷订单入口
			'click .JS-trigger-cick-order': function(){
				return this.soGetInfo();
			} 
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//继承
			SelectionCopyrightOrder.superclass.initProps.call(me);
		},
		//订单；获取信息
		soGetInfo: function(){
			var me = this;
			new Ajax({
				autoSubmit: true,
				request: me.get('getCopyRightInfo'),
				parseForm: [me.element, me.get('pageParam'), '#bindingName'],
				paramName: 'paraMap',
				onAjaxSuccess: function(rtv, msg, res){
					//不是[remain]重复 就是 create change
					if(rtv.status === 'error'){
						Modal.alert(0, '该商品还未被投诉。');
					}else if(rtv.status !== 'remain'){
						var copyRightOrderDo = rtv.copyRightOrderDo,
							suitEntityDo = rtv.suitEntityDo;
						//增加控制
						suitEntityDo.firstAccused = true;
						suitEntityDo.copyright = true;
						me.soFirstAccused.html( me.soAccusedTemple( $.extend(suitEntityDo, copyRightOrderDo) ) );
						//重设
						me.soReset();
						//重新设置计数
						me.soAccusedGuid = me.$('.JS-target-accused').length;
						//显示
						me.show('#page-allinfo');
						me.show('#page-check');
						//设置一个显示隐藏的标记
						me.set('soHasOrder', true);
					}else{
						me.log('订单重复选择');
					}
				}
			});
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


	return SelectionCopyrightOrder

});