"use strict";
/**
 * 地址基础类
 * 2015,11,11 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		util = require('common/util'),
		data = require('./data'),
		MyWidget = require('common/myWidget');

	//类
	var Address = MyWidget.extend({
		// 组件：类名
		clssName: 'Address',
		// 组件：属性
		attrs: {
			focus: "330100"	//默认选中的(浙江省，杭州市，西湖区)
		},
		// 组件：获取上级
		getTrueData: function(){
			var me = this,
				focus = me.get('focus'),
				temp,
				target,
				list = [];
			list.unshift(+focus);
			while( (temp = data[list[0]]) && (target = temp[1]) !== '1' ){
				list.unshift(+target);
			};
			return {
				area: list[2],
				city: list[1],
				province: list[0]
			};
		},
		// 组件：获取省份(第一级)
		getProvince: function(){
			var me = this,
				trueData = me.getTrueData(),
				list = [];
			eachKey(function(val, key){
				list.push({key:val[0], value:key});
			});
			return {
				focus: trueData.province,
				list: list
			};
		},
		// 组件：获取城市(第二级)
		getCity: function(){
			var me = this,
				trueData = me.getTrueData(),
				province = trueData.province,
				list = [];
			eachKey(function(val, key){
				list.push({key:val[0], value:key});
			}, (''+province).slice(0, 2));
			return {
				focus: trueData.city,
				list: list
			};
		},
		// 组件：获取地区(第三级) 特殊 比如 北京市 110000 北京市110100 延庆县110229
		getArea: function(){
			var me = this,
				trueData = me.getTrueData(),
				province = trueData.province,
				city = ''+trueData.city,
				list = [];
			for(var i = 1; i < 100; i++){
				eachKey(function(val, key){
					if(val[1] === city){
						list.push({key:val[0], value:key});
					};
				}, (''+province).slice(0, 2)+('00'+i).slice(-2));
			};
			return {
				focus: trueData.area,
				list: list
			};
		}
	});

	// 函数：补位 1 => 10000, 99 => 990000
	function paddingStr(first, key){
		return + (first + ('00'+key).slice(-2) + '000000').slice(0, 6);
	};

	// 函数：循环
	function eachKey(cb, first){
		cb = util.maybeCallback(cb);
		first = first || '';
		for(var i = 1, val, key; i < 100; i++){
			key = paddingStr(first, i);
			val = data[key]
			if(val){
				cb(val, key);
			};
		};
	};


	return Address

});