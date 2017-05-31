"use strict";
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget');

	//类
	var RealTime = MyWidget.extend({
		//组件：类名
		clssName: 'RealTime',
		//组件：属性
		attrs: {
			textarea: '.JS-target-textarea',
			textshow: '.JS-target-textshow'
		},
		//组件：事件
		events: {

		},
		//组件：初始化数据
		initProps: function(){
			var me = this;
			me.textarea = me.$( me.get('textarea') );
			me.textshow = me.$( me.get('textshow') );
			me.maxlength = me.textarea.attr('maxlength');
			me.textarea.removeAttr('maxlength');
			me.oldVal = null;
		},
		//组件：页面操作入口
		setup: function(){
			var me = this,
				guid = 0;
			//绑定特殊事件
			me.delegateEvents(me.textarea, 'realTime', function(){
				me.rtCountString();
			});
			//W3C
			me.delegateEvents(me.textarea, 'input', function(){
				me.rtCountString();
			});
			//IE9 IE9 input 不支持 退格
			document.documentMode === 9 && me.delegateEvents(me.textarea, 'keyup', function(e){
				e.keyCode === 8 && me.rtCountString();
			});
			//IE8
			document.documentMode === 8 && me.delegateEvents(me.textarea, 'propertychange', function(e){
				if(e.originalEvent.propertyName === 'value'){
					me.rtCountString();
				}
			});
			document.documentMode === 8 &&  me.delegateEvents(me.textarea, 'paste', function(e){
				setTimeout(function(){
					me.rtCountString();
				}, 0);
			});
			// 初始化的时候
			me.rtCountString();
		},
		//计算字符
		rtCountString: function(){
			var me = this,
				val = me.textarea.val(),
				newVal = val.slice(0, me.maxlength);
			if(val === me.oldVal){
				return;
			};
			me.oldVal = newVal;
			//去掉空格
			// /^\s+|\s+$/.test(val) && me.textarea.val( $.trim( val ) );
			me.textarea.val( newVal );
			me.textshow.html( newVal.length );
		}
	});


	return RealTime

});