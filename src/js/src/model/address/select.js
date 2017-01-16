"use strict";
/**
 * 地址基础类
 * 2015,11,11 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		util = require('common/util'),
		domUtil = require('common/domUtil'),
		Address = require('./main');

	//类
	var AddressSelect = Address.extend({
		// 组件：类名
		clssName: 'AddressSelect',
		// 组件：属性
		attrs: {
			//默认选中的(浙江省，杭州市，西湖区)
			focus: {
				setter: function(val){
					var me = this;
					me.focus = val;
					me.renderSelect();
				},
				getter: function(){
					return this.focus || this.get('defaultFocus') || '000000';
				}
			},
			defaultFirst: true
		},
		events: {
			'change [data-address]': function(e){
				var me = this,
					self = $(e.target),
					val = self.val();
				me.$('[data-address]').show();
				// 如果存在的话就设置，不然就设置上一个元素
				if(val){
					me.set('focus', val);
				}else{
					me.set('focus', self.prev().val() || '000000');
				};
				me.get('defaultFirst') && self.next().trigger('change');
			}
		},
		setup: function(){
			var me = this;
			// 如果节点内部的select小于三个就重新渲染里面的select
			if( me.$('[data-address]').length === 0 ){
				// 构建页面元素
				me.nodeProvince = creatSelect('province');
				me.nodeCity = creatSelect('city');
				me.nodeArea = creatSelect('area');
				// 插入到根节点中
				me.element.append( me.nodeProvince, me.nodeCity, me.nodeArea );
			}else{
				// 省份节点
				me.nodeProvince = me.$('[data-address="province"]')[0];
				// 城市节点
				me.nodeCity = me.$('[data-address="city"]')[0];
				// 地区节点
				me.nodeArea = me.$('[data-address="area"]')[0];
			};
			me.set('focus', me.get('focus'));
		},
		// 组件：渲染值
		renderSelect: function(){
			var me = this,
				focus = me.get('focus');
			// 渲染省份
			renderSelect.call(me, 'Province');
			renderSelect.call(me, 'City');
			renderSelect.call(me, 'Area');
			// 通过规则显示
			if(!me.get('defaultFirst')){
				me.trigger('change', focus === '000000' ? '' : focus);
			}else{
				me.getTrueData().area && me.trigger('change', focus);
			};
			return me;
		}
		
	});

	// 函数：构建元素
	function creatSelect(key){
		var node = document.createElement('select');
		$(node).attr('data-address', key);
		return node;
	};

	// 函数：渲染元素
	function renderSelect(key){
		var me = this,
			data = me['get'+key](),
			node = me['node'+key];
		if(!node){
			return;
		};
		if(data.list.length === 0){
			$(node).hide();
		};
		me.get('defaultFirst') || (data.list.unshift({key: '请选择', value: ''}));
		domUtil.selectSerialize(node, data.list);
		data.focus && (node.value = data.focus);
	};


	return AddressSelect

});