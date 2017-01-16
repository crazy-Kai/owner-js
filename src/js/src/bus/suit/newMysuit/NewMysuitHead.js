"use strict";

define(function (require, exports, module) {

	// 依赖
	var React = require('react'),
	    ReactDOM = require('reactDOM'),
	    NewMysuitController = require('./NewMysuitController');

	// 业务主类
	var NewMysuitHead = React.createClass({
		displayName: 'NewMysuitHead',

		mixins: [NewMysuitController.Reflux.connect(NewMysuitController.Stroe)],
		// 初始化状态
		getInitialState: function getInitialState() {
			var me = this,
			    state = {};
			state['showMore'] = false;
			return state;
		},
		// 人名鼠标进入事件
		mouseEnterHandle: function mouseEnterHandle() {
			var me = this;
			me.setState({ showMore: true });
		},
		// 人名鼠标出去事件
		mouseLeaveHandle: function mouseLeaveHandle() {
			var me = this;
			me.setState({ showMore: false });
		},
		render: function render() {
			var me = this,
			    props = me.props,
			    state = me.state;
			return React.createElement(
				'div',
				{ className: 'sc-header sc-FoSiEm12 sc-Co666' },
				React.createElement('div', { className: 'ch-logo sc-left' }),
				React.createElement(
					'div',
					{ className: 'ch-title sc-MaTo20 sc-left' },
					state.head.title
				),
				React.createElement(
					'div',
					{ className: 'ch-person sc-MaRi20 sc-MaTo20 sc-right' },
					React.createElement(
						'a',
						{ href: state.indexLink, className: 'sc-link-white' },
						'网上法庭首页'
					),
					React.createElement(
						'span',
						{ className: 'sc-CoFFF sc-MaLe20 sc-MaRi20' },
						'|'
					),
					React.createElement(
						'a',
						{ href: 'javascript:;', onMouseEnter: me.mouseEnterHandle, className: 'sc-link-white' },
						state.head.person,
						React.createElement('i', { className: 'ch-icon' })
					),
					React.createElement(
						'ul',
						{ className: 'ch-list' + (state.showMore ? '' : ' sc-hide'), onMouseEnter: me.mouseEnterHandle, onMouseLeave: me.mouseLeaveHandle },
						React.createElement(
							'li',
							null,
							state.head.person,
							React.createElement('i', { className: 'ch-icon' })
						),
						state.head.personCenterUrl && React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{
									href: state.head.personCenterUrl,
									onClick: NewMysuitController.Actions.targetNav,
									target: state.iframeName,
									'data-key': state.head.personCenterKey,
									className: 'sc-link-lightblack' },
								'个人资料'
							)
						),
						React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ href: 'javascript:;', className: 'sc-link-lightblack', onClick: NewMysuitController.Actions.loginOut },
								'退出系统'
							)
						)
					)
				)
			);
		}
	});

	// 接口
	module.exports = NewMysuitHead;
});