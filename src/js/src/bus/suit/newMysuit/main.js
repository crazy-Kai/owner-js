"use strict";

define(function (require, exports, module) {

	// 依赖
	var $ = require('$'),
	    React = require('react'),
	    ReactDOM = require('reactDOM'),
	    NewMysuitHead = require('./NewMysuitHead'),
	    NewMysuitNav = require('./NewMysuitNav'),
	    NewMysuitController = require('./NewMysuitController');

	// 业务主类
	var NewMysuit = React.createClass({
		displayName: 'NewMysuit',

		mixins: [NewMysuitController.Reflux.connect(NewMysuitController.Stroe)],

		// 渲染
		render: function render() {
			var me = this,
			    state = me.state,
			    props = me.props;
			return React.createElement(
				'div',
				null,
				React.createElement(NewMysuitHead, { iframeName: 'newMysuitIframe' }),
				React.createElement(
					'div',
					{ className: 'sc-bodyer sc-FoSiEm12 sc-Co666', ref: 'body' },
					React.createElement(NewMysuitNav, { iframeName: 'newMysuitIframe' }),
					React.createElement(
						'div',
						{ className: 'sc-content' },
						React.createElement('iframe', { src: state.firstNav, frameBorder: '0', width: '100%', height: '100%', name: 'newMysuitIframe' })
					)
				)
			);
		},
		// 挂载
		componentDidMount: function componentDidMount() {
			var me = this;
			// IE8下设置高度
			if (document.documentMode === 8) {
				$(me.refs.body).height(document.documentElement.clientHeight - 62);
			};
		}
	});

	var suitContent = $('#suit-content');

	// 置入文档
	ReactDOM.render(React.createElement(NewMysuit, null), suitContent[0]);
});