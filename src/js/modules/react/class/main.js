'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require, exports, module) {
	//es6 引入class
	//在ES6里，我们通过定义一个继承自React.Component的class来定义一个组件类，像这样：
	//ES5
	var Photo1 = React.createClass({
		displayName: 'Photo1',

		render: function render() {
			return React.createElement(Image, { source: this.props.source });
		}
	});
	//ES6

	var Photo2 = function (_React$Component) {
		_inherits(Photo2, _React$Component);

		function Photo2() {
			_classCallCheck(this, Photo2);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Photo2).apply(this, arguments));
		}

		_createClass(Photo2, [{
			key: 'render',
			value: function render() {
				return React.createElement(Image, { source: this.props.source });
			}
		}]);

		return Photo2;
	}(React.Component);

	//给组建定义方法
	//ES5


	var Photo3 = React.creatClass({
		componentWillMount: function componentWillMount() {},
		render: function render() {
			return React.createElement(Image, { source: this.props.source });
		}
	});
	//ES6

	var Photo4 = function (_React$Component2) {
		_inherits(Photo4, _React$Component2);

		function Photo4() {
			_classCallCheck(this, Photo4);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Photo4).apply(this, arguments));
		}

		_createClass(Photo4, [{
			key: 'componentWillMount',
			value: function componentWillMount() {}
		}, {
			key: 'render',
			value: function render() {
				return React.createElement(Image, { source: this.props.source });
			}
		}]);

		return Photo4;
	}(React.Component);
	//定义组件的属性类型和默认属性
	//ES5


	var Video1 = React.createClass({
		displayName: 'Video1',

		getDefaultProps: function getDefaultProps() {
			return {
				autoPlay: false,
				maxLoops: 10
			};
		},
		propTypes: {
			autoPlay: React.PropTypes.bool.isRequired,
			maxLoops: React.PropTypes.number.isRequired,
			posterFrameSrc: React.PropTypes.string.isRequired,
			videoSrc: React.PropTypes.string.isRequired
		},
		render: function render() {
			return React.createElement(View, null);
		}
	});
	//ES6

	var Video2 = function (_React$Component3) {
		_inherits(Video2, _React$Component3);

		function Video2() {
			_classCallCheck(this, Video2);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Video2).apply(this, arguments));
		}

		_createClass(Video2, [{
			key: 'render',
			value: function render() {
				return React.createElement(View, null);
			}
		}]);

		return Video2;
	}(React.Component);

	Video2.defaultProps = {
		autoPlay: false,
		maxLoops: 10
	};
	Video2.propTypes = {
		autoPlay: React.PropTypes.bool.isRequired,
		maxLoops: React.PropTypes.number.isRequired,
		posterFrameSrc: React.PropTypes.string.isRequired,
		videoSrc: React.PropTypes.string.isRequired
	};
	//初始化STATE
	//ES5
	var Videos = React.createClass({
		displayName: 'Videos',

		getInitialState: function getInitialState() {
			return {
				loopsRemaining: this.props.maxLoops
			};
		}
	});
	//ES6下，有两种写法：

	//ES6

	var Videosss = function (_React$Component4) {
		_inherits(Videosss, _React$Component4);

		function Videosss(props) {
			_classCallCheck(this, Videosss);

			var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Videosss).call(this, props));

			_this4.state = {
				loopsRemaining: _this4.props.maxLoops
			};
			return _this4;
		}

		return Videosss;
	}(React.Component);
	//把方法作为回调提供
	//ES5


	var PostInfo = React.createClass({
		displayName: 'PostInfo',

		handleOptionsButtonClick: function handleOptionsButtonClick(e) {
			// Here, 'this' refers to the component instance.
			this.setState({ showOptionsModal: true });
		},
		render: function render() {
			return React.createElement(
				TouchableHighlight,
				{ onPress: this.handleOptionsButtonClick },
				React.createElement(
					Text,
					null,
					this.props.label
				)
			);
		}
	});
	//ES6

	var PostInfosss = function (_React$Component5) {
		_inherits(PostInfosss, _React$Component5);

		function PostInfosss() {
			_classCallCheck(this, PostInfosss);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(PostInfosss).apply(this, arguments));
		}

		_createClass(PostInfosss, [{
			key: 'handleOptionsButtonClick',
			value: function handleOptionsButtonClick(e) {

				this.setState({ showOptionsModal: true });
			}
		}, {
			key: 'render',
			value: function render() {
				return React.createElement(
					TouchableHighlight,
					{
						onPress: this.handleOptionsButtonClick.bind(this)

					},
					React.createElement(
						Text,
						null,
						this.props.label
					)
				);
			}
		}]);

		return PostInfosss;
	}(React.Component);
	//需要注意的是，不论是bind还是箭头函数，每次被执行都返回的是一个新的函数引用，因此如果你还需要函数的引用去做一些别的事情（譬如卸载监听器），那么你必须自己保存这个引用


	var PauseMenu = function (_React$Component6) {
		_inherits(PauseMenu, _React$Component6);

		function PauseMenu(props) {
			_classCallCheck(this, PauseMenu);

			var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(PauseMenu).call(this, props));

			_this6._onAppPaused = _this6.onAppPaused.bind(_this6);
			return _this6;
		}

		_createClass(PauseMenu, [{
			key: 'componentWillMount',
			value: function componentWillMount() {
				AppStateIOS.addEventListener('change', this._onAppPaused);
			}
		}, {
			key: 'componentDidUnmount',
			value: function componentDidUnmount() {
				AppStateIOS.removeEventListener('change', this._onAppPaused);
			}
		}, {
			key: 'onAppPaused',
			value: function onAppPaused(event) {}
		}]);

		return PauseMenu;
	}(React.Component);
	//Mixins  在ES5下，我们经常使用mixin来为我们的类添加一些新的方法，譬如PureRenderMixin


	var PureRenderMixin = require('react-addons-pure-render-mixin');
	React.createClass({
		mixins: [PureRenderMixin],

		render: function render() {
			return React.createElement(
				'div',
				{ className: this.props.className },
				'foo'
			);
		}
	});
	//然而现在官方已经不再打算在ES6里继续推行Mixin，他们说：Mixins Are Dead. Long Live Composition。

	//使用高阶组件替代Mixins方法如下:

	React.createElement(
		'div',
		_extends({}, this.props, { className: 'override' }),
		'…'
	);
});