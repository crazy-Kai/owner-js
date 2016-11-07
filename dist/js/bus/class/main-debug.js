"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
}

function _possibleConstructorReturn(self, call) {
    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !call || "object" != typeof call && "function" != typeof call ? self : call
}

function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass)
}
var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key])
        }
        return target
    },
    _createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor)
            }
        }
        return function(Constructor, protoProps, staticProps) {
            return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
        }
    }();
define("bus/class/main-debug", ["react-addons-pure-render-mixin-debug"], function(require, exports, module) {
    var Video2 = (React.createClass({
        displayName: "Photo1",
        render: function() {
            return React.createElement(Image, {
                source: this.props.source
            })
        }
    }), function(_React$Component) {
        function Photo2() {
            return _classCallCheck(this, Photo2), _possibleConstructorReturn(this, Object.getPrototypeOf(Photo2).apply(this, arguments))
        }
        return _inherits(Photo2, _React$Component), _createClass(Photo2, [{
            key: "render",
            value: function() {
                return React.createElement(Image, {
                    source: this.props.source
                })
            }
        }]), Photo2
    }(React.Component), React.creatClass({
        componentWillMount: function() {},
        render: function() {
            return React.createElement(Image, {
                source: this.props.source
            })
        }
    }), function(_React$Component2) {
        function Photo4() {
            return _classCallCheck(this, Photo4), _possibleConstructorReturn(this, Object.getPrototypeOf(Photo4).apply(this, arguments))
        }
        return _inherits(Photo4, _React$Component2), _createClass(Photo4, [{
            key: "componentWillMount",
            value: function() {}
        }, {
            key: "render",
            value: function() {
                return React.createElement(Image, {
                    source: this.props.source
                })
            }
        }]), Photo4
    }(React.Component), React.createClass({
        displayName: "Video1",
        getDefaultProps: function() {
            return {
                autoPlay: !1,
                maxLoops: 10
            }
        },
        propTypes: {
            autoPlay: React.PropTypes.bool.isRequired,
            maxLoops: React.PropTypes.number.isRequired,
            posterFrameSrc: React.PropTypes.string.isRequired,
            videoSrc: React.PropTypes.string.isRequired
        },
        render: function() {
            return React.createElement(View, null)
        }
    }), function(_React$Component3) {
        function Video2() {
            return _classCallCheck(this, Video2), _possibleConstructorReturn(this, Object.getPrototypeOf(Video2).apply(this, arguments))
        }
        return _inherits(Video2, _React$Component3), _createClass(Video2, [{
            key: "render",
            value: function() {
                return React.createElement(View, null)
            }
        }]), Video2
    }(React.Component));
    Video2.defaultProps = {
        autoPlay: !1,
        maxLoops: 10
    }, Video2.propTypes = {
        autoPlay: React.PropTypes.bool.isRequired,
        maxLoops: React.PropTypes.number.isRequired,
        posterFrameSrc: React.PropTypes.string.isRequired,
        videoSrc: React.PropTypes.string.isRequired
    };
    var PureRenderMixin = (React.createClass({
        displayName: "Videos",
        getInitialState: function() {
            return {
                loopsRemaining: this.props.maxLoops
            }
        }
    }), function(_React$Component4) {
        function Videosss(props) {
            _classCallCheck(this, Videosss);
            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Videosss).call(this, props));
            return _this4.state = {
                loopsRemaining: _this4.props.maxLoops
            }, _this4
        }
        return _inherits(Videosss, _React$Component4), Videosss
    }(React.Component), React.createClass({
        displayName: "PostInfo",
        handleOptionsButtonClick: function(e) {
            this.setState({
                showOptionsModal: !0
            })
        },
        render: function() {
            return React.createElement(TouchableHighlight, {
                onPress: this.handleOptionsButtonClick
            }, React.createElement(Text, null, this.props.label))
        }
    }), function(_React$Component5) {
        function PostInfosss() {
            return _classCallCheck(this, PostInfosss), _possibleConstructorReturn(this, Object.getPrototypeOf(PostInfosss).apply(this, arguments))
        }
        return _inherits(PostInfosss, _React$Component5), _createClass(PostInfosss, [{
            key: "handleOptionsButtonClick",
            value: function(e) {
                this.setState({
                    showOptionsModal: !0
                })
            }
        }, {
            key: "render",
            value: function() {
                return React.createElement(TouchableHighlight, {
                    onPress: this.handleOptionsButtonClick.bind(this)
                }, React.createElement(Text, null, this.props.label))
            }
        }]), PostInfosss
    }(React.Component), function(_React$Component6) {
        function PauseMenu(props) {
            _classCallCheck(this, PauseMenu);
            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(PauseMenu).call(this, props));
            return _this6._onAppPaused = _this6.onAppPaused.bind(_this6), _this6
        }
        return _inherits(PauseMenu, _React$Component6), _createClass(PauseMenu, [{
            key: "componentWillMount",
            value: function() {
                AppStateIOS.addEventListener("change", this._onAppPaused)
            }
        }, {
            key: "componentDidUnmount",
            value: function() {
                AppStateIOS.removeEventListener("change", this._onAppPaused)
            }
        }, {
            key: "onAppPaused",
            value: function(event) {}
        }]), PauseMenu
    }(React.Component), require("react-addons-pure-render-mixin-debug"));
    React.createClass({
        mixins: [PureRenderMixin],
        render: function() {
            return React.createElement("div", {
                className: this.props.className
            }, "foo")
        }
    }), React.createElement("div", _extends({}, this.props, {
        className: "override"
    }), "…")
});