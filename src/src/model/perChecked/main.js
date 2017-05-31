"use strict";
/**
 * 查询列表组件
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Modal = require('model/modal/main');

	//类
	var PerSubmit = MyWidget.extend({
		//类名
		clssName: 'PerSubmit',
		//属性
		attrs: {
			checked: '.JS-trigger-click-checked', //选择的checkbox
			submit: '.JS-trigger-click-submit' //提交
		},
		//初始化数据
		initProps: function(){
			var me = this,
				myEvents = {};
			myEvents['change '+me.get('checked')] = 'psToggleBtn';
			myEvents['click '+me.get('submit')] = 'psCheckedNext';
			me.psChecked = me.$( me.get('checked') );
			me.psSubmit = me.$( me.get('submit') );
			//绑定事件
			me.delegateEvents(myEvents);
			return me;
		},
		//入口
		setup: function(){
			var me = this;
			me.psSubmit.addClass('fn-btn-disabled');
			me.psToggleBtn();
			return me;
		},
		//切换
		psToggleBtn: function(e){
			var me = this;
			//未勾选
	        if(me.psChecked.prop('checked')){
	            me.psSubmit.removeClass('fn-btn-disabled');
	        }else{
	            me.psSubmit.addClass('fn-btn-disabled');
	        }
			return me;
		},
		//提交
		psCheckedNext: function(){
			var me = this;
			return !me.psSubmit.hasClass('fn-btn-disabled')
		}
	});

	return PerSubmit

});