"use strict";
/**
 * 分页组件
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget');

	//变量
	var $ = MyWidget.jQuery,
		util = require('common/util'),
		handlerbars = MyWidget.handlerbars;

	//类
	var Suitrequest = MyWidget.extend({
		//类名
		clssName: 'Suitrequest',
		//属性
		attrs: {
			requestType: {
				"refund_ten": 11,
				"refund_three": 4,
				"refund_one": 2,
				"ten_times": 10,
				"three_times": 3,
			}
		},
		//事件
		events: {
			//改变赔偿
			'change .JS-tigger-change-suit': 'suChangeSuit',
			//增加赔偿
			'click .JS-trigger-click-add': function(e){
				this.suAddSuit({deleteFlag: true}, $(e.target).closest('.JS-trigger-click-add'));
			},
			//删除赔偿
			'click .JS-trigger-click-delete': 'suDelSuit'
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//新增模板
			me.suAddSuitemple = handlerbars.compile(  me.$('.JS-target-temple').html() );
			//钱
			me.suAmount = $('#selectionOrder').data('totalFee') || 0;
		},
		//入口
		setup: function(){
			var me = this;
			!me.get('size') && me.suAddSuit({deleteFlag: false});
		},
		//选择诉讼请求
		suChangeSuit: function(e){
			var me = this;
			if(e){
				var target = $(e.target),
					list = target.closest('.JS-target-list'),
					val = target.val(),
					money = list.find('.JS-target-money'),
					otherSuit = list.find('.JS-target-other-suit'),
					law500 = list.find('.JS-target-law500'),
					pay;
				//隐藏 赔偿
				hideDiv(money);
				hideDiv(otherSuit);
				hideDiv(law500);
				if(val){
					//其他 赔偿
					if(val === 'other'){
						showDiv(otherSuit);
					}else{
						showDiv(money);
						pay = me.get('requestType')[val] * me.suAmount;
						//退一赔三
						if(val === 'refund_three'){
							pay = +me.suAmount;
							showDiv(law500);
							if( pay * 3 <= 500 ){
								pay += 500;
							}else{
								pay *= 4;
							}
						}
						me.soSetMoney(money, pay);
					}
				}
			}
			return me;
		},
		//增加诉讼请求
		suAddSuit: function(obj, node){
			var me = this;
			node ? node.before( me.suAddSuitemple(obj) ) : me.element.html( me.suAddSuitemple(obj) );
			return me;
		},
		//删除诉讼请求
		suDelSuit: function(e){
			var me = this;
			if(e){
				me.closest(e.target, '.JS-target-list').remove();
			}
			return me;
		},
		//重置
		soReset: function(){
			var me = this;
			me.element.html(me.suAddSuitemple({deleteFlag: false}));
			return me;
		},
		//设置money
		soSetMoney: function(node, pay){
			var me = this;
			//显示
			node.find('.JS-target-money-text').html(util.formatMoney(pay, 2));
			//表单
			node.find('.JS-target-money-input').val(pay);
			return me;
		}
	});

	//函数：隐藏内容，设置disabled
	function hideDiv(node){
		MyWidget.hide(node);
		MyWidget.disabledTrue(node);
	}

	//函数：显示内容，去除disabled
	function showDiv(node){
		MyWidget.show(node);
		MyWidget.disabledFalse(node);
	}



	return Suitrequest

});