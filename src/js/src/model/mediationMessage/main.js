"use strict";
/**
 * 调解消息
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		Modal = require('model/modal/main'),
		Ajax = require('model/ajax/main'),
		Validator = require('common/validator'),
		Scroller = require('common/scroller');

	//变量
	var handlerbars = MyWidget.handlerbars;

	//模板
	var mmMessageTemple = handlerbars.compile( [
		'<tr>',
			'<td width="65" valign="top">',
				'<span class="fn-left fn-W50 fn-TAC fn-color-FFF fn-BGC-999">',
					'{{curUser}}',
				'</span>',
			'</td>',
			'<td>',
				'{{content}}',
			'</td>',
			'<td width="120" align="right" valign="bottom">',
				'{{formatData "yyyy/MM/dd HH:mm" gmtCreate}}',
			'</td>',
		'</tr>'
	].join('') )

	//类
	var MediationMessage = MyWidget.extend({
		//组件：类名
		clssName: 'MediationMessage',
		//组件：属性
		attrs: {
			"request": "/suit/suitMediation/save.json", //调解消息：保存请求
			"pageParam": "#page-param" //调解消息：页面变量
		},
		//组件：事件
		events: {
			//调解消息：提交
			'click .JS-trigger-click-publish': function(){
				return this.mmPuhlishMessage();
			},
			//调解消息：键盘
			// 'keypress .JS-target-textarea': function(e){
			// 	var me = this;
			// 	if(e.charCode === 13 || e.keyCode === 13){
			// 		e.preventDefault();
			// 		me.mmTextarea.val( $.trim( me.mmTextarea.val() ) );
			// 		if( me.mmTextarea.val() ){
			// 			return this.mmPuhlishMessage();
			// 		}
			// 	}
			// }
		},
		//组件：初始化数据
		initProps: function(){
			var me = this;
			//调解消息：回写的盒子
			me.mmMessageTable = me.$('.JS-target-message-table');
			//调解消息：页面变量
			me.pageParam = me.jQuery( me.get('pageParam') );
			//调解消息：输入框
			me.mmTextarea = me.$('.JS-target-textarea');
			//组件：滚动条
    		me.mmScroller = new Scroller({trigger: me.$('.JS-need-scroller')});
    		//组件：验证
    		me.mmVal = Validator.use(me.element);
			return me;
		},
		//组件：页面操作入口
		setup: function(){
			
		},
		//调解消息：消息的发送
		mmPuhlishMessage: function(){
			var me = this;
			
			//陈志文20160413, 保存之前去掉空白格字符。
			var ele = me.element.find('[name="mediationRecordDo.content"]');
			if(/^[\s]+$/.test(ele.val())){
				ele.val("");
			}

			me.mmVal.execute(function(isErr, errList){
				if(isErr){
					me.log(errList);
				}else{
					Modal.confirm('提示', '您确定要提交吗？', function(){
						new Ajax({
							request: me.get('request'),
							element: me.element,
							paramName: 'paramMap',
							autoSubmit: true,
							onAjaxSuccess: function(rtv, msg, res){
								//数据回填
								me.mmMessageWrite(rtv);
								//清空输入框
								me.mmClearTextarea();
							}
						});
					});
				}
			});
			
			return me;
		},
		//调解消息：数据的回填
		mmMessageWrite: function(json){
			var me = this;
			//回填数据
			me.mmMessageTable.prepend( mmMessageTemple( $.extend( json, me.serialize(me.pageParam) ) ) );
			//重设滚动条
			me.mmScroller.reset();
			//重绘
			me.redraw( me.mmMessageTable );
			//焦点设置
			me.mmTextarea.focus();
			return me;
		},
		//调解消息：清空输入框
		mmClearTextarea: function(){
			var me = this;
			me.mmTextarea.val('');
			return me;
		}
	});


	return MediationMessage

});