"use strict";
/**
 * 模型
 */

define(function (require, exports, module) {

  return require('common/hoc')(require('./view'), require('./controller'));
});
"use strict";
/**
 * 模型
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require, exports, module) {

	// 依赖
	var React = require('react');
	var Actions = require('./controller').Actions;

	var View = function (_React$Component) {
		_inherits(View, _React$Component);

		function View() {
			_classCallCheck(this, View);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments));
		}

		_createClass(View, [{
			key: 'render',
			value: function render() {
				var me = this,
				    props = me.props;
				return React.createElement(
					'div',
					null,
					props.a,
					' ',
					props.b,
					' ',
					React.createElement(
						'a',
						{ href: 'javascript:;', onClick: Actions.add },
						'点击'
					)
				);
			}
		}]);

		return View;
	}(React.Component);

	;

	return View;
});
"use strict";
/**
 * 模型
 */

define(function (require, exports, module) {

	// 依赖

	var Control = require('common/controller');

	// 隐藏方法 this.updateComponent().then();
	return Control({
		store: {
			a: 'a1'
		},
		getInitialState: function getInitialState() {
			return this.store;
		},
		onAdd: function onAdd() {
			var me = this,
			    store = me.store;
			me.ajax({
				request: '/portal/mediatorRpc/queryMediator.json',
				param: { filterMap: JSON.stringify({ "cityId": "", "mediatorType": "", "page": { "begin": 0, "length": 8 } }) }
			}).then(function () {
				store.b = 'b2';
				me.updateComponent();
			}, function () {
				console.log('error');
			});
		}
	});
});
"use strict";
/**
 * 模型
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require, exports, module) {

	// 依赖
	var React = require('react');
	var Actions = require('./controller').Actions;

	var View = function (_React$Component) {
		_inherits(View, _React$Component);

		function View() {
			_classCallCheck(this, View);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments));
		}

		_createClass(View, [{
			key: 'render',
			value: function render() {
				var me = this,
				    props = me.props;
				return React.createElement(
					'div',
					null,
					props.a,
					' ',
					props.b,
					' ',
					React.createElement(
						'a',
						{ href: 'javascript:;', onClick: Actions.add },
						'点击'
					)
				);
			}
		}]);

		return View;
	}(React.Component);

	;

	return View;
});
"use strict";
/**
 * 模型
 */

define(function (require, exports, module) {

	// 依赖

	var Control = require('common/controller');

	// 隐藏方法 this.updateComponent().then();
	return Control({
		store: {
			a: 'a1'
		},
		getInitialState: function getInitialState() {
			return this.store;
		},
		onAdd: function onAdd() {
			var me = this,
			    store = me.store;
			me.ajax({
				request: '/portal/mediatorRpc/queryMediator.json',
				param: { filterMap: JSON.stringify({ "cityId": "", "mediatorType": "", "page": { "begin": 0, "length": 8 } }) }
			}).then(function () {
				store.b = 'b2';
				me.updateComponent();
			}, function () {
				console.log('error');
			});
		}
	});
});
"use strict";
/**
 * 模型
 */

define(function (require, exports, module) {

	// 依赖

	var Control = require('common/controller');

	// 隐藏方法 this.updateComponent().then();
	return Control({
		store: {
			a: 'a1'
		},
		getInitialState: function getInitialState() {
			return this.store;
		},
		onAdd: function onAdd() {
			var me = this,
			    store = me.store;
			me.ajax({
				request: '/portal/mediatorRpc/queryMediator.json',
				param: { filterMap: JSON.stringify({ "cityId": "", "mediatorType": "", "page": { "begin": 0, "length": 8 } }) }
			}).then(function () {
				store.b = 'b2';
				me.updateComponent();
			}, function () {
				console.log('error');
			});
		}
	});
});