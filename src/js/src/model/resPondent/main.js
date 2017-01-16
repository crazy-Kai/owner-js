"use strict";
/**
 * 依据模板
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		domUtil = require('common/domUtil'),
		Calendar = require('common/calendar'),
		Modal = require('model/modal/main');

	var pondentHbs = require('./pondent-hbs')

	//类
	var ResPondent = MyWidget.extend({
		//组件：类名
		clssName: 'ResPondent',
		//组件：属性
		attrs: {

		},
		//组件：事件
		events: {
			'change [data-role="personChange"]': function(e){
				var me = this,
					self = $(e.target);
				// 自然人
				if( self.val() === 'normal' ){
					me.$('[data-role="normal"]').removeClass('fn-hide');
					me.$('[data-role="legal"]').addClass('fn-hide');
					domUtil.disabledTrue( me.$('[data-role="legal"]') );
					domUtil.disabledFalse( me.$('[data-role="normal"]') );
				}else{
					me.$('[data-role="normal"]').addClass('fn-hide');
					me.$('[data-role="legal"]').removeClass('fn-hide');
					domUtil.disabledTrue( me.$('[data-role="normal"]') );
					domUtil.disabledFalse( me.$('[data-role="legal"]') );
				};
			}
		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){
			var me = this,
				temp = {normal: 'legal', legal: 'normal'},
				data = $.extend({entityType: 'normal'}, me.get('data')[0], {isTest: me.get('istest'), status: me.get('status')} );

			me.element.html( pondentHbs( data ) );
			var table = me.$('[data-role="'+temp[data.entityType]+'"]');
			me.calendar = new Calendar({trigger: me.$('[name="paySuitEntityDo.birthday"]')});
			domUtil.disabledTrue( table );
			table.find('input[type="text"]').val('');

		}
	});


	return ResPondent;

});