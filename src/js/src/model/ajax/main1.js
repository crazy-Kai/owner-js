"use strict";
/**
 * 依据模板
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Modal = require('model/modal/main');

	//类
	var Ajax = MyWidget.extend({
		//组件：类名
		clssName: 'Ajax',
		//组件：属性
		attrs: {
			"request": "", //请求
			"paramName": null, //参数名
			"autoDestroy": true, //发送请求后自动销毁
			"autoErrorAlert": true, //失败后的自动提示
			"autoSuccessAlert": false, //成功后的自动提示
			"autoSubmit": false, //初始化自动提交
			"method": "http", //默认的请求方法
			"type": "post",
			"param": {}, //参数
			"paramParse": MyWidget.K, //参数工厂方法
			"parseForm": '', //表单
			"needText": false
		},
		//组件：事件
		events: {

		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){
			var me = this;
			me.get('autoSubmit') && me.submit();
		},
		//请求：序列化表单
		serializeForm: function(){
			var me = this,
				param = me.get('param'),
				parseForm = [me.element].concat(me.get('parseForm'));
			//混合
			me.breakEachArr(parseForm, function(form){
				form = $(form);
				if(form.length){
					$.extend(param, me.serialize(form));
				}
			});
			return me.get('paramParse')(param);
		},
		//请求：提交
		submit: function(){
			var me = this,
				paramName = me.get('paramName'),
				DO = me.serializeForm(),
				param = paramName ? me.paseParam( paramName, DO ) : DO;
			me.trigger('ajaxSubmitBefore', DO) && me[me.get('method')]( me.get('request'), param, me.get('type'), function(err, rtv, msg, con){
				var args = me.setArray(arguments);
				args.push(DO);
				if(err){
					me.get('autoErrorAlert') && Modal.alert(0, err);
					args.unshift('ajaxError');
					me.trigger.apply(me, args);
				}else{
					me.get('autoSuccessAlert') && Modal.alert(1, msg);
					args.shift();
					args.unshift('ajaxSuccess');
					me.trigger.apply(me, args);
				}
				//请求：成功后自我销毁
				me.get('autoDestroy') && me.destroy();
			}, {needText: me.get('needText')} );
			return me;
		}
	});


	return Ajax

});