"use strict";
/**
 * 模型
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {

	var ReactDOM = require('reactDOM');
	var React = require('react');
	var limit = require('common/limit2.0');
	var $ = require('$');

	var Widget = function () {
		function Widget(config) {
			_classCallCheck(this, Widget);

			this.config = config;
			this.element = $(config.element);
			this.render();
		}

		_createClass(Widget, [{
			key: 'render',
			value: function render() {
				var me = this,
				    Component = me.getComponent(),
				    attr = me.parseAttr();
				// 置入文档
				ReactDOM.render(React.createElement(Component, attr), me.element[0]);
			}
		}, {
			key: 'parseAttr',
			value: function parseAttr() {
				var me = this,
				    obj = {},
				    config = limit.assign({}, me.config),
				    element = me.element,
				    dataset = void 0;
				var main = function main(val, key) {
					return setAttr(obj, key, element);
				};
				if (dataset = element.prop('dataset')) {
					limit.each(dataset, main);
				} else {
					parseAttrByAttributes(element.prop('attributes'), main);
				};
				delete config.element;
				return limit.assign(obj, config);
			}
		}]);

		return Widget;
	}();

	;

	// 函数
	var setAttr = function setAttr(obj, key, element) {
		if (key !== 'element') {
			obj[key] = element.data(key);
		};
	};

	// 函数
	var REX_DATA = /^data((?:-.+)+)$/; //严格匹配 data-a-b 只能一个"-"小写 这个有点弱
	var REX_FIRST = /-([a-z])/g; // -a--b => a-B; -a-_b => a_b
	var parseAttrByAttributes = function parseAttrByAttributes(attributes, callback) {
		limit.each(attributes, function (val, index) {
			var key = val.nodeName;
			if (REX_DATA.test(key)) {
				key = RegExp.$1.slice(1).replace(REX_FIRST, function (a, b) {
					return b.toUpperCase();
				});
				callback(val.nodeValue, key);
			}
		});
	};

	return Widget;
});