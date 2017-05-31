"use strict";
/**
 * 组件：选择法条
 * 2015,06,28 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Dialog = require('dialog'),
		Tab = require('model/tab/main'),
		Scroller = require('common/scroller');

	//变量
	var $ = MyWidget.jQuery,
		handlerbars = MyWidget.handlerbars;

	//函数

	//类
	var Selectlaw = MyWidget.extend({
		//类名
		clssName: 'Selectlaw',
		//属性
		attrs: {
			selectLawContent: '.JS-target-content',
			selectLawTemple: '.JS-target-temple',
			selectLawIntro: '.JS-target-intro'
		},
		//事件
		events: {
			'click .JS-trigger-click-select': 'selectLawShow'
		},
		//初始化数据
		initProps: function(){
			var me = this,
				selectLawDialog,
				selectLawContent,
				selectLawTemple,
				selectLawIntro;
			//模板
			selectLawTemple = me.selectLawTemple = handlerbars.compile( me.$(me.get('selectLawTemple')).html() );
			//回填内容
			selectLawIntro = me.selectLawIntro = me.$(me.get('selectLawIntro'));
			//弹出层内容
			selectLawContent = me.selectLawContent = me.$(me.get('selectLawContent'));
			//弹出框
			selectLawDialog = me.selectLawDialog = new Dialog({
				width: 880,
				height: 400,
				closeTpl: '',
				content: selectLawContent,
				events: {
					'click .JS-trigger-click-cancel': function(){
						me.selectLawHide();
					},
					'click .JS-trigger-click-sure': function(){
						me.selectLawHide();
						me.selectLawDoParse();
						
					}
				}
			}).render();
			//切换
			me.selectLawTab = new Tab({
				element: selectLawDialog.contentElement
			});
			//滚动
			me.selectLawScroll = new Scroller({trigger: selectLawIntro});
		},
		//入口
		setup: function(){
			var me = this;
		},
		//销毁
		destroy: function(){
			var me = this;
			me.selectLawDialog.destroy();
			me.selectLawTab.destroy();
			Selectlaw.superclass.destroy.call(this);
		},
		//显示
		selectLawShow: function(){
			var me = this,
				selectLawDialog = me.selectLawDialog;
			selectLawDialog.show();
		},
		//隐藏
		selectLawHide: function(){
			var me = this,
				selectLawDialog = me.selectLawDialog;
			selectLawDialog.hide();
		},
		//解析数据
		selectLawDoParse: function(){
			var me = this,
				json = {},
				data = me.serialize(me.selectLawContent),
				id = [];
			
			//数据解析
			me.breakEachObj(data, function(val, key){
				var arr = data[key] = [];
				me.breakEachArr(val.split(','), function(val, index){
					if(index % 3 !== 2){
						arr.push(val);
					}else{
						id.push(val);
					}
				});
			});
			//重置滚动条
			me.selectLawScroll.setContent( me.selectLawTemple({
				data: data,
				id: id.join(',')
			}) );
			//数据更换
			me.$('[name="basisContent"]').val( me.$('[name="basisContent-shadow"]').val() );
			return me;
		},
		//重置
		selectLawReset: function(){
			var me = this;
			me.selectLawScroll.setContent('');
			me.selectLawContent.find('[type="checkbox"]').prop('checked', false);
			return me;
		}
	});

	return Selectlaw

});