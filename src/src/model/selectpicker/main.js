"use strict";
/**
 * 基于bootstrape的select的二次封装
 * 2015,06,16 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget');

	//类
	var Selectpicker = MyWidget.extend({
		//类名
		clssName: 'Selectpicker',
		//属性
		attrs: {
			noneSelectedText: '请选择',
			selectpickerInitChange: true
		},
		//事件
		events: {
			
		},
		//初始化数据
		initProps: function(){
			var me = this;
			me.multiple = !!me.element.prop('multiple');
		},
		//入口
		setup: function(){
			var me = this;
			//初始化插件，这直接使用bootstrape的控件
			me.element.selectpicker({
				noneSelectedText: me.get('noneSelectedText')
			});
			//设置影子表单
			me.element.prop('multiple') && me.selectpickerShadow();
			//事件
			me.selectpickerChange();
		},
		destroy: function(){
			var me = this;
			me.element.data('selectpicker').destroy();
			Selectpicker.superclass.destroy.call(me);
		},
		//后期数据渲染
		//入参格式:[{key:'...',value:'...',selected:false,disabled:false}]
		selectpickerModel: function(list){
			var me = this,
				node = me.element[0];
			//干掉原始数据
			node.length = 0;
			me.breakEachArr(list, function(val, key){
				var option = new Option(val.key, val.value, !!val.selected, !!val.selected);
				option.disabled = !!val.disabled;
				node.add( option );
			});
			//重新渲染模拟的select
			me.element.data('selectpicker').refresh();
			me.selectpickerWirteValue();
			return me;
		},
		//影子表单
		selectpickerShadow: function(){
			var me = this,
				input = document.createElement('input');
			input.name = me.element.prop('name');
			input.type = 'hidden';
			me.element.after(input);
			me.selectpickerShadowNode = input;
			return me;
		},
		//change事件
		selectpickerChange: function(){
			var me = this;
			me.element.on('change', function(){
				me.selectpickerWirteValue();
				me.trigger( 'change', me.selectpickerValue() );
			});
			me.get('selectpickerInitChange') && me.element.trigger('change');
			//确保不触发change的时候值的写入
			me.selectpickerWirteValue();
			return me;
		},
		//正确解析多选的值
		selectpickerValue: function(){
			var me = this,
				arr = [],
				element = me.element;
			if(!me.multiple){
				return element.val();
			}else{
				me.breakEachArr(element[0], function(val){
					val.selected && arr.push(val.value);
				});
				return arr;
			}
		},
		//写值
		selectpickerWirteValue: function(){
			var me = this;
			me.multiple && ( me.selectpickerShadowNode.value = me.selectpickerValue().join(',') );
			return me;
		}
	});


	return Selectpicker

});