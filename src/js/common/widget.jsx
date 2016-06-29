"use strict";
/**
 * 模型
 */
define(function(require, exports, module) {
	
	const ReactDOM = require('reactDOM');
	const React = require('react');
	const limit = require('common/limit2.0');
	const $ = require('$');

	class Widget {
		constructor(config){
			this.config = config;
			this.element = $(config.element);
			this.render();
		}
		render(){
			let me = this,
				Component = me.getComponent(),
				attr = me.parseAttr();
			// 置入文档
			ReactDOM.render(
				<Component {...attr} />,
			   	me.element[0]
		 	);
		}
		parseAttr(){
			let me = this,
				obj = {},
				config = limit.assign({}, me.config),
				element = me.element,
				dataset;
			let main = (val, key) => setAttr(obj, key, element);
			if( dataset = element.prop('dataset') ){
				limit.each(dataset, main);
			}else{
				parseAttrByAttributes(element.prop('attributes'), main);
			};
			delete config.element;
			return limit.assign(obj, config);
		}
	};

	// 函数
	const setAttr = (obj, key, element) => {
		if(key !== 'element'){
			obj[key] = element.data(key);
		};
	};

	// 函数
	const REX_DATA = /^data((?:-.+)+)$/;	//严格匹配 data-a-b 只能一个"-"小写 这个有点弱
	const REX_FIRST = /-([a-z])/g;			// -a--b => a-B; -a-_b => a_b
	const parseAttrByAttributes = (attributes, callback) => {
		limit.each(attributes, function(val, index){
			let key = val.nodeName;
			if(REX_DATA.test(key)){
				key = RegExp.$1.slice(1).replace(REX_FIRST, function(a, b){
					return b.toUpperCase();
				});
				callback(val.nodeValue, key);
			}
		});
	};

	return Widget;

}); 